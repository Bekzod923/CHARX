/**
 * generate-db.js
 * ---------------------------------------------------------------------------
 * Produces the fake "government registry" JSON database used by
 * FakeDatabaseProvider. This script has ZERO external dependencies and ZERO
 * network calls — it only writes local JSON files — so it can run in any
 * environment with plain Node.js.
 *
 * Run with: npm run generate:db
 *
 * Output:
 *   lib/data/vehicles.json
 *   lib/data/accidents.json
 *   lib/data/meta.json
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

// ----- seeded RNG (mulberry32) so the dataset is stable across runs -------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260724);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickWeighted = (entries) => {
  // entries: [[value, weight], ...]
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, weight] of entries) {
    if (r < weight) return value;
    r -= weight;
  }
  return entries[entries.length - 1][0];
};
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const uuid = (prefix, i) => `${prefix}_${String(i).padStart(5, "0")}`;

// ----- reference data -------------------------------------------------------

const CITIES = [
  { name: "Ташкент", lat: 41.2995, lng: 69.2401, regionCode: "01" },
  { name: "Самарканд", lat: 39.6542, lng: 66.9597, regionCode: "20" },
  { name: "Бухара", lat: 39.7747, lng: 64.4286, regionCode: "25" },
  { name: "Андижан", lat: 40.7821, lng: 72.3442, regionCode: "30" },
  { name: "Наманган", lat: 41.0011, lng: 71.6726, regionCode: "35" },
  { name: "Фергана", lat: 40.3894, lng: 71.7864, regionCode: "40" },
  { name: "Навои", lat: 40.0844, lng: 65.3792, regionCode: "50" },
  { name: "Карши", lat: 38.8606, lng: 65.7891, regionCode: "60" },
  { name: "Термез", lat: 37.2242, lng: 67.2783, regionCode: "70" },
  { name: "Нукус", lat: 42.4531, lng: 59.6103, regionCode: "85" },
];

const BRAND_MODELS = {
  Chevrolet: [
    ["Cobalt", "LT"],
    ["Cobalt", "LTZ"],
    ["Nexia", "3"],
    ["Malibu", "LT"],
    ["Malibu", "Premier"],
    ["Tracker", "LT"],
    ["Spark", "LT"],
    ["Onix", "LT"],
    ["Lacetti", "SE"],
  ],
  Toyota: [
    ["Camry", "70"],
    ["Camry", "75"],
    ["Corolla", "Standard"],
    ["Corolla", "Prestige"],
    ["Land Cruiser", "200"],
    ["Land Cruiser Prado", "TX"],
    ["RAV4", "Adventure"],
    ["Highlander", "XLE"],
  ],
  Kia: [
    ["Cerato", "Comfort"],
    ["Cerato", "Prestige"],
    ["Sportage", "Luxe"],
    ["Rio", "Comfort"],
    ["Sorento", "Prestige"],
    ["K5", "Luxe"],
  ],
  Hyundai: [
    ["Sonata", "Style"],
    ["Tucson", "Dynamic"],
    ["Elantra", "Comfort"],
    ["Santa Fe", "Style"],
    ["Accent", "Comfort"],
  ],
  BYD: [
    ["Song Plus", "Champion"],
    ["Han", "EV"],
    ["Atto 3", "Boost"],
    ["Seal", "Premium"],
    ["Yuan Plus", "Flagship"],
  ],
  BMW: [
    ["3 Series", "320i"],
    ["5 Series", "530i"],
    ["X5", "xDrive40i"],
    ["X3", "xDrive30i"],
  ],
  "Mercedes-Benz": [
    ["E-Class", "E200"],
    ["C-Class", "C200"],
    ["GLE", "350"],
    ["S-Class", "S450"],
  ],
  Lexus: [
    ["RX", "350"],
    ["ES", "250"],
    ["LX", "600"],
  ],
  Honda: [
    ["CR-V", "EX"],
    ["Accord", "Sport"],
    ["Civic", "EX"],
  ],
  Volkswagen: [
    ["Passat", "Business"],
    ["Tiguan", "Comfortline"],
    ["Polo", "Comfortline"],
  ],
};

const COLORS = [
  "Белый",
  "Чёрный",
  "Серебристый",
  "Серый",
  "Синий",
  "Красный",
  "Тёмно-синий",
  "Бежевый",
  "Коричневый",
  "Зелёный",
];

const ENGINES = ["1.2L", "1.5L", "1.6L", "1.8L", "2.0L", "2.5L", "2.0L Turbo", "3.0L", "Электро 150 кВт"];
const TRANSMISSIONS = ["Механическая", "Автоматическая", "Вариатор", "Робот"];
const FUEL_TYPES = ["Бензин", "Дизель", "Электро", "Гибрид", "Газ/Бензин"];

const WEATHER = ["Ясно", "Облачно", "Дождь", "Туман", "Гололёд", "Снег"];
const INSURERS = [
  "Ишонч Life",
  "Тинчлик Суғурта",
  "Ватан Иншуранс",
  "Малика Иншуранс",
  "Достлик Суғурта",
  "Нет полиса",
];
const STATUSES = ["Урегулировано", "В процессе", "Отклонено"];

// ----- extended vehicle history reference data --------------------------------

const OWNER_TYPES_WEIGHTED = [
  ["Физическое лицо", 8],
  ["Юридическое лицо", 2],
];

const MILEAGE_SOURCES = ["Техосмотр", "Плановое ТО", "Диагностика при покупке", "Продажа автомобиля"];

// Fictional company names throughout — deliberately not matching any real
// taxi operator, bank, or auction house, since this is fake registry data.
const TAXI_OPERATORS = ["TezYur", "ShaharTaxi", "Yo'lTaxi", "ApexTaxi", "MilliTaxi"];
const LENDERS = ["Ишонч Молия Банк", "Келажак Банк", "Тонг Банк", "Нажот Молия", "Юлдуз Банк"];
const AUCTION_HOUSES = ["АвтоТорг Узбекистан", "Тезкор Аукцион", "Миллий АвтоАукцион"];
const RESTRICTION_TYPES = ["Розыск", "Арест", "Ограничение на регистрационные действия"];

const ORIGIN_BY_BRAND = {
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

const DAMAGE_PART_POOL = [
  "front_bumper",
  "rear_bumper",
  "hood",
  "roof",
  "trunk",
  "left_front_door",
  "left_rear_door",
  "right_front_door",
  "right_rear_door",
  "left_front_fender",
  "right_front_fender",
  "left_rear_fender",
  "right_rear_fender",
  "windshield",
];

const PART_LABELS = {
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

const PART_TO_PHOTO = {
  front_bumper: "front-bumper.svg",
  rear_bumper: "rear-bumper.svg",
  hood: "hood-dent.svg",
  roof: "roof-dent.svg",
  trunk: "rear-bumper.svg",
  left_front_door: "door-dent.svg",
  left_rear_door: "door-dent.svg",
  right_front_door: "door-dent.svg",
  right_rear_door: "door-dent.svg",
  left_front_fender: "fender-scratch.svg",
  right_front_fender: "fender-scratch.svg",
  left_rear_fender: "fender-scratch.svg",
  right_rear_fender: "fender-scratch.svg",
  windshield: "windshield-crack.svg",
};

const DESCRIPTIONS_BY_SEVERITY = {
  "Лёгкая": [
    "Незначительное касание при парковке, поверхностные царапины.",
    "Лёгкое ДТП на перекрёстке, повреждена только облицовка.",
    "Наезд на бордюр, деформация без нарушения геометрии кузова.",
    "Царапина от соседнего автомобиля на стоянке торгового центра.",
  ],
  "Средняя": [
    "Столкновение при перестроении на городской улице, деформация двери.",
    "ДТП на регулируемом перекрёстке, повреждён кузов и оптика.",
    "Наезд на препятствие на обочине трассы, требуется ремонт крыла.",
    "Боковое столкновение при развороте, деформация панели кузова.",
  ],
  "Тяжёлая": [
    "Серьёзное столкновение на трассе, значительные повреждения кузова.",
    "ДТП с опрокидыванием на обледенелой дороге.",
    "Лобовое столкновение на загородной трассе, повреждена силовая структура.",
    "Множественное столкновение в условиях плохой видимости.",
  ],
};

// ----- VIN / plate helpers ---------------------------------------------------

const VIN_CHARS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"; // excludes I, O, Q
function generateVin(i) {
  let vin = "";
  for (let c = 0; c < 17; c++) vin += VIN_CHARS[Math.floor(rand() * VIN_CHARS.length)];
  return vin;
}

const PLATE_LETTERS = "ABCDEHKMOPTXYZ"; // Uzbek plates use Latin-looking Cyrillic-compatible letters
function generatePlate(regionCode) {
  const l1 = PLATE_LETTERS[Math.floor(rand() * PLATE_LETTERS.length)];
  const l2 = PLATE_LETTERS[Math.floor(rand() * PLATE_LETTERS.length)];
  const digits = String(randInt(1, 999)).padStart(3, "0");
  return `${regionCode} ${l1} ${digits} ${l2}${PLATE_LETTERS[Math.floor(rand() * PLATE_LETTERS.length)]}`;
}

function isoDateBetween(startYear, endYear) {
  const year = randInt(startYear, endYear);
  const month = randInt(1, 12);
  const day = randInt(1, 28);
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
}

function jitter(value, amount) {
  return value + (rand() - 0.5) * amount;
}

function addDaysIso(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetweenIso(a, b) {
  return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000);
}

function randomDeclarationNumber() {
  return `UZ-${randInt(1000, 9999)}-${randInt(1000, 9999)}`;
}

/**
 * Generates the 8-part extended history record for a vehicle (ownership,
 * mileage verification, taxi use, loan/lien, import, auctions,
 * restrictions, registration events). All dates are derived from the
 * vehicle's own registrationDate through "today", using the same seeded
 * RNG as everything else so the dataset is reproducible.
 */
