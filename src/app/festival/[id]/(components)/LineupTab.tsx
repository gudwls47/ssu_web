"use client";

import { useState, useMemo } from "react";
import type {
  FestivalResponse,
  LineupResponse,
} from "@/app/api/festivals.type";
import { dateRange } from "./utils";

interface LineupTabProps {
  fest: FestivalResponse;
  items: LineupResponse[];
}

export function LineupTab({ fest, items }: LineupTabProps) {
  const days = useMemo(
    () => dateRange(fest.start, fest.end),
    [fest.start, fest.end],
  );
  const [day, setDay] = useState(days[0] ?? "");

  // 해당 날짜 아이템을 시간순으로 정렬
  const todayItems = items
    .filter((item) => item.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));

  // 스테이지 목록은 전체 아이템 기준 (순서 유지)
  const stages = [...new Set(items.map((i) => i.stage))];

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
                  {sets.map((s) => (
                    <div key={s.id} className="f-set-row">
                      <div className="time">{s.time}</div>
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
