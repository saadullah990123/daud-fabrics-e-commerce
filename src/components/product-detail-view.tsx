"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductItem } from "@/lib/types";
import { formatPKR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "./product-card";
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Scissors,
  MessageCircle,
} from "lucide-react";

interface ProductDetailViewProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["/images/hero-banner.jpg"];

  const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const isOnSale = Boolean(product.salePrice && product.salePrice > 0 && product.salePrice < product.price);
  const discountPercent = isOnSale
    ? Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 250);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const whatsappInquiry = encodeURIComponent(
    `Salam Daud Fabrics! I have a question regarding: "${product.name}" (Price: ${formatPKR(effectivePrice)}). Is this available in custom length?`
  );

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 sm:mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-[#B8862B] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/${product.category}`} className="hover:text-[#B8862B] capitalize transition-colors">
          {product.category}&apos;s Collection
        </Link>
        {product.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-600">{product.subcategory}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Images Gallery Column (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
            <img
              src={images[selectedImageIndex] || "/images/hero-banner.jpg"}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isOnSale && (
                <span className="bg-[#B8862B] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-stone-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm">
                  Bestseller
                </span>
              )}
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-stone-900 text-white font-bold text-sm px-6 py-2.5 rounded-full uppercase tracking-widest">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-[#B8862B] ring-2 ring-[#B8862B]/20 scale-105"
                      : "border-stone-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls (Right 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8862B] bg-[#B8862B]/10 px-3 py-1 rounded-full">
                {product.category} {product.subcategory ? `• ${product.subcategory}` : ""}
              </span>
              {/* Stock status badge */}
              {isOutOfStock ? (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Out of Stock
                </span>
              ) : product.stock <= 4 ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Low Stock: Only {product.stock} units left!
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock Ready to Ship
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-900">
                {formatPKR(effectivePrice)}
              </span>
              {isOnSale && (
                <span className="text-lg text-stone-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
              {isOnSale && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  Save {formatPKR(product.price - (product.salePrice || 0))}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Includes all taxes. Free delivery across Pakistan on orders above Rs 3,000.
            </p>
          </div>

          {/* Quality & Fabric Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Fabric &amp; Quality Overview
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed bg-[#F5F2EB]/60 p-4 rounded-2xl border border-stone-200/80">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications (Cutting, Meters, Care) */}
          {product.details && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#B8862B]" />
                <span>Cutting &amp; Specifications</span>
              </h3>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1.5 whitespace-pre-line leading-relaxed">
                {product.details}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={quantity >= (product.stock || 99) || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-500">
                Total: <strong className="text-stone-900">{formatPKR(effectivePrice * quantity)}</strong>
              </span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                    : justAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1A1A1A] hover:bg-[#B8862B] text-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-[#B8862B] hover:bg-[#9E7422] text-white flex items-center justify-center gap-2 transition-all shadow-sm disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-white stroke-none" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>

            {/* WhatsApp Question Button */}
            <a
              href={`https://wa.me/923275363509?text=${whatsappInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask Fabric Specialist on WhatsApp</span>
            </a>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="border-t border-stone-200 pt-5 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#B8862B] shrink-0" />
              <span><strong>Cash on Delivery (COD)</strong> available in all cities across Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B8862B] shrink-0" />
              <span><strong>100% Original Fabric Guarantee:</strong> Combed yarns, no synthetic mixing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#B8862B] shrink-0" />
              <span><strong>Easy 7-Day Return &amp; Exchange</strong> on unstitched suits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">
                More from this collection
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href={`/${product.category}`}
              className="text-xs font-semibold text-[#B8862B] hover:underline"
            >
              View More {product.category}&apos;s Suits
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
