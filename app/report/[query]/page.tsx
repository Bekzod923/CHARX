import type { Metadata } from "next";
import { ReportView } from "@/components/report/report-view";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getServerDictionary();
  return { title: dict.meta.reportPageTitle };
}

export default async function ReportPage({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  const decoded = decodeURIComponent(query);
  return <ReportView query={decoded} />;
}
