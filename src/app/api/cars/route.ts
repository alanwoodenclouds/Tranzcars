import { NextRequest, NextResponse } from "next/server";
import { getCars } from "@/lib/api/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cars = await getCars({
    transmission: searchParams.get("transmission") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    fuel: searchParams.get("fuel") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    slug: searchParams.get("slug") ?? undefined,
  });
  return NextResponse.json(cars);
}
