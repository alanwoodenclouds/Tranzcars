import { NextRequest, NextResponse } from "next/server";
import { fetchPortalMe, setPortalPassword, updatePortalMe } from "@/lib/api/server";

function bearer(request: NextRequest) {
  const h = request.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1] || "";
}

export async function GET(request: NextRequest) {
  const token = bearer(request);
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  if (token.startsWith("mock-")) {
    return NextResponse.json({
      id: 0,
      mobile: null,
      email: "",
      name: "Guest Driver",
      status: "active",
      mobile_bound: false,
    });
  }
  const me = await fetchPortalMe(token);
  if (!me) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(me);
}

export async function PATCH(request: NextRequest) {
  const token = bearer(request);
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (body.password) {
    const pw = await setPortalPassword(token, body.password);
    if (!pw.ok) {
      return NextResponse.json(pw, { status: 400 });
    }
  }
  const me = await updatePortalMe(token, {
    name: body.name,
    email: body.email,
  });
  if (!me) {
    return NextResponse.json({ detail: "Could not update profile" }, { status: 400 });
  }
  return NextResponse.json(me);
}
