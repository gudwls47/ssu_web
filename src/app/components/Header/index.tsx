"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState, logOut } from "@/app/api/auth";
import type { Mode } from "@/app/layouts/Layout";

const NAV_ITEMS: { label: string; href: string }[] = [];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}

interface HeaderProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin } = useAuthState();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("title", query.trim());
    router.push(`/festival${params.size ? "?" + params.toString() : ""}`);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.displayName ??
    user?.displayName ??
    user?.email?.split("@")[0] ??
    "";
  const initial =
    displayName[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="f-nav">
      <Link href="/" className="f-nav-logo">
        FE<em>S</em>TA <small>숭실대학교</small>
      </Link>

      <div className="f-nav-links">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-active={pathname === item.href ? "true" : "false"}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="f-nav-search">
        <form
          onSubmit={handleSearch}
          style={{
            width: "100%",
            display: pathname.startsWith("/festival") ? "none" : "block",
          }}
        >
          <div className="f-search-bar" style={{ cursor: "text" }}>
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="지역 · 학교 · 축제명 검색"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--fg)",
                font: "500 14px/1 var(--body-font)",
              }}
            />
          </div>
        </form>
      </div>

      <div style={{ marginLeft: "auto" }} />
      <button
        title={mode === "light" ? "Dark mode" : "Light mode"}
        aria-label={mode === "light" ? "Dark mode" : "Light mode"}
        onClick={() => onModeChange(mode === "light" ? "dark" : "light")}
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid var(--border)",
          background: "transparent",
          color: "var(--fg)",
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
            width="16"
            height="16"
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
            width="16"
            height="16"
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

      {user ? (
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            className="f-nav-user"
            style={{ cursor: "pointer" }}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="avatar" style={{ textTransform: "uppercase" }}>
              {initial}
            </div>
            <span
              style={{
                maxWidth: 80,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>
          </div>
          {open && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 6,
                minWidth: 140,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              {!isAdmin && (
                <Link
                  href="/mypage"
                  onClick={() => setOpen(false)}
                  style={{
                    textDecoration: "none",
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--fg)",
                    display: "block",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  마이페이지
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  style={{
                    textDecoration: "none",
                    padding: "9px 12px",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--fg)",
                    display: "block",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  관리자 페이지
                </Link>
              )}
              <button
                onClick={() => {
                  logOut();
                  setOpen(false);
                }}
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--fg)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="f-nav-user"
          style={{ textDecoration: "none" }}
        >
          <div className="avatar">?</div>
          <span>로그인</span>
        </Link>
      )}
    </nav>
  );
}
