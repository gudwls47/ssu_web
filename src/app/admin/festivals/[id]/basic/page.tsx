"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FESTIVALS, STATUS_META } from "@/app/admin/_mock/data";

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
  const fest = FESTIVALS.find((f) => f.id === params.id) ?? FESTIVALS[0];
  const [c0, c1, c2] = fest.colors;
  const meta = STATUS_META[fest.status];

  const [name, setName] = useState(fest.name);
  const [en, setEn] = useState(fest.en);
  const [start, setStart] = useState(fest.start);
  const [end, setEnd] = useState(fest.end);
  const [tagline, setTagline] = useState(fest.tagline);
  const [description, setDescription] = useState(
    `${fest.school}의 봄을 알리는 사흘. 메인 무대 라인업과 함께 학과별 부스, 굿즈샵, 사주 카페 등 캠퍼스 전체가 무대가 됩니다.`,
  );

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
            value={en}
            onChange={(e) => setEn(e.target.value)}
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
          <div
            style={{
              height: 200,
              borderRadius: 14,
              background: `radial-gradient(120% 120% at 80% 0%, ${c0} 0%, ${c1} 50%, ${c2} 100%)`,
              position: "relative",
              overflow: "hidden",
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
                {en || fest.en}
              </div>
            </div>
          </div>
          <button
            className="f-btn ghost"
            style={{ width: "100%", marginTop: 8 }}
          >
            이미지 변경 ↑
          </button>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 6,
            }}
          >
            권장 1080 × 1350 · 5MB 이하
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
