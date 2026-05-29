"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  useChatMessages,
  useSendMessage,
  useChatEnabled,
} from "@/app/api/chat";

interface FloatingChatProps {
  festivalId: string;
  festivalName: string;
}

function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// 시간 포맷: HH:MM
function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function FloatingChat({ festivalId, festivalName }: FloatingChatProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const enabled = useChatEnabled(festivalId);
  const messages = useChatMessages(festivalId);
  const { send, sending } = useSendMessage(festivalId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 채팅창 열릴 때 스크롤 맨 아래로
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // 새 메시지 오면 자동 스크롤
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // 채팅 비활성화 시 패널 숨김
  if (enabled === false) return null;
  // 로딩 중엔 아직 렌더 안 함
  if (enabled === null) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const msg = text;
    setText("");
    await send(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!text.trim() || sending) return;
      const msg = text;
      setText("");
      void send(msg);
    }
  };

  return (
    <>
      {/* ── 채팅 패널 ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 320,
            height: 460,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            zIndex: 200,
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF1E7A",
                flexShrink: 0,
                boxShadow: "0 0 0 3px rgba(255,30,122,0.2)",
              }}
            />
            <span
              style={{
                flex: 1,
                fontWeight: 700,
                fontSize: 14,
                color: "var(--fg)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {festivalName}
            </span>
            <span
              style={{
                fontFamily: "var(--mono-font), monospace",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.06em",
              }}
            >
              LIVE
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                padding: 4,
                display: "flex",
                alignItems: "center",
                borderRadius: 6,
                flexShrink: 0,
              }}
            >
              <CloseIcon />
            </button>
          </div>

          {/* 메시지 목록 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "var(--muted)",
                  fontSize: 13,
                  textAlign: "center",
                  paddingTop: 40,
                }}
              >
                <ChatIcon />
                <span>아직 메시지가 없어요.</span>
                <span style={{ fontSize: 12 }}>첫 번째로 채팅해보세요!</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: msg.isAnon ? "var(--muted)" : "var(--accent)",
                      }}
                    >
                      {msg.displayName}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontFamily: "var(--mono-font), monospace",
                      }}
                    >
                      {fmtTime(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--faint)",
                      borderRadius: "3px 12px 12px 12px",
                      padding: "8px 11px",
                      fontSize: 14,
                      color: "var(--fg)",
                      lineHeight: 1.5,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "10px 12px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요…"
              maxLength={200}
              style={{
                flex: 1,
                background: "var(--faint)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "9px 12px",
                fontSize: 14,
                color: "var(--fg)",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,
                background:
                  sending || !text.trim() ? "var(--faint)" : "var(--accent)",
                color: sending || !text.trim() ? "var(--muted)" : "#fff",
                border: "none",
                borderRadius: 10,
                cursor: sending || !text.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, color 0.15s",
                flexDirection: "column",
              }}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* ── FAB 버튼 ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="실시간 채팅"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open ? "var(--fg)" : "var(--accent)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          boxShadow: open
            ? "0 4px 16px rgba(0,0,0,0.2)"
            : "0 4px 16px rgba(255,30,122,0.35)",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
}
