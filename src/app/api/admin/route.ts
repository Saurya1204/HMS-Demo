import { NextRequest, NextResponse } from "next/server";
import { addAuditLog, getAdminKPIs, getAuditLogs } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleFilter = searchParams.get("module");

    const kpis = await getAdminKPIs();
    let logs = await getAuditLogs();

    if (moduleFilter && moduleFilter !== "All") {
      logs = logs.filter((l) => l.module === moduleFilter);
    }

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        logs,
      },
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
    const { action, actor, module, details } = body;

    const log = await addAuditLog(
      action || "Admin Operation",
      actor || "Admin Officer",
      module || "Admin",
      details || "System action logged"
    );

    return NextResponse.json({ success: true, data: log });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
