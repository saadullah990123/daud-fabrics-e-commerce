"use client";

import React from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Truck, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B8862B]">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-1">
            We Are Here To Assist You
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Have a query regarding fabric meterage, colors, wholesale, or order tracking? Contact our Lahore studio team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-[#B8862B] rounded-xl shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm">Flagship Store</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Shop # 14-18, Daud Fabrics Arcade, Main Liberty Market, Gulberg III, Lahore, Pakistan
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm">Phone &amp; WhatsApp</h3>
                <p className="text-xs text-stone-800 font-mono font-semibold mt-1">+92 300 1234567</p>
                <p className="text-xs text-stone-500">Available 11 AM - 10 PM PKT</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-sm">Email Support</h3>
                <p className="text-xs text-stone-800 font-mono font-semibold mt-1">sales@daudfabrics.pk</p>
                <p className="text-xs text-stone-500">Response within 12 hours</p>
              </div>
            </div>

            <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-3">
              <h4 className="font-serif font-bold text-base text-[#B8862B]">Instant WhatsApp Chat</h4>
              <p className="text-xs text-stone-300">
                Need quick advice on fabric drape, wedding bulk orders, or tailoring cutting advice?
              </p>
              <a
                href="https://wa.me/923001234567?text=Salam%20Daud%20Fabrics%2C%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-stone-900">
                Send Us A Message
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Fill out the form below and our fabric concierge will respond promptly.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Your message has been received. Our team will contact you shortly.");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-xxxxxxx"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Subject / Inquiry Type
                </label>
                <select className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white">
                  <option>Fabric Quality &amp; Meterage Inquiry</option>
                  <option>Order Status &amp; Tracking</option>
                  <option>Payment Verification Help</option>
                  <option>Wholesale &amp; Bulk Purchase</option>
                  <option>Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1A1A1A] hover:bg-[#B8862B] text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
