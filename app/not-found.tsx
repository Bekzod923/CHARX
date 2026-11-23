import { CarFront } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const { dict } = await getServerDictionary();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
        <CarFront className="h-8 w-8" />
      </div>
      <p className="mt-6 font-display text-6xl font-bold text-ink-800 dark:text-white">404</p>
      <h1 className="mt-2 font-display text-xl font-semibold text-ink-800 dark:text-white">
        {dict.notFoundPage.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {dict.notFoundPage.description}
      </p>
      <LinkButton href="/" variant="accent" className="mt-6">
        {dict.notFoundPage.backHome}
      </LinkButton>
    </div>
  );
}
