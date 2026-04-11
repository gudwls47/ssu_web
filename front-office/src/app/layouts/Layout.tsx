"use client";

import { type ReactNode } from "react";

import { Header } from "@/app/components/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-bg-white min-h-screen w-full">
      <Header />
      <main className="mx-auto w-full max-w-[1280px] p-5">{children}</main>
    </div>
  );
}
