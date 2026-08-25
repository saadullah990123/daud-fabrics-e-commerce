import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession } from "@/lib/auth";
import { ensureDatabaseSeeded } from "@/lib/ensure-seed";

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    const admin = await verifyAdminPassword(email, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password. Only authorized admin accounts can log in." },
        { status: 401 }
      );
    }

    await setAdminSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
