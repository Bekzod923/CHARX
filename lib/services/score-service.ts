import { AccidentRecord, AccidentSeverity, ScoreCategory, VehicleScore } from "@/lib/types";

const SEVERITY_PENALTY: Record<AccidentSeverity, number> = {
  "Лёгкая": 15,
  "Средняя": 40,
  "Тяжёлая": 65,
};

const MIN_SCORE = 15;

/**
 * ScoreService
 * ---------------------------------------------------------------------------
 * Pure, dependency-free scoring logic — no I/O, no framework imports, and
 * crucially no locale/text concerns, so it can be unit tested trivially and
 * reused anywhere (API route, server component, admin panel preview).
 *
 * It intentionally returns raw data (score value, category, accident count,
 * worst severity) rather than rendered sentences — the UI layer turns that
 * into a localized title/summary using the current dictionary (see
 * components/report/score-seal.tsx), so this service never needs to know
 * what language the visitor reads.
 *
 * Rule of thumb, matching the product brief:
 *   100  — no accidents on record
 *   ~85  — a single minor accident
 *   ~60  — a medium-severity accident
 *   ~35  — a major accident
 * Multiple accidents compound: each one subtracts its own penalty from 100,
 * with a floor so the score never reads as a suspicious "0".
 * ---------------------------------------------------------------------------
 */
export class ScoreService {
  calculate(accidents: AccidentRecord[]): VehicleScore {
    if (accidents.length === 0) {
      return { value: 100, category: "excellent", accidentCount: 0, worstSeverity: null };
    }

    const totalPenalty = accidents.reduce((sum, acc) => sum + (SEVERITY_PENALTY[acc.severity] ?? 20), 0);
    const value = Math.max(MIN_SCORE, Math.round(100 - totalPenalty));

    const category: ScoreCategory = value >= 80 ? "excellent" : value >= 50 ? "minor" : "attention";

    const worst = [...accidents].sort(
      (a, b) => (SEVERITY_PENALTY[b.severity] ?? 0) - (SEVERITY_PENALTY[a.severity] ?? 0)
    )[0];

    return {
      value,
      category,
      accidentCount: accidents.length,
      worstSeverity: worst?.severity ?? null,
    };
  }
}
