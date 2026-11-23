import Link from "next/link";
import { Logo } from "./logo";
import { Github, Mail, Phone } from "lucide-react";
import { getServerDictionary } from "@/lib/i18n/server";

export async function Footer() {
  const { dict } = await getServerDictionary();

  const columns = [
    {
      title: dict.footer.productTitle,
      links: [
        { label: dict.footer.checkVehicle, href: "/#search" },
        { label: dict.footer.howItWorks, href: "/#how-it-works" },
        { label: dict.footer.features, href: "/#features" },
        { label: dict.footer.pricing, href: "/#locked" },
      ],
    },
    {
      title: dict.footer.companyTitle,
      links: [
        { label: dict.footer.about, href: "/#stats" },
        { label: dict.footer.forBanks, href: "/#features" },
        { label: dict.footer.contact, href: "/#contact" },
      ],
    },
    {
      title: dict.footer.legalTitle,
      links: [
        { label: dict.footer.terms, href: "#" },
        { label: dict.footer.privacy, href: "#" },
        { label: dict.footer.offer, href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-900" id="contact">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500 dark:text-ink-400">
              {dict.footer.tagline}
            </p>
            <div className="mt-5 flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400">
              <Phone className="h-4 w-4" />
              <span>+998 71 200 00 00</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400">
              <Mail className="h-4 w-4" />
              <span>info@charx.uz</span>
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-ink-800 dark:text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-500 transition-colors hover:text-accent-600 dark:text-ink-400 dark:hover:text-accent-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 text-xs text-ink-400 dark:border-ink-700 sm:flex-row">
          <p>© {new Date().getFullYear()} {dict.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="transition-colors hover:text-ink-600 dark:hover:text-ink-200">
              {dict.footer.adminPanel}
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-ink-600 dark:hover:text-ink-200"
            >
              <Github className="h-3.5 w-3.5" /> {dict.footer.openSource}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
