"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface CardProps {
  title?: React.ReactNode;
  iconElement?: React.ReactNode;
  children: React.ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  footerElement?: React.ReactNode;
  collapsibleOptions?: {
    isShowFooter?: boolean;
  };
  titleWrapperClassName?: string;
  contentWrapperClassName?: string;
}

export default function Card({
  title,
  iconElement,
  children,
  isCollapsible = false,
  defaultOpen = true,
  footerElement,
  collapsibleOptions,
  titleWrapperClassName,
  contentWrapperClassName,
}: CardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bs-border-default bs-border-base overflow-hidden rounded-2xl">
      <div
        className={cn(
          "bg-bg-white flex w-full items-center justify-between p-4",
          open || collapsibleOptions?.isShowFooter ? "bb-border-base" : "",
          titleWrapperClassName,
        )}
      >
        <div className="flex w-0 grow items-center gap-2">
          {iconElement && (
            <div className="bg-bg-primary flex-center size-9 rounded-lg">
              {iconElement}
            </div>
          )}
          <div className="text-body2 w-0 grow font-semibold">{title}</div>
        </div>

        {isCollapsible && (
          <div className="flex-center bg-bg-white bs-border-base size-[36px] rounded-lg">
            <ChevronDown
              color={theme.colors.icon.base}
              className={cn(
                "size-6 cursor-pointer transition-transform duration-200",
                open ? "rotate-180" : "",
              )}
              onClick={() => setOpen(!open)}
            />
          </div>
        )}
      </div>
      <div
        className={cn("bg-bg-white px-4 py-6", contentWrapperClassName)}
        style={{
          display: open ? "block" : "none",
        }}
      >
        {children}
      </div>
      {footerElement && (
        <div
          className="bg-bg-primary p-4"
          style={{
            display:
              open || collapsibleOptions?.isShowFooter ? "block" : "none",
          }}
        >
          {footerElement}
        </div>
      )}
    </div>
  );
}
