import { VehicleCreateInput, VehicleHistoryExtras } from "@/lib/types";

const ORIGIN_BY_BRAND: Record<string, string> = {
  Chevrolet: "Узбекистан",
  Kia: "Республика Корея",
  Hyundai: "Республика Корея",
  Toyota: "Япония",
  Honda: "Япония",
  Lexus: "Япония",
  BMW: "Германия",
  "Mercedes-Benz": "Германия",
  Volkswagen: "Германия",
  BYD: "Китай",
};

function randomDeclarationNumber(): string {
  const digits = () => Math.floor(1000 + Math.random() * 9000);
  return `UZ-${digits()}-${digits()}`;
}

/**
 * Builds a clean, uneventful history record for a vehicle the admin enters
 * by hand — one owner (the current registration), a single mileage
 * checkpoint at today's reading, no taxi/loan/auction/restriction flags.
 * The generated fake registry (scripts/generate-db.js) produces much
 * richer, weighted-random histories; this is intentionally minimal since
 * the admin panel has no UI for authoring 8 sub-records by hand.
 */
export function buildDefaultVehicleHistory(input: VehicleCreateInput): VehicleHistoryExtras {
  const now = new Date().toISOString().slice(0, 10);

  return {
    ownership: {
      periods: [
        {
          ownerNumber: 1,
          ownerType: "Физическое лицо",
          city: input.registrationCity,
          fromDate: input.registrationDate,
          toDate: null,
        },
      ],
    },
    mileageVerification: {
      verdict: "consistent",
      checkpoints: [
        { date: input.registrationDate, mileageKm: 0, source: "Постановка на учёт" },
        { date: now, mileageKm: input.mileageKm, source: "Диагностика при покупке" },
      ],
    },
    taxiHistory: { wasUsedAsTaxi: false, periods: [] },
    loanStatus: { status: "none", lender: null, amountUzs: null, sinceDate: null, releasedDate: null },
    importHistory: {
      originCountry: ORIGIN_BY_BRAND[input.brand] ?? "Узбекистан",
      importType: "С пробегом",
      customsDate: input.registrationDate,
      declarationNumber: (ORIGIN_BY_BRAND[input.brand] ?? "Узбекистан") === "Узбекистан" ? null : randomDeclarationNumber(),
    },
    auctionHistory: { wasAuctioned: false, records: [] },
    restrictions: { hasActiveRestrictions: false, records: [] },
    registrationHistory: {
      events: [{ date: input.registrationDate, type: "Постановка на учёт", city: input.registrationCity }],
    },
  };
}
