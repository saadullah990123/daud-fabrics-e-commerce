"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Lock, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#FDFBF7] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#B8862B] rotate-45"></span>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  DAUD FABRICS
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8862B] font-semibold pl-5">
                Pakistan&apos;s Premium Fabric Store
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Daud Fabrics is Pakistan&apos;s premier destination for genuine Egyptian Cotton Latha, traditional Boski silk, premium Wash &amp; Wear, and handcrafted luxury lawn suits. Delivering nationwide with pride.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-stone-400">Accepted Payments:</span>
              <span className="bg-stone-800 text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700">
                Cash on Delivery
              </span>
              <span className="bg-stone-800 text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700">
                EasyPaisa
              </span>
              <span className="bg-stone-800 text-stone-300 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700">
                Meezan Bank
              </span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/men" className="hover:text-[#B8862B] transition-colors">
                  Men&apos;s Unstitched Latha
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-[#B8862B] transition-colors">
                  Pure Boski Silk Suits
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-[#B8862B] transition-colors">
                  Executive Wash &amp; Wear
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#B8862B] transition-colors">
                  Women&apos;s Luxury Lawn 3-Piece
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#B8862B] transition-colors">
                  Silk Jacquard &amp; Chiffon
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-[#B8862B] transition-colors">
                  Kids&apos; Festive Kurtas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/track-order" className="hover:text-[#B8862B] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-[#B8862B] transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-[#B8862B] transition-colors">
                  7-Day Return &amp; Exchange
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B8862B] transition-colors">
                  Contact &amp; Store Location
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-[#B8862B] transition-colors">
                  Privacy Policy &amp; Terms
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-stone-500 hover:text-[#B8862B] transition-colors">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Info & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-white border-b border-stone-800 pb-2">
              Store Contact
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B8862B] shrink-0 mt-0.5" />
                <span>Shop # 14-18, Daud Fabrics Arcade, Main Liberty Market, Gulberg III, Lahore</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B8862B] shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B8862B] shrink-0" />
                <span>sales@daudfabrics.pk</span>
              </li>
              <li className="pt-1 text-[11px] text-stone-500">
                Operating Hours: Mon - Sat (11:00 AM - 10:00 PM PKT)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Daud Fabrics Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Nationwide Courier: TCS &bull; Trax &bull; Leopards</span>
            <Link href="/admin/login" className="hover:text-[#B8862B] transition-colors">
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
