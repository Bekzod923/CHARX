"use client";

import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/hooks/use-translation";
import { buildMileageSeries, MileageChartPoint } from "@/lib/utils/mileage-chart";
import { formatDateShort, formatNumber } from "@/lib/utils/format";
import { translateMileageSource } from "@/lib/i18n/domain-labels";
import { VehicleRecord } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function ChartTooltip({
  active,
  payload,
  dict,
  locale,
}: {
  active?: boolean;
  payload?: { payload: MileageChartPoint & { label: string } }[];
  dict: ReturnType<typeof useTranslation>["dict"];
  locale: ReturnType<typeof useTranslation>["locale"];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 text-xs shadow-lifted dark:border-ink-700 dark:bg-ink-800">
      <p className="font-semibold text-ink-800 dark:text-white">{point.label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-ink-600 dark:text-ink-300">
        <span className={cn("h-2 w-2 rounded-full", point.isDiscrepancy ? "bg-danger-500" : "bg-accent-500")} />
        {dict.mileageChart.tooltipCurrent}: {formatNumber(point.actual, locale)} {dict.mileageChart.kmAxisLabel}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-ink-400 dark:text-ink-500">
        <span className="h-2 w-2 rounded-full border border-ink-300 dark:border-ink-600" />
        {dict.mileageChart.tooltipAverage}: {formatNumber(point.average, locale)} {dict.mileageChart.kmAxisLabel}
      </p>
      <p className="mt-1 text-ink-400 dark:text-ink-500">
        {dict.mileageChart.tooltipSource}: {translateMileageSource(point.source, dict)}
      </p>
    </div>
  );
}

function ActualDot(props: { cx?: number; cy?: number; payload?: MileageChartPoint }) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  if (payload.isDiscrepancy) {
    return <circle cx={cx} cy={cy} r={5} fill="#DC2626" stroke="white" strokeWidth={1.5} />;
  }
  return <circle cx={cx} cy={cy} r={3} fill="#2563EB" strokeWidth={0} />;
}

export function MileageChart({ vehicle }: { vehicle: VehicleRecord }) {
  const { dict, locale } = useTranslation();
  const points = buildMileageSeries(vehicle);
  const verdict = vehicle.history.mileageVerification.verdict;
  const isDiscrepancy = verdict === "discrepancy";
  const t = dict.history.mileage;

  if (points.length === 0) return null;

  const data = points.map((p) => ({ ...p, label: formatDateShort(p.date, locale) }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.mileageChart.title}</CardTitle>
        <CardDescription>{dict.mileageChart.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "mb-4 flex items-start gap-3 rounded-xl border px-4 py-3",
            isDiscrepancy
              ? "border-danger-200 bg-danger-50 dark:border-danger-900/40 dark:bg-danger-500/10"
              : "border-success-200 bg-success-50 dark:border-success-900/40 dark:bg-success-500/10"
          )}
        >
          {isDiscrepancy ? (
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-500" />
          ) : (
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
          )}
          <div>
            <p className={cn("text-sm font-semibold", isDiscrepancy ? "text-danger-700 dark:text-danger-400" : "text-success-700 dark:text-success-400")}>
              {isDiscrepancy ? t.verdictDiscrepancyTitle : t.verdictConsistentTitle}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
              {isDiscrepancy ? t.verdictDiscrepancyDescription : t.verdictConsistentDescription}
            </p>
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="mileageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => formatNumber(v, locale)} width={60} />
              <Tooltip content={<ChartTooltip dict={dict} locale={locale} />} />
              <Area
                type="monotone"
                dataKey="actual"
                name={dict.mileageChart.actualLabel}
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#mileageFill)"
                dot={<ActualDot />}
              />
              <Line
                type="monotone"
                dataKey="average"
                name={dict.mileageChart.averageLabel}
                stroke="#94A3B8"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-500 dark:text-ink-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-500" /> {dict.mileageChart.actualLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-ink-300 dark:border-ink-600" /> {dict.mileageChart.averageLabel}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-400 dark:text-ink-500">{dict.mileageChart.disclaimer}</p>
      </CardContent>
    </Card>
  );
}
