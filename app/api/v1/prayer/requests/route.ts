import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import PrayerRequest from "@/lib/models/PrayerRequest";

// POST — submit prayer request (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, error: "name, email and message are required" }, { status: 400 });
    }
    await connectDB();
    const request = await PrayerRequest.create(body);
    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/prayer/requests]", error);
    return NextResponse.json({ success: false, error: "Failed to submit prayer request" }, { status: 500 });
  }
}
