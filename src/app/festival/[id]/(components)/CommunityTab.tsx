"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useAuthState } from "@/app/api/auth";
import {
  useCreateFestivalComment,
  useDeleteFestivalComment,
  useGetFestivalComments,
} from "@/app/api/festivals";
import type {
  CommentTag,
  FestivalCommentResponse,
  FestivalResponse,
} from "@/app/api/festivals.type";

interface CommunityTabProps {
  festival: FestivalResponse;
}

const COMMENT_TAGS: CommentTag[] = ["라인업", "지도", "부스", "공지"];

const TAG_COLOR: Record<CommentTag, string> = {
  라인업: "#FF1E7A",
  지도: "#2563EB",
  부스: "#16A34A",
  공지: "#D97706",
};

function TrashIcon() {
  return (
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function CommunityTab({ festival }: CommunityTabProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [selectedTag, setSelectedTag] = useState<CommentTag | null>(null);
  const [filterTag, setFilterTag] = useState<CommentTag | "ALL">("ALL");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);

  const { user, loading: authLoading } = useAuthState();
  const { mutate: createComment } = useCreateFestivalComment();
  const { mutate: deleteComment } = useDeleteFestivalComment(festival.id);
  const { data: comments, isLoading } = useGetFestivalComments(festival.id);

  const send = () => {
    if (!text.trim() || isCreatingComment || authLoading) return;
    setIsCreatingComment(true);
    // UID는 항상 저장 (삭제 권한 체크용), 익명이면 authorName만 저장 안 함
    const createdUser = user?.uid ?? void 0;
    const authorName =
      !isAnonymous && user
        ? (user.displayName ?? user.email?.split("@")[0] ?? void 0)
        : void 0;
    createComment(
      {
        festivalId: festival.id,
        createdUser,
        authorName,
        content: text,
        createdAt: Timestamp.now(),
        tag: selectedTag ?? void 0,
      },
      {
        onSuccess: (comment) => {
          queryClient.setQueryData(
            ["festivalComments", festival.id],
            (old: FestivalCommentResponse[]) => [comment, ...(old ?? [])],
          );
          setText("");
          setSelectedTag(null);
          setIsCreatingComment(false);
        },
        onError: () => {
          setIsCreatingComment(false);
        },
      },
    );
  };

  const handleDelete = (commentId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("이 글을 삭제할까요?")) return;
    deleteComment(commentId);
  };

  const filtered =
    filterTag === "ALL"
      ? (comments ?? [])
      : (comments ?? []).filter((c) => c.tag === filterTag);

  const isLoggedIn = !authLoading && !!user;
  const inputPlaceholder =
    isLoggedIn && !isAnonymous
      ? "실시간으로 정보를 공유해보세요"
      : "실시간으로 정보를 공유해보세요 · 익명";

  return (
    <div>
      {/* 입력창 */}
      <div
        style={{
          border: "1.5px solid var(--border)",
          borderRadius: 14,
          padding: "12px 14px",
          marginBottom: 16,
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* 태그 선택 + 익명 체크 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {COMMENT_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: `1.5px solid ${selectedTag === t ? TAG_COLOR[t] : "var(--border)"}`,
                  background:
                    selectedTag === t ? `${TAG_COLOR[t]}18` : "transparent",
                  color: selectedTag === t ? TAG_COLOR[t] : "var(--muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 익명 토글 (로그인 시에만 표시) */}
          {isLoggedIn && (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                cursor: "pointer",
                fontSize: 12,
                color: isAnonymous ? "var(--fg)" : "var(--muted)",
                fontWeight: 500,
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 18,
                  borderRadius: 9,
                  background: isAnonymous ? "var(--accent)" : "var(--border)",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
                onClick={() => setIsAnonymous((v) => !v)}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 2,
                    left: isAnonymous ? 16 : 2,
                    transition: "left 0.2s",
                  }}
                />
              </div>
              익명
            </label>
          )}
        </div>

        {/* 작성자 표시 */}
        {isLoggedIn && !isAnonymous && (
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              fontFamily: "var(--mono-font)",
            }}
          >
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {user.displayName ?? user.email?.split("@")[0]}
            </span>{" "}
            으로 올리기
          </div>
        )}

        {/* 입력 + 올리기 */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="f-input"
            placeholder={inputPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{ flex: 1 }}
          />
          <button
            className="f-btn accent"
            onClick={send}
            disabled={isCreatingComment || !text.trim() || authLoading}
            style={{
              opacity:
                isCreatingComment || !text.trim() || authLoading ? 0.5 : 1,
            }}
          >
            올리기
          </button>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="f-day-row" style={{ marginBottom: 12 }}>
        <button
          className="f-chip"
          data-active={filterTag === "ALL" ? "true" : "false"}
          onClick={() => setFilterTag("ALL")}
        >
          전체
        </button>
        {COMMENT_TAGS.map((t) => (
          <button
            key={t}
            className="f-chip"
            data-active={filterTag === t ? "true" : "false"}
            onClick={() => setFilterTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 댓글 목록 */}
      {isLoading ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          로딩중입니다.
        </div>
      ) : filtered.length < 1 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          {filterTag === "ALL"
            ? "첫 번째 글을 작성해보세요!"
            : `${filterTag} 관련 글이 없어요.`}
        </div>
      ) : (
        <div className="f-comm-list">
          {filtered.map((v) => {
            const isMine =
              isLoggedIn && !!user && v.createdUserUid === user.uid;
            return (
              <div key={v.id} className="f-comm-row">
                <div
                  className="head"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <b>{v.authorName || "익명"}</b>
                  <span>·</span>
                  <span>
                    {(v.createdAt as Timestamp)
                      .toDate()
                      .toLocaleString("ko-KR")}
                  </span>
                  {v.tag && (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        background: `${TAG_COLOR[v.tag]}18`,
                        color: TAG_COLOR[v.tag],
                        border: `1px solid ${TAG_COLOR[v.tag]}40`,
                      }}
                    >
                      # {v.tag}
                    </span>
                  )}
                  {/* 내 글 삭제 버튼 */}
                  {isMine && (
                    <button
                      onClick={() => handleDelete(v.id)}
                      title="삭제"
                      style={{
                        marginLeft: "auto",
                        padding: "3px 8px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "transparent",
                        color: "var(--muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        transition: "color 0.1s, border-color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FF6B6B";
                        e.currentTarget.style.borderColor = "#FF6B6B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <TrashIcon />
                      삭제
                    </button>
                  )}
                </div>
                <div className="text">{v.content}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
