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
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import {
  FestivalDoc,
  FestivalInput,
  FestivalResponse,
  FestivalStatus,
  GetFestivalsParams,
} from "./festivals.type";

const COL = "festivals";

// ── 날짜 → 상태 자동 계산 ─────────────────────────────────
function deriveStatus(start: string, end: string): FestivalStatus {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  e.setHours(23, 59, 59);
  if (now < s) return "UPCOMING";
  if (now > e) return "ENDED";
  return "LIVE";
}

// ── Firestore doc → FestivalResponse 변환 ────────────────
function toResponse(id: string, data: FestivalDoc): FestivalResponse {
  const start = (data.startDate as Timestamp).toDate().toISOString().split("T")[0];
  const end = (data.endDate as Timestamp).toDate().toISOString().split("T")[0];
  return {
    id,
    name: data.name,
    nameEn: data.nameEn,
    school: data.school,
    tagline: data.tagline,
    description: data.description,
    thumbnail: data.thumbnail,
    colors: data.colors,
    participants: data.participants,
    start,
    end,
    status: deriveStatus(start, end),
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
  };
}

// ── FestivalInput → Firestore 저장 형식 ──────────────────
function toDoc(input: FestivalInput): Omit<FestivalDoc, "createdAt" | "updatedAt"> {
  return {
    name: input.name,
    nameEn: input.nameEn,
    school: input.school,
    tagline: input.tagline ?? "",
    description: input.description ?? "",
    thumbnail: input.thumbnail ?? "",
    colors: input.colors ?? ["#FF1E7A", "#BDFF1E", "#2A0F4E"],
    participants: 0,
    startDate: Timestamp.fromDate(new Date(input.start)),
    endDate: Timestamp.fromDate(new Date(input.end)),
  };
}

// ── READ: 목록 ────────────────────────────────────────────
export const useGetFestivals = (params: GetFestivalsParams = {}) => {
  return useQuery({
    queryKey: ["festivals", params],
    queryFn: async () => {
      let q = query(collection(db, COL));

      if (params.status) {
        // 상태는 클라이언트에서 계산되므로 날짜 기준으로 필터링
        const now = Timestamp.now();
        if (params.status === "LIVE") {
          q = query(q, where("startDate", "<=", now), where("endDate", ">=", now));
        } else if (params.status === "UPCOMING") {
          q = query(q, where("startDate", ">", now));
        } else if (params.status === "ENDED") {
          q = query(q, where("endDate", "<", now));
        }
      }

      q = query(q, orderBy("startDate", params.orderByCreatedTimestamp ?? "desc"));
      q = query(q, limit(params.size ?? 20));

      const snap = await getDocs(q);
      return snap.docs.map((d) => toResponse(d.id, d.data() as FestivalDoc));
    },
  });
};

// ── READ: 단건 ────────────────────────────────────────────
export const useGetFestival = (id: string) => {
  return useQuery({
    queryKey: ["festival", id],
    queryFn: async () => {
      const snap = await getDoc(doc(db, COL, id));
      if (!snap.exists()) throw new Error("Festival not found");
      return toResponse(snap.id, snap.data() as FestivalDoc);
    },
    enabled: Boolean(id),
  });
};

// ── CREATE ────────────────────────────────────────────────
export const useCreateFestival = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FestivalInput) => {
      const ref = await addDoc(collection(db, COL), {
        ...toDoc(input),
        participants: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const snap = await getDoc(ref);
      return toResponse(snap.id, snap.data() as FestivalDoc);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["festivals"] }),
  });
};

// ── UPDATE ────────────────────────────────────────────────
export const useUpdateFestival = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<FestivalInput>) => {
      const ref = doc(db, COL, id);
      const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

      if (input.name) updates.name = input.name;
      if (input.nameEn) updates.nameEn = input.nameEn;
      if (input.school) updates.school = input.school;
      if (input.tagline !== undefined) updates.tagline = input.tagline;
      if (input.description !== undefined) updates.description = input.description;
      if (input.thumbnail !== undefined) updates.thumbnail = input.thumbnail;
      if (input.colors) updates.colors = input.colors;
      if (input.start) updates.startDate = Timestamp.fromDate(new Date(input.start));
      if (input.end) updates.endDate = Timestamp.fromDate(new Date(input.end));

      await updateDoc(ref, updates);
      const snap = await getDoc(ref);
      return toResponse(snap.id, snap.data() as FestivalDoc);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["festivals"] });
      qc.invalidateQueries({ queryKey: ["festival", id] });
    },
  });
};

// ── DELETE ────────────────────────────────────────────────
export const useDeleteFestival = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, COL, id));
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["festivals"] }),
  });
};

// ── 참여자 수 증가 ─────────────────────────────────────────
export const useIncrementParticipants = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const ref = doc(db, COL, id);
      const snap = await getDoc(ref);
      const current = (snap.data() as FestivalDoc).participants ?? 0;
      await updateDoc(ref, { participants: current + 1, updatedAt: serverTimestamp() });
    },
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ["festival", id] }),
  });
};
