"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import FestivalCard from "@/app/components/FestivalCard";

type FestivalStatus = "live" | "upcoming" | "ended";

interface Festival {
  id: string;
  name: string;
  en: string;
  school: string;
  start: string;
  end: string;
  status: FestivalStatus;
  participants: number;
  tagline: string;
  colors: [string, string, string];
}

const FESTIVALS: Festival[] = [
  {
    id: "ssu-daedongje-2026",
    name: "2026 숭실 대동제",
    en: "DAEDONGJE",
    school: "숭실대학교",
    start: "2026-05-12",
    end: "2026-05-14",
    status: "live",
    participants: 8420,
    tagline: "숭실의 봄이 깨어나다",
    colors: ["#FF1E7A", "#BDFF1E", "#2A0F4E"],
  },
  {
    id: "ssu-itfest-2026",
    name: "제25회 IT대학 학술제",
    en: "IT FESTA",
    school: "숭실대학교",
    start: "2026-05-20",
    end: "2026-05-22",
    status: "upcoming",
    participants: 3200,
    tagline: "기술과 축제의 만남",
    colors: ["#6B2EE6", "#BDFF1E", "#1B0832"],
  },
  {
    id: "ssu-sportsfest-2026",
    name: "2026 숭실 체육대회",
    en: "SPORTS FEST",
    school: "숭실대학교",
    start: "2026-06-05",
    end: "2026-06-05",
    status: "upcoming",
    participants: 2100,
    tagline: "하나 되는 숭실인",
    colors: ["#FF7A66", "#F2C94C", "#14172B"],
  },
  {
    id: "ssu-artfest-2026",
    name: "숭실 예술문화제",
    en: "ART WAVE",
    school: "숭실대학교",
    start: "2026-06-18",
    end: "2026-06-20",
    status: "upcoming",
    participants: 1800,
    tagline: "예술로 물드는 캠퍼스",
    colors: ["#00CFE6", "#FF00B8", "#0A0A0F"],
  },
  {
    id: "ssu-daedongje-2025",
    name: "2025 숭실 대동제",
    en: "DAEDONGJE 2025",
    school: "숭실대학교",
    start: "2025-09-20",
    end: "2025-09-22",
    status: "ended",
    participants: 7800,
    tagline: "지난 가을의 추억",
    colors: ["#E85D4A", "#FBF6EC", "#14172B"],
  },
  {
    id: "ssu-itfest-2025",
    name: "제24회 IT대학 학술제",
    en: "IT FESTA 2025",
    school: "숭실대학교",
    start: "2025-05-18",
    end: "2025-05-20",
    status: "ended",
    participants: 2900,
    tagline: "코드로 쓰는 축제",
    colors: ["#3D6EE6", "#F2C94C", "#14172B"],
  },
];

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "live", label: "진행중" },
  { value: "upcoming", label: "예정" },
  { value: "ended", label: "종료" },
] as const;

export default function FestivalListPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = FESTIVALS.filter((f) => {
    if (status !== "all" && f.status !== status) return false;
    if (
      q &&
      !`${f.name} ${f.school} ${f.en}`.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    if (startDate && f.end < startDate) return false;
    if (endDate && f.start > endDate) return false;
    return true;
  });

  const reset = () => {
    setQ("");
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="축제명 · 아티스트 · 학술제 검색"
              style={{ cursor: "text" }}
            />
            <kbd>{filtered.length}건</kbd>
          </div>

          <div className="f-grid">
            {filtered.map((f) => (
              <FestivalCard
                key={f.id}
                data={{
                  id: f.id,
                  name: f.name,
                  nameEn: f.en,
                  school: f.school,
                  tagline: f.tagline,
                  description: "",
                  thumbnail: "",
                  colors: f.colors,
                  participants: f.participants,
                  start: f.start,
                  end: f.end,
                  status:
                    f.status.toUpperCase() as import("@/app/api/festivals.type").FestivalStatus,
                  createdAt: f.start,
                  updatedAt: f.start,
                  ownerUid: "",
                }}
              />
            ))}
            {filtered.length === 0 && (
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
