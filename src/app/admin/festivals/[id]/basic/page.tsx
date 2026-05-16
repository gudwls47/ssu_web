"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGetFestival, useUpdateFestival } from "@/app/api/festivals";
import type { FestivalStatus } from "@/app/api/festivals.type";
import { uploadImage } from "@/app/utils/firebase/uploadImage";

const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> = {
  LIVE:     { cls: "live",     en: "LIVE NOW" },
  UPCOMING: { cls: "upcoming", en: "UPCOMING" },
  ENDED:    { cls: "ended",    en: "ENDED"    },
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
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
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>
          {label}
        </span>
        {hint && (
          <span
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (fest) {
      setName(fest.name);
      setNameEn(fest.nameEn);
      setStart(fest.start);
      setEnd(fest.end);
      setTagline(fest.tagline ?? "");
      setDescription(fest.description ?? "");
      setThumbnail(fest.thumbnail ?? "");
    }
  }, [fest]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "festivals/thumbnails");
      setThumbnail(url);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했어요. Firebase Storage 규칙을 확인해주세요.");
    } finally {
      setUploading(false);
    }
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

  const [c0, c1, c2] = fest.colors;
  const meta = STATUS_META[fest.status];

  const handleSave = () => {
    update.mutate({ name, nameEn, start, end, tagline, description, thumbnail });
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                fontSize: 12,
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
                fontSize: 12,
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
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 8,
            }}
          >
            썸네일 이미지
          </div>
          {/* 숨긴 파일 인풋 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {thumbnail ? (
            /* 업로드된 이미지 미리보기 */
            <div
              style={{
                height: 200,
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt="썸네일"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                  display: "grid",
                  placeItems: "center",
                  opacity: 0,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.opacity = "1")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.opacity = "0")
                }
              >
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
                  클릭하여 변경
                </span>
              </div>
            </div>
          ) : (
            /* 업로드 전: 색상 그라디언트 + 클릭 유도 */
            <div
              onClick={handleImageClick}
              style={{
                height: 200,
                borderRadius: 14,
                background: `radial-gradient(120% 120% at 80% 0%, ${c0} 0%, ${c1} 50%, ${c2} 100%)`,
                position: "relative",
                overflow: "hidden",
                cursor: uploading ? "wait" : "pointer",
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
              {uploading ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontFamily: "var(--mono-font)",
                    fontSize: 13,
                  }}
                >
                  업로드 중…
                </div>
              ) : (
                <>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 14,
                      left: 14,
                      color: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--display-font)",
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {nameEn || fest.nameEn}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      fontSize: 11,
                      fontFamily: "var(--mono-font)",
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    ↑ 클릭하여 업로드
                  </div>
                </>
              )}
            </div>
          )}

          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 6,
            }}
          >
            권장 1080 × 1350 · 5MB 이하 · JPG, PNG, WEBP
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
                fontSize: 10,
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
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                날짜에 따라 자동 갱신
              </span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 10,
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
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
              }}
            >
              {fest.participants.toLocaleString()}
              <span
                style={{
                  fontSize: 13,
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
