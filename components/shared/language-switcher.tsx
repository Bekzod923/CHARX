"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/hooks/use-translation";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.locale.switchLabel}
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700/50"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="font-mono text-xs">{LOCALE_SHORT[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lifted dark:border-ink-700 dark:bg-ink-800">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-700/50",
                l === locale ? "text-accent-600 dark:text-accent-400" : "text-ink-600 dark:text-ink-300"
              )}
            >
              {LOCALE_LABELS[l]}
              {l === locale && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
