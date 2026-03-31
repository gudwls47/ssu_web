"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSideMenu from "../components/SideMenu/AdminSideMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isLoginPage = pathname === "/admin";

  const getAdminToken = () => {
    return { accessToken: "example-token" };
  };

  useEffect(() => {
    const { accessToken } = getAdminToken();
    const isLoggedIn = !!accessToken;

    if (isLoggedIn && isLoginPage) {
      router.replace("/admin/dashboard");
      return;
    }

    if (!isLoggedIn && !isLoginPage) {
      router.replace("/admin");
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [pathname, router, isLoginPage]);

  // 로딩 중이거나 리다이렉트 중일 때
  if (isLoading || !isAuthorized) {
    return null;
  }

  // 로그인 페이지는 SideMenu 없이 렌더링
  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // 어드민 페이지는 SideMenu와 함께 렌더링
  return (
    <div className="flex min-h-screen">
      <AdminSideMenu />
      <div className="flex-1 bg-gray-50">{children}</div>
    </div>
  );
}
