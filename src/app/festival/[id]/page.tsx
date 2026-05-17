"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetBooths } from "@/app/api/booths";
import { useGetFestival } from "@/app/api/festivals";
import { useGetLineup } from "@/app/api/lineup";
import { useGetMapPins } from "@/app/api/mapPins";
import { useGetNotices } from "@/app/api/notices";
import {
  isPresetId,
  getTemplate,
  MAP_W,
  MAP_H,
} from "@/app/components/MapTemplates";
import type {
  FestivalResponse,
  FestivalStatus,
  LineupResponse,
  BoothResponse,
  NoticeResponse,
  MapPinResponse,
  MapPinType,
} from "@/app/api/festivals.type";

// ── 상수 ─────────────────────────────────────────────────
const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> = {
  LIVE: { cls: "live", en: "LIVE" },
  UPCOMING: { cls: "upcoming", en: "UPCOMING" },
  ENDED: { cls: "ended", en: "ENDED" },
};

function dateRange(start: string, end: string): string[] {
  const days: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    days.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(s)} – ${fmt(e)}`;
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16 }}
    >
      <path d="m15 5-7 7 7 7" />
    </svg>
  );
}

// ── Tab: Lineup ──────────────────────────────────────────
function LineupTab({
  fest,
  items,
}: {
  fest: FestivalResponse;
  items: LineupResponse[];
}) {
  const days = useMemo(
    () => dateRange(fest.start, fest.end),
    [fest.start, fest.end],
  );
  const [day, setDay] = useState(days[0] ?? "");

  // 해당 날짜 아이템을 시간순으로 정렬
  const todayItems = items
    .filter((item) => item.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));

  // 스테이지 목록은 전체 아이템 기준 (순서 유지)
  const stages = [...new Set(items.map((i) => i.stage))];

  return (
    <div>
      <div className="f-day-row">
        {days.map((d, i) => (
          <button
            key={d}
            className="f-chip"
            data-active={day === d ? "true" : "false"}
            onClick={() => setDay(d)}
          >
            {d.slice(5).replace("-", "/")}{" "}
            <span style={{ opacity: 0.6, marginLeft: 4 }}>· DAY {i + 1}</span>
          </button>
        ))}
      </div>

      {todayItems.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          이 날짜에 등록된 라인업이 없습니다.
        </div>
      ) : (
        <div className="f-lineup-grid">
          {stages.map((stage) => {
            const sets = todayItems.filter((s) => s.stage === stage);
            if (sets.length === 0) return null;
            return (
              <div key={stage} className="f-stage-col">
                <h3>{stage} 스테이지</h3>
                <div>
                  {sets.map((s) => (
                    <div key={s.id} className="f-set-row">
                      <div className="time">{s.time}</div>
                      <div className="artist">
                        <div className="avatar">
                          {(s.sub || s.artist).slice(0, 2)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="artist-name">{s.artist}</div>
                          <div className="artist-sub">
                            {s.sub} · {s.tag}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 부스가 특정 날짜에 운영하는지 확인 (days[] 비어있으면 전체 기간) */
function boothRunsOnDay(booth: BoothResponse, day: string | null): boolean {
  if (!day) return true;
  return booth.days.length === 0 || booth.days.includes(day);
}

// ── Tab: Map ─────────────────────────────────────────────
function MapTab({
  fest,
  pins,
  booths,
}: {
  fest: FestivalResponse;
  pins: MapPinResponse[];
  booths: BoothResponse[];
}) {
  const days = useMemo(
    () => dateRange(fest.start, fest.end),
    [fest.start, fest.end],
  );
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const pinColor: Record<MapPinType, string> = {
    stage: "var(--accent)",
    booth: "var(--upcoming)",
    toilet: "#5A6FCF",
    smoking: "#888",
    info: "var(--fg)",
  };

  const pinLabel = (type: MapPinType) => {
    if (type === "stage") return "♪";
    if (type === "booth") return "B";
    if (type === "toilet") return "W";
    if (type === "smoking") return "S";
    return "i";
  };

  /** 핀에 연결된 부스 중 선택된 날짜에 운영하는 것 */
  const getActiveBooothsForPin = (pin: MapPinResponse) => {
    if (!pin.boothIds?.length) return [];
    return booths.filter(
      (b) => pin.boothIds!.includes(b.id) && boothRunsOnDay(b, filterDay),
    );
  };

  return (
    <div>
      {/* DAY 필터 */}
      <div className="f-day-row">
        <button
          className="f-chip"
          data-active={filterDay === null ? "true" : "false"}
          onClick={() => setFilterDay(null)}
        >
          전체
        </button>
        {days.map((d, i) => {
          const date = new Date(d);
          const dow = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
          return (
            <button
              key={d}
              className="f-chip"
              data-active={filterDay === d ? "true" : "false"}
              onClick={() => setFilterDay(d)}
            >
              DAY {i + 1}
              <span style={{ opacity: 0.6, marginLeft: 4 }}>
                {date.getMonth() + 1}/{date.getDate()} {dow}
              </span>
            </button>
          );
        })}
      </div>

      <div className="f-map-wrap">
        <div className="f-map-canvas">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 배경: 선택된 템플릿 또는 커스텀 이미지 */}
            {fest.mapImage && !isPresetId(fest.mapImage) ? (
              <image
                href={fest.mapImage}
                x="0"
                y="0"
                width={MAP_W}
                height={MAP_H}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              getTemplate(fest.mapImage || "basic").render(MAP_W, MAP_H)
            )}

            {pins
              .filter((p) => p.type === "stage")
              .map((p) => (
                <rect
                  key={`stage-bg-${p.id}`}
                  x={p.x - 28}
                  y={p.y - 14}
                  width="56"
                  height="28"
                  rx="4"
                  fill="var(--accent)"
                  fillOpacity="0.18"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
              ))}

            {pins.map((p) => {
              const activeBooths = getActiveBooothsForPin(p);
              const displayLabel =
                activeBooths.length > 0
                  ? activeBooths.length === 1
                    ? activeBooths[0].name
                    : `${activeBooths[0].name} 외 ${activeBooths.length - 1}`
                  : p.label;
              // 이 날짜에 부스가 없는 booth 핀은 흐리게
              const isInactive =
                p.type === "booth" &&
                (p.boothIds?.length ?? 0) > 0 &&
                activeBooths.length === 0;
              return (
                <g
                  key={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer", opacity: isInactive ? 0.3 : 1 }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="11"
                    fill={pinColor[p.type]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x}
                    y={p.y + 3.5}
                    fontSize="9"
                    textAnchor="middle"
                    fill="#fff"
                    fontWeight="700"
                    fontFamily="var(--mono-font)"
                  >
                    {pinLabel(p.type)}
                  </text>
                  {hovered === p.id && !isInactive && (
                    <g>
                      <rect
                        x={p.x + 14}
                        y={p.y - 14}
                        width={displayLabel.length * 7 + 12}
                        height="22"
                        rx="4"
                        fill="var(--fg)"
                      />
                      <text
                        x={p.x + 20}
                        y={p.y + 1}
                        fontSize="11"
                        fill="var(--bg)"
                        fontWeight="600"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div>
          <h4
            style={{
              font: "500 11px/1 var(--mono-font)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              margin: "0 0 12px",
            }}
          >
            장소 정보
          </h4>
          {pins.length === 0 ? (
            <div
              style={{
                color: "var(--muted)",
                fontFamily: "var(--mono-font)",
                fontSize: 12,
              }}
            >
              등록된 핀이 없습니다.
            </div>
          ) : (
            <div className="f-legend-list">
              {pins.map((p) => {
                const activeBooths = getActiveBooothsForPin(p);
                const isInactive =
                  p.type === "booth" &&
                  (p.boothIds?.length ?? 0) > 0 &&
                  activeBooths.length === 0;
                return (
                  <div
                    key={p.id}
                    className="f-legend-row"
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ opacity: isInactive ? 0.35 : 1 }}
                  >
                    <div
                      className="pin"
                      style={{ background: pinColor[p.type] }}
                    >
                      {pinLabel(p.type)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {activeBooths.length > 0 ? (
                        activeBooths.map((b) => (
                          <div key={b.id} style={{ marginBottom: 4 }}>
                            <div
                              style={{ font: "600 14px/1.2 var(--body-font)" }}
                            >
                              {b.name}
                            </div>
                            <div
                              style={{
                                font: "500 11px/1.5 var(--mono-font)",
                                color: "var(--muted)",
                                marginTop: 2,
                              }}
                            >
                              {b.dept} · {b.loc}
                              {b.schedule ? ` · ${b.schedule}` : ""}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div
                            style={{ font: "600 14px/1.2 var(--body-font)" }}
                          >
                            {p.label}
                          </div>
                          <div
                            style={{
                              font: "500 11px/1 var(--mono-font)",
                              color: "var(--muted)",
                              marginTop: 3,
                            }}
                          >
                            {isInactive
                              ? "이 날짜 미운영"
                              : p.type.toUpperCase()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Booth ───────────────────────────────────────────
function BoothTab({ booths }: { booths: BoothResponse[] }) {
  const [tag, setTag] = useState("ALL");
  const tags = ["ALL", ...Array.from(new Set(booths.map((b) => b.tag)))];
  const filtered = tag === "ALL" ? booths : booths.filter((b) => b.tag === tag);

  return (
    <div>
      <div className="f-day-row">
        {tags.map((t) => (
          <button
            key={t}
            className="f-chip"
            data-active={tag === t ? "true" : "false"}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          등록된 부스가 없습니다.
        </div>
      ) : (
        <div className="f-booth-grid">
          {filtered.map((b) => (
            <div key={b.id} className="f-booth-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <div className="name">{b.name}</div>
                <span
                  className="f-tag"
                  style={{ background: "var(--faint)", color: "var(--fg)" }}
                >
                  {b.tag}
                </span>
              </div>
              <div className="meta">
                <span>{b.loc}</span>
                <span>·</span>
                <span>{b.dept}</span>
              </div>
              <div className="meta" style={{ color: "var(--fg)" }}>
                {b.schedule}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Notice ──────────────────────────────────────────
function NoticeTab({ notices }: { notices: NoticeResponse[] }) {
  if (notices.length === 0) {
    return (
      <div
        style={{
          padding: "40px 0",
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        등록된 공지가 없습니다.
      </div>
    );
  }

  return (
    <div className="f-notice-list">
      {notices.map((n) => (
        <div key={n.id} className="f-notice-row">
          {n.pinned ? (
            <span className="pinned">긴급</span>
          ) : (
            <span style={{ width: 8 }} />
          )}
          <div>
            <div className="notice-title">{n.title}</div>
            <div className="notice-preview">{n.content}</div>
          </div>
          <div className="time">
            {new Date(n.updatedAt).toLocaleDateString("ko-KR")}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Community ───────────────────────────────────────
type CommunityPost = {
  id: string;
  author: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
};

function CommunityTab() {
  const [list, setList] = useState<CommunityPost[]>([]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setList((prev) => [
      {
        id: `p-${Date.now()}`,
        author: "나",
        time: "방금",
        body: text,
        likes: 0,
        replies: 0,
      },
      ...prev,
    ]);
    setText("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input
          className="f-input"
          placeholder="실시간으로 정보를 공유해보세요 · 익명"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="f-btn accent" onClick={send}>
          올리기
        </button>
      </div>
      {list.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          첫 번째 글을 작성해보세요!
        </div>
      ) : (
        <div className="f-comm-list">
          {list.map((c) => (
            <div key={c.id} className="f-comm-row">
              <div className="head">
                <b>{c.author}</b>
                <span>·</span>
                <span>{c.time}</span>
              </div>
              <div className="text">{c.body}</div>
              <div className="foot">
                <span>♡ {c.likes}</span>
                <span>💬 {c.replies}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
type Tab = "lineup" | "map" | "booth" | "notice" | "community";

const TABS: { value: Tab; label: string }[] = [
  { value: "lineup", label: "라인업" },
  { value: "map", label: "지도" },
  { value: "booth", label: "부스" },
  { value: "notice", label: "공지" },
  { value: "community", label: "톡" },
];

export default function FestivalDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: fest, isLoading } = useGetFestival(id);
  const { data: lineupItems = [] } = useGetLineup(id);
  const { data: booths = [] } = useGetBooths(id);
  const { data: notices = [] } = useGetNotices(id);
  const { data: mapPins = [] } = useGetMapPins(id);

  const [tab, setTab] = useState<Tab>("lineup");

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

  const [c0, c1, c2] = fest.colors;
  const meta = STATUS_META[fest.status];

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

      {/* ── 히어로 ── */}
      <div
        className="f-detail-hero"
        style={{
          background: `radial-gradient(120% 80% at 80% 0%, ${c0} 0%, ${c1} 35%, ${c2} 100%)`,
        }}
      >
        {fest.thumbnail && (
          <img
            src={fest.thumbnail}
            alt={fest.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.04) 10px 11px)",
          }}
        />
        <div className="grad" />
        <div className="detail-submeta">
          <span className={`f-tag ${meta.cls}`}>{meta.en}</span>
          <span>{fest.school}</span>
          <span>{fmtRange(fest.start, fest.end)}</span>
          {fest.status === "LIVE" && (
            <span>참여자 {fest.participants.toLocaleString()}명</span>
          )}
        </div>
        <div className="detail-name">{fest.name}</div>
        {fest.nameEn && (
          <div
            style={{
              position: "relative",
              fontFamily: "var(--display-font)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginTop: 6,
            }}
          >
            {fest.nameEn}
          </div>
        )}
        {fest.tagline && (
          <div
            style={{
              position: "relative",
              color: "rgba(255,255,255,0.75)",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {fest.tagline}
          </div>
        )}
      </div>

      {/* ── 탭 ── */}
      <div className="f-tabs">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            data-active={tab === value ? "true" : "false"}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="f-btn accent sm" style={{ alignSelf: "center" }}>
          + 참여 등록
        </button>
      </div>

      {tab === "lineup" && <LineupTab fest={fest} items={lineupItems} />}
      {tab === "map" && <MapTab fest={fest} pins={mapPins} booths={booths} />}
      {tab === "booth" && <BoothTab booths={booths} />}
      {tab === "notice" && <NoticeTab notices={notices} />}
      {tab === "community" && <CommunityTab />}
    </div>
  );
}
