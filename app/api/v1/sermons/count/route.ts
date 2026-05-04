import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Sermon from "@/lib/models/Sermon";

// GET — total sermon count
export async function GET() {
  try {
    await connectDB();
    const total = await Sermon.countDocuments();
    return NextResponse.json({ success: true, data: { total } });
  } catch (error) {
    console.error("[GET /api/v1/sermons/count]", error);
    return NextResponse.json({ success: false, error: "Failed to count sermons" }, { status: 500 });
  }
}
