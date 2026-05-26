import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "hhmmedia@gmail.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "hhmmedia2026-franklin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Normalize email and password for comparison
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.trim();
    const expectedEmail = ADMIN_EMAIL.toLowerCase().trim();
    const expectedPassword = ADMIN_PASSWORD.trim();

    // Debug logging - detailed
    console.log("[LOGIN DEBUG]", {
      providedEmail: normalizedEmail,
      providedEmailLength: normalizedEmail.length,
      providedPassword: normalizedPassword?.substring(0, 3) + "***",
      providedPasswordLength: normalizedPassword.length,
      expectedEmail: expectedEmail,
      expectedEmailLength: expectedEmail.length,
      expectedPassword: expectedPassword?.substring(0, 3) + "***",
      expectedPasswordLength: expectedPassword.length,
      emailMatch: normalizedEmail === expectedEmail,
      passwordMatch: normalizedPassword === expectedPassword,
      emailChars: normalizedEmail.split('').map((c: string) => c.charCodeAt(0)),
      expectedEmailChars: expectedEmail.split('').map((c: string) => c.charCodeAt(0)),
    });

    if (normalizedEmail !== expectedEmail || normalizedPassword !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/admin/login]", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
