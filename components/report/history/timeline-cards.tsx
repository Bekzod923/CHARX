"use client";

import { Users, FileClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/hooks/use-translation";
import { formatDate } from "@/lib/utils/format";
import { translateCity, translateOwnerType, translateRegistrationEventType } from "@/lib/i18n/domain-labels";
import { OwnershipHistory, RegistrationHistory } from "@/lib/types";

export function OwnershipCard({ history }: { history: OwnershipHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.ownership;

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300">
            <Users className="h-[18px] w-[18px]" />
          </span>
          <h3 className="font-display text-sm font-semibold text-ink-800 dark:text-white">{t.title}</h3>
        </div>

        <div className="mt-4 space-y-2">
          {history.periods.map((period) => {
            const isCurrent = period.toDate === null;
            return (
              <div
                key={period.ownerNumber}
                className="flex items-center justify-between gap-3 rounded-lg bg-ink-50 px-3 py-2.5 text-xs dark:bg-ink-900/40"
              >
                <div>
                  <p className="font-medium text-ink-700 dark:text-ink-200">
                    {t.ownerLabel.replace("{n}", String(period.ownerNumber))}
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-medium text-success-600 dark:bg-success-500/10 dark:text-success-500">
                        {t.currentBadge}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-ink-400 dark:text-ink-500">
                    {translateOwnerType(period.ownerType, dict)} · {translateCity(period.city, dict)}
                  </p>
                </div>
                <p className="whitespace-nowrap text-right text-ink-500 dark:text-ink-400">
                  {t.fromTo
                    .replace("{from}", formatDate(period.fromDate, locale))
                    .replace("{to}", period.toDate ? formatDate(period.toDate, locale) : t.toPresent)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function RegistrationCard({ history }: { history: RegistrationHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.registration;

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
            <FileClock className="h-[18px] w-[18px]" />
          </span>
          <h3 className="font-display text-sm font-semibold text-ink-800 dark:text-white">{t.title}</h3>
        </div>

        <div className="relative mt-4 space-y-4 pl-4">
          <div className="absolute bottom-1 left-1 top-1 w-px bg-ink-100 dark:bg-ink-700" />
          {history.events.map((event, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[18px] top-0.5 h-2 w-2 rounded-full bg-accent-500" />
              <p className="text-xs font-medium text-ink-700 dark:text-ink-200">
                {translateRegistrationEventType(event.type, dict)}
              </p>
              <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">
                {formatDate(event.date, locale)} · {translateCity(event.city, dict)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
