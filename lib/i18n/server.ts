import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, Locale, LOCALE_COOKIE } from "./config";
import { getDictionary } from "./dictionaries";
import type { Dictionary } from "./dictionaries/types";

/** Reads the visitor's chosen locale from the cookie (set by the language switcher). */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Convenience for Server Components/Route Handlers that just want the dictionary. */
export async function getServerDictionary(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getServerLocale();
  return { locale, dict: getDictionary(locale) };
}
