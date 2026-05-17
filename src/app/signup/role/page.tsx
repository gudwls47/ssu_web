"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveGoogleUserProfile,
  useAuthState,
  type UserRole,
} from "@/app/api/auth";

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuthState();

  const [role, setRole] = useState<UserRole>("user");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 이미 프로필이 있는 유저라면 바로 리디렉트
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile) {
      router.replace(
        profile.role === "admin" ? "/admin/dashboard" : "/festival",
      );
    }
  }, [user, profile, loading, router]);

  const isValid = role === "user" || organization.trim().length > 0;

  const handleSave = async () => {
    if (!user || !isValid) return;
    setSaving(true);
    setError("");
    try {
      await saveGoogleUserProfile({
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? user.email?.split("@")[0] ?? "사용자",
        role,
        organization: organization.trim(),
      });
      router.replace(role === "admin" ? "/admin/dashboard" : "/festival");
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error("[role save error]", err);
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSaving(false);
    }
  };

  if (loading || !user || profile) {
    return (
      <div
        className="festa"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        로딩 중…
      </div>
    );
  }

  return (
    <div
      className="festa"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: "-0.04em",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            FE<span style={{ color: "var(--accent)" }}>S</span>TA
          </div>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* 환영 메시지 */}
          <div>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
                marginBottom: 6,
              }}
            >
              환영합니다! 👋
            </div>
            <div
              style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}
            >
              <strong style={{ color: "var(--fg)" }}>
                {user.displayName ?? user.email}
              </strong>
              님,
              <br />
              FESTA에서 어떤 역할로 활동하실 건가요?
            </div>
          </div>

          {/* 역할 선택 */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--fg)",
                marginBottom: 8,
              }}
            >
              가입 유형
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                {
                  value: "user" as UserRole,
                  title: "일반 사용자",
                  desc: "축제 탐색 · 참여 등록",
                  icon: "🎪",
                },
                {
                  value: "admin" as UserRole,
                  title: "축제 주최자",
                  desc: "축제 등록 · 관리",
                  icon: "🎤",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "14px 12px",
                    borderRadius: 12,
                    background:
                      role === opt.value ? "var(--faint)" : "var(--surface-2)",
                    border: `1.5px solid ${role === opt.value ? "var(--accent)" : "var(--border)"}`,
                    textAlign: "left",
                    transition: "border-color 0.1s, background 0.1s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>
                    {opt.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--fg)",
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono-font)",
                      fontSize: 10,
                      color: "var(--muted)",
                      marginTop: 3,
                    }}
                  >
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 소속 기관 (주최자만) */}
          {role === "admin" && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: 6,
                }}
              >
                소속 기관
                <span
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: 9,
                    color: "var(--muted)",
                    marginLeft: 6,
                  }}
                >
                  학생회 · 총학생회 · 단과대 등
                </span>
              </div>
              <input
                className="f-input"
                placeholder="예: 숭실대학교 총학생회"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,107,107,0.1)",
                color: "#FF6B6B",
                fontFamily: "var(--mono-font)",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            className="f-btn accent"
            onClick={handleSave}
            disabled={!isValid || saving}
            style={{ width: "100%", height: 44, fontSize: 14 }}
          >
            {saving
              ? "저장 중…"
              : role === "admin"
                ? "주최자로 시작하기"
                : "시작하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
