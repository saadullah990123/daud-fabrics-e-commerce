import React from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Truck, RotateCcw, ShieldCheck, Check } from "lucide-react";

export const metadata = {
  title: "Shipping & Return Policies | Daud Fabrics Pakistan",
  description: "Learn about nationwide delivery across Pakistan, Free Shipping terms, Cash on Delivery, and our 7-day return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B8862B]">
            Daud Fabrics Guarantee
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Shipping &amp; Return Policies
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Transparent, customer-friendly terms designed for a seamless shopping experience in Pakistan.
          </p>
        </div>

        <div className="space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xs">
          {/* Shipping Policy */}
          <section className="space-y-3 pb-8 border-b border-stone-100">
            <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-xl">
              <Truck className="w-5 h-5 text-[#B8862B]" />
              <h2>Nationwide Shipping &amp; Delivery</h2>
            </div>
            <div className="text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
              <p>
                &bull; <strong>Free Shipping:</strong> We offer 100% Free Express Delivery across Pakistan on all orders having a cart value of <strong>Rs 3,000 or above</strong>.
              </p>
              <p>
                &bull; <strong>Standard Shipping:</strong> For orders below Rs 3,000, a flat shipping fee of <strong>Rs 250</strong> applies nationwide.
              </p>
              <p>
                &bull; <strong>Delivery Timeline:</strong> Major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad) receive parcels within <strong>24 to 48 hours</strong>. Other cities and rural tehsils take <strong>3 to 4 business days</strong>.
              </p>
              <p>
                &bull; <strong>Courier Partners:</strong> All dispatches are insured and tracked through TCS, Leopards, and Trax Express. You will receive a tracking link via SMS/WhatsApp.
              </p>
            </div>
          </section>

          {/* Cash on Delivery Policy */}
          <section className="space-y-3 pb-8 border-b border-stone-100">
            <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-xl">
              <ShieldCheck className="w-5 h-5 text-[#B8862B]" />
              <h2>Cash on Delivery (COD)</h2>
            </div>
            <div className="text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
              <p>
                &bull; COD is available for all serviceable postal codes in Pakistan with no advance deposit required for standard orders.
              </p>
              <p>
                &bull; Please keep exact cash ready upon delivery to ensure a smooth handover by the courier delivery agent.
              </p>
            </div>
          </section>

          {/* 7-Day Return & Exchange Policy */}
          <section className="space-y-3 pb-8 border-b border-stone-100">
            <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-xl">
              <RotateCcw className="w-5 h-5 text-[#B8862B]" />
              <h2>7-Day Hassle-Free Returns &amp; Exchange</h2>
            </div>
            <div className="text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
              <p>
                &bull; If you are not completely satisfied with the fabric quality, color tone, or hand-feel, you can request an exchange or return within <strong>7 days of delivery</strong>.
              </p>
              <p>
                &bull; <strong>Eligibility:</strong> The unstitched fabric must be uncut, unwashed, in its original packaging with the Daud Fabrics gold seal intact.
              </p>
              <p>
                &bull; <strong>Exchange Process:</strong> Simply send a WhatsApp message to <strong>0300-1234567</strong> with your Order Number and photos of the parcel. Our team will arrange a reverse pickup or guide you to our Liberty Market Lahore branch.
              </p>
            </div>
          </section>

          {/* Privacy & Authentic Guarantee */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-stone-900">
              100% Original Fabric Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Daud Fabrics guarantees 100% genuine Egyptian cotton yarns, pure silk Boski, and certified reactive dyes. We do not sell seconds, B-grade lots, or counterfeit prints.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
