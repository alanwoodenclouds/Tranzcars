import { NextRequest, NextResponse } from "next/server";
import {
  createPortalBooking,
  fetchPortalBookings,
} from "@/lib/api/server";
import { mapPortalBooking, type PortalBooking } from "@/lib/api/portal";

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
    return NextResponse.json([]);
  }
  const status = request.nextUrl.searchParams.get("status") || undefined;
  const rows = await fetchPortalBookings(token, status);
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
  if (res.data && typeof res.data === "object" && "variant" in res.data) {
    return NextResponse.json(mapPortalBooking(res.data as PortalBooking), {
      status: 201,
    });
  }
  return NextResponse.json(res.data, { status: 201 });
}
