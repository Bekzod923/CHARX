"use client";

import { createContext, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      // 1 year, readable by both client and server (Route Handlers read it
      // via next/headers cookies()); not httpOnly since it's just a display
      // preference, not a credential.
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      // Re-runs Server Components on the current route with the new cookie,
      // so server-rendered text (landing page, report page shell, admin
      // pages) picks up the new language without a full page reload.
      router.refresh();
    },
    [router]
  );

  return (
    <LocaleContext.Provider value={{ locale, dict: getDictionary(locale), setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
