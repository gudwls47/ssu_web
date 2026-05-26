"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/api/auth";
import AdminSideMenu from "@/app/components/SideMenu/AdminSideMenu";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    // 비로그인 → 공통 로그인 페이지로
    if (!user) {
      router.replace("/login");
      return;
    }
    // 로그인은 됐지만 관리자 권한 없음 → 공개 페이지로
    if (profile && profile.role !== "admin") {
      router.replace("/festival");
    }
  }, [user, profile, loading, router]);

  // 확인 중 or 권한 없는 유저가 리디렉트 되기 전
  if (loading || !user || !profile || profile.role !== "admin") {
    return (
      <div
        className="festa"
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          color: "var(--muted)",
          fontFamily: "var(--mono-font)",
          fontSize: 13,
        }}
      >
        {!loading && user && profile?.role !== "admin"
          ? "관리자 권한이 없습니다."
          : "로딩 중…"}
      </div>
    );
  }

  return (
    <div
      className="festa"
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <AdminSideMenu user={user} profile={profile} />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
