import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

/*
 * NOTE ON PAYMENT GATEWAY INTEGRATION:
 * Pakistani clothing stores of this scale traditionally utilize manual payment confirmation (COD, EasyPaisa, Meezan Bank Transfer)
 * where customers submit payment proof screenshots for admin review.
 * A real-time payment gateway (JazzCash Merchant Gateway, EasyPaisa API, or 1Link/Meezan Bank API)
 * is a separate upgrade that requires the business owner to first register a verified corporate merchant account
 * with the respective bank/provider to obtain live API keys and IPN webhook endpoints.
 */

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      city,
      postalCode,
      orderNotes,
      items,
      paymentMethod,
      paymentScreenshot,
    } = body;

    // Validation
    if (!customerName || !customerPhone || !deliveryAddress || !city) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required customer details (Name, Phone, Address, City)" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your shopping cart is empty" },
        { status: 400 }
      );
    }

    if (!["cod", "easypaisa", "meezan_bank"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: "Invalid payment method selected" },
        { status: 400 }
      );
    }
    if (paymentMethod !== "cod" && !paymentScreenshot) {
  return NextResponse.json(
    { success: false, error: "Please upload payment proof to continue" },
    { status: 400 }
  );
}
// Validate and fetch official prices and stock from the database
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId) {
        return NextResponse.json(
          { success: false, error: "Invalid product item reference" },
          { status: 400 }
        );
      }

      // Fetch official product details from database
      const [dbProduct] = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .limit(1);

      if (!dbProduct) {
        return NextResponse.json(
          { success: false, error: `Product not found in database` },
          { status: 400 }
        );
      }

const requestedQuantity = Number(item.quantity);
if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
  return NextResponse.json(
    { success: false, error: "Invalid item quantity" },
    { status: 400 }
  );
}
      // Check stock availability
      if (dbProduct.stock < requestedQuantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${dbProduct.name}. Only ${dbProduct.stock} left.` },
          { status: 400 }
        );
      }

      // Always use the server-side price from the database, never trust the client
      const officialPrice = Number(dbProduct.price);
      calculatedSubtotal += officialPrice * requestedQuantity;

      validatedItems.push({
        ...item,
        price: officialPrice, // enforce secure price
        name: dbProduct.name,
      });
    }

    const subtotal = calculatedSubtotal;

    // Free shipping if >= Rs 3000
    const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DF-${randomSuffix}`;

    // Insert Order
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        deliveryAddress: deliveryAddress.trim(),
        city: city.trim(),
        postalCode: postalCode ? postalCode.trim() : null,
        orderNotes: orderNotes ? orderNotes.trim() : null,
                items: JSON.stringify(validatedItems),
        subtotal,
        shippingFee,
        discount,
        totalAmount,
        paymentMethod,
        paymentStatus: "Pending",
        orderStatus: "Pending",
        paymentScreenshot: paymentScreenshot || null,
      })
      .returning();

    // Decrement stock for ordered products
  for (const item of validatedItems) {
      if (item.productId) {
        try {
          await db
            .update(products)
            .set({
              stock: sql`GREATEST(0, ${products.stock} - ${Number(item.quantity) || 1})`,
            })
            .where(eq(products.id, item.productId));
        } catch (stockErr) {
          console.warn(`Failed to decrement stock for product ${item.productId}:`, stockErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        city: newOrder.city,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
