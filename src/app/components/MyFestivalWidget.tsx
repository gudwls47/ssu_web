"use client";

import { useState } from "react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { useGetBooths } from "@/app/api/booths";
import { useGetFestival, useGetFestivalComments } from "@/app/api/festivals";
import { useGetNotices } from "@/app/api/notices";
import { useGetMyFestivals } from "@/app/api/userFestivals";
import type { CommentTag } from "@/app/api/festivals.type";

// ── 슬라이드 타입 ─────────────────────────────────────────
type SlideType = "cover" | "desc" | "booth" | "notice" | "talk";

const SLIDES: SlideType[] = ["cover", "desc", "booth", "notice", "talk"];
const SLIDE_LABEL: Record<SlideType, string> = {
  cover: "표지",
  desc: "소개",
  booth: "부스",
  notice: "공지",
  talk: "톡",
};

// ── 색상 상수 ─────────────────────────────────────────────
const TAG_COLOR: Record<CommentTag, string> = {
  라인업: "#FF1E7A",
  지도: "#2563EB",
  부스: "#16A34A",
  공지: "#D97706",
};

const BOOTH_TAG_COLOR: Record<string, string> = {
  FOOD: "#FF6B35",
  BAR: "#9B59B6",
  GAME: "#2ECC71",
  GOODS: "#3498DB",
  EXP: "#E74C3C",
};
const BOOTH_TAG_LABEL: Record<string, string> = {
  FOOD: "음식",
  BAR: "주류",
  GAME: "게임",
  GOODS: "굿즈",
  EXP: "체험",
};

const NOTICE_CAT_COLOR: Record<string, string> = {
  긴급: "#EF4444",
  안내: "#3B82F6",
  교통: "#8B5CF6",
  굿즈: "#F59E0B",
};

