import { NextResponse } from "next/server";
import { container } from "@/lib/di/container";

export const runtime = "nodejs";

export async function GET() {
  const stats = await container.statsService.getStats();
  return NextResponse.json(stats);
}
