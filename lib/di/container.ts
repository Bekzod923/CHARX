import { DatabaseProvider } from "@/lib/db/provider";
import { FakeDatabaseProvider } from "@/lib/db/fake-provider";
import { VehicleRepository } from "@/lib/repositories/vehicle-repository";
import { AccidentRepository } from "@/lib/repositories/accident-repository";
import { StatsRepository } from "@/lib/repositories/stats-repository";
import { VehicleService } from "@/lib/services/vehicle-service";
import { AccidentService } from "@/lib/services/accident-service";
import { ScoreService } from "@/lib/services/score-service";
import { ReportService } from "@/lib/services/report-service";
import { StatsService } from "@/lib/services/stats-service";

/**
 * Composition root.
 * ---------------------------------------------------------------------------
 * This is the ONLY file that should ever construct a DatabaseProvider or
 * wire it into a repository. Everything downstream (services, API routes,
 * server components) imports the already-assembled singletons below.
 *
 * To point the whole app at a real backend later, change ONE line:
 *
 *   const provider: DatabaseProvider = new FakeDatabaseProvider();
 *   // becomes, e.g.:
 *   const provider: DatabaseProvider = new PostgresDatabaseProvider(pool);
 *
 * No repository, service, API route, or component needs to change.
 * ---------------------------------------------------------------------------
 */

// Cache the container on `globalThis` in dev so Next.js's module hot-reload
// doesn't spin up a fresh in-memory dataset on every file save.
const globalForContainer = globalThis as unknown as {
  __carproofContainer?: ReturnType<typeof buildContainer>;
};

function buildContainer() {
  const provider: DatabaseProvider = new FakeDatabaseProvider();

  const vehicleRepository = new VehicleRepository(provider);
  const accidentRepository = new AccidentRepository(provider);
  const statsRepository = new StatsRepository(provider);

  const vehicleService = new VehicleService(vehicleRepository, accidentRepository);
  const accidentService = new AccidentService(accidentRepository);
  const scoreService = new ScoreService();
  const reportService = new ReportService(vehicleService, accidentService, scoreService);
  const statsService = new StatsService(statsRepository);

  return {
    provider,
    vehicleRepository,
    accidentRepository,
    statsRepository,
    vehicleService,
    accidentService,
    scoreService,
    reportService,
    statsService,
  };
}

export const container = globalForContainer.__carproofContainer ?? buildContainer();

if (process.env.NODE_ENV !== "production") {
  globalForContainer.__carproofContainer = container;
}
