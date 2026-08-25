"use client";

import React from "react";
import { Truck, Banknote, Headphones, RefreshCw } from "lucide-react";

export function FeatureStrip() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On all orders over Rs 3,000 across Pakistan",
    },
    {
      icon: Banknote,
      title: "Cash on Delivery",
      description: "Pay at your doorstep in all Pakistani cities",
    },
    {
      icon: Headphones,
      title: "24/7 WhatsApp Support",
      description: "Instant order assistance & sizing guidance",
    },
    {
      icon: RefreshCw,
      title: "Easy 7-Day Returns",
      description: "Hassle-free exchange policy on unstitched suits",
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-4 p-3 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#B8862B]/30 text-[#B8862B] shrink-0">
                  <Icon className="w-6 h-6 stroke-1.75" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
