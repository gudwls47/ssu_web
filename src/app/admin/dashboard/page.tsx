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

export default function DashboardPage() {
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
          fontSize: 15,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px" }}>
      <div
        style={{
          fontFamily: "var(--mono-font)",
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 6,
        }}
      >
        DASHBOARD / 현황
      </div>
      <div
        style={{
          fontFamily: "var(--display-font)",
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        대시보드
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "진행 중 축제",
            value: String(live.length),
            sub: live[0]?.name ?? "없음",
            accent: "var(--live)",
          },
          {
            label: "예정 축제",
            value: String(upcoming.length),
            sub: upcoming.length > 0 ? `${upcoming.length}개 예정됨` : "없음",
            accent: "var(--upcoming)",
          },
          {
            label: "누적 참여자",
            value: totalParticipants.toLocaleString(),
            sub: "전체 축제 합산",
            accent: null,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: 20,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 12,
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
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 6,
                color: s.accent ?? "var(--fg)",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Live festival highlight */}
      {live.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            LIVE NOW · 진행 중 축제
          </div>
          {live.map((fest) => {
            const [c0, c1, c2] = fest.colors;
            return (
              <Link
                key={fest.id}
                href={`/admin/festivals/${fest.id}/basic`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    borderRadius: 18,
                    background: `radial-gradient(140% 100% at 90% 0%, ${c0} 0%, ${c1} 45%, ${c2} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#fff",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.04) 14px 15px)",
                    }}
                  />
                  {fest.thumbnail && (
                    <img
                      src={fest.thumbnail}
                      alt=""
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.2,
                      }}
                    />
                  )}
                  <div style={{ position: "relative" }}>
                    <span
                      className="f-tag live"
                      style={{ marginBottom: 10, display: "inline-flex" }}
                    >
                      ● LIVE NOW
                    </span>
                    <div
                      style={{
                        fontFamily: "var(--display-font)",
                        fontSize: 30,
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        marginTop: 8,
                      }}
                    >
                      {fest.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono-font)",
                        fontSize: 14,
                        opacity: 0.8,
                        marginTop: 8,
                      }}
                    >
                      {fest.school} · {fmtRange(fest.start, fest.end)} ·{" "}
                      {fest.participants.toLocaleString()}명 참여 중
                    </div>
                  </div>
                  <div
                    style={{ position: "relative", fontSize: 24, opacity: 0.8 }}
                  >
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Upcoming festivals */}
      {upcoming.length > 0 && (
        <div>
          <div
            style={{
              fontFamily: "var(--mono-font)",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            UPCOMING · 예정 축제
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.map((fest) => (
              <Link
                key={fest.id}
                href={`/admin/festivals/${fest.id}/basic`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: `radial-gradient(120% 120% at 80% 0%, ${fest.colors[0]} 0%, ${fest.colors[1]} 50%, ${fest.colors[2]} 100%)`,
                      flexShrink: 0,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {fest.thumbnail && (
                      <img
                        src={fest.thumbnail}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--fg)",
                      }}
                    >
                      {fest.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono-font)",
                        fontSize: 13,
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      {fest.school} · {fmtRange(fest.start, fest.end)}
                    </div>
                  </div>
                  <span className={`f-tag ${STATUS_META[fest.status].cls}`}>
                    {STATUS_META[fest.status].en}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 축제가 하나도 없을 때 */}
      {festivals.length === 0 && (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 15,
            background: "var(--surface)",
            borderRadius: 14,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎪</div>
          아직 등록된 축제가 없습니다.
          <br />
          <Link
            href="/admin/festivals/new"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              marginTop: 8,
              display: "inline-block",
            }}
          >
            첫 축제 등록하기 →
          </Link>
        </div>
      )}
    </div>
  );
}
