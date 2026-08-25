import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "./admin-nav";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureDatabaseSeeded();
  const session = await getAdminSession();

  // If no session exists, the AdminNav component or page will redirect if not on login page
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased">
      <AdminNav session={session}>
        {children}
      </AdminNav>
    </div>
  );
}
