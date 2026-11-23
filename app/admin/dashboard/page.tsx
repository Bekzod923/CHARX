import { Car, TriangleAlert, FileCheck, MapPinned } from "lucide-react";
import { container } from "@/lib/di/container";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { formatNumber } from "@/lib/utils/format";

export default async function AdminOverviewPage() {
  const [stats, vehicles, accidents] = await Promise.all([
    container.statsService.getStats(),
    container.vehicleService.listForAdmin(),
    container.accidentService.listAll(),
  ]);

  const severityCounts = new Map<string, number>();
  for (const acc of accidents) severityCounts.set(acc.severity, (severityCounts.get(acc.severity) ?? 0) + 1);
  const severityData = ["Лёгкая", "Средняя", "Тяжёлая"].map((name) => ({
    name,
    value: severityCounts.get(name) ?? 0,
  }));

  const cityCounts = new Map<string, number>();
  const allVehicles = await container.vehicleRepository.findAll();
  for (const v of allVehicles) cityCounts.set(v.registrationCity, (cityCounts.get(v.registrationCity) ?? 0) + 1);
  const cityData = Array.from(cityCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const cards = [
    { label: "Автомобилей в базе", value: stats.vehiclesChecked, icon: Car, accent: "bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-300" },
    { label: "ДТП зафиксировано", value: stats.accidentsFound, icon: TriangleAlert, accent: "bg-warning-100 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
    { label: "Подтверждённых отчётов", value: stats.verifiedReports, icon: FileCheck, accent: "bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
    { label: "Городов охвачено", value: stats.citiesCovered, icon: MapPinned, accent: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-300" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-white">Обзор</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Общая статистика платформы Charx</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.accent}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-tabular font-display text-2xl font-bold text-ink-800 dark:text-white">
                  {formatNumber(c.value)}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts severityData={severityData} cityData={cityData} />

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm text-ink-500 dark:text-ink-400">
          <p>Всего записей об автомобилях: {formatNumber(vehicles.length)}</p>
          <p>Всего записей о ДТП: {formatNumber(accidents.length)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
