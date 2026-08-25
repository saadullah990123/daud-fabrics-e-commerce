"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { ProductItem } from "@/lib/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative min-h-screen flex items-start justify-center p-4 pt-16 md:pt-24">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-serif font-bold text-gray-900 text-lg">Search Daud Fabrics</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative my-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search by fabric (e.g. Cotton Latha, Boski, Lawn, Wash & Wear)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Tags */}
          {!query && (
            <div className="pt-2 pb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Egyptian Cotton", "Boski Silk", "Wash & Wear", "Luxury Lawn 3-Piece", "Chikan Kari", "Kids Kurta"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-gray-100 hover:bg-[#B8862B] hover:text-white text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-[#B8862B]" />
              <span>Searching fabric archives...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="mt-2 space-y-2 max-h-80 overflow-y-auto divide-y divide-gray-100">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors group"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img
                      src={product.images[0] || "/images/hero-banner.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#B8862B] truncate transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {product.category} {product.subcategory ? `• ${product.subcategory}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPKR(product.salePrice || product.price)}
                    </p>
                    {product.salePrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPKR(product.price)}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#B8862B] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              <p>No fabrics found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for &quot;Cotton&quot;, &quot;Boski&quot;, or &quot;Lawn&quot;.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
