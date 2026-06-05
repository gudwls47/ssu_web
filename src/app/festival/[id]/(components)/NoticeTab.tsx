"use client";

import { useState } from "react";
import type { NoticeResponse } from "@/app/api/festivals.type";

interface NoticeTabProps {
  notices: NoticeResponse[];
}

const CAT_COLOR: Record<string, string> = {
  긴급: "#EF4444",
  안내: "#3B82F6",
  교통: "#8B5CF6",
  굿즈: "#F59E0B",
};

function NoticeModal({
  notice,
  onClose,
}: {
  notice: NoticeResponse;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 560,
          maxHeight: "80vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {notice.pinned && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: CAT_COLOR["긴급"] ?? "var(--accent)",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                긴급
              </span>
            )}
            {notice.category && (
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  background: `${CAT_COLOR[notice.category] ?? "#888"}18`,
                  color: CAT_COLOR[notice.category] ?? "#888",
                  border: `1px solid ${CAT_COLOR[notice.category] ?? "#888"}40`,
                  flexShrink: 0,
                }}
              >
                {notice.category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              fontSize: 20,
              lineHeight: 1,
              flexShrink: 0,
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* 제목 */}
        <div
          style={{
            font: "700 20px/1.3 var(--display-font)",
            color: "var(--fg)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          {notice.title}
        </div>

        {/* 날짜 */}
        <div
          style={{
            font: "500 13px/1 var(--mono-font)",
            color: "var(--muted)",
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: "1px solid var(--border)",
          }}
        >
          {new Date(notice.updatedAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* 본문 — 줄바꿈 보존 */}
        <div
          style={{
            font: "400 15px/1.8 var(--body-font)",
            color: "var(--fg)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {notice.content}
        </div>
      </div>
    </div>
  );
}

export function NoticeTab({ notices }: NoticeTabProps) {
  const [selected, setSelected] = useState<NoticeResponse | null>(null);

  if (notices.length === 0) {
    return (
      <div
        style={{
          padding: "40px 0",
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 15,
        }}
      >
        등록된 공지가 없습니다.
      </div>
    );
  }

  return (
    <>
      {selected && (
        <NoticeModal notice={selected} onClose={() => setSelected(null)} />
      )}

      <div className="f-notice-list">
        {notices.map((n) => (
          <div
            key={n.id}
            className="f-notice-row"
            onClick={() => setSelected(n)}
            style={{ cursor: "pointer", transition: "background 0.12s" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--faint)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {n.pinned ? (
              <span className="pinned">긴급</span>
            ) : (
              <span style={{ width: 8 }} />
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="notice-title">{n.title}</div>
              {/* 미리보기: 첫 줄만 표시 */}
              <div
                className="notice-preview"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {n.content.split("\n").find((l) => l.trim()) ?? n.content}
              </div>
            </div>
            <div className="time">
              {new Date(n.updatedAt).toLocaleDateString("ko-KR")}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
