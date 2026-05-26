"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { signIn, signInWithGoogle } from "@/app/api/auth";
import { db } from "@/app/utils/firebase/db";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "등록되지 않은 이메일입니다.",
  "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/too-many-requests":
    "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.",
  "auth/popup-closed-by-user": "구글 로그인 창이 닫혔습니다.",
  "auth/cancelled-popup-request": "구글 로그인이 취소되었습니다.",
};

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signIn(email, password);

      // 역할 확인 후 리디렉트
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      const role = snap.exists() ? snap.data().role : "user";

      router.replace(role === "admin" ? "/admin/dashboard" : "/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(ERROR_MESSAGES[code] ?? "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.isNewUser) {
        // 신규 구글 유저 → 역할 선택 페이지로
        router.replace("/signup/role");
      } else {
        router.replace(result.role === "admin" ? "/admin/dashboard" : "/");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(ERROR_MESSAGES[code] ?? "구글 로그인 중 오류가 발생했습니다.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                fontFamily: "var(--display-font)",
                fontWeight: 700,
                fontSize: 48,
                letterSpacing: "-0.04em",
                color: "var(--fg)",
                lineHeight: 1,
              }}
            >
              FE<span style={{ color: "var(--accent)" }}>S</span>TA
            </div>
            <div
              style={{
                fontFamily: "var(--mono-font)",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "var(--muted)",
                marginTop: 6,
              }}
            >
              숭실대학교 축제 플랫폼
            </div>
          </div>
        </Link>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--display-font)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              marginBottom: 4,
            }}
          >
            로그인
          </div>

          {/* Google 로그인 버튼 */}
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
            {googleLoading ? "연결 중…" : "Google로 로그인"}
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
              또는
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

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
            </div>
            <input
              className="f-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
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
            disabled={loading || googleLoading || !email || !password}
            style={{ width: "100%", marginTop: 4, height: 44, fontSize: 16 }}
          >
            {loading ? "로그인 중…" : "이메일로 로그인"}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 15,
            color: "var(--muted)",
          }}
        >
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
