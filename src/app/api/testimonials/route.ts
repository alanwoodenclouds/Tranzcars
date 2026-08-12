import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/api/server";

export async function GET() {
  return NextResponse.json(await getTestimonials());
}
