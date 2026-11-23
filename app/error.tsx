"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/hooks/use-translation";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { dict } = useTranslation();

  useEffect(() => {
    // In production this is where an error-tracking service would be notified.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50 text-danger-500 dark:bg-danger-500/10">
        <TriangleAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-xl font-semibold text-ink-800 dark:text-white">
        {dict.errorPage.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {dict.errorPage.description}
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="accent" onClick={() => reset()}>
          {dict.errorPage.retry}
        </Button>
        <LinkButton href="/" variant="outline">
          {dict.errorPage.backHome}
        </LinkButton>
      </div>
    </div>
  );
}
