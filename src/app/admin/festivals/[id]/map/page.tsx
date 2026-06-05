"use client";

import {
  useState,
  useRef,
  useEffect,
  type MouseEvent as ReactMouseEvent,
  type CSSProperties,
  useMemo,
} from "react";
import { useParams } from "next/navigation";
import { useGetBooths } from "@/app/api/booths";
import { useGetFestival, useUpdateFestival } from "@/app/api/festivals";
import { useGetMapPins, useSaveMapPins } from "@/app/api/mapPins";
import {
  MAP_W,
  MAP_H,
  MAP_TEMPLATES,
  isPresetId,
  getTemplate,
} from "@/app/components/MapTemplates";
import type {
  MapPinType,
  MapPinInput,
  BoothResponse,
} from "@/app/api/festivals.type";

const PIN_PALETTE = [
  { type: "stage" as const, label: "무대", emoji: "🎤", bg: "var(--fg)" },
  { type: "booth" as const, label: "부스", emoji: "🛒", bg: "var(--accent)" },
  {
    type: "toilet" as const,
    label: "화장실",
    emoji: "🚻",
    bg: "var(--upcoming)",
  },
  {
    type: "smoking" as const,
    label: "흡연구역",
    emoji: "🚬",
    bg: "var(--muted)",
  },
  {
    type: "info" as const,
    label: "안내소",
    emoji: "ℹ️",
    bg: "var(--accent-2)",
  },
] as const;

type LocalPin = MapPinInput & { _key: string; days: string[] };

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

function boothRunsOnDay(booth: BoothResponse, day: string | null): boolean {
  if (!day) return true;
  return booth.days.length === 0 || booth.days.includes(day);
}

