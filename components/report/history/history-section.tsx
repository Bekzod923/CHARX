"use client";

import { useTranslation } from "@/lib/hooks/use-translation";
import { VehicleHistoryExtras } from "@/lib/types";
import { OwnershipCard, RegistrationCard } from "./timeline-cards";
import { TaxiCard, LoanCard, ImportCard, AuctionCard, RestrictionsCard } from "./status-cards";

export function HistorySection({ history }: { history: VehicleHistoryExtras }) {
  const { dict } = useTranslation();

  return (
    <section>
      <div className="mb-5">
        <h2 className="font-display text-xl font-semibold text-ink-800 dark:text-white">
          {dict.history.sectionTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{dict.history.sectionSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OwnershipCard history={history.ownership} />
        <TaxiCard history={history.taxiHistory} />
        <LoanCard loanStatus={history.loanStatus} />
        <ImportCard history={history.importHistory} />
        <AuctionCard history={history.auctionHistory} />
        <RestrictionsCard history={history.restrictions} />
        <RegistrationCard history={history.registrationHistory} />
      </div>
    </section>
  );
}
