import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { isPersistenceAvailable } from "@/lib/db/fake-provider";
import { TriangleAlert } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const persistent = isPersistenceAvailable();

  return (
    <div className="-my-0 flex min-h-[calc(100vh-4rem)] bg-surface dark:bg-ink-900/60">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6 sm:p-8">
        {!persistent && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            Файловая система этого хостинга доступна только для чтения. Изменения сохранятся до
            перезапуска сервера, но не переживут повторный деплой.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
