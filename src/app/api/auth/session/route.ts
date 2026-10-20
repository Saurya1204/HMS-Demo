import { NextRequest, NextResponse } from "next/server";
import { getUserById, getUsers } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const roleCookie = req.cookies.get("sbm_user_role")?.value;
    const idCookie = req.cookies.get("sbm_user_id")?.value;

    const users = await getUsers();
    let current = null;

    if (idCookie) {
      current = users.find((u) => u.id === idCookie);
    } else if (roleCookie) {
      current = users.find((u) => u.role === roleCookie);
    }

    if (!current) {
      current = users.find((u) => u.role === "doctor") || users[0];
    }

    const { passwordHash, ...safeUser } = current;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.delete("sbm_user_role");
  response.cookies.delete("sbm_user_id");
  return response;
}
