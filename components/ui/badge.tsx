import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-100",
        accent: "border-transparent bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200",
        success: "border-transparent bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-500",
        warning: "border-transparent bg-warning-100 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
        danger: "border-transparent bg-danger-100 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500",
        outline: "border-ink-200 text-ink-600 dark:border-ink-600 dark:text-ink-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}
