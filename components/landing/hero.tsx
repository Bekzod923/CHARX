import { ShieldCheck, FileCheck2, Scale } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { getServerDictionary } from "@/lib/i18n/server";

export async function Hero() {
  const { dict } = await getServerDictionary();

  const TRUST_POINTS = [
    { icon: ShieldCheck, label: dict.hero.trustVerified },
    { icon: FileCheck2, label: dict.hero.trustHistory },
    { icon: Scale, label: dict.hero.trustMarket },
  ];

  return (
    <section id="search" className="relative overflow-hidden bg-surface dark:bg-ink-900">
      <div className="route-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <svg
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1200px] -translate-x-1/2 opacity-[0.35] dark:opacity-[0.18]"
        viewBox="0 0 1200 520"
        fill="none"
      >
        <path
          d="M -50 120 C 200 40, 340 260, 600 180 S 1000 20, 1260 140"
          stroke="#2563EB"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
        <path
          d="M -50 320 C 260 260, 420 420, 650 360 S 980 220, 1260 340"
          stroke="#0F172A"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
          className="dark:stroke-white"
        />
      </svg>

      <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        <div className="animate-fade-up [animation-delay:0ms] opacity-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-1.5 text-xs font-medium text-ink-500 shadow-sm dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {dict.hero.badge}
          </span>
        </div>

        <h1 className="animate-fade-up mt-6 text-balance font-display text-4xl font-bold tracking-tight text-ink-800 opacity-0 [animation-delay:80ms] dark:text-white sm:text-5xl lg:text-6xl">
          {dict.hero.title}
        </h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink-500 opacity-0 [animation-delay:160ms] dark:text-ink-300">
          {dict.hero.subtitle}
        </p>

        <div className="animate-fade-up mx-auto mt-9 max-w-2xl opacity-0 [animation-delay:240ms]">
          <SearchBar />
        </div>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-0 [animation-delay:320ms]">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-300">
              <Icon className="h-4 w-4 text-success-500" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
