/**
 * FestaLogo — 헤더 pill 로고와 동일한 스타일
 * AdminSideMenu 등에서 사용
 */
export function FestaLogo({
  size = "md",
  mode = "light",
}: {
  size?: "sm" | "md" | "lg";
  mode?: "light" | "dark";
}) {
  const cfg = {
    sm: { height: 36, px: 12, gap: 7, dot: 10, fs: 21, fsS: 16 },
    md: { height: 44, px: 16, gap: 9, dot: 12, fs: 26, fsS: 19 },
    lg: { height: 50, px: 18, gap: 10, dot: 14, fs: 30, fsS: 22 },
  }[size];

  const isDark = mode === "dark";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: cfg.gap,
        background: isDark ? "#FFEFF5" : "#2A0F4E",
        borderRadius: 999,
        height: cfg.height,
        padding: `0 ${cfg.px + 4}px 0 ${cfg.px}px`,
        userSelect: "none",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      {/* Pink dot */}
      <span
        style={{
          width: cfg.dot,
          height: cfg.dot,
          borderRadius: "50%",
          background: "#FF1E7A",
          display: "block",
          flexShrink: 0,
        }}
      />
      {/* Wordmark */}
      <span
        style={{
          fontFamily:
            "var(--font-bricolage), 'Bricolage Grotesque', sans-serif",
          fontWeight: 800,
          fontSize: cfg.fs,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: isDark ? "#2A0F4E" : "#FFEFF5",
          transition: "color 0.2s",
        }}
      >
        FE
        <span style={{ color: "#FF1E7A", fontSize: cfg.fsS }}>S</span>
        TA
        <span style={{ color: "#FF1E7A" }}> .</span>
      </span>
    </div>
  );
}

const DISPLAY = "'Bricolage Grotesque', 'Pretendard Variable', sans-serif";
const MONO = "'Pretendard Variable', monospace";

/**
 * FestaMasterMark — 티켓 스탬프 마스터 마크
 * 로그인·회원가입 페이지 로고로 사용
 */
export function FestaMasterMark({
  width = "100%",
}: {
  width?: number | string;
}) {
  // viewBox: 440 × 180 (기존 140에서 높이 증가)
  return (
    <svg
      viewBox="0 0 440 180"
      width={width}
      style={{ display: "block" }}
      aria-label="FESTA"
    >
      <defs>
        <pattern
          id="diagMark"
          x="0"
          y="0"
          width="8"
          height="8"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="4" height="8" fill="rgba(255,239,245,0.10)" />
        </pattern>
      </defs>

      {/* Body — navy */}
      <rect x="6" y="10" width="320" height="160" rx="8" fill="#2A0F4E" />
      {/* Stub — pink */}
      <rect x="346" y="10" width="88" height="160" rx="8" fill="#FF1E7A" />
      <rect
        x="346"
        y="10"
        width="88"
        height="160"
        rx="8"
        fill="url(#diagMark)"
      />

      {/* Perforations */}
      <g fill="#FFEFF5">
        <circle cx="336" cy="36" r="3.5" />
        <circle cx="336" cy="64" r="3.5" />
        <circle cx="336" cy="92" r="3.5" />
        <circle cx="336" cy="120" r="3.5" />
        <circle cx="336" cy="148" r="3.5" />
      </g>

      {/* ADMIT ONE */}
      <text
        x="24"
        y="48"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 11,
          letterSpacing: 3,
        }}
        fill="#BDFF1E"
      >
        ● CAMPUS FESTIVAL · INFO HUB
      </text>

      {/* FESTA wordmark */}
      <text
        x="20"
        y="124"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 80,
          letterSpacing: -4,
        }}
        fill="#FFEFF5"
      >
        FESTA.
      </text>

      {/* Pink underline */}
      <line
        x1="20"
        y1="138"
        x2="314"
        y2="138"
        stroke="#FF1E7A"
        strokeWidth="2.5"
      />

      {/* Tagline */}
      <text
        x="20"
        y="155"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 8,
          letterSpacing: 3,
        }}
        fill="rgba(255,239,245,0.6)"
      >
        DISCOVER FESTIVALS, SMARTER.
      </text>

      {/* Stub — NO. */}
      <text
        x="390"
        y="46"
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 9,
          letterSpacing: 2,
        }}
        fill="rgba(255,239,245,0.7)"
      >
        NO.
      </text>
      {/* Stub — year */}
      <text
        x="390"
        y="102"
        textAnchor="middle"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 36,
          letterSpacing: -1,
        }}
        fill="#FFEFF5"
      >
        &apos;26
      </text>
      <line
        x1="362"
        y1="116"
        x2="418"
        y2="116"
        stroke="#FFEFF5"
        strokeWidth="1"
        opacity="0.45"
      />
      {/* Stub — LIVE */}
      <text
        x="390"
        y="136"
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 3,
        }}
        fill="#BDFF1E"
      >
        LIVE
      </text>
      <text
        x="390"
        y="154"
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 9,
          letterSpacing: 2,
        }}
        fill="rgba(255,239,245,0.55)"
      >
        NOW
      </text>
    </svg>
  );
}
