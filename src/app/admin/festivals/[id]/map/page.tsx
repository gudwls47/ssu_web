"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { MAP_PINS, type MapPin } from "@/app/admin/_mock/data";

const PIN_PALETTE = [
  { type: "stage" as const, label: "무대", emoji: "🎤", bg: "var(--fg)" },
  { type: "booth" as const, label: "부스", emoji: "🛒", bg: "var(--accent)" },
  { type: "toilet" as const, label: "화장실", emoji: "🚻", bg: "var(--upcoming)" },
  { type: "smoking" as const, label: "흡연구역", emoji: "🚬", bg: "var(--muted)" },
  { type: "info" as const, label: "안내소", emoji: "ℹ️", bg: "var(--accent-2)" },
] as const;

const MAP_W = 320;
const MAP_H = 420;

export default function MapEditorPage() {
  useParams<{ id: string }>();
  const [pins, setPins] = useState<MapPin[]>(MAP_PINS);
  const [selectedType, setSelectedType] = useState<MapPin["type"]>("booth");
  const canvasRef = useRef<HTMLDivElement>(null);

  const getPaletteItem = (type: MapPin["type"]) =>
    PIN_PALETTE.find((p) => p.type === type)!;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * MAP_W);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * MAP_H);
    const palItem = getPaletteItem(selectedType);
    setPins((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        type: selectedType,
        label: palItem.label,
        x,
        y,
      },
    ]);
  };

  const removePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
      {/* Canvas */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            지도 이미지 · MAP CANVAS
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="f-btn sm ghost">↑ 이미지 변경</button>
            <button
              className="f-btn sm ghost"
              onClick={() => setPins(MAP_PINS)}
            >
              ↺ 리셋
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            position: "relative",
            height: 480,
            borderRadius: 14,
            overflow: "hidden",
            background: "var(--surface-2)",
            border: "1.5px dashed var(--border)",
            cursor: "crosshair",
          }}
        >
          {/* SVG map illustration */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid slice"
            style={{ display: "block", pointerEvents: "none" }}
          >
            <rect width={MAP_W} height={MAP_H} fill="var(--surface-2)" />
            <rect
              x="40"
              y="40"
              width="240"
              height="340"
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth="1.5"
              rx="14"
            />
            {/* Buildings */}
            <rect x="20" y="60" width="50" height="80" fill="var(--faint)" rx="4" />
            <rect x="20" y="220" width="60" height="90" fill="var(--faint)" rx="4" />
            <rect x="240" y="60" width="60" height="70" fill="var(--faint)" rx="4" />
            <rect x="245" y="220" width="55" height="100" fill="var(--faint)" rx="4" />
            <rect x="120" y="20" width="80" height="22" fill="var(--faint)" rx="4" />
            <rect x="100" y="380" width="120" height="22" fill="var(--faint)" rx="4" />
            {/* Stage zone */}
            <rect x="100" y="80" width="120" height="100" fill="var(--accent)" opacity="0.1" rx="8" />
            <text
              x="160"
              y="135"
              textAnchor="middle"
              fontSize="9"
              fill="var(--muted)"
              fontFamily="var(--mono-font)"
            >
              MAIN STAGE
            </text>
            {/* Grid overlay */}
            <g stroke="var(--border)" strokeWidth="0.5" opacity="0.4">
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={MAP_H} />
              ))}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 40} x2={MAP_W} y2={i * 40} />
              ))}
            </g>
          </svg>

          {/* Placed pins */}
          {pins.map((pin) => {
            const pal = getPaletteItem(pin.type);
            return (
              <div
                key={pin.id}
                style={{
                  position: "absolute",
                  left: `${(pin.x / MAP_W) * 100}%`,
                  top: `${(pin.y / MAP_H) * 100}%`,
                  transform: "translate(-50%, -100%)",
                  cursor: "grab",
                  zIndex: 2,
                }}
                title={pin.label}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    background: pal.bg,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  <span style={{ transform: "rotate(45deg)", fontSize: 12 }}>
                    {pal.emoji}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--mono-font)",
            fontSize: 10,
            color: "var(--muted)",
          }}
        >
          클릭하여 핀을 배치하세요 · 현재 선택:{" "}
          <strong style={{ color: "var(--fg)" }}>
            {getPaletteItem(selectedType).emoji} {getPaletteItem(selectedType).label}
          </strong>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Type selector */}
        <div
          style={{
            padding: 14,
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            핀 타입 선택
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PIN_PALETTE.map((p) => (
              <button
                key={p.type}
                onClick={() => setSelectedType(p.type)}
                style={{
                  all: "unset",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background:
                    selectedType === p.type
                      ? "var(--faint)"
                      : "var(--surface-2)",
                  cursor: "pointer",
                  border:
                    selectedType === p.type
                      ? "1.5px solid var(--accent)"
                      : "1.5px solid transparent",
                  transition: "border-color 0.1s, background 0.1s",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: p.bg,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {p.emoji}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
                  {p.label}
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {pins.filter((x) => x.type === p.type).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pin list */}
        <div
          style={{
            padding: 14,
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            등록된 핀 ({pins.length})
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 280,
              overflowY: "auto",
            }}
          >
            {pins.map((pin) => {
              const pal = getPaletteItem(pin.type);
              return (
                <div
                  key={pin.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "var(--surface-2)",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: pal.bg,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      flexShrink: 0,
                    }}
                  >
                    {pal.emoji}
                  </div>
                  <span
                    style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--fg)" }}
                  >
                    {pin.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--mono-font)",
                      fontSize: 9,
                      color: "var(--muted)",
                    }}
                  >
                    {pin.x},{pin.y}
                  </span>
                  <button
                    onClick={() => removePin(pin.id)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      color: "var(--muted)",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
