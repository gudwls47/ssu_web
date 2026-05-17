"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useGetFestival } from "@/app/api/festivals";
import type { FestivalStatus } from "@/app/api/festivals.type";

const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> = {
  LIVE: { cls: "live", en: "LIVE NOW" },
  UPCOMING: { cls: "upcoming", en: "UPCOMING" },
  ENDED: { cls: "ended", en: "ENDED" },
};

const SUB_TABS = [
  { id: "basic", label: "기본 정보", en: "BASIC" },
  { id: "booth", label: "부스", en: "BOOTH" },
  { id: "map", label: "지도", en: "MAP" },
  { id: "lineup", label: "라인업", en: "LINEUP" },
  { id: "notice", label: "공지", en: "NOTICE" },
] as const;

export default function FestivalEditLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: fest, isLoading } = useGetFestival(params.id);

  const activeTab =
    SUB_TABS.find((t) => pathname.endsWith(`/${t.id}`))?.id ?? "basic";

  if (isLoading || !fest) {
    return (
      <div
        style={{
          padding: "20px 32px",
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

  return (
    <div style={{ padding: "20px 32px" }}>
      {/* Breadcrumb */}
      <Link
        href="/admin/festivals"
        style={{
          fontFamily: "var(--mono-font)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 12,
        }}
      >
        ← 내 축제 / 편집
      </Link>

      {/* Festival header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Poster thumb */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: `radial-gradient(120% 120% at 80% 0%, ${c0} 0%, ${c1} 50%, ${c2} 100%)`,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.07) 6px 7px)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                position: "relative",
              }}
            >
              {fest.nameEn.split(" ")[0].slice(0, 5)}
            </span>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
                lineHeight: 1,
              }}
            >
              {fest.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
                fontFamily: "var(--mono-font)",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              {fest.start} – {fest.end} · {fest.school} ·{" "}
              <span className={`f-tag ${meta.cls}`}>{meta.en}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href={`/festival/${fest.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button className="f-btn ghost">미리보기 ↗</button>
          </Link>
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--border)",
          marginBottom: 24,
        }}
      >
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/admin/festivals/${fest.id}/${tab.id}`}
              style={{
                textDecoration: "none",
                padding: "10px 16px",
                borderBottom: isActive
                  ? "2.5px solid var(--accent)"
                  : "2.5px solid transparent",
                marginBottom: -1,
                color: isActive ? "var(--fg)" : "var(--muted)",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                transition: "color 0.12s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                {tab.en}
              </span>
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
