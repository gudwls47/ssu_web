import React from "react";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { theme } from "@/theme/theme";

export interface ChipProps {
  icon?: React.ReactNode;
  label: string;
  isDeletable?: boolean;
  onClickClose?: () => void;
  className?: string;
  variant?: keyof typeof variant;
}

const variant = {
  gray: "bg-bg-gray text-txt-base bs-bg-gray",
  outline: "bg-bg-white bs-border-base text-txt-base",
  primary: "bg-bg-primary text-txt-primary bs-bg-primary",
  info: "bg-primitive-blue-50 text-status-info bs-primitive-blue-50",
  error: "bg-primitive-red-50 text-status-error bs-primitive-red-50",
  warning:
    "text-primitive-yellow-500 bg-primitive-yellow-50 bs-primitive-yellow-50",
  success:
    "bg-primitive-green-50 text-primitive-green-500 bs-primitive-green-50",
};

const chipVariants = cva(
  "rounded-md gap-0.5 flex items-center px-xs py-xxs leading-[1.2] text-[12px] font-medium tracking-[-0.3px]",
  {
    variants: {
      variant,
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export default function Chip({
  variant,
  label,
  className,
  icon,
  isDeletable,
  onClickClose,
}: ChipProps) {
  return (
    <div className={chipVariants({ variant, className })}>
      {icon && <div>{icon}</div>}
      {label}
      {isDeletable && (
        <div className="cursor-pointer" onClick={onClickClose}>
          <X className="size-4" color={theme.colors.icon.disabled} />
        </div>
      )}
    </div>
  );
}
