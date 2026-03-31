"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/admin");
  };

  return (
    <div className="bb-border-base bg-bg-white flex h-[60px] items-center justify-between gap-4 px-6">
      <p className="text-txt-base text-base font-semibold">{title}</p>
      <p
        onClick={handleLogout}
        className="text-txt-base cursor-pointer text-sm"
      >
        로그아웃
      </p>
    </div>
  );
}
