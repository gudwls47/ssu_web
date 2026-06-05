"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_SIDEBAR_W } from "@/app/admin/constants";
import { logOut, type UserProfile } from "@/app/api/auth";
import { FestaLogo } from "@/app/components/FestaLogo";
import type { Mode } from "@/app/layouts/Layout";
import type { User } from "firebase/auth";

interface NavItem {
  id: string;
  label: string;
  en: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    en: "DASHBOARD",
    href: "/admin/dashboard",
  },
  {
    id: "festivals",
    label: "내 축제",
    en: "FESTIVALS",
    href: "/admin/festivals",
  },
  { id: "notices", label: "공지", en: "NOTICES", href: "/admin/notices" },
  { id: "stats", label: "통계", en: "STATS", href: "/admin/stats" },
  {
    id: "accounts",
    label: "계정 관리",
    en: "ACCOUNTS",
    href: "/admin/accounts",
  },
];

interface Props {
  user: User;
  profile: UserProfile;
  mode: Mode;
  onModeChange: (m: Mode) => void;
}

export default function AdminSideMenu({
  user,
  profile,
  mode,
  onModeChange,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname.startsWith(href);

  const displayName =
    profile.displayName || user.email?.split("@")[0] || "관리자";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logOut();
    router.replace("/login");
  };

  return (
    <div
      style={{
        width: ADMIN_SIDEBAR_W,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        flexShrink: 0,
        zIndex: 40,
      }}
    >
      {/* Brand + mode toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
          <FestaLogo size="sm" mode={mode} />
        </Link>
        <button
          title={mode === "light" ? "다크 모드" : "라이트 모드"}
          aria-label={mode === "light" ? "Dark mode" : "Light mode"}
          onClick={() => onModeChange(mode === "light" ? "dark" : "light")}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1.5px solid var(--border)",
            background: "transparent",
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          {mode === "light" ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>

      <div
        style={{
          fontFamily: "var(--mono-font), monospace",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 20,
          marginTop: 6,
          paddingLeft: 2,
        }}
      >
        ADMIN CONSOLE
      </div>

      {/* Nav */}
      <nav
        style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: active ? "var(--fg)" : "transparent",
                color: active ? "var(--bg)" : "var(--fg)",
                fontSize: 15,
                fontWeight: active ? 600 : 500,
                transition: "background 0.12s, color 0.12s",
              }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              <span
                style={{
                  fontFamily: "var(--mono-font), monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.5,
                }}
              >
                {item.en}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* 메인 사이트 링크 */}
      <Link
        href="/festival"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 12px",
          borderRadius: 10,
          color: "var(--muted)",
          fontSize: 13,
          fontFamily: "var(--mono-font), monospace",
          letterSpacing: "0.04em",
          marginBottom: 8,
          transition: "color 0.12s, background 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--faint)";
          e.currentTarget.style.color = "var(--fg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--muted)";
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span style={{ flex: 1 }}>메인 사이트</span>
      </Link>

      {/* User / Logout */}
      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: "var(--faint)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--fg)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                fontFamily: "var(--mono-font), monospace",
                fontSize: 12,
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profile.organization || user.email}
            </div>
          </div>
        </div>
        <button
          className="f-btn ghost sm"
          style={{ width: "100%", borderRadius: 8 }}
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export { NAV_ITEMS };
export type { NavItem };
