import { NextRequest, NextResponse } from "next/server";
import { updateProjectMilestone } from "@/lib/data-store";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, milestoneId, status, targetDate } = body;

    if (!projectId || !milestoneId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "projectId, milestoneId, and status are required.",
        },
        { status: 400 }
      );
    }

    const updated = await updateProjectMilestone(
      projectId,
      milestoneId,
      status,
      targetDate
    );
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Research project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Research milestone and progress updated successfully.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
