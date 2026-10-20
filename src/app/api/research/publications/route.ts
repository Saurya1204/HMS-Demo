import { NextRequest, NextResponse } from "next/server";
import {
  createPublication,
  getPublications,
  updatePublicationStatus,
} from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    let pubs = await getPublications();
    if (status) {
      pubs = pubs.filter((p) => p.status === status);
    }
    return NextResponse.json({ success: true, data: pubs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Publication title is required." },
        { status: 400 }
      );
    }

    const pub = await createPublication(body);
    return NextResponse.json(
      {
        success: true,
        message: "Publication manuscript submitted successfully.",
        data: pub,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Publication ID and status are required." },
        { status: 400 }
      );
    }

    const updated = await updatePublicationStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Publication not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Publication review status updated to ${status}.`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
