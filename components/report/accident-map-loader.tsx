"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const AccidentMapLoader = dynamic(
  () => import("./accident-map").then((mod) => mod.AccidentMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[360px] w-full rounded-2xl" />,
  }
);
