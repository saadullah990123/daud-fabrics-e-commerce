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
    : ["/images/store-bg.jpg"];

  const mainImage = images[0];
  const hoverImage = images.length > 1 ? images[1] : null;

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
    }, 250);
  };

  return (
    <div className="group luxury-card bg-white rounded-2xl overflow-hidden border border-[#EBE7DF] shadow-xs hover:border-[#D4AF37]/50 flex flex-col justify-between transition-all duration-300">
      {/* Image & Badges Container */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative block aspect-3/4 overflow-hidden bg-[#F6F4EE]"
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            hoverImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />

        {/* Alternate Hover Image if present */}
        {hoverImage && (
          <img
            src={hoverImage}
            alt={`${product.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
          {isOnSale && (
            <span className="bg-[#B8862B] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#1F2937] text-amber-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        {/* Stock Status */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-800 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        ) : product.stock <= 3 ? (
          <span className="absolute bottom-2.5 left-2.5 bg-amber-600/90 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Only {product.stock} left!
          </span>
        ) : null}

        {/* Hover Quick View overlay indicator */}
        <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-stone-900 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#B8862B]" /> View Fabric
          </span>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Subcategory */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-bold text-[10px] text-[#B8862B]">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="text-[11px] text-stone-500 truncate max-w-[120px]">
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
        <div className="pt-3 sm:pt-4 mt-2 border-t border-[#F2EFE9] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-stone-900">
                {formatPKR(effectivePrice)}
              </span>
            </div>
            {isOnSale && (
              <span className="text-[11px] sm:text-xs text-stone-400 line-through">
                {formatPKR(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              justAdded ? "enh-pulse" : ""
            } ${
              isOutOfStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#1F2937] hover:bg-[#B8862B] text-white shadow-xs"
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
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
