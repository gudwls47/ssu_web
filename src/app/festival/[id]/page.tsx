"use client";

import { useState, use } from "react";
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

const LINEUP = {
  "ssu-daedongje-2026": {
    "2026-05-12": [
      {
        time: "16:30",
        artist: "PLAVE",
        sub: "플레이브",
        stage: "메인",
        tag: "K-POP",
      },
      {
        time: "17:40",
        artist: "SILICA GEL",
        sub: "실리카겔",
        stage: "메인",
        tag: "BAND",
      },
      {
        time: "19:00",
        artist: "윤하",
        sub: "YOUNHA",
        stage: "메인",
        tag: "POP",
      },
      {
        time: "20:20",
        artist: "BIG NAUGHTY",
        sub: "빅나티",
        stage: "메인",
        tag: "HIPHOP",
      },
      {
        time: "21:30",
        artist: "DJ KIRARA",
        sub: "키라라",
        stage: "서브",
        tag: "DJ",
      },
    ],
    "2026-05-13": [
      {
        time: "16:00",
        artist: "잔나비",
        sub: "JANNABI",
        stage: "메인",
        tag: "BAND",
      },
      { time: "17:10", artist: "BIBI", sub: "비비", stage: "메인", tag: "R&B" },
      {
        time: "18:30",
        artist: "TXT",
        sub: "투모로우바이투게더",
        stage: "메인",
        tag: "K-POP",
      },
      {
        time: "20:00",
        artist: "COLDE",
        sub: "콜드",
        stage: "메인",
        tag: "R&B",
      },
      {
        time: "21:20",
        artist: "10CM",
        sub: "십센치",
        stage: "메인",
        tag: "POP",
      },
    ],
    "2026-05-14": [
      {
        time: "16:30",
        artist: "NewJeans",
        sub: "뉴진스",
        stage: "메인",
        tag: "K-POP",
      },
      {
        time: "17:40",
        artist: "검정치마",
        sub: "THE BLACK SKIRTS",
        stage: "메인",
        tag: "INDIE",
      },
      { time: "19:00", artist: "DEAN", sub: "딘", stage: "메인", tag: "R&B" },
      {
        time: "20:20",
        artist: "IVE",
        sub: "아이브",
        stage: "메인",
        tag: "K-POP",
      },
      {
        time: "21:40",
        artist: "EPIK HIGH",
        sub: "에픽하이",
        stage: "메인",
        tag: "HIPHOP",
      },
    ],
  },
};

const BOOTHS = {
  "ssu-daedongje-2026": [
    {
      id: "b1",
      name: "경영대 떡볶이",
      dept: "경영대학",
      loc: "A-12",
      desc: "국물떡볶이 + 튀김 모듬",
      schedule: "5/12–5/14 · 16:00–23:00",
      tag: "FOOD",
    },
    {
      id: "b2",
      name: "IT대 맥주바",
      dept: "IT대학",
      loc: "A-04",
      desc: "학교 양조 IPA / 흑맥주",
      schedule: "5/12–5/14 · 17:00–24:00",
      tag: "BAR",
    },
    {
      id: "b3",
      name: "인문대 사주카페",
      dept: "인문대학",
      loc: "B-02",
      desc: "타로 + MBTI 운세 5,000원",
      schedule: "5/12–5/14 · 14:00–22:00",
      tag: "GAME",
    },
    {
      id: "b4",
      name: "미디어학부 굿즈샵",
      dept: "미디어학부",
      loc: "C-08",
      desc: "학교 한정 키링·스티커",
      schedule: "5/12–5/14 · 11:00–21:00",
      tag: "GOODS",
    },
    {
      id: "b5",
      name: "간호대 야끼소바",
      dept: "간호대학",
      loc: "A-15",
      desc: "일본식 야끼소바 + 사이다",
      schedule: "5/12–5/13 · 16:00–23:00",
      tag: "FOOD",
    },
    {
      id: "b6",
      name: "체교과 포토부스",
      dept: "사범대학",
      loc: "D-01",
      desc: "4컷 즉석 인화 3,000원",
      schedule: "5/12–5/14 · 12:00–22:00",
      tag: "EXP",
    },
  ],
};

const NOTICES = {
  "ssu-daedongje-2026": [
    {
      id: "n1",
      pinned: true,
      time: "12분 전",
      title: "[긴급] 오늘 강수 확률 60% — 우천 시 메인공연 시간 조정",
      body: "오후 6시 이후 비 소식. 메인 무대 1시간 단축 가능성 있음.",
    },
    {
      id: "n2",
      time: "1시간 전",
      title: "PLAVE 무대 16:30 예정 — 인원 분산 안내",
      body: "메인 무대 앞 인파 집중 예상. 사이드 입장 권장.",
    },
    {
      id: "n3",
      time: "3시간 전",
      title: "셔틀버스 노선 변경",
      body: "숭실대입구역 ↔ 정문 셔틀이 우회 운행 중.",
    },
    {
      id: "n4",
      time: "어제",
      title: "굿즈 한정판 판매 시작",
      body: "미디어학부 굿즈샵에서 한정 200개 키링 판매. 1인 2개 제한.",
    },
  ],
};

