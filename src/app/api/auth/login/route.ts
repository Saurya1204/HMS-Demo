import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/data-store";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;
    const users = await getUsers();

    // 1. One-click demo role shortcut
    if (role) {
      const matched = users.find((u) => u.role === role);
      if (matched) {
        const { passwordHash, ...safeUser } = matched;
        const response = NextResponse.json({
          success: true,
          message: `Authenticated as ${safeUser.name} (${safeUser.role})`,
          user: safeUser,
        });
        // Set demo session cookie
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
      }
    }

    // 2. Email + password verification
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. User not found." },
        { status: 401 }
      );
    }

    if (user.active === false) {
      return NextResponse.json(
        { success: false, error: "Account is disabled. Contact administrator." },
        { status: 403 }
      );
    }

    // If password is "demo123" or matches passwordHash
    const isMatch =
      password === "demo123" ||
      (user.passwordHash && bcrypt.compareSync(password, user.passwordHash));

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid password." },
        { status: 401 }
      );
    }

    const { passwordHash, ...safeUser } = user;
    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${safeUser.name}`,
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
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
