import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Please enter your admin email" }, { status: 400 });
    }

    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.trim().toLowerCase()))
      .limit(1);

    if (!admin) {
      // Return success-like response for security, but allow quick demo recovery
      return NextResponse.json({
        success: true,
        message: "If this email is registered, a password reset token has been generated.",
      });
    }

    // Generate 6-digit recovery code or hex token
    const resetToken = crypto.randomBytes(16).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db
      .update(admins)
      .set({
        resetToken,
        resetTokenExpiry,
      })
      .where(eq(admins.id, admin.id));

    return NextResponse.json({
      success: true,
      message: "Reset token generated successfully. In production, this link is emailed to the admin.",
      resetToken, // Provided for instant reset workflow in admin UI
    });
  } catch (error) {
    console.error("POST /api/admin/forgot-password error:", error);
    return NextResponse.json({ success: false, error: "Failed to process reset request" }, { status: 500 });
  }
}
