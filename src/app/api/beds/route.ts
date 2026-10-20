import { NextRequest, NextResponse } from "next/server";
import { getBeds, updateBedStatus } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ward = searchParams.get("ward");
    const status = searchParams.get("status");

    let beds = await getBeds();
    if (ward) {
      beds = beds.filter((b) => b.wardName === ward);
    }
    if (status) {
      beds = beds.filter((b) => b.status === status);
    }

    return NextResponse.json({ success: true, data: beds });
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
    const { bedId, status, notes } = body;
    if (!bedId || !status) {
      return NextResponse.json(
        { success: false, error: "bedId and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateBedStatus(bedId, status, notes);
    return NextResponse.json({
      success: true,
      message: `Bed ${updated.bedNumber} status updated to ${status}`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
