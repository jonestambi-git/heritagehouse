import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Sermon from "@/lib/models/Sermon";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// GET — list all sermons
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const sermons = await Sermon.find().sort({ dateISO: -1 }).lean();
    return NextResponse.json({ success: true, data: sermons });
  } catch (error) {
    console.error("[GET /api/v1/admin/sermons]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch sermons" }, { status: 500 });
  }
}

// POST — create sermon
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.title || !body.tag || !body.pastor) {
      return NextResponse.json({ success: false, error: "title, tag and pastor are required" }, { status: 400 });
    }
    await connectDB();
    const slug = body.slug || generateSlug(body.title);

    // Auto-generate date from dateISO if not provided
    const date = body.date || (body.dateISO
      ? new Date(body.dateISO).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        }));

    const sermon = await Sermon.create({ ...body, slug, date });
    return NextResponse.json({ success: true, data: sermon }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/v1/admin/sermons]", error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "A sermon with this slug already exists" }, { status: 409 });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message).join(", ");
      return NextResponse.json({ success: false, error: `Validation failed: ${messages}` }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create sermon" }, { status: 500 });
  }
}

// PUT — update sermon
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.slug) {
      return NextResponse.json({ success: false, error: "slug is required" }, { status: 400 });
    }
    await connectDB();
    const sermon = await Sermon.findOneAndUpdate(
      { slug: body.slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();
    if (!sermon) {
      return NextResponse.json({ success: false, error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: sermon });
  } catch (error) {
    console.error("[PUT /api/v1/admin/sermons]", error);
    return NextResponse.json({ success: false, error: "Failed to update sermon" }, { status: 500 });
  }
}

// DELETE — delete sermon
export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: "slug is required" }, { status: 400 });
    }
    await connectDB();
    const result = await Sermon.findOneAndDelete({ slug });
    if (!result) {
      return NextResponse.json({ success: false, error: "Sermon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Sermon deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/sermons]", error);
    return NextResponse.json({ success: false, error: "Failed to delete sermon" }, { status: 500 });
  }
}
