import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Event from "@/lib/models/Event";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list events (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip = (page - 1) * limit;

    await connectDB();
    const [events, total] = await Promise.all([
      Event.find().sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: events,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/events]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST — create event (admin)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json({ success: false, error: "title, date, time and location are required" }, { status: 400 });
    }
    await connectDB();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/events]", error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
