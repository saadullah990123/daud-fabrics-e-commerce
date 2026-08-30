"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/images/store-bg.jpg')" }}
      >
        {/* Fallback & Image Tag */}
        <img
          src="/images/store-bg.jpg"
          alt="Daud Fabrics Clothing Store"
          className="w-full h-full object-cover object-center opacity-75"
        />
        {/* Balanced Dark Gradient - Keeps text 100% crisp on left while showing clothing boutique on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#B8862B]/20 border border-[#B8862B]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#F1C40F] uppercase backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8862B]" />
            <span>Festive &amp; Summer &apos;25 Collection Live</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Timeless Elegance in <br />
            <span className="text-[#B8862B] italic">Authentic</span> Pakistani Fabrics
          </h1>

          {/* Subtext */}
          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed max-w-xl">
            From regal Egyptian Cotton Latha and classic Boski silk for Men, to intricately embroidered 3-Piece Lawn &amp; Jacquard for Women. Meticulously sourced from Pakistan&apos;s master textile artisans.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/products"
              className="bg-[#B8862B] hover:bg-[#9E7422] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/men"
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all backdrop-blur-xs border border-white/20 hover:border-white/40"
            >
              Men&apos;s Unstitched
            </Link>

            <Link
              href="/women"
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all backdrop-blur-xs border border-white/20 hover:border-white/40"
            >
              Women&apos;s Lawn &amp; Silk
            </Link>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex items-center gap-6 text-xs text-stone-300 border-t border-stone-800">
            <div className="flex items-center gap-2">
              <span className="text-[#B8862B] font-bold">✓</span>
              <span>100% Original Fabric Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#B8862B] font-bold">✓</span>
              <span>Cash on Delivery Nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}