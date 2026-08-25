"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappNumber = "923001234567";
  const defaultMessage = encodeURIComponent(
    "Salam Daud Fabrics! I am interested in your luxury fabric collection and would like some assistance."
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105"
      aria-label="Chat with Daud Fabrics on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-none" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold font-sans">
        WhatsApp Order Support
      </span>
    </a>
  );
}
