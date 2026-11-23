"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AccidentCreateInput,
  AccidentRecord,
  DAMAGED_PART_LABELS,
  DamagedPart,
  VehicleListItem,
} from "@/lib/types";
import { derivePhotosFromParts } from "@/lib/utils/damage-photos";
import { cn } from "@/lib/utils/cn";

const SEVERITIES = ["Лёгкая", "Средняя", "Тяжёлая"] as const;
const STATUSES = ["Урегулировано", "В процессе", "Отклонено"] as const;
const WEATHERS = ["Ясно", "Облачно", "Дождь", "Туман", "Гололёд", "Снег"];
const ALL_PARTS = Object.keys(DAMAGED_PART_LABELS) as DamagedPart[];

function emptyForm(defaultVehicleId: string): AccidentCreateInput {
  return {
    vehicleId: defaultVehicleId,
    date: new Date().toISOString().slice(0, 10),
    time: "12:00",
    city: "Ташкент",
    address: "",
    latitude: 41.2995,
    longitude: 69.2401,
    severity: "Лёгкая",
    weather: "Ясно",
    description: "",
    damagedParts: [],
    repairEstimateUzs: 1000000,
    insuranceCompany: "Нет полиса",
    status: "Урегулировано",
    photos: [],
  };
}

interface AccidentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accident: AccidentRecord | null;
  vehicles: VehicleListItem[];
  onSaved: () => void;
}

export function AccidentFormDialog({ open, onOpenChange, accident, vehicles, onSaved }: AccidentFormDialogProps) {
  const [form, setForm] = useState<AccidentCreateInput>(emptyForm(vehicles[0]?.id ?? ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (accident) {
      const { id, createdAt, updatedAt, ...rest } = accident;
      setForm(rest);
    } else {
      setForm(emptyForm(vehicles[0]?.id ?? ""));
    }
  }, [accident, open, vehicles]);

  function update<K extends keyof AccidentCreateInput>(key: K, value: AccidentCreateInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePart(part: DamagedPart) {
    setForm((prev) => {
      const has = prev.damagedParts.includes(part);
      const damagedParts = has ? prev.damagedParts.filter((p) => p !== part) : [...prev.damagedParts, part];
      return { ...prev, damagedParts, photos: derivePhotosFromParts(damagedParts) };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.damagedParts.length === 0) {
      toast.error("Укажите хотя бы одну повреждённую деталь");
      return;
    }
    setSaving(true);
    try {
      const url = accident ? `/api/accidents/${accident.id}` : "/api/accidents";
      const method = accident ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Не удалось сохранить запись");
        return;
      }
      toast.success(accident ? "Запись обновлена" : "ДТП добавлено");
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Ошибка соединения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader
          title={accident ? "Редактировать ДТП" : "Добавить ДТП"}
          description="Свяжите происшествие с автомобилем из реестра"
          onClose={() => onOpenChange(false)}
        />
        <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Автомобиль</Label>
            <Select value={form.vehicleId} onChange={(e) => update("vehicleId", e.target.value)} required>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model} ({v.year})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Дата</Label>
            <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Время</Label>
            <Input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Город</Label>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Адрес</Label>
            <Input value={form.address} onChange={(e) => update("address", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Широта (lat)</Label>
            <Input type="number" step="0.0001" value={form.latitude} onChange={(e) => update("latitude", Number(e.target.value))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Долгота (lng)</Label>
            <Input type="number" step="0.0001" value={form.longitude} onChange={(e) => update("longitude", Number(e.target.value))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Степень тяжести</Label>
            <Select value={form.severity} onChange={(e) => update("severity", e.target.value as AccidentCreateInput["severity"])}>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Погода</Label>
            <Select value={form.weather} onChange={(e) => update("weather", e.target.value)}>
              {WEATHERS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Сумма ремонта (сум)</Label>
            <Input type="number" value={form.repairEstimateUzs} onChange={(e) => update("repairEstimateUzs", Number(e.target.value))} min={0} required />
          </div>
          <div className="space-y-1.5">
            <Label>Статус</Label>
            <Select value={form.status} onChange={(e) => update("status", e.target.value as AccidentCreateInput["status"])}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Страховая компания</Label>
            <Input value={form.insuranceCompany} onChange={(e) => update("insuranceCompany", e.target.value)} required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Описание</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} required rows={3} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Повреждённые элементы</Label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PARTS.map((part) => {
                const active = form.damagedParts.includes(part);
                return (
                  <button
                    key={part}
                    type="button"
                    onClick={() => togglePart(part)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-danger-300 bg-danger-50 text-danger-600 dark:border-danger-800 dark:bg-danger-500/10"
                        : "border-ink-200 bg-white text-ink-500 hover:border-ink-300 dark:border-ink-600 dark:bg-ink-800 dark:text-ink-400"
                    )}
                  >
                    {DAMAGED_PART_LABELS[part]}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button type="submit" variant="accent" disabled={saving || vehicles.length === 0}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
