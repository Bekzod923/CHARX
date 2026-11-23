import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeInitScript, ThemeProvider } from "@/components/shared/theme-provider";
import { LocaleProvider } from "@/components/shared/locale-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getServerDictionary } from "@/lib/i18n/server";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: ["проверка авто", "история ДТП", "VIN", "госномер", "Узбекистан", "Charx"],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getServerDictionary();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider>
          <LocaleProvider initialLocale={locale}>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  borderRadius: "12px",
                  fontFamily: "var(--font-inter)",
                },
              }}
            />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
