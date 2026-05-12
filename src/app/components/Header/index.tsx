"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "둘러보기", href: "/" },
  { label: "축제", href: "/festival" },
  { label: "커뮤니티", href: "/community" },
  { label: "공지", href: "/notice" },
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

export function Header() {
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

      <div className="f-nav-user">
        <div className="avatar">G</div>
        <span>로그인</span>
      </div>
    </nav>
  );
}
