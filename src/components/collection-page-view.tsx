"use client";

import React, { useState, useMemo } from "react";
import { ProductItem } from "@/lib/types";
import { ProductCard } from "./product-card";
import { SlidersHorizontal, ArrowUpDown, Search, Sparkles, Filter, X } from "lucide-react";

interface CollectionPageViewProps {
  title: string;
  subtitle: string;
  category: "men" | "women" | "kids" | "all";
  initialProducts: ProductItem[];
  subcategories?: string[];
}

export function CollectionPageView({
  title,
  subtitle,
  category,
  initialProducts,
  subcategories = [],
}: CollectionPageViewProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [saleOnly, setSaleOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique subcategories if not provided
  const availableSubcategories = useMemo(() => {
    if (subcategories.length > 0) return subcategories;
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.subcategory) set.add(p.subcategory);
    });
    return Array.from(set);
  }, [initialProducts, subcategories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Subcategory filter
      if (selectedSubcategory !== "all" && product.subcategory !== selectedSubcategory) {
        return false;
      }
      // In stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Sale only filter
      if (saleOnly && (!product.salePrice || product.salePrice <= 0 || product.salePrice >= product.price)) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(term);
        const matchesDesc = product.description.toLowerCase().includes(term);
        const matchesSub = product.subcategory?.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }
      return true;
    }).sort((a, b) => {
      const effectiveA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.price;
      const effectiveB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.price;

      if (sortBy === "price_asc") {
        return effectiveA - effectiveB;
      }
      if (sortBy === "price_desc") {
        return effectiveB - effectiveA;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      // Default: newest
      return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
    });
  }, [initialProducts, selectedSubcategory, inStockOnly, saleOnly, searchTerm, sortBy]);

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#B8862B]">
          Daud Fabrics Pakistan
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-1">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Subcategory Pills */}
      {availableSubcategories.length > 0 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedSubcategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubcategory === "all"
                ? "bg-[#1A1A1A] text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            All {title}
          </button>
          {availableSubcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubcategory === sub
                  ? "bg-[#B8862B] text-white shadow-sm"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Control Bar (Search, Filters, Sort) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search within page */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Filter by fabric or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B] focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-3 text-xs">
            {/* On Sale toggle */}
            <button
              onClick={() => setSaleOnly(!saleOnly)}
              className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 transition-colors border ${
                saleOnly
                  ? "bg-[#B8862B] text-white border-[#B8862B]"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>On Sale</span>
            </button>

            {/* In Stock toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 rounded-xl font-medium transition-colors border ${
                inStockOnly
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              In Stock Only
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <label htmlFor="sort-select" className="text-stone-500 text-xs hidden sm:inline">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Count indication */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "fabric" : "fabrics"}
          </span>
          {(searchTerm || saleOnly || inStockOnly || selectedSubcategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSaleOnly(false);
                setInStockOnly(false);
                setSelectedSubcategory("all");
              }}
              className="text-[#B8862B] hover:underline font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-amber-50 text-[#B8862B] rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">No Fabrics Found</h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-6">
            We couldn&apos;t find any products matching your current filters. Try changing or clearing your search.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSaleOnly(false);
              setInStockOnly(false);
              setSelectedSubcategory("all");
            }}
            className="bg-[#1A1A1A] hover:bg-[#B8862B] text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
