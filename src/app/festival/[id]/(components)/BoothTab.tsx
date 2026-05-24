"use client";

import { useState, useEffect } from "react";
import { useReactBooth } from "@/app/api/booths";
import type { BoothResponse } from "@/app/api/festivals.type";

interface BoothTabProps {
  booths: BoothResponse[];
}

type ReactionType = "likes" | "dislikes";

const TAG_LABELS: Record<string, string> = {
  FOOD: "음식",
  BAR: "주점",
  GAME: "게임",
  GOODS: "굿즈",
  EXP: "체험",
};

function BoothCard({
  b,
  festivalId,
}: {
  b: BoothResponse;
  festivalId: string;
}) {
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState<ReactionType | null>(null);
  const reactMut = useReactBooth(festivalId);

  // 로컬스토리지에서 이전 투표 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`booth_react_${b.id}`);
    if (stored === "likes" || stored === "dislikes") setVoted(stored);
  }, [b.id]);

  const handleReact = (type: ReactionType) => {
    if (voted === type) {
      // 이미 같은 반응 → 취소
      reactMut.mutate({ boothId: b.id, type, undo: true });
      setVoted(null);
      localStorage.removeItem(`booth_react_${b.id}`);
    } else {
      if (voted) {
        // 반대 반응 취소 후 새 반응
        reactMut.mutate({ boothId: b.id, type: voted, undo: true });
      }
      reactMut.mutate({ boothId: b.id, type });
      setVoted(type);
      localStorage.setItem(`booth_react_${b.id}`, type);
    }
  };

  const hasDesc = b.desc && b.desc.trim().length > 0;

  return (
    <div
      className="f-booth-card"
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* 헤더: 이름 + 태그 + 아코디언 토글 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <div className="name">{b.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="f-tag"
            style={{ background: "var(--faint)", color: "var(--fg)" }}
          >
            {TAG_LABELS[b.tag] ?? b.tag}
          </span>
          {hasDesc && (
            <button
              aria-label={open ? "접기" : "펼치기"}
              onClick={() => setOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 4px",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 위치 · 학과 */}
      <div className="meta">
        <span>{b.loc}</span>
        <span>·</span>
        <span>{b.dept}</span>
      </div>

      {/* 운영 시간 */}
      <div className="meta" style={{ color: "var(--fg)" }}>
        {b.schedule}
      </div>

      {/* 아코디언: 부스 소개 */}
      {hasDesc && open && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--fg)",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {b.desc}
        </div>
      )}

      {/* 반응 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => handleReact("likes")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 20,
            border: `1.5px solid ${voted === "likes" ? "var(--accent)" : "var(--border)"}`,
            background: voted === "likes" ? "var(--faint)" : "transparent",
            color: voted === "likes" ? "var(--accent)" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 14 }}>👍</span>
          <span>{b.likes ?? 0}</span>
        </button>

        <button
          onClick={() => handleReact("dislikes")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 20,
            border: `1.5px solid ${voted === "dislikes" ? "#888" : "var(--border)"}`,
            background: voted === "dislikes" ? "var(--faint)" : "transparent",
            color: voted === "dislikes" ? "var(--fg)" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 14 }}>👎</span>
          <span>{b.dislikes ?? 0}</span>
        </button>
      </div>
    </div>
  );
}

export function BoothTab({
  booths,
  festivalId,
}: BoothTabProps & { festivalId: string }) {
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
            {TAG_LABELS[t] ?? t}
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
            <BoothCard key={b.id} b={b} festivalId={festivalId} />
          ))}
        </div>
      )}
    </div>
  );
}
