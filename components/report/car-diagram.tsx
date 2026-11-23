"use client";

import { useState } from "react";
import { DamagedPart } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useTranslation } from "@/lib/hooks/use-translation";

interface Zone {
  id: DamagedPart;
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
}

// Top-down layout. Center column = bumpers/hood/roof/trunk, side columns = fenders/doors.
const ZONES: Zone[] = [
  { id: "front_bumper", x: 90, y: 20, w: 120, h: 22, rx: 11 },
  { id: "hood", x: 90, y: 42, w: 120, h: 58, rx: 8 },
  { id: "windshield", x: 100, y: 100, w: 100, h: 34, rx: 6 },
  { id: "roof", x: 90, y: 134, w: 120, h: 256, rx: 14 },
  { id: "trunk", x: 90, y: 390, w: 120, h: 112, rx: 8 },
  { id: "rear_bumper", x: 90, y: 502, w: 120, h: 22, rx: 11 },
  { id: "left_front_fender", x: 48, y: 42, w: 42, h: 130, rx: 12 },
  { id: "right_front_fender", x: 210, y: 42, w: 42, h: 130, rx: 12 },
  { id: "left_front_door", x: 48, y: 172, w: 42, h: 100, rx: 10 },
  { id: "right_front_door", x: 210, y: 172, w: 42, h: 100, rx: 10 },
  { id: "left_rear_door", x: 48, y: 272, w: 42, h: 100, rx: 10 },
  { id: "right_rear_door", x: 210, y: 272, w: 42, h: 100, rx: 10 },
  { id: "left_rear_fender", x: 48, y: 372, w: 42, h: 130, rx: 12 },
  { id: "right_rear_fender", x: 210, y: 372, w: 42, h: 130, rx: 12 },
];

const WHEELS = [
  { cx: 40, cy: 107 },
  { cx: 260, cy: 107 },
  { cx: 40, cy: 437 },
  { cx: 260, cy: 437 },
];

interface CarDiagramProps {
  damagedParts: DamagedPart[];
  activePart?: DamagedPart | null;
  onSelectPart?: (part: DamagedPart | null) => void;
}

export function CarDiagram({ damagedParts, activePart, onSelectPart }: CarDiagramProps) {
  const { dict } = useTranslation();
  const [hovered, setHovered] = useState<DamagedPart | null>(null);
  const damagedSet = new Set(damagedParts);
  const focusPart = activePart ?? hovered;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 544" className="h-[380px] w-auto sm:h-[440px]" aria-label={dict.carDiagram.ariaLabel}>
        {/* body outline */}
        <rect x="42" y="14" width="216" height="518" rx="72" fill="none" stroke="currentColor" className="text-ink-200 dark:text-ink-600" strokeWidth="2" />
        {/* wheels */}
        {WHEELS.map((w, i) => (
          <rect key={i} x={w.cx - 8} y={w.cy - 26} width="16" height="52" rx="6" className="fill-ink-300 dark:fill-ink-600" />
        ))}
        {/* windshield line accents to read as glass even when not highlighted */}
        {ZONES.map((zone) => {
          const isDamaged = damagedSet.has(zone.id);
          const isFocus = focusPart === zone.id;
          return (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx={zone.rx}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  isDamaged
                    ? "fill-danger-100 stroke-danger-500 dark:fill-danger-500/20"
                    : "fill-ink-50 stroke-ink-200 hover:fill-accent-50 hover:stroke-accent-300 dark:fill-ink-800 dark:stroke-ink-600 dark:hover:fill-ink-700"
                )}
                strokeWidth={isFocus ? 3 : 1.5}
                onMouseEnter={() => setHovered(zone.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectPart?.(focusPart === zone.id ? null : zone.id)}
              >
                <title>{dict.damagedParts[zone.id]}</title>
              </rect>
              {isDamaged && (
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  rx={zone.rx}
                  className="pointer-events-none fill-danger-500/25 animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {damagedParts.length > 0 ? (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {damagedParts.map((part) => (
            <button
              key={part}
              onClick={() => onSelectPart?.(focusPart === part ? null : part)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                focusPart === part
                  ? "border-danger-300 bg-danger-50 text-danger-600 dark:border-danger-800 dark:bg-danger-500/10"
                  : "border-ink-100 bg-white text-ink-500 hover:border-danger-200 hover:text-danger-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
              {dict.damagedParts[part]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-ink-400 dark:text-ink-500">{dict.carDiagram.noDamage}</p>
      )}
    </div>
  );
}
