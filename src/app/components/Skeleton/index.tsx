import React from "react";
import { cn } from "@/app/shadcn/lib/utils";

interface SkeletonProps {
  radius?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function Skeleton({
  radius = 4,
  className,
  children,
}: SkeletonProps) {
  return (
    <div
      className={cn("bg-primitive-neutral-100 animate-pulse", className)}
      style={{ borderRadius: `${radius}px` }}
    >
      {children}
    </div>
  );
}
