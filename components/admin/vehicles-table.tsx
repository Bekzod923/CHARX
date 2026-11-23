"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleFormDialog } from "./vehicle-form-dialog";
import { VehicleListItem, VehicleRecord } from "@/lib/types";

export function VehiclesTable() {
  const [vehicles, setVehicles] = useState<VehicleListItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VehicleRecord | null>(null);

  async function load() {
    const res = await fetch("/api/vehicles");
    if (res.ok) setVehicles(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleEdit(id: string) {
    const res = await fetch(`/api/vehicles/${id}`);
    if (!res.ok) {
      toast.error("Не удалось загрузить автомобиль");
      return;
    }
    setEditing(await res.json());
    setDialogOpen(true);
  }

  async function handleDelete(id: string, plate: string) {
    if (!confirm(`Удалить автомобиль ${plate}? Связанные записи о ДТП также будут удалены.`)) return;
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить автомобиль");
      return;
    }
    toast.success("Автомобиль удалён");
    load();
  }

  const filtered = vehicles?.filter((v) => {
    const q = query.trim().toUpperCase();
    if (!q) return true;
    return (
      v.plate.toUpperCase().includes(q) ||
      v.vin.toUpperCase().includes(q) ||
      v.brand.toUpperCase().includes(q) ||
      v.model.toUpperCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-white">Автомобили</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {vehicles ? `${vehicles.length} записей в реестре` : "Загрузка..."}
          </p>
        </div>
        <Button
          variant="accent"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Добавить автомобиль
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по VIN, номеру, марке..."
          className="pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:bg-ink-900/40">
            <tr>
              <th className="px-4 py-3 font-medium">Госномер</th>
              <th className="px-4 py-3 font-medium">VIN</th>
              <th className="px-4 py-3 font-medium">Автомобиль</th>
              <th className="px-4 py-3 font-medium">Год</th>
              <th className="px-4 py-3 font-medium">Цвет</th>
              <th className="px-4 py-3 font-medium">ДТП</th>
              <th className="px-4 py-3 text-right font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50 dark:divide-ink-700/60">
            {!vehicles &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            {filtered?.map((v) => (
              <tr key={v.id} className="transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-900/30">
                <td className="whitespace-nowrap px-4 py-3 font-mono font-medium text-ink-800 dark:text-white">{v.plate}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-500 dark:text-ink-400">{v.vin}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-700 dark:text-ink-200">{v.brand} {v.model}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{v.year}</td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{v.color}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {v.accidentCount > 0 ? (
                    <Badge variant="danger"><TriangleAlert className="h-3 w-3" />{v.accidentCount}</Badge>
                  ) : (
                    <Badge variant="success">0</Badge>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(v.id)} aria-label="Редактировать">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id, v.plate)} aria-label="Удалить">
                      <Trash2 className="h-4 w-4 text-danger-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles && filtered?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-400">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <VehicleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} vehicle={editing} onSaved={load} />
    </div>
  );
}
