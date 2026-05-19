"use client";

import { useState, useEffect, useMemo, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import { useGetBooths, useSaveBooths } from "@/app/api/booths";
import { useGetFestival } from "@/app/api/festivals";
import type { BoothTag } from "@/app/api/festivals.type";

const TAGS = ["FOOD", "BAR", "GAME", "GOODS", "EXP"] as const;

type BoothRow = {
  _key: string;
  id?: string;
  name: string;
  dept: string;
  loc: string;
  schedule: string;
  desc: string;
  tag: BoothTag;
  days: string[];
};

function TagBadge({ tag }: { tag: BoothTag }) {
  const colors: Record<BoothTag, string> = {
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

/** 시작일~종료일 사이 날짜 배열 생성 */
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

function formatDayLabel(dateStr: string, index: number) {
  const d = new Date(dateStr);
  const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `DAY ${index + 1}  ${d.getMonth() + 1}.${d.getDate()} ${dow}`;
}

export default function BoothEditorPage() {
  const params = useParams<{ id: string }>();
  const festivalId = params.id;

  const { data: fest } = useGetFestival(festivalId);
  const { data: boothData, isLoading } = useGetBooths(festivalId);
  const saveBooths = useSaveBooths(festivalId);

  // 축제 날짜 범위
  const festivalDays = useMemo(
    () => (fest ? dateRange(fest.start, fest.end) : []),
    [fest],
  );

  const [rows, setRows] = useState<BoothRow[]>([]);
  const [filterDay, setFilterDay] = useState<string | null>(null); // null = 전체

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
          desc: b.desc ?? "",
          tag: b.tag,
          days: b.days ?? [],
        })),
      );
    }
  }, [boothData]);

  // 현재 필터에 맞는 부스 인덱스 목록
  const visibleRows = useMemo(() => {
    if (!filterDay) return rows;
    return rows.filter(
      (r) => r.days.length === 0 || r.days.includes(filterDay),
    );
  }, [rows, filterDay]);

  const updateField = <K extends keyof Omit<BoothRow, "_key">>(
    key: string,
    field: K,
    value: BoothRow[K],
  ) => {
    setRows((prev) =>
      prev.map((r) => (r._key === key ? { ...r, [field]: value } : r)),
    );
  };

  const toggleDay = (key: string, day: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r._key !== key) return r;
        const has = r.days.includes(day);
        return {
          ...r,
          days: has ? r.days.filter((d) => d !== day) : [...r.days, day],
        };
      }),
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
        desc: "",
        tag: "FOOD",
        days: filterDay ? [filterDay] : [],
      },
    ]);
  };

  const removeRow = (key: string) => {
    setRows((prev) => prev.filter((r) => r._key !== key));
  };

  const handleSave = () => {
    saveBooths.mutate(
      rows.map(
        ({
          _key: _k,
          id: _id,
          name,
          dept,
          loc,
          schedule,
          desc,
          tag,
          days,
        }) => ({
          name,
          dept,
          loc,
          schedule,
          desc,
          tag,
          days,
        }),
      ),
    );
  };

  const inputStyle: CSSProperties = {
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

  if (isLoading || !fest) {
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
      {/* 날짜 필터 칩 + 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {/* 전체 칩 */}
          <button
            className="f-chip"
            data-active={filterDay === null ? "true" : "false"}
            onClick={() => setFilterDay(null)}
            style={{ height: 34, padding: "0 14px" }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>전체</span>
            <span
              style={{
                marginLeft: 6,
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              {rows.length}개
            </span>
          </button>

          {festivalDays.map((d, i) => {
            const count = rows.filter(
              (r) => r.days.length === 0 || r.days.includes(d),
            ).length;
            const isActive = filterDay === d;
            const date = new Date(d);
            const dow = ["일", "월", "화", "수", "목", "금", "토"][
              date.getDay()
            ];
            return (
              <button
                key={d}
                className="f-chip"
                data-active={isActive ? "true" : "false"}
                onClick={() => setFilterDay(d)}
                style={{ height: 34, padding: "0 14px" }}
              >
                <span style={{ fontSize: 12, fontWeight: 700 }}>
                  DAY {i + 1}
                </span>
                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: "var(--mono-font)",
                    fontSize: 10,
                    opacity: 0.6,
                  }}
                >
                  {date.getMonth() + 1}.{date.getDate()} {dow} · {count}개
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
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
      {saveBooths.isError && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,107,107,0.1)",
            color: "#FF6B6B",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
          }}
        >
          저장 실패: {(saveBooths.error as Error)?.message ?? "알 수 없는 오류"}
        </div>
      )}

      {/* 테이블 */}
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
            gridTemplateColumns: "28px 1fr 120px 80px 1fr 100px 36px",
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
          <span>부스명 / 상세 내용 / 운영 날짜</span>
          <span>학과</span>
          <span>위치</span>
          <span>일정</span>
          <span>분류</span>
          <span />
        </div>

        {visibleRows.length === 0 ? (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
            }}
          >
            {filterDay
              ? "이 날짜에 운영하는 부스가 없습니다."
              : "등록된 부스가 없습니다."}
          </div>
        ) : (
          visibleRows.map((b, i) => (
            <div
              key={b._key}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 120px 80px 1fr 100px 36px",
                padding: "10px 16px",
                alignItems: "start",
                borderBottom:
                  i < visibleRows.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                gap: 8,
              }}
            >
              {/* # */}
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  color: "var(--muted)",
                  fontSize: 11,
                  paddingTop: 8,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* 부스명 + 상세내용 + 날짜 토글 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <input
                  style={inputStyle}
                  value={b.name}
                  placeholder="부스명"
                  onChange={(e) => updateField(b._key, "name", e.target.value)}
                />
                {/* 상세 내용 */}
                <textarea
                  style={{
                    ...inputStyle,
                    height: 72,
                    padding: "8px 10px",
                    resize: "vertical",
                    lineHeight: 1.6,
                    fontSize: 12,
                    color: "var(--fg)",
                  }}
                  value={b.desc}
                  placeholder="부스 소개, 운영 방식, 메뉴 등 상세 내용"
                  onChange={(e) => updateField(b._key, "desc", e.target.value)}
                />
                {/* 날짜 토글 칩 */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {festivalDays.map((d, di) => {
                    const active = b.days.length === 0 || b.days.includes(d);
                    const date = new Date(d);
                    return (
                      <button
                        key={d}
                        onClick={() => toggleDay(b._key, d)}
                        title={formatDayLabel(d, di)}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          height: 22,
                          padding: "0 8px",
                          borderRadius: 5,
                          fontSize: 10,
                          fontFamily: "var(--mono-font)",
                          fontWeight: 600,
                          letterSpacing: "0.03em",
                          background: active ? "var(--accent)" : "var(--faint)",
                          color: active
                            ? "var(--accent-fg, #fff)"
                            : "var(--muted)",
                          border: "1.5px solid transparent",
                          transition: "background 0.1s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        D{di + 1} {date.getMonth() + 1}/{date.getDate()}
                      </button>
                    );
                  })}
                  {/* 전체 기간 토글 */}
                  <button
                    onClick={() => updateField(b._key, "days", [])}
                    title="전체 기간 운영"
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      height: 22,
                      padding: "0 8px",
                      borderRadius: 5,
                      fontSize: 10,
                      fontFamily: "var(--mono-font)",
                      fontWeight: 600,
                      background:
                        b.days.length === 0 ? "var(--fg)" : "var(--faint)",
                      color: b.days.length === 0 ? "var(--bg)" : "var(--muted)",
                      transition: "background 0.1s",
                    }}
                  >
                    전체
                  </button>
                </div>
              </div>

              {/* 학과 */}
              <input
                style={{ ...inputStyle, marginTop: 0 }}
                value={b.dept}
                placeholder="학과"
                onChange={(e) => updateField(b._key, "dept", e.target.value)}
              />

              {/* 위치 */}
              <input
                style={{
                  ...inputStyle,
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                }}
                value={b.loc}
                placeholder="A-01"
                onChange={(e) => updateField(b._key, "loc", e.target.value)}
              />

              {/* 일정 */}
              <input
                style={inputStyle}
                value={b.schedule}
                placeholder="10:00–18:00"
                onChange={(e) =>
                  updateField(b._key, "schedule", e.target.value)
                }
              />

              {/* 분류 */}
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={b.tag}
                onChange={(e) =>
                  updateField(b._key, "tag", e.target.value as BoothTag)
                }
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* 삭제 */}
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
                  paddingTop: 4,
                }}
              >
                ×
              </button>
            </div>
          ))
        )}

        {/* 추가 버튼 */}
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
          }}
        >
          ＋ 부스 추가
        </button>
      </div>

      {/* 태그 범례 */}
      <div
        style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {TAGS.map((t) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
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
