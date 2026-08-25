import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { and, desc, asc, eq, ilike, or } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const limitParam = searchParams.get("limit");

    const conditions = [eq(products.isActive, true)];

    if (category && category !== "all") {
      conditions.push(eq(products.category, category.toLowerCase()));
    }

    if (featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    if (bestseller === "true") {
      conditions.push(eq(products.isBestseller, true));
    }

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(products.name, term),
          ilike(products.description, term),
          ilike(products.subcategory, term)
        )!
      );
    }

    let orderByClause;
    if (sort === "price_asc") {
      orderByClause = asc(products.price);
    } else if (sort === "price_desc") {
      orderByClause = desc(products.price);
    } else if (sort === "name") {
      orderByClause = asc(products.name);
    } else {
      orderByClause = desc(products.createdAt);
    }

    let query = db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderByClause);

    if (limitParam) {
      const limitVal = parseInt(limitParam, 10);
      if (!isNaN(limitVal) && limitVal > 0) {
        query = query.limit(limitVal) as typeof query;
      }
    }

    const items = await query;

    const formatted = items.map((p) => {
      let imagesArray: string[] = [];
      try {
        imagesArray = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
      } catch {
        imagesArray = [p.images || "/images/hero-banner.jpg"];
      }

      return {
        ...p,
        images: imagesArray,
      };
    });

    return NextResponse.json({ success: true, products: formatted });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
