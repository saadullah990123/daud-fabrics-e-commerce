"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface AdminNavProps {
  session: AdminSession | null;
  children: React.ReactNode;
}

export function AdminNav({ session, children }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render children directly without admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If unauthenticated, redirect immediately to login
  if (!session) {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center text-stone-400 text-sm">
          Redirecting to Admin Login...
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Products & Fabric Stock",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders & Verification",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Settings & Bank Details",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isCurrentActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-100">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-stone-900 text-white flex-col shrink-0 border-r border-stone-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#B8862B] rotate-45 group-hover:rotate-90 transition-transform"></span>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                DAUD FABRICS
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B8862B] font-semibold pl-5">
              Admin Portal
            </span>
          </Link>
        </div>

        {/* Admin User Badge */}
        <div className="px-6 py-4 border-b border-stone-800/80 bg-stone-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#B8862B]/20 border border-[#B8862B]/50 text-[#B8862B] flex items-center justify-center font-bold text-xs">
            {session.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{session.name}</p>
            <p className="text-[11px] text-stone-400 truncate">{session.email}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  active
                    ? "bg-[#B8862B] text-white shadow-md font-bold"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 opacity-75" />}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-stone-800 space-y-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#B8862B]" />
                <span>Open Storefront</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">Live</span>
            </Link>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 bg-stone-800 hover:bg-rose-900/80 text-stone-300 hover:text-white py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800 sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#B8862B] rotate-45"></span>
          <span className="font-serif font-bold text-base text-white">DAUD FABRICS</span>
          <span className="text-[9px] uppercase bg-[#B8862B]/20 text-[#B8862B] px-1.5 py-0.5 rounded-sm">
            Admin
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
            title="Open Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-stone-900 text-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <span className="font-serif font-bold text-lg text-white">DAUD FABRICS</span>
                <p className="text-[10px] text-[#B8862B] uppercase tracking-wider">Admin Control</p>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isCurrentActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      active
                        ? "bg-[#B8862B] text-white font-bold"
                        : "text-stone-300 hover:bg-stone-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-stone-800">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 text-[#B8862B]" />
                  <span>View Public Storefront</span>
                </Link>
              </div>
            </nav>

            <div className="p-4 border-t border-stone-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-stone-800 text-stone-300 py-2.5 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
