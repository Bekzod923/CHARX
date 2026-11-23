import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { vehicleSchema } from "@/lib/utils/validation";
import { hasAdminSession } from "@/lib/utils/require-admin";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const { id } = await params;
  const vehicle = await container.vehicleService.getById(id);
  if (!vehicle) return NextResponse.json({ error: "Автомобиль не найден" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = vehicleSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }
  const updated = await container.vehicleService.update(id, parsed.data);
  if (!updated) return NextResponse.json({ error: "Автомобиль не найден" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const { id } = await params;
  const removed = await container.vehicleService.remove(id);
  if (!removed) return NextResponse.json({ error: "Автомобиль не найден" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
