"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import FestivalCard from "@/app/components/FestivalCard";
import { useGetFestivals } from "../api/festivals";

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "LIVE", label: "진행중" },
  { value: "UPCOMING", label: "예정" },
  { value: "ENDED", label: "종료" },
] as const;

function FestivalListPageInner() {
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") ?? "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") ?? "");

  const { data: festivalList } = useGetFestivals({ page: 1, size: 999 });

  const filteredData = useMemo(() => {
    const targetList = [...(festivalList || [])];

    return targetList.filter((v) => {
      if (
        title &&
        !v.title.includes(title) &&
        !(v.address ?? "").includes(title)
      ) {
        return false;
      }
      if (status !== "all" && v.status !== status) {
        return false;
      }

      const vStart = v.start;
      const vEnd = v.end;

      if (startDate && vStart < startDate) {
        return false;
      }
      if (endDate && vEnd > endDate) {
        return false;
      }

      return true;
    });
  }, [festivalList, title, status, startDate, endDate]);

  const reset = () => {
    setTitle("");
    setStatus("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <div className="f-tagline">Search · 축제 검색</div>
      <h1 className="f-h" style={{ marginBottom: 24 }}>
        어디로 갈까요?
      </h1>

      <div className="f-search-layout">
        {/* ── 사이드 필터 ── */}
        <aside className="f-filter-side">
          <div>
            <h4>STATUS</h4>
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
            <h4>PERIOD</h4>
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
              placeholder="축제명 · 아티스트 · 학술제 검색"
              style={{ cursor: "text" }}
            />
          </div>

          <div className="f-grid">
            {filteredData.map((v) => (
              <FestivalCard key={v.id} data={v} />
            ))}
            {filteredData.length === 0 && (
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
