"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button, TouchButton } from "@/app/shadcn/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/app/shadcn/components/ui/drawer";
import { cn } from "@/app/shadcn/lib/utils";

const NAV_ITEMS = [
  { label: "축제", href: "/" },
  { label: "커뮤니티", href: "/community" },
  { label: "공지", href: "/notice" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bb-border-base sticky top-0 z-40 w-full bg-bg-white">
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-5 md:h-[72px]">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-txt-primary md:text-2xl">
          FESTIVAL
        </Link>

        {/* PC 네비게이션 */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-button-primary",
                pathname === item.href ? "text-button-primary" : "text-txt-base",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <TouchButton size={40}>
                <Menu className="size-6 text-txt-base" />
              </TouchButton>
            </DrawerTrigger>
            <DrawerContent className="w-[280px]">
              <DrawerHeader className="flex items-center justify-between border-b px-5 py-4">
                <DrawerTitle className="text-lg font-bold">메뉴</DrawerTitle>
                <DrawerClose asChild>
                  <TouchButton size={32}>
                    <X className="size-5 text-txt-base" />
                  </TouchButton>
                </DrawerClose>
              </DrawerHeader>
              <nav className="flex flex-col p-5">
                {NAV_ITEMS.map((item) => (
                  <DrawerClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "py-4 text-lg font-medium transition-colors",
                        pathname === item.href
                          ? "text-button-primary"
                          : "text-txt-base",
                      )}
                    >
                      {item.label}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
