import type { ReactNode } from "react";
import AdminSideMenu from "@/app/components/SideMenu/AdminSideMenu";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="festa"
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
    >
      <AdminSideMenu />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}
