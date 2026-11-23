// ============================================================================
// i18n configuration. Single source of truth for which locales exist.
// Adding a 4th language later means: add it here, add a dictionary file that
// satisfies the Dictionary type, add its domain-label entries — nothing else
// in the app needs to change.
// ============================================================================

export const LOCALES = ["ru", "en", "uz"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_COOKIE = "carproof_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  uz: "O'zbekcha",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  uz: "UZ",
};

/** Maps our app locale to an Intl/BCP-47 tag for Intl.NumberFormat / DateTimeFormat. */
export const INTL_TAG: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
  uz: "uz-Latn-UZ",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