function generateVehicleHistory(vehicle) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const regDate = vehicle.registrationDate;
  const totalDays = Math.max(1, daysBetweenIso(regDate, todayIso));

  // ---- 1. Ownership periods --------------------------------------------------
  const ownerCount = vehicle.ownerCount;
  const boundaries = [0];
  for (let k = 1; k < ownerCount; k++) {
    boundaries.push(Math.round((totalDays * k) / ownerCount));
  }
  boundaries.push(totalDays);

  const ownershipPeriods = [];
  for (let k = 0; k < ownerCount; k++) {
    const isLastOwner = k === ownerCount - 1;
    const city = !isLastOwner && rand() < 0.25 ? pick(CITIES).name : vehicle.registrationCity;
    ownershipPeriods.push({
      ownerNumber: k + 1,
      ownerType: pickWeighted(OWNER_TYPES_WEIGHTED),
      city,
      fromDate: addDaysIso(regDate, boundaries[k]),
      toDate: isLastOwner ? null : addDaysIso(regDate, boundaries[k + 1]),
    });
  }

  // ---- 2. Mileage verification -----------------------------------------------
  const checkpointCount = randInt(2, 4);
  const rawDays = [0];
  for (let k = 1; k < checkpointCount - 1; k++) {
    rawDays.push(Math.round((totalDays * k) / (checkpointCount - 1)));
  }
  rawDays.push(totalDays);
  const uniqueDays = Array.from(new Set(rawDays)).sort((a, b) => a - b);

  const wantsDiscrepancy = rand() < 0.08 && uniqueDays.length > 2;
  const discrepancyIdx = wantsDiscrepancy ? randInt(1, uniqueDays.length - 2) : -1;
  let appliedDiscrepancy = false;

  const checkpoints = uniqueDays.map((dayOffset, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === uniqueDays.length - 1;
    const fraction = totalDays === 0 ? 1 : dayOffset / totalDays;
    let mileageAtPoint = isFirst ? 0 : isLast ? vehicle.mileageKm : Math.round(vehicle.mileageKm * fraction);
    const source = isFirst ? "Постановка на учёт" : isLast ? "Диагностика при покупке" : pick(MILEAGE_SOURCES);

    if (idx === discrepancyIdx) {
      // simulate an odometer rollback — a classic red flag for a buyer
      mileageAtPoint = Math.max(0, Math.round(mileageAtPoint * 0.4));
      appliedDiscrepancy = true;
    }

    return { date: addDaysIso(regDate, dayOffset), mileageKm: mileageAtPoint, source };
  });

  // ---- 3. Taxi / rideshare history --------------------------------------------
  const wasUsedAsTaxi = rand() < 0.12;
  const taxiPeriods = [];
  if (wasUsedAsTaxi) {
    const startOffset = randInt(0, Math.max(0, totalDays - 200));
    const durationDays = randInt(180, Math.max(200, totalDays - startOffset));
    const endOffset = Math.min(totalDays, startOffset + durationDays);
    const stillActive = endOffset >= totalDays - 30 && rand() < 0.3;
    taxiPeriods.push({
      operator: pick(TAXI_OPERATORS),
      fromDate: addDaysIso(regDate, startOffset),
      toDate: stillActive ? null : addDaysIso(regDate, endOffset),
    });
  }

  // ---- 4. Loan / lien status ---------------------------------------------------
  const loanRoll = pickWeighted([
    ["none", 75],
    ["active", 15],
    ["released", 10],
  ]);
  let loanStatus;
  if (loanRoll === "none") {
    loanStatus = { status: "none", lender: null, amountUzs: null, sinceDate: null, releasedDate: null };
  } else {
    const sinceOffset = randInt(0, totalDays);
    const sinceDate = addDaysIso(regDate, sinceOffset);
    const amountUzs = randInt(30, 250) * 1_000_000;
    if (loanRoll === "active") {
      loanStatus = { status: "active", lender: pick(LENDERS), amountUzs, sinceDate, releasedDate: null };
    } else {
      const releasedOffset = Math.min(totalDays, sinceOffset + randInt(90, 900));
      loanStatus = {
        status: "released",
        lender: pick(LENDERS),
        amountUzs,
        sinceDate,
        releasedDate: addDaysIso(regDate, releasedOffset),
      };
    }
  }

  // ---- 5. Import history ---------------------------------------------------------
  const originCountry = ORIGIN_BY_BRAND[vehicle.brand] || "Узбекистан";
  const isDomestic = originCountry === "Узбекистан";
  const importHistory = {
    originCountry,
    importType: pickWeighted([
      ["Новый", 55],
      ["С пробегом", 45],
    ]),
    customsDate: isDomestic ? regDate : addDaysIso(regDate, -randInt(3, 30)),
    declarationNumber: isDomestic ? null : randomDeclarationNumber(),
  };

  // ---- 6. Auction history -----------------------------------------------------------
  const wasAuctioned = rand() < 0.06;
  const auctionRecords = [];
  if (wasAuctioned) {
    const auctionOffset = randInt(Math.round(totalDays * 0.2), Math.max(1, Math.round(totalDays * 0.9)));
    const startPriceUzs = randInt(40, 220) * 1_000_000;
    const sold = rand() < 0.7;
    auctionRecords.push({
      date: addDaysIso(regDate, auctionOffset),
      auctionHouse: pick(AUCTION_HOUSES),
      startPriceUzs,
      finalPriceUzs: sold ? Math.round(startPriceUzs * (1 + rand() * 0.35)) : null,
      result: sold ? "Продано" : "Не продано",
    });
  }

  // ---- 7. Restrictions / wanted status -----------------------------------------------
  const hasRestrictionEver = rand() < 0.04;
  const restrictionRecords = [];
  let hasActiveRestrictions = false;
  if (hasRestrictionEver) {
    const isActive = rand() < 0.4;
    const startOffset = randInt(Math.round(totalDays * 0.3), totalDays);
    restrictionRecords.push({
      type: pick(RESTRICTION_TYPES),
      date: addDaysIso(regDate, startOffset),
      status: isActive ? "Активно" : "Снято",
      liftedDate: isActive ? null : addDaysIso(regDate, Math.min(totalDays, startOffset + randInt(10, 120))),
    });
    hasActiveRestrictions = isActive;
  }

  // ---- 8. Registration history ------------------------------------------------------
  const registrationEvents = [{ date: regDate, type: "Постановка на учёт", city: vehicle.registrationCity }];
  for (let k = 1; k < ownershipPeriods.length; k++) {
    const period = ownershipPeriods[k];
    registrationEvents.push({
      date: period.fromDate,
      type: rand() < 0.15 ? "Смена региона" : "Перерегистрация",
      city: period.city,
    });
  }

  return {
    ownership: { periods: ownershipPeriods },
    mileageVerification: { verdict: appliedDiscrepancy ? "discrepancy" : "consistent", checkpoints },
    taxiHistory: { wasUsedAsTaxi, periods: taxiPeriods },
    loanStatus,
    importHistory,
    auctionHistory: { wasAuctioned, records: auctionRecords },
    restrictions: { hasActiveRestrictions, records: restrictionRecords },
    registrationHistory: { events: registrationEvents },
  };
}

