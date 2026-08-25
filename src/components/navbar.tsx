"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { SearchModal } from "./search-modal";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Phone,
  Truck,
  Heart,
  ChevronRight,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
    { name: "All Fabrics", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-700 hover:text-black hover:bg-stone-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="group flex flex-col items-center sm:items-start text-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#B8862B] rotate-45 transition-transform group-hover:rotate-90 duration-300"></span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#B8862B] transition-colors">
                    DAUD FABRICS
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B8862B] font-semibold pl-5">
                  Est. Pakistan &bull; Luxury Textiles
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive(link.href)
                      ? "text-[#B8862B] font-semibold"
                      : "text-neutral-700 hover:text-[#B8862B]"
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8862B] rounded-full animate-in fade-in" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Header Right Actions (Search & Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-gray-700 hover:text-[#B8862B] hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-sm"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
                <span className="hidden md:inline text-xs text-neutral-500">Search</span>
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-[#1A1A1A] text-white hover:bg-[#B8862B] transition-all flex items-center justify-center shadow-xs"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#B8862B] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FDFBF7] shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
            {/* Mobile Drawer Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-[#1A1A1A]">
                  DAUD FABRICS
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#B8862B]">
                  Luxury Textiles
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#B8862B]/10 text-[#B8862B] font-bold"
                      : "text-gray-800 hover:bg-stone-100"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}

              <div className="pt-6 border-t border-stone-200 mt-6 space-y-3">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-stone-100"
                >
                  <Truck className="w-4 h-4 text-[#B8862B]" />
                  <span>Track Your Order</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-stone-100"
                >
                  <Phone className="w-4 h-4 text-[#B8862B]" />
                  <span>Helpline: 0300-1234567</span>
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 text-center">
              <p className="text-xs text-stone-500">
                🇵🇰 Handcrafted &amp; Curated in Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
