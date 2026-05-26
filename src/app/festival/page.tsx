"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import FestivalCard from "@/app/components/FestivalCard";
import Skeleton from "@/app/components/Skeleton";
import { useGetFestivals } from "../api/festivals";

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "LIVE", label: "진행중" },
  { value: "UPCOMING", label: "예정" },
  { value: "ENDED", label: "종료" },
] as const;

function FestivalListPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState(searchParams.get("title") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") ?? "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") ?? "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (status !== "all") params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString();
    router.replace(`/festival${query ? "?" + query : ""}`, { scroll: false });
  }, [title, status, startDate, endDate]);

  const { data: festivalList, isLoading } = useGetFestivals({
    page: 1,
    size: 999,
  });

  // 주소 검색(동/로/구 등)을 위한 좌표 변환 (600ms 디바운스)
  const [geoCoords, setGeoCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!title.trim()) {
      setGeoCoords(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/geocode?query=${encodeURIComponent(title)}`,
        );
        const json = await res.json();
        if (json.lat && json.lng)
          setGeoCoords({ lat: json.lat, lng: json.lng });
        else setGeoCoords(null);
      } catch {
        setGeoCoords(null);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [title]);

  const dateError =
    startDate && endDate && startDate > endDate
      ? "시작일이 종료일보다 늦을 수 없어요"
      : "";

  const filteredData = useMemo(() => {
    const targetList = [...(festivalList || [])];

    return targetList.filter((v) => {
      if (title) {
        // 텍스트 매칭: 축제명·영문명·학교명·주소 모두 확인
        const textMatch =
          v.title.includes(title) ||
          (v.name ?? "").includes(title) ||
          (v.nameEn ?? "").toLowerCase().includes(title.toLowerCase()) ||
          v.school.includes(title) ||
          (v.address ?? "").includes(title);

        // 좌표 매칭: geocode 결과 기준 반경 ~5km (위도 ±0.045°, 경도 ±0.057°)
        const geoMatch =
          geoCoords &&
          v.lat != null &&
          v.lng != null &&
          Math.abs(v.lat - geoCoords.lat) < 0.045 &&
          Math.abs(v.lng - geoCoords.lng) < 0.057;

        if (!textMatch && !geoMatch) return false;
      }
      if (status !== "all" && v.status !== status) {
        return false;
      }

      const vStart = v.start;
      const vEnd = v.end;

      if (!dateError && startDate && vStart < startDate) {
        return false;
      }
      if (!dateError && endDate && vEnd > endDate) {
        return false;
      }

      return true;
    });
  }, [festivalList, title, status, startDate, endDate, dateError, geoCoords]);

  const reset = () => {
    setTitle("");
    setStatus("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <div className="f-tagline">축제 검색</div>
      <h1 className="f-h" style={{ marginBottom: 24 }}>
        어디로 갈까요?
      </h1>

      <div className="f-search-layout">
        {/* ── 사이드 필터 ── */}
        <aside className="f-filter-side">
          <div>
            <h4>상태</h4>
            <div className="chip-row">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  className="f-chip"
                  data-active={status === value ? "true" : "false"}
                  onClick={() => setStatus(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4>기간</h4>
            <input
              type="date"
              className="f-date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="시작일"
            />
            <input
              type="date"
              className="f-date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="종료일"
            />
            {dateError && (
              <p style={{ color: "var(--live)", fontSize: 12, marginTop: 6 }}>
                {dateError}
              </p>
            )}
          </div>
          <button
            className="f-btn ghost sm"
            style={{ width: "100%" }}
            onClick={reset}
          >
            필터 초기화
          </button>
        </aside>

        {/* ── 검색 + 카드 그리드 ── */}
        <div>
          <div
            className="f-search-bar"
            style={{ marginBottom: 24, height: 52, cursor: "default" }}
          >
            <SearchIcon />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="지역 · 학교 · 축제명 검색"
              style={{ cursor: "text" }}
            />
          </div>

          <div
            style={{ marginBottom: 12, fontSize: 13, color: "var(--muted)" }}
          >
            총 {filteredData.length}개의 축제
          </div>

          <div className="f-grid">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 20,
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Skeleton radius={0} className="aspect-video w-full" />
                    <div
                      style={{
                        padding: 18,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <Skeleton radius={6} className="h-6 w-3/4" />
                      <Skeleton radius={6} className="h-4 w-1/2" />
                    </div>
                  </div>
                ))
              : filteredData.map((v) => <FestivalCard key={v.id} data={v} />)}
            {!isLoading && filteredData.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 48,
                  textAlign: "center",
                  color: "var(--muted)",
                  font: "500 14px/1.6 var(--body-font)",
                }}
              >
                검색 조건에 맞는 축제가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function FestivalListPage() {
  return (
    <Suspense>
      <FestivalListPageInner />
    </Suspense>
  );
}
