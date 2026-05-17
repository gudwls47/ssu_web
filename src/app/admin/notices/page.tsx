"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "@/app/api/auth";
import { useGetFestivals } from "@/app/api/festivals";
import { useGetAllNotices } from "@/app/api/notices";

function fmtDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;
  return d.toLocaleDateString("ko-KR");
}

export default function AdminNoticesPage() {
  const { user } = useAuthState();
  const { data: festivals = [], isLoading: festLoading } = useGetFestivals({
    size: 50,
    ownerUid: user?.uid,
  });
  const { data: notices = [], isLoading: noticeLoading } = useGetAllNotices(
    festivals.map((f) => ({ id: f.id, name: f.name, colors: f.colors })),
  );

  const [filterFestId, setFilterFestId] = useState<string>("ALL");

  const filtered =
    filterFestId === "ALL"
      ? notices
      : notices.filter((n) => n.festivalId === filterFestId);

  const isLoading = festLoading || noticeLoading;

  return (
    <div style={{ padding: "24px 32px" }}>
      {/* Header */}
      <div
        style={{
          fontFamily: "var(--mono-font)",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 6,
        }}
      >
        NOTICES / 공지 관리
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: "var(--display-font)",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            lineHeight: 1,
          }}
        >
          공지{" "}
          <span
            style={{ color: "var(--muted)", fontSize: 22, fontWeight: 500 }}
          >
            {filtered.length}
          </span>
        </div>
      </div>

      {/* 축제 필터 칩 */}
      {festivals.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <button
            className="f-chip"
            data-active={filterFestId === "ALL" ? "true" : "false"}
            onClick={() => setFilterFestId("ALL")}
            style={{ height: 34, padding: "0 14px" }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>전체</span>
            <span
              style={{
                marginLeft: 6,
                fontFamily: "var(--mono-font)",
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              {notices.length}
            </span>
          </button>
          {festivals.map((f) => {
            const count = notices.filter((n) => n.festivalId === f.id).length;
            const [c0, c1] = f.colors;
            return (
              <button
                key={f.id}
                className="f-chip"
                data-active={filterFestId === f.id ? "true" : "false"}
                onClick={() => setFilterFestId(f.id)}
                style={{ height: 34, padding: "0 14px" }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${c0}, ${c1})`,
                    flexShrink: 0,
                    display: "inline-block",
                    marginRight: 6,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700 }}>{f.name}</span>
                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: "var(--mono-font)",
                    fontSize: 10,
                    opacity: 0.6,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 목록 */}
      {isLoading ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          불러오는 중…
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: 48,
            borderRadius: 14,
            border: "1.5px dashed var(--border)",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          {notices.length === 0 ? (
            <>
              등록된 공지가 없습니다.
              <br />
              <span
                style={{ marginTop: 8, display: "inline-block", fontSize: 11 }}
              >
                각 축제 편집 → 공지 탭에서 작성할 수 있어요.
              </span>
            </>
          ) : (
            "이 축제에 등록된 공지가 없습니다."
          )}
        </div>
      ) : (
        <div
          style={{
            borderRadius: 14,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          {filtered.map((notice, i) => {
            const [c0, c1] = notice.festivalColors ?? ["#FF1E7A", "#BDFF1E"];
            return (
              <Link
                key={notice.id}
                href={`/admin/festivals/${notice.festivalId}/notice`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* 긴급 표시 */}
                  <div style={{ width: 4, flexShrink: 0 }}>
                    {notice.pinned && (
                      <div
                        style={{
                          width: 4,
                          height: 36,
                          borderRadius: 2,
                          background: "#FF6B6B",
                        }}
                      />
                    )}
                  </div>

                  {/* 축제 컬러 도트 */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${c0}, ${c1})`,
                    }}
                  />

                  {/* 내용 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      {notice.pinned && (
                        <span
                          style={{
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontFamily: "var(--mono-font)",
                            fontWeight: 700,
                            background: "rgba(255,107,107,0.12)",
                            color: "#FF6B6B",
                          }}
                        >
                          긴급
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "var(--mono-font)",
                          color: "var(--muted)",
                          fontWeight: 500,
                        }}
                      >
                        {notice.festivalName}
                      </span>
                    </div>
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
                      {notice.title}
                    </div>
                    {notice.content && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--muted)",
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notice.content}
                      </div>
                    )}
                  </div>

                  {/* 시간 + 바로가기 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--mono-font)",
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {fmtDate(notice.createdAt)}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--mono-font)",
                        color: "var(--accent)",
                        opacity: 0.7,
                      }}
                    >
                      편집 →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
