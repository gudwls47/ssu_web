"use client";

import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";
import { Spinner } from "./spinner";

const variant = {
  ghost: "bg-transparent text-txt-base",
  primary: "bg-button-primary text-white hover:bg-button-primaryHover",
  blackFill: "bg-button-black text-white",
  secondary: "bg-button-gray text-txt-base hover:bg-button-grayHover",
  grayOutline: "bg-bg-white text-txt-base bs-button-outline",
  blackOutline: "bg-bg-white text-txt-base bs-button-black",
  error: "bg-bg-white text-button-error bs-button-error",
  errorFill: "bg-button-error text-white",
  warning: "bg-button-warning text-txt-error",
  primaryOutline: "bg-bg-white text-button-primary bs-button-primary",
};

export type ButtonVariants = keyof typeof variant;

const buttonVariants = cva(
  "flex items-center justify-center gap-1 whitespace-nowrap rounded-lg cursor-pointer transition-colors duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-button-gray disabled:text-txt-disabled disabled:border-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant,
      size: {
        xl: "px-lg h-[52px] gap-1",
        base: "px-lg h-[48px] gap-1",
        m: "px-lg h-[44px] gap-1",
        sm: "px-lg h-[40px] gap-1",
        xs: "px-m h-[36px] gap-0.5",
        xxs: "px-3 h-[24px] gap-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "base",
      asChild = false,
      href,
      target,
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const content = isLoading ? (
      <Spinner
        color={
          ["primary", "blackFill", "errorFill"].includes(variant || "primary")
            ? theme.colors.bg.white
            : theme.colors.icon.base
        }
        className={
          size === "sm"
            ? "size-5"
            : size === "xs" || size === "xxs"
              ? "size-4"
              : "size-6"
        }
      />
    ) : (
      children
    );

    if (href) {
      return (
        <Link href={href} target={target}>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            tabIndex={-1}
            {...props}
          >
            {content}
          </Comp>
        </Link>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export interface TouchButtonProps extends Omit<
  ButtonProps,
  "size" | "variant"
> {
  size?: number;
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      className,
      size = 48,
      asChild = false,
      href,
      target,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    if (href) {
      return (
        <Link href={href} target={target}>
          <Comp
            className={cn(buttonVariants({ variant: "ghost", className }))}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            ref={ref}
            tabIndex={-1}
            {...props}
          />
        </Link>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant: "ghost", className }))}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
TouchButton.displayName = "TouchButton";

export { Button, TouchButton, buttonVariants };
