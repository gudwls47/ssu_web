"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    isViewMode?: boolean;
  }
>(({ className, isViewMode, disabled, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      `peer data-[state=checked]:bg-brand-primary disabled:bg-primitive-neutral-200! data-[state=unchecked]:bg-primitive-neutral-200 inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none disabled:cursor-not-allowed`,
      className,
    )}
    disabled={isViewMode ? true : disabled}
    style={{
      cursor: isViewMode || disabled ? "not-allowed" : void 0,
    }}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        `data-disabled:bg-natural-400 pointer-events-none block size-[24px] rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[25px] data-[state=unchecked]:translate-x-[3px]`,
      )}
      style={{
        backgroundColor: isViewMode ? theme.colors.bg.white : void 0,
      }}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
