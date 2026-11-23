"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { useTranslation } from "@/lib/hooks/use-translation";

export function SearchEmptyState({ query }: { query: string }) {
  const { dict } = useTranslation();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
        <SearchX className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-ink-800 dark:text-white">
        {dict.searchEmpty.title}
      </h2>
      <p className="mt-2 font-mono text-sm text-ink-400 dark:text-ink-500">{query}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {dict.searchEmpty.description}
      </p>
      <LinkButton href="/" variant="accent" className="mt-6">
        {dict.searchEmpty.backHome}
      </LinkButton>
      <Link href="/" className="mt-3 text-xs text-ink-400 underline-offset-4 hover:underline dark:text-ink-500">
        {dict.searchEmpty.tryAnother}
      </Link>
    </div>
  );
}
