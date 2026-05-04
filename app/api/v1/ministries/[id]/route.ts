import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Ministry from "@/lib/models/Ministry";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// PUT — update ministry (admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const ministry = await Ministry.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).lean();
    if (!ministry) {
      return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: ministry });
  } catch (error) {
    console.error("[PUT /api/v1/ministries/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update ministry" }, { status: 500 });
  }
}

// DELETE — delete ministry (admin)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const result = await Ministry.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: "Ministry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Ministry deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/ministries/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete ministry" }, { status: 500 });
  }
}
