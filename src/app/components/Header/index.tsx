"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Palette, Mode } from "@/app/layouts/Layout";

const NAV_ITEMS = [
  { label: "둘러보기", href: "/" },
  { label: "축제", href: "/festival" },
  { label: "커뮤니티", href: "/community" },
  { label: "공지", href: "/notice" },
];

const PALETTES: { value: Palette; label: string; dot: string }[] = [
  { value: "festival", label: "Festival", dot: "#FF1E7A" },
  { value: "classic", label: "Classic", dot: "#E85D4A" },
  { value: "experimental", label: "Neon", dot: "#FF00B8" },
];

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
  palette: Palette;
  mode: Mode;
  onPaletteChange: (p: Palette) => void;
  onModeChange: (m: Mode) => void;
}

export function Header({
  palette,
  mode,
  onPaletteChange,
  onModeChange,
}: HeaderProps) {
  const pathname = usePathname();

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
        <Link
          href="/festival"
          className="f-search-bar"
          style={{ textDecoration: "none" }}
        >
          <SearchIcon />
          <span
            style={{
              flex: 1,
              color: "var(--muted)",
              font: "500 14px/1 var(--body-font)",
            }}
          >
            축제명 · 학술제 · 아티스트 검색
          </span>
          <kbd>⌘ K</kbd>
        </Link>
      </div>

      {/* 팔레트 토글 */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}
      >
        {PALETTES.map((p) => (
          <button
            key={p.value}
            title={p.label}
            aria-label={p.label}
            onClick={() => onPaletteChange(p.value)}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: p.dot,
              border:
                palette === p.value
                  ? "2px solid var(--fg)"
                  : "2px solid transparent",
              outline: palette === p.value ? "2px solid var(--bg)" : "none",
              outlineOffset: -4,
              cursor: "pointer",
              flexShrink: 0,
              padding: 0,
              transition: "transform 0.12s",
              transform: palette === p.value ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

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

      <div className="f-nav-user">
        <div className="avatar">G</div>
        <span>로그인</span>
      </div>
    </nav>
  );
}
