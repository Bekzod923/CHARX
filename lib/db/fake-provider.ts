import fs from "fs";
import os from "os";
import path from "path";
import {
  AccidentCreateInput,
  AccidentRecord,
  AccidentUpdateInput,
  PlatformStats,
  VehicleCreateInput,
  VehicleRecord,
  VehicleUpdateInput,
} from "@/lib/types";
import { DatabaseProvider } from "./provider";
import { buildDefaultVehicleHistory } from "./default-history";

const DATA_DIR = path.join(process.cwd(), "lib", "data");
const VEHICLES_SEED_PATH = path.join(DATA_DIR, "vehicles.json");
const ACCIDENTS_SEED_PATH = path.join(DATA_DIR, "accidents.json");

/**
 * Many hosting platforms (Vercel, Netlify, and most serverless runtimes)
 * deploy the app onto a READ-ONLY filesystem — only /tmp is writable, and
 * even that doesn't survive across cold starts/instances. Rather than let
 * admin writes crash with EROFS on those platforms, we detect a read-only
 * DATA_DIR once at startup and fall back to a writable tmp directory. Reads
 * always still work everywhere, since the bundled seed JSON is always
 * readable — only writes (admin create/update/delete) fall back.
 *
 * On a normal long-running host (your own machine, a VPS, Railway, Render),
 * DATA_DIR is writable, so this is a no-op and writes persist normally.
 */
