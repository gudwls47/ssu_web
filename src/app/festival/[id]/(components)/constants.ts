import type { FestivalStatus } from "@/app/api/festivals.type";

export const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> =
  {
    LIVE: { cls: "live", en: "LIVE" },
    UPCOMING: { cls: "upcoming", en: "UPCOMING" },
    ENDED: { cls: "ended", en: "ENDED" },
  };

export type TabType = "lineup" | "map" | "booth" | "notice" | "community";

export const TABS: { value: TabType; label: string }[] = [
  { value: "lineup", label: "라인업" },
  { value: "map", label: "지도" },
  { value: "booth", label: "부스" },
  { value: "notice", label: "공지" },
  { value: "community", label: "톡" },
];
