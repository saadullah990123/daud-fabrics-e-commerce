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
  title: "Women's Collection — Luxury Embroidered Lawn 3-Piece & Silk Jacquard | Daud Fabrics",
  description: "Shop Pakistani luxury embroidered lawn 3-piece suits with pure chiffon dupattas, Swiss voile, handcrafted Chikan Kari, and festive organza formal wear.",
};

export default async function WomenCategoryPage() {
  await ensureDatabaseSeeded();

  const womenProducts = await db
    .select()
    .from(products)
    .where(eq(products.category, "women"))
    .orderBy(desc(products.createdAt));

  const formatted: ProductItem[] = womenProducts.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
    } catch {
      imgs = [p.images || "/images/hero-banner.jpg"];
    }
    return {
      ...p,
      category: "women",
      images: imgs,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <CollectionPageView
          title="Women's Luxury Collection"
          subtitle="Designer Pakistani unstitched 3-piece suits, digital printed Swiss lawn, pure silk jacquard, and hand-embellished festive organza ensembles."
          category="women"
          initialProducts={formatted}
          subcategories={["3-Piece Lawn", "Silk Jacquard", "Chikan Kari", "Organza Formal", "Swiss Voile"]}
        />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
