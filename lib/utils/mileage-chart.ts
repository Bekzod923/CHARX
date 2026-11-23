import { MileageCheckpointSource, VehicleRecord } from "@/lib/types";

const AVERAGE_KM_PER_YEAR = 15000;

export interface MileageChartPoint {
  date: string;
  year: number;
  actual: number;
  average: number;
  source: MileageCheckpointSource;
  /** True when this checkpoint reads lower than the previous one — an odometer rollback red flag. */
  isDiscrepancy: boolean;
}

/**
 * Builds the mileage-over-time series directly from the vehicle's real,
 * stored odometer checkpoints (vehicle.history.mileageVerification —
 * generated once per vehicle by scripts/generate-db.js, or a minimal
 * two-point default for vehicles added by hand via the admin panel). A
 * straight "average km/year" reference line is computed alongside each
 * point for comparison.
 */
export function buildMileageSeries(vehicle: VehicleRecord): MileageChartPoint[] {
  const registrationYear = new Date(vehicle.registrationDate).getFullYear();
  const checkpoints = [...vehicle.history.mileageVerification.checkpoints].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  let previousMileage: number | null = null;

  return checkpoints.map((checkpoint) => {
    const year = new Date(checkpoint.date).getFullYear();
    const isDiscrepancy = previousMileage !== null && checkpoint.mileageKm < previousMileage;
    previousMileage = checkpoint.mileageKm;
    const yearsSinceRegistration = Math.max(0, year - registrationYear);

    return {
      date: checkpoint.date,
      year,
      actual: checkpoint.mileageKm,
      average: Math.round(AVERAGE_KM_PER_YEAR * yearsSinceRegistration),
      source: checkpoint.source,
      isDiscrepancy,
    };
  });
}
