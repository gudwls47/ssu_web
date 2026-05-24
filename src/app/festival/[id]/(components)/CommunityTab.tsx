"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useAuthState } from "@/app/api/auth";
import {
  useCreateFestivalComment,
  useGetFestivalComments,
} from "@/app/api/festivals";
import {
  FestivalCommentResponse,
  FestivalResponse,
} from "@/app/api/festivals.type";

interface CommunityTabProps {
  festival: FestivalResponse;
}

export function CommunityTab({ festival }: CommunityTabProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const { user } = useAuthState();
  const { mutate: createComment } = useCreateFestivalComment();
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { data: comments, isLoading } = useGetFestivalComments(festival.id);

  const send = () => {
    if (!text.trim() || isCreatingComment) {
      return;
    }
    setIsCreatingComment(true);
    createComment(
      {
        festivalId: festival.id,
        createdUser: user?.uid,
        content: text,
        createdAt: Timestamp.now(),
      },
      {
        onSuccess: (comment) => {
          queryClient.setQueryData(
            ["festivalComments", festival.id],
            (old: FestivalCommentResponse[]) => [comment, ...old],
          );
          setText("");
          setIsCreatingComment(false);
        },
        onError: () => {
          setIsCreatingComment(false);
        },
      },
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input
          className="f-input"
          placeholder="실시간으로 정보를 공유해보세요 · 익명"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          className="f-btn accent disabled:opacity-50"
          onClick={send}
          disabled={isCreatingComment || !text.trim()}
        >
          올리기
        </button>
      </div>
      {!comments || isLoading ? (
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
      ) : comments.length < 1 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          첫 번째 글을 작성해보세요!
        </div>
      ) : (
        <div className="f-comm-list">
          {comments.map((v) => (
            <div key={v.id} className="f-comm-row">
              <div className="head">
                <b>{v.createdUser ? v.createdUser.displayName : "익명"}</b>
                <span>·</span>
                <span>{v.createdAt.toDate().toLocaleString()}</span>
              </div>
              <div className="text">{v.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
