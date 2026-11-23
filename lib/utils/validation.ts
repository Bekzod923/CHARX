import { z } from "zod";

// ============================================================================
// Shared validation schemas — used by both admin API routes (server-side
// guard) and admin forms (client-side feedback), so the rules never drift.
// ============================================================================

export const searchQuerySchema = z
  .string()
  .trim()
  .min(4, "Введите не менее 4 символов")
  .max(32, "Слишком длинный запрос");

export const vehicleSchema = z.object({
  vin: z.string().trim().length(17, "VIN должен содержать 17 символов"),
  plate: z.string().trim().min(6, "Укажите государственный номер"),
  brand: z.string().trim().min(1, "Укажите марку"),
  model: z.string().trim().min(1, "Укажите модель"),
  trim: z.string().trim().min(1, "Укажите комплектацию"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().trim().min(1, "Укажите цвет"),
  engine: z.string().trim().min(1, "Укажите двигатель"),
  transmission: z.enum(["Механическая", "Автоматическая", "Вариатор", "Робот"]),
  fuelType: z.enum(["Бензин", "Дизель", "Электро", "Гибрид", "Газ/Бензин"]),
  mileageKm: z.number().int().min(0),
  ownerCount: z.number().int().min(1).max(15),
  registrationDate: z.string().min(1),
  registrationCity: z.string().trim().min(1),
});

export const accidentSchema = z.object({
  vehicleId: z.string().trim().min(1, "Укажите автомобиль"),
  date: z.string().min(1, "Укажите дату"),
  time: z.string().min(1, "Укажите время"),
  city: z.string().trim().min(1),
  address: z.string().trim().min(1),
  latitude: z.number(),
  longitude: z.number(),
  severity: z.enum(["Лёгкая", "Средняя", "Тяжёлая"]),
  weather: z.string().trim().min(1),
  description: z.string().trim().min(1),
  damagedParts: z.array(z.string()).min(1, "Укажите хотя бы одну повреждённую деталь"),
  repairEstimateUzs: z.number().min(0),
  insuranceCompany: z.string().trim().min(1),
  status: z.enum(["Урегулировано", "В процессе", "Отклонено"]),
  photos: z
    .array(z.object({ id: z.string(), url: z.string(), caption: z.string() }))
    .default([]),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Введите пароль"),
});
