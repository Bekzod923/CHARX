import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { accidentSchema } from "@/lib/utils/validation";
import { hasAdminSession } from "@/lib/utils/require-admin";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = accidentSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" }, { status: 400 });
  }
  const updated = await container.accidentService.update(id, parsed.data as any);
  if (!updated) return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }
  const { id } = await params;
  const removed = await container.accidentService.remove(id);
  if (!removed) return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
