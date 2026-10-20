import { NextRequest, NextResponse } from "next/server";
import { createAppointment, getAppointments, updateAppointmentStatus } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");

    let apts = await getAppointments();
    if (department) {
      apts = apts.filter((a) =>
        a.department.toLowerCase().includes(department.toLowerCase())
      );
    }
    if (status) {
      apts = apts.filter((a) => a.status === status);
    }

    return NextResponse.json({ success: true, data: apts });
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
    if (!body.patientName || !body.contact) {
      return NextResponse.json(
        { success: false, error: "Patient name and contact are required." },
        { status: 400 }
      );
    }

    const appointment = await createAppointment(body);
    return NextResponse.json(
      {
        success: true,
        message: "OPD Appointment booked successfully.",
        data: appointment,
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
        { success: false, error: "Appointment ID and target status are required." },
        { status: 400 }
      );
    }

    const updated = await updateAppointmentStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Appointment updated to ${status}.`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
