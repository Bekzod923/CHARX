# Charx

Проверка истории ДТП и повреждений автомобилей в Узбекистане — демонстрационный MVP.

> **Это прототип.** База данных полностью сгенерирована локально (`scripts/generate-db.js`).
> Приложение не обращается ни к каким внешним API и ни к каким государственным базам данных.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

База данных (`lib/data/vehicles.json`, `lib/data/accidents.json`) уже сгенерирована и закоммичена,
но её можно пересоздать в любой момент:

```bash
npm run generate:db
```

### Панель администратора

Откройте `/admin`. Пароль по умолчанию — `charx2026` (см. `.env.local.example`).
Скопируйте файл в `.env.local` и при необходимости измените `ADMIN_PASSWORD`.

## Архитектура

Проект построен слоями, чтобы источник данных можно было заменить, не трогая UI:

```
UI (app/, components/)
   ↓
Services (lib/services)      — бизнес-логика: поиск, оценка, формирование отчёта
   ↓
Repositories (lib/repositories) — доменные обёртки над провайдером данных
   ↓
DatabaseProvider (lib/db/provider.ts) — интерфейс
   ↓
FakeDatabaseProvider (lib/db/fake-provider.ts) — сегодня: локальный JSON
```

Единственное место, где создаётся провайдер данных — [`lib/di/container.ts`](lib/di/container.ts).
Чтобы подключить настоящую базу данных (PostgreSQL, REST, GraphQL, государственный API,
микросервис), нужно:

1. Написать новый класс, реализующий интерфейс `DatabaseProvider`.
2. Заменить одну строку в `lib/di/container.ts`:
   ```ts
   const provider: DatabaseProvider = new FakeDatabaseProvider();
   // → const provider: DatabaseProvider = new PostgresDatabaseProvider(pool);
   ```

Ни один компонент, API-роут или сервис менять не нужно.

## Структура проекта

```
app/                    Next.js App Router: страницы и API-роуты
  api/                  REST API (поиск, статистика, admin CRUD)
  report/[query]/       Страница отчёта об автомобиле
  admin/                Панель администратора (защищена middleware.ts)
components/
  landing/              Секции главной страницы
  report/                Карточка авто, диаграмма повреждений, карта, шкала оценки
  search/                Поисковая строка, экран загрузки, пустые состояния
  admin/                 Таблицы и формы CRUD
  shared/                Navbar, Footer, тема
  ui/                     Базовые UI-примитивы (кнопки, карточки, диалоги…)
lib/
  types/                  Общие TypeScript-типы (домен)
  db/                     DatabaseProvider (интерфейс) + FakeDatabaseProvider
  repositories/           Доменные обёртки над провайдером
  services/               Бизнес-логика (Vehicle/Accident/Score/Report/Stats)
  di/                     Композиционный корень (container.ts)
  hooks/                  Клиентские React-хуки
  utils/                  Форматирование, валидация (zod), вспомогательные функции
scripts/
  generate-db.js          Генератор фейковой базы (200 авто, ~200+ ДТП)
  generate-damage-photos.js  Генератор SVG-заглушек фотографий повреждений
```

## Технологии

Next.js 15 (App Router) · React 18 · TypeScript (strict) · Tailwind CSS · Framer Motion ·
Leaflet / React-Leaflet · Recharts · Lucide React · Zod · Sonner (toasts) · qrcode.react

## Оценка надёжности автомобиля

Логика расчёта — в [`lib/services/score-service.ts`](lib/services/score-service.ts):

- Нет ДТП → 100 баллов
- Лёгкое ДТП → −15 баллов
- Среднее ДТП → −40 баллов
- Тяжёлое ДТП → −65 баллов (штрафы суммируются, минимум — 15 баллов)

## Известные ограничения демо-версии

- «Экспорт в PDF» — имитация (показывает уведомление); реальная генерация PDF не входит в MVP.
- Административная сессия — простая cookie-сессия, подходящая для демонстрации, но не для продакшена.
- Все фотографии повреждений — сгенерированные SVG-заглушки, не реальные фотографии.
