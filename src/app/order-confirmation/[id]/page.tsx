import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { formatPKR, formatDate, getPaymentMethodName, getPaymentStatusBadge, getOrderStatusBadge } from "@/lib/format";
import {
  CheckCircle2,
  Package,
  Truck,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { OrderItem } from "@/lib/types";

export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const isNumeric = /^\d+$/.test(id);
  const condition = isNumeric
    ? or(eq(orders.id, parseInt(id, 10)), eq(orders.orderNumber, id))
    : eq(orders.orderNumber, id);

  const [order] = await db.select().from(orders).where(condition).limit(1);

  if (!order) {
    notFound();
  }

  let itemsList: OrderItem[] = [];
  try {
    itemsList = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
  } catch {
    itemsList = [];
  }

  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
  const orderBadge = getOrderStatusBadge(order.orderStatus);

  const whatsappMessage = encodeURIComponent(
    `Salam Daud Fabrics! I have placed order #${order.orderNumber} for ${order.customerName} (Total: ${formatPKR(order.totalAmount)}). Please confirm the dispatch status.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Success Banner Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#B8862B]">
              Order Placed Successfully
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Shukriya, {order.customerName}!
            </h1>
            <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
              Your order <strong className="text-stone-900 font-mono font-bold">#{order.orderNumber}</strong> has been received by Daud Fabrics.
            </p>
          </div>

          {/* Important Customer Notice Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-2 mt-6">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-[#B8862B]" />
              <span>What happens next?</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {order.paymentMethod === "cod" ? (
                <>Our representative will call or WhatsApp you at <strong>{order.customerPhone}</strong> within 12-24 hours to confirm your parcel dispatch. You will pay <strong>{formatPKR(order.totalAmount)}</strong> in cash when the courier delivers to your address.</>
              ) : (
                <>Our accounts team will verify your uploaded payment proof. Once confirmed, your fabrics will be packed in our signature gift box and dispatched with a tracking code sent to your WhatsApp.</>
              )}
            </p>
          </div>

          {/* WhatsApp Instant Confirmation Link */}
          <div className="pt-2">
            <a
              href={`https://wa.me/923001234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white stroke-none" />
              <span>Confirm on WhatsApp ({order.orderNumber})</span>
            </a>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <p className="text-xs text-stone-400">Order Reference</p>
              <p className="font-mono font-bold text-lg text-stone-900">#{order.orderNumber}</p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Order Date</p>
              <p className="text-xs font-semibold text-stone-800">{formatDate(order.createdAt)}</p>
            </div>

            <div>
              <p className="text-xs text-stone-400">Payment Status</p>
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${paymentBadge.bg}`}>
                {paymentBadge.label}
              </span>
            </div>

            <div>
              <p className="text-xs text-stone-400">Order Status</p>
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${orderBadge.bg}`}>
                {orderBadge.label}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-100 text-xs">
            <div>
              <p className="font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B8862B]" /> Delivery Destination
              </p>
              <p className="font-semibold text-stone-900">{order.customerName}</p>
              <p className="text-stone-600 mt-0.5">{order.deliveryAddress}</p>
              <p className="text-stone-600 font-semibold">{order.city}, Pakistan</p>
            </div>

            <div>
              <p className="font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#B8862B]" /> Contact &amp; Payment
              </p>
              <p className="text-stone-800 font-mono font-semibold">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-stone-500">{order.customerEmail}</p>}
              <p className="text-stone-700 mt-1">
                Method: <strong>{getPaymentMethodName(order.paymentMethod)}</strong>
              </p>
            </div>
          </div>

          {/* Itemized Products */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Ordered Items
            </h3>
            <div className="divide-y divide-stone-100">
              {itemsList.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity} &bull; {formatPKR(item.price)} each</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping Charges</span>
              <span className="font-semibold">
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  formatPKR(order.shippingFee)
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline font-bold text-stone-900 text-base sm:text-lg">
              <span>Total Amount</span>
              <span className="text-[#B8862B] font-serif">{formatPKR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/track-order"
              className="text-xs font-semibold text-stone-700 hover:text-[#B8862B] flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#B8862B]" />
              <span>Track Live Order Status</span>
            </Link>

            <Link
              href="/products"
              className="bg-[#1A1A1A] hover:bg-[#B8862B] text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
