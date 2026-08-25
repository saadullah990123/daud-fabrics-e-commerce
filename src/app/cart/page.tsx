"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR } from "@/lib/format";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
  } = useCart();

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Your Shopping Bag
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Review your selected fabrics and proceed to secure checkout across Pakistan.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#B8862B]">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-stone-500 mb-8">
              Looks like you haven&apos;t added any fabrics yet. Explore our latest Men&apos;s, Women&apos;s, and Kids&apos; collections.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/men"
                className="bg-[#1A1A1A] hover:bg-[#B8862B] text-white text-xs font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Men&apos;s Collection
              </Link>
              <Link
                href="/women"
                className="bg-[#B8862B] hover:bg-[#9E7422] text-white text-xs font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Women&apos;s Lawn
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Items Table (Left 8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Meter Banner */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-amber-950 mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B8862B]" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">
                        🎉 Congratulations! You have unlocked FREE Shipping nationwide.
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#B8862B] font-bold">{formatPKR(amountNeededForFreeShipping)}</strong> more to get <strong>FREE Delivery</strong> across Pakistan!
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-stone-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#B8862B] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-stone-900 text-lg">
                    Fabric Items ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <div key={item.productId} className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                      {/* Image & Info */}
                      <div className="flex gap-4 items-center min-w-0">
                        <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-stone-100 rounded-2xl overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={item.image || "/images/hero-banner.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8862B]">
                            {item.category} {item.subcategory ? `• ${item.subcategory}` : ""}
                          </span>
                          <Link
                            href={`/products/${item.slug || item.productId}`}
                            className="block font-serif font-bold text-stone-900 text-sm sm:text-base hover:text-[#B8862B] transition-colors truncate max-w-xs"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-stone-500 mt-1">
                            Unit Price: <span className="font-semibold text-stone-800">{formatPKR(item.effectivePrice)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-200 transition-colors rounded-l-xl"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2.5 py-1.5 text-stone-600 hover:bg-stone-200 transition-colors rounded-r-xl"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-right min-w-[90px]">
                          <p className="text-base font-bold text-stone-900">
                            {formatPKR(item.effectivePrice * item.quantity)}
                          </p>
                          {item.price > item.effectivePrice && (
                            <p className="text-xs text-stone-400 line-through">
                              {formatPKR(item.price * item.quantity)}
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-stone-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="flex items-center justify-between">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-[#B8862B] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Browsing Fabrics</span>
                </Link>
              </div>
            </div>

            {/* Order Summary & Checkout Box (Right 4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
              <h2 className="font-serif font-bold text-xl text-stone-900 pb-4 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-stone-900 block">Total Amount</span>
                    <span className="text-[11px] text-stone-400">PKR &bull; Incl. all taxes</span>
                  </div>
                  <span className="text-2xl font-bold text-[#B8862B] font-serif">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8862B]" />
                  <span>Pay via Cash on Delivery, EasyPaisa or Meezan Bank</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B8862B]" />
                  <span>24-48 Hours Express Delivery to Lahore, Karachi, Islamabad</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#B8862B]" />
                  <span>7-Day Hassle-Free Exchange Policy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
