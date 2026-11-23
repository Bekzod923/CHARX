"use client";

import { useEffect } from "react";
import { useSearchReport } from "@/lib/hooks/use-search-report";
import { useRecentSearches } from "@/lib/hooks/use-recent-searches";
import { useTranslation } from "@/lib/hooks/use-translation";
import { SearchLoading } from "@/components/search/search-loading";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { VehicleCard } from "@/components/report/vehicle-card";
import { ScoreSeal } from "@/components/report/score-seal";
import { ReportHeader } from "@/components/report/report-header";
import { ReportInteractiveSection } from "@/components/report/report-interactive-section";
import { MileageChart } from "@/components/report/mileage-chart";
import { HistorySection } from "@/components/report/history/history-section";
import { Card } from "@/components/ui/card";

export function ReportView({ query }: { query: string }) {
  const { dict } = useTranslation();
  const { status, stepIndex, report } = useSearchReport(query, dict.searchSteps.length);
  const { addSearch } = useRecentSearches();

  useEffect(() => {
    if (status === "found" && report) {
      addSearch(query, `${report.vehicle.brand} ${report.vehicle.model} · ${report.vehicle.plate}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "loading") {
    return <SearchLoading stepIndex={stepIndex} query={query} />;
  }

  if (status === "not-found" || status === "error") {
    return <SearchEmptyState query={query} />;
  }

  if (!report) return null;

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* subtle watermark, visible mainly on print */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.06]"
      >
        <span className="rotate-[-24deg] whitespace-nowrap font-display text-[140px] font-bold text-ink-800 dark:text-white">
          CHARX
        </span>
      </div>

      <div className="relative z-10 space-y-6">
        <ReportHeader reportNumber={report.reportNumber} generatedAt={report.generatedAt} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <VehicleCard vehicle={report.vehicle} />
          </div>
          <Card className="flex items-center justify-center p-6 lg:col-span-2">
            <ScoreSeal score={report.score} />
          </Card>
        </div>

        <MileageChart vehicle={report.vehicle} />

        <ReportInteractiveSection accidents={report.accidents} />

        <HistorySection history={report.vehicle.history} />
      </div>
    </div>
  );
}
