import { NextResponse } from "next/server";
import { db } from "@/db";
import { storeSettings, reviews } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function GET() {
  try {
    await ensureDatabaseSeeded();

    const settingsRows = await db.select().from(storeSettings);
    const settingsMap: Record<string, string | string[]> = {};

    settingsRows.forEach((row) => {
      if (row.key === "announcement_messages") {
        try {
          settingsMap[row.key] = JSON.parse(row.value);
        } catch {
          settingsMap[row.key] = [row.value];
        }
      } else {
        settingsMap[row.key] = row.value;
      }
    });

    const reviewsList = await db.select().from(reviews).limit(10);

    return NextResponse.json({
      success: true,
      settings: settingsMap,
      reviews: reviewsList,
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load store settings" },
      { status: 500 }
    );
  }
}
