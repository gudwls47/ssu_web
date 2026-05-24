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
  increment,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import { BoothDoc, BoothInput, BoothResponse } from "./festivals.type";

// festivals/{festivalId}/booths
const col = (festivalId: string) =>
  collection(db, "festivals", festivalId, "booths");

const docRef = (festivalId: string, boothId: string) =>
  doc(db, "festivals", festivalId, "booths", boothId);

function toResponse(
  festivalId: string,
  id: string,
  data: BoothDoc,
): BoothResponse {
  return { id, festivalId, ...data };
}

// ── READ: 부스 목록 ───────────────────────────────────────
export const useGetBooths = (festivalId: string) => {
  return useQuery({
    queryKey: ["booths", festivalId],
    queryFn: async () => {
      const q = query(col(festivalId), orderBy("order", "asc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) =>
        toResponse(festivalId, d.id, d.data() as BoothDoc),
      );
    },
    enabled: Boolean(festivalId),
  });
};

// ── CREATE ────────────────────────────────────────────────
export const useCreateBooth = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BoothInput) => {
      // 현재 부스 수를 order로 사용
      const snap = await getDocs(col(festivalId));
      const ref = await addDoc(col(festivalId), {
        ...input,
        order: snap.size,
        createdAt: serverTimestamp(),
      });
      const created = await getDoc(ref);
      return toResponse(festivalId, created.id, created.data() as BoothDoc);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths", festivalId] }),
  });
};

// ── UPDATE ────────────────────────────────────────────────
export const useUpdateBooth = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<BoothInput> & { id: string }) => {
      await updateDoc(docRef(festivalId, id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths", festivalId] }),
  });
};

// ── DELETE ────────────────────────────────────────────────
export const useDeleteBooth = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (boothId: string) => {
      await deleteDoc(docRef(festivalId, boothId));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths", festivalId] }),
  });
};

// ── 좋아요 / 싫어요 ──────────────────────────────────────────
export const useReactBooth = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      boothId,
      type,
      undo,
    }: {
      boothId: string;
      type: "likes" | "dislikes";
      undo?: boolean;
    }) => {
      await updateDoc(docRef(festivalId, boothId), {
        [type]: increment(undo ? -1 : 1),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths", festivalId] }),
  });
};

// ── 일괄 저장 (테이블 전체를 한 번에 저장) ──────────────────
export const useSaveBooths = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booths: (BoothInput & { id?: string })[]) => {
      // 기존 부스 전부 삭제 후 재등록
      const existing = await getDocs(col(festivalId));
      await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)));
      await Promise.all(
        booths.map(({ id: _id, ...rest }, i) =>
          addDoc(col(festivalId), {
            ...rest,
            order: i,
            updatedAt: serverTimestamp(),
          }),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["booths", festivalId] }),
  });
};