const COMMUNITY = {
  "ssu-daedongje-2026": [
    {
      id: "c1",
      author: "익명의 숭실인",
      time: "방금",
      body: "경영대 떡볶이 줄 거의 없음 ㄱㄱ",
      likes: 12,
      replies: 3,
    },
    {
      id: "c2",
      author: "상도동냥이",
      time: "4분 전",
      body: "여자 화장실 D동 비교적 한산해요. A동은 줄 30명+",
      likes: 47,
      replies: 8,
    },
    {
      id: "c3",
      author: "숭실26",
      time: "11분 전",
      body: "PLAVE 무대 어디서 보기 좋을까요?",
      likes: 9,
      replies: 21,
    },
    {
      id: "c4",
      author: "IT대생",
      time: "32분 전",
      body: "IT대 IPA 품절 임박이래요",
      likes: 28,
      replies: 5,
    },
  ],
};

const MAP_LANDMARKS = {
  "ssu-daedongje-2026": {
    stages: [
      { id: "s1", label: "메인 스테이지", x: 160, y: 130, type: "stage" },
      { id: "s2", label: "서브 스테이지", x: 245, y: 280, type: "stage" },
    ],
    booths: [
      { id: "b1", label: "A-12 떡볶이", x: 85, y: 220, type: "booth" },
      { id: "b2", label: "A-04 맥주", x: 130, y: 200, type: "booth" },
      { id: "b3", label: "B-02 사주", x: 200, y: 220, type: "booth" },
    ],
    toilets: [
      {
        id: "t1",
        label: "화장실 A",
        x: 50,
        y: 90,
        type: "toilet",
        rating: 3.2,
      },
      {
        id: "t2",
        label: "화장실 D",
        x: 270,
        y: 100,
        type: "toilet",
        rating: 4.6,
      },
    ],
    smoking: [{ id: "sm1", label: "흡연구역", x: 30, y: 360, type: "smoking" }],
    info: [{ id: "i1", label: "안내소", x: 160, y: 30, type: "info" }],
  },
};

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
function LineupTab({ fest }: { fest: Festival }) {
  const lineupData =
    LINEUP[fest.id as keyof typeof LINEUP] ?? LINEUP["ssu-daedongje-2026"];
  const days = Object.keys(lineupData);
  const [day, setDay] = useState(days[0]);

  const stages = ["메인", "서브"];
  const todayLineup = lineupData[day as keyof typeof lineupData] ?? [];

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
      <div className="f-lineup-grid">
        {stages.map((stage) => {
          const sets = todayLineup.filter((s) => s.stage === stage);
          if (sets.length === 0) return null;
          return (
            <div key={stage} className="f-stage-col">
              <h3>{stage} 스테이지</h3>
              <div>
                {sets.map((s, i) => (
                  <div key={i} className="f-set-row">
                    <div className="time">{s.time}</div>
                    <div className="artist">
                      <div className="avatar">{s.sub.slice(0, 2)}</div>
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
    </div>
  );
}

// ── Tab: Map ─────────────────────────────────────────────
function MapTab({ fest }: { fest: Festival }) {
  const m =
    MAP_LANDMARKS[fest.id as keyof typeof MAP_LANDMARKS] ??
    MAP_LANDMARKS["ssu-daedongje-2026"];
  const [hovered, setHovered] = useState<string | null>(null);

  type LandmarkType = "stage" | "booth" | "toilet" | "smoking" | "info";
  type LandmarkPin = {
    id: string;
    label: string;
    x: number;
    y: number;
    type: LandmarkType;
    color: string;
    rating?: number;
  };

  const all: LandmarkPin[] = [
    ...m.stages.map((x) => ({
      ...x,
      type: "stage" as LandmarkType,
      color: "var(--accent)",
    })),
    ...m.booths.map((x) => ({
      ...x,
      type: "booth" as LandmarkType,
      color: "var(--upcoming)",
    })),
    ...m.toilets.map((x) => ({
      ...x,
      type: "toilet" as LandmarkType,
      color: "#5A6FCF",
    })),
    ...m.smoking.map((x) => ({
      ...x,
      type: "smoking" as LandmarkType,
      color: "#888",
    })),
    ...m.info.map((x) => ({
      ...x,
      type: "info" as LandmarkType,
      color: "var(--fg)",
    })),
  ];

  const pinLabel = (type: LandmarkType) => {
    if (type === "stage") return "♪";
    if (type === "booth") return "B";
    if (type === "toilet") return "W";
    if (type === "smoking") return "S";
    return "i";
  };

  return (
    <div className="f-map-wrap">
      <div className="f-map-canvas">
        <svg viewBox="0 0 320 420" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="320" height="420" fill="var(--surface-2)" />
          <path
            d="M 20 200 L 300 200"
            stroke="var(--faint)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 160 40 L 160 380"
            stroke="var(--faint)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <rect
            x="35"
            y="50"
            width="80"
            height="50"
            fill="var(--faint)"
            rx="4"
          />
          <rect
            x="200"
            y="60"
            width="60"
            height="40"
            fill="var(--faint)"
            rx="4"
          />
          <rect
            x="40"
            y="320"
            width="60"
            height="50"
            fill="var(--faint)"
            rx="4"
          />
          <rect
            x="210"
            y="320"
            width="80"
            height="50"
            fill="var(--faint)"
            rx="4"
          />
          {m.stages.map((s) => (
            <rect
              key={s.id}
              x={s.x - 28}
              y={s.y - 14}
              width="56"
              height="28"
              rx="4"
              fill="var(--accent)"
              fillOpacity="0.18"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
          ))}
          {all.map((p) => (
            <g
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="11"
                fill={p.color}
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
              {hovered === p.id && (
                <g>
                  <rect
                    x={p.x + 14}
                    y={p.y - 14}
                    width={p.label.length * 7 + 12}
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
                    {p.label}
                  </text>
                </g>
              )}
            </g>
          ))}
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
        <div className="f-legend-list">
          {all.map((p) => (
            <div
              key={p.id}
              className="f-legend-row"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="pin" style={{ background: p.color }}>
                {pinLabel(p.type)}
              </div>
              <div>
                <div style={{ font: "600 14px/1.2 var(--body-font)" }}>
                  {p.label}
                </div>
                <div
                  style={{
                    font: "500 11px/1 var(--mono-font)",
                    color: "var(--muted)",
                    marginTop: 3,
                  }}
                >
                  {p.type.toUpperCase()}
                  {p.rating != null && ` · ★ ${p.rating}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Booth ───────────────────────────────────────────
function BoothTab({ fest }: { fest: Festival }) {
  const booths =
    BOOTHS[fest.id as keyof typeof BOOTHS] ?? BOOTHS["ssu-daedongje-2026"];
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
            <div className="desc">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Notice ──────────────────────────────────────────
function NoticeTab({ fest }: { fest: Festival }) {
  const notices =
    NOTICES[fest.id as keyof typeof NOTICES] ?? NOTICES["ssu-daedongje-2026"];
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
            <div className="notice-preview">{n.body}</div>
          </div>
          <div className="time">{n.time}</div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Community ───────────────────────────────────────
function CommunityTab({ fest }: { fest: Festival }) {
  const initial =
    COMMUNITY[fest.id as keyof typeof COMMUNITY] ??
    COMMUNITY["ssu-daedongje-2026"];
  const [list, setList] = useState(initial);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setList([
      {
        id: `new-${Date.now()}`,
        author: "나",
        time: "방금",
        body: text,
        likes: 0,
        replies: 0,
      },
      ...list,
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
    </div>
  );
}

type Tab = "lineup" | "map" | "booth" | "notice" | "community";

const TABS: { value: Tab; label: string }[] = [
  { value: "lineup", label: "라인업" },
  { value: "map", label: "지도" },
  { value: "booth", label: "부스" },
  { value: "notice", label: "공지" },
  { value: "community", label: "톡" },
];

export default function FestivalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fest = FESTIVALS.find((f) => f.id === id) ?? FESTIVALS[0];
  const s = STATUS[fest.status];
  const [tab, setTab] = useState<Tab>("lineup");
  const [c0, c1, c2] = fest.colors;

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
          <span
            className={`f-tag ${s.cls}${fest.status === "live" ? "pulse" : ""}`}
          >
            {s.en}
          </span>
          <span>{fest.school}</span>
          <span>{fmtRange(fest.start, fest.end)}</span>
          {fest.status === "live" && (
            <span>참여자 {fest.participants.toLocaleString()}명</span>
          )}
        </div>
        <div className="detail-name">{fest.name}</div>
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

      {tab === "lineup" && <LineupTab fest={fest} />}
      {tab === "map" && <MapTab fest={fest} />}
      {tab === "booth" && <BoothTab fest={fest} />}
      {tab === "notice" && <NoticeTab fest={fest} />}
      {tab === "community" && <CommunityTab fest={fest} />}
    </div>
  );
}
