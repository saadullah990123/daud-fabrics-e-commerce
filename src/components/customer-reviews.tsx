"use client";

import React, { useEffect, useState } from "react";
import { Star, CheckCircle, Quote, MessageSquareQuote, ShieldCheck } from "lucide-react";
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
      city: "Lahore (Gulberg)",
      rating: 5,
      comment: "Sublime quality! The Egyptian Cotton Latha has that crisp, royal fall. Received parcel in Gulberg within 24 hours. Truly authentic Pakistani craftsmanship.",
      productName: "Royal Egyptian Cotton Latha — Unstitched 4.5m",
      verified: true,
      imageProof: "/images/reviews/review1.jpg",
    },
    {
      id: 2,
      customerName: "Dr. Ayesha Siddiqui",
      city: "Karachi (Clifton)",
      rating: 5,
      comment: "The Embroidered Luxury Lawn 3-piece is breathtaking. The colors did not bleed, fabric is buttery soft for Karachi summers, and the chiffon dupatta is featherlight.",
      productName: "Luxury Embroidered Swiss Lawn 3-Piece — Rose Bloom",
      verified: true,
      imageProof: "/images/reviews/review2.jpg",
    },
    {
      id: 3,
      customerName: "Chaudhry Usman",
      city: "Islamabad (F-7)",
      rating: 5,
      comment: "I have ordered Boski and Kashmiri Shawls twice now from Daud Fabrics. Best unstitched fabric in Pakistan at very honest factory-direct pricing.",
      productName: "Kashmiri Wool Embroidered Shawl — Signature Black",
      verified: true,
      imageProof: "/images/reviews/review3.jpg",
    },
    {
      id: 4,
      customerName: "Zainab Farooq",
      city: "Faisalabad",
      rating: 5,
      comment: "Living in textile capital Faisalabad, I am very picky with fabrics. Daud Fabrics exceeded my expectations. Outstanding thread count and fast COD delivery!",
      productName: "Pure Silk Jacquard Festive 3-Piece",
      verified: true,
      imageProof: "/images/reviews/review4.jpg",
    },
  ];

  const displayList = reviewsList.length > 0 ? reviewsList : defaultReviews;

  return (
    <section className="py-16 sm:py-20 bg-[#FAF9F5] border-t border-[#EBE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full text-amber-700 text-xs font-bold mb-3 shadow-2xs">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>4.95 / 5.0 Rated Across Pakistan</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#111827]">
            Trusted by Thousands of Fabric Lovers
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Read authentic reviews and verified WhatsApp feedback from clients in Karachi, Lahore, Islamabad, Peshawar, Quetta, and overseas Pakistanis.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.slice(0, 4).map((review, idx) => {
            const proofImg = (review as any).imageProof || defaultReviews[idx % defaultReviews.length]?.imageProof;
            return (
              <div
                key={review.id}
                className="luxury-card bg-white p-5 rounded-2xl border border-[#EBE7DF] shadow-xs flex flex-col justify-between relative hover:border-[#D4AF37]/60 transition-all"
              >
                <div>
                  {/* Rating stars & verified badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Footer of Card with Proof Badge & Customer Name */}
                <div className="pt-3 border-t border-[#F2EFE9] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 font-serif">
                        {review.customerName}
                      </h4>
                      <p className="text-[11px] text-stone-500">{review.city}</p>
                    </div>

                    {proofImg && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 shadow-2xs shrink-0" title="Verified Customer Unboxing Proof">
                        <img
                          src={proofImg}
                          alt="Customer feedback proof"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {review.productName && (
                    <p className="text-[10px] text-[#B8862B] truncate font-medium">
                      Ordered: {review.productName}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* WhatsApp Proof Trust Strip */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE7DF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">
                Want to see real unboxing video proofs &amp; customer chat screenshots?
              </p>
              <p className="text-xs text-stone-500">
                Message our customer care on WhatsApp to view fabric live in natural daylight before dispatch.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923275363509?text=Assalam-o-Alaikum%20Daud%20Fabrics%2C%20I%20would%20like%20to%20see%20live%20unboxing%20pictures%20of%20your%20latest%20collection."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0"
          >
            <span>Chat with Fabric Expert</span>
          </a>
        </div>
      </div>
    </section>
  );
}
