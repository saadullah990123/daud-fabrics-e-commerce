import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq, ilike, or, and } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabaseSeeded();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const paymentStatus = searchParams.get("paymentStatus");
    const orderStatus = searchParams.get("orderStatus");

    const conditions = [];

    if (paymentStatus && paymentStatus !== "all") {
      conditions.push(eq(orders.paymentStatus, paymentStatus));
    }

    if (orderStatus && orderStatus !== "all") {
      conditions.push(eq(orders.orderStatus, orderStatus));
    }

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(orders.customerName, term),
          ilike(orders.customerPhone, term),
          ilike(orders.orderNumber, term),
          ilike(orders.city, term)
        )!
      );
    }

    let query = db.select().from(orders).orderBy(desc(orders.createdAt));

    if (conditions.length > 0) {
      query = db
        .select()
        .from(orders)
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt)) as typeof query;
    }

    const orderRecords = await query;

    const formatted = orderRecords.map((o) => {
      let itemsList = [];
      try {
        itemsList = typeof o.items === "string" ? JSON.parse(o.items) : o.items || [];
      } catch {
        itemsList = [];
      }

      return {
        ...o,
        items: itemsList,
      };
    });

    return NextResponse.json({ success: true, orders: formatted });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
