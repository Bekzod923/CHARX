import { StatsRepository } from "@/lib/repositories/stats-repository";
import { PlatformStats } from "@/lib/types";

export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  getStats(): Promise<PlatformStats> {
    return this.statsRepository.getPlatformStats();
  }
}
