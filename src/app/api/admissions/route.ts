import { NextRequest, NextResponse } from "next/server";
import { getAdmissions, allocateBed } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ward = searchParams.get("ward");
    const status = searchParams.get("status");

    let admissions = await getAdmissions();
    if (ward) {
      admissions = admissions.filter((a) => a.wardName === ward);
    }
    if (status) {
      admissions = admissions.filter((a) => a.status === status);
    }

    return NextResponse.json({ success: true, data: admissions });
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
    const { bedId, patientId, diagnosis, doctor } = body;

    if (!bedId || !patientId) {
      return NextResponse.json(
        { success: false, error: "bedId and patientId are required." },
        { status: 400 }
      );
    }

    const result = await allocateBed(bedId, patientId, diagnosis, doctor);
    return NextResponse.json(
      {
        success: true,
        message: "Patient admitted to bed successfully.",
        data: result,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
