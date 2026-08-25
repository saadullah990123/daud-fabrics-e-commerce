import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ success: false, error: "Invalid settings data" }, { status: 400 });
    }

    for (const [key, val] of Object.entries(settings)) {
      const stringValue = typeof val === "object" ? JSON.stringify(val) : String(val);
      const [existing] = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);

      if (existing) {
        await db
          .update(storeSettings)
          .set({ value: stringValue, updatedAt: new Date() })
          .where(eq(storeSettings.key, key));
      } else {
        await db.insert(storeSettings).values({ key, value: stringValue });
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
