"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { Button } from "@/app/shadcn/components/ui/button";
import { Checkbox } from "@/app/shadcn/components/ui/checkbox";
import { Input } from "@/app/shadcn/components/ui/input";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

export interface ObjectSelectItem {
  value: string;
  label: string;
  items?: ({ label: string; value: string } | null)[];
  columnName?: string;
  updateValueType:
    | "STRING"
    | "TEXT"
    | "TEXT_SELECT"
    | "MULTI_TEXT_SELECT"
    | "ENUM"
    | "ENUM_SELECT"
    | "INTEGER"
    | "LONG"
    | "DOUBLE"
    | "BOOLEAN"
    | "BOOLEAN_SELECT"
    | "DATE"
    | "DATETIME";
}

type ObjectBaseSelectProps = {
  /**
   * @description 검색 가능 여부
   */
  isSearchable?: boolean;
  placeholder?: string;
  width?: number;
  height?: number;
  className?: string;
  textStyle?: string;
  setValue?: (value: any) => void;
  /**
   * @description scroll 영역의 최대 높이
   */
  maxHeight?: number;
  items: ObjectSelectItem[];
  id?: string;
  addableOptions?: {
    isAllowDuplicate?: boolean;
  };
  error?: string;
  disabled?: boolean;
  isViewMode?: boolean;
};

type ObjectSelectAddableProps = ObjectBaseSelectProps & {
  isAddable: true;
  onAdd: (value: string) => void;
};

type ObjectSelectNonAddableProps = ObjectBaseSelectProps & {
  isAddable?: false;
  onAdd?: (value: string) => void;
};

type ObjectSelectMultipleProps = (
  | ObjectSelectAddableProps
  | ObjectSelectNonAddableProps
) & {
  isMultiple: true;
  value?: ObjectSelectItem[];
  onChange?: (value: ObjectSelectItem[]) => void;
};

type ObjectSelectSingleProps = (
  | ObjectSelectAddableProps
  | ObjectSelectNonAddableProps
) & {
  isMultiple?: false;
  value?: ObjectSelectItem;
  onChange?: (value: ObjectSelectItem) => void;
};

export type ObjectSelectProps =
  | ObjectSelectMultipleProps
  | ObjectSelectSingleProps;

