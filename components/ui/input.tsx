import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50 dark:placeholder:text-ink-500",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
