"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BOOTHS, type Booth } from "@/app/admin/_mock/data";

const TAGS = ["FOOD", "BAR", "GAME", "GOODS", "EXP"] as const;

function TagBadge({ tag }: { tag: Booth["tag"] }) {
  const colors: Record<Booth["tag"], string> = {
    FOOD: "#FF6B6B",
    BAR: "#845EF7",
    GAME: "#339AF0",
    GOODS: "#20C997",
    EXP: "#FCC419",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 20,
        padding: "0 7px",
        borderRadius: 4,
        background: `${colors[tag]}22`,
        color: colors[tag],
        fontFamily: "var(--mono-font)",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.06em",
      }}
    >
      {tag}
    </span>
  );
}

export default function BoothEditorPage() {
  const params = useParams<{ id: string }>();
  const initial = BOOTHS[params.id] ?? BOOTHS["ssu-daedongje-2026"];
  const [booths, setBooths] = useState<Booth[]>(initial);

  const update = <K extends keyof Booth>(id: string, key: K, value: Booth[K]) => {
    setBooths((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)),
    );
  };

  const addRow = () => {
    setBooths((prev) => [
      ...prev,
      {
        id: `b${Date.now()}`,
        name: "",
        dept: "",
        loc: "",
        schedule: "",
        tag: "FOOD",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setBooths((prev) => prev.filter((b) => b.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 34,
    padding: "0 10px",
    borderRadius: 8,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
    fontSize: 13,
    fontFamily: "var(--body-font)",
    outline: "none",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          총 {booths.length}개 부스
        </div>
        <button className="f-btn sm accent" onClick={addRow}>
          ＋ 부스 추가
        </button>
      </div>

      <div
        style={{
          borderRadius: 14,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 140px 90px 1fr 110px 36px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--mono-font)",
            fontSize: 10,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            fontWeight: 500,
            gap: 8,
          }}
        >
          <span>#</span>
          <span>부스명</span>
          <span>학과</span>
          <span>위치</span>
          <span>일정</span>
          <span>분류</span>
          <span />
        </div>

        {/* Rows */}
        {booths.map((b, i) => (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 140px 90px 1fr 110px 36px",
              padding: "10px 16px",
              alignItems: "center",
              borderBottom:
                i < booths.length - 1 ? "1px solid var(--border)" : "none",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono-font)",
                color: "var(--muted)",
                fontSize: 11,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <input
              style={inputStyle}
              value={b.name}
              placeholder="부스명"
              onChange={(e) => update(b.id, "name", e.target.value)}
            />

            <input
              style={inputStyle}
              value={b.dept}
              placeholder="학과"
              onChange={(e) => update(b.id, "dept", e.target.value)}
            />

            <input
              style={{ ...inputStyle, fontFamily: "var(--mono-font)", fontSize: 12 }}
              value={b.loc}
              placeholder="A-01"
              onChange={(e) => update(b.id, "loc", e.target.value)}
            />

            <input
              style={inputStyle}
              value={b.schedule}
              placeholder="10:00–18:00"
              onChange={(e) => update(b.id, "schedule", e.target.value)}
            />

            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={b.tag}
              onChange={(e) =>
                update(b.id, "tag", e.target.value as Booth["tag"])
              }
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeRow(b.id)}
              style={{
                all: "unset",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: 16,
                textAlign: "center",
                lineHeight: 1,
                width: 28,
                height: 28,
                borderRadius: 6,
                display: "grid",
                placeItems: "center",
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Add row button */}
        <button
          onClick={addRow}
          style={{
            width: "100%",
            padding: "14px 16px",
            border: 0,
            borderTop: "1px dashed var(--border)",
            background: "transparent",
            cursor: "pointer",
            color: "var(--accent)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--body-font)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          ＋ 부스 추가
        </button>
      </div>

      {/* Tag legend */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {TAGS.map((t) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <TagBadge tag={t} />
            <span
              style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono-font)" }}
            >
              {booths.filter((b) => b.tag === t).length}개
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
