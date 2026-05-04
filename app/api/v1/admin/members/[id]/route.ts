import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import Member from "@/lib/models/Member";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — single member (admin)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const member = await Member.findById(id).lean();
    if (!member) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("[GET /api/v1/admin/members/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch member" }, { status: 500 });
  }
}

// DELETE — delete member (admin)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const result = await Member.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/members/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete member" }, { status: 500 });
  }
}
