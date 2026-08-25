import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
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

    const [existing] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    let imagesData = existing.images;
    if (images !== undefined) {
      if (Array.isArray(images)) {
        imagesData = JSON.stringify(images.filter((img) => typeof img === "string" && img.trim() !== ""));
      } else if (typeof images === "string") {
        imagesData = JSON.stringify([images]);
      }
    }

    const [updated] = await db
      .update(products)
      .set({
        name: name !== undefined ? name.trim() : existing.name,
        category: category !== undefined ? category.toLowerCase() : existing.category,
        subcategory: subcategory !== undefined ? (subcategory ? subcategory.trim() : null) : existing.subcategory,
        price: price !== undefined ? Number(price) : existing.price,
        salePrice: salePrice !== undefined ? (salePrice ? Number(salePrice) : null) : existing.salePrice,
        description: description !== undefined ? description.trim() : existing.description,
        details: details !== undefined ? (details ? details.trim() : null) : existing.details,
        stock: stock !== undefined ? Number(stock) : existing.stock,
        images: imagesData,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : existing.isBestseller,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(updated.images);
    } catch {
      parsedImages = [updated.images];
    }

    return NextResponse.json({
      success: true,
      product: {
        ...updated,
        images: parsedImages,
      },
    });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
