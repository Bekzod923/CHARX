"use client";

import { Check, ScanLine, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/hooks/use-translation";
import { cn } from "@/lib/utils/cn";

export function SearchLoading({ stepIndex, query }: { stepIndex: number; query: string }) {
  const { dict } = useTranslation();
  const steps = dict.searchSteps;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-4 border-accent-100 dark:border-accent-900/40" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full border-4 border-accent-400" />
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-ink-800 dark:bg-accent-500">
          <ShieldCheck className="h-9 w-9 text-white" />
          <span className="absolute inset-x-0 top-0 h-6 animate-scan-line bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      <p className="mt-6 font-mono text-sm tracking-wide text-ink-400 dark:text-ink-500">{query}</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink-800 dark:text-white">
        {steps[stepIndex]}
      </h2>

      <div className="mt-8 w-full space-y-2.5">
        {steps.map((step, idx) => {
          const done = idx < stepIndex;
          const active = idx === stepIndex;
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-300",
                active
                  ? "border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-700 dark:bg-accent-900/20 dark:text-accent-300"
                  : done
                  ? "border-transparent text-ink-400 dark:text-ink-500"
                  : "border-transparent text-ink-300 dark:text-ink-600"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                  done
                    ? "bg-success-500 text-white"
                    : active
                    ? "border-2 border-accent-500"
                    : "border-2 border-ink-200 dark:border-ink-700"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <ScanLine className="h-3 w-3 text-accent-500" /> : null}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}
