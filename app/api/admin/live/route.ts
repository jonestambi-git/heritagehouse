import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import { defaultLiveSettings, type LiveSettings, type PreviousStream } from "@/lib/live-data";
import { randomUUID } from "crypto";

const FILE = "live.json";

export async function GET() {
  return NextResponse.json(readJSON<LiveSettings>(FILE, defaultLiveSettings));
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const current = readJSON<LiveSettings>(FILE, defaultLiveSettings);

  // If going from live → not live, archive the stream automatically
  if (current.isLive && !body.isLive && current.streamUrl) {
    const archive: PreviousStream = {
      id: randomUUID(),
      title: current.title || "Untitled stream",
      description: current.description || "",
      streamUrl: current.streamUrl,
      date: new Date().toISOString().split("T")[0],
    };
    body.previousStreams = [archive, ...(current.previousStreams ?? [])];
  } else {
    body.previousStreams = body.previousStreams ?? current.previousStreams ?? [];
  }

  writeJSON(FILE, body);
  return NextResponse.json({ ok: true });
}

// PUT — update a previous stream
export async function PUT(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const updated: PreviousStream = await req.json();
  const settings = readJSON<LiveSettings>(FILE, defaultLiveSettings);
  settings.previousStreams = (settings.previousStreams ?? []).map((s) =>
    s.id === updated.id ? { ...s, ...updated } : s
  );
  writeJSON(FILE, settings);
  return NextResponse.json({ ok: true });
}

// DELETE — remove a previous stream
export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const settings = readJSON<LiveSettings>(FILE, defaultLiveSettings);
  settings.previousStreams = (settings.previousStreams ?? []).filter((s) => s.id !== id);
  writeJSON(FILE, settings);
  return NextResponse.json({ ok: true });
}
