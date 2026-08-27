import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SESSION_SECRET: string = (() => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set.");
  }
  return secret;
})();
const COOKIE_NAME = "daud_admin_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface AdminSession {
  adminId: number;
  email: string;
  name: string;
  role: string;
  exp: number;
}

export function createToken(payload: Omit<AdminSession, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const sessionData: AdminSession = { ...payload, exp };
  const dataStr = Buffer.from(JSON.stringify(sessionData)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(dataStr)
    .digest("base64url");
  return `${dataStr}.${signature}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [dataStr, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(dataStr)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const sessionData = JSON.parse(Buffer.from(dataStr, "base64url").toString("utf-8")) as AdminSession;
    if (sessionData.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return sessionData;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAdminSession(admin: { id: number; email: string; name: string; role: string }) {
  const token = createToken({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function verifyAdminPassword(email: string, plainPassword: string) {
  const [admin] = await db.select().from(admins).where(eq(admins.email, email.trim().toLowerCase())).limit(1);
  if (!admin) return null;
  const isMatch = await bcrypt.compare(plainPassword, admin.passwordHash);
  if (!isMatch) return null;
  return admin;
}
