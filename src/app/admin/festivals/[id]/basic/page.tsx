"use client";

import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type ChangeEvent,
} from "react";
import { useParams } from "next/navigation";
import { useGetFestival, useUpdateFestival } from "@/app/api/festivals";
import { imageToDataUrl } from "@/app/utils/imageToDataUrl";
import type { FestivalStatus } from "@/app/api/festivals.type";

const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> = {
  LIVE: { cls: "live", en: "LIVE NOW" },
  UPCOMING: { cls: "upcoming", en: "UPCOMING" },
  ENDED: { cls: "ended", en: "ENDED" },
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "block" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>
          {label}
        </span>
        {hint && (
          <span
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}

export default function BasicInfoPage() {
  const params = useParams<{ id: string }>();
  const { data: fest, isLoading } = useGetFestival(params.id);
  const update = useUpdateFestival(params.id);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await imageToDataUrl(file);
      setThumbnail(url);
    } catch (err) {
      setUploadError((err as Error).message ?? "업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (fest) {
      setName(fest.name);
      setNameEn(fest.nameEn);
      setStart(fest.start);
      setEnd(fest.end);
      setTagline(fest.tagline ?? "");
      setDescription(fest.description ?? "");
      setThumbnail(fest.thumbnail ?? "");
      setAddress(fest.address ?? "");
      setLat(fest.lat);
      setLng(fest.lng);
    }
  }, [fest]);

  const handleGeocode = async () => {
    if (!address.trim()) return;
    setGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(
        `/api/geocode?query=${encodeURIComponent(address)}`,
      );
      const json = await res.json();
      if (json.lat && json.lng) {
        setLat(json.lat);
        setLng(json.lng);
        // 전체 주소로 업데이트해 동/로 검색이 가능하도록 함
        if (json.displayName) setAddress(json.displayName);
      } else {
        setGeocodeError("주소를 찾을 수 없습니다. 더 구체적으로 입력해보세요.");
      }
    } catch {
      setGeocodeError("좌표 검색 중 오류가 발생했습니다.");
    } finally {
      setGeocoding(false);
    }
  };

  if (isLoading || !fest) {
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

  const [c0, c1, c2] = fest.colors;
  const meta = STATUS_META[fest.status];

  const handleSave = () => {
    update.mutate({
      name,
      nameEn,
      start,
      end,
      tagline,
      description,
      thumbnail,
      address,
      lat,
      lng,
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
      {/* Left — form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="축제 제목" hint="공식 명칭">
          <input
            className="f-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="영문/표기명" hint="배너 등 디스플레이용">
          <input
            className="f-input"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </Field>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Field label="시작일">
            <input
              type="date"
              className="f-input"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ fontFamily: "var(--mono-font)" }}
            />
          </Field>
          <Field label="종료일">
            <input
              type="date"
              className="f-input"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              style={{ fontFamily: "var(--mono-font)" }}
            />
          </Field>
        </div>

        <Field label="축제 장소 주소">
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="f-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 서울특별시 동작구 상도로 369 숭실대학교"
              onKeyDown={(e) => e.key === "Enter" && handleGeocode()}
              style={{ flex: 1 }}
            />
            <button
              className="f-btn ghost"
              onClick={handleGeocode}
              disabled={geocoding || !address.trim()}
              style={{ flexShrink: 0, whiteSpace: "nowrap" }}
            >
              {geocoding ? "검색 중…" : "좌표 검색"}
            </button>
          </div>
          {geocodeError && (
            <div
              style={{
                fontSize: 13,
                color: "#FF6B6B",
                fontFamily: "var(--mono-font)",
                marginTop: 4,
              }}
            >
              ⚠️ {geocodeError}
            </div>
          )}
          {lat && lng && (
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                fontFamily: "var(--mono-font)",
                marginTop: 4,
              }}
            >
              ✓ {lat.toFixed(5)}, {lng.toFixed(5)}
            </div>
          )}
        </Field>

        <Field label="태그라인" hint="포스터 카피">
          <input
            className="f-input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </Field>

        <Field label="축제 소개">
          <textarea
            className="f-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              height: 140,
              padding: 14,
              font: "400 14px/1.6 var(--body-font)",
              resize: "vertical",
            }}
          />
        </Field>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="f-btn accent"
            onClick={handleSave}
            disabled={update.isPending}
          >
            {update.isPending ? "저장 중…" : "변경사항 저장"}
          </button>
          {update.isSuccess && (
            <span
              style={{
                fontSize: 14,
                color: "var(--live)",
                fontFamily: "var(--mono-font)",
              }}
            >
              저장됨 ✓
            </span>
          )}
          {update.isError && (
            <span
              style={{
                fontSize: 14,
                color: "#FF6B6B",
                fontFamily: "var(--mono-font)",
              }}
            >
              저장 실패
            </span>
          )}
        </div>
      </div>

      {/* Right — thumbnail + meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            썸네일 이미지
          </div>
          {/* 숨겨진 파일 인풋 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* 미리보기 + 업로드 클릭 */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              height: 200,
              borderRadius: 14,
              overflow: "hidden",
              marginBottom: 8,
              position: "relative",
              cursor: uploading ? "default" : "pointer",
              border: `1.5px dashed ${uploading ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="썸네일 미리보기"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : uploading ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--surface-2)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    fontSize: 14,
                    fontFamily: "var(--mono-font)",
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 6 }}>⏳</div>
                  업로드 중…
                </div>
              </div>
            ) : (
              /* 썸네일 없을 때: 색상 그라디언트 */
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(120% 120% at 80% 0%, ${c0} 0%, ${c1} 50%, ${c2} 100%)`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent 0 12px, rgba(255,255,255,0.06) 12px 13px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: 22, color: "rgba(255,255,255,0.8)" }}>
                    📁
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--mono-font)",
                    }}
                  >
                    클릭하여 이미지 선택
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    left: 14,
                    color: "#fff",
                    fontFamily: "var(--display-font)",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {nameEn || fest.nameEn}
                </div>
              </div>
            )}
            {thumbnail && !uploading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = "1";
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = "0";
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(0,0,0,0)";
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: "var(--mono-font)",
                    fontWeight: 600,
                  }}
                >
                  클릭하여 변경
                </span>
              </div>
            )}
          </div>

          {uploadError && (
            <div
              style={{
                fontSize: 13,
                color: "#FF6B6B",
                fontFamily: "var(--mono-font)",
                marginBottom: 6,
              }}
            >
              ⚠️ {uploadError}
            </div>
          )}

          {/* URL 직접 입력 (선택) */}
          <input
            className="f-input"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="또는 이미지 URL 직접 붙여넣기"
          />
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            파일 선택 시 자동 업로드 · URL 직접 입력도 가능
          </div>
        </div>

        {/* Status + participants */}
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: "var(--surface-2)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
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
                marginBottom: 6,
              }}
            >
              STATUS
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={`f-tag ${meta.cls}`}>{meta.en}</span>
              <span style={{ fontSize: 14, color: "var(--muted)" }}>
                날짜에 따라 자동 갱신
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 4,
              }}
            >
              참여자
            </div>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
              }}
            >
              {fest.participants.toLocaleString()}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "var(--body-font)",
                  color: "var(--muted)",
                  marginLeft: 4,
                }}
              >
                명
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
