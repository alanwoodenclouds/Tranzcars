import { NextRequest, NextResponse } from "next/server";
import { createPortalBooking, fetchPortalBookings } from "@/lib/api/server";

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
  const rows = await fetchPortalBookings(token);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const token = bearer(request);
  if (!token) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Record<string, unknown>;
  const res = await createPortalBooking(token, body);
  if (!res.ok) {
    return NextResponse.json(
      res.data || { detail: "Could not create booking" },
      { status: res.status || 400 }
    );
  }
  return NextResponse.json(res.data, { status: 201 });
}
