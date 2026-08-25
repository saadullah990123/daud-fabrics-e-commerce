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
  title: "Kids' Collection — Breathable Cotton Kurtas & Festive Wear | Daud Fabrics",
  description: "Gentle baby cotton fabrics, vibrant festive kurta fabrics, and comfortable Eastern wear tailored for young boys and girls.",
};

export default async function KidsCategoryPage() {
  await ensureDatabaseSeeded();

  const kidsProducts = await db
    .select()
    .from(products)
    .where(eq(products.category, "kids"))
    .orderBy(desc(products.createdAt));

  const formatted: ProductItem[] = kidsProducts.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = typeof p.images === "string" ? JSON.parse(p.images) : p.images || [];
    } catch {
      imgs = [p.images || "/images/hero-banner.jpg"];
    }
    return {
      ...p,
      category: "kids",
      images: imgs,
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        <CollectionPageView
          title="Kids' Traditional Collection"
          subtitle="Hypoallergenic pure cotton, soft unstitched fabrics, and festive embroidered sets designed for children's comfort and festive celebrations."
          category="kids"
          initialProducts={formatted}
          subcategories={["Boys Kurta", "Boys Festive", "Girls Lawn"]}
        />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
