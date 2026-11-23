import { DatabaseProvider } from "@/lib/db/provider";
import { PlatformStats } from "@/lib/types";

export class StatsRepository {
  constructor(private readonly provider: DatabaseProvider) {}

  getPlatformStats(): Promise<PlatformStats> {
    return this.provider.getPlatformStats();
  }
}
