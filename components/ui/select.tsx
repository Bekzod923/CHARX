import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-ink-200 bg-white px-4 pr-10 text-sm text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  )
);
Select.displayName = "Select";
