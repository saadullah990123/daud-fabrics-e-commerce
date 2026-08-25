import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const { id } = await params;

    const isNumeric = /^\d+$/.test(id);
    let condition;
    if (isNumeric) {
      condition = or(eq(orders.id, parseInt(id, 10)), eq(orders.orderNumber, id));
    } else {
      condition = eq(orders.orderNumber, id);
    }

    const [order] = await db.select().from(orders).where(condition).limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
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
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