// ----- generation ------------------------------------------------------------

const vehicles = [];
const accidents = [];

const VEHICLE_COUNT = 200;

for (let i = 1; i <= VEHICLE_COUNT; i++) {
  const brand = pick(Object.keys(BRAND_MODELS));
  const [model, trim] = pick(BRAND_MODELS[brand]);
  const city = pick(CITIES);
  const year = randInt(2008, 2025);
  const regDate = isoDateBetween(year, Math.min(year + 1, 2025));
  const mileage = Math.max(0, Math.round(((2026 - year) * randInt(8000, 22000)) / 100) * 100);

  const vehicle = {
    id: uuid("veh", i),
    vin: generateVin(i),
    plate: generatePlate(city.regionCode),
    brand,
    model,
    trim,
    year,
    color: pick(COLORS),
    engine: pick(ENGINES),
    transmission: pick(TRANSMISSIONS),
    fuelType: brand === "BYD" ? pickWeighted([["Электро", 7], ["Гибрид", 3]]) : pick(FUEL_TYPES),
    mileageKm: mileage,
    ownerCount: randInt(1, 4),
    registrationDate: regDate,
    registrationCity: city.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  vehicle.history = generateVehicleHistory(vehicle);
  vehicles.push(vehicle);

  // 0-4 accidents, weighted so most cars have 0-1
  const accidentCount = pickWeighted([
    [0, 42],
    [1, 30],
    [2, 16],
    [3, 8],
    [4, 4],
  ]);

  for (let a = 0; a < accidentCount; a++) {
    const accCity = pick(CITIES);
    const severity = pickWeighted([
      ["Лёгкая", 50],
      ["Средняя", 34],
      ["Тяжёлая", 16],
    ]);
    const partCount = severity === "Лёгкая" ? randInt(1, 2) : severity === "Средняя" ? randInt(1, 3) : randInt(2, 4);
    const shuffled = [...DAMAGE_PART_POOL].sort(() => rand() - 0.5);
    const damagedParts = shuffled.slice(0, partCount);

    const baseEstimate =
      severity === "Лёгкая" ? randInt(800_000, 3_500_000) : severity === "Средняя" ? randInt(3_500_000, 12_000_000) : randInt(12_000_000, 45_000_000);

    const accDate = isoDateBetween(Math.max(year, 2015), 2026);

    const accident = {
      id: uuid("acc", accidents.length + 1),
      vehicleId: vehicle.id,
      date: accDate,
      time: `${String(randInt(6, 23)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}`,
      city: accCity.name,
      address: `${accCity.name}, ул. ${pick(["Амира Темура", "Мустакиллик", "Бунёдкор", "Нукус", "Фаргона йули", "Чиланзар", "Юнусабад", "Себзор"])}, ${randInt(1, 180)}`,
      latitude: Number(jitter(accCity.lat, 0.09).toFixed(6)),
      longitude: Number(jitter(accCity.lng, 0.09).toFixed(6)),
      severity,
      weather: pick(WEATHER),
      description: pick(DESCRIPTIONS_BY_SEVERITY[severity]),
      damagedParts,
      repairEstimateUzs: baseEstimate,
      insuranceCompany: pick(INSURERS),
      status: pick(STATUSES),
      photos: damagedParts.slice(0, 3).map((part, idx) => ({
        id: `${uuid("photo", accidents.length + 1)}_${idx}`,
        url: `/damage-photos/${PART_TO_PHOTO[part]}`,
        caption: `${PART_LABELS[part]} — зафиксированные повреждения`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    accidents.push(accident);
  }
}

// ----- write output ----------------------------------------------------------

const dataDir = path.join(__dirname, "..", "lib", "data");
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, "vehicles.json"), JSON.stringify(vehicles, null, 2));
fs.writeFileSync(path.join(dataDir, "accidents.json"), JSON.stringify(accidents, null, 2));
fs.writeFileSync(
  path.join(dataDir, "meta.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      vehicleCount: vehicles.length,
      accidentCount: accidents.length,
      cities: CITIES.map((c) => c.name),
    },
    null,
    2
  )
);

console.log(`Сгенерировано: ${vehicles.length} автомобилей, ${accidents.length} ДТП.`);
console.log(`Файлы сохранены в ${dataDir}`);
