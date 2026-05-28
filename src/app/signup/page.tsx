"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle, type UserRole } from "@/app/api/auth";
import { FestaMasterMark } from "@/app/components/FestaLogo";

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
  "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
  "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
  "auth/operation-not-allowed":
    "이메일/비밀번호 로그인이 비활성화 상태입니다. Firebase Console → Authentication → Sign-in method에서 활성화해주세요.",
};

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("user");
  const [displayName, setDisplayName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.isNewUser) {
        router.replace("/signup/role");
      } else {
        router.replace(result.role === "admin" ? "/admin/dashboard" : "/");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code === "auth/popup-closed-by-user" ||
          code === "auth/cancelled-popup-request"
          ? "구글 로그인 창이 닫혔습니다."
          : `구글 로그인 오류가 발생했습니다. (${code || "unknown"})`,
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const isValid =
    displayName.trim() &&
    email.trim() &&
    password.length >= 6 &&
    password === confirm &&
    (role === "user" || organization.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setLoading(true);
    try {
      await signUp({
        email,
        password,
        displayName: displayName.trim(),
        role,
        organization: organization.trim(),
      });
      router.replace(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      // eslint-disable-next-line no-console
      console.error("[signup error]", err);
      setError(
        ERROR_MESSAGES[code] ?? `오류가 발생했습니다. (${code || "unknown"})`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "block",
            marginBottom: 16,
          }}
        >
          <FestaMasterMark />
        </Link>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
            }}
          >
            회원가입
          </div>

          {/* Google 가입 버튼 */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            style={{
              all: "unset",
              cursor: googleLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              height: 44,
              borderRadius: 12,
              border: "1.5px solid var(--border)",
              background: "var(--surface-2)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--fg)",
              opacity: googleLoading ? 0.6 : 1,
              transition: "border-color 0.12s, opacity 0.12s",
              boxSizing: "border-box",
            }}
          >
            <GoogleIcon />
            {googleLoading ? "연결 중…" : "Google로 계속하기"}
          </button>

          {/* 구분선 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "var(--muted)",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--mono-font)", fontSize: 13 }}>
              또는 이메일로 가입
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* 역할 선택 */}
          <div>
            <div
              style={{
                fontSize: 13,
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
                  <div style={{ fontSize: 22, marginBottom: 6 }}>
                    {opt.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--fg)",
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono-font)",
                      fontSize: 12,
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

          {/* 이름 */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fg)",
                marginBottom: 6,
              }}
            >
              이름
            </div>
            <input
              className="f-input"
              placeholder="홍길동"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          {/* 소속 기관 (주최자만) */}
          {role === "admin" && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginBottom: 6,
                }}
              >
                소속 기관
                <span
                  style={{
                    fontFamily: "var(--mono-font)",
                    fontSize: 11,
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
                required={role === "admin"}
              />
            </div>
          )}

          {/* 이메일 */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fg)",
                marginBottom: 6,
              }}
            >
              이메일
            </div>
            <input
              className="f-input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fg)",
                marginBottom: 6,
              }}
            >
              비밀번호
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginLeft: 6,
                }}
              >
                6자 이상
              </span>
            </div>
            <input
              className="f-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--fg)",
                marginBottom: 6,
              }}
            >
              비밀번호 확인
            </div>
            <input
              className="f-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              style={{
                borderColor:
                  confirm && password !== confirm ? "#FF6B6B" : void 0,
              }}
            />
            {confirm && password !== confirm && (
              <div
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 13,
                  color: "#FF6B6B",
                  marginTop: 4,
                }}
              >
                비밀번호가 일치하지 않습니다.
              </div>
            )}
          </div>

          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: "rgba(255,107,107,0.1)",
                color: "#FF6B6B",
                fontFamily: "var(--mono-font)",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="f-btn accent"
            disabled={!isValid || loading}
            style={{ width: "100%", height: 44, fontSize: 16, marginTop: 4 }}
          >
            {loading
              ? "가입 중…"
              : role === "admin"
                ? "주최자로 가입하기"
                : "가입하기"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 15,
            color: "var(--muted)",
          }}
        >
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
