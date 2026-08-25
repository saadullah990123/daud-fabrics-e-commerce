"use client";

import React, { useState, useEffect } from "react";
import { formatPKR, formatDate, getOrderStatusBadge, getPaymentStatusBadge, getPaymentMethodName } from "@/lib/format";
import { OrderRecord } from "@/lib/types";
import {
  Search,
  ShoppingBag,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Banknote,
  Phone,
  MapPin,
  FileText,
  X,
  ExternalLink,
  ZoomIn,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Selected Order for Detail Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [screenshotZoom, setScreenshotZoom] = useState<string | null>(null);

  // Status Change Inputs
  const [newPaymentStatus, setNewPaymentStatus] = useState("Pending");
  const [newOrderStatus, setNewOrderStatus] = useState("Pending");
  const [newCourierName, setNewCourierName] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetail = (order: OrderRecord) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus);
    setNewOrderStatus(order.orderStatus);
    setNewCourierName(order.courierName || "TCS Express");
    setNewTrackingNumber(order.trackingNumber || "");
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder) return;
    setStatusUpdating(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          orderStatus: newOrderStatus,
          courierName: newCourierName,
          trackingNumber: newTrackingNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        fetchOrders();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // KPI Calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingVerificationCount = orders.filter((o) => o.paymentStatus === "Pending").length;
  const pendingFulfillmentCount = orders.filter((o) => o.orderStatus === "Pending").length;

  // Filtered Orders List
  const filteredOrders = orders.filter((o) => {
    if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false;
    if (orderStatusFilter !== "all" && o.orderStatus !== orderStatusFilter) return false;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerPhone.includes(term) ||
        o.city.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">
            Sales &amp; Verification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Orders Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verify payment screenshots, confirm customer dispatches, and manage logistics.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {orders.length}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pending Verification
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
              {pendingVerificationCount}
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Paid Revenue
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {formatPKR(totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <span className="text-stone-500 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="Pending">Pending Verification</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <span className="text-stone-500 font-medium">Fulfillment:</span>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#B8862B]" />
                    <span>Loading customer orders...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const pBadge = getPaymentStatusBadge(order.paymentStatus);
                  const oBadge = getOrderStatusBadge(order.orderStatus);
                  const itemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => openOrderDetail(order)}
                      className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-900">
                        #{order.orderNumber}
                      </td>

                      <td className="py-4 px-4 text-stone-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{order.customerPhone}</p>
                        <p className="text-[10px] text-stone-400">{order.city}</p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-stone-800 font-semibold truncate max-w-[160px]">
                          {order.items[0]?.name || "Suit"}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {itemsCount} {itemsCount === 1 ? "suit" : "suits"} total
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="capitalize font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md text-[10px]">
                          {getPaymentMethodName(order.paymentMethod)}
                        </span>
                        {order.paymentScreenshot && (
                          <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">
                            ● Screenshot Attached
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${pBadge.bg}`}>
                          {pBadge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${oBadge.bg}`}>
                          {oBadge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                        {formatPKR(order.totalAmount)}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openOrderDetail(order);
                          }}
                          className="p-1.5 bg-stone-100 hover:bg-[#B8862B] hover:text-white rounded-lg transition-colors text-stone-700"
                          title="Inspect Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Inspector Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">Order Detail</span>
                  <span className="font-mono font-bold text-lg text-stone-900">#{selectedOrder.orderNumber}</span>
                </div>
                <p className="text-xs text-stone-500">
                  Received on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B8862B]" /> Delivery Destination
                </p>
                <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-stone-600">{selectedOrder.deliveryAddress}</p>
                <p className="text-stone-700 font-semibold">{selectedOrder.city}, Pakistan</p>
                {selectedOrder.postalCode && <p className="text-stone-500">Postal: {selectedOrder.postalCode}</p>}
                {selectedOrder.orderNotes && (
                  <p className="pt-1 text-stone-600 italic">&ldquo;Notes: {selectedOrder.orderNotes}&rdquo;</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B8862B]" /> Contact &amp; Payment
                </p>
                <p className="font-mono font-bold text-stone-900 text-sm">{selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p className="text-stone-500">{selectedOrder.customerEmail}</p>}
                <p className="text-stone-700 pt-1">
                  Payment Method: <strong>{getPaymentMethodName(selectedOrder.paymentMethod)}</strong>
                </p>
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-semibold pt-1"
                >
                  Open WhatsApp Chat with Customer &rarr;
                </a>
              </div>
            </div>

            {/* Payment Proof Screenshot Section (If EasyPaisa or Bank Transfer) */}
            {selectedOrder.paymentScreenshot ? (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Customer Payment Proof Uploaded
                  </p>
                  <button
                    onClick={() => setScreenshotZoom(selectedOrder.paymentScreenshot!)}
                    className="text-xs text-[#B8862B] font-bold hover:underline flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Full Zoom
                  </button>
                </div>
                <div className="relative aspect-16/9 max-h-56 bg-stone-900 rounded-xl overflow-hidden border border-amber-300">
                  <img
                    src={selectedOrder.paymentScreenshot}
                    alt="Payment receipt screenshot proof"
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setScreenshotZoom(selectedOrder.paymentScreenshot!)}
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Inspect the transaction ID, amount, and timestamp above before updating payment status to &quot;Paid&quot;.
                </p>
              </div>
            ) : selectedOrder.paymentMethod !== "cod" ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-600">
                <span>No payment receipt screenshot was uploaded for this {getPaymentMethodName(selectedOrder.paymentMethod)} order. Contact customer via phone/WhatsApp for verification.</span>
              </div>
            ) : null}

            {/* Itemized Order Products */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Ordered Fabrics
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-10 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-stone-900">{item.name}</p>
                        <p className="text-stone-500">Qty: {item.quantity} &bull; {formatPKR(item.price)} each</p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 text-xs space-y-1 text-right">
                <p className="text-stone-600">Subtotal: <strong className="text-stone-900">{formatPKR(selectedOrder.subtotal)}</strong></p>
                <p className="text-stone-600">Shipping: <strong className="text-stone-900">{selectedOrder.shippingFee === 0 ? "FREE" : formatPKR(selectedOrder.shippingFee)}</strong></p>
                <p className="text-sm font-bold text-[#B8862B] pt-1">
                  Grand Total: {formatPKR(selectedOrder.totalAmount)}
                </p>
              </div>
            </div>

            {/* Status Update Control Box */}
            <div className="p-5 bg-stone-900 text-white rounded-2xl space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#B8862B]">
                Update Order Status &amp; Tracking
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  >
                    <option value="Pending">Pending Verification</option>
                    <option value="Paid">Paid (Confirmed)</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                {/* Order Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing &amp; Packed</option>
                    <option value="Shipped">Shipped (Dispatched)</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Courier Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Courier Service
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TCS / Trax / Leopards"
                    value={newCourierName}
                    onChange={(e) => setNewCourierName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>

                {/* Tracking ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Courier Tracking #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7824912093"
                    value={newTrackingNumber}
                    onChange={(e) => setNewTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:ring-1 focus:ring-[#B8862B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateOrderStatus}
                  disabled={statusUpdating}
                  className="bg-[#B8862B] hover:bg-[#9E7422] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {statusUpdating ? "Saving Status..." : "Save Order Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Full Zoom Modal */}
      {screenshotZoom && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setScreenshotZoom(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img src={screenshotZoom} alt="Full payment proof" className="rounded-xl shadow-2xl" />
            <button
              onClick={() => setScreenshotZoom(null)}
              className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
