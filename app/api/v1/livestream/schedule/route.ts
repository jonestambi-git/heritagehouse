import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import LiveSettings from "@/lib/models/LiveSettings";

export async function GET() {
  try {
    await connectDB();
    
    const settings = await LiveSettings.findOne().lean();
    const previousStreams = settings?.previousStreams || [];
    
    return NextResponse.json({
      success: true,
      data: previousStreams,
    });
  } catch (error) {
    console.error("[GET /api/v1/livestream/schedule]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch livestream schedule" },
      { status: 500 }
    );
  }
}
