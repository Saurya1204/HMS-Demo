import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
  response.cookies.delete("sbm_user_role");
  response.cookies.delete("sbm_user_id");
  return response;
}

export async function GET() {
  return POST();
}
