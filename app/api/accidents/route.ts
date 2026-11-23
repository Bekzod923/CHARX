import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { accidentSchema } from "@/lib/utils/validation";
import { hasAdminSession } from "@/lib/utils/require-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const vehicleId = request.nextUrl.searchParams.get("vehicleId");
  const accidents = vehicleId
    ? await container.accidentService.getTimelineForVehicle(vehicleId)
    : await container.accidentService.listAll();
  return NextResponse.json(accidents);
}

export async function POST(request: NextRequest) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = accidentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }
  const accident = await container.accidentService.create(parsed.data as any);
  return NextResponse.json(accident, { status: 201 });
}
