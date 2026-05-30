import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import LiveSettings from "@/lib/models/LiveSettings";

export async function GET() {
  try {
    await connectDB();
    
    const settings = await LiveSettings.findOne().lean();
    
    return NextResponse.json({
      success: true,
      data: settings || {
        streamUrl: "",
        title: "Sunday Service",
        description: "Join us live for worship and the Word.",
        isLive: false,
        previousStreams: [],
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/livestream/active]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch livestream settings" },
      { status: 500 }
    );
  }
}
