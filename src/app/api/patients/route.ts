import { NextRequest, NextResponse } from "next/server";
import { createPatient, getPatients, updatePatient } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get("source");
    const status = searchParams.get("status");

    let patients = await getPatients();
    if (source) {
      patients = patients.filter((p) => p.source === source);
    }
    if (status) {
      patients = patients.filter((p) => p.status === status);
    }

    return NextResponse.json({ success: true, data: patients });
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
    const newPatient = await createPatient(body);
    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Patient ID required" },
        { status: 400 }
      );
    }

    const updated = await updatePatient(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
