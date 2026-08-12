import { NextRequest, NextResponse } from "next/server";
import { sendOtp, verifyOtp } from "@/lib/api/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    action: "send" | "verify";
    mobile: string;
    otp?: string;
  };

  if (body.action === "send") {
    const result = await sendOtp(body.mobile);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "verify") {
    const result = await verifyOtp(body.mobile, body.otp ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({ ok: false, message: "Invalid action" }, { status: 400 });
}
