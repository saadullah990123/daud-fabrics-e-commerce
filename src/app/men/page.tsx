import React from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AddedToCartToast } from "@/components/added-toast";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CollectionPageView } from "@/components/collection-page-view";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";
import { ProductItem } from "@/lib/types";

export const revalidate = 0;

export const metadata = {
  title: "Men's Collection — Egyptian Cotton Latha, Boski & Wash & Wear | Daud Fabrics",
  description: "Explore unstitched premium men's fabrics including Egyptian Giza Cotton Latha, Superfine Boski Silk, Karandi, and Wrinkle-Free Wash and Wear suits.",
};

export default async function MenCategoryPage() {
  await ensureDatabaseSeeded();

  const menProducts = await db
    .select()
    .from(products)
    .where(eq(products.category, "men"))
    .orderBy(desc(products.createdAt));

  const formatted: ProductItem[] = menProducts.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
    } catch {
      imgs = [p.images || "/images/hero-banner.jpg"];
    }
    return {
      ...p,
      category: "men",
      images: imgs,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <CollectionPageView
          title="Men's Fabric Collection"
          subtitle="Pakistan's finest unstitched suits. Pure Egyptian Cotton Latha, timeless Boski silk, all-season Wash & Wear, and handloom Karandi."
          category="men"
          initialProducts={formatted}
          subcategories={["Unstitched Cotton", "Pure Boski", "Wash & Wear", "Karandi", "Kurta Fabric"]}
        />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
