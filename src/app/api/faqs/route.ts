import { NextResponse } from "next/server";
import { getFaqs } from "@/lib/api/server";

export async function GET() {
  return NextResponse.json(await getFaqs());
}
