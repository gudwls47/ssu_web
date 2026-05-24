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
  FestivalCommentDoc,
  FestivalCommentRequest,
  FestivalCommentResponse,
  FestivalDoc,
  FestivalInput,
  FestivalResponse,
  FestivalStatus,
  GetFestivalsParams,
  UserResponse,
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
function tsToIso(ts: unknown): string {
  if (!ts) return new Date().toISOString();
  if (typeof (ts as Timestamp).toDate === "function") {
    return (ts as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
}

function toResponse(id: string, data: FestivalDoc): FestivalResponse {
  const start = tsToIso(data.startDate).split("T")[0];
  const end = tsToIso(data.endDate).split("T")[0];
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
    ownerUid: data.ownerUid ?? "",
    mapImage: data.mapImage ?? "",
    address: data.address ?? "",
    lat: data.lat,
    lng: data.lng,
    start,
    end,
    status: deriveStatus(start, end),
    createdAt: tsToIso(data.createdAt),
    updatedAt: tsToIso(data.updatedAt),
    title: data.title ?? data.name,
  };
}

// ── FestivalInput → Firestore 저장 형식 ──────────────────
function toDoc(
  input: FestivalInput,
): Omit<FestivalDoc, "createdAt" | "updatedAt" | "ownerUid"> {
  return {
    title: input.name,
    name: input.name,
    nameEn: input.nameEn?.trim() ?? "",
    school: input.school,
    tagline: input.tagline ?? "",
    description: input.description ?? "",
    thumbnail: input.thumbnail ?? "",
    colors: input.colors ?? ["#FF1E7A", "#BDFF1E", "#2A0F4E"],
    participants: 0,
    address: input.address ?? "",
    lat: input.lat,
    lng: input.lng,
    startDate: Timestamp.fromDate(new Date(input.start)),
    endDate: Timestamp.fromDate(new Date(input.end)),
  };
}

// ── READ: 목록 ────────────────────────────────────────────
export const useGetFestivals = (
  params: GetFestivalsParams = {},
  options?: { staleTime?: number },
) => {
  return useQuery({
    queryKey: ["festivals", params],
    staleTime: options?.staleTime,
    queryFn: async () => {
      let q = query(collection(db, COL));

      // ownerUid 필터: 해당 관리자의 축제만 조회
      if (params.ownerUid) {
        q = query(q, where("ownerUid", "==", params.ownerUid));
        // ownerUid + status 복합 필터는 Firestore 복합 인덱스 필요 → 클라이언트에서 처리
        const snap = await getDocs(q);
        let results = snap.docs.map((d) =>
          toResponse(d.id, d.data() as FestivalDoc),
        );
        if (params.status) {
          results = results.filter((f) => f.status === params.status);
        }
        results.sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
        );
        return results.slice(0, params.size ?? 20);
      }

      // ownerUid 없이 전체 조회 (공개 페이지용)
      if (params.status === "LIVE") {
        // Firestore는 서로 다른 필드 부등호 조건 불가 → endDate >= now로만 필터 후 클라이언트 필터링
        const now = Timestamp.now();
        q = query(q, where("endDate", ">=", now), orderBy("endDate", "asc"));
        q = query(q, limit(params.size ?? 20));
        const snap = await getDocs(q);
        const all = snap.docs.map((d) =>
          toResponse(d.id, d.data() as FestivalDoc),
        );
        return all.filter((f) => f.status === "LIVE");
      } else if (params.status === "UPCOMING") {
        const now = Timestamp.now();
        q = query(q, where("startDate", ">", now));
        q = query(q, orderBy("startDate", "asc"));
      } else if (params.status === "ENDED") {
        const now = Timestamp.now();
        q = query(q, where("endDate", "<", now));
        q = query(q, orderBy("endDate", "desc"));
      } else {
        q = query(q, orderBy("startDate", "desc"));
      }

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
// ownerUid를 훅 파라미터로 받아서 컴포넌트에서 명시적으로 주입
export const useCreateFestival = (ownerUid: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FestivalInput) => {
      const ref = await addDoc(collection(db, COL), {
        ...toDoc(input),
        participants: 0,
        ownerUid,
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
      if (input.nameEn != null) updates.nameEn = input.nameEn ?? "";
      if (input.school) updates.school = input.school;
      if (input.tagline != null) updates.tagline = input.tagline;
      if (input.description != null) updates.description = input.description;
      if (input.thumbnail != null) updates.thumbnail = input.thumbnail;
      if (input.mapImage != null) updates.mapImage = input.mapImage;
      if (input.colors) updates.colors = input.colors;
      if (input.start)
        updates.startDate = Timestamp.fromDate(new Date(input.start));
      if (input.end) updates.endDate = Timestamp.fromDate(new Date(input.end));
      if (input.address != null) updates.address = input.address;
      if (input.lat != null) updates.lat = input.lat;
      if (input.lng != null) updates.lng = input.lng;

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
      await updateDoc(ref, {
        participants: current + 1,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ["festival", id] }),
  });
};

export const useGetFestivalComments = (festivalId: string) => {
  return useQuery({
    queryKey: ["festivalComments", festivalId],
    queryFn: async () => {
      let q = query(collection(db, "festival_comments"));

      q = query(q, where("festivalId", "==", festivalId));

      const snap = await getDocs(q);
      const comments = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FestivalCommentDoc,
      );

      // createdUser가 있는 경우 유저 정보 추가 로드
      const userIds = [
        ...new Set(
          comments
            .map((c) => c.createdUser)
            .filter((uid): uid is string => !!uid),
        ),
      ];

      const userMap: Record<string, any> = {};
      await Promise.all(
        userIds.map(async (uid) => {
          const user = await getUser(uid);
          if (user) {
            userMap[uid] = user;
          }
        }),
      );

      return comments.map((c) => ({
        ...c,
        createdUser: c.createdUser ? userMap[c.createdUser] : void 0,
      })) as FestivalCommentResponse[];
    },
  });
};

const getUser = async (id: string) => {
  const userSnap = await getDoc(doc(db, "users", id));
  if (userSnap.exists()) {
    return { id, ...userSnap.data() } as UserResponse;
  }
  return null;
};

export const useCreateFestivalComment = () => {
  return useMutation({
    mutationFn: async (input: FestivalCommentRequest) => {
      const payload: FestivalCommentRequest = {
        content: input.content,
        createdAt: input.createdAt,
        festivalId: input.festivalId,
      };

      if (input.createdUser) {
        payload.createdUser = input.createdUser;
      }

      const ref = await addDoc(collection(db, "festival_comments"), payload);
      const snap = await getDoc(ref);
      const data = snap.data() as FestivalCommentDoc;
      const response: FestivalCommentResponse = {
        id: snap.id,
        content: data.content,
        createdAt: data.createdAt,
        festivalId: data.festivalId,
      };

      if (input.createdUser) {
        const user = await getUser(input.createdUser);
        if (user) {
          response.createdUser = user;
        }
      }

      return response;
    },
  });
};
