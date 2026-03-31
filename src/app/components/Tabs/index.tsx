"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/app/shadcn/lib/utils";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  href?: string;
  linkProps?: Omit<LinkProps, "href"> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;
  className?: string;
}

export interface TabsProps<T extends string> {
  tabItems: TabItem<T>[];
  wrapperClassName?: string;
  className?: string;
  value: T;
  onChange: (value: T) => void;
  fillType?: "auto" | "grow";
}

const tabItemCva = cva(
  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md cursor-pointer",
  {
    variants: {
      fillType: {
        grow: "flex-1 text-center",
        auto: "",
      },
      isSelected: {
        true: "bg-white text-slate-900 shadow-sm",
        false: "text-slate-500 hover:text-slate-700",
      },
    },
  },
);

export default function Tabs<T extends string>({
  tabItems,
  wrapperClassName,
  className,
  value,
  onChange,
  fillType = "auto",
}: TabsProps<T>) {
  return (
    <div className={cn("w-full", wrapperClassName)}>
      <div
        className={cn(
          "bg-bg-gray inline-flex items-center gap-1 rounded-[9px] p-1",
          fillType === "grow" && "w-full",
          className,
        )}
      >
        {tabItems.map((item) => {
          const isSelected = value === item.value;

          if (item.href) {
            return (
              <Link
                key={item.value}
                href={item.href}
                className={tabItemCva({
                  className: item.className,
                  fillType,
                  isSelected,
                })}
                onClick={() => onChange(item.value)}
                {...item.linkProps}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <button
              key={item.value}
              type="button"
              className={tabItemCva({
                className: item.className,
                fillType,
                isSelected,
              })}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
