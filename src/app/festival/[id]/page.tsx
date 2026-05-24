"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useGetBooths } from "@/app/api/booths";
import { useGetFestival } from "@/app/api/festivals";
import { useGetLineup } from "@/app/api/lineup";
import { useGetMapPins } from "@/app/api/mapPins";
import { useGetNotices } from "@/app/api/notices";

import {
  BackIcon,
  HeroSection,
  TabNavigation,
  LineupTab,
  MapTab,
  BoothTab,
  NoticeTab,
  CommunityTab,
  type TabType,
} from "./(components)";

function FestivalDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: fest, isLoading } = useGetFestival(id);
  const { data: lineupItems = [] } = useGetLineup(id);
  const { data: booths = [] } = useGetBooths(id);
  const { data: notices = [] } = useGetNotices(id);
  const { data: mapPins = [] } = useGetMapPins(id);

  // URL에서 탭 정보 가져오기 (기본값: lineup)
  const initialTab = (searchParams.get("tab") as TabType) || "lineup";
  const [tab, setTab] = useState<TabType>(initialTab);

  // URL 파라미터와 상태 동기화
  useEffect(() => {
    const currentTab = searchParams.get("tab") as TabType;
    if (currentTab && currentTab !== tab) {
      setTab(currentTab);
    }
  }, [searchParams, tab]);

  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (isLoading || !fest) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <Link
        href="/festival"
        className="f-btn ghost sm"
        style={{
          marginBottom: 14,
          display: "inline-flex",
          textDecoration: "none",
        }}
      >
        <BackIcon />
        <span>뒤로</span>
      </Link>

      <HeroSection fest={fest} />

      <TabNavigation currentTab={tab} onTabChange={handleTabChange} />

      {tab === "lineup" && <LineupTab fest={fest} items={lineupItems} />}
      {tab === "map" && <MapTab fest={fest} pins={mapPins} booths={booths} />}
      {tab === "booth" && <BoothTab booths={booths} />}
      {tab === "notice" && <NoticeTab notices={notices} />}
      {tab === "community" && <CommunityTab festival={fest} />}
    </div>
  );
}

export default function FestivalDetailPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FestivalDetailContent />
    </Suspense>
  );
}
