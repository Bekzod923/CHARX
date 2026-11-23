import {
  AccidentCreateInput,
  AccidentRecord,
  AccidentUpdateInput,
  PlatformStats,
  VehicleCreateInput,
  VehicleRecord,
  VehicleUpdateInput,
} from "@/lib/types";

/**
 * DatabaseProvider
 * ---------------------------------------------------------------------------
 * The ONLY boundary that is allowed to know where data actually lives.
 *
 * Every other layer (repositories, services, API routes, UI) depends on this
 * interface — never on a concrete implementation. Today `FakeDatabaseProvider`
 * is the implementation, reading/writing a local JSON "registry". Tomorrow it
 * could be:
 *
 *   - PostgresDatabaseProvider   (pg / Prisma against a real database)
 *   - RestApiDatabaseProvider    (fetch against an internal REST service)
 *   - GraphQLDatabaseProvider    (a GraphQL client against a gateway)
 *   - GovernmentRegistryProvider (the real government vehicle registry)
 *   - MicroserviceProvider       (gRPC/HTTP against a dedicated service)
 *
 * As long as the new class implements this interface, nothing in
 * lib/repositories, lib/services, app/api, or any component needs to change.
 * Wire the replacement in lib/di/container.ts only.
 * ---------------------------------------------------------------------------
 */
export interface DatabaseProvider {
  // ----- vehicles -----------------------------------------------------------
  getAllVehicles(): Promise<VehicleRecord[]>;
  getVehicleById(id: string): Promise<VehicleRecord | null>;
  /** Case-insensitive match against VIN or plate (spaces/dashes ignored). */
  findVehicleByPlateOrVin(query: string): Promise<VehicleRecord | null>;
  createVehicle(input: VehicleCreateInput): Promise<VehicleRecord>;
  updateVehicle(id: string, input: VehicleUpdateInput): Promise<VehicleRecord | null>;
  deleteVehicle(id: string): Promise<boolean>;

  // ----- accidents ------------------------------------------------------------
  getAllAccidents(): Promise<AccidentRecord[]>;
  getAccidentsByVehicleId(vehicleId: string): Promise<AccidentRecord[]>;
  getAccidentById(id: string): Promise<AccidentRecord | null>;
  createAccident(input: AccidentCreateInput): Promise<AccidentRecord>;
  updateAccident(id: string, input: AccidentUpdateInput): Promise<AccidentRecord | null>;
  deleteAccident(id: string): Promise<boolean>;

  // ----- aggregate ------------------------------------------------------------
  getPlatformStats(): Promise<PlatformStats>;
}
