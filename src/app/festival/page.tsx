"use client";

import { useState } from "react";
import Link from "next/link";

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

const STATUS = {
  live: { en: "LIVE", cls: "live", ko: "진행중" },
  upcoming: { en: "UPCOMING", cls: "upcoming", ko: "예정" },
  ended: { en: "ENDED", cls: "ended", ko: "종료" },
};

function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(s)} – ${fmt(e)}`;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

function PosterArt({ fest }: { fest: Festival }) {
  const [c0, c1, c2] = fest.colors;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 80% at 80% 0%, ${c0} 0%, ${c1} 35%, ${c2} 100%)`,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.04) 10px 11px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: 14,
          right: 16,
          fontFamily: "var(--display-font)",
          fontWeight: "var(--display-weight, 700)",
          fontSize: 28,
          lineHeight: 0.9,
          letterSpacing: "-0.03em",
          textShadow: "0 2px 16px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.85,
            marginBottom: 8,
            fontFamily: "var(--mono-font)",
            fontWeight: 500,
          }}
        >
          {fest.school} · {new Date(fest.start).getFullYear()}
        </div>
        {fest.en}
      </div>
    </div>
  );
}

function FestCard({ fest }: { fest: Festival }) {
  const s = STATUS[fest.status];
  return (
    <Link
      href={`/festival/${fest.id}`}
      className="f-card"
      style={{ textDecoration: "none" }}
    >
      <div className="poster">
        <PosterArt fest={fest} />
        <div className="badge">
          <span
            className={`f-tag ${s.cls}${fest.status === "live" ? "pulse" : ""}`}
          >
            {s.en}
          </span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{fest.name}</div>
        <div className="card-meta">
          <span>{fest.school}</span>
          <span style={{ color: "var(--faint)" }}>·</span>
          <span>{fmtRange(fest.start, fest.end)}</span>
        </div>
      </div>
    </Link>
  );
}

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
              <FestCard key={f.id} fest={f} />
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
