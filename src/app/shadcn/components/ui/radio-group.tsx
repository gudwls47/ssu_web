"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/app/shadcn/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps {
  size?: number;
  disabled?: boolean;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    RadioGroupItemProps
>(({ className, size = 18, disabled, checked, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      disabled={disabled}
      ref={ref}
      className={cn(
        `flex-center data-[state=checked]:bs-brand-primary data-[state=checked]:bg-bg-white disabled:bs-border-base! bs-border-base disabled:bg-bg-gray data-[state=checked]:[&_svg]:fill-brand-primary disabled:[&_svg]:fill-border-base! cursor-pointer rounded-full disabled:cursor-not-allowed`,
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={(e) => {
        if (disabled) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex-center size-[12px]">
        <Circle className="size-[12px] stroke-0" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
