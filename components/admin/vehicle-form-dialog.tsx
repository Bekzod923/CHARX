"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { VehicleCreateInput, VehicleRecord } from "@/lib/types";

const TRANSMISSIONS = ["Механическая", "Автоматическая", "Вариатор", "Робот"];
const FUEL_TYPES = ["Бензин", "Дизель", "Электро", "Гибрид", "Газ/Бензин"];
const CITIES = ["Ташкент", "Самарканд", "Бухара", "Андижан", "Наманган", "Фергана", "Навои", "Карши", "Термез", "Нукус"];

const EMPTY: VehicleCreateInput = {
  vin: "",
  plate: "",
  brand: "",
  model: "",
  trim: "",
  year: new Date().getFullYear(),
  color: "",
  engine: "",
  transmission: "Автоматическая",
  fuelType: "Бензин",
  mileageKm: 0,
  ownerCount: 1,
  registrationDate: new Date().toISOString().slice(0, 10),
  registrationCity: "Ташкент",
};

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VehicleRecord | null;
  onSaved: () => void;
}

export function VehicleFormDialog({ open, onOpenChange, vehicle, onSaved }: VehicleFormDialogProps) {
  const [form, setForm] = useState<VehicleCreateInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehicle) {
      const { id, createdAt, updatedAt, ...rest } = vehicle;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
  }, [vehicle, open]);

  function update<K extends keyof VehicleCreateInput>(key: K, value: VehicleCreateInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = vehicle ? `/api/vehicles/${vehicle.id}` : "/api/vehicles";
      const method = vehicle ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Не удалось сохранить автомобиль");
        return;
      }
      toast.success(vehicle ? "Автомобиль обновлён" : "Автомобиль добавлен");
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
          title={vehicle ? "Редактировать автомобиль" : "Добавить автомобиль"}
          description="Данные будут сохранены в реестре Charx"
          onClose={() => onOpenChange(false)}
        />
        <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>VIN</Label>
            <Input value={form.vin} onChange={(e) => update("vin", e.target.value.toUpperCase())} maxLength={17} required className="font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label>Госномер</Label>
            <Input value={form.plate} onChange={(e) => update("plate", e.target.value.toUpperCase())} required className="font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label>Марка</Label>
            <Input value={form.brand} onChange={(e) => update("brand", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Модель</Label>
            <Input value={form.model} onChange={(e) => update("model", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Комплектация</Label>
            <Input value={form.trim} onChange={(e) => update("trim", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Год выпуска</Label>
            <Input
              type="number"
              value={form.year}
              onChange={(e) => update("year", Number(e.target.value))}
              min={1990}
              max={new Date().getFullYear() + 1}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Цвет</Label>
            <Input value={form.color} onChange={(e) => update("color", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Двигатель</Label>
            <Input value={form.engine} onChange={(e) => update("engine", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Коробка передач</Label>
            <Select value={form.transmission} onChange={(e) => update("transmission", e.target.value as VehicleCreateInput["transmission"])}>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Тип топлива</Label>
            <Select value={form.fuelType} onChange={(e) => update("fuelType", e.target.value as VehicleCreateInput["fuelType"])}>
              {FUEL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Пробег (км)</Label>
            <Input type="number" value={form.mileageKm} onChange={(e) => update("mileageKm", Number(e.target.value))} min={0} required />
          </div>
          <div className="space-y-1.5">
            <Label>Кол-во владельцев</Label>
            <Input type="number" value={form.ownerCount} onChange={(e) => update("ownerCount", Number(e.target.value))} min={1} max={15} required />
          </div>
          <div className="space-y-1.5">
            <Label>Дата регистрации</Label>
            <Input type="date" value={form.registrationDate} onChange={(e) => update("registrationDate", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Город регистрации</Label>
            <Select value={form.registrationCity} onChange={(e) => update("registrationCity", e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button type="submit" variant="accent" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
