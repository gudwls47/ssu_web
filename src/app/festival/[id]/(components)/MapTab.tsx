"use client";

import { useState, useMemo } from "react";
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

/** 부스가 특정 날짜에 운영하는지 확인 (days[] 비어있으면 전체 기간) */
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
  const [hovered, setHovered] = useState<string | null>(null);

  const pinColor: Record<MapPinType, string> = {
    stage: "var(--accent)",
    booth: "var(--upcoming)",
    toilet: "#5A6FCF",
    smoking: "#888",
    info: "var(--fg)",
  };

  const pinLabel = (type: MapPinType) => {
    if (type === "stage") return "♪";
    if (type === "booth") return "B";
    if (type === "toilet") return "W";
    if (type === "smoking") return "S";
    return "i";
  };

  /** 한글/전각 문자 너비를 고려한 툴팁 박스 너비 계산 */
  const tooltipWidth = (text: string) => {
    let w = 0;
    for (const ch of text) {
      const code = ch.charCodeAt(0);
      // 한글 음절(AC00-D7A3), 한글 자모(3131-318E), CJK 등 전각 문자
      if (
        (code >= 0xac00 && code <= 0xd7a3) ||
        (code >= 0x3131 && code <= 0x318e) ||
        (code >= 0x4e00 && code <= 0x9fff)
      ) {
        w += 11; // 한글은 fontSize 11 기준 ~11px
      } else {
        w += 7; // 영문/숫자는 ~7px
      }
    }
    return w + 18; // 좌우 패딩
  };

  /** 핀에 연결된 부스 중 선택된 날짜에 운영하는 것 */
  const getActiveBooothsForPin = (pin: MapPinResponse) => {
    if (!pin.boothIds?.length) return [];
    return booths.filter(
      (b) => pin.boothIds!.includes(b.id) && boothRunsOnDay(b, filterDay),
    );
  };

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
        <div className="f-map-canvas">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 배경: 선택된 템플릿 또는 커스텀 이미지 */}
            {fest.mapImage && !isPresetId(fest.mapImage) ? (
              <image
                href={fest.mapImage}
                x="0"
                y="0"
                width={MAP_W}
                height={MAP_H}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              getTemplate(fest.mapImage || "basic").render(MAP_W, MAP_H)
            )}

            {pins
              .filter((p) => p.type === "stage")
              .map((p) => (
                <rect
                  key={`stage-bg-${p.id}`}
                  x={p.x - 28}
                  y={p.y - 14}
                  width="56"
                  height="28"
                  rx="4"
                  fill="var(--accent)"
                  fillOpacity="0.18"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
              ))}

            {pins.map((p) => {
              const activeBooths = getActiveBooothsForPin(p);
              const displayLabel =
                activeBooths.length > 0
                  ? activeBooths.length === 1
                    ? activeBooths[0].name
                    : `${activeBooths[0].name} 외 ${activeBooths.length - 1}`
                  : p.label;
              // 이 날짜에 부스가 없는 booth 핀은 흐리게
              const isInactive =
                p.type === "booth" &&
                (p.boothIds?.length ?? 0) > 0 &&
                activeBooths.length === 0;
              return (
                <g
                  key={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer", opacity: isInactive ? 0.3 : 1 }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="11"
                    fill={pinColor[p.type]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x}
                    y={p.y + 3.5}
                    fontSize="9"
                    textAnchor="middle"
                    fill="#fff"
                    fontWeight="700"
                    fontFamily="var(--mono-font)"
                  >
                    {pinLabel(p.type)}
                  </text>
                  {hovered === p.id && !isInactive && (
                    <g>
                      <rect
                        x={p.x + 14}
                        y={p.y - 13}
                        width={tooltipWidth(displayLabel)}
                        height="22"
                        rx="4"
                        fill="var(--fg)"
                      />
                      <text
                        x={p.x + 23}
                        y={p.y + 2}
                        fontSize="11"
                        fill="var(--bg)"
                        fontWeight="600"
                        fontFamily="var(--body-font)"
                      >
                        {displayLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

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
                const isInactive =
                  p.type === "booth" &&
                  (p.boothIds?.length ?? 0) > 0 &&
                  activeBooths.length === 0;
                return (
                  <div
                    key={p.id}
                    className="f-legend-row"
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ opacity: isInactive ? 0.35 : 1 }}
                  >
                    <div
                      className="pin"
                      style={{ background: pinColor[p.type] }}
                    >
                      {pinLabel(p.type)}
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
                            {isInactive
                              ? "이 날짜 미운영"
                              : p.type.toUpperCase()}
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
