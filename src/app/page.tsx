import React from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureStrip } from "@/components/feature-strip";
import { CategoryCards } from "@/components/category-cards";
import { ProductCard } from "@/components/product-card";
import { CustomerReviews } from "@/components/customer-reviews";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { AddedToCartToast } from "@/components/added-toast";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";
import { ArrowRight, Sparkles, Award, ShieldCheck, Truck } from "lucide-react";
import { ProductItem } from "@/lib/types";

export const revalidate = 0; // Fresh content

export default async function HomePage() {
  await ensureDatabaseSeeded();

  // Fetch New Arrivals & Best Sellers
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt));

  const formattedProducts: ProductItem[] = allProducts.map((p) => {
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

  const newArrivals = formattedProducts.slice(0, 8);
  const bestSellers = formattedProducts.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Icons Strip */}
        <FeatureStrip />

        {/* Category Visual Cards */}
        <CategoryCards />

        {/* New Arrivals Section */}
        <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fresh Off The Loom</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900">
                New Arrivals
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">
                Discover our latest unstitched fabric cuts and seasonal textures for Men, Women &amp; Kids.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8862B] hover:text-[#9E7422] transition-colors group"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Brand Banner / Fabric Craft Spotlight */}
        <section className="py-16 bg-[#1A1A1A] text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#B8862B]">
                  Unmatched Purity &amp; Weave
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  The Daud Fabrics Guarantee: Zero Impurities, True Yardage
                </h2>
                <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                  Every suit from Daud Fabrics is crafted using long-staple natural combed yarns. Whether you purchase our prestigious Egyptian Cotton Latha, traditional Boski silk, or 3-Piece digital Swiss lawn, you are guaranteed guaranteed color-fastness, pre-shrunk refinement, and generous cutting.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-stone-800 bg-stone-900/60 p-4 rounded-xl">
                    <p className="font-serif font-bold text-lg sm:text-xl text-[#B8862B]">
                      100% Original
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Direct from Faisalabad &amp; Karachi weaving mills
                    </p>
                  </div>
                  <div className="border border-stone-800 bg-stone-900/60 p-4 rounded-xl">
                    <p className="font-serif font-bold text-lg sm:text-xl text-[#B8862B]">
                      Generous Cuts
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      4.5m Men &bull; 7.5m Boski &bull; 3pc Women
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/men"
                    className="inline-flex items-center gap-2 bg-[#B8862B] hover:bg-[#9E7422] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md"
                  >
                    <span>Shop Men&apos;s Premium Latha</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
                <img
                  src="/images/craftsmanship.jpg"
                  alt="Daud Fabrics Craftsmanship"
                  className="w-full h-96 lg:h-[440px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        {bestSellers.length > 0 && (
          <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8862B]">
                  Most Wanted
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-gray-900 mt-1">
                  Customer Best Sellers
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Pakistan&apos;s most loved unstitched suits and luxury lawn pieces.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B8862B] hover:text-[#9E7422] transition-colors"
              >
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Customer Testimonials / Reviews */}
        <CustomerReviews />
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
