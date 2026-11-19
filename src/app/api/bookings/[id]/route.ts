import { NextRequest, NextResponse } from "next/server";
import { fetchPortalBooking } from "@/lib/api/server";

function bearer(request: NextRequest) {
  const h = request.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1] || "";
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Ctx) {
  const token = bearer(request);
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  if (token.startsWith("mock-")) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  const booking = await fetchPortalBooking(token, id);
  if (!booking) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  return NextResponse.json(booking);
}
