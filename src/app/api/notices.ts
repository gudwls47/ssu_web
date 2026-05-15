import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import { NoticeDoc, NoticeInput, NoticeResponse } from "./festivals.type";

// festivals/{festivalId}/notices
const col = (festivalId: string) =>
  collection(db, "festivals", festivalId, "notices");

const docRef = (festivalId: string, noticeId: string) =>
  doc(db, "festivals", festivalId, "notices", noticeId);

function toResponse(festivalId: string, id: string, data: NoticeDoc): NoticeResponse {
  return {
    id,
    festivalId,
    title: data.title,
    content: data.content,
    pinned: data.pinned,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
  };
}

// ── READ: 공지 목록 (고정 → 최신순) ─────────────────────
export const useGetNotices = (festivalId: string) => {
  return useQuery({
    queryKey: ["notices", festivalId],
    queryFn: async () => {
      const q = query(col(festivalId), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) =>
        toResponse(festivalId, d.id, d.data() as NoticeDoc),
      );
      // 고정 공지 최상단 정렬
      return [...list.filter((n) => n.pinned), ...list.filter((n) => !n.pinned)];
    },
    enabled: Boolean(festivalId),
  });
};

// ── READ: 단건 ────────────────────────────────────────────
export const useGetNotice = (festivalId: string, noticeId: string) => {
  return useQuery({
    queryKey: ["notice", festivalId, noticeId],
    queryFn: async () => {
      const snap = await getDoc(docRef(festivalId, noticeId));
      if (!snap.exists()) throw new Error("Notice not found");
      return toResponse(festivalId, snap.id, snap.data() as NoticeDoc);
    },
    enabled: Boolean(festivalId) && Boolean(noticeId),
  });
};

// ── CREATE ────────────────────────────────────────────────
export const useCreateNotice = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NoticeInput) => {
      const ref = await addDoc(col(festivalId), {
        title: input.title,
        content: input.content,
        pinned: input.pinned ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const snap = await getDoc(ref);
      return toResponse(festivalId, snap.id, snap.data() as NoticeDoc);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices", festivalId] }),
  });
};

// ── UPDATE ────────────────────────────────────────────────
export const useUpdateNotice = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<NoticeInput> & { id: string }) => {
      await updateDoc(docRef(festivalId, id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices", festivalId] }),
  });
};

// ── DELETE ────────────────────────────────────────────────
export const useDeleteNotice = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noticeId: string) => {
      await deleteDoc(docRef(festivalId, noticeId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices", festivalId] }),
  });
};

// ── 고정 토글 ─────────────────────────────────────────────
export const useTogglePin = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      await updateDoc(docRef(festivalId, id), {
        pinned,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices", festivalId] }),
  });
};
