"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  isPresetId,
  getTemplate,
  MAP_W,
  MAP_H,
} from "@/app/components/MapTemplates";
import type {
  FestivalResponse,
  MapPinResponse,
  BoothResponse,
  MapPinType,
} from "@/app/api/festivals.type";
import { dateRange } from "./utils";

interface MapTabProps {
  fest: FestivalResponse;
  pins: MapPinResponse[];
  booths: BoothResponse[];
}

const PIN_META: Record<
  MapPinType,
  { emoji: string; color: string; label: string }
> = {
  stage: { emoji: "🎤", color: "var(--fg)", label: "무대" },
  booth: { emoji: "🛒", color: "var(--accent)", label: "부스" },
  toilet: { emoji: "🚻", color: "#5A6FCF", label: "화장실" },
  smoking: { emoji: "🚬", color: "#888", label: "흡연구역" },
  info: { emoji: "ℹ️", color: "var(--accent-2, #BDFF1E)", label: "안내소" },
};

function boothRunsOnDay(booth: BoothResponse, day: string | null): boolean {
  if (!day) return true;
  return booth.days.length === 0 || booth.days.includes(day);
}

export function MapTab({ fest, pins, booths }: MapTabProps) {
  const days = useMemo(
    () => dateRange(fest.start, fest.end),
    [fest.start, fest.end],
  );
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (days.length > 0 && !initializedRef.current) {
      setFilterDay(days[0]);
      initializedRef.current = true;
    }
  }, [days]);

  const [hovered, setHovered] = useState<string | null>(null);

  const getActiveBooothsForPin = (pin: MapPinResponse) => {
    if (!pin.boothIds?.length) return [];
    return booths.filter(
      (b) => pin.boothIds!.includes(b.id) && boothRunsOnDay(b, filterDay),
    );
  };

  const isCustomUrl = fest.mapImage && !isPresetId(fest.mapImage);

  return (
    <div>
      {/* DAY 필터 */}
      <div className="f-day-row">
        <button
          className="f-chip"
          data-active={filterDay === null ? "true" : "false"}
          onClick={() => setFilterDay(null)}
        >
          전체
        </button>
        {days.map((d, i) => {
          const date = new Date(d);
          const dow = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
          return (
            <button
              key={d}
              className="f-chip"
              data-active={filterDay === d ? "true" : "false"}
              onClick={() => setFilterDay(d)}
            >
              DAY {i + 1}
              <span style={{ opacity: 0.6, marginLeft: 4 }}>
                {date.getMonth() + 1}/{date.getDate()} {dow}
              </span>
            </button>
          );
        })}
      </div>

      <div className="f-map-wrap">
        {/* ── 지도 캔버스 ── */}
        <div className="f-map-canvas" style={{ position: "relative" }}>
          {/* 배경 */}
          {isCustomUrl ? (
            <img
              src={fest.mapImage}
              alt="지도"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "inherit",
              }}
            />
          ) : (
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              {getTemplate(fest.mapImage || "basic").render(MAP_W, MAP_H)}
            </svg>
          )}

          {/* ── 핀 HTML 오버레이 ── */}
          {pins.map((p) => {
            const activeBooths = getActiveBooothsForPin(p);
            const pDays = p.days || [];
            const isHiddenByPinDay =
              filterDay && pDays.length > 0 && !pDays.includes(filterDay);
            const isHiddenByBoothDay =
              filterDay &&
              p.type === "booth" &&
              (p.boothIds?.length ?? 0) > 0 &&
              activeBooths.length === 0;

            if (isHiddenByPinDay || isHiddenByBoothDay) return null;

            const isInactive =
              p.type === "booth" &&
              (p.boothIds?.length ?? 0) > 0 &&
              activeBooths.length === 0;

            const meta = PIN_META[p.type];
            const isHov = hovered === p.id;

            const displayLabel =
              activeBooths.length > 0
                ? activeBooths.length === 1
                  ? activeBooths[0].name
                  : `${activeBooths[0].name} 외 ${activeBooths.length - 1}`
                : p.label;

            return (
              <div
                key={p.id}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: `${(p.x / MAP_W) * 100}%`,
                  top: `${(p.y / MAP_H) * 100}%`,
                  transform: "translate(-50%, -100%)",
                  cursor: "pointer",
                  opacity: isInactive ? 0.3 : 1,
                  zIndex: isHov ? 10 : 2,
                }}
              >
                {/* 툴팁 */}
                {isHov && !isInactive && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 4px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--fg)",
                      color: "var(--bg)",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 6,
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 20,
                    }}
                  >
                    {displayLabel}
                  </div>
                )}

                {/* 테어드롭 핀 */}
                <div
                  style={{
                    width: isHov ? 34 : 28,
                    height: isHov ? 34 : 28,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    background: meta.color,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: isHov
                      ? "0 4px 14px rgba(0,0,0,0.4)"
                      : "0 3px 8px rgba(0,0,0,0.25)",
                    border: isHov
                      ? "3px solid #fff"
                      : "2px solid rgba(255,255,255,0.7)",
                    transition: "width 0.15s, height 0.15s, box-shadow 0.15s",
                  }}
                >
                  <span
                    style={{
                      transform: "rotate(45deg)",
                      fontSize: isHov ? 14 : 12,
                      lineHeight: 1,
                    }}
                  >
                    {meta.emoji}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 레전드 사이드바 ── */}
        <div>
          <h4
            style={{
              font: "500 11px/1 var(--mono-font)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              margin: "0 0 12px",
            }}
          >
            장소 정보
          </h4>

          {pins.length === 0 ? (
            <div
              style={{
                color: "var(--muted)",
                fontFamily: "var(--mono-font)",
                fontSize: 12,
              }}
            >
              등록된 핀이 없습니다.
            </div>
          ) : (
            <div className="f-legend-list">
              {pins.map((p) => {
                const activeBooths = getActiveBooothsForPin(p);
                const pDays = p.days || [];
                const isHiddenByPinDay =
                  filterDay && pDays.length > 0 && !pDays.includes(filterDay);
                const isHiddenByBoothDay =
                  filterDay &&
                  p.type === "booth" &&
                  (p.boothIds?.length ?? 0) > 0 &&
                  activeBooths.length === 0;

                if (isHiddenByPinDay || isHiddenByBoothDay) return null;

                const isInactive =
                  p.type === "booth" &&
                  (p.boothIds?.length ?? 0) > 0 &&
                  activeBooths.length === 0;

                const meta = PIN_META[p.type];

                return (
                  <div
                    key={p.id}
                    className="f-legend-row"
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      opacity: isInactive ? 0.35 : 1,
                      background:
                        hovered === p.id ? "var(--faint)" : "transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    {/* 테어드롭 미니 핀 */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50% 50% 50% 0",
                          transform: "rotate(-45deg)",
                          background: meta.color,
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          border: "1.5px solid rgba(255,255,255,0.6)",
                        }}
                      >
                        <span
                          style={{ transform: "rotate(45deg)", fontSize: 10 }}
                        >
                          {meta.emoji}
                        </span>
                      </div>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      {activeBooths.length > 0 ? (
                        activeBooths.map((b) => (
                          <div key={b.id} style={{ marginBottom: 4 }}>
                            <div
                              style={{ font: "600 14px/1.2 var(--body-font)" }}
                            >
                              {b.name}
                            </div>
                            <div
                              style={{
                                font: "500 11px/1.5 var(--mono-font)",
                                color: "var(--muted)",
                                marginTop: 2,
                              }}
                            >
                              {b.dept} · {b.loc}
                              {b.schedule ? ` · ${b.schedule}` : ""}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div
                            style={{ font: "600 14px/1.2 var(--body-font)" }}
                          >
                            {p.label}
                          </div>
                          <div
                            style={{
                              font: "500 11px/1 var(--mono-font)",
                              color: "var(--muted)",
                              marginTop: 3,
                            }}
                          >
                            {isInactive ? "이 날짜 미운영" : meta.label}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
