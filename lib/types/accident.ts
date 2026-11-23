// ============================================================================
// Accident domain types.
// ============================================================================

export type AccidentSeverity = "Лёгкая" | "Средняя" | "Тяжёлая";

export type AccidentStatus = "Урегулировано" | "В процессе" | "Отклонено";

// Canonical damage-zone identifiers. These map 1:1 to clickable/highlightable
// regions in <CarDiagram />, so the diagram and the data generator must stay
// in sync with this list.
export type DamagedPart =
  | "front_bumper"
  | "rear_bumper"
  | "hood"
  | "roof"
  | "trunk"
  | "left_front_door"
  | "left_rear_door"
  | "right_front_door"
  | "right_rear_door"
  | "left_front_fender"
  | "right_front_fender"
  | "left_rear_fender"
  | "right_rear_fender"
  | "windshield";

export const DAMAGED_PART_LABELS: Record<DamagedPart, string> = {
  front_bumper: "Передний бампер",
  rear_bumper: "Задний бампер",
  hood: "Капот",
  roof: "Крыша",
  trunk: "Крышка багажника",
  left_front_door: "Левая передняя дверь",
  left_rear_door: "Левая задняя дверь",
  right_front_door: "Правая передняя дверь",
  right_rear_door: "Правая задняя дверь",
  left_front_fender: "Левое переднее крыло",
  right_front_fender: "Правое переднее крыло",
  left_rear_fender: "Левое заднее крыло",
  right_rear_fender: "Правое заднее крыло",
  windshield: "Лобовое стекло",
};

export interface AccidentPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface AccidentRecord {
  id: string;
  vehicleId: string;
  date: string; // ISO date
  time: string; // HH:mm
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  severity: AccidentSeverity;
  weather: string;
  description: string;
  damagedParts: DamagedPart[];
  repairEstimateUzs: number;
  insuranceCompany: string;
  status: AccidentStatus;
  photos: AccidentPhoto[];
  createdAt: string;
  updatedAt: string;
}

export type AccidentCreateInput = Omit<AccidentRecord, "id" | "createdAt" | "updatedAt">;
export type AccidentUpdateInput = Partial<AccidentCreateInput>;
