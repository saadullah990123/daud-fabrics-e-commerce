"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CategoryCards() {
  const categories = [
    {
      title: "Men's Collection",
      subtitle: "Kashmiri Wool Shawls, Pure Boski Silk & Egyptian Latha",
      href: "/men",
      image: "/images/men/shawl1.jpg",
      tag: "Regal & Traditional",
      badge: "Pure Wool & Latha",
    },
    {
      title: "Women's Collection",
      subtitle: "Luxury Embroidered Swiss Lawn 3-Piece, Chiffon & Velvet",
      href: "/women",
      image: "/images/women/new1.jpg",
      tag: "Festive & Summer '25",
      badge: "Designer 3-Piece",
    },
    {
      title: "Kids' Collection",
      subtitle: "Hypoallergenic Pure Baby Cotton Kurta Fabrics & Festive Sets",
      href: "/kids",
      image: "/images/women/image10.jpg",
      tag: "Soft Baby Cotton",
      badge: "Festive Wear",
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FAF9F5] border-b border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-[#B8862B] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Crafted Categories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111827]">
            Curated Fabric Collections
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Handpicked natural yarns, authentic weaving, and luxury eastern silhouettes for every milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-96 sm:h-[440px] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6 border border-[#E2DDD3] bg-stone-100"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                loading="lazy"
              />
              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

              {/* Badge */}
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#111827] text-xs font-bold px-3.5 py-1 rounded-full shadow-xs border border-[#E2DDD3]">
                {cat.badge}
              </span>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold text-amber-300 tracking-wider uppercase">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