// ── 단일 축제 슬라이드쇼 ──────────────────────────────────
function FestivalStory({ festivalId }: { festivalId: string }) {
  const { data: festival } = useGetFestival(festivalId);
  const { data: booths } = useGetBooths(festivalId);
  const { data: notices } = useGetNotices(festivalId);
  const { data: comments } = useGetFestivalComments(festivalId);
  const [slideIdx, setSlideIdx] = useState(0);

  if (!festival) {
    return (
      <div
        style={{
          height: 340,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          fontSize: 15,
          fontFamily: "var(--mono-font)",
        }}
      >
        로딩 중…
      </div>
    );
  }

  const current = SLIDES[slideIdx];
  const topBooths = booths ?? [];
  const topNotices = notices ?? [];
  const topComments = comments ?? [];

  return (
    <div>
      {/* 슬라이드 탭 + 진행 바 */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {SLIDES.map((s, i) => (
            <button
              key={s}
              onClick={() => setSlideIdx(i)}
              style={{
                padding: "4px 12px",
                borderRadius: 14,
                border: "none",
                background: slideIdx === i ? "var(--accent)" : "var(--faint)",
                color: slideIdx === i ? "#fff" : "var(--muted)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {SLIDE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* 슬라이드 본문 */}
      <div style={{ minHeight: 280 }}>
        {current === "cover" && (
          <SlideCover festival={festival} festivalId={festivalId} />
        )}
        {current === "desc" && <SlideDesc festival={festival} />}
        {current === "booth" && (
          <SlideBooth booths={topBooths} festivalId={festivalId} />
        )}
        {current === "notice" && (
          <SlideNotice notices={topNotices} festivalId={festivalId} />
        )}
        {current === "talk" && (
          <SlideTalk comments={topComments} festivalId={festivalId} />
        )}
      </div>

      {/* 하단 링크 - 커버 슬라이드일 때는 이미지 안에 표시 */}
      {current !== "cover" && (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}
        >
          <Link
            href={`/festival/${festivalId}`}
            style={{
              font: "600 12px/1 var(--mono-font)",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            축제 페이지 →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── 슬라이드: 표지 ────────────────────────────────────────
function SlideCover({
  festival,
  festivalId,
}: {
  festival: any;
  festivalId: string;
}) {
  const statusColor =
    festival.status === "LIVE"
      ? "#FF1E7A"
      : festival.status === "UPCOMING"
        ? "#2563EB"
        : "#888";
  const statusLabel =
    festival.status === "LIVE"
      ? "진행 중"
      : festival.status === "UPCOMING"
        ? "예정"
        : "종료";

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        height: 320,
        background: festival.thumbnail
          ? "var(--surface)"
          : `linear-gradient(135deg, ${festival.colors?.[0] ?? "#FF1E7A"}33, ${festival.colors?.[1] ?? "#BDFF1E"}22)`,
      }}
    >
      {festival.thumbnail && (
        <img
          src={festival.thumbnail}
          alt={festival.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            display: "block",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              background: `${statusColor}cc`,
              color: "#fff",
              border: `1px solid ${statusColor}`,
            }}
          >
            {statusLabel}
          </span>
          <span
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              fontFamily: "var(--mono-font)",
            }}
          >
            {festival.start} ~ {festival.end}
          </span>
        </div>
        <div
          style={{
            font: "700 22px/1.2 var(--display-font)",
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: 4,
          }}
        >
          {festival.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
            {festival.school}
          </div>
          <Link
            href={`/festival/${festivalId}`}
            style={{
              font: "600 12px/1 var(--mono-font)",
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            축제 페이지 →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── 슬라이드: 소개 ────────────────────────────────────────
function SlideDesc({ festival }: { festival: any }) {
  return (
    <div
      style={{
        height: 280,
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {festival.tagline && (
        <div
          style={{
            font: "600 12px/1 var(--mono-font)",
            color: "var(--accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {festival.tagline}
        </div>
      )}
      <div
        style={{
          font: "400 14px/1.75 var(--body-font)",
          color: "var(--fg)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowY: "auto",
          maxHeight: 200,
          scrollbarWidth: "none",
        }}
      >
        {festival.description || "소개가 없어요."}
      </div>
    </div>
  );
}

// ── 슬라이드: 부스 ────────────────────────────────────────
function SlideBooth({
  booths,
  festivalId,
}: {
  booths: any[];
  festivalId: string;
}) {
  if (booths.length === 0) return <EmptySlide message="등록된 부스가 없어요" />;
  return (
    <div
      style={{
        height: 280,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflowY: "auto",
      }}
    >
      {booths.map((b) => (
        <Link
          key={b.id}
          href={`/festival/${festivalId}?tab=booth`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            {b.tag && (
              <span
                style={{
                  flexShrink: 0,
                  padding: "2px 8px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  background: `${BOOTH_TAG_COLOR[b.tag] ?? "#888"}18`,
                  color: BOOTH_TAG_COLOR[b.tag] ?? "#888",
                  border: `1px solid ${BOOTH_TAG_COLOR[b.tag] ?? "#888"}40`,
                }}
              >
                {BOOTH_TAG_LABEL[b.tag] ?? b.tag}
              </span>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "600 13px/1 var(--body-font)",
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
                  font: "400 11px/1 var(--mono-font)",
                  color: "var(--muted)",
                  marginTop: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {b.dept} · {b.loc}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── 슬라이드: 공지 ────────────────────────────────────────
function SlideNotice({
  notices,
  festivalId,
}: {
  notices: any[];
  festivalId: string;
}) {
  if (notices.length === 0)
    return <EmptySlide message="등록된 공지가 없어요" />;
  return (
    <div
      style={{
        height: 280,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        overflowY: "auto",
      }}
    >
      {notices.map((n) => (
        <Link
          key={n.id}
          href={`/festival/${festivalId}?tab=notice`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  background: `${NOTICE_CAT_COLOR[n.category] ?? "#888"}18`,
                  color: NOTICE_CAT_COLOR[n.category] ?? "#888",
                  border: `1px solid ${NOTICE_CAT_COLOR[n.category] ?? "#888"}40`,
                }}
              >
                {n.category}
              </span>
              <span
                style={{
                  font: "600 13px/1 var(--body-font)",
                  color: "var(--fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {n.title}
              </span>
            </div>
            <div
              style={{
                font: "400 12px/1.5 var(--body-font)",
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {n.content}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── 슬라이드: 톡 ─────────────────────────────────────────
function SlideTalk({
  comments,
  festivalId,
}: {
  comments: any[];
  festivalId: string;
}) {
  if (comments.length === 0)
    return <EmptySlide message="아직 남긴 톡이 없어요" />;
  return (
    <div
      style={{
        height: 280,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        overflowY: "auto",
      }}
    >
      {comments.map((c) => (
        <Link
          key={c.id}
          href={`/festival/${festivalId}?tab=community`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  font: "600 12px/1 var(--body-font)",
                  color: "var(--fg)",
                }}
              >
                {c.authorName || "익명"}
              </span>
              {c.tag && (
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    background: `${TAG_COLOR[c.tag as CommentTag]}18`,
                    color: TAG_COLOR[c.tag as CommentTag],
                  }}
                >
                  #{c.tag}
                </span>
              )}
              <span
                style={{
                  marginLeft: "auto",
                  font: "400 10px/1 var(--mono-font)",
                  color: "var(--muted)",
                }}
              >
                {(c.createdAt as Timestamp)
                  .toDate()
                  .toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
            <div
              style={{
                font: "400 12px/1.5 var(--body-font)",
                color: "var(--fg)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {c.content}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── 빈 슬라이드 ───────────────────────────────────────────
function EmptySlide({ message }: { message: string }) {
  return (
    <div
      style={{
        height: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
        fontSize: 15,
        fontFamily: "var(--mono-font)",
        border: "1px dashed var(--border)",
        borderRadius: 16,
      }}
    >
      {message}
    </div>
  );
}

// ── 메인 위젯 ─────────────────────────────────────────────
export default function MyFestivalWidget({ uid }: { uid: string }) {
  const { data: myFestivals, isLoading } = useGetMyFestivals(uid);
  const [festIdx, setFestIdx] = useState(0);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: 400,
          borderRadius: 24,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          fontSize: 15,
          fontFamily: "var(--mono-font)",
          marginTop: 24,
        }}
      >
        로딩 중…
      </div>
    );
  }

  if (!myFestivals || myFestivals.length === 0) return null;

  const safeFestIdx = Math.min(festIdx, myFestivals.length - 1);
  const current = myFestivals[safeFestIdx];

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 24,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "22px",
        marginTop: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* 섹션 헤더 */}
      <div
        style={{
          font: "600 11px/1 var(--mono-font)",
          color: "var(--muted)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        내가 참여한 축제
      </div>

      {/* 축제 선택 탭 (여러 개일 때만) */}
      {myFestivals.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 18,
            overflowX: "auto",
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}
        >
          {myFestivals.map((f, i) => (
            <button
              key={f.festivalId}
              onClick={() => setFestIdx(i)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 16,
                border: `1.5px solid ${safeFestIdx === i ? "var(--accent)" : "var(--border)"}`,
                background: safeFestIdx === i ? "var(--faint)" : "transparent",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f.thumbnail && (
                <img
                  src={f.thumbnail}
                  alt={f.name}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  font: `${safeFestIdx === i ? 700 : 500} 13px/1 var(--body-font)`,
                  color: safeFestIdx === i ? "var(--accent)" : "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {f.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 슬라이드쇼 — key로 축제 전환 시 상태 초기화 */}
      <FestivalStory key={current.festivalId} festivalId={current.festivalId} />
    </div>
  );
}
