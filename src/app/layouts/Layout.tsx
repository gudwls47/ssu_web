"use client";

import { type ReactNode } from "react";

import { Header } from "@/app/components/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="festa min-h-screen w-full">
      <Header />
      <main className="f-wrap">{children}</main>
    </div>
  );
}
