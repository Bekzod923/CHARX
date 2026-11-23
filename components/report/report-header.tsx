"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Printer, Share2, FileDown, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/format";
import { useTranslation } from "@/lib/hooks/use-translation";

export function ReportHeader({ reportNumber, generatedAt }: { reportNumber: string; generatedAt: string }) {
  const { dict, locale } = useTranslation();
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: dict.reportHeader.shareTitle, url: shareUrl });
        return;
      } catch {
        // user cancelled — fall through to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(dict.reportHeader.linkCopied);
    } catch {
      toast.error(dict.reportHeader.linkCopyFailed);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handlePdfExport() {
    toast.info(dict.reportHeader.pdfComingTitle, {
      description: dict.reportHeader.pdfComingDescription,
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-card dark:border-ink-700 dark:bg-ink-800 sm:flex-row sm:items-center sm:justify-between print:shadow-none">
      <div className="flex items-center gap-4">
        <div className="rounded-xl border border-ink-100 bg-white p-1.5 dark:border-ink-700">
          <QRCodeSVG value={shareUrl || reportNumber} size={64} fgColor="#0F172A" bgColor="#ffffff" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-success-600">
            <BadgeCheck className="h-3.5 w-3.5" /> {dict.reportHeader.verified}
          </div>
          <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-ink-800 dark:text-white">
            {dict.reportHeader.reportNumber} {reportNumber}
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-500">
            {dict.reportHeader.generatedAt} {formatDateTime(generatedAt, locale)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4" /> {dict.reportHeader.share}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> {dict.reportHeader.print}
        </Button>
        <Button variant="accent" size="sm" onClick={handlePdfExport}>
          <FileDown className="h-4 w-4" /> {dict.reportHeader.downloadPdf}
        </Button>
      </div>
    </div>
  );
}
