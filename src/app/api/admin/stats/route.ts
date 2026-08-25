import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { count, eq, sql, desc, and } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabaseSeeded();

    // Total orders
    const [{ value: totalOrdersCount }] = await db.select({ value: count() }).from(orders);

    // Total revenue from paid orders (or COD delivered orders)
    const [revenueResult] = await db
      .select({
        totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'Paid' THEN ${orders.totalAmount} ELSE 0 END), 0)`,
        pendingRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${orders.paymentStatus} = 'Pending' THEN ${orders.totalAmount} ELSE 0 END), 0)`,
      })
      .from(orders);

    // Pending payment verification
    const [{ value: pendingPaymentsCount }] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.paymentStatus, "Pending"));

    // Pending order fulfillment
    const [{ value: pendingFulfillmentCount }] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.orderStatus, "Pending"));

    // Shipped count
    const [{ value: shippedCount }] = await db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.orderStatus, "Shipped"));

    // Total products & low stock products (< 5)
    const [{ value: totalProductsCount }] = await db.select({ value: count() }).from(products);
    const [{ value: lowStockCount }] = await db
      .select({ value: count() })
      .from(products)
      .where(and(eq(products.isActive, true), sql`${products.stock} < 5`));

    // Recent 5 orders
    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const formattedRecentOrders = recentOrders.map((o) => {
      let itemsList = [];
      try {
        itemsList = typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
      } catch {
        itemsList = [];
      }
      return { ...o, items: itemsList };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: Number(totalOrdersCount),
        totalRevenue: Number(revenueResult?.totalRevenue || 0),
        pendingRevenue: Number(revenueResult?.pendingRevenue || 0),
        pendingPayments: Number(pendingPaymentsCount),
        pendingFulfillment: Number(pendingFulfillmentCount),
        shippedOrders: Number(shippedCount),
        totalProducts: Number(totalProductsCount),
        lowStockProducts: Number(lowStockCount),
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to load admin stats" }, { status: 500 });
  }
}
