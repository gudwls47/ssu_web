export default function AdminNoticesPage() {
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
        NOTICES / 공지 관리
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
        공지
      </div>

      <div
        style={{
          padding: 48,
          borderRadius: 14,
          border: "1.5px dashed var(--border)",
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        전체 공지 관리는 준비 중입니다.
        <br />
        각 축제별 공지는{" "}
        <strong style={{ color: "var(--accent)" }}>
          내 축제 → 편집 → 공지
        </strong>{" "}
        에서 관리하세요.
      </div>
    </div>
  );
}
