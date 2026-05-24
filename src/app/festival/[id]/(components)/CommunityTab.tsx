"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useAuthState } from "@/app/api/auth";
import {
  useCreateFestivalComment,
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

export function CommunityTab({ festival }: CommunityTabProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [selectedTag, setSelectedTag] = useState<CommentTag | null>(null);
  const [filterTag, setFilterTag] = useState<CommentTag | "ALL">("ALL");

  const { user } = useAuthState();
  const { mutate: createComment } = useCreateFestivalComment();
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { data: comments, isLoading } = useGetFestivalComments(festival.id);

  const send = () => {
    if (!text.trim() || isCreatingComment) return;
    setIsCreatingComment(true);
    createComment(
      {
        festivalId: festival.id,
        createdUser: user?.uid,
        content: text,
        createdAt: Timestamp.now(),
        tag: selectedTag ?? void 0,
      },
      {
        onSuccess: (comment) => {
          queryClient.setQueryData(
            ["festivalComments", festival.id],
            (old: FestivalCommentResponse[]) => [comment, ...old],
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

  const filtered =
    filterTag === "ALL"
      ? (comments ?? [])
      : (comments ?? []).filter((c) => c.tag === filterTag);

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
        {/* 태그 선택 칩 */}
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
          {selectedTag && (
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                alignSelf: "center",
                marginLeft: 2,
              }}
            >
              # {selectedTag} 태그가 붙어요
            </span>
          )}
        </div>

        {/* 입력 + 올리기 */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="f-input"
            placeholder="실시간으로 정보를 공유해보세요 · 익명"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{ flex: 1 }}
          />
          <button
            className="f-btn accent"
            onClick={send}
            disabled={isCreatingComment || !text.trim()}
            style={{ opacity: isCreatingComment || !text.trim() ? 0.5 : 1 }}
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
          {filtered.map((v) => (
            <div key={v.id} className="f-comm-row">
              <div className="head">
                <b>{v.createdUser ? v.createdUser.displayName : "익명"}</b>
                <span>·</span>
                <span>
                  {(v.createdAt as Timestamp).toDate().toLocaleString("ko-KR")}
                </span>
                {v.tag && (
                  <span
                    style={{
                      marginLeft: 4,
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
              </div>
              <div className="text">{v.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
