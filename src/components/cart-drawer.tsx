"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/lib/format";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Sparkles } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#FDFBF7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B8862B]" />
              <h2 className="font-serif font-bold text-lg text-gray-900 tracking-wide">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="p-4 bg-amber-50/70 border-b border-amber-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Truck className="w-4 h-4 text-[#B8862B]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">🎉 You unlocked FREE Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#B8862B]">{formatPKR(amountNeededForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>
                  </span>
                )}
              </span>
              <span className="text-gray-500 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#B8862B] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4 text-[#B8862B]">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-serif font-bold text-gray-900 text-lg mb-2">Your Bag is Empty</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                  Explore our premium Pakistani fabric collections and find your ideal suit.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1A1A1A] hover:bg-[#B8862B] text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors inline-block"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="pt-4 first:pt-0 flex gap-4">
                  <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={item.image || "/images/hero-banner.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.slug || item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-gray-900 hover:text-[#B8862B] line-clamp-2 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {item.category} {item.subcategory ? `• ${item.subcategory}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPKR(item.effectivePrice * item.quantity)}
                        </p>
                        {item.price > item.effectivePrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPKR(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-[#FDFBF7] space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Estimated Total</span>
                  <span className="text-[#B8862B] text-lg">{formatPKR(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#B8862B] hover:bg-[#9E7422] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center text-xs transition-colors"
                >
                  View Full Bag & Estimate
                </Link>
              </div>

              <p className="text-[11px] text-center text-gray-500 pt-1">
                🔒 Safe checkout with Cash on Delivery, EasyPaisa, or Meezan Bank
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
