import { NextResponse } from "next/server";
import { getSettings } from "@/lib/api/server";

export async function GET() {
  return NextResponse.json(await getSettings());
}
