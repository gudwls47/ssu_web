"use client";

import { useState, useEffect, useMemo, type CSSProperties } from "react";
import { useParams } from "next/navigation";
import { useGetFestival } from "@/app/api/festivals";
import { useGetLineup, useSaveLineupByDay } from "@/app/api/lineup";
import Modal from "@/app/components/Modal";

const TAGS = ["K-POP", "BAND", "HIPHOP", "R&B", "DJ", "INDIE", "POP"] as const;
const STAGES = ["메인", "서브"] as const;

type LineupRow = {
  _key: string;
  id?: string;
  time: string;
  endTime: string;
  artist: string;
  sub: string;
  tag: string;
  stage: string;
};

/** 시작일~종료일 사이 날짜 배열 생성 ("2026-05-18" 형식) */
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

export default function LineupEditorPage() {
  const params = useParams<{ id: string }>();
  const festId = params.id;

  const { data: fest } = useGetFestival(festId);

  // 축제 날짜 범위로 DAY 목록 자동 생성
  const festivalDays = useMemo(
    () => (fest ? dateRange(fest.start, fest.end) : []),
    [fest],
  );

  const [activeDay, setActiveDay] = useState<string>("");

  // 축제 날짜가 로드되면 첫째 날로 초기화
  useEffect(() => {
    if (festivalDays.length > 0 && !activeDay) {
      setActiveDay(festivalDays[0]);
    }
  }, [festivalDays, activeDay]);

  const { data: lineupData, isLoading: lineupLoading } = useGetLineup(
    festId,
    activeDay,
  );
  const saveLineup = useSaveLineupByDay(festId);

  const [rows, setRows] = useState<LineupRow[]>([]);
  const [timeWarnOpen, setTimeWarnOpen] = useState(false);

  useEffect(() => {
    if (lineupData) {
      setRows(
        lineupData.map((l) => ({
          _key: l.id,
          id: l.id,
          time: l.time,
          endTime: l.endTime ?? "",
          artist: l.artist,
          sub: l.sub,
          tag: l.tag,
          stage: l.stage,
        })),
      );
    } else {
      setRows([]);
    }
  }, [lineupData, activeDay]);

  const update = (
    key: string,
    field: keyof Omit<LineupRow, "_key" | "id">,
    value: string,
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
        time: "",
        endTime: "",
        artist: "",
        sub: "",
        tag: "K-POP",
        stage: "메인",
      },
    ]);
  };

  const removeRow = (key: string) => {
    setRows((prev) => prev.filter((r) => r._key !== key));
  };

  const handleSave = () => {
    if (!activeDay) return;
    const hasTimeConflict = rows.some(
      (r) => r.time && r.endTime && r.time > r.endTime,
    );
    if (hasTimeConflict) {
      setTimeWarnOpen(true);
      return;
    }
    // 저장 전 시간순 정렬
    const sorted = [...rows].sort((a, b) => a.time.localeCompare(b.time));
    saveLineup.mutate({
      day: activeDay,
      items: sorted.map(({ time, endTime, artist, sub, tag, stage }) => ({
        day: activeDay,
        time,
        endTime,
        artist,
        sub,
        tag,
        stage,
      })),
    });
    // 화면도 정렬된 순서로 갱신
    setRows(sorted);
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    height: 34,
    padding: "0 10px",
    borderRadius: 8,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
    fontSize: 15,
    fontFamily: "var(--body-font)",
    outline: "none",
  };

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr);
    const dow = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    return { date: `${d.getMonth() + 1}.${d.getDate()}`, dow };
  };

  if (!fest) {
    return (
      <div
        style={{
          padding: 24,
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 15,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div>
      {/* Day chip row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {festivalDays.map((d, i) => {
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
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                  DAY {i + 1}
                </span>
                <span
                  style={{
                    opacity: 0.6,
                    marginLeft: 6,
                    fontFamily: "var(--mono-font)",
                    fontSize: 13,
                  }}
                >
                  {date} {dow}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="f-btn sm accent"
          onClick={handleSave}
          disabled={saveLineup.isPending || !activeDay}
        >
          {saveLineup.isPending ? "저장 중…" : "이 날 저장"}
        </button>
      </div>

      {saveLineup.isSuccess && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(32,201,151,0.1)",
            color: "#20C997",
            fontFamily: "var(--mono-font)",
            fontSize: 14,
          }}
        >
          저장됨 ✓
        </div>
      )}
      {saveLineup.isError && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,107,107,0.1)",
            color: "#FF6B6B",
            fontFamily: "var(--mono-font)",
            fontSize: 14,
          }}
        >
          저장 실패: {(saveLineup.error as Error)?.message ?? "알 수 없는 오류"}
        </div>
      )}

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
            gridTemplateColumns: "28px 180px 1fr 160px 120px 36px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            fontWeight: 500,
            gap: 8,
          }}
        >
          <span>#</span>
          <span>시간 (시작-종료)</span>
          <span>아티스트</span>
          <span>분류</span>
          <span>스테이지</span>
          <span />
        </div>

        {lineupLoading ? (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 15,
              fontFamily: "var(--mono-font)",
            }}
          >
            불러오는 중…
          </div>
        ) : rows.length === 0 ? (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 15,
              fontFamily: "var(--mono-font)",
            }}
          >
            이 날짜에 등록된 라인업이 없습니다.
          </div>
        ) : (
          rows.map((row, i) => (
            <div
              key={row._key}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 180px 1fr 160px 120px 36px",
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
                  fontSize: 13,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  style={{ ...inputStyle, fontFamily: "var(--mono-font)" }}
                  value={row.time}
                  placeholder="19:00"
                  onChange={(e) => update(row._key, "time", e.target.value)}
                />
                <span style={{ color: "var(--muted)" }}>–</span>
                <input
                  style={{ ...inputStyle, fontFamily: "var(--mono-font)" }}
                  value={row.endTime}
                  placeholder="20:00"
                  onChange={(e) => update(row._key, "endTime", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={row.artist}
                  placeholder="아티스트"
                  onChange={(e) => update(row._key, "artist", e.target.value)}
                />
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={row.sub}
                  placeholder="서브명 (영문 등)"
                  onChange={(e) => update(row._key, "sub", e.target.value)}
                />
              </div>

              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={row.tag}
                onChange={(e) => update(row._key, "tag", e.target.value)}
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
                onChange={(e) => update(row._key, "stage", e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => removeRow(row._key)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 18,
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
            fontSize: 15,
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
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        {activeDay && `DAY ${festivalDays.indexOf(activeDay) + 1} · `}
        <strong style={{ color: "var(--fg)" }}>{rows.length}팀</strong> 등록됨
      </div>

      <Modal
        open={timeWarnOpen}
        onOpenChange={setTimeWarnOpen}
        title="시간 오류"
        cancelButtonText="확인"
      >
        시작 시간이 종료 시간보다 늦은 항목이 있습니다.
      </Modal>
    </div>
  );
}
