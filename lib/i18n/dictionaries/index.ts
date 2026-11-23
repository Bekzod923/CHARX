import { DEFAULT_LOCALE, Locale } from "../config";
import ru from "./ru";
import en from "./en";
import uz from "./uz";
import type { Dictionary } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { ru, en, uz };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export type { Dictionary } from "./types";
