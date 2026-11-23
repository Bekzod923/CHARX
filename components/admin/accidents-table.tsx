"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AccidentFormDialog } from "./accident-form-dialog";
import { AccidentRecord, VehicleListItem } from "@/lib/types";
import { formatCurrencyUzs, formatDate } from "@/lib/utils/format";

const SEVERITY_VARIANT = { "Лёгкая": "success", "Средняя": "warning", "Тяжёлая": "danger" } as const;

export function AccidentsTable() {
  const [accidents, setAccidents] = useState<AccidentRecord[] | null>(null);
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AccidentRecord | null>(null);

  async function load() {
    const [accRes, vehRes] = await Promise.all([fetch("/api/accidents"), fetch("/api/vehicles")]);
    if (accRes.ok) setAccidents(await accRes.json());
    if (vehRes.ok) setVehicles(await vehRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  const vehicleById = new Map(vehicles.map((v) => [v.id, v]));

  async function handleDelete(id: string) {
    if (!confirm("Удалить запись о ДТП?")) return;
    const res = await fetch(`/api/accidents/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить запись");
      return;
    }
    toast.success("Запись удалена");
    load();
  }

  const filtered = accidents?.filter((a) => {
    const q = query.trim().toUpperCase();
    if (!q) return true;
    const vehicle = vehicleById.get(a.vehicleId);
    return (
      a.city.toUpperCase().includes(q) ||
      vehicle?.plate.toUpperCase().includes(q) ||
      vehicle?.brand.toUpperCase().includes(q) ||
      vehicle?.model.toUpperCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-white">ДТП</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {accidents ? `${accidents.length} записей о происшествиях` : "Загрузка..."}
          </p>
        </div>
        <Button
          variant="accent"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          disabled={vehicles.length === 0}
        >
          <Plus className="h-4 w-4" /> Добавить ДТП
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по городу, номеру, марке..." className="pl-10" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:bg-ink-900/40">
            <tr>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Автомобиль</th>
              <th className="px-4 py-3 font-medium">Город</th>
              <th className="px-4 py-3 font-medium">Тяжесть</th>
              <th className="px-4 py-3 font-medium">Сумма ремонта</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 text-right font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50 dark:divide-ink-700/60">
            {!accidents &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            {filtered?.map((a) => {
              const vehicle = vehicleById.get(a.vehicleId);
              return (
                <tr key={a.id} className="transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-900/30">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-700 dark:text-ink-200">{formatDate(a.date)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-ink-800 dark:text-white">
                    {vehicle ? `${vehicle.plate} · ${vehicle.brand} ${vehicle.model}` : a.vehicleId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{a.city}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant={SEVERITY_VARIANT[a.severity]}>{a.severity}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-tabular text-ink-700 dark:text-ink-200">
                    {formatCurrencyUzs(a.repairEstimateUzs)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{a.status}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(a);
                          setDialogOpen(true);
                        }}
                        aria-label="Редактировать"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} aria-label="Удалить">
                        <Trash2 className="h-4 w-4 text-danger-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {accidents && filtered?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-400">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AccidentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        accident={editing}
        vehicles={vehicles}
        onSaved={load}
      />
    </div>
  );
}
