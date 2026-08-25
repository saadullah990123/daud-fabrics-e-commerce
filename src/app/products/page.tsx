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
  title: "All Fabrics & Suits — Men, Women & Kids | Daud Fabrics",
  description: "Browse the complete collection of authentic Pakistani unstitched and stitched fabrics from Daud Fabrics.",
};

export default async function AllProductsPage() {
  await ensureDatabaseSeeded();

  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  const formatted: ProductItem[] = allProducts.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
    } catch {
      imgs = [p.images || "/images/hero-banner.jpg"];
    }
    return {
      ...p,
      category: p.category as "men" | "women" | "kids",
      images: imgs,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <CollectionPageView
          title="Complete Fabric Archive"
          subtitle="Explore our entire collection of Egyptian cotton, Boski silk, Wash & Wear, luxury lawn 3-piece sets, and kids festive wear."
          category="all"
          initialProducts={formatted}
        />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
