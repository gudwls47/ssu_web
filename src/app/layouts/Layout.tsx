"use client";

import { useState, useEffect, type ReactNode } from "react";

import { Header } from "@/app/components/Header";

export type Palette = "festival" | "classic" | "experimental";
export type Mode = "light" | "dark";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [palette, setPalette] = useState<Palette>("festival");
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const savedPalette = localStorage.getItem(
      "festa-palette",
    ) as Palette | null;
    const savedMode = localStorage.getItem("festa-mode") as Mode | null;
    if (savedPalette) setPalette(savedPalette);
    if (savedMode) setMode(savedMode);
  }, []);

  const handlePalette = (p: Palette) => {
    setPalette(p);
    localStorage.setItem("festa-palette", p);
  };

  const handleMode = (m: Mode) => {
    setMode(m);
    localStorage.setItem("festa-mode", m);
  };

  return (
    <div
      className="festa min-h-screen w-full"
      data-palette={palette}
      data-mode={mode}
    >
      <Header
        palette={palette}
        mode={mode}
        onPaletteChange={handlePalette}
        onModeChange={handleMode}
      />
      <main className="f-wrap">{children}</main>
    </div>
  );
}
