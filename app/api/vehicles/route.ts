import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { vehicleSchema } from "@/lib/utils/validation";
import { hasAdminSession } from "@/lib/utils/require-admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const vehicles = await container.vehicleService.listForAdmin();
  return NextResponse.json(vehicles);
}

export async function POST(request: NextRequest) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }
  const vehicle = await container.vehicleService.create(parsed.data);
  return NextResponse.json(vehicle, { status: 201 });
}
