import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowUpRight } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function Navbar() {
  const { dict } = await getServerDictionary();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-surface/85 backdrop-blur-md dark:border-ink-700/80 dark:bg-ink-900/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#how-it-works" className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 dark:text-ink-300 dark:hover:text-white">
            {dict.nav.howItWorks}
          </Link>
          <Link href="/#features" className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 dark:text-ink-300 dark:hover:text-white">
            {dict.nav.features}
          </Link>
          <Link href="/#stats" className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-800 dark:text-ink-300 dark:hover:text-white">
            {dict.nav.stats}
          </Link>
        </nav>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <LinkButton href="/#search" variant="accent" size="sm" className="ml-1 hidden sm:inline-flex">
            {dict.nav.checkVehicle} <ArrowUpRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
