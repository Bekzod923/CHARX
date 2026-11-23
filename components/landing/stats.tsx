"use client";

import { Car, TriangleAlert, FileCheck, MapPinned } from "lucide-react";
import { useCountUp } from "@/lib/hooks/use-count-up";
import { useTranslation } from "@/lib/hooks/use-translation";
import { formatNumber } from "@/lib/utils/format";
import { PlatformStats } from "@/lib/types";
import { Locale } from "@/lib/i18n/config";

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
  locale,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  accent: string;
  locale: Locale;
}) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-shadow hover:shadow-lifted dark:border-ink-700 dark:bg-ink-800"
    >
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-tabular font-display text-3xl font-bold text-ink-800 dark:text-white sm:text-4xl">
        {formatNumber(animated, locale)}
        <span className="text-accent-500">+</span>
      </p>
      <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  );
}

export function StatsSection({ stats }: { stats: PlatformStats }) {
  const { dict, locale } = useTranslation();

  return (
    <section id="stats" className="bg-white py-20 dark:bg-ink-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-800 dark:text-white sm:text-4xl">
            {dict.stats.title}
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">{dict.stats.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Car}
            value={stats.vehiclesChecked}
            label={dict.stats.vehiclesChecked}
            locale={locale}
            accent="bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300"
          />
          <StatCard
            icon={TriangleAlert}
            value={stats.accidentsFound}
            label={dict.stats.accidentsFound}
            locale={locale}
            accent="bg-warning-100 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
          />
          <StatCard
            icon={FileCheck}
            value={stats.verifiedReports}
            label={dict.stats.verifiedReports}
            locale={locale}
            accent="bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400"
          />
          <StatCard
            icon={MapPinned}
            value={stats.citiesCovered}
            label={dict.stats.citiesCovered}
            locale={locale}
            accent="bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300"
          />
        </div>
      </div>
    </section>
  );
}
