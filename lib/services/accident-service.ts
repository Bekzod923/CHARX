import { AccidentRepository } from "@/lib/repositories/accident-repository";
import { AccidentCreateInput, AccidentRecord, AccidentUpdateInput } from "@/lib/types";

export class AccidentService {
  constructor(private readonly accidentRepository: AccidentRepository) {}

  getTimelineForVehicle(vehicleId: string): Promise<AccidentRecord[]> {
    return this.accidentRepository.findByVehicleId(vehicleId);
  }

  listAll(): Promise<AccidentRecord[]> {
    return this.accidentRepository.findAll();
  }

  getById(id: string): Promise<AccidentRecord | null> {
    return this.accidentRepository.findById(id);
  }

  create(input: AccidentCreateInput): Promise<AccidentRecord> {
    return this.accidentRepository.create(input);
  }

  update(id: string, input: AccidentUpdateInput): Promise<AccidentRecord | null> {
    return this.accidentRepository.update(id, input);
  }

  remove(id: string): Promise<boolean> {
    return this.accidentRepository.remove(id);
  }
}
