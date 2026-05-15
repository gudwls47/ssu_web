"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetBooths, useSaveBooths } from "@/app/api/booths";
import type { BoothTag } from "@/app/api/festivals.type";

const TAGS = ["FOOD", "BAR", "GAME", "GOODS", "EXP"] as const;

type BoothRow = {
  _key: string;
  id?: string;
  name: string;
  dept: string;
  loc: string;
  schedule: string;
  tag: BoothTag;
};

function TagBadge({ tag }: { tag: BoothTag }) {
  const colors: Record<BoothTag, string> = {
    FOOD:  "#FF6B6B",
    BAR:   "#845EF7",
    GAME:  "#339AF0",
    GOODS: "#20C997",
    EXP:   "#FCC419",
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
  const festivalId = params.id;
  const { data: boothData, isLoading } = useGetBooths(festivalId);
  const saveBooths = useSaveBooths(festivalId);

  const [rows, setRows] = useState<BoothRow[]>([]);

  useEffect(() => {
    if (boothData) {
      setRows(
        boothData.map((b) => ({
          _key: b.id,
          id: b.id,
          name: b.name,
          dept: b.dept,
          loc: b.loc,
          schedule: b.schedule,
          tag: b.tag,
        })),
      );
    }
  }, [boothData]);

  const update = <K extends keyof Omit<BoothRow, "_key">>(
    key: string,
    field: K,
    value: BoothRow[K],
  ) => {
    setRows((prev) =>
      prev.map((r) => (r._key === key ? { ...r, [field]: value } : r)),
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        _key: `new_${Date.now()}`,
        name: "",
        dept: "",
        loc: "",
        schedule: "",
        tag: "FOOD",
      },
    ]);
  };

  const removeRow = (key: string) => {
    setRows((prev) => prev.filter((r) => r._key !== key));
  };

  const handleSave = () => {
    saveBooths.mutate(
      rows.map(({ _key: _k, id, name, dept, loc, schedule, tag }) => ({
        id,
        name,
        dept,
        loc,
        schedule,
        tag,
      })),
    );
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

  if (isLoading) {
    return (
      <div
        style={{
          padding: 24,
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        불러오는 중…
      </div>
    );
  }

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
          총 {rows.length}개 부스
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="f-btn sm ghost" onClick={addRow}>
            ＋ 부스 추가
          </button>
          <button
            className="f-btn sm accent"
            onClick={handleSave}
            disabled={saveBooths.isPending}
          >
            {saveBooths.isPending ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>

      {saveBooths.isSuccess && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(32,201,151,0.1)",
            color: "#20C997",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
          }}
        >
          저장됨 ✓
        </div>
      )}

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
        {rows.map((b, i) => (
          <div
            key={b._key}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 140px 90px 1fr 110px 36px",
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
              style={inputStyle}
              value={b.name}
              placeholder="부스명"
              onChange={(e) => update(b._key, "name", e.target.value)}
            />

            <input
              style={inputStyle}
              value={b.dept}
              placeholder="학과"
              onChange={(e) => update(b._key, "dept", e.target.value)}
            />

            <input
              style={{
                ...inputStyle,
                fontFamily: "var(--mono-font)",
                fontSize: 12,
              }}
              value={b.loc}
              placeholder="A-01"
              onChange={(e) => update(b._key, "loc", e.target.value)}
            />

            <input
              style={inputStyle}
              value={b.schedule}
              placeholder="10:00–18:00"
              onChange={(e) => update(b._key, "schedule", e.target.value)}
            />

            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={b.tag}
              onChange={(e) =>
                update(b._key, "tag", e.target.value as BoothTag)
              }
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => removeRow(b._key)}
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
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TagBadge tag={t} />
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                fontFamily: "var(--mono-font)",
              }}
            >
              {rows.filter((b) => b.tag === t).length}개
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
