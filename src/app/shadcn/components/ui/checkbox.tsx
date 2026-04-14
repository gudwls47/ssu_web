"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> {
  label?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, label, id, indeterminate, disabled, checked, ...props },
    ref,
  ) => (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          `peer bs-border-base data-[state=checked]:bg-brand-primary data-[state=checked]:bs-brand-primary disabled:bg-bg-gray! disabled:text-icon-disabled! disabled:bs-border-base! size-[22px] shrink-0 rounded-[4px] disabled:cursor-not-allowed data-[state=checked]:text-white`,
          className,
        )}
        disabled={indeterminate || disabled}
        checked={indeterminate || checked}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center")}
        >
          {indeterminate ? (
            <Minus className="size-[20px]" color={theme.colors.icon.disabled} />
          ) : (
            <Check
              className="size-[20px]"
              color={
                disabled ? theme.colors.icon.disabled : theme.colors.icon.white
              }
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          className="text-txt-base text-sm text-[14px] leading-1.5 font-medium tracking-[0.35px]"
          htmlFor={id}
        >
          {label}
        </label>
      )}
    </div>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
