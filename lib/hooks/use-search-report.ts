"use client";

import { useEffect, useState } from "react";
import { VehicleReport } from "@/lib/types";

const STEP_DURATION_MS = 750; // matches the brief's ~3s search sequence

type Status = "loading" | "found" | "not-found" | "error";

/**
 * Drives the search loading sequence and fetches the report. `stepCount` is
 * just used for timing (total delay = stepCount * STEP_DURATION_MS) — the
 * actual step labels are rendered by the caller from the current locale's
 * dictionary (dict.searchSteps), not by this hook.
 */
export function useSearchReport(query: string, stepCount = 4) {
  const [status, setStatus] = useState<Status>("loading");
  const [stepIndex, setStepIndex] = useState(0);
  const [report, setReport] = useState<VehicleReport | null>(null);

  useEffect(() => {
    if (!query) return;

    // Reset state for each new query. This also correctly handles React
    // Strict Mode's intentional double-invoke in dev: the first run gets
    // cancelled almost immediately below, and this second run is the one
    // that actually stays mounted and completes.
    setStatus("loading");
    setStepIndex(0);
    setReport(null);

    let cancelled = false;
    const minDelay = new Promise((resolve) => setTimeout(resolve, STEP_DURATION_MS * stepCount));

    const stepTimer = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, stepCount - 1));
    }, STEP_DURATION_MS);

    const fetchReport = fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (res.status === 404) return { notFound: true as const };
        if (!res.ok) throw new Error("request_failed");
        const data = (await res.json()) as VehicleReport;
        return { notFound: false as const, data };
      })
      .catch(() => ({ notFound: false as const, error: true as const }));

    Promise.all([fetchReport, minDelay]).then(([result]) => {
      if (cancelled) return;
      clearInterval(stepTimer);
      setStepIndex(stepCount - 1);
      if ("error" in result && result.error) {
        setStatus("error");
      } else if (result.notFound) {
        setStatus("not-found");
      } else if ("data" in result && result.data) {
        setReport(result.data);
        setStatus("found");
      }
    });

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
  }, [query, stepCount]);

  return { status, stepIndex, report };
}
