import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";
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

    let query = db.select().from(products).orderBy(desc(products.createdAt));

    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      query = db
        .select()
        .from(products)
        .where(
          or(
            ilike(products.name, term),
            ilike(products.description, term),
            ilike(products.subcategory, term)
          )!
        )
        .orderBy(desc(products.createdAt)) as typeof query;
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
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      subcategory,
      price,
      salePrice,
      description,
      details,
      stock,
      images,
      isActive,
      isFeatured,
      isBestseller,
    } = body;

    if (!name || !category || price === undefined || price === null || !description) {
      return NextResponse.json(
        { success: false, error: "Name, category, price, and description are required" },
        { status: 400 }
      );
    }

    // Slugify name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    let imagesData: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      imagesData = images.filter((img) => typeof img === "string" && img.trim() !== "");
    } else if (typeof images === "string" && images.trim() !== "") {
      imagesData = [images.trim()];
    } else {
      imagesData = ["https://images.pexels.com/photos/19191099/pexels-photo-19191099.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"];
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        name: name.trim(),
        slug,
        category: category.toLowerCase(),
        subcategory: subcategory ? subcategory.trim() : null,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        description: description.trim(),
        details: details ? details.trim() : null,
        stock: stock !== undefined && stock !== null ? Number(stock) : 10,
        images: JSON.stringify(imagesData),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
      })
      .returning();

    return NextResponse.json({
      success: true,
      product: {
        ...newProduct,
        images: imagesData,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
