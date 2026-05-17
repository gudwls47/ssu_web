"use client";

import { useState, useRef, type ReactNode, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/api/auth";
import { useCreateFestival } from "@/app/api/festivals";
import { imageToDataUrl } from "@/app/utils/imageToDataUrl";

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

export default function NewFestivalPage() {
  const router = useRouter();
  const { user } = useAuthState();
  const createFestival = useCreateFestival(user?.uid ?? "");

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [school, setSchool] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
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

  const handleSubmit = () => {
    if (!name || !school || !start || !end) return;
    if (!user?.uid) {
      // eslint-disable-next-line no-console
      console.error("[NewFestival] user uid is not available yet");
      return;
    }
    createFestival.mutate(
      { name, nameEn, school, start, end, tagline, description, thumbnail },
      {
        onSuccess: (created) => {
          router.push(`/admin/festivals/${created.id}/basic`);
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error("[NewFestival] 축제 등록 실패:", err);
        },
      },
    );
  };

  const isValid = Boolean(name && school && start && end && user?.uid);

  return (
    <div style={{ padding: "24px 32px", maxWidth: 900 }}>
      {/* Breadcrumb */}
      <Link
        href="/admin/festivals"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--mono-font)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          textDecoration: "none",
          marginBottom: 12,
        }}
      >
        ← 내 축제 / 새 축제 등록
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            fontFamily: "var(--display-font)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
          }}
        >
          새 축제 등록
        </div>
        <button
          className="f-btn accent"
          onClick={handleSubmit}
          disabled={!isValid || createFestival.isPending}
        >
          {createFestival.isPending ? "등록 중…" : "저장하고 계속 →"}
        </button>
      </div>

      {createFestival.isError && (
        <div
          style={{
            marginBottom: 16,
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(255,107,107,0.12)",
            border: "1px solid rgba(255,107,107,0.3)",
            color: "#FF6B6B",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          ⚠️ 등록 실패:{" "}
          {(createFestival.error as { message?: string })?.message ??
            "알 수 없는 오류"}
          <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
            브라우저 개발자 도구 콘솔(F12)에서 자세한 오류를 확인하세요.
          </div>
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="축제 제목" hint="공식 명칭">
            <input
              className="f-input"
              placeholder="예: 2026 숭실 대동제"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label="영문/표기명" hint="선택 · 배너·포스터 표기용">
            <input
              className="f-input"
              placeholder="예: DAEDONGJE"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
          </Field>

          <Field label="학교명" hint="필수">
            <input
              className="f-input"
              placeholder="예: 숭실대학교"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </Field>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="시작일">
              <input
                type="date"
                className="f-input"
                style={{ fontFamily: "var(--mono-font)" }}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
            <Field label="종료일">
              <input
                type="date"
                className="f-input"
                style={{ fontFamily: "var(--mono-font)" }}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </Field>
          </div>

          <Field label="태그라인" hint="포스터 카피, 30자 이내">
            <input
              className="f-input"
              placeholder="예: 숭실의 봄이 깨어나다"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </Field>

          <Field label="축제 소개">
            <textarea
              className="f-input"
              placeholder="축제에 대한 소개를 입력하세요."
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
        </div>

        {/* Right */}
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
                background: "var(--surface-2)",
                border: `1.5px dashed ${uploading ? "var(--accent)" : "var(--border)"}`,
                marginBottom: 8,
                display: "grid",
                placeItems: "center",
                cursor: uploading ? "default" : "pointer",
                position: "relative",
              }}
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="썸네일 미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    fontSize: 12,
                    fontFamily: "var(--mono-font)",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>
                    {uploading ? "⏳" : "📁"}
                  </div>
                  {uploading ? "업로드 중…" : "클릭하여 이미지 선택"}
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
                      fontSize: 12,
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
                  fontSize: 11,
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
                fontSize: 10,
                color: "var(--muted)",
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              파일 선택 시 자동 업로드 · URL 직접 입력도 가능
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "var(--surface-2)",
            }}
          >
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
              {start && end ? (
                new Date(start) > new Date() ? (
                  <span className="f-tag upcoming">UPCOMING</span>
                ) : new Date(end) >= new Date() ? (
                  <span className="f-tag live">LIVE NOW</span>
                ) : (
                  <span className="f-tag ended">ENDED</span>
                )
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    fontFamily: "var(--mono-font)",
                  }}
                >
                  날짜 입력 후 자동 계산
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "var(--surface-2)",
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
              저장 후 다음 단계
            </div>
            {["지도 핀 배치", "부스 정보 등록", "라인업 입력", "공지 작성"].map(
              (step, i) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 0",
                    fontSize: 12,
                    color: "var(--muted)",
                    borderBottom: i < 3 ? "1px solid var(--border)" : void 0,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "1.5px solid var(--border)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--mono-font)",
                      fontSize: 9,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
