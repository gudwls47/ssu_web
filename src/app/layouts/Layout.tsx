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

  // 모든 .f-day-row 에 마우스 드래그 스크롤 적용
  useEffect(() => {
    let active = false;
    let el: HTMLElement | null = null;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    const findRow = (t: EventTarget | null): HTMLElement | null => {
      let node = t as HTMLElement | null;
      while (node) {
        if (node.classList?.contains("f-day-row")) return node;
        node = node.parentElement;
      }
      return null;
    };

    const onDown = (e: MouseEvent) => {
      el = findRow(e.target);
      if (!el) return;
      active = true;
      moved = false;
      startX = e.pageX;
      scrollLeft = el.scrollLeft;
    };

    const onMove = (e: MouseEvent) => {
      if (!active || !el) return;
      const dx = e.pageX - startX;
      if (!moved && Math.abs(dx) < 5) return;
      moved = true;
      e.preventDefault();
      el.scrollLeft = scrollLeft - dx;
      el.style.cursor = "grabbing";
    };

    const onUp = () => {
      if (el) el.style.cursor = "";
      active = false;
      el = null;
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
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
