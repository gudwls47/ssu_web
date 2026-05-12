"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { LINEUPS, type LineupSet } from "@/app/admin/_mock/data";

const TAGS = ["K-POP", "BAND", "HIPHOP", "R&B", "DJ", "INDIE", "POP"] as const;
const STAGES = ["메인", "서브"] as const;

export default function LineupEditorPage() {
  const params = useParams<{ id: string }>();
  const festId = params.id;
  const lineupData = LINEUPS[festId] ?? LINEUPS["ssu-daedongje-2026"];
  const days = Object.keys(lineupData);

  const [activeDay, setActiveDay] = useState(days[0]);
  const [lineups, setLineups] = useState<Record<string, LineupSet[]>>(lineupData);

  const rows = lineups[activeDay] ?? [];

  const update = (day: string, idx: number, key: keyof LineupSet, value: string) => {
    setLineups((prev) => {
      const updated = [...(prev[day] ?? [])];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, [day]: updated };
    });
  };

  const addRow = () => {
    setLineups((prev) => ({
      ...prev,
      [activeDay]: [
        ...(prev[activeDay] ?? []),
        { time: "", artist: "", sub: "", tag: "K-POP", stage: "메인" },
      ],
    }));
  };

  const removeRow = (idx: number) => {
    setLineups((prev) => ({
      ...prev,
      [activeDay]: (prev[activeDay] ?? []).filter((_, i) => i !== idx),
    }));
  };

  const addDay = () => {
    const lastDay = days[days.length - 1];
    const next = new Date(lastDay);
    next.setDate(next.getDate() + 1);
    const nextStr = next.toISOString().split("T")[0];
    if (!lineups[nextStr]) {
      setLineups((prev) => ({ ...prev, [nextStr]: [] }));
      setActiveDay(nextStr);
    }
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

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr);
    const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return { date: `${d.getMonth() + 1}.${d.getDate()}`, dow };
  };

  return (
    <div>
      {/* Day chip row + stage selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Object.keys(lineups).map((d, i) => {
            const { date, dow } = formatDay(d);
            const isActive = activeDay === d;
            return (
              <button
                key={d}
                className="f-chip"
                data-active={isActive ? "true" : "false"}
                onClick={() => setActiveDay(d)}
                style={{ height: 38, padding: "0 16px" }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  DAY {i + 1}
                </span>
                <span
                  style={{
                    opacity: 0.6,
                    marginLeft: 6,
                    fontFamily: "var(--mono-font)",
                    fontSize: 11,
                  }}
                >
                  {date} {dow}
                </span>
              </button>
            );
          })}
          <button
            className="f-chip"
            onClick={addDay}
            style={{ height: 38, padding: "0 14px" }}
          >
            ＋
          </button>
        </div>
      </div>

      {/* Table */}
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
            gridTemplateColumns: "28px 120px 1fr 160px 120px 36px",
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
          <span>시간</span>
          <span>아티스트</span>
          <span>분류</span>
          <span>스테이지</span>
          <span />
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
            }}
          >
            이 날짜에 등록된 라인업이 없습니다.
          </div>
        ) : (
          rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 120px 1fr 160px 120px 36px",
                padding: "10px 16px",
                alignItems: "center",
                borderBottom:
                  i < rows.length - 1 ? "1px solid var(--border)" : "none",
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
                style={{ ...inputStyle, fontFamily: "var(--mono-font)" }}
                value={row.time}
                placeholder="19:00"
                onChange={(e) => update(activeDay, i, "time", e.target.value)}
              />

              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={row.artist}
                  placeholder="아티스트"
                  onChange={(e) => update(activeDay, i, "artist", e.target.value)}
                />
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={row.sub}
                  placeholder="서브명 (영문 등)"
                  onChange={(e) => update(activeDay, i, "sub", e.target.value)}
                />
              </div>

              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={row.tag}
                onChange={(e) => update(activeDay, i, "tag", e.target.value)}
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={row.stage}
                onChange={(e) => update(activeDay, i, "stage", e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => removeRow(i)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 16,
                  textAlign: "center",
                  display: "grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                }}
              >
                ×
              </button>
            </div>
          ))
        )}

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
          }}
        >
          ＋ 라인업 추가
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: "var(--mono-font)",
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        DAY {Object.keys(lineups).indexOf(activeDay) + 1} ·{" "}
        <strong style={{ color: "var(--fg)" }}>{rows.length}팀</strong> 등록됨
      </div>
    </div>
  );
}
