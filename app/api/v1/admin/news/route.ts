import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import News from "@/lib/models/News";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — list all news (admin, includes inactive)
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const news = await News.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("[GET /api/v1/admin/news]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST — create news
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.title || !body.message) {
      return NextResponse.json({ success: false, error: "title and message are required" }, { status: 400 });
    }
    await connectDB();
    const news = await News.create(body);
    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/admin/news]", error);
    return NextResponse.json({ success: false, error: "Failed to create news" }, { status: 500 });
  }
}

// PUT — update news
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body._id) {
      return NextResponse.json({ success: false, error: "_id is required" }, { status: 400 });
    }
    await connectDB();
    const news = await News.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    if (!news) {
      return NextResponse.json({ success: false, error: "News not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("[PUT /api/v1/admin/news]", error);
    return NextResponse.json({ success: false, error: "Failed to update news" }, { status: 500 });
  }
}

// DELETE — delete news
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ success: false, error: "_id is required" }, { status: 400 });
    }
    await connectDB();
    const result = await News.findByIdAndDelete(_id);
    if (!result) {
      return NextResponse.json({ success: false, error: "News not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "News deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/news]", error);
    return NextResponse.json({ success: false, error: "Failed to delete news" }, { status: 500 });
  }
}
