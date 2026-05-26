"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logOut, type UserProfile } from "@/app/api/auth";
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
];

interface Props {
  user: User;
  profile: UserProfile;
}

export default function AdminSideMenu({ user, profile }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname.startsWith(href);

  const displayName =
    profile.displayName || user.email?.split("@")[0] || "관리자";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logOut();
    router.replace("/admin/login");
  };

  return (
    <div
      style={{
        width: 220,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <Link href="/admin/festivals" style={{ textDecoration: "none" }}>
        <div
          style={{
            fontFamily: "var(--display-font)",
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "-0.04em",
            color: "var(--fg)",
            marginBottom: 4,
          }}
        >
          FEST<span style={{ color: "var(--accent)" }}>A</span>
          <span style={{ color: "var(--accent)" }}>.</span>
        </div>
      </Link>
      <div
        style={{
          fontFamily: "var(--mono-font)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 24,
        }}
      >
        ADMIN · 주최자 콘솔
      </div>

      {/* Nav */}
      <div
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
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                transition: "background 0.12s, color 0.12s",
              }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 9,
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
      </div>

      {/* User / Logout */}
      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: "var(--faint)",
          marginTop: 16,
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
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
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
                fontFamily: "var(--mono-font)",
                fontSize: 10,
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
