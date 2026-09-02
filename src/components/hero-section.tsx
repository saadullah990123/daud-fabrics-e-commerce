"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] text-stone-900 min-h-[560px] lg:min-h-[620px] flex items-center border-b border-[#EBE7DF]">
      {/* Background Graphic & Light Ambient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-right lg:bg-center opacity-30 mix-blend-multiply"
        style={{ backgroundImage: "url('/images/store-bg.jpg')" }}
      />
      
      {/* Subtle Light Luxury Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#B8862B]/10 border border-[#B8862B]/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#9E7422] uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8862B]" />
            <span>Festive &amp; Luxury Lawn 2025 Edition Live</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] leading-[1.12]">
            Timeless Elegance in <br />
            <span className="text-[#B8862B] italic font-normal">Authentic</span> Pakistani Fabrics
          </h1>

          {/* Subtext */}
          <p className="text-stone-600 text-base sm:text-lg font-normal leading-relaxed max-w-xl">
            Discover unmatched fabric purity — from pristine Egyptian Cotton Latha and handloom Pashmina Shawls for Men, to intricately embroidered Swiss Lawn &amp; Silk 3-Piece suites for Women.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/products"
              className="bg-[#111827] hover:bg-[#B8862B] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore All Fabrics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/women"
              className="bg-white hover:bg-[#FAF6ED] text-[#B8862B] border border-[#D4AF37]/60 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-xs"
            >
              Women&apos;s Lawn &amp; Silk
            </Link>

            <Link
              href="/men"
              className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all shadow-xs"
            >
              Men&apos;s Shawls &amp; Latha
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-600 border-t border-[#E8E4DA]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B8862B]" />
              <span className="font-medium">100% Original Fabric Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B8862B]" />
              <span className="font-medium">Cash on Delivery Across Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}