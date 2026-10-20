import { NextRequest, NextResponse } from "next/server";
import {
  createPatient,
  getPatients,
  getReferrals,
  updatePatient,
  updateReferralStatus,
} from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const referrals = await getReferrals();
    const patients = await getPatients();
    const ammaPatients = patients.filter((p) => p.source === "AMMA_Clinic");

    let combined = referrals;
    if (status) {
      combined = combined.filter((r) => r.status === status);
    }

    return NextResponse.json({
      success: true,
      data: combined,
      patients: ammaPatients,
    });
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

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const tokenQr = body.tokenQr || `AMMA-TK-${randomSeq}`;

    const referralData = {
      ...body,
      source: "AMMA_Clinic",
      status: "Referred_AMMA",
      tokenQr,
    };

    const newPatient = await createPatient(referralData);
    return NextResponse.json(
      {
        success: true,
        message: "Referral sent to SBM Hospital Reception desk successfully",
        data: newPatient,
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, referralNumber, patientId, status, arrivalTime } = body;

    const targetId = id || referralNumber || patientId;
    if (!targetId || !status) {
      return NextResponse.json(
        { success: false, error: "Referral ID/number and status are required." },
        { status: 400 }
      );
    }

    const updated = await updateReferralStatus(targetId, status);

    // Also update patient status if corresponding patientId exists
    if (patientId) {
      let patStatus: any = "Reception_Waiting";
      if (status === "OPD_Registered") patStatus = "Reception_Waiting";
      if (status === "Admitted_IPD") patStatus = "Admitted_IPD";
      await updatePatient(patientId, { status: patStatus });
    }

    return NextResponse.json({
      success: true,
      message: `Referral status updated to ${status}`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
