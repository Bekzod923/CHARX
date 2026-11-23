import { ScanSearch, Database, FileOutput } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

const ICONS = [ScanSearch, Database, FileOutput];

export async function HowItWorks() {
  const { dict } = await getServerDictionary();

  return (
    <section id="how-it-works" className="bg-surface py-20 dark:bg-ink-900/60 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-800 dark:text-white sm:text-4xl">
            {dict.howItWorks.title}
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">{dict.howItWorks.subtitle}</p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-11 hidden h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent dark:via-ink-700 md:block" />
          {dict.howItWorks.steps.map((step, idx) => {
            const Icon = ICONS[idx] ?? ScanSearch;
            const number = String(idx + 1).padStart(2, "0");
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="relative z-10 flex h-[88px] w-[88px] items-center justify-center rounded-3xl border border-ink-100 bg-white shadow-card dark:border-ink-700 dark:bg-ink-800">
                  <Icon className="h-8 w-8 text-accent-500" strokeWidth={1.75} />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 font-mono text-[11px] font-semibold text-white dark:bg-accent-500">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-800 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
