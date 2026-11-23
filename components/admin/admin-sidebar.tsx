"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Car, TriangleAlert, LogOut, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/shared/logo";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Обзор", icon: LayoutDashboard, exact: true },
  { href: "/admin/dashboard/vehicles", label: "Автомобили", icon: Car },
  { href: "/admin/dashboard/accidents", label: "ДТП", icon: TriangleAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Вы вышли из панели администратора");
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-900">
      <div className="border-b border-ink-100 p-5 dark:border-ink-700">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-ink-800 text-white dark:bg-accent-500"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-ink-100 p-3 dark:border-ink-700">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Открыть сайт
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-danger-500 transition-colors hover:bg-danger-50 dark:hover:bg-danger-500/10"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
