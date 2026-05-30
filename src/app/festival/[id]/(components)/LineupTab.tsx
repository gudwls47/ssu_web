"use client";

import { useState, useMemo, useEffect } from "react";
import type {
  FestivalResponse,
  LineupResponse,
} from "@/app/api/festivals.type";
import { dateRange } from "./utils";

/**
 * 테스트용 시간 설정 (null이면 실제 현재 시간 사용)
 * 형식: "2026-05-26 21:30"
 */
const NOW_OVERRIDE: string | null = null;

interface LineupTabProps {
  fest: FestivalResponse;
  items: LineupResponse[];
}

export function LineupTab({ fest, items }: LineupTabProps) {
  const [now, setNow] = useState<Date | null>(
    NOW_OVERRIDE ? new Date(NOW_OVERRIDE) : null,
  );

  useEffect(() => {
    if (NOW_OVERRIDE) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000 * 60); // 1분마다 갱신
    return () => clearInterval(timer);
  }, []);

  const days = useMemo(
    () => dateRange(fest.start, fest.end),
    [fest.start, fest.end],
  );
  const [day, setDay] = useState(days[0] ?? "");

  // 해당 날짜 아이템을 시간순으로 정렬
  const todayItems = items
    .filter((item) => item.day === day)
    .sort((a, b) => {
      const aTime = a.startTime?.seconds ?? 0;
      const bTime = b.startTime?.seconds ?? 0;
      return aTime - bTime;
    });

  // 스테이지 목록은 전체 아이템 기준 (순서 유지)
  const stages = [...new Set(items.map((i) => i.stage))];

  const isLive = (item: LineupResponse) => {
    if (!now || !item.startTime || !item.endTime) return false;
    try {
      const itemStart = item.startTime.toDate();
      const itemEnd = item.endTime.toDate();
      return now >= itemStart && now <= itemEnd;
    } catch {
      return false;
    }
  };

  const formatTime = (ts: any) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    const date = ts.toDate();
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    }).format(date);
  };

  return (
    <div>
      {NOW_OVERRIDE && (
        <div
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ⚠️ 테스트 모드: 현재 시간이 {NOW_OVERRIDE}로 고정되어 있습니다.
        </div>
      )}
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
            fontSize: 15,
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
                  {sets.map((s) => {
                    const active = isLive(s);
                    return (
                      <div
                        key={s.id}
                        className={`f-set-row ${active ? "live" : ""}`}
                      >
                        <div className="time">
                          {active && (
                            <div
                              style={{
                                color: "var(--live)",
                                fontSize: 11,
                                fontWeight: 800,
                                marginBottom: 4,
                                letterSpacing: "0.05em",
                              }}
                            >
                              ● LIVE
                            </div>
                          )}
                          {formatTime(s.startTime)}
                          <div
                            style={{
                              fontSize: 12,
                              opacity: 0.5,
                              fontWeight: 500,
                              marginTop: 2,
                            }}
                          >
                            – {formatTime(s.endTime)}
                          </div>
                        </div>
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
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
