"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { formatPKR } from "@/lib/format";

export function AddedToCartToast() {
  const { showToast, setShowToast, lastAddedItem, setIsCartOpen } = useCart();

  if (!showToast || !lastAddedItem) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-[#B8862B]/30 p-4 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Added to Bag!</span>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label="Close toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
          <img
            src={lastAddedItem.image || "/images/hero-banner.jpg"}
            alt={lastAddedItem.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{lastAddedItem.name}</p>
          <p className="text-xs text-gray-500 capitalize">{lastAddedItem.category} &bull; Qty: {lastAddedItem.quantity}</p>
          <p className="text-xs font-bold text-[#B8862B]">{formatPKR(lastAddedItem.effectivePrice)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => {
            setShowToast(false);
            setIsCartOpen(true);
          }}
          className="flex-1 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-medium py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          View Bag
        </button>
        <Link
          href="/checkout"
          onClick={() => setShowToast(false)}
          className="flex-1 bg-[#B8862B] hover:bg-[#9E7422] text-white text-xs font-semibold py-2 rounded-lg text-center transition-colors"
        >
          Checkout Now
        </Link>
      </div>
    </div>
  );
}
