"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect_lockScroll(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10 sm:pt-16">
      <div
        className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg animate-fade-up rounded-2xl border border-ink-100 bg-card shadow-lifted dark:border-ink-700">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  title,
  description,
  onClose,
  closeLabel = "Close",
}: {
  title: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-100 p-5 dark:border-ink-700">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-700"
        aria-label={closeLabel}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DialogBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("max-h-[65vh] overflow-y-auto p-5 scrollbar-thin", className)}>{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-ink-100 p-5 dark:border-ink-700">
      {children}
    </div>
  );
}

function useEffect_lockScroll(open: boolean) {
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
}
