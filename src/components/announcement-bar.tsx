"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>([
    "✨ FREE Shipping Across Pakistan on Orders Over Rs 3,000",
    "🇵🇰 Premium Authentic Pakistani Fabrics — 100% Original Guarantee",
    "🔥 New Festive Luxury Lawn & Boski Collection Live",
    "📦 Cash on Delivery (COD) & EasyPaisa / Meezan Bank Available Nationwide",
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
    <div className="bg-[#1A1A1A] text-[#FDFBF7] text-xs font-medium py-2 px-4 border-b border-[#2C2C2C] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Scrolling Strip on Mobile & Desktop */}
        <div className="w-full flex items-center overflow-hidden">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {messages.concat(messages).map((msg, index) => (
              <span key={index} className="inline-flex items-center gap-2 text-xs md:text-sm tracking-wide">
                <span className="text-[#B8862B] font-bold">●</span>
                <span>{msg}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Quick Help / Admin link (subtle) */}
        <div className="hidden lg:flex items-center gap-4 text-neutral-400 text-xs shrink-0 pl-6 border-l border-neutral-800">
          <Link href="/track-order" className="hover:text-[#B8862B] transition-colors">
            Track Order
          </Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-[#B8862B] transition-colors">
            Helpline: 0300-1234567
          </Link>
        </div>
      </div>
    </div>
  );
}
