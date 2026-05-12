import { FESTIVALS } from "@/app/admin/_mock/data";

const totalParticipants = FESTIVALS.reduce((s, f) => s + f.participants, 0);
const totalBooths = FESTIVALS.reduce((s, f) => s + f.boothCount, 0);
const live = FESTIVALS.filter((f) => f.status === "live");
const upcoming = FESTIVALS.filter((f) => f.status === "upcoming");
const ended = FESTIVALS.filter((f) => f.status === "ended");

export default function AdminStatsPage() {
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

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          { label: "전체 축제", value: String(FESTIVALS.length), sub: "등록된 축제 수" },
          { label: "누적 참여자", value: totalParticipants.toLocaleString(), sub: "전체 합산" },
          { label: "총 부스", value: String(totalBooths), sub: "전체 합산" },
          { label: "평균 참여자", value: Math.round(totalParticipants / FESTIVALS.length).toLocaleString(), sub: "축제당 평균" },
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
                color: "var(--fg)",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
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
          marginBottom: 20,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "진행중", count: live.length, cls: "live", color: "var(--live)" },
            { label: "예정", count: upcoming.length, cls: "upcoming", color: "var(--upcoming)" },
            { label: "종료", count: ended.length, cls: "ended", color: "var(--ended)" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`f-tag ${row.cls}`} style={{ width: 80, justifyContent: "center" }}>
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
                    width: `${(row.count / FESTIVALS.length) * 100}%`,
                    background: row.color,
                    borderRadius: 999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--fg)",
                  width: 32,
                  textAlign: "right",
                }}
              >
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-festival participants */}
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
          PARTICIPANTS PER FESTIVAL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...FESTIVALS]
            .sort((a, b) => b.participants - a.participants)
            .map((fest) => (
              <div key={fest.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 180, fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
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
                      width: `${(fest.participants / Math.max(...FESTIVALS.map((f) => f.participants))) * 100}%`,
                      background: `radial-gradient(90deg at 0%, ${fest.colors[0]}, ${fest.colors[1]})`,
                      borderRadius: 999,
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
                  }}
                >
                  {fest.participants.toLocaleString()}명
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
