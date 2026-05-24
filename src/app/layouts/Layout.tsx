"use client";

import { useState, useEffect, type ReactNode } from "react";

import { Header } from "@/app/components/Header";

export type Palette = "festival" | "classic" | "experimental";
export type Mode = "light" | "dark";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("festa-mode") as Mode | null;
    if (savedMode) setMode(savedMode);
  }, []);

  const handleMode = (m: Mode) => {
    setMode(m);
    localStorage.setItem("festa-mode", m);
  };

  return (
    <div
      className="festa min-h-screen w-full"
      data-palette="festival"
      data-mode={mode}
    >
      <Header mode={mode} onModeChange={handleMode} />
      <main className="f-wrap">{children}</main>
    </div>
  );
}
