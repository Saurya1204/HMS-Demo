import { NextRequest, NextResponse } from "next/server";
import { addAuditLog, getAuditLogs } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const module = searchParams.get("module");
    const search = searchParams.get("search");

    let logs = await getAuditLogs();

    if (module && module !== "All") {
      logs = logs.filter((l) => l.module === module);
    }

    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.actor.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          (l.recordRef && l.recordRef.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, data: logs });
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
    const { action, actor, module, details, recordRef, outcome } = body;

    const log = await addAuditLog(
      action || "Admin Operation",
      actor || "Administrator",
      module || "Admin",
      details || "Operation executed",
      recordRef,
      outcome || "Success"
    );

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
