import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Ministry from "@/lib/models/Ministry";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list ministries (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip = (page - 1) * limit;

    await connectDB();
    const [ministries, total] = await Promise.all([
      Ministry.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Ministry.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: ministries,
      total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/v1/ministries]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ministries" }, { status: 500 });
  }
}

// POST — create ministry (admin)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.name || !body.leader || !body.meets) {
      return NextResponse.json({ success: false, error: "name, leader and meets are required" }, { status: 400 });
    }
    await connectDB();
    const ministry = await Ministry.create(body);
    return NextResponse.json({ success: true, data: ministry }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/ministries]", error);
    return NextResponse.json({ success: false, error: "Failed to create ministry" }, { status: 500 });
  }
}
