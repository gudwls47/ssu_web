import Link from "next/link";
import { FESTIVALS, STATUS_META, fmtRange } from "@/app/admin/_mock/data";

function StatusTag({ status }: { status: keyof typeof STATUS_META }) {
  const meta = STATUS_META[status];
  return <span className={`f-tag ${meta.cls}`}>{meta.en}</span>;
}

function PosterThumb({
  colors,
  en,
}: {
  colors: [string, string, string];
  en: string;
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
        {en.split(" ")[0].slice(0, 5)}
      </span>
    </div>
  );
}

const live = FESTIVALS.filter((f) => f.status === "live");
const upcoming = FESTIVALS.filter((f) => f.status === "upcoming");
const totalParticipants = FESTIVALS.reduce((s, f) => s + f.participants, 0);

export default function AdminFestivalsPage() {
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
              style={{
                color: "var(--muted)",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              {FESTIVALS.length}
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
            sub: live.map((f) => f.en).join(" · ") || "없음",
            accent: "var(--live)",
          },
          {
            label: "예정",
            value: String(upcoming.length),
            sub: upcoming.map((f) => f.en.split(" ")[0]).join(" · ") || "없음",
            accent: "var(--upcoming)",
          },
          {
            label: "총 참여자",
            value: totalParticipants.toLocaleString(),
            sub: "누적 참여자 수",
            accent: null,
          },
          {
            label: "등록 부스",
            value: String(FESTIVALS.reduce((s, f) => s + f.boothCount, 0)),
            sub: "전체 부스 합계",
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
            gridTemplateColumns: "76px 1fr 140px 130px 110px 110px 110px 80px",
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
          <span>부스</span>
          <span>마지막 수정</span>
          <span />
        </div>

        {/* Rows */}
        {FESTIVALS.map((fest, i) => (
          <div
            key={fest.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "76px 1fr 140px 130px 110px 110px 110px 80px",
              padding: "14px 18px",
              borderBottom:
                i < FESTIVALS.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
              gap: 0,
            }}
          >
            <PosterThumb colors={fest.colors} en={fest.en} />

            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--fg)" }}>
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
                fontSize: 13,
                color: "var(--fg)",
              }}
            >
              {fest.boothCount}개
            </div>

            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              {fest.lastModified}
            </div>

            <Link
              href={`/admin/festivals/${fest.id}/basic`}
              style={{ textDecoration: "none" }}
            >
              <button className="f-btn ghost sm" style={{ width: 64 }}>
                편집
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
