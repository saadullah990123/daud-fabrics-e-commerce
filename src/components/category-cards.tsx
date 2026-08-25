"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryCards() {
  const categories = [
    {
      title: "Men's Collection",
      subtitle: "Egyptian Cotton Latha, Boski & Wash-and-Wear",
      href: "/men",
      image: "https://images.pexels.com/photos/8565662/pexels-photo-8565662.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      tag: "Best for Festive & Jummah",
      badge: "Pure Cotton & Boski",
    },
    {
      title: "Women's Collection",
      subtitle: "Luxury Embroidered Lawn 3-Piece, Jacquard Silk & Chiffon",
      href: "/women",
      image: "https://images.pexels.com/photos/36567522/pexels-photo-36567522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      tag: "Summer & Festive '25",
      badge: "Signature Lawn",
    },
    {
      title: "Kids' Collection",
      subtitle: "Breathable Pure Cotton Kurtas & Festive Ensembles",
      href: "/kids",
      image: "https://images.pexels.com/photos/17015449/pexels-photo-17015449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      tag: "Soft Baby Cotton",
      badge: "Festive Wear",
    },
  ];

  return (
    <section className="py-14 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B8862B]">
            Curated Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Explore Daud Fabrics
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Handpicked natural yarns, premium weaving, and authentic Pakistani craftsmanship for every occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-96 sm:h-[420px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 border border-stone-200"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

              {/* Badge */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-stone-200">
                {cat.badge}
              </span>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-semibold text-[#F1C40F] tracking-wide uppercase">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#B8862B] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-white group-hover:text-[#B8862B] transition-colors">
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
