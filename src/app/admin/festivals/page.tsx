"use client";

import Link from "next/link";
import { useAuthState } from "@/app/api/auth";
import { useGetFestivals } from "@/app/api/festivals";
import type { FestivalStatus } from "@/app/api/festivals.type";

const STATUS_META: Record<FestivalStatus, { cls: string; en: string }> = {
  LIVE: { cls: "live", en: "LIVE NOW" },
  UPCOMING: { cls: "upcoming", en: "UPCOMING" },
  ENDED: { cls: "ended", en: "ENDED" },
};

function fmtRange(start: string, end: string) {
  const [ys, ms, ds] = start.split("-");
  const [, me, de] = end.split("-");
  if (ms === me) return `${ys}.${ms}.${ds}–${de}`;
  return `${ys}.${ms}.${ds}–${me}.${de}`;
}

function StatusTag({ status }: { status: FestivalStatus }) {
  const meta = STATUS_META[status];
  return <span className={`f-tag ${meta.cls}`}>{meta.en}</span>;
}

function PosterThumb({
  colors,
  nameEn,
  thumbnail,
}: {
  colors: string[];
  nameEn: string;
  thumbnail?: string;
}) {
  const [c0, c1, c2] = colors;
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 10,
        background: `radial-gradient(120% 120% at 80% 0%, ${c0} 0%, ${c1} 50%, ${c2} 100%)`,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={nameEn}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.06) 6px 7px)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              position: "relative",
              textAlign: "center",
              padding: "0 4px",
            }}
          >
            {nameEn.split(" ")[0].slice(0, 5)}
          </span>
        </>
      )}
    </div>
  );
}

export default function AdminFestivalsPage() {
  const { user } = useAuthState();
  const { data: festivals = [], isLoading } = useGetFestivals({
    size: 50,
    ownerUid: user?.uid,
  });

  const live = festivals.filter((f) => f.status === "LIVE");
  const upcoming = festivals.filter((f) => f.status === "UPCOMING");
  const totalParticipants = festivals.reduce((s, f) => s + f.participants, 0);

  if (isLoading) {
    return (
      <div
        style={{
          padding: "24px 32px",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 4,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            FESTIVALS / 내가 개설한 축제
          </div>
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            내 축제{" "}
            <span
              style={{ color: "var(--muted)", fontSize: 22, fontWeight: 500 }}
            >
              {festivals.length}
            </span>
          </div>
        </div>
        <Link href="/admin/festivals/new" style={{ textDecoration: "none" }}>
          <button className="f-btn accent">＋ 새 축제 등록</button>
        </Link>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        {[
          {
            label: "진행중",
            value: String(live.length),
            sub: live.map((f) => f.nameEn).join(" · ") || "없음",
            accent: "var(--live)",
          },
          {
            label: "예정",
            value: String(upcoming.length),
            sub:
              upcoming.map((f) => f.nameEn.split(" ")[0]).join(" · ") || "없음",
            accent: "var(--upcoming)",
          },
          {
            label: "총 참여자",
            value: totalParticipants.toLocaleString(),
            sub: "누적 참여자 수",
            accent: null,
          },
          {
            label: "등록 축제",
            value: String(festivals.length),
            sub: "전체 축제 수",
            accent: null,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: 16,
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
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 4,
                color: s.accent ?? "var(--fg)",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 4,
                fontFamily: "var(--mono-font)",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: 14,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "76px 1fr 140px 130px 110px 140px 130px",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--mono-font)",
            fontSize: 10,
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            fontWeight: 500,
          }}
        >
          <span />
          <span>축제명</span>
          <span>기간</span>
          <span>상태</span>
          <span>참여자</span>
          <span>마지막 수정</span>
          <span />
        </div>

        {festivals.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
            }}
          >
            등록된 축제가 없습니다.
          </div>
        ) : (
          festivals.map((fest, i) => (
            <div
              key={fest.id}
              style={{
                display: "grid",
                gridTemplateColumns: "76px 1fr 140px 130px 110px 140px 130px",
                padding: "14px 18px",
                borderBottom:
                  i < festivals.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
            >
              <PosterThumb
                colors={fest.colors}
                nameEn={fest.nameEn}
                thumbnail={fest.thumbnail}
              />

              <div>
                <div
                  style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}
                >
                  {fest.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: 11,
                    color: "var(--muted)",
                    marginTop: 2,
                  }}
                >
                  {fest.school}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                  color: "var(--fg)",
                }}
              >
                {fmtRange(fest.start, fest.end)}
              </div>

              <div>
                <StatusTag status={fest.status} />
              </div>

              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 13,
                  color: "var(--fg)",
                }}
              >
                {fest.participants.toLocaleString()}
              </div>

              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                {new Date(fest.updatedAt.toDate()).toLocaleDateString("ko-KR")}
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <Link
                  href={`/festival/${fest.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <button className="f-btn ghost sm" style={{ width: 64 }}>
                    미리보기
                  </button>
                </Link>
                <Link
                  href={`/admin/festivals/${fest.id}/basic`}
                  style={{ textDecoration: "none" }}
                >
                  <button className="f-btn accent sm" style={{ width: 48 }}>
                    편집
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
