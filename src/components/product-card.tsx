"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductItem } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Check, Eye } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["/images/hero-banner.jpg"];

  const mainImage = images[0];
  const hoverImage = images[1] || images[0];

  const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const isOnSale = Boolean(product.salePrice && product.salePrice > 0 && product.salePrice < product.price);
  const discountPercent = isOnSale
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Image & Badges Container */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative block aspect-3/4 overflow-hidden bg-stone-100"
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOnSale && (
            <span className="bg-[#B8862B] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-800 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        ) : product.stock <= 3 ? (
          <span className="absolute bottom-3 left-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Only {product.stock} left!
          </span>
        ) : null}

        {/* Hover Quick View overlay indicator */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Subcategory */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-[#B8862B]">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="text-[11px] truncate max-w-[130px]">
                {product.subcategory}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            href={`/products/${product.slug || product.id}`}
            className="block font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#B8862B] line-clamp-2 transition-colors leading-snug"
          >
            {product.name}
          </Link>

          {/* Short Fabric Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-stone-900">
                {formatPKR(effectivePrice)}
              </span>
            </div>
            {isOnSale && (
              <span className="text-xs text-stone-400 line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#1A1A1A] hover:bg-[#B8862B] text-white shadow-xs"
            }`}
            aria-label="Add to bag"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
