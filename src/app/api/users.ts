import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/app/utils/firebase/db";
import type { UserRole } from "@/app/api/auth";

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization: string;
  createdAt: Timestamp | null;
}

// ── 전체 유저 조회 ─────────────────────────────────────────
export function useGetAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async (): Promise<UserRecord[]> => {
      const snap = await getDocs(
        query(collection(db, "users"), orderBy("createdAt", "desc")),
      );
      return snap.docs.map(
        (d) =>
          ({
            uid: d.id,
            email: d.data().email ?? "",
            displayName: d.data().displayName ?? "",
            role: d.data().role ?? "user",
            organization: d.data().organization ?? "",
            createdAt: d.data().createdAt ?? null,
          }) satisfies UserRecord,
      );
    },
  });
}

// ── 소속 기관 수정 ─────────────────────────────────────────
export function useUpdateUserOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      uid,
      organization,
    }: {
      uid: string;
      organization: string;
    }) => {
      await updateDoc(doc(db, "users", uid), { organization });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

// ── 역할 변경 (승인 / 취소) ────────────────────────────────
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, role }: { uid: string; role: UserRole }) => {
      await updateDoc(doc(db, "users", uid), { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
