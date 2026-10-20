import { NextRequest, NextResponse } from "next/server";
import {
  allocateBed,
  dischargeBed,
  transferBed,
  updateBedStatus,
} from "@/lib/data-store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const bedId = resolvedParams.id;
    const body = await req.json();
    const { action, patientId, doctor, diagnosis, targetBedId, status, notes } =
      body;

    if (action === "assign" || action === "allocate") {
      if (!patientId) {
        return NextResponse.json(
          { success: false, error: "patientId is required for bed allocation" },
          { status: 400 }
        );
      }
      const res = await allocateBed(bedId, patientId, diagnosis, doctor);
      return NextResponse.json({
        success: true,
        message: `Patient ${res.patient.name} allocated to Bed ${res.bed.bedNumber}`,
        data: res,
      });
    }

    if (action === "discharge") {
      const res = await dischargeBed(bedId);
      return NextResponse.json({
        success: true,
        message: `Discharge complete. Bed ${res.bed.bedNumber} marked for cleaning/maintenance.`,
        data: res,
      });
    }

    if (action === "transfer") {
      const destinationId = targetBedId || body.toBedId;
      if (!destinationId) {
        return NextResponse.json(
          { success: false, error: "targetBedId is required for bed transfer" },
          { status: 400 }
        );
      }
      const res = await transferBed(bedId, destinationId);
      return NextResponse.json({
        success: true,
        message: `Patient transferred from ${res.fromBed.bedNumber} to ${res.toBed.wardName} (${res.toBed.bedNumber})`,
        data: res,
      });
    }

    if (action === "status" && status) {
      const updated = await updateBedStatus(bedId, status, notes);
      return NextResponse.json({
        success: true,
        message: `Bed operational status changed to ${status}`,
        data: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid bed action" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  return POST(req, context);
}
