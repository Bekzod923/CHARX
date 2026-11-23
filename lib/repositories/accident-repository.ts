import { DatabaseProvider } from "@/lib/db/provider";
import { AccidentCreateInput, AccidentRecord, AccidentUpdateInput } from "@/lib/types";

export class AccidentRepository {
  constructor(private readonly provider: DatabaseProvider) {}

  findAll(): Promise<AccidentRecord[]> {
    return this.provider.getAllAccidents();
  }

  findByVehicleId(vehicleId: string): Promise<AccidentRecord[]> {
    return this.provider.getAccidentsByVehicleId(vehicleId);
  }

  findById(id: string): Promise<AccidentRecord | null> {
    return this.provider.getAccidentById(id);
  }

  create(input: AccidentCreateInput): Promise<AccidentRecord> {
    return this.provider.createAccident(input);
  }

  update(id: string, input: AccidentUpdateInput): Promise<AccidentRecord | null> {
    return this.provider.updateAccident(id, input);
  }

  remove(id: string): Promise<boolean> {
    return this.provider.deleteAccident(id);
  }
}
