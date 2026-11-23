// ============================================================================
// Vehicle domain types.
// These types are the contract between every layer of the app (UI, service,
// repository, provider). They must never import anything from the data
// layer, so swapping FakeDatabaseProvider for a real provider later never
// requires touching these definitions.
// ============================================================================

import { VehicleHistoryExtras } from "./vehicle-history";

export type FuelType = "Бензин" | "Дизель" | "Электро" | "Гибрид" | "Газ/Бензин";

export type Transmission = "Механическая" | "Автоматическая" | "Вариатор" | "Робот";

export interface VehicleRecord {
  id: string;
  vin: string;
  plate: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  engine: string;
  transmission: Transmission;
  fuelType: FuelType;
  mileageKm: number;
  ownerCount: number;
  registrationDate: string; // ISO date
  registrationCity: string;
  history: VehicleHistoryExtras;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListItem
  extends Pick<
    VehicleRecord,
    "id" | "vin" | "plate" | "brand" | "model" | "year" | "color"
  > {
  accidentCount: number;
}

export type VehicleCreateInput = Omit<VehicleRecord, "id" | "createdAt" | "updatedAt" | "history"> & {
  history?: VehicleHistoryExtras;
};
export type VehicleUpdateInput = Partial<VehicleCreateInput>;
