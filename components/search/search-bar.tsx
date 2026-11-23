"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useRecentSearches } from "@/lib/hooks/use-recent-searches";
import { useTranslation } from "@/lib/hooks/use-translation";

const EXAMPLES = ["01 A 777 AA", "JTMBH3FV20D123456"];

export function SearchBar({ size = "lg" }: { size?: "lg" | "md" }) {
  const router = useRouter();
  const { dict } = useTranslation();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const { items } = useRecentSearches();

  const isValid = value.trim().length >= 4;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    router.push(`/report/${encodeURIComponent(value.trim())}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col items-stretch gap-2.5 rounded-2xl border border-ink-100 bg-white/90 p-2.5 shadow-lifted backdrop-blur-sm dark:border-ink-700 dark:bg-ink-800/90 sm:flex-row",
          size === "lg" ? "sm:p-3" : ""
        )}
      >
        <div className="flex flex-1 items-center gap-3 rounded-xl px-3.5 py-2.5">
          <ScanLine className="h-5 w-5 shrink-0 text-accent-500" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder={dict.searchBar.placeholder}
            aria-label={dict.searchBar.ariaLabel}
            className={cn(
              "w-full bg-transparent font-mono text-[15px] tracking-wide text-ink-800 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-400 focus:outline-none dark:text-white",
              size === "lg" ? "text-base sm:text-lg" : "text-sm"
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            "flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-500 font-medium text-white shadow-soft transition-all hover:bg-accent-600 active:scale-[0.98]",
            size === "lg" ? "h-14 px-7 text-[15px]" : "h-11 px-5 text-sm"
          )}
        >
          <Search className="h-[18px] w-[18px]" />
          {dict.searchBar.button}
        </button>
      </form>

      {touched && !isValid && (
        <p className="mt-2 pl-2 text-sm text-danger-500">{dict.searchBar.validation}</p>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2 pl-1">
        <span className="text-xs text-ink-400 dark:text-ink-500">{dict.searchBar.examplesLabel}</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 font-mono text-xs text-ink-500 transition-colors hover:border-accent-200 hover:text-accent-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400"
          >
            {ex}
          </button>
        ))}
        {items.length > 0 && (
          <>
            <span className="mx-1 h-3 w-px bg-ink-200 dark:bg-ink-600" />
            <span className="text-xs text-ink-400 dark:text-ink-500">{dict.searchBar.recentLabel}</span>
            {items.slice(0, 3).map((item) => (
              <button
                key={item.query + item.timestamp}
                type="button"
                onClick={() => setValue(item.query)}
                className="rounded-full border border-ink-100 bg-ink-50 px-3 py-1 font-mono text-xs text-ink-500 transition-colors hover:border-accent-200 hover:text-accent-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400"
              >
                {item.query}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
