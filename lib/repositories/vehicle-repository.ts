import { DatabaseProvider } from "@/lib/db/provider";
import { VehicleCreateInput, VehicleRecord, VehicleUpdateInput } from "@/lib/types";

/**
 * VehicleRepository
 * ---------------------------------------------------------------------------
 * Sits between services and the DatabaseProvider. It knows nothing about
 * HTTP, JSON files, or any concrete storage technology — only about how to
 * ask the injected provider for vehicle data. Services depend on this class,
 * never on DatabaseProvider directly, which keeps a second seam available
 * (e.g. adding caching, batching, or read replicas) without touching
 * business logic.
 * ---------------------------------------------------------------------------
 */
export class VehicleRepository {
  constructor(private readonly provider: DatabaseProvider) {}

  findAll(): Promise<VehicleRecord[]> {
    return this.provider.getAllVehicles();
  }

  findById(id: string): Promise<VehicleRecord | null> {
    return this.provider.getVehicleById(id);
  }

  findByPlateOrVin(query: string): Promise<VehicleRecord | null> {
    return this.provider.findVehicleByPlateOrVin(query);
  }

  create(input: VehicleCreateInput): Promise<VehicleRecord> {
    return this.provider.createVehicle(input);
  }

  update(id: string, input: VehicleUpdateInput): Promise<VehicleRecord | null> {
    return this.provider.updateVehicle(id, input);
  }

  remove(id: string): Promise<boolean> {
    return this.provider.deleteVehicle(id);
  }
}
