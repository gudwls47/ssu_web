"use client";

import React from "react";

import {
  Drawer as ShadcnDrawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/shadcn/components/ui/drawer";
import { cn } from "@/app/shadcn/lib/utils";

export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  direction?: "left" | "right";
  width?: number;
  dismissible?: boolean;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export default function Drawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  direction = "right",
  width = 400,
  dismissible = true,
  contentClassName,
  headerClassName,
  footerClassName,
}: DrawerProps) {
  return (
    <ShadcnDrawer
      open={open}
      onOpenChange={onOpenChange}
      direction={direction}
      dismissible={dismissible}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        direction={direction}
        className={cn(contentClassName)}
        style={{ width: `${width}px` }}
      >
        {(title || description) && (
          <DrawerHeader className={cn(headerClassName)}>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-2">{children}</div>
        {footer && (
          <DrawerFooter className={cn(footerClassName)}>{footer}</DrawerFooter>
        )}
      </DrawerContent>
    </ShadcnDrawer>
  );
}

export { DrawerClose };
