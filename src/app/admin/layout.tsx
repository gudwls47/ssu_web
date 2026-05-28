"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_SIDEBAR_W } from "@/app/admin/constants";
import { useAuthState } from "@/app/api/auth";
import AdminSideMenu from "@/app/components/SideMenu/AdminSideMenu";
import type { Mode } from "@/app/layouts/Layout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuthState();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("festa-mode") as Mode | null;
    if (saved) setMode(saved);
  }, []);

  const handleMode = (m: Mode) => {
    setMode(m);
    localStorage.setItem("festa-mode", m);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (profile && profile.role !== "admin") {
      router.replace("/festival");
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile || profile.role !== "admin") {
    return (
      <div
        className="festa"
        data-mode={mode}
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          color: "var(--muted)",
          fontFamily: "var(--mono-font), monospace",
          fontSize: 15,
        }}
      >
        {!loading && user && profile?.role !== "admin"
          ? "관리자 권한이 없습니다."
          : "로딩 중…"}
      </div>
    );
  }

  return (
    <div className="festa" data-mode={mode} style={{ background: "var(--bg)" }}>
      <AdminSideMenu
        user={user}
        profile={profile}
        mode={mode}
        onModeChange={handleMode}
      />
      <main
        style={{
          marginLeft: ADMIN_SIDEBAR_W,
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
