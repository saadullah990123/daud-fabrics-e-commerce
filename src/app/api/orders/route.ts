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

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    );

    // Free shipping if >= Rs 3000
    const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;

    // Generate unique order number (e.g. DF-59124)
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
        items: JSON.stringify(items),
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
    for (const item of items) {
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
