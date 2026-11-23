// ============================================================================
// Extended vehicle history types — the 8 checks that used to be "coming
// soon" teaser cards and are now real, generated data attached to every
// vehicle record (see scripts/generate-db.js for how they're produced, and
// lib/db/default-history.ts for the minimal fallback used when an admin
// adds a new vehicle by hand).
//
// Every enum-like field uses the same "canonical Russian value, translated
// at render time" convention as the rest of the domain model — see
// lib/i18n/domain-labels.ts.
// ============================================================================

// ----- 1. Ownership history -------------------------------------------------

export type OwnerType = "Физическое лицо" | "Юридическое лицо";

export interface OwnershipPeriod {
  ownerNumber: number;
  ownerType: OwnerType;
  city: string;
  fromDate: string; // ISO date
  toDate: string | null; // null = current owner
}

export interface OwnershipHistory {
  periods: OwnershipPeriod[];
}

// ----- 2. Mileage verification ----------------------------------------------

export type MileageCheckpointSource =
  | "Постановка на учёт"
  | "Техосмотр"
  | "Плановое ТО"
  | "Диагностика при покупке"
  | "Продажа автомобиля";

export interface MileageCheckpoint {
  date: string;
  mileageKm: number;
  source: MileageCheckpointSource;
}

export type MileageVerdict = "consistent" | "discrepancy";

export interface MileageVerification {
  verdict: MileageVerdict;
  checkpoints: MileageCheckpoint[];
}

// ----- 3. Taxi / rideshare history -------------------------------------------

export interface TaxiUsagePeriod {
  operator: string;
  fromDate: string;
  toDate: string | null;
}

export interface TaxiHistory {
  wasUsedAsTaxi: boolean;
  periods: TaxiUsagePeriod[];
}

// ----- 4. Loan / lien status --------------------------------------------------

export type LienStatus = "none" | "active" | "released";

export interface LoanStatus {
  status: LienStatus;
  lender: string | null;
  amountUzs: number | null;
  sinceDate: string | null;
  releasedDate: string | null;
}

// ----- 5. Import history -------------------------------------------------------

export type ImportType = "Новый" | "С пробегом";

export interface ImportHistory {
  originCountry: string;
  importType: ImportType;
  customsDate: string;
  declarationNumber: string | null;
}

// ----- 6. Auction history --------------------------------------------------------

export type AuctionResult = "Продано" | "Не продано";

export interface AuctionRecord {
  date: string;
  auctionHouse: string;
  startPriceUzs: number;
  finalPriceUzs: number | null;
  result: AuctionResult;
}

export interface AuctionHistory {
  wasAuctioned: boolean;
  records: AuctionRecord[];
}

// ----- 7. Restrictions / wanted status ---------------------------------------------

export type RestrictionType = "Розыск" | "Арест" | "Ограничение на регистрационные действия";
export type RestrictionStatus = "Активно" | "Снято";

export interface RestrictionRecord {
  type: RestrictionType;
  date: string;
  status: RestrictionStatus;
  liftedDate: string | null;
}

export interface RestrictionsHistory {
  hasActiveRestrictions: boolean;
  records: RestrictionRecord[];
}

// ----- 8. Registration history -----------------------------------------------------

export type RegistrationEventType =
  | "Постановка на учёт"
  | "Перерегистрация"
  | "Смена региона";

export interface RegistrationEvent {
  date: string;
  type: RegistrationEventType;
  city: string;
}

export interface RegistrationHistory {
  events: RegistrationEvent[];
}

// ----- bundle ------------------------------------------------------------------------

export interface VehicleHistoryExtras {
  ownership: OwnershipHistory;
  mileageVerification: MileageVerification;
  taxiHistory: TaxiHistory;
  loanStatus: LoanStatus;
  importHistory: ImportHistory;
  auctionHistory: AuctionHistory;
  restrictions: RestrictionsHistory;
  registrationHistory: RegistrationHistory;
}
