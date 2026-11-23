import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type StatusTone = "neutral" | "success" | "warning" | "danger";

const TONE_STYLES: Record<StatusTone, { icon: string; badge: string }> = {
  neutral: {
    icon: "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400",
    badge: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300",
  },
  success: {
    icon: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
    badge: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  },
  warning: {
    icon: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
    badge: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
  },
  danger: {
    icon: "bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500",
    badge: "bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500",
  },
};

interface HistoryStatusCardProps {
  icon: LucideIcon;
  title: string;
  tone?: StatusTone;
  badge?: string;
  description?: string;
  children?: React.ReactNode;
}

export function HistoryStatusCard({
  icon: Icon,
  title,
  tone = "neutral",
  badge,
  description,
  children,
}: HistoryStatusCardProps) {
  const style = TONE_STYLES[tone];
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.icon)}>
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <h3 className="font-display text-sm font-semibold text-ink-800 dark:text-white">{title}</h3>
          </div>
          {badge && (
            <span className={cn("shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium", style.badge)}>
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-ink-400">{description}</p>
        )}
        {children && <div className="mt-4 space-y-2.5">{children}</div>}
      </CardContent>
    </Card>
  );
}

export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-ink-50 px-3 py-2 text-xs dark:bg-ink-900/40">
      <span className="text-ink-400 dark:text-ink-500">{label}</span>
      <span className="font-medium text-ink-700 dark:text-ink-200">{value}</span>
    </div>
  );
}
