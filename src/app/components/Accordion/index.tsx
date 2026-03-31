import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variants?: "default" | "outline" | "primary";
  chevronType?: "arrow" | "symbol";
}

const wrapperCva = cva("", {
  variants: {
    variants: {
      default: "bb-border-base py-lg",
      outline: "bs-border-base p-lg rounded-lg",
      primary: "bs-border-primary rounded-lg",
    },
  },
});

const titleCva = cva("flex items-center gap-2", {
  variants: {
    variants: {
      default: "",
      outline: "",
      primary: "bg-bg-primary p-lg",
    },
  },
});

const contentCva = cva("", {
  variants: {
    variants: {
      default: "mt-2",
      outline: "mt-2",
      primary: "p-lg",
    },
  },
});

export default function Accordion({
  title,
  children,
  defaultOpen = false,
  variants = "default",
  chevronType = "arrow",
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  const renderChevron = () => {
    if (chevronType === "arrow") {
      if (variants === "primary") {
        return (
          <div className="flex-center bg-bg-white bs-border-primary size-[36px] rounded-lg">
            <ChevronDown
              color={theme.colors.icon.base}
              className={cn(
                "size-6 transition-transform duration-200",
                open ? "rotate-180" : "",
              )}
            />
          </div>
        );
      }
      return (
        <ChevronDown
          color={theme.colors.icon.base}
          className={cn(
            "size-6 transition-transform duration-200",
            open ? "rotate-180" : "",
          )}
        />
      );
    }

    if (open) {
      return <Minus color={theme.colors.icon.base} />;
    }

    return <Plus color={theme.colors.icon.base} />;
  };

  return (
    <div
      className={cn(wrapperCva({ variants }))}
      onClick={() => setOpen(!open)}
    >
      <div className={cn(titleCva({ variants }))}>
        <p className="w-0 grow text-[16px] leading-normal font-semibold">
          {title}
        </p>

        {renderChevron()}
      </div>
      {open && <div className={cn(contentCva({ variants }))}>{children}</div>}
    </div>
  );
}
