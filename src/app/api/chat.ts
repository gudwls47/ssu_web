import { useEffect, useState, useCallback } from "react";
import { signInAnonymously } from "firebase/auth";
import {
  ref,
  push,
  onValue,
  off,
  set,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { auth } from "@/app/utils/firebase/auth";
import { realtime } from "@/app/utils/firebase/db";

// ── 타입 ──────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  isAnon: boolean;
  createdAt: number;
}

// ── 익명 닉네임 ───────────────────────────────────────────
function anonName() {
  return `익명${Math.floor(Math.random() * 9000) + 1000}`;
}

// ── 유저 확보 (없으면 익명 로그인) ────────────────────────
async function ensureUser(): Promise<{
  uid: string;
  displayName: string;
  isAnon: boolean;
}> {
  let u = auth.currentUser;
  if (!u) {
    const cred = await signInAnonymously(auth);
    u = cred.user;
  }
  const isAnon = u.isAnonymous;
  const displayName = isAnon
    ? (u.displayName ?? anonName())
    : (u.displayName ?? u.email?.split("@")[0] ?? "사용자");
  return { uid: u.uid, displayName, isAnon };
}

// ── 메시지 목록 실시간 구독 ───────────────────────────────
export function useChatMessages(festivalId: string | null, limit = 100) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!festivalId) return;
    const msgRef = query(
      ref(realtime, `chats/${festivalId}/messages`),
      orderByChild("createdAt"),
      limitToLast(limit),
    );
    onValue(msgRef, (snap) => {
      const arr: ChatMessage[] = [];
      snap.forEach((child) => {
        arr.push({
          id: child.key!,
          ...(child.val() as Omit<ChatMessage, "id">),
        });
      });
      setMessages(arr);
    });
    return () => off(msgRef);
  }, [festivalId, limit]);

  return messages;
}

// ── 메시지 전송 ───────────────────────────────────────────
export function useSendMessage(festivalId: string | null) {
  const [sending, setSending] = useState(false);

  const send = useCallback(
    async (text: string) => {
      if (!festivalId || !text.trim()) return;
      setSending(true);
      try {
        const { uid, displayName, isAnon } = await ensureUser();
        await push(ref(realtime, `chats/${festivalId}/messages`), {
          text: text.trim(),
          uid,
          displayName,
          isAnon,
          createdAt: Date.now(),
        });
      } finally {
        setSending(false);
      }
    },
    [festivalId],
  );

  return { send, sending };
}

// ── 채팅 활성 여부 실시간 구독 ────────────────────────────
export function useChatEnabled(festivalId: string | null) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!festivalId) return;
    const r = ref(realtime, `chats/${festivalId}/enabled`);
    onValue(r, (snap) => {
      setEnabled(snap.val() ?? false);
    });
    return () => off(r);
  }, [festivalId]);

  return enabled;
}

// ── 채팅 활성 여부 설정 (어드민용) ────────────────────────
export async function setChatEnabled(festivalId: string, enabled: boolean) {
  await set(ref(realtime, `chats/${festivalId}/enabled`), enabled);
}
