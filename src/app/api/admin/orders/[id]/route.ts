import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    let itemsList = [];
    try {
      itemsList = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
    } catch {
      itemsList = [];
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: itemsList,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const { paymentStatus, orderStatus, trackingNumber, courierName } = body;

    const [existing] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(orders)
      .set({
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existing.paymentStatus,
        orderStatus: orderStatus !== undefined ? orderStatus : existing.orderStatus,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : existing.trackingNumber,
        courierName: courierName !== undefined ? courierName : existing.courierName,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    let itemsList = [];
    try {
      itemsList = typeof updated.items === "string" ? JSON.parse(updated.items) : updated.items || [];
    } catch {
      itemsList = [];
    }

    return NextResponse.json({
      success: true,
      order: {
        ...updated,
        items: itemsList,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
