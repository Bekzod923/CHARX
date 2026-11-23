"use client";

import { useState } from "react";
import { MapPin, Cloud, ShieldQuestion, Wrench, ChevronDown } from "lucide-react";
import { AccidentRecord } from "@/lib/types";
import { formatCurrencyUzs, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { useTranslation } from "@/lib/hooks/use-translation";
import {
  translateAccidentDescription,
  translateAddress,
  translateCity,
  translatePhotoCaption,
  translateSeverity,
  translateStatus,
  translateWeather,
} from "@/lib/i18n/domain-labels";

const SEVERITY_VARIANT = {
  "Лёгкая": "success",
  "Средняя": "warning",
  "Тяжёлая": "danger",
} as const;

const STATUS_VARIANT = {
  "Урегулировано": "success",
  "В процессе": "warning",
  "Отклонено": "default",
} as const;

interface AccidentTimelineProps {
  accidents: AccidentRecord[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function AccidentTimeline({ accidents, selectedId, onSelect }: AccidentTimelineProps) {
  const { dict, locale } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(accidents[0]?.id ?? null);

  if (accidents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center dark:border-ink-700 dark:bg-ink-800/40">
        <ShieldQuestion className="mx-auto h-10 w-10 text-success-500" strokeWidth={1.5} />
        <p className="mt-3 font-display text-base font-semibold text-ink-800 dark:text-white">
          {dict.timeline.noAccidentsTitle}
        </p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          {dict.timeline.noAccidentsDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 sm:pl-2">
      {accidents.map((acc, idx) => {
        const isOpen = openId === acc.id;
        const isSelected = selectedId === acc.id;
        return (
          <div
            key={acc.id}
            className={cn(
              "relative rounded-2xl border bg-white transition-all dark:bg-ink-800",
              isSelected ? "border-accent-300 shadow-lifted dark:border-accent-700" : "border-ink-100 dark:border-ink-700"
            )}
          >
            <button
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
              onClick={() => {
                const next = isOpen ? null : acc.id;
                setOpenId(next);
                onSelect(next ? acc.id : null);
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-800 font-mono text-xs font-semibold text-white dark:bg-accent-500">
                {dict.timeline.accidentNumberPrefix}{idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-semibold text-ink-800 dark:text-white">
                    {formatDate(acc.date, locale)}
                  </span>
                  <Badge variant={SEVERITY_VARIANT[acc.severity]}>{translateSeverity(acc.severity, dict)}</Badge>
                  <Badge variant={STATUS_VARIANT[acc.status]}>{translateStatus(acc.status, dict)}</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                  <MapPin className="h-3.5 w-3.5" /> {translateCity(acc.city, dict)}
                </p>
              </div>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-ink-100 px-5 py-4 dark:border-ink-700">
                <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                  {translateAccidentDescription(acc.description, dict)}
                </p>
                <p className="-mt-2 text-xs text-ink-400 dark:text-ink-500">{translateAddress(acc.address, dict)}</p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-ink-50 p-3 dark:bg-ink-900/40">
                    <p className="flex items-center gap-1.5 text-[11px] text-ink-400"><Wrench className="h-3 w-3" />{dict.timeline.repair}</p>
                    <p className="mt-1 font-tabular text-sm font-semibold text-ink-800 dark:text-white">
                      {formatCurrencyUzs(acc.repairEstimateUzs, locale)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-3 dark:bg-ink-900/40">
                    <p className="flex items-center gap-1.5 text-[11px] text-ink-400"><Cloud className="h-3 w-3" />{dict.timeline.weather}</p>
                    <p className="mt-1 text-sm font-semibold text-ink-800 dark:text-white">{translateWeather(acc.weather, dict)}</p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-ink-50 p-3 dark:bg-ink-900/40">
                    <p className="text-[11px] text-ink-400">{dict.timeline.insuranceCompany}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-ink-800 dark:text-white">{acc.insuranceCompany}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-ink-400">{dict.timeline.damagedParts}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {acc.damagedParts.map((p) => (
                      <Badge key={p} variant="danger">{dict.damagedParts[p]}</Badge>
                    ))}
                  </div>
                </div>

                {acc.photos.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-ink-400">{dict.timeline.photos}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {acc.photos.map((photo) => {
                        const caption = translatePhotoCaption(photo.caption, dict);
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={photo.id}
                            src={photo.url}
                            alt={caption}
                            title={caption}
                            className="aspect-[4/3] w-full rounded-lg border border-ink-100 object-cover dark:border-ink-700"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
