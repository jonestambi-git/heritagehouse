import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import News from "@/lib/models/News";

// GET — public: returns all active news
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip = (page - 1) * limit;

    await connectDB();
    const [news, total] = await Promise.all([
      News.find({ active: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      News.countDocuments({ active: true }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: news,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/news]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}
