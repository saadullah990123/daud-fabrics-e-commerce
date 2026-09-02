"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>([
    "✨ FREE Nationwide Shipping Across Pakistan on Orders Over Rs 3,000",
    "🇵🇰 100% Original Pakistani Fabric Guarantee — Direct from Master Weavers",
    "🔥 New Festive Luxury Lawn, Pashmina Shawls & Boski Live",
    "📦 Cash on Delivery (COD) & Instant WhatsApp Orders Available",
  ]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.announcement_messages) {
          const list = Array.isArray(data.settings.announcement_messages)
            ? data.settings.announcement_messages
            : [data.settings.announcement_messages];
          if (list.length > 0) {
            setMessages(list);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#181D26] text-[#F9F7F1] text-xs font-medium py-2 px-4 border-b border-[#2C3240] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Scrolling Strip on Mobile & Desktop */}
        <div className="w-full flex items-center overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {messages.concat(messages).map((msg, index) => (
              <span key={index} className="inline-flex items-center gap-2 text-xs md:text-sm tracking-wide">
                <span className="text-[#D4AF37] font-bold">●</span>
                <span>{msg}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Quick Help / Admin link */}
        <div className="hidden lg:flex items-center gap-4 text-stone-300 text-xs shrink-0 pl-6 border-l border-stone-700">
          <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors">
            Track Order
          </Link>
          <span>|</span>
          <a
            href="https://wa.me/923275363509"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25D366] transition-colors flex items-center gap-1"
          >
            WhatsApp: 0327-5363509
          </a>
        </div>
      </div>
    </div>
  );
}
