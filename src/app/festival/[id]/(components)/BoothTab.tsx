"use client";

import { useState, useEffect } from "react";
import { useReactBooth } from "@/app/api/booths";
import type { BoothResponse } from "@/app/api/festivals.type";

interface BoothTabProps {
  booths: BoothResponse[];
}

type ReactionType = "likes" | "dislikes";
type SortKey =
  | "default"
  | "likes_desc"
  | "likes_asc"
  | "dislikes_desc"
  | "dislikes_asc";

const TAG_LABELS: Record<string, string> = {
  FOOD: "음식",
  BAR: "주점",
  GAME: "게임",
  GOODS: "굿즈",
  EXP: "체험",
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "기본순" },
  { value: "likes_desc", label: "👍 많은 순" },
  { value: "likes_asc", label: "👍 적은 순" },
  { value: "dislikes_desc", label: "👎 많은 순" },
  { value: "dislikes_asc", label: "👎 적은 순" },
];

function sortBooths(
  booths: BoothResponse[],
  sortKey: SortKey,
): BoothResponse[] {
  const arr = [...booths];
  switch (sortKey) {
    case "likes_desc":
      return arr.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    case "likes_asc":
      return arr.sort((a, b) => (a.likes ?? 0) - (b.likes ?? 0));
    case "dislikes_desc":
      return arr.sort((a, b) => (b.dislikes ?? 0) - (a.dislikes ?? 0));
    case "dislikes_asc":
      return arr.sort((a, b) => (a.dislikes ?? 0) - (b.dislikes ?? 0));
    default:
      return arr.sort((a, b) => a.order - b.order);
  }
}

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`booth_react_${b.id}`);
    if (stored === "likes" || stored === "dislikes") setVoted(stored);
  }, [b.id]);

  const handleReact = (type: ReactionType) => {
    if (voted === type) {
      reactMut.mutate({ boothId: b.id, type, undo: true });
      setVoted(null);
      localStorage.removeItem(`booth_react_${b.id}`);
    } else {
      if (voted) {
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

      <div className="meta">
        <span>{b.loc}</span>
        <span>·</span>
        <span>{b.dept}</span>
      </div>

      <div className="meta" style={{ color: "var(--fg)" }}>
        {b.schedule}
      </div>

      {hasDesc && open && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
            fontSize: 15,
            color: "var(--fg)",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {b.desc}
        </div>
      )}

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
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 16 }}>👍</span>
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
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 16 }}>👎</span>
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
  const [sortKey, setSortKey] = useState<SortKey>("default");

  const tags = ["ALL", ...Array.from(new Set(booths.map((b) => b.tag)))];
  const filtered = tag === "ALL" ? booths : booths.filter((b) => b.tag === tag);
  const sorted = sortBooths(filtered, sortKey);

  return (
    <div>
      {/* 태그 필터 + 정렬 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <div className="f-day-row" style={{ margin: 0 }}>
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

        {/* 정렬 드롭다운 */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              appearance: "none",
              padding: "6px 28px 6px 12px",
              borderRadius: 20,
              border: "1.5px solid var(--border)",
              background: "var(--surface)",
              color: "var(--fg)",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              fontFamily: "var(--body-font)",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {/* 드롭다운 화살표 */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 15,
          }}
        >
          등록된 부스가 없습니다.
        </div>
      ) : (
        <div className="f-booth-grid">
          {sorted.map((b) => (
            <BoothCard key={b.id} b={b} festivalId={festivalId} />
          ))}
        </div>
      )}
    </div>
  );
}
