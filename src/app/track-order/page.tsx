"use client";

import React, { useState } from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { formatPKR, formatDate, getOrderStatusBadge, getPaymentStatusBadge, getPaymentMethodName } from "@/lib/format";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Loader2, MapPin } from "lucide-react";
import { OrderRecord } from "@/lib/types";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const cleanId = orderId.trim().replace(/^#/, "");
      const res = await fetch(`/api/orders/${cleanId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found. Please check your order reference number.");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retrieve order";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#B8862B]">
            Daud Fabrics Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Track Your Fabric Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Enter your Order Number (e.g. <span className="font-mono font-bold text-stone-800">DF-10842</span>) received in your SMS, WhatsApp, or order confirmation.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto mb-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Order Reference Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. DF-59124"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-[#B8862B] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="w-full bg-[#1A1A1A] hover:bg-[#B8862B] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking up order details...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Result Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400">Order Number</p>
                <p className="font-mono font-bold text-xl text-stone-900">#{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-xs text-stone-400">Placed On</p>
                <p className="text-xs font-semibold text-stone-800">{formatDate(order.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs text-stone-400">Order Status</p>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getOrderStatusBadge(order.orderStatus).bg}`}>
                  {getOrderStatusBadge(order.orderStatus).label}
                </span>
              </div>

              <div>
                <p className="text-xs text-stone-400">Payment Status</p>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getPaymentStatusBadge(order.paymentStatus).bg}`}>
                  {getPaymentStatusBadge(order.paymentStatus).label}
                </span>
              </div>
            </div>

            {/* Tracking / Courier Banner if Shipped */}
            {order.trackingNumber && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-purple-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-900">
                      Dispatched via {order.courierName || "TCS Express Courier"}
                    </p>
                    <p className="font-mono text-xs font-bold text-purple-700">
                      Tracking ID: {order.trackingNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-stone-700 uppercase tracking-wider mb-1">Customer &amp; Address</p>
                <p className="font-semibold text-stone-900">{order.customerName}</p>
                <p className="text-stone-600">{order.deliveryAddress}</p>
                <p className="text-stone-600 font-semibold">{order.city}, Pakistan</p>
              </div>
              <div>
                <p className="font-bold text-stone-700 uppercase tracking-wider mb-1">Payment &amp; Total</p>
                <p className="text-stone-700">Method: {getPaymentMethodName(order.paymentMethod)}</p>
                <p className="font-serif font-bold text-base text-[#B8862B] mt-1">{formatPKR(order.totalAmount)}</p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Ordered Items</h3>
              <div className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-stone-900">{formatPKR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
