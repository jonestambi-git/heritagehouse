import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

interface ServiceSchedule {
  _id?: string;
  day: string;
  title: string;
  time: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const schedules = await db
      .collection("serviceSchedules")
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("Error fetching service schedules:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, title, time, description } = body;

    if (!day || !title || !time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: day, title, time" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const result = await db.collection("serviceSchedules").insertOne({
      day,
      title,
      time,
      description: description || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        day,
        title,
        time,
        description: description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating service schedule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, day, title, time, description } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Missing _id field" },
        { status: 400 }
      );
    }

    if (!day || !title || !time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: day, title, time" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const { ObjectId } = await import("mongodb");

    const result = await db.collection("serviceSchedules").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          day,
          title,
          time,
          description: description || "",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Service schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id,
        day,
        title,
        time,
        description: description || "",
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating service schedule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update service schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Missing _id field" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const { ObjectId } = await import("mongodb");

    const result = await db
      .collection("serviceSchedules")
      .deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Service schedule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service schedule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service schedule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete service schedule" },
      { status: 500 }
    );
  }
}
