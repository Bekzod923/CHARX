"use client";

import { useMemo, useState } from "react";
import { AccidentRecord, DamagedPart } from "@/lib/types";
import { CarDiagram } from "./car-diagram";
import { AccidentTimeline } from "./accident-timeline";
import { AccidentMapLoader } from "./accident-map-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/lib/hooks/use-translation";

export function ReportInteractiveSection({ accidents }: { accidents: AccidentRecord[] }) {
  const { dict } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const damagedParts = useMemo<DamagedPart[]>(() => {
    const source = selectedId ? accidents.filter((a) => a.id === selectedId) : accidents;
    const set = new Set<DamagedPart>();
    source.forEach((a) => a.damagedParts.forEach((p) => set.add(p)));
    return Array.from(set);
  }, [accidents, selectedId]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{dict.reportInteractive.diagramTitle}</CardTitle>
          <CardDescription>
            {selectedId ? dict.reportInteractive.diagramSelectedDescription : dict.reportInteractive.diagramAllDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CarDiagram damagedParts={damagedParts} />
        </CardContent>
      </Card>

      <div className="space-y-6 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>{dict.reportInteractive.mapTitle}</CardTitle>
            <CardDescription>{dict.reportInteractive.mapDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <AccidentMapLoader accidents={accidents} selectedId={selectedId} onSelect={setSelectedId} />
          </CardContent>
        </Card>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-ink-800 dark:text-white">
            {dict.reportInteractive.timelineTitle}
          </h3>
          <AccidentTimeline accidents={accidents} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </div>
    </div>
  );
}
