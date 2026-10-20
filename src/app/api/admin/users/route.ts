import { NextRequest, NextResponse } from "next/server";
import { getUsers, toggleUserActive, updateUserRole } from "@/lib/data-store";

export async function GET() {
  try {
    const users = await getUsers();
    // Do not return passwordHash
    const sanitized = users.map((u) => {
      const { passwordHash, ...safe } = u;
      return safe;
    });
    return NextResponse.json({ success: true, data: sanitized });
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
    const { userId, role, action } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required." },
        { status: 400 }
      );
    }

    if (action === "toggleActive") {
      const updated = await toggleUserActive(userId);
      return NextResponse.json({
        success: true,
        message: "User status toggled.",
        data: updated,
      });
    }

    if (role) {
      const updated = await updateUserRole(userId, role);
      return NextResponse.json({
        success: true,
        message: `User role updated to ${role}.`,
        data: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or role parameter." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
