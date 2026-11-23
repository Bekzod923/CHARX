import { CarFront, MapPin, Gauge, Landmark, Printer, History } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

const ICONS = [CarFront, MapPin, Gauge, History, Landmark, Printer];

export async function Features() {
  const { dict } = await getServerDictionary();

  return (
    <section id="features" className="bg-white py-20 dark:bg-ink-900 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-800 dark:text-white sm:text-4xl">
            {dict.features.title}
          </h2>
          <p className="mt-3 text-ink-500 dark:text-ink-400">{dict.features.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.features.items.map((f, idx) => {
            const Icon = ICONS[idx] ?? CarFront;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-ink-100 p-6 transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-lifted dark:border-ink-700 dark:hover:border-accent-800"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition-colors group-hover:bg-accent-50 group-hover:text-accent-600 dark:bg-ink-800 dark:text-ink-300 dark:group-hover:bg-accent-900/30 dark:group-hover:text-accent-300">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-800 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
