"use client";

import { Users, Gauge, CarTaxiFront, Landmark, Ship, Gavel, ShieldAlert, FileClock, BadgeCheck, Check } from "lucide-react";
import { useTranslation } from "@/lib/hooks/use-translation";

// Order must match dict.locked.items in every dictionary file.
const ICONS = [Users, Gauge, CarTaxiFront, Landmark, Ship, Gavel, ShieldAlert, FileClock];

/**
 * Landing-page marketing grid showcasing the 8 extended history checks.
 * (Component name kept for historical reasons — these checks used to be
 * "coming soon" teasers; they're now real, implemented features, and the
 * copy/iconography reflect that. See components/report/history/ for the
 * actual per-vehicle data cards shown on the report page.)
 */
export function LockedFeatures({ id }: { id?: string }) {
  const { dict } = useTranslation();

  return (
    <section id={id} className="bg-surface py-20 dark:bg-ink-900/60 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
            <BadgeCheck className="h-3 w-3" /> {dict.locked.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-800 dark:text-white sm:text-4xl">
            {dict.locked.title}
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">{dict.locked.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.locked.items.map((f, idx) => {
            const Icon = ICONS[idx] ?? Users;
            return (
              <div
                key={f.title}
                className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-lifted dark:border-ink-700 dark:bg-ink-800 dark:hover:border-accent-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-900/30 dark:text-accent-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3.5 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-400 dark:text-ink-500">{f.description}</p>
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
                  <Check className="h-2.5 w-2.5" /> {dict.locked.includedBadge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
