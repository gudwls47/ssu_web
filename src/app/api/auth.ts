import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@/app/utils/firebase/auth";
import { db } from "@/app/utils/firebase/db";

// ── 유저 프로필 타입 ──────────────────────────────────────
export type UserRole = "user" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization: string; // 축제 주최자의 소속 기관 (일반 사용자는 "")
}

// ── Firestore에서 프로필 조회 ─────────────────────────────
async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid, ...snap.data() } as UserProfile;
}

// ── 현재 로그인 상태 + 역할 ──────────────────────────────
// user === undefined  → 확인 중 (로딩)
// user === null       → 비로그인
// user === User       → 로그인됨
export function useAuthState() {
  const [user, setUser] = useState<User | null | undefined>(void 0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setProfileLoading(true);
        try {
          const p = await fetchProfile(u.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });
  }, []);

  return {
    user,
    profile,
    isAdmin: profile?.role === "admin",
    // auth 상태 확인 중이거나 프로필 fetch 중일 때 loading = true
    loading: typeof user === "undefined" || profileLoading,
  };
}

// ── 로그인 ────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ── 회원가입 (역할 포함) ──────────────────────────────────
export async function signUp({
  email,
  password,
  displayName,
  role,
  organization = "",
}: {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  organization?: string;
}) {
  // 1. Firebase Auth 계정 생성
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // 2. 표시 이름 설정
  await updateProfile(cred.user, { displayName });

  // 3. Firestore에 프로필 저장
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    displayName,
    role,
    organization,
    createdAt: serverTimestamp(),
  });

  return cred;
}

// ── Google 로그인 ─────────────────────────────────────────
// 반환값:
//   { cred, isNewUser: true }  → Firestore 프로필 없음 → 역할 선택 필요
//   { cred, isNewUser: false } → 기존 유저 → 바로 리디렉트 가능
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);

  // Firestore 프로필 확인
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  const isNewUser = !snap.exists();

  if (!isNewUser) {
    return { cred, isNewUser: false, role: snap.data()!.role as UserRole };
  }

  // 신규 구글 유저: 기본 프로필은 저장하지 않음 — 역할 선택 후 저장
  return { cred, isNewUser: true, role: null };
}

// ── Google 신규 유저 프로필 저장 ──────────────────────────
export async function saveGoogleUserProfile({
  uid,
  email,
  displayName,
  role,
  organization = "",
}: {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization?: string;
}) {
  await setDoc(doc(db, "users", uid), {
    email,
    displayName,
    role,
    organization,
    createdAt: serverTimestamp(),
  });
}

// ── 로그아웃 ──────────────────────────────────────────────
export async function logOut() {
  return signOut(auth);
}
