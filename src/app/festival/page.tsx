"use client";

import { useMemo, useState, useEffect } from "react";
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

const VALID_STATUSES = ["LIVE", "UPCOMING", "ENDED"] as const;

export default function FestivalListPage() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // URL ?status=LIVE 등으로 초기 필터 설정
  useEffect(() => {
    const s = searchParams.get("status");
    if (s && (VALID_STATUSES as readonly string[]).includes(s)) {
      setStatus(s);
    }
  }, [searchParams]);

  const { data: festivalList } = useGetFestivals({ page: 1, size: 999 });

  const filteredData = useMemo(() => {
    const targetList = [...(festivalList || [])];

    return targetList.filter((v) => {
      if (title && !v.title.includes(title)) {
        return false;
      }
      if (status !== "all" && v.status !== status) {
        return false;
      }

      // 연월일만 비교하기 위해 YYYY-MM-DD 형식의 문자열로 변환
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

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
