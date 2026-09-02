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
import { ArrowRight, Sparkles, Award, ShieldCheck, CheckCircle2, MessageCircle, Layers } from "lucide-react";
import { ProductItem } from "@/lib/types";

export const revalidate = 0; // Always fresh content

export default async function HomePage() {
  await ensureDatabaseSeeded();

  // Fetch all active products
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
      imgs = [p.images || "/images/store-bg.jpg"];
    }
    return {
      ...p,
      category: p.category as "men" | "women" | "kids",
      images: imgs,
    };
  });

  const womenProducts = formattedProducts.filter((p) => p.category === "women").slice(0, 8);
  const menProducts = formattedProducts.filter((p) => p.category === "men").slice(0, 8);
  const bestSellers = formattedProducts.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = formattedProducts.slice(0, 8);

  const brandPartners = [
    { name: "Gul Ahmed", logo: "/images/brands/brand1.jpg" },
    { name: "Sapphire", logo: "/images/brands/brand2.jpg" },
    { name: "Alkaram Studio", logo: "/images/brands/brand3.jpg" },
    { name: "Sana Safinaz", logo: "/images/brands/brand4.jpg" },
    { name: "Daud Exclusive", logo: "/images/brands/brand5.jpg" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Feature Icons Strip */}
        <FeatureStrip />

        {/* 3. Category Visual Cards */}
        <CategoryCards />

        {/* 4. Women's Festive Lawn & Silk Showcase */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summer &amp; Festive &apos;25 Spotlight</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111827]">
                Women&apos;s Luxury Lawn &amp; Silk
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-xl">
                High-thread digital Swiss lawn, pure chiffon dupattas, and handcrafted Chikan Kari unstitched suites.
              </p>
            </div>
            <Link
              href="/women"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#B8862B] hover:text-[#9E7422] transition-colors group"
            >
              <span>View All Women&apos;s ({formattedProducts.filter(p => p.category === 'women').length} Suits)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {womenProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. Men's Royal Winter & Heritage Collection */}
        <section className="py-14 sm:py-20 bg-[#F4F1EA] border-y border-[#EBE7DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B8862B] mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Gentlemen&apos;s Heritage</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111827]">
                  Men&apos;s Shawls &amp; Pure Cotton Latha
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-xl">
                  Handcrafted Kashmiri embroidered shawls, Egyptian combed Giza cotton, and pure liquid-fall Boski silk.
                </p>
              </div>
              <Link
                href="/men"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#B8862B] hover:text-[#9E7422] transition-colors group"
              >
                <span>View All Men&apos;s ({formattedProducts.filter(p => p.category === 'men').length} Items)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {menProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 6. Brand Fabric Craft & Purity Showcase */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card rounded-3xl p-8 sm:p-12 border border-[#E5DFD3] bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#B8862B]/10 px-3.5 py-1 rounded-full text-xs font-bold text-[#9E7422] uppercase">
                  <ShieldCheck className="w-4 h-4 text-[#B8862B]" />
                  <span>Uncompromised Purity Standards</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827] leading-tight">
                  The Daud Fabrics Guarantee: Zero Impurities, Authentic Yardage
                </h2>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  Every suit and shawl at Daud Fabrics is selected from Pakistan&apos;s oldest textile hubs in Lahore, Faisalabad, Multan, and Kashmir. We strictly test thread counts, color retention after multiple washes, and shrinkage stability before offering any fabric.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-[#EBE7DF] bg-[#FAF9F5] p-4 rounded-2xl">
                    <p className="font-serif font-bold text-lg text-[#B8862B]">
                      100% Original
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Direct mill sourcing with zero synthetic mixing
                    </p>
                  </div>
                  <div className="border border-[#EBE7DF] bg-[#FAF9F5] p-4 rounded-2xl">
                    <p className="font-serif font-bold text-lg text-[#B8862B]">
                      Generous Cutting
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      4.5m Men Latha &bull; 7.5m Boski &bull; 3.0m Shirt Cuts
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#B8862B] text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <span>Browse All Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://wa.me/923275363509?text=Assalam-o-Alaikum%2C%20I%20want%20to%20inquire%20about%20fabric%20purity%20and%20custom%20cutting."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-sm px-5 py-3.5 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </div>

              {/* Craftsmanship Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E5DFD3] group">
                <img
                  src="/images/craftsmanship.jpg"
                  alt="Daud Fabrics Craftsmanship & Weaving"
                  className="w-full h-80 sm:h-[420px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900 font-serif">Master Weavers of Pakistan</p>
                    <p className="text-[11px] text-stone-500">Hand-finished borders &amp; organic cotton dyes</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">
                    Verified Origin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Brand Partners Strip */}
        <section className="py-10 bg-white border-y border-[#EBE7DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-6">
              Authorized Stockist &amp; Premium Fabric Partners
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center justify-center">
              {brandPartners.map((brand, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#F0ECE1] bg-[#FAF9F5] hover:border-[#D4AF37]/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-200 shadow-2xs mb-2 bg-white">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-800 font-serif text-center">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Best Sellers Grid */}
        {bestSellers.length > 0 && (
          <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8862B]">
                  Most Loved Fabrics
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111827] mt-1">
                  Customer Best Sellers
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  Top-rated unstitched suits and luxury shawls with the highest repeat customer orders.
                </p>
              </div>
              <Link
                href="/products"
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#B8862B] hover:text-[#9E7422] transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* 9. Customer Testimonials & Reviews */}
        <CustomerReviews />

        {/* 10. WhatsApp VIP & Newsletter Club */}
        <section className="py-14 bg-white border-t border-[#EBE7DF]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#B8862B]">
              Join the Daud Fabrics VIP Circle
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Get Early Access to Eid &amp; Festive Drops
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
              Receive instant catalog updates on WhatsApp or via SMS before high-demand fabrics sell out.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href="https://wa.me/923275363509?text=Assalam-o-Alaikum%2C%20please%20add%20me%20to%20the%20Daud%20Fabrics%20VIP%20Broadcast%20Club."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join VIP WhatsApp Broadcast</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
      <AddedToCartToast />
      <WhatsAppButton />
    </div>
  );
}
