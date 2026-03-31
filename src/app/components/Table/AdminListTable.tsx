"use client";

import React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";

interface TableColumn<T> {
  key: keyof T | "CUSTOM";
  header: string;
  size?: number | "grow";
  headerRenderer?: () => React.ReactNode;
  cellRenderer?: (item: T, index: number) => React.ReactNode;
  headCellAlign?: "left" | "center" | "right";
  rowCellAlign?: "left" | "center" | "right";
  cellClassName?: string;
}

interface AdminListTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  getRowKey?: (item: T, index: number) => string | number;
  href?: string;
  hrefKey?: keyof T | "id";
  rowCellClassName?: string;
  headCellClassName?: string;
  rowClassName?: string;
  headRowClassName?: string;
}

const tableWrapperCva = cva("w-full");

const headWrapperCva = cva("by-border-default flex w-full");

const headCellCva = cva(
  "text-txt-base px-4 py-2 text-body4 font-medium min-h-[60px] flex items-center bg-bg-primary",
  {
    variants: {
      align: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      },
    },
    defaultVariants: {
      align: "center",
    },
  },
);

const rowWrapperCva = cva("flex flex-col w-full");

const rowCva = cva("not-last:bb-border-base transition-colors flex w-full", {
  variants: {
    isClickable: {
      true: "hover:bg-bg-lightGray cursor-pointer",
      false: "hover:bg-bg-lightGray",
    },
  },
  defaultVariants: {
    isClickable: false,
  },
});

const rowCellCva = cva("px-4 py-2 text-body4 min-h-[60px] flex items-center", {
  variants: {
    align: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

const emptyRowCva = cva(
  "py-10 text-center text-font-subText02 w-full flex items-center justify-center",
);

export default function AdminListTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "데이터가 없습니다.",
  onRowClick,
  getRowKey,
  href,
  hrefKey = "id",
  rowCellClassName,
  headCellClassName,
  rowClassName,
  headRowClassName,
}: AdminListTableProps<T>) {
  const getSizeStyle = (size?: number | "grow"): React.CSSProperties => {
    if (size === "grow") {
      return { flex: 1 };
    }
    if (typeof size === "number") {
      return { width: `${size}px`, flexShrink: 0 };
    }
    return { flex: 1 };
  };

  const renderCellContent = (
    column: TableColumn<T>,
    item: T,
    index: number,
  ) => {
    if (column.cellRenderer) {
      return column.cellRenderer(item, index);
    }

    if (column.key === "CUSTOM") {
      return null;
    }

    const value = item[column.key];
    if (value === null || typeof value === "undefined") {
      return "-";
    }
    return String(value);
  };

  return (
    <div className={tableWrapperCva()}>
      <div className={headWrapperCva()}>
        {columns.map((column, index) => (
          <div
            key={`header-${index}`}
            className={headCellCva({
              align: column.headCellAlign,
              className: headCellClassName,
            })}
            style={getSizeStyle(column.size)}
          >
            {column.headerRenderer ? column.headerRenderer() : column.header}
          </div>
        ))}
      </div>
      <div className={rowWrapperCva()}>
        {isLoading ? (
          <div className={emptyRowCva()}>로딩 중...</div>
        ) : data.length > 0 ? (
          data.map((item, rowIndex) => {
            if (!href) {
              return (
                <div
                  key={getRowKey ? getRowKey(item, rowIndex) : rowIndex}
                  className={rowCva({
                    isClickable: !!onRowClick,
                    className: rowClassName,
                  })}
                  onClick={() => onRowClick?.(item, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={rowCellCva({
                        align: column.rowCellAlign,
                        className: column.cellClassName,
                      })}
                      style={getSizeStyle(column.size)}
                    >
                      {renderCellContent(column, item, rowIndex)}
                    </div>
                  ))}
                </div>
              );
            }

            const hrefTo = `${href}/${hrefKey === "id" ? (item as T & { id: number }).id || "undefined" : item[hrefKey]}`;

            return (
              <Link
                href={hrefTo}
                className={rowCva({
                  isClickable: true,
                  className: rowClassName,
                })}
                key={getRowKey ? getRowKey(item, rowIndex) : rowIndex}
              >
                {columns.map((column, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={rowCellCva({
                      align: column.rowCellAlign,
                      className: rowCellClassName,
                    })}
                    style={getSizeStyle(column.size)}
                  >
                    {renderCellContent(column, item, rowIndex)}
                  </div>
                ))}
              </Link>
            );
          })
        ) : (
          <div className={emptyRowCva()}>{emptyMessage}</div>
        )}
      </div>
    </div>
  );
}

export type { TableColumn, AdminListTableProps };
