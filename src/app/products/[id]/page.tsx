import React from "react";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AddedToCartToast } from "@/components/added-toast";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductDetailView } from "@/components/product-detail-view";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, or, and, ne } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";
import { ProductItem } from "@/lib/types";

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await ensureDatabaseSeeded();
  const { id } = await params;

  const isNumeric = /^\d+$/.test(id);
  const condition = isNumeric
    ? or(eq(products.id, parseInt(id, 10)), eq(products.slug, id))
    : eq(products.slug, id);

  const [foundProduct] = await db.select().from(products).where(condition).limit(1);

  if (!foundProduct) {
    notFound();
  }

  let imgs: string[] = [];
  try {
    imgs = typeof foundProduct.images === "string" ? JSON.parse(foundProduct.images) : foundProduct.images || [];
  } catch {
    imgs = [foundProduct.images || "/images/hero-banner.jpg"];
  }

  const formattedProduct: ProductItem = {
    ...foundProduct,
    category: foundProduct.category as "men" | "women" | "kids",
    images: imgs,
  };

  // Fetch related products from same category
  const relatedList = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, foundProduct.category),
        eq(products.isActive, true),
        ne(products.id, foundProduct.id)
      )
    )
    .limit(4);

  const formattedRelated: ProductItem[] = relatedList.map((p) => {
    let rImgs: string[] = [];
    try {
      rImgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
    } catch {
      rImgs = [p.images || "/images/hero-banner.jpg"];
    }
    return {
      ...p,
      category: p.category as "men" | "women" | "kids",
      images: rImgs,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <ProductDetailView
          product={formattedProduct}
          relatedProducts={formattedRelated}
        />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
