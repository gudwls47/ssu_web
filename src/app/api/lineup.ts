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
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import { LineupDoc, LineupInput, LineupResponse } from "./festivals.type";

// festivals/{festivalId}/lineup
const col = (festivalId: string) =>
  collection(db, "festivals", festivalId, "lineup");

const docRef = (festivalId: string, lineupId: string) =>
  doc(db, "festivals", festivalId, "lineup", lineupId);

function toResponse(
  festivalId: string,
  id: string,
  data: LineupDoc,
): LineupResponse {
  return { id, festivalId, ...data };
}

// ── READ: 특정 날짜 라인업 ────────────────────────────────
export const useGetLineup = (festivalId: string, day?: string) => {
  return useQuery({
    queryKey: ["lineup", festivalId, day],
    queryFn: async () => {
      // 복합 인덱스 없이도 동작하도록 클라이언트에서 필터·정렬
      const snap = await getDocs(col(festivalId));
      const all = snap.docs.map((d) =>
        toResponse(festivalId, d.id, d.data() as LineupDoc),
      );
      const filtered = day ? all.filter((item) => item.day === day) : all;
      return filtered.sort((a, b) => a.order - b.order);
    },
    enabled: Boolean(festivalId),
  });
};

// ── READ: 전체 날짜 목록 ──────────────────────────────────
export const useGetLineupDays = (festivalId: string) => {
  return useQuery({
    queryKey: ["lineup-days", festivalId],
    queryFn: async () => {
      const snap = await getDocs(col(festivalId));
      const days = [
        ...new Set(snap.docs.map((d) => (d.data() as LineupDoc).day)),
      ];
      return days.sort();
    },
    enabled: Boolean(festivalId),
  });
};

// ── CREATE ────────────────────────────────────────────────
export const useCreateLineup = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LineupInput) => {
      // 같은 날짜의 기존 아이템 수를 order로 사용
      const existing = await getDocs(
        query(col(festivalId), where("day", "==", input.day)),
      );
      const ref = await addDoc(col(festivalId), {
        ...input,
        order: existing.size,
        createdAt: serverTimestamp(),
      });
      const created = await getDoc(ref);
      return toResponse(festivalId, created.id, created.data() as LineupDoc);
    },
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["lineup", festivalId, v.day] });
      qc.invalidateQueries({ queryKey: ["lineup-days", festivalId] });
    },
  });
};

// ── UPDATE ────────────────────────────────────────────────
export const useUpdateLineup = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<LineupInput> & { id: string }) => {
      await updateDoc(docRef(festivalId, id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lineup", festivalId] }),
  });
};

// ── DELETE ────────────────────────────────────────────────
export const useDeleteLineup = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lineupId: string) => {
      await deleteDoc(docRef(festivalId, lineupId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lineup", festivalId] }),
  });
};

// ── 날짜별 전체 저장 (라인업 에디터 저장 버튼) ────────────
export const useSaveLineupByDay = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      day,
      items,
    }: {
      day: string;
      items: LineupInput[];
    }) => {
      // 해당 날짜 기존 항목 삭제
      const existing = await getDocs(
        query(col(festivalId), where("day", "==", day)),
      );
      await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)));
      // 새로 저장
      await Promise.all(
        items.map((item, i) =>
          addDoc(col(festivalId), {
            ...item,
            day,
            order: i,
            updatedAt: serverTimestamp(),
          }),
        ),
      );
    },
    onSuccess: (_, { day }) => {
      qc.invalidateQueries({ queryKey: ["lineup", festivalId, day] });
      qc.invalidateQueries({ queryKey: ["lineup-days", festivalId] });
    },
  });
};
