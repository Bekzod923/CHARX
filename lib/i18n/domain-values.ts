// ============================================================================
// The fake registry generator (scripts/generate-db.js) only ever picks from
// these fixed pools of Russian values for city/color/weather/street. Since
// the stored data itself stays in Russian (it's "government registry data",
// not UI chrome), these types+lists let the i18n layer translate those
// specific known values at render time without touching the database.
//
// If scripts/generate-db.js's pools ever change, update these lists to match.
// ============================================================================

export const KNOWN_CITIES = [
  "Ташкент",
  "Самарканд",
  "Бухара",
  "Андижан",
  "Наманган",
  "Фергана",
  "Навои",
  "Карши",
  "Термез",
  "Нукус",
] as const;
export type KnownCity = (typeof KNOWN_CITIES)[number];

export const KNOWN_COLORS = [
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
] as const;
export type KnownColor = (typeof KNOWN_COLORS)[number];

export const KNOWN_WEATHER = ["Ясно", "Облачно", "Дождь", "Туман", "Гололёд", "Снег"] as const;
export type KnownWeather = (typeof KNOWN_WEATHER)[number];

export const KNOWN_STREETS = [
  "Амира Темура",
  "Мустакиллик",
  "Бунёдкор",
  "Нукус",
  "Фаргона йули",
  "Чиланзар",
  "Юнусабад",
  "Себзор",
] as const;
export type KnownStreet = (typeof KNOWN_STREETS)[number];
