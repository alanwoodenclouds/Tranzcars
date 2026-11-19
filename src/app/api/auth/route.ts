import { NextRequest, NextResponse } from "next/server";
import {
  bindMobileSend,
  bindMobileVerify,
  getAuthConfig,
  googleLogin,
  passwordLogin,
  sendEmailOtp,
  sendOtp,
  verifyEmailOtp,
  verifyOtp,
} from "@/lib/api/server";

type AuthBody = {
  action:
    | "config"
    | "send"
    | "verify"
    | "email_send"
    | "email_verify"
    | "password_login"
    | "google"
    | "bind_send"
    | "bind_verify";
  mobile?: string;
  email?: string;
  password?: string;
  otp?: string;
  id_token?: string;
  token?: string;
};

export async function GET() {
  const config = await getAuthConfig();
  return NextResponse.json(config);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AuthBody;

  if (body.action === "config") {
    return NextResponse.json(await getAuthConfig());
  }

  if (body.action === "send") {
    const result = await sendOtp(body.mobile ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "verify") {
    const result = await verifyOtp(body.mobile ?? "", body.otp ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "email_send") {
    const result = await sendEmailOtp(body.email ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "email_verify") {
    const result = await verifyEmailOtp(body.email ?? "", body.otp ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "password_login") {
    const result = await passwordLogin(body.email ?? "", body.password ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "google") {
    const result = await googleLogin(body.id_token ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "bind_send") {
    const result = await bindMobileSend(body.token ?? "", body.mobile ?? "");
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  if (body.action === "bind_verify") {
    const result = await bindMobileVerify(
      body.token ?? "",
      body.mobile ?? "",
      body.otp ?? ""
    );
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  return NextResponse.json({ ok: false, message: "Invalid action" }, { status: 400 });
}
