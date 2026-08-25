"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPKR, formatDate, getOrderStatusBadge, getPaymentStatusBadge, getPaymentMethodName } from "@/lib/format";
import {
  Banknote,
  ShoppingBag,
  Clock,
  Truck,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Plus,
  Eye,
} from "lucide-react";
import { OrderRecord } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    pendingRevenue: number;
    pendingPayments: number;
    pendingFulfillment: number;
    shippedOrders: number;
    totalProducts: number;
    lowStockProducts: number;
    recentOrders: OrderRecord[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error loading admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#B8862B]">
            Store Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Daud Fabrics Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time Pakistan e-commerce operations, order fulfillment, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
          <Link
            href="/admin/products"
            className="bg-[#B8862B] hover:bg-[#9E7422] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Verified Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Paid Revenue
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {formatPKR(stats?.totalRevenue || 0)}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              From verified paid orders
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {stats?.totalOrders || 0}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              All time customer orders
            </p>
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pending Verification
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
              {stats?.pendingPayments || 0}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Awaiting payment proof check
            </p>
          </div>
        </div>

        {/* Active Products & Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Active Products
            </span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {stats?.totalProducts || 0}
              </p>
              {Boolean(stats?.lowStockProducts && stats.lowStockProducts > 0) && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  {stats?.lowStockProducts} low stock
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Live in store catalog
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/admin/orders"
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-[#B8862B] shadow-xs transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 text-[#B8862B] rounded-xl group-hover:bg-[#B8862B] group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Manage Orders</h3>
              <p className="text-xs text-stone-500">Review screenshots &amp; fulfill orders</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#B8862B] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/products"
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-[#B8862B] shadow-xs transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Fabric Inventory</h3>
              <p className="text-xs text-stone-500">Add products &amp; update prices</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#B8862B] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-[#B8862B] shadow-xs transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-stone-100 text-stone-700 rounded-xl group-hover:bg-stone-900 group-hover:text-white transition-colors">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Bank &amp; Account Settings</h3>
              <p className="text-xs text-stone-500">Update EasyPaisa, Meezan IBAN &amp; password</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#B8862B] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-stone-500">
              Most recent incoming purchases across Pakistan
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#B8862B] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200/80">
              <tr>
                <th className="py-3 px-4 sm:px-6">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-stone-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => {
                  const pBadge = getPaymentStatusBadge(order.paymentStatus);
                  const oBadge = getOrderStatusBadge(order.orderStatus);
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-4 px-4 text-stone-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{order.customerPhone}</p>
                      </td>
                      <td className="py-4 px-4 text-stone-700">
                        {order.city}
                      </td>
                      <td className="py-4 px-4 text-stone-700 uppercase text-[10px]">
                        {order.paymentMethod}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${pBadge.bg}`}>
                          {pBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${oBadge.bg}`}>
                          {oBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-stone-900">
                        {formatPKR(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Link
                          href={`/admin/orders?highlight=${order.id}`}
                          className="p-1.5 bg-stone-100 hover:bg-[#B8862B] hover:text-white rounded-lg inline-flex items-center justify-center transition-colors text-stone-700"
                          title="View Order"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
