import { NextResponse } from "next/server";
import { getLocation } from "@/app/actions/location";

export async function GET() {
  try {
    const location = await getLocation();
    return NextResponse.json({ department: location?.department || null });
  } catch {
    return NextResponse.json({ department: null });
  }
}
