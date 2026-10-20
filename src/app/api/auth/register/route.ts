import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/data-store";
import { UserRole } from "@/types";

const ALLOWED_ROLES: UserRole[] = [
  "admin",
  "doctor",
  "receptionist",
  "nurse",
  "researcher",
  "patient",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, department } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required." },
        { status: 400 }
      );
    }

    if (!role || !ALLOWED_ROLES.includes(role as UserRole)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role selected. Must be one of: ${ALLOWED_ROLES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      name: name.trim(),
      email: email.trim(),
      role: role as UserRole,
      password: password || "demo123",
      department: department?.trim(),
    });

    const { passwordHash, ...safeUser } = newUser;

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully for ${safeUser.name} (${safeUser.role.toUpperCase()})`,
      user: safeUser,
    });

    response.cookies.set("sbm_user_role", safeUser.role, {
      path: "/",
      httpOnly: false,
      maxAge: 86400,
    });
    response.cookies.set("sbm_user_id", safeUser.id, {
      path: "/",
      httpOnly: false,
      maxAge: 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register user." },
      { status: 400 }
    );
  }
}
