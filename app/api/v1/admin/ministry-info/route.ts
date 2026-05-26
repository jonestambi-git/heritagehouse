import { NextRequest, NextResponse } from "next/server";

export interface MinistryInfo {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  order: number;
}

// In-memory storage (replace with database in production)
let ministryInfoData: MinistryInfo[] = [
  {
    _id: "1",
    title: "Senior Pastor",
    description: "Dr. Franklin Ede is the Senior Pastor of HeritageHouse Ministries, Port Harcourt, Nigeria. He is a Chartered Accountant, Healing Evangelist, generational prophet and quintessential leader with a passion for transforming lives through the Gospel of Jesus Christ.",
    order: 1,
  },
  {
    _id: "2",
    title: "Our Mandate",
    description: "We are called to 'Heal the world, rescue mankind from the grips of the devil and make all men prosper through the preaching of the word of grace'. This mandate drives everything we do — from our worship to our outreach, from our teaching to our community service.",
    order: 2,
  },
  {
    _id: "3",
    title: "Our Vision",
    description: "1. To be a place where the hurting, depressed, frustrated and confused can find love, acceptance, help, direction, hope, forgiveness and encouragement.\n\n2. To build an International Charismatic Ministry and become those who impact their communities with exceptional excellent service, combined with the prophetic gift and miraculous to help believers grow up spiritually, intellectually and emotionally.",
    order: 3,
  },
  {
    _id: "4",
    title: "Our Beliefs",
    description: "1. We believe in one God who manifested in three personalities: Father, Son and Holy Spirit.\n\n2. We believe in the pursuit of godliness, righteousness, holiness, sanctification and the death of Christ to save man from sin and make all prosper through the application of Grace.\n\n3. We believe in the present supernatural ministry of the Holy Spirit who bestows the spiritual gifts of prophecy, the word of wisdom, the workings of miracles, faith, discerning of spirits, divers kinds of tongues, interpretation of tongues and healing.",
    order: 4,
  },
];

// GET - Fetch all ministry info
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: ministryInfoData.sort((a, b) => a.order - b.order),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ministry info" },
      { status: 500 }
    );
  }
}

// POST - Create new ministry info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, order } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newInfo: MinistryInfo = {
      _id: Date.now().toString(),
      title,
      description,
      image,
      order: order ?? ministryInfoData.length + 1,
    };

    ministryInfoData.push(newInfo);

    return NextResponse.json(
      { success: true, data: newInfo },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create ministry info" },
      { status: 500 }
    );
  }
}

// PUT - Update ministry info
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, title, description, image, order } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const index = ministryInfoData.findIndex((item) => item._id === _id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Ministry info not found" },
        { status: 404 }
      );
    }

    ministryInfoData[index] = {
      ...ministryInfoData[index],
      title: title ?? ministryInfoData[index].title,
      description: description ?? ministryInfoData[index].description,
      image: image ?? ministryInfoData[index].image,
      order: order ?? ministryInfoData[index].order,
    };

    return NextResponse.json({
      success: true,
      data: ministryInfoData[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update ministry info" },
      { status: 500 }
    );
  }
}

// DELETE - Delete ministry info
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const index = ministryInfoData.findIndex((item) => item._id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Ministry info not found" },
        { status: 404 }
      );
    }

    const deleted = ministryInfoData.splice(index, 1);

    return NextResponse.json({
      success: true,
      data: deleted[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete ministry info" },
      { status: 500 }
    );
  }
}
