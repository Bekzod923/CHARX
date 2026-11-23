"use client";

import { CarTaxiFront, Landmark, Ship, Gavel, ShieldAlert, ShieldCheck } from "lucide-react";
import { HistoryStatusCard, DetailRow } from "./status-card";
import { useTranslation } from "@/lib/hooks/use-translation";
import { formatDate, formatCurrencyUzs } from "@/lib/utils/format";
import {
  translateAuctionResult,
  translateImportType,
  translateLienStatus,
  translateOriginCountry,
  translateRestrictionStatus,
  translateRestrictionType,
} from "@/lib/i18n/domain-labels";
import { AuctionHistory, ImportHistory, LoanStatus, RestrictionsHistory, TaxiHistory } from "@/lib/types";

export function TaxiCard({ history }: { history: TaxiHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.taxi;

  if (!history.wasUsedAsTaxi) {
    return (
      <HistoryStatusCard
        icon={CarTaxiFront}
        title={t.title}
        tone="success"
        badge={t.notUsedTitle}
        description={t.notUsedDescription}
      />
    );
  }

  return (
    <HistoryStatusCard icon={CarTaxiFront} title={t.title} tone="warning" badge={t.usedTitle} description={t.usedDescription}>
      {history.periods.map((period, idx) => (
        <DetailRow
          key={idx}
          label={`${t.operatorLabel}: ${period.operator}`}
          value={`${formatDate(period.fromDate, locale)} — ${period.toDate ? formatDate(period.toDate, locale) : "—"}`}
        />
      ))}
    </HistoryStatusCard>
  );
}

export function LoanCard({ loanStatus }: { loanStatus: LoanStatus }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.loan;

  const tone = loanStatus.status === "active" ? "danger" : loanStatus.status === "released" ? "warning" : "success";
  const description =
    loanStatus.status === "active" ? t.activeDescription : loanStatus.status === "released" ? t.releasedDescription : t.noneDescription;

  return (
    <HistoryStatusCard
      icon={Landmark}
      title={t.title}
      tone={tone}
      badge={translateLienStatus(loanStatus.status, dict)}
      description={description}
    >
      {loanStatus.status !== "none" && (
        <>
          {loanStatus.lender && <DetailRow label={t.lenderLabel} value={loanStatus.lender} />}
          {loanStatus.amountUzs !== null && (
            <DetailRow label={t.amountLabel} value={formatCurrencyUzs(loanStatus.amountUzs, locale)} />
          )}
          {loanStatus.sinceDate && <DetailRow label={t.sinceLabel} value={formatDate(loanStatus.sinceDate, locale)} />}
          {loanStatus.releasedDate && (
            <DetailRow label={t.releasedLabel} value={formatDate(loanStatus.releasedDate, locale)} />
          )}
        </>
      )}
    </HistoryStatusCard>
  );
}

export function ImportCard({ history }: { history: ImportHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.import;
  const isDomestic = history.declarationNumber === null;

  return (
    <HistoryStatusCard icon={Ship} title={t.title} tone="neutral" badge={translateOriginCountry(history.originCountry, dict)}>
      <DetailRow label={t.typeLabel} value={translateImportType(history.importType, dict)} />
      {isDomestic ? (
        <p className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500 dark:bg-ink-900/40 dark:text-ink-400">
          {t.domesticNote}
        </p>
      ) : (
        <>
          <DetailRow label={t.customsDateLabel} value={formatDate(history.customsDate, locale)} />
          <DetailRow label={t.declarationLabel} value={<span className="font-mono">{history.declarationNumber}</span>} />
        </>
      )}
    </HistoryStatusCard>
  );
}

export function AuctionCard({ history }: { history: AuctionHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.auction;

  if (!history.wasAuctioned) {
    return (
      <HistoryStatusCard icon={Gavel} title={t.title} tone="success" badge={t.noneTitle} description={t.noneDescription} />
    );
  }

  return (
    <HistoryStatusCard icon={Gavel} title={t.title} tone="neutral">
      {history.records.map((record, idx) => (
        <div key={idx} className="space-y-1.5 rounded-lg bg-ink-50 p-3 dark:bg-ink-900/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ink-700 dark:text-ink-200">{record.auctionHouse}</span>
            <span className="text-ink-400 dark:text-ink-500">{formatDate(record.date, locale)}</span>
          </div>
          <DetailRow label={t.startPriceLabel} value={formatCurrencyUzs(record.startPriceUzs, locale)} />
          <DetailRow
            label={t.finalPriceLabel}
            value={record.finalPriceUzs !== null ? formatCurrencyUzs(record.finalPriceUzs, locale) : t.notSoldNote}
          />
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{translateAuctionResult(record.result, dict)}</p>
        </div>
      ))}
    </HistoryStatusCard>
  );
}

export function RestrictionsCard({ history }: { history: RestrictionsHistory }) {
  const { dict, locale } = useTranslation();
  const t = dict.history.restrictions;

  if (history.records.length === 0) {
    return (
      <HistoryStatusCard icon={ShieldCheck} title={t.title} tone="success" badge={t.cleanTitle} description={t.cleanDescription} />
    );
  }

  return (
    <HistoryStatusCard
      icon={ShieldAlert}
      title={t.title}
      tone={history.hasActiveRestrictions ? "danger" : "warning"}
      badge={history.hasActiveRestrictions ? t.activeTitle : t.historicalTitle}
      description={history.hasActiveRestrictions ? t.activeDescription : undefined}
    >
      {history.records.map((record, idx) => (
        <div key={idx} className="space-y-1.5 rounded-lg bg-ink-50 p-3 dark:bg-ink-900/40">
          <DetailRow label={t.typeLabel} value={translateRestrictionType(record.type, dict)} />
          <DetailRow label={t.dateLabel} value={formatDate(record.date, locale)} />
          {record.liftedDate && <DetailRow label={t.liftedLabel} value={formatDate(record.liftedDate, locale)} />}
          <p className="text-xs font-medium text-ink-500 dark:text-ink-400">
            {translateRestrictionStatus(record.status, dict)}
          </p>
        </div>
      ))}
    </HistoryStatusCard>
  );
}
