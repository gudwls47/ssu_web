"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminLayout from "./AdminLayout";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // 일반 유저 레이아웃
  return <div className="min-h-screen">{children}</div>;
}
