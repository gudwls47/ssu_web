"use client";

import { useState } from "react";

interface Notice {
  id: string;
  pinned: boolean;
  category: string;
  title: string;
  body: string;
  time: string;
  festName?: string;
}

const NOTICES: Notice[] = [
  {
    id: "n1",
    pinned: true,
    category: "긴급",
    festName: "2026 숭실 대동제",
    title: "[긴급] 오늘 강수 확률 60% — 우천 시 메인공연 시간 조정",
    body: "오후 6시 이후 비 소식. 메인 무대 1시간 단축 가능성 있음. 우산 지참 권장.",
    time: "12분 전",
  },
  {
    id: "n2",
    pinned: false,
    category: "안내",
    festName: "2026 숭실 대동제",
    title: "PLAVE 무대 16:30 예정 — 인원 분산 안내",
    body: "메인 무대 앞 인파 집중 예상. 사이드 입장 권장.",
    time: "1시간 전",
  },
  {
    id: "n3",
    pinned: false,
    category: "교통",
    festName: "2026 숭실 대동제",
    title: "셔틀버스 노선 변경",
    body: "숭실대입구역 ↔ 정문 셔틀이 우회 운행 중. 배차 간격 10분.",
    time: "3시간 전",
  },
  {
    id: "n4",
    pinned: false,
    category: "굿즈",
    festName: "2026 숭실 대동제",
    title: "굿즈 한정판 판매 시작",
    body: "미디어학부 굿즈샵에서 한정 200개 키링 판매. 1인 2개 제한.",
    time: "어제",
  },
  {
    id: "n5",
    pinned: false,
    category: "안내",
    festName: "제25회 IT대학 학술제",
    title: "IT 학술제 참가 팀 명단 공개",
    body: "총 48개 팀이 참가 확정되었습니다. 발표 일정은 홈페이지에서 확인하세요.",
    time: "2일 전",
  },
  {
    id: "n6",
    pinned: false,
    category: "안내",
    title: "숭실대학교 2026 봄학기 행사 일정 안내",
    body: "대동제, IT학술제, 체육대회 등 주요 행사 일정이 확정되었습니다.",
    time: "1주일 전",
  },
];

const CATEGORIES = ["전체", "긴급", "안내", "교통", "굿즈"];

export default function NoticePage() {
  const [cat, setCat] = useState("전체");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered =
    cat === "전체" ? NOTICES : NOTICES.filter((n) => n.category === cat);

  return (
    <>
      <div className="f-tagline">Notice · 공지사항</div>
      <h1 className="f-h" style={{ marginBottom: 24 }}>
        공지사항
      </h1>

      <div className="f-day-row" style={{ marginBottom: 28 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="f-chip"
            data-active={cat === c ? "true" : "false"}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="f-notice-list">
        {filtered.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "16px 20px",
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "box-shadow 0.15s",
            }}
            onClick={() => setExpanded(expanded === n.id ? null : n.id)}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {n.pinned ? (
                <span
                  className="f-tag live"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  긴급
                </span>
              ) : (
                <span
                  className="f-tag ended"
                  style={{ flexShrink: 0, marginTop: 2 }}
                >
                  {n.category}
                </span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    font: "700 14px/1.3 var(--body-font)",
                    marginBottom: 4,
                  }}
                >
                  {n.title}
                </div>
                {n.festName && (
                  <div
                    style={{
                      font: "500 11px/1 var(--mono-font)",
                      color: "var(--accent)",
                      marginBottom: 4,
                    }}
                  >
                    {n.festName}
                  </div>
                )}
                {expanded === n.id && (
                  <div
                    style={{
                      font: "500 13px/1.5 var(--body-font)",
                      color: "var(--muted)",
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    {n.body}
                  </div>
                )}
              </div>
              <div
                style={{
                  font: "500 11px/1 var(--mono-font)",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {n.time}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              font: "500 14px/1.6 var(--body-font)",
            }}
          >
            해당 카테고리의 공지사항이 없습니다.
          </div>
        )}
      </div>
    </>
  );
}
