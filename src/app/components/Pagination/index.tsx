import { useMemo } from "react";
import { cva } from "class-variance-authority";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface PaginationProps {
  page: number;
  totalPage: number;
  onChange: (page: number) => void;
}

const pageButtonVariants = cva(
  "size-8 cursor-pointer rounded-lg flex-center text-sm font-medium",
  {
    variants: {
      isSelect: {
        true: "bg-bg-primary text-brand-primary bs-border-primary",
        false: "text-txt-base hover:bg-bg-lightGray",
      },
    },
    defaultVariants: {
      isSelect: false,
    },
  },
);

export default function Pagination({
  page,
  totalPage,
  onChange,
}: PaginationProps) {
  const pageList = useMemo(() => {
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPage);

    if (startPage > endPage) {
      return [];
    } else {
      return new Array(endPage - startPage + 1)
        .fill(null)
        .map((_, idx) => startPage + idx);
    }
  }, [page, totalPage]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPage;

  const activeColor = theme.colors.icon.base;
  const disabledColor = theme.colors.icon.disabled;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={cn(
          "flex size-8 items-center justify-center rounded-sm",
          canGoPrev ? "hover:bg-bg-gray cursor-pointer" : "cursor-not-allowed",
        )}
        onClick={() => canGoPrev && onChange(1)}
        disabled={!canGoPrev}
      >
        <ChevronsLeft
          size={20}
          color={canGoPrev ? activeColor : disabledColor}
        />
      </button>
      <button
        type="button"
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          canGoPrev ? "hover:bg-bg-gray cursor-pointer" : "cursor-not-allowed",
        )}
        onClick={() => canGoPrev && onChange(page - 1)}
        disabled={!canGoPrev}
      >
        <ChevronLeft
          size={20}
          color={canGoPrev ? activeColor : disabledColor}
        />
      </button>

      {pageList.map((v) => (
        <button
          type="button"
          key={`pagination-${v}`}
          className={pageButtonVariants({ isSelect: v === page })}
          onClick={() => onChange(v)}
        >
          {v}
        </button>
      ))}

      <button
        type="button"
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          canGoNext ? "hover:bg-bg-gray cursor-pointer" : "cursor-not-allowed",
        )}
        onClick={() => canGoNext && onChange(page + 1)}
        disabled={!canGoNext}
      >
        <ChevronRight
          size={20}
          color={canGoNext ? activeColor : disabledColor}
        />
      </button>
      <button
        type="button"
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          canGoNext ? "hover:bg-bg-gray cursor-pointer" : "cursor-not-allowed",
        )}
        onClick={() => canGoNext && onChange(totalPage)}
        disabled={!canGoNext}
      >
        <ChevronsRight
          size={20}
          color={canGoNext ? activeColor : disabledColor}
        />
      </button>
    </div>
  );
}
