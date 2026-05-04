import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import PrayerRequest from "@/lib/models/PrayerRequest";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list prayer requests (admin)
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
    const [requests, total] = await Promise.all([
      PrayerRequest.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      PrayerRequest.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: requests,
      total,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/prayer-requests]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch prayer requests" }, { status: 500 });
  }
}

// PATCH — mark as read (admin)
export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }
    await connectDB();
    const request = await PrayerRequest.findByIdAndUpdate(id, { $set: { read: true } }, { new: true }).lean();
    if (!request) {
      return NextResponse.json({ success: false, error: "Prayer request not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/prayer-requests]", error);
    return NextResponse.json({ success: false, error: "Failed to update prayer request" }, { status: 500 });
  }
}

// DELETE — delete prayer request (admin)
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "id is required" }, { status: 400 });
    }
    await connectDB();
    const result = await PrayerRequest.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: "Prayer request not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Prayer request deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/prayer-requests]", error);
    return NextResponse.json({ success: false, error: "Failed to delete prayer request" }, { status: 500 });
  }
}