export default function ObjectSelect({
  value,
  height = 44,
  width,
  maxHeight = 468,
  className,
  placeholder = "선택하세요",
  items,
  isMultiple,
  onChange,
  isSearchable,
  id = "select",
  isAddable,
  addableOptions,
  onAdd,
  textStyle,
  error,
  isViewMode,
  disabled,
  setValue,
}: ObjectSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<ObjectSelectItem[]>(items);
  const [addItemValue, setAddItemValue] = useState("");

  const selectItems = useMemo(() => {
    if (!value) {
      return isMultiple ? ([] as ObjectSelectItem[]) : void 0;
    }

    if (isMultiple) {
      return items.filter((item) => value.includes(item)) as ObjectSelectItem[];
    }

    return items.find((item) => item.label === value.label) as
      | ObjectSelectItem
      | undefined;
  }, [value, items, isMultiple]);

  // 타입 가드 함수들
  const isSelectItemsArray = (
    items: ObjectSelectItem[] | ObjectSelectItem | undefined,
  ): items is ObjectSelectItem[] => {
    return Array.isArray(items);
  };

  const isSelectItem = (item: any): item is ObjectSelectItem => {
    return (
      item && typeof item === "object" && "value" in item && "label" in item
    );
  };

  const handleChange = (v: ObjectSelectItem) => {
    if (isMultiple) {
      if (value?.find((item) => item === v)) {
        onChange?.(value.filter((item) => item !== v));
      } else {
        onChange?.([...(value || []), v]);
      }
    } else {
      onChange?.(v);
      setIsOpen(false);
    }
    setValue?.(void 0);
  };

  const handleAddItem = () => {
    if (!addItemValue) {
      return;
    }

    if (addableOptions?.isAllowDuplicate) {
      if (items.find((item) => item.value === addItemValue)) {
        return;
      }
    }

    onAdd?.(addItemValue);
    setAddItemValue("");
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
      setAddItemValue("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchValue) {
      setSearchResult(items.filter((item) => item.label.includes(searchValue)));
    } else {
      setSearchResult(items);
    }
  }, [items, searchValue]);

  const renderValueHeader = () => {
    if (isSearchable && isOpen) {
      return (
        <div
          className="bs-border-default flex w-full items-center justify-between gap-[8px] rounded-[8px] px-[12px]"
          style={{
            height: `${height - 2}px`,
            minHeight: `${height - 2}px`,
          }}
        >
          <Search className="size-5 shrink-0 text-slate-400" />
          <Input
            className="border-none px-0"
            style={{
              height: `${height - 4}px`,
            }}
            placeholder="검색어 입력"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <ChevronUp className="size-4 shrink-0 text-slate-400" />
        </div>
      );
    }

    return (
      <div
        className={`bs-border-default flex w-full items-center justify-between rounded-[8px] px-[12px] ${className}`}
        style={{
          height: `${height - 2}px`,
          minHeight: `${height - 2}px`,
          borderColor: error
            ? theme.colors.status.error
            : theme.colors.border.base,
          cursor: disabled ? "not-allowed" : isViewMode ? "default" : "pointer",
        }}
        onClick={() =>
          disabled || isViewMode ? null : setIsOpen((prev) => !prev)
        }
      >
        {!selectItems ||
        (isSelectItemsArray(selectItems) && selectItems.length === 0) ? (
          <div className="flex items-center gap-[8px]">
            {isSearchable && (
              <Search className="size-5 shrink-0 text-slate-400" />
            )}
            <p className="text-font-disabled">{placeholder}</p>
          </div>
        ) : isMultiple ? (
          <div className="flex w-0 grow flex-nowrap gap-[4px] overflow-x-auto">
            {isSelectItemsArray(selectItems) &&
              selectItems.map((item) => (
                <p
                  className={`flex h-[24px] w-fit shrink-0 items-center gap-[4px] rounded-[2px] whitespace-nowrap ${
                    !isViewMode && !disabled ? "pr-[4px] pl-[8px]" : "px-[8px]"
                  } bg-bg-gray text-[12px]`}
                  key={`${id}-selected-${item.value}`}
                >
                  {item.label}
                  <X
                    className="size-3 shrink-0 cursor-pointer text-slate-400"
                    onClick={(e) => {
                      if (disabled || isViewMode) {
                        return;
                      }
                      e.stopPropagation();
                      handleChange(item);
                    }}
                  />
                </p>
              ))}
          </div>
        ) : (
          <p className={`text-font-mainText w-0 grow ${textStyle}`}>
            {isSelectItem(selectItems) && selectItems.label}
          </p>
        )}

        {isOpen ? (
          <ChevronUp className="size-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-slate-400" />
        )}
      </div>
    );
  };

  const renderSelectContent = () => {
    if (searchResult.length === 0) {
      return (
        <div className="flex h-[36px] min-h-[36px] items-center gap-[8px] px-[12px]">
          <p className="text-font-subText01">검색 결과가 없습니다.</p>
        </div>
      );
    }

    return searchResult.map((item, index) => {
      const isSelected = !value
        ? false
        : Boolean(
            [...(Array.isArray(value) ? value : [value])].find(
              (v) => v.label === item.label,
            ),
          );

      return (
        <div
          key={`${id}-select-item-${item.value}-${index}`}
          className="hover:bg-bg-lightGray flex h-[32px] min-h-[32px] cursor-pointer items-center gap-[4px] rounded-[6px] px-[8px]"
          onClick={() => handleChange(item)}
          style={{
            backgroundColor: isSelected ? theme.colors.bg.lightGray : void 0,
          }}
        >
          {isMultiple ? (
            <Checkbox
              className="size-[20px]"
              checked={!!value?.find((v) => v === item)}
              onCheckedChange={() => {
                handleChange(item);
              }}
            />
          ) : (
            <div className={`${textStyle ? "size-[16px]" : "size-[24px]"}`}>
              {isSelected && (
                <Check
                  className={`${textStyle ? "size-[16px]" : "size-[24px]"}`}
                />
              )}
            </div>
          )}
          <span
            className={`grow ${textStyle} shrink-0`}
            style={{
              fontWeight: isSelected ? 500 : 400,
            }}
          >
            {item.label}
          </span>
        </div>
      );
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 left-0 z-100 h-dvh w-dvw"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={cn("relative")}
        style={{
          width: `${width ? `${width}px` : "100%"}`,
          height: `${height}px`,
          zIndex: isOpen ? 101 : 1,
        }}
      >
        <div
          className={cn(
            "absolute top-0 left-0 w-full rounded-[6px] bg-white text-[14px]",
            className,
          )}
          style={{
            width: `${width ? `${width}px` : "100%"}`,
          }}
        >
          {renderValueHeader()}
          {isOpen && (
            <div className="bs-border-default mt-[4px] rounded-[8px] p-[6px]">
              {isSearchable && isMultiple && value && value?.length > 0 && (
                <div className="bb-border-light mb-[6px] flex flex-wrap gap-[6px] pb-[6px]">
                  {value.map((item) => (
                    <p
                      key={`${id}-selected-preview-${item}`}
                      className={`flex h-[24px] w-fit shrink-0 items-center gap-[4px] rounded-[2px] whitespace-nowrap ${
                        !isViewMode && !disabled
                          ? "pr-[4px] pl-[8px]"
                          : "px-[8px]"
                      } bg-bg-gray text-[12px]`}
                    >
                      {item.label}
                      {isMultiple && (
                        <X
                          className="size-3 shrink-0 cursor-pointer text-slate-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChange(item);
                          }}
                        />
                      )}
                    </p>
                  ))}
                </div>
              )}
              <div
                className="scrollbar-hide flex w-full flex-col gap-[6px] overflow-y-auto"
                style={{
                  maxHeight: `${maxHeight}px`,
                }}
              >
                {renderSelectContent()}
              </div>
              {isAddable && (
                <div className="bs-border-default mt-[6px] flex h-[40px] items-center gap-[4px] rounded-[6px] border-dashed! px-[12px]">
                  <Input
                    height={36}
                    className="w-0 grow border-none px-0"
                    placeholder="추가할 옵션을 입력하세요"
                    value={addItemValue}
                    onChange={(e) => {
                      setAddItemValue(e.target.value);
                    }}
                  />
                  <Button
                    className="h-[24px] w-[46px] rounded-[30px]"
                    variant="primary"
                    onClick={handleAddItem}
                  >
                    추가
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {error && (
          <p
            className="text-status-error absolute left-0 z-[-1] text-[13px]"
            style={{
              top: `${height + 4}px`,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </>
  );
}
