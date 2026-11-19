import { NextRequest, NextResponse } from "next/server";
import { cancelPortalBooking } from "@/lib/api/server";

function bearer(request: NextRequest) {
  const h = request.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1] || "";
}

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Ctx) {
  const token = bearer(request);
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  if (token.startsWith("mock-")) {
    return NextResponse.json({ ok: true, id, status: "cancelled" });
  }
  const res = await cancelPortalBooking(token, id);
  if (!res.ok) {
    return NextResponse.json(
      { detail: res.message || "Could not cancel" },
      { status: res.status || 400 }
    );
  }
  return NextResponse.json(res.booking || { ok: true });
}
