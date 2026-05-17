import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import { MapPinDoc, MapPinInput, MapPinResponse } from "./festivals.type";

// festivals/{festivalId}/mapPins
const col = (festivalId: string) =>
  collection(db, "festivals", festivalId, "mapPins");

const docRef = (festivalId: string, pinId: string) =>
  doc(db, "festivals", festivalId, "mapPins", pinId);

function toResponse(
  festivalId: string,
  id: string,
  data: MapPinDoc,
): MapPinResponse {
  return { id, festivalId, ...data };
}

// ── READ: 핀 목록 ─────────────────────────────────────────
export const useGetMapPins = (festivalId: string) => {
  return useQuery({
    queryKey: ["mapPins", festivalId],
    queryFn: async () => {
      const snap = await getDocs(col(festivalId));
      return snap.docs.map((d) =>
        toResponse(festivalId, d.id, d.data() as MapPinDoc),
      );
    },
    enabled: Boolean(festivalId),
  });
};

// ── CREATE: 핀 추가 ───────────────────────────────────────
export const useCreateMapPin = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MapPinInput) => {
      const ref = await addDoc(col(festivalId), {
        ...input,
        createdAt: serverTimestamp(),
      });
      const snap = await getDoc(ref);
      return toResponse(festivalId, snap.id, snap.data() as MapPinDoc);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mapPins", festivalId] }),
  });
};

// ── UPDATE: 핀 위치/라벨 수정 ─────────────────────────────
export const useUpdateMapPin = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<MapPinInput> & { id: string }) => {
      await updateDoc(docRef(festivalId, id), {
        ...input,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mapPins", festivalId] }),
  });
};

// ── DELETE: 핀 삭제 ───────────────────────────────────────
export const useDeleteMapPin = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pinId: string) => {
      await deleteDoc(docRef(festivalId, pinId));
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mapPins", festivalId] }),
  });
};

// ── 전체 저장 (지도 에디터 저장 버튼) ─────────────────────
export const useSaveMapPins = (festivalId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pins: MapPinInput[]) => {
      const existing = await getDocs(col(festivalId));
      await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)));
      await Promise.all(
        pins.map((pin) =>
          addDoc(col(festivalId), { ...pin, updatedAt: serverTimestamp() }),
        ),
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["mapPins", festivalId] }),
  });
};
