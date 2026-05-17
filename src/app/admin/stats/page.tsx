"use client";

import Link from "next/link";
import { useAuthState } from "@/app/api/auth";
import { useGetFestivals } from "@/app/api/festivals";
import type { FestivalStatus } from "@/app/api/festivals.type";

const STATUS_META: Record<
  FestivalStatus,
  { label: string; cls: string; color: string }
> = {
  LIVE: { label: "진행중", cls: "live", color: "var(--live)" },
  UPCOMING: { label: "예정", cls: "upcoming", color: "var(--upcoming)" },
  ENDED: { label: "종료", cls: "ended", color: "var(--ended)" },
};

export default function AdminStatsPage() {
  const { user } = useAuthState();
  const { data: festivals = [], isLoading } = useGetFestivals({
    size: 50,
    ownerUid: user?.uid,
  });

  const total = festivals.length;
  const totalParticipants = festivals.reduce((s, f) => s + f.participants, 0);
  const avgParticipants = total > 0 ? Math.round(totalParticipants / total) : 0;
  const maxParticipants = Math.max(...festivals.map((f) => f.participants), 1);

  const live = festivals.filter((f) => f.status === "LIVE");
  const upcoming = festivals.filter((f) => f.status === "UPCOMING");
  const ended = festivals.filter((f) => f.status === "ENDED");

  // 참여자 많은 순 정렬
  const byParticipants = [...festivals].sort(
    (a, b) => b.participants - a.participants,
  );

  return (
    <div style={{ padding: "24px 32px" }}>
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
        STATS / 통계
      </div>
      <div
        style={{
          fontFamily: "var(--display-font)",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        통계
      </div>

      {isLoading ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          불러오는 중…
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "전체 축제",
                value: String(total),
                sub: "등록된 축제 수",
              },
              {
                label: "누적 참여자",
                value: totalParticipants.toLocaleString(),
                sub: "전체 합산",
              },
              {
                label: "진행 중",
                value: String(live.length),
                sub: live[0]?.name ?? "없음",
                accent: "var(--live)",
              },
              {
                label: "평균 참여자",
                value: avgParticipants.toLocaleString(),
                sub: "축제당 평균",
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
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    marginTop: 6,
                    color: ("accent" in s ? s.accent : void 0) ?? "var(--fg)",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div
            style={{
              padding: 24,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              STATUS BREAKDOWN
            </div>
            {total === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                }}
              >
                등록된 축제가 없습니다.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  { ...STATUS_META.LIVE, count: live.length },
                  { ...STATUS_META.UPCOMING, count: upcoming.length },
                  { ...STATUS_META.ENDED, count: ended.length },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      className={`f-tag ${row.cls}`}
                      style={{
                        width: 56,
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {row.label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        borderRadius: 999,
                        background: "var(--surface-2)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(row.count / total) * 100}%`,
                          background: row.color,
                          borderRadius: 999,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--mono-font)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--fg)",
                        width: 28,
                        textAlign: "right",
                      }}
                    >
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Per-festival participants */}
          <div
            style={{
              padding: 24,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              PARTICIPANTS PER FESTIVAL
            </div>
            {byParticipants.length === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                }}
              >
                등록된 축제가 없습니다.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {byParticipants.map((fest) => (
                  <Link
                    key={fest.id}
                    href={`/admin/festivals/${fest.id}/basic`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                      onMouseEnter={(e) =>
                        ((
                          e.currentTarget.querySelector(
                            ".fest-name",
                          ) as HTMLElement
                        ).style.color = "var(--accent)")
                      }
                      onMouseLeave={(e) =>
                        ((
                          e.currentTarget.querySelector(
                            ".fest-name",
                          ) as HTMLElement
                        ).style.color = "var(--fg)")
                      }
                    >
                      <div
                        className="fest-name"
                        style={{
                          width: 180,
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--fg)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          transition: "color 0.12s",
                        }}
                      >
                        {fest.name}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          borderRadius: 999,
                          background: "var(--surface-2)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(fest.participants / maxParticipants) * 100}%`,
                            background: `linear-gradient(90deg, ${fest.colors[0]}, ${fest.colors[1]})`,
                            borderRadius: 999,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--mono-font)",
                          fontSize: 12,
                          color: "var(--muted)",
                          width: 70,
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {fest.participants.toLocaleString()}명
                      </span>
                      <span
                        className={`f-tag ${STATUS_META[fest.status].cls}`}
                        style={{ flexShrink: 0 }}
                      >
                        {STATUS_META[fest.status].label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 날짜 타임라인 */}
          <div
            style={{
              padding: 24,
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
                marginBottom: 16,
              }}
            >
              FESTIVAL TIMELINE
            </div>
            {festivals.length === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                }}
              >
                등록된 축제가 없습니다.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[...festivals]
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((fest) => {
                    const meta = STATUS_META[fest.status];
                    return (
                      <Link
                        key={fest.id}
                        href={`/admin/festivals/${fest.id}/basic`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          {/* 날짜 */}
                          <div
                            style={{
                              width: 130,
                              fontFamily: "var(--mono-font)",
                              fontSize: 11,
                              color: "var(--muted)",
                              flexShrink: 0,
                            }}
                          >
                            {fest.start} – {fest.end}
                          </div>
                          {/* 컬러 바 */}
                          <div
                            style={{
                              flex: 1,
                              height: 28,
                              borderRadius: 6,
                              background: `linear-gradient(90deg, ${fest.colors[0]}33, ${fest.colors[1]}33)`,
                              border: `1.5px solid ${fest.colors[0]}55`,
                              display: "flex",
                              alignItems: "center",
                              padding: "0 10px",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: meta.color,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--fg)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {fest.name}
                            </span>
                          </div>
                          <span
                            className={`f-tag ${meta.cls}`}
                            style={{ flexShrink: 0 }}
                          >
                            {meta.label}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
