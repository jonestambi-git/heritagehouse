import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Member from "@/lib/models/Member";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list members (admin)
export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "25", 10));
    const skip = (page - 1) * limit;

    await connectDB();
    const [members, total] = await Promise.all([
      Member.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Member.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: members,
      total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/v1/members]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 });
  }
}

// POST — add member (admin)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.fullName || !body.email) {
      return NextResponse.json({ success: false, error: "fullName and email are required" }, { status: 400 });
    }
    await connectDB();
    const member = await Member.create(body);
    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/members]", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "A member with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create member" }, { status: 500 });
  }
}
