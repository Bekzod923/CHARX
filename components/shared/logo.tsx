import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-white shadow-card transition-transform group-hover:scale-105 dark:bg-accent-500">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="font-display text-[17px] font-bold tracking-tight text-ink-800 dark:text-white">
        Charx
      </span>
    </Link>
  );
}
