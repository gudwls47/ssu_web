"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
} from "@/app/api/notices";
import type {
  NoticeResponse,
  NoticeInput,
  NoticeCategory,
} from "@/app/api/festivals.type";

const CATEGORIES: { value: NoticeCategory; label: string; color: string }[] = [
  { value: "긴급", label: "긴급", color: "var(--accent)" },
  { value: "안내", label: "안내", color: "var(--muted)" },
  { value: "교통", label: "교통", color: "var(--muted)" },
  { value: "굿즈", label: "굿즈", color: "var(--muted)" },
];

type ModalState =
  | null
  | { mode: "new" }
  | { mode: "edit"; notice: NoticeResponse };

function NoticeModal({
  initial,
  onClose,
  onSave,
  isPending,
}: {
  initial?: { title: string; content: string; category: NoticeCategory };
  onClose: () => void;
  onSave: (data: NoticeInput) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<NoticeCategory>(
    initial?.category ?? "안내",
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, content, category });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "grid",
        placeItems: "center",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 520,
          background: "var(--surface)",
          borderRadius: 20,
          padding: 28,
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontFamily: "var(--display-font)",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
          }}
        >
          {initial ? "공지 수정" : "새 공지 작성"}
        </div>

        {/* 카테고리 */}
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg)",
              marginBottom: 8,
            }}
          >
            카테고리
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border:
                    category === cat.value
                      ? "2px solid var(--accent)"
                      : "1.5px solid var(--border)",
                  background:
                    category === cat.value ? "var(--faint)" : "transparent",
                  color: category === cat.value ? "var(--fg)" : "var(--muted)",
                  fontFamily: "var(--mono-font)",
                  fontSize: 14,
                  fontWeight: category === cat.value ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {category === "긴급" && (
            <div
              style={{
                fontSize: 13,
                color: "var(--accent)",
                fontFamily: "var(--mono-font)",
                marginTop: 6,
              }}
            >
              목록 최상단에 빨간 뱃지와 함께 표시됩니다
            </div>
          )}
        </div>

        <label style={{ display: "block" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg)",
              marginBottom: 6,
            }}
          >
            제목
          </div>
          <input
            className="f-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목을 입력하세요"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </label>

        <label style={{ display: "block" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--fg)",
              marginBottom: 6,
            }}
          >
            내용
          </div>
          <textarea
            className="f-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력하세요"
            style={{
              height: 120,
              padding: 14,
              font: "400 14px/1.6 var(--body-font)",
              resize: "vertical",
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="f-btn ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="f-btn accent"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "저장 중…" : initial ? "저장" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NoticePage() {
  const params = useParams<{ id: string }>();
  const festivalId = params.id;

  const { data: notices = [], isLoading } = useGetNotices(festivalId);
  const createNotice = useCreateNotice(festivalId);
  const updateNotice = useUpdateNotice(festivalId);
  const deleteNotice = useDeleteNotice(festivalId);

  const [modal, setModal] = useState<ModalState>(null);

  const handleSave = (data: NoticeInput) => {
    if (modal === null) return;
    if (modal.mode === "new") {
      createNotice.mutate(data, { onSuccess: () => setModal(null) });
    } else {
      updateNotice.mutate(
        { id: modal.notice.id, ...data },
        { onSuccess: () => setModal(null) },
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteNotice.mutate(id);
  };

  const isPending = createNotice.isPending || updateNotice.isPending;

  if (isLoading) {
    return (
      <div
        style={{
          padding: 24,
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 15,
        }}
      >
        불러오는 중…
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono-font)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          총 {notices.length}개 공지
        </div>
        <button
          className="f-btn sm accent"
          onClick={() => setModal({ mode: "new" })}
        >
          ＋ 새 공지
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notices.map((n) => (
          <div
            key={n.id}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 14,
              alignItems: "center",
              padding: "14px 18px",
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Badge col */}
            <div style={{ width: 56 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 24,
                  padding: "0 8px",
                  borderRadius: 6,
                  background:
                    n.category === "긴급" ? "var(--accent)" : "var(--faint)",
                  color:
                    n.category === "긴급" ? "var(--accent-fg)" : "var(--muted)",
                  fontFamily: "var(--mono-font)",
                  fontSize: 12,
                  fontWeight: n.category === "긴급" ? 700 : 400,
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {n.category}
              </span>
            </div>

            {/* Content */}
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--fg)",
                  lineHeight: 1.3,
                }}
              >
                {n.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "var(--muted)",
                  marginTop: 3,
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {n.content}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono-font)",
                  fontSize: 13,
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {new Date(n.updatedAt).toLocaleDateString("ko-KR")}
              </span>
              <button
                className="f-btn ghost sm"
                onClick={() => setModal({ mode: "edit", notice: n })}
                style={{ padding: "0 12px" }}
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                disabled={deleteNotice.isPending}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: 18,
                  display: "grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {notices.length === 0 && (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 15,
              fontFamily: "var(--mono-font)",
              border: "1.5px dashed var(--border)",
              borderRadius: 14,
            }}
          >
            등록된 공지가 없습니다. 새 공지를 작성해보세요.
          </div>
        )}
      </div>

      {modal !== null && (
        <NoticeModal
          initial={
            modal.mode === "edit"
              ? {
                  title: modal.notice.title,
                  content: modal.notice.content,
                  category: modal.notice.category,
                }
              : void 0
          }
          onClose={() => setModal(null)}
          onSave={handleSave}
          isPending={isPending}
        />
      )}
    </div>
  );
}
