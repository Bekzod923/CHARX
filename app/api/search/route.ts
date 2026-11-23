import { NextRequest, NextResponse } from "next/server";
import { container } from "@/lib/di/container";
import { searchQuerySchema } from "@/lib/utils/validation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  const parsed = searchQuerySchema.safeParse(q);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некорректный запрос" }, { status: 400 });
  }

  const report = await container.reportService.generateByQuery(parsed.data);
  if (!report) {
    return NextResponse.json({ error: "Автомобиль не найден в базе данных" }, { status: 404 });
  }

  return NextResponse.json(report);
}
