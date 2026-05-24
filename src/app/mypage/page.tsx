"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { useAuthState, logOut } from "@/app/api/auth";
import { useGetMyFestivals, useGetMyComments } from "@/app/api/userFestivals";
import type { CommentTag } from "@/app/api/festivals.type";

// 날짜 기반 상태 계산
function deriveStatus(start: string, end: string) {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  e.setHours(23, 59, 59);
  if (now < s) return "UPCOMING" as const;
  if (now > e) return "ENDED" as const;
  return "LIVE" as const;
}

const STATUS_META = {
  LIVE: { label: "진행 중", color: "#FF1E7A" },
  UPCOMING: { label: "예정", color: "#2563EB" },
  ENDED: { label: "종료", color: "#888" },
};

const TAG_COLOR: Record<CommentTag, string> = {
  라인업: "#FF1E7A",
  지도: "#2563EB",
  부스: "#16A34A",
  공지: "#D97706",
};

export default function MyPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuthState();
  const { data: myFestivals = [], isLoading: festLoading } = useGetMyFestivals(
    user?.uid,
  );
  const { data: myComments = [], isLoading: commLoading } = useGetMyComments(
    user?.uid,
  );

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (profile?.role === "admin") {
      router.replace("/admin");
    }
  }, [loading, user, profile, router]);

  if (loading) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        로딩 중…
      </div>
    );
  }

  // 로딩 완료됐는데 user/profile 없으면 리디렉트 처리 대기
  if (!user || !profile) {
    return null;
  }

  const initial = profile.displayName[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 60px" }}>
      <h1
        style={{
          font: "700 24px/1 var(--display-font)",
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          marginBottom: 28,
        }}
      >
        마이페이지
      </h1>

      {/* ── 회원 정보 ── */}
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <p
          style={{
            font: "600 11px/1 var(--mono-font)",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          회원 정보
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                font: "700 17px/1 var(--display-font)",
                color: "var(--fg)",
                marginBottom: 5,
              }}
            >
              {profile.displayName}
            </div>
            <div
              style={{
                font: "400 13px/1 var(--mono-font)",
                color: "var(--muted)",
              }}
            >
              {profile.email}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                background: "var(--faint)",
                color: "var(--accent)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              일반 사용자
            </span>
            <button
              onClick={logOut}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--muted)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
      </section>

      {/* ── 내가 참여한 축제 ── */}
      <section style={{ marginBottom: 28 }}>
        <p
          style={{
            font: "600 11px/1 var(--mono-font)",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          내가 참여한 축제{" "}
          <span style={{ color: "var(--accent)" }}>{myFestivals.length}</span>
        </p>

        {festLoading ? (
          <div
            style={{
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
            }}
          >
            로딩 중…
          </div>
        ) : myFestivals.length === 0 ? (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
              border: "1px dashed var(--border)",
              borderRadius: 14,
            }}
          >
            아직 참여한 축제가 없어요.{" "}
            <Link
              href="/"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              축제 둘러보기 →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myFestivals.map((f) => {
              const status = deriveStatus(f.start, f.end);
              const sm = STATUS_META[status];
              return (
                <Link
                  key={f.festivalId}
                  href={`/festival/${f.festivalId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  >
                    {f.thumbnail ? (
                      <img
                        src={f.thumbnail}
                        alt={f.name}
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 10,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 10,
                          background: "var(--faint)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          font: "600 15px/1.2 var(--body-font)",
                          color: "var(--fg)",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {f.name}
                      </div>
                      <div
                        style={{
                          font: "400 12px/1 var(--mono-font)",
                          color: "var(--muted)",
                        }}
                      >
                        {f.school} · {f.start} ~ {f.end}
                      </div>
                    </div>
                    <span
                      style={{
                        flexShrink: 0,
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${sm.color}18`,
                        color: sm.color,
                        border: `1px solid ${sm.color}40`,
                      }}
                    >
                      {sm.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 내가 남긴 톡 ── */}
      <section>
        <p
          style={{
            font: "600 11px/1 var(--mono-font)",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          내가 남긴 톡{" "}
          <span style={{ color: "var(--accent)" }}>{myComments.length}</span>
        </p>

        {commLoading ? (
          <div
            style={{
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
            }}
          >
            로딩 중…
          </div>
        ) : myComments.length === 0 ? (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--mono-font)",
              border: "1px dashed var(--border)",
              borderRadius: 14,
            }}
          >
            아직 남긴 톡이 없어요.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {myComments.map((c) => (
              <Link
                key={c.id}
                href={`/festival/${c.festivalId}?tab=community`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    {c.tag && (
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 700,
                          background: `${TAG_COLOR[c.tag]}18`,
                          color: TAG_COLOR[c.tag],
                          border: `1px solid ${TAG_COLOR[c.tag]}40`,
                        }}
                      >
                        # {c.tag}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontFamily: "var(--mono-font)",
                      }}
                    >
                      {(c.createdAt as Timestamp)
                        .toDate()
                        .toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <div
                    style={{
                      font: "400 13px/1.6 var(--body-font)",
                      color: "var(--fg)",
                    }}
                  >
                    {c.content}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
