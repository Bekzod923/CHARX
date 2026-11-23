"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AccidentRecord } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import { useTranslation } from "@/lib/hooks/use-translation";
import { translateAddress, translateCity, translateSeverity } from "@/lib/i18n/domain-labels";

const SEVERITY_COLOR: Record<AccidentRecord["severity"], string> = {
  "Лёгкая": "#16A34A",
  "Средняя": "#F59E0B",
  "Тяжёлая": "#DC2626",
};

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const first = points[0];
    if (!first) return;
    if (points.length === 1) {
      map.setView(first, 12);
    } else {
      map.fitBounds(points, { padding: [32, 32] });
    }
  }, [map, points]);
  return null;
}

interface AccidentMapProps {
  accidents: AccidentRecord[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function AccidentMap({ accidents, selectedId, onSelect }: AccidentMapProps) {
  const { dict, locale } = useTranslation();
  const points = useMemo<[number, number][]>(
    () => accidents.map((a) => [a.latitude, a.longitude]),
    [accidents]
  );

  const firstPoint = points[0];
  if (accidents.length === 0 || !firstPoint) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 text-sm text-ink-400 dark:border-ink-700 dark:bg-ink-800/40">
        {dict.mapCard.empty}
      </div>
    );
  }

  return (
    <div className="h-[360px] overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-700">
      <MapContainer center={firstPoint} zoom={11} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {accidents.map((acc) => {
          const isSelected = selectedId === acc.id;
          return (
            <CircleMarker
              key={acc.id}
              center={[acc.latitude, acc.longitude]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                color: SEVERITY_COLOR[acc.severity],
                fillColor: SEVERITY_COLOR[acc.severity],
                fillOpacity: isSelected ? 0.9 : 0.55,
                weight: isSelected ? 3 : 2,
              }}
              eventHandlers={{ click: () => onSelect(isSelected ? null : acc.id) }}
            >
              <Popup>
                <div className="font-sans text-xs">
                  <p className="font-semibold">{formatDate(acc.date, locale)}</p>
                  <p>{translateCity(acc.city, dict)} — {translateSeverity(acc.severity, dict)}</p>
                  <p className="text-ink-500">{translateAddress(acc.address, dict)}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