// ── 이미지 선택 모달 ──────────────────────────────────────
function ImagePickerModal({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (val: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(
    isPresetId(current) ? current : "basic",
  );
  const [customUrl, setCustomUrl] = useState(
    !isPresetId(current) ? current : "",
  );
  const [mode, setMode] = useState<"preset" | "custom">(
    isPresetId(current) ? "preset" : "custom",
  );

  const handleApply = () => {
    if (mode === "custom") {
      onSelect(customUrl.trim());
    } else {
      onSelect(selected);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 640,
          maxHeight: "88vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
              }}
            >
              지도 레이아웃 선택
            </div>
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 2,
              }}
            >
              행사장 형태에 맞는 그리드 템플릿을 고르세요
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              all: "unset",
              cursor: "pointer",
              fontSize: 24,
              color: "var(--muted)",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* 탭 */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)",
          }}
        >
          {[
            { key: "preset" as const, label: "기본 템플릿" },
            { key: "custom" as const, label: "기타 (직접 URL)" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              style={{
                all: "unset",
                cursor: "pointer",
                padding: "8px 16px",
                fontSize: 15,
                fontWeight: mode === tab.key ? 700 : 500,
                color: mode === tab.key ? "var(--fg)" : "var(--muted)",
                borderBottom:
                  mode === tab.key
                    ? "2.5px solid var(--accent)"
                    : "2.5px solid transparent",
                marginBottom: -1,
                transition: "color 0.1s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === "preset" ? (
          /* 프리셋 그리드 */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {MAP_TEMPLATES.map((tmpl) => {
              const isActive = selected === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelected(tmpl.id)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    borderRadius: 12,
                    border: `2px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                    overflow: "hidden",
                    background: "var(--surface-2)",
                    transition: "border-color 0.12s",
                  }}
                >
                  {/* SVG 미리보기 */}
                  <div style={{ position: "relative" }}>
                    <svg
                      width="100%"
                      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                      style={{ display: "block" }}
                    >
                      {tmpl.render(MAP_W, MAP_H)}
                    </svg>
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                  {/* 라벨 */}
                  <div
                    style={{
                      padding: "8px 10px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--fg)",
                      }}
                    >
                      {tmpl.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono-font)",
                        fontSize: 12,
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      {tmpl.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* 커스텀 URL */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              실제 캠퍼스 지도 이미지 URL을 붙여넣으세요 (Imgur, Google Drive
              공유링크 등)
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="f-input"
                style={{ flex: 1 }}
                placeholder="https://..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
            {customUrl.trim() && (
              <div
                style={{
                  height: 200,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                <img
                  src={customUrl.trim()}
                  alt="미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="f-btn ghost" onClick={onClose}>
            취소
          </button>
          <button className="f-btn accent" onClick={handleApply}>
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────
export default function MapEditorPage() {
  const params = useParams<{ id: string }>();
  const festivalId = params.id;

  const { data: fest } = useGetFestival(festivalId);
  const { data: pinData, isLoading } = useGetMapPins(festivalId);
  const { data: booths = [] } = useGetBooths(festivalId);
  const saveMapPins = useSaveMapPins(festivalId);
  const updateFestival = useUpdateFestival(festivalId);

  const festivalDays = useMemo(
    () => (fest ? dateRange(fest.start, fest.end) : []),
    [fest?.start, fest?.end],
  );

  const [pins, setPins] = useState<LocalPin[]>([]);
  const [selectedType, setSelectedType] = useState<MapPinType>("booth");
  const [previewDay, setPreviewDay] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (festivalDays.length > 0 && !initializedRef.current) {
      setPreviewDay(festivalDays[0]);
      initializedRef.current = true;
    }
  }, [festivalDays]);

  const [mapValue, setMapValue] = useState("basic");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedPinKey, setSelectedPinKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pinListRef = useRef<HTMLDivElement>(null);
  const pinItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragRef = useRef<{ key: string; moved: boolean } | null>(null);
  const blockCanvasClickRef = useRef(false);

  useEffect(() => {
    if (fest?.mapImage != null && fest.mapImage !== "") {
      setMapValue(fest.mapImage);
    }
  }, [fest?.mapImage]);

  useEffect(() => {
    if (pinData) {
      setPins(
        pinData.map((p) => ({
          _key: p.id,
          type: p.type,
          label: p.label,
          x: p.x,
          y: p.y,
          boothIds: p.boothIds ?? [],
          days: p.days ?? [],
        })),
      );
    }
  }, [pinData]);

  const getPaletteItem = (type: MapPinType) =>
    PIN_PALETTE.find((p) => p.type === type)!;

  const handleCanvasClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (blockCanvasClickRef.current) {
      blockCanvasClickRef.current = false;
      return;
    }
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * MAP_W);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * MAP_H);
    const palItem = getPaletteItem(selectedType);
    const newKey = `new_${Date.now()}`;
    setPins((prev) => [
      ...prev,
      {
        _key: newKey,
        type: selectedType,
        label: palItem.label,
        x,
        y,
        boothIds: [],
        days: [],
      },
    ]);
    setSelectedPinKey(newKey);
    setTimeout(() => {
      pinItemRefs.current[newKey]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  const handlePinMouseDown = (e: ReactMouseEvent, key: string) => {
    e.stopPropagation();
    blockCanvasClickRef.current = true;
    dragRef.current = { key, moved: false };
    setSelectedPinKey(key);
    pinItemRefs.current[key]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const onMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      dragRef.current.moved = true;
      const x = Math.round(
        Math.max(
          0,
          Math.min(MAP_W, ((me.clientX - rect.left) / rect.width) * MAP_W),
        ),
      );
      const y = Math.round(
        Math.max(
          0,
          Math.min(MAP_H, ((me.clientY - rect.top) / rect.height) * MAP_H),
        ),
      );
      setPins((prev) => prev.map((p) => (p._key === key ? { ...p, x, y } : p)));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setTimeout(() => {
        dragRef.current = null;
      }, 50);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const removePin = (key: string) =>
    setPins((prev) => prev.filter((p) => p._key !== key));

  const updateLabel = (key: string, label: string) =>
    setPins((prev) => prev.map((p) => (p._key === key ? { ...p, label } : p)));

  const toggleBoothId = (pinKey: string, boothId: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p._key !== pinKey) return p;
        const ids = p.boothIds ?? [];
        const next = ids.includes(boothId)
          ? ids.filter((id) => id !== boothId)
          : [...ids, boothId];
        const firstName = booths.find((b) => b.id === next[0])?.name;
        return {
          ...p,
          boothIds: next,
          label: firstName ?? getPaletteItem("booth").label,
        };
      }),
    );
  };

  const toggleDay = (pinKey: string, day: string) => {
    setPins((prev) =>
      prev.map((p) => {
        if (p._key !== pinKey) return p;
        const days = p.days ?? [];
        const next = days.includes(day)
          ? days.filter((d) => d !== day)
          : [...days, day];
        return { ...p, days: next };
      }),
    );
  };

  const handleSave = () => {
    saveMapPins.mutate(
      pins.map(({ _key: _k, boothIds, days, ...rest }) => {
        const obj: MapPinInput = { ...rest };
        if (boothIds && boothIds.length > 0) obj.boothIds = boothIds;
        if (days && days.length > 0) obj.days = days;
        return obj;
      }),
    );
    if (mapValue !== (fest?.mapImage ?? "basic")) {
      updateFestival.mutate({ mapImage: mapValue });
    }
  };

  const handleReset = () => {
    if (pinData) {
      setPins(
        pinData.map((p) => ({
          _key: p.id,
          type: p.type,
          label: p.label,
          x: p.x,
          y: p.y,
          boothIds: p.boothIds ?? [],
          days: p.days ?? [],
        })),
      );
    } else {
      setPins([]);
    }
    setMapValue(fest?.mapImage || "basic");
  };

  const getPreviewLabel = (pin: LocalPin): string => {
    if (pin.type !== "booth" || !pin.boothIds?.length) return pin.label;
    const active = booths.filter(
      (b) => pin.boothIds!.includes(b.id) && boothRunsOnDay(b, previewDay),
    );
    if (active.length === 0) return pin.label;
    if (active.length === 1) return active[0].name;
    return `${active[0].name} 외 ${active.length - 1}개`;
  };

  if (isLoading) {
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

  const inputStyle: CSSProperties = {
    flex: 1,
    height: 28,
    padding: "0 8px",
    borderRadius: 6,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--fg)",
    fontSize: 14,
    fontFamily: "var(--body-font)",
    outline: "none",
    minWidth: 0,
  };

  const isCustomUrl = mapValue && !isPresetId(mapValue);
  const currentTemplate = isPresetId(mapValue)
    ? getTemplate(mapValue)
    : MAP_TEMPLATES[0];
  const imageLabel = isCustomUrl ? "커스텀 이미지" : currentTemplate.label;

  return (
    <>
      {showPicker && (
        <ImagePickerModal
          current={mapValue}
          onSelect={setMapValue}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {/* 캔버스 영역 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                지도 이미지 · MAP CANVAS
              </div>
              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                템플릿: <span style={{ color: "var(--fg)" }}>{imageLabel}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="f-btn sm ghost"
                onClick={() => setShowPicker(true)}
              >
                ↑ 이미지 변경
              </button>
              <button className="f-btn sm ghost" onClick={handleReset}>
                ↺ 리셋
              </button>
              <button
                className="f-btn sm accent"
                onClick={handleSave}
                disabled={saveMapPins.isPending}
              >
                {saveMapPins.isPending ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>

          {/* 날짜 미리보기 필터 */}
          {festivalDays.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                  color: "var(--muted)",
                  alignSelf: "center",
                  marginRight: 2,
                }}
              >
                미리보기:
              </span>
              <button
                className="f-chip"
                data-active={previewDay === null ? "true" : "false"}
                style={{ height: 28, padding: "0 10px", fontSize: 13 }}
                onClick={() => setPreviewDay(null)}
              >
                전체
              </button>
              {festivalDays.map((d, i) => {
                const date = new Date(d);
                return (
                  <button
                    key={d}
                    className="f-chip"
                    data-active={previewDay === d ? "true" : "false"}
                    style={{ height: 28, padding: "0 10px", fontSize: 13 }}
                    onClick={() => setPreviewDay(d)}
                  >
                    DAY {i + 1} · {date.getMonth() + 1}/{date.getDate()}
                  </button>
                );
              })}
            </div>
          )}

          {saveMapPins.isSuccess && (
            <div
              style={{
                marginBottom: 8,
                padding: "6px 12px",
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

          {/* 캔버스 */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{
              position: "relative",
              aspectRatio: "320 / 420",
              borderRadius: 14,
              overflow: "hidden",
              border: "1.5px solid var(--border)",
              cursor: "crosshair",
            }}
          >
            {/* 배경: 커스텀 이미지 or SVG 템플릿 */}
            {isCustomUrl ? (
              <>
                <img
                  src={mapValue}
                  alt="지도 배경"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.1)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                preserveAspectRatio="xMidYMid slice"
                style={{ display: "block", pointerEvents: "none" }}
              >
                {currentTemplate.render(MAP_W, MAP_H)}
              </svg>
            )}

            {/* 핀 */}
            {pins.map((pin) => {
              const pal = getPaletteItem(pin.type);
              const previewLabel = getPreviewLabel(pin);
              const isLinked =
                pin.type === "booth" && (pin.boothIds?.length ?? 0) > 0;
              const isSelected = selectedPinKey === pin._key;

              // 1. 핀 자체의 운영 날짜 — 오늘 해당 없으면 흐리게만 표시
              const pDays = pin.days || [];
              const inactivePinDay =
                previewDay && pDays.length > 0 && !pDays.includes(previewDay);

              // 2. 연결된 부스의 운영 날짜 — 오늘 활성 부스 없으면 흐리게만 표시
              const activeBooths =
                pin.type === "booth" && (pin.boothIds?.length ?? 0) > 0
                  ? booths.filter(
                      (b) =>
                        pin.boothIds!.includes(b.id) &&
                        boothRunsOnDay(b, previewDay),
                    )
                  : [];
              const inactiveBoothDay =
                previewDay &&
                pin.type === "booth" &&
                (pin.boothIds?.length ?? 0) > 0 &&
                activeBooths.length === 0;

              // 관리자 화면: 핀은 항상 표시 (비활성 날짜는 투명도로 구분)
              const isDimmed = inactivePinDay || inactiveBoothDay;

              return (
                <div
                  key={pin._key}
                  title={previewLabel}
                  onMouseDown={(e) => handlePinMouseDown(e, pin._key)}
                  style={{
                    position: "absolute",
                    left: `${(pin.x / MAP_W) * 100}%`,
                    top: `${(pin.y / MAP_H) * 100}%`,
                    transform: "translate(-50%, -100%)",
                    cursor: "grab",
                    zIndex: isSelected ? 10 : 2,
                    opacity: isDimmed ? 0.35 : 1,
                    filter: isDimmed ? "grayscale(0.4)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: isSelected ? 34 : 28,
                      height: isSelected ? 34 : 28,
                      borderRadius: "50% 50% 50% 0",
                      transform: "rotate(-45deg)",
                      background: pal.bg,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: isSelected
                        ? "0 4px 14px rgba(0,0,0,0.4)"
                        : "0 3px 8px rgba(0,0,0,0.25)",
                      border: isSelected
                        ? "3px solid #fff"
                        : isLinked
                          ? "2.5px solid #fff"
                          : "2px solid rgba(255,255,255,0.5)",
                      transition: "width 0.1s, height 0.1s",
                    }}
                  >
                    <span
                      style={{
                        transform: "rotate(45deg)",
                        fontSize: isSelected ? 14 : 12,
                      }}
                    >
                      {pal.emoji}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            클릭하여 핀을 배치하세요 · 현재 선택:{" "}
            <strong style={{ color: "var(--fg)" }}>
              {getPaletteItem(selectedType).emoji}{" "}
              {getPaletteItem(selectedType).label}
            </strong>
          </div>
        </div>

        {/* Right panel — 지도와 동일 높이, 내부 스크롤 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Type selector */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              핀 타입 선택
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {PIN_PALETTE.map((p) => (
                <button
                  key={p.type}
                  onClick={() => setSelectedType(p.type)}
                  style={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 9,
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
                      width: 24,
                      height: 24,
                      borderRadius: 7,
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
                  <div
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--fg)",
                    }}
                  >
                    {p.label}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--mono-font)",
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    {pins.filter((x) => x.type === p.type).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pin list — 남은 높이 채우고 내부 스크롤 */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                등록된 핀 ({pins.length})
              </span>
            </div>
            <div
              ref={pinListRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: 8,
              }}
            >
              {pins.map((pin) => {
                const pal = getPaletteItem(pin.type);
                const linkedIds = pin.boothIds ?? [];
                const isSelected = selectedPinKey === pin._key;
                return (
                  <div
                    key={pin._key}
                    ref={(el) => {
                      pinItemRefs.current[pin._key] = el;
                    }}
                    style={{
                      borderRadius: 10,
                      background: isSelected
                        ? "var(--faint)"
                        : "var(--surface-2)",
                      border: `1.5px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                      flexShrink: 0,
                      overflow: "hidden",
                      transition: "border-color 0.1s, background 0.1s",
                    }}
                  >
                    {/* 항상 보이는 헤더 */}
                    <div
                      onClick={() =>
                        setSelectedPinKey(isSelected ? null : pin._key)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: pal.bg,
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {pal.emoji}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--fg)",
                          flex: 1,
                        }}
                      >
                        {pal.label}
                      </span>
                      {linkedIds.length > 0 && (
                        <span
                          style={{
                            fontFamily: "var(--mono-font)",
                            fontSize: 11,
                            color: "var(--accent)",
                          }}
                        >
                          {linkedIds.length}개
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginLeft: 2,
                        }}
                      >
                        {isSelected ? "▲" : "▼"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePin(pin._key);
                        }}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          color: "var(--muted)",
                          fontSize: 16,
                          lineHeight: 1,
                          marginLeft: 4,
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* 선택된 경우만 펼침 */}
                    {isSelected && (
                      <div style={{ padding: "0 10px 10px" }}>
                        {/* 운영 날짜 선택 */}
                        <div style={{ marginBottom: 12 }}>
                          <div
                            style={{
                              fontFamily: "var(--mono-font)",
                              fontSize: 11,
                              color: "var(--muted)",
                              marginBottom: 4,
                            }}
                          >
                            운영 날짜 (미선택 시 전체 기간)
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 4,
                              flexWrap: "wrap",
                            }}
                          >
                            {festivalDays.map((d, i) => {
                              const checked = pin.days?.includes(d);
                              return (
                                <button
                                  key={d}
                                  onClick={() => toggleDay(pin._key, d)}
                                  className="f-chip"
                                  data-active={checked ? "true" : "false"}
                                  style={{
                                    height: 24,
                                    padding: "0 8px",
                                    fontSize: 11,
                                  }}
                                >
                                  D{i + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {pin.type === "booth" ? (
                          <div>
                            <div
                              style={{
                                fontFamily: "var(--mono-font)",
                                fontSize: 11,
                                color: "var(--muted)",
                                marginBottom: 4,
                              }}
                            >
                              연결할 부스 선택
                              {pin.days.length > 0 && (
                                <span
                                  style={{
                                    color: "var(--accent)",
                                    marginLeft: 4,
                                    fontSize: 11,
                                  }}
                                >
                                  (
                                  {pin.days
                                    .map((d) => {
                                      const i = festivalDays.indexOf(d);
                                      return i >= 0 ? `D${i + 1}` : d.slice(5);
                                    })
                                    .join("/")}{" "}
                                  해당 부스)
                                </span>
                              )}
                            </div>
                            {booths.length === 0 ? (
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "var(--muted)",
                                  fontFamily: "var(--mono-font)",
                                }}
                              >
                                등록된 부스가 없습니다
                              </div>
                            ) : (
                              (() => {
                                // 운영 날짜가 선택된 경우 해당 날짜에 운영하는 부스만 필터링
                                const filteredBooths =
                                  pin.days.length === 0
                                    ? booths
                                    : booths.filter((b) =>
                                        pin.days.some((d) =>
                                          boothRunsOnDay(b, d),
                                        ),
                                      );
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 3,
                                      maxHeight: 150,
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredBooths.length === 0 && (
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: "var(--muted)",
                                          fontFamily: "var(--mono-font)",
                                          padding: "4px 0",
                                        }}
                                      >
                                        선택한 날짜에 운영하는 부스가 없습니다
                                      </div>
                                    )}
                                    {filteredBooths.map((b) => {
                                      const checked = linkedIds.includes(b.id);
                                      const dayLabel =
                                        b.days.length === 0
                                          ? "전체"
                                          : b.days
                                              .map((d) => {
                                                const idx =
                                                  festivalDays.indexOf(d);
                                                return idx >= 0
                                                  ? `D${idx + 1}`
                                                  : d.slice(5);
                                              })
                                              .join("/");
                                      return (
                                        <label
                                          key={b.id}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            padding: "4px 6px",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            background: checked
                                              ? "rgba(255,30,122,0.08)"
                                              : "transparent",
                                            border: `1px solid ${checked ? "var(--accent)" : "transparent"}`,
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                              toggleBoothId(pin._key, b.id)
                                            }
                                            style={{
                                              accentColor: "var(--accent)",
                                              flexShrink: 0,
                                            }}
                                          />
                                          <div style={{ minWidth: 0, flex: 1 }}>
                                            <div
                                              style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "var(--fg)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {b.name}
                                            </div>
                                            <div
                                              style={{
                                                fontSize: 11,
                                                fontFamily: "var(--mono-font)",
                                                color: "var(--muted)",
                                              }}
                                            >
                                              {b.loc} · {dayLabel}
                                            </div>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                );
                              })()
                            )}
                            {linkedIds.length > 0 && (
                              <div
                                style={{
                                  marginTop: 5,
                                  fontFamily: "var(--mono-font)",
                                  fontSize: 12,
                                  color: "var(--accent)",
                                }}
                              >
                                ✓ {linkedIds.length}개 연결됨
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            style={inputStyle}
                            value={pin.label}
                            placeholder="라벨 입력"
                            onChange={(e) =>
                              updateLabel(pin._key, e.target.value)
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {pins.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: "var(--muted)",
                    fontFamily: "var(--mono-font)",
                    fontSize: 13,
                  }}
                >
                  지도를 클릭해 핀을 배치하세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
