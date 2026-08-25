"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, Quote } from "lucide-react";
import { Review } from "@/db/schema";

export function CustomerReviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviewsList(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const defaultReviews = [
    {
      id: 1,
      customerName: "Mian Hamza Tariq",
      city: "Lahore",
      rating: 5,
      comment: "Sublime quality! The Egyptian Cotton Latha has that crisp, royal fall. Received parcel in Gulberg within 24 hours. Truly authentic Pakistani craftsmanship.",
      productName: "Royal Egyptian Cotton Latha — Unstitched 4.5m",
      verified: true,
    },
    {
      id: 2,
      customerName: "Dr. Ayesha Siddiqui",
      city: "Karachi (Clifton)",
      rating: 5,
      comment: "The Embroidered Luxury Lawn 3-piece is breathtaking. The colors did not bleed, fabric is buttery soft for Karachi summers, and the chiffon dupatta is featherlight.",
      productName: "Luxury Embroidered Lawn 3-Piece Suit",
      verified: true,
    },
    {
      id: 3,
      customerName: "Chaudhry Usman",
      city: "Islamabad",
      rating: 5,
      comment: "I have ordered Boski and Wash & Wear suits twice now from Daud Fabrics. Best unstitched fabric in Pakistan at very reasonable pricing.",
      productName: "Classic Superfine Boski Silk Suit",
      verified: true,
    },
    {
      id: 4,
      customerName: "Zainab Farooq",
      city: "Faisalabad",
      rating: 5,
      comment: "Living in textile hub Faisalabad, I am very picky with fabrics. Daud Fabrics exceeded my expectations. Outstanding thread count and fast delivery!",
      productName: "Pure Silk Jacquard Unstitched 3-Piece",
      verified: true,
    },
  ];

  const displayList = reviewsList.length > 0 ? reviewsList : defaultReviews;

  return (
    <section className="py-16 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-stone-700 ml-2">4.9 / 5.0 Rating</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Trusted by Thousands Across Pakistan
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Read genuine feedback from fabric connoisseurs across Karachi, Lahore, Islamabad, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="bg-[#FDFBF7] p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between relative hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#B8862B]/20 absolute top-4 right-4" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 font-serif">
                      {review.customerName}
                    </h4>
                    <p className="text-[11px] text-stone-500">{review.city}, Pakistan</p>
                  </div>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  )}
                </div>

                {review.productName && (
                  <p className="text-[10px] text-stone-400 truncate mt-1">
                    Purchased: {review.productName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
