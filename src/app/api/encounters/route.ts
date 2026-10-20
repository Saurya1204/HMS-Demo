import { NextRequest, NextResponse } from "next/server";
import { createEncounter, getEncounters } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    let encounters = await getEncounters();
    if (patientId) {
      encounters = encounters.filter((e) => e.patientId === patientId);
    }

    return NextResponse.json({ success: true, data: encounters });
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
    const encounter = await createEncounter(body);
    return NextResponse.json(
      {
        success: true,
        message: "Clinical encounter saved and prescriptions issued.",
        data: encounter,
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
