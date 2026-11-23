"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, TriangleAlert } from "lucide-react";
import { VehicleScore } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useTranslation } from "@/lib/hooks/use-translation";
import { translateSeverity } from "@/lib/i18n/domain-labels";
import { formatNumber } from "@/lib/utils/format";

const CATEGORY_STYLES = {
  excellent: {
    ring: "stroke-success-500",
    text: "text-success-600 dark:text-success-500",
    bg: "bg-success-50 dark:bg-success-500/10",
    Icon: ShieldCheck,
  },
  minor: {
    ring: "stroke-warning-500",
    text: "text-warning-600 dark:text-warning-500",
    bg: "bg-warning-50 dark:bg-warning-500/10",
    Icon: TriangleAlert,
  },
  attention: {
    ring: "stroke-danger-500",
    text: "text-danger-600 dark:text-danger-500",
    bg: "bg-danger-50 dark:bg-danger-500/10",
    Icon: ShieldAlert,
  },
} as const;

const RADIUS = 84;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TEETH = 44;

export function ScoreSeal({ score }: { score: VehicleScore }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { dict, locale } = useTranslation();
  const style = CATEGORY_STYLES[score.category];
  const Icon = style.Icon;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedValue(score.value));
    return () => cancelAnimationFrame(raf);
  }, [score.value]);

  const offset = CIRCUMFERENCE * (1 - animatedValue / 100);

  const title =
    score.category === "excellent"
      ? dict.scoreSeal.titleExcellent
      : score.category === "minor"
      ? dict.scoreSeal.titleMinor
      : dict.scoreSeal.titleAttention;

  const worstSeverityLabel = score.worstSeverity ? translateSeverity(score.worstSeverity, dict) : "";

  const summary =
    score.accidentCount === 0
      ? dict.scoreSeal.summaryExcellentNoAccidents
      : score.category === "excellent"
      ? dict.scoreSeal.summaryExcellent.replace("{count}", formatNumber(score.accidentCount, locale))
      : score.category === "minor"
      ? dict.scoreSeal.summaryMinor.replace("{severity}", worstSeverityLabel)
      : dict.scoreSeal.summaryAttention.replace("{severity}", worstSeverityLabel);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[220px] w-[220px]">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
          {/* perforated stamp edge */}
          <circle
            cx="110"
            cy="110"
            r="104"
            fill="none"
            className="stroke-ink-200 dark:stroke-ink-700"
            strokeWidth="2"
            strokeDasharray={`1 ${(2 * Math.PI * 104) / TEETH - 1}`}
            strokeLinecap="round"
          />
          {/* track */}
          <circle cx="110" cy="110" r={RADIUS} fill="none" className="stroke-ink-100 dark:stroke-ink-700" strokeWidth="12" />
          {/* progress */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            className={cn(style.ring, "transition-[stroke-dashoffset] duration-[1400ms] ease-out")}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", style.bg)}>
            <Icon className={cn("h-5 w-5", style.text)} strokeWidth={2} />
          </span>
          <span className="mt-1 font-tabular font-display text-5xl font-bold text-ink-800 dark:text-white">
            {formatNumber(animatedValue, locale)}
          </span>
          <span className="text-xs font-medium text-ink-400 dark:text-ink-500">{dict.scoreSeal.outOf100}</span>
        </div>
      </div>

      <h3 className={cn("mt-4 font-display text-lg font-semibold", style.text)}>{title}</h3>
      <p className="mt-1.5 max-w-xs text-balance text-center text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {summary}
      </p>
    </div>
  );
}
