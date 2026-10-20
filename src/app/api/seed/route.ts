import { NextResponse } from "next/server";
import { resetAndSeed } from "@/lib/data-store";

export async function POST() {
  try {
    const res = await resetAndSeed();
    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
