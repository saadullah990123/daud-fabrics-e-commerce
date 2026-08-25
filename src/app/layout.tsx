import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "Daud Fabrics — Luxury Pakistani Fabrics & Clothing Store",
  description: "Daud Fabrics offers premium authentic Men's, Women's, and Kids' unstitched and stitched fabrics in Pakistan. Cash on Delivery nationwide, EasyPaisa, and Meezan Bank Transfer.",
  keywords: "Daud Fabrics, Pakistani fabrics, Egyptian Cotton Latha, Boski, Wash and Wear, Luxury Lawn, Chiffon suits, Lahore textiles",
  openGraph: {
    title: "Daud Fabrics — Premium Pakistani Fabrics",
    description: "Shop luxury unstitched fabrics, pure cotton latha, super fine boski, and embroidered lawn across Pakistan.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A] antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
