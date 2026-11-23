import { AccidentRecord, AccidentSeverity } from "./accident";
import { VehicleRecord } from "./vehicle";

export type ScoreCategory = "excellent" | "minor" | "attention";

export interface VehicleScore {
  value: number; // 0-100
  category: ScoreCategory;
  accidentCount: number;
  /** Severity of the single most serious recorded accident, if any. */
  worstSeverity: AccidentSeverity | null;
}

export interface VehicleReport {
  reportNumber: string;
  generatedAt: string;
  vehicle: VehicleRecord;
  accidents: AccidentRecord[];
  score: VehicleScore;
}

export interface PlatformStats {
  vehiclesChecked: number;
  accidentsFound: number;
  verifiedReports: number;
  citiesCovered: number;
}
