import { VehicleService } from "./vehicle-service";
import { AccidentService } from "./accident-service";
import { ScoreService } from "./score-service";
import { VehicleReport } from "@/lib/types";

function generateReportNumber(vehicleId: string): string {
  const year = new Date().getFullYear();
  const suffix = vehicleId.replace(/\D/g, "").padStart(6, "0").slice(-6);
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `CP-UZ-${year}-${suffix}-${random}`;
}

/**
 * ReportService
 * ---------------------------------------------------------------------------
 * Orchestrates the other services to build the single object the report
 * page and the /api/search route need. This is the layer the UI actually
 * talks to for a vehicle check — it never touches repositories or the
 * DatabaseProvider directly.
 * ---------------------------------------------------------------------------
 */
export class ReportService {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly accidentService: AccidentService,
    private readonly scoreService: ScoreService
  ) {}

  async generateByQuery(query: string): Promise<VehicleReport | null> {
    const vehicle = await this.vehicleService.search(query);
    if (!vehicle) return null;
    return this.buildReport(vehicle.id);
  }

  async generateByVehicleId(vehicleId: string): Promise<VehicleReport | null> {
    return this.buildReport(vehicleId);
  }

  private async buildReport(vehicleId: string): Promise<VehicleReport | null> {
    const vehicle = await this.vehicleService.getById(vehicleId);
    if (!vehicle) return null;

    const accidents = await this.accidentService.getTimelineForVehicle(vehicleId);
    const score = this.scoreService.calculate(accidents);

    return {
      reportNumber: generateReportNumber(vehicleId),
      generatedAt: new Date().toISOString(),
      vehicle,
      accidents,
      score,
    };
  }
}
