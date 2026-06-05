"use client";

import React from "react";
import Link from "next/link";
import { useAuthState } from "@/app/api/auth";
import { useGetFestivals, useDeleteFestival } from "@/app/api/festivals";
import type {
  FestivalResponse,
  FestivalStatus,
} from "@/app/api/festivals.type";

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
              fontSize: 12,
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

function DeleteModal({
  fest,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  fest: FestivalResponse;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 28,
          width: 400,
          maxWidth: "calc(100vw - 40px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 22, marginBottom: 8 }}>🗑️</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
          축제를 삭제할까요?
        </div>
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          <b style={{ color: "var(--fg)" }}>{fest.name}</b>을(를) 삭제하면
          <br />
          모든 데이터가 영구적으로 제거됩니다.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="f-btn ghost sm" onClick={onCancel}>
            취소
          </button>
          <button
            className="f-btn sm"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ background: "#e53e3e", color: "#fff" }}
          >
            {isDeleting ? "삭제 중…" : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFestivalsPage() {
  const { user } = useAuthState();
  const [statusFilter, setStatusFilter] = React.useState<
    FestivalStatus | "ALL"
  >("ALL");
  const [deletingFest, setDeletingFest] =
    React.useState<FestivalResponse | null>(null);
  const { data: festivals = [], isLoading } = useGetFestivals({
    size: 50,
    ownerUid: user?.uid,
  });
  const { mutate: deleteFestival, isPending: isDeleting } = useDeleteFestival();

  const live = festivals.filter((f) => f.status === "LIVE");
  const upcoming = festivals.filter((f) => f.status === "UPCOMING");
  const totalParticipants = festivals.reduce((s, f) => s + f.participants, 0);
  const filteredFestivals =
    statusFilter === "ALL"
      ? festivals
      : festivals.filter((f) => f.status === statusFilter);

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

  const handleDelete = () => {
    if (!deletingFest) return;
    deleteFestival(deletingFest.id, {
      onSuccess: () => setDeletingFest(null),
    });
  };

  return (
    <div style={{ padding: "24px 32px" }}>
      {deletingFest && (
        <DeleteModal
          fest={deletingFest}
          onConfirm={handleDelete}
          onCancel={() => setDeletingFest(null)}
          isDeleting={isDeleting}
        />
      )}
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
              fontSize: 12,
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
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            내 축제{" "}
            <span
              style={{ color: "var(--muted)", fontSize: 24, fontWeight: 500 }}
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
            filter: "LIVE" as const,
          },
          {
            label: "예정",
            value: String(upcoming.length),
            sub:
              upcoming.map((f) => f.nameEn.split(" ")[0]).join(" · ") || "없음",
            accent: "var(--upcoming)",
            filter: "UPCOMING" as const,
          },
          {
            label: "총 참여자",
            value: totalParticipants.toLocaleString(),
            sub: "누적 참여자 수",
            accent: null,
            filter: null,
          },
          {
            label: "등록 축제",
            value: String(festivals.length),
            sub: "전체 축제 수",
            accent: null,
            filter: "ALL" as const,
          },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() =>
              s.filter &&
              setStatusFilter(s.filter === statusFilter ? "ALL" : s.filter)
            }
            style={{
              padding: 16,
              borderRadius: 14,
              background: "var(--surface)",
              border: `1px solid ${s.filter && s.filter === statusFilter ? (s.accent ?? "var(--accent)") : "var(--border)"}`,
              cursor: s.filter ? "pointer" : "default",
              transition: "border-color 0.15s",
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
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                marginTop: 4,
                color: s.accent ?? "var(--fg)",
              }}
            >
              {s.value}
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
            gridTemplateColumns: "76px 1fr 140px 130px 110px 140px 160px",
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            fontFamily: "var(--mono-font)",
            fontSize: 12,
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

        {filteredFestivals.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 15,
              fontFamily: "var(--mono-font)",
            }}
          >
            등록된 축제가 없습니다.
          </div>
        ) : (
          filteredFestivals.map((fest, i) => (
            <div
              key={fest.id}
              style={{
                display: "grid",
                gridTemplateColumns: "76px 1fr 140px 130px 110px 140px 160px",
                padding: "14px 18px",
                borderBottom:
                  i < filteredFestivals.length - 1
                    ? "1px solid var(--border)"
                    : "none",
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
                  style={{ fontWeight: 600, fontSize: 16, color: "var(--fg)" }}
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
                  {fest.school}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 14,
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
                  fontSize: 15,
                  color: "var(--fg)",
                }}
              >
                {fest.participants.toLocaleString()}
              </div>

              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                {new Date(fest.updatedAt).toLocaleDateString("ko-KR")}
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
                <button
                  className="f-btn sm"
                  style={{
                    width: 36,
                    background: "var(--faint)",
                    color: "var(--fg)",
                    flexShrink: 0,
                  }}
                  onClick={() => setDeletingFest(fest)}
                  title="삭제"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
