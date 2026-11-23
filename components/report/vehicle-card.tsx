"use client";

import { Car, Gauge, Palette, Cog, Fuel, Settings2, Calendar, MapPin, Users, Hash } from "lucide-react";
import { VehicleRecord } from "@/lib/types";
import { formatDate, formatMileage } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/hooks/use-translation";
import { translateCity, translateColor, translateFuelType, translateTransmission } from "@/lib/i18n/domain-labels";

function Field({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-400 dark:text-ink-500">{label}</p>
        <p className={`truncate text-sm font-medium text-ink-800 dark:text-ink-100 ${mono ? "font-mono tracking-wide" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function VehicleCard({ vehicle }: { vehicle: VehicleRecord }) {
  const { dict, locale } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card dark:border-ink-700 dark:bg-ink-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/60 px-6 py-5 dark:border-ink-700 dark:bg-ink-900/40">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
            {vehicle.brand}
          </p>
          <h2 className="font-display text-2xl font-bold text-ink-800 dark:text-white">
            {vehicle.model} <span className="font-normal text-ink-400">{vehicle.trim}</span>
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-lg border-2 border-ink-800 bg-white px-3 py-1.5 font-mono text-base font-bold tracking-wider text-ink-800 dark:border-white dark:bg-transparent dark:text-white">
            {vehicle.plate}
          </span>
          <Badge variant="outline">
            {vehicle.year} {dict.vehicleCard.yearSuffix}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 divide-y divide-ink-50 px-6 dark:divide-ink-700/60 sm:grid-cols-2 sm:divide-y-0">
        <div className="divide-y divide-ink-50 dark:divide-ink-700/60 sm:pr-3">
          <Field icon={Hash} label={dict.vehicleCard.vin} value={vehicle.vin} mono />
          <Field icon={Calendar} label={dict.vehicleCard.registrationDate} value={formatDate(vehicle.registrationDate, locale)} />
          <Field icon={MapPin} label={dict.vehicleCard.registrationCity} value={translateCity(vehicle.registrationCity, dict)} />
          <Field icon={Users} label={dict.vehicleCard.ownerCount} value={String(vehicle.ownerCount)} />
        </div>
        <div className="divide-y divide-ink-50 dark:divide-ink-700/60 sm:pl-3">
          <Field icon={Palette} label={dict.vehicleCard.color} value={translateColor(vehicle.color, dict)} />
          <Field icon={Cog} label={dict.vehicleCard.engine} value={vehicle.engine} />
          <Field icon={Settings2} label={dict.vehicleCard.transmission} value={translateTransmission(vehicle.transmission, dict)} />
          <Field icon={Fuel} label={dict.vehicleCard.fuelType} value={translateFuelType(vehicle.fuelType, dict)} />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-100 bg-ink-50/60 px-6 py-4 dark:border-ink-700 dark:bg-ink-900/40">
        <Gauge className="h-4 w-4 text-ink-400" />
        <span className="text-sm text-ink-500 dark:text-ink-400">{dict.vehicleCard.mileageAtCheck}</span>
        <span className="font-tabular text-sm font-semibold text-ink-800 dark:text-white">
          {formatMileage(vehicle.mileageKm, locale, dict.mileageChart.kmAxisLabel)}
        </span>
        <Car className="ml-auto h-5 w-5 text-ink-300 dark:text-ink-600" />
      </div>
    </div>
  );
}
