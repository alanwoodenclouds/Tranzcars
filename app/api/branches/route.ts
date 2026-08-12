import { NextResponse } from "next/server";
import { getBranches } from "@/lib/api/server";

export async function GET() {
  const branches = await getBranches();
  return NextResponse.json(branches);
}
