import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import type { FestivalResponse, CommentTag } from "./festivals.type";

// ── 참여 여부 확인 ────────────────────────────────────────
export const useIsJoined = (
  uid: string | null | undefined,
  festivalId: string,
) => {
  return useQuery({
    queryKey: ["join", uid, festivalId],
    queryFn: async () => {
      if (!uid) return false;
      const snap = await getDoc(doc(db, "users", uid, "joins", festivalId));
      return snap.exists();
    },
    enabled: Boolean(uid && festivalId),
  });
};

// ── 참여/취소 토글 ────────────────────────────────────────
export const useToggleJoin = (
  uid: string | null | undefined,
  fest: FestivalResponse,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ joined }: { joined: boolean }) => {
      if (uid == null) return;
      const joinRef = doc(db, "users", uid, "joins", fest.id);
      const festRef = doc(db, "festivals", fest.id);
      if (joined) {
        await deleteDoc(joinRef);
        await updateDoc(festRef, { participants: increment(-1) });
      } else {
        await setDoc(joinRef, {
          festivalId: fest.id,
          name: fest.name,
          school: fest.school,
          start: fest.start,
          end: fest.end,
          thumbnail: fest.thumbnail ?? "",
          joinedAt: serverTimestamp(),
        });
        await updateDoc(festRef, { participants: increment(1) });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["join", uid, fest.id] });
      qc.invalidateQueries({ queryKey: ["myFestivals", uid] });
      qc.invalidateQueries({ queryKey: ["festival", fest.id] });
    },
  });
};

// ── 내가 참여한 축제 ──────────────────────────────────────
export interface JoinRecord {
  festivalId: string;
  name: string;
  school: string;
  start: string;
  end: string;
  thumbnail: string;
  joinedAt: Timestamp;
}

export const useGetMyFestivals = (uid: string | null | undefined) => {
  return useQuery({
    queryKey: ["myFestivals", uid],
    queryFn: async () => {
      if (!uid) return [] as JoinRecord[];
      const snap = await getDocs(collection(db, "users", uid, "joins"));
      const docs = snap.docs.map((d) => d.data() as JoinRecord);
      return docs.sort(
        (a, b) =>
          (b.joinedAt?.toMillis?.() ?? 0) - (a.joinedAt?.toMillis?.() ?? 0),
      );
    },
    enabled: Boolean(uid),
  });
};

// ── 내가 남긴 톡 ──────────────────────────────────────────
export interface MyComment {
  id: string;
  content: string;
  festivalId: string;
  createdAt: Timestamp;
  tag?: CommentTag;
}

export const useGetMyComments = (uid: string | null | undefined) => {
  return useQuery({
    queryKey: ["myComments", uid],
    queryFn: async () => {
      if (!uid) return [] as MyComment[];
      const q = query(
        collection(db, "festival_comments"),
        where("createdUser", "==", uid),
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as MyComment[];
      return docs.sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
      );
    },
    enabled: Boolean(uid),
  });
};
