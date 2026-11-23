import { VehicleRepository } from "@/lib/repositories/vehicle-repository";
import { VehicleCreateInput, VehicleListItem, VehicleRecord, VehicleUpdateInput } from "@/lib/types";
import { AccidentRepository } from "@/lib/repositories/accident-repository";

export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly accidentRepository: AccidentRepository
  ) {}

  async search(query: string): Promise<VehicleRecord | null> {
    const trimmed = query.trim();
    if (trimmed.length < 4) return null;
    return this.vehicleRepository.findByPlateOrVin(trimmed);
  }

  getById(id: string): Promise<VehicleRecord | null> {
    return this.vehicleRepository.findById(id);
  }

  async listForAdmin(): Promise<VehicleListItem[]> {
    const [vehicles, accidents] = await Promise.all([
      this.vehicleRepository.findAll(),
      this.accidentRepository.findAll(),
    ]);
    const counts = new Map<string, number>();
    for (const acc of accidents) counts.set(acc.vehicleId, (counts.get(acc.vehicleId) ?? 0) + 1);

    return vehicles
      .map((v) => ({
        id: v.id,
        vin: v.vin,
        plate: v.plate,
        brand: v.brand,
        model: v.model,
        year: v.year,
        color: v.color,
        accidentCount: counts.get(v.id) ?? 0,
      }))
      .sort((a, b) => a.plate.localeCompare(b.plate));
  }

  create(input: VehicleCreateInput): Promise<VehicleRecord> {
    return this.vehicleRepository.create(input);
  }

  update(id: string, input: VehicleUpdateInput): Promise<VehicleRecord | null> {
    return this.vehicleRepository.update(id, input);
  }

  remove(id: string): Promise<boolean> {
    return this.vehicleRepository.remove(id);
  }
}
