import { Hero } from "@/components/landing/hero";
import { StatsSection } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { LockedFeatures } from "@/components/report/locked-features";
import { container } from "@/lib/di/container";

export default async function HomePage() {
  const stats = await container.statsService.getStats();

  return (
    <>
      <Hero />
      <HowItWorks />
      <StatsSection stats={stats} />
      <Features />
      <LockedFeatures id="locked" />
    </>
  );
}
