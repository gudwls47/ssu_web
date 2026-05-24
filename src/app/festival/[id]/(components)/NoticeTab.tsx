"use client";

import type { NoticeResponse } from "@/app/api/festivals.type";

interface NoticeTabProps {
  notices: NoticeResponse[];
}

export function NoticeTab({ notices }: NoticeTabProps) {
  if (notices.length === 0) {
    return (
      <div
        style={{
          padding: "40px 0",
          textAlign: "center",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        등록된 공지가 없습니다.
      </div>
    );
  }

  return (
    <div className="f-notice-list">
      {notices.map((n) => (
        <div key={n.id} className="f-notice-row">
          {n.pinned ? (
            <span className="pinned">긴급</span>
          ) : (
            <span style={{ width: 8 }} />
          )}
          <div>
            <div className="notice-title">{n.title}</div>
            <div className="notice-preview">{n.content}</div>
          </div>
          <div className="time">
            {new Date(n.updatedAt).toLocaleDateString("ko-KR")}
          </div>
        </div>
      ))}
    </div>
  );
}
