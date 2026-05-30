import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import LiveSettings from "@/lib/models/LiveSettings";

async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
  } catch {
    return false;
  }
}

// GET — fetch livestream settings (public)
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
    console.error("[GET /api/v1/livestream]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch livestream settings" },
      { status: 500 }
    );
  }
}

// POST — create/update livestream settings (admin)
export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { streamUrl, title, description } = body;

    if (!streamUrl) {
      return NextResponse.json(
        { success: false, error: "streamUrl is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let settings = await LiveSettings.findOne();
    if (!settings) {
      settings = new LiveSettings();
    }

    settings.streamUrl = streamUrl;
    settings.title = title || "Sunday Service";
    settings.description = description || "Join us live for worship and the Word.";
    settings.isLive = false;

    await settings.save();

    return NextResponse.json({ success: true, data: settings }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/livestream]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create livestream settings" },
      { status: 500 }
    );
  }
}

// PUT — go live or end stream (admin)
export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const action = searchParams.get("action");

    if (!action || !["go-live", "end"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'go-live' or 'end'" },
        { status: 400 }
      );
    }

    await connectDB();

    let settings = await LiveSettings.findOne();
    if (!settings) {
      settings = new LiveSettings();
    }

    if (action === "go-live") {
      if (!settings.streamUrl) {
        return NextResponse.json(
          { success: false, error: "Stream URL must be set before going live" },
          { status: 400 }
        );
      }
      settings.isLive = true;
    } else if (action === "end") {
      settings.isLive = false;

      // Archive the stream to previousStreams
      if (settings.streamUrl) {
        const now = new Date();
        const previousStream = {
          id: `stream-${now.getTime()}`,
          streamUrl: settings.streamUrl,
          title: settings.title || "Sunday Service",
          description: settings.description || "",
          date: now.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        };

        if (!settings.previousStreams) {
          settings.previousStreams = [];
        }
        settings.previousStreams.unshift(previousStream);

        // Keep only last 20 streams
        if (settings.previousStreams.length > 20) {
          settings.previousStreams = settings.previousStreams.slice(0, 20);
        }
      }
    }

    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[PUT /api/v1/livestream]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update livestream" },
      { status: 500 }
    );
  }
}
