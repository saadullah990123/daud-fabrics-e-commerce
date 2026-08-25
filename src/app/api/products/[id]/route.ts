import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
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
      condition = or(eq(products.id, parseInt(id, 10)), eq(products.slug, id));
    } else {
      condition = eq(products.slug, id);
    }

    const [product] = await db.select().from(products).where(condition).limit(1);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let imagesArray: string[] = [];
    try {
      imagesArray = typeof product.images === "string" ? JSON.parse(product.images) : product.images || [];
    } catch {
      imagesArray = [product.images || "/images/hero-banner.jpg"];
    }

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        images: imagesArray,
      },
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
