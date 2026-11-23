import { INTL_TAG, Locale } from "@/lib/i18n/config";

// ============================================================================
// Locale-aware formatting helpers. Centralized so the whole app renders
// numbers, currency, and dates the same way for a given locale. Every
// function defaults to Russian if no locale is passed, matching the app's
// original behavior for any call site that hasn't been updated.
// ============================================================================

function tag(locale?: Locale): string {
  return INTL_TAG[locale ?? "ru"];
}

export function formatNumber(value: number, locale?: Locale): string {
  return new Intl.NumberFormat(tag(locale)).format(value);
}

export function formatMileage(km: number, locale?: Locale, unitLabel = "км"): string {
  return `${formatNumber(km, locale)} ${unitLabel}`;
}

export function formatCurrencyUzs(value: number, locale?: Locale, unitLabel = "сум"): string {
  return `${formatNumber(value, locale)} ${unitLabel}`;
}

export function formatDate(isoDate: string, locale?: Locale): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(tag(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(isoDate: string, locale?: Locale): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(tag(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(isoDate: string, locale?: Locale): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(tag(locale), {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Animatable count-up target must be a plain number; this just clamps/rounds. */
export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