function resolveWritableDataDir(): string {
  try {
    fs.accessSync(DATA_DIR, fs.constants.W_OK);
    return DATA_DIR;
  } catch {
    const fallback = path.join(os.tmpdir(), "carproof-data");
    fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const WRITABLE_DATA_DIR = resolveWritableDataDir();
const VEHICLES_WRITE_PATH = path.join(WRITABLE_DATA_DIR, "vehicles.json");
const ACCIDENTS_WRITE_PATH = path.join(WRITABLE_DATA_DIR, "accidents.json");
const IS_READONLY_HOST = WRITABLE_DATA_DIR !== DATA_DIR;

function normalizeQuery(q: string): string {
  return q.trim().toUpperCase().replace(/[\s-]/g, "");
}

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function nextId(prefix: string, existing: { id: string }[]): string {
  const max = existing.reduce((acc, item) => {
    const n = Number(item.id.split("_")[1] ?? 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `${prefix}_${String(max + 1).padStart(5, "0")}`;
}

/** Whether admin writes on this host persist to disk across requests/restarts. */
export function isPersistenceAvailable(): boolean {
  return !IS_READONLY_HOST;
}

/**
 * FakeDatabaseProvider
 * ---------------------------------------------------------------------------
 * A local, file-backed stand-in for a real government vehicle registry.
 * It deliberately mimics the *shape* of a networked provider (async methods,
 * no synchronous leakage of storage details) so swapping it out later is a
 * one-file change — see lib/db/provider.ts for the contract, and
 * lib/di/container.ts for where this is instantiated.
 *
 * Reads are cached in memory per process; writes go straight through to the
 * JSON files so admin CRUD changes survive a page refresh in dev.
 * ---------------------------------------------------------------------------
 */
export class FakeDatabaseProvider implements DatabaseProvider {
  private vehicles: VehicleRecord[] | null = null;
  private accidents: AccidentRecord[] | null = null;

  private loadVehicles(): VehicleRecord[] {
    if (!this.vehicles) {
      const source = fs.existsSync(VEHICLES_WRITE_PATH) ? VEHICLES_WRITE_PATH : VEHICLES_SEED_PATH;
      this.vehicles = readJson<VehicleRecord[]>(source);
    }
    return this.vehicles;
  }

  private loadAccidents(): AccidentRecord[] {
    if (!this.accidents) {
      const source = fs.existsSync(ACCIDENTS_WRITE_PATH) ? ACCIDENTS_WRITE_PATH : ACCIDENTS_SEED_PATH;
      this.accidents = readJson<AccidentRecord[]>(source);
    }
    return this.accidents;
  }

  private persistVehicles() {
    if (!this.vehicles) return;
    try {
      writeJson(VEHICLES_WRITE_PATH, this.vehicles);
    } catch (err) {
      console.warn("[Charx] Не удалось сохранить изменения на диск — правки сохранятся только в памяти этого сеанса.", err);
    }
  }

  private persistAccidents() {
    if (!this.accidents) return;
    try {
      writeJson(ACCIDENTS_WRITE_PATH, this.accidents);
    } catch (err) {
      console.warn("[Charx] Не удалось сохранить изменения на диск — правки сохранятся только в памяти этого сеанса.", err);
    }
  }

  // ----- vehicles -------------------------------------------------------------

  async getAllVehicles(): Promise<VehicleRecord[]> {
    return [...this.loadVehicles()];
  }

  async getVehicleById(id: string): Promise<VehicleRecord | null> {
    return this.loadVehicles().find((v) => v.id === id) ?? null;
  }

  async findVehicleByPlateOrVin(query: string): Promise<VehicleRecord | null> {
    const q = normalizeQuery(query);
    if (!q) return null;
    return (
      this.loadVehicles().find(
        (v) => normalizeQuery(v.plate) === q || normalizeQuery(v.vin) === q
      ) ?? null
    );
  }

  async createVehicle(input: VehicleCreateInput): Promise<VehicleRecord> {
    const vehicles = this.loadVehicles();
    const now = new Date().toISOString();
    const record: VehicleRecord = {
      ...input,
      history: input.history ?? buildDefaultVehicleHistory(input),
      id: nextId("veh", vehicles),
      createdAt: now,
      updatedAt: now,
    };
    vehicles.push(record);
    this.persistVehicles();
    return record;
  }

  async updateVehicle(id: string, input: VehicleUpdateInput): Promise<VehicleRecord | null> {
    const vehicles = this.loadVehicles();
    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const current = vehicles[idx];
    if (!current) return null;
    const updated: VehicleRecord = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    vehicles[idx] = updated;
    this.persistVehicles();
    return updated;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const vehicles = this.loadVehicles();
    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    vehicles.splice(idx, 1);
    this.persistVehicles();

    // cascade delete related accidents
    const accidents = this.loadAccidents();
    const remaining = accidents.filter((a) => a.vehicleId !== id);
    if (remaining.length !== accidents.length) {
      this.accidents = remaining;
      this.persistAccidents();
    }
    return true;
  }

  // ----- accidents --------------------------------------------------------------

  async getAllAccidents(): Promise<AccidentRecord[]> {
    return [...this.loadAccidents()];
  }

  async getAccidentsByVehicleId(vehicleId: string): Promise<AccidentRecord[]> {
    return this.loadAccidents()
      .filter((a) => a.vehicleId === vehicleId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async getAccidentById(id: string): Promise<AccidentRecord | null> {
    return this.loadAccidents().find((a) => a.id === id) ?? null;
  }

  async createAccident(input: AccidentCreateInput): Promise<AccidentRecord> {
    const accidents = this.loadAccidents();
    const now = new Date().toISOString();
    const record: AccidentRecord = {
      ...input,
      id: nextId("acc", accidents),
      createdAt: now,
      updatedAt: now,
    };
    accidents.push(record);
    this.persistAccidents();
    return record;
  }

  async updateAccident(id: string, input: AccidentUpdateInput): Promise<AccidentRecord | null> {
    const accidents = this.loadAccidents();
    const idx = accidents.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const current = accidents[idx];
    if (!current) return null;
    const updated: AccidentRecord = {
      ...current,
      ...input,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    accidents[idx] = updated;
    this.persistAccidents();
    return updated;
  }

  async deleteAccident(id: string): Promise<boolean> {
    const accidents = this.loadAccidents();
    const idx = accidents.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    accidents.splice(idx, 1);
    this.persistAccidents();
    return true;
  }

  // ----- aggregate ----------------------------------------------------------------

  async getPlatformStats(): Promise<PlatformStats> {
    const vehicles = this.loadVehicles();
    const accidents = this.loadAccidents();
    const cities = new Set(vehicles.map((v) => v.registrationCity));
    return {
      vehiclesChecked: vehicles.length,
      accidentsFound: accidents.length,
      verifiedReports: Math.round(vehicles.length * 1.4),
      citiesCovered: cities.size,
    };
  }
}
