"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon, CircleX } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar as ShadcnCalendar } from "@/app/shadcn/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/shadcn/components/ui/popover";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

type BaseCalendarProps = {
  className?: string;
  placeholder?: string;
  numberOfMonths?: number;
  isHideClearButton?: boolean;
};

type SingleCalendarProps = BaseCalendarProps & {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};

type RangeCalendarProps = BaseCalendarProps & {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
};

export type CalendarProps = SingleCalendarProps | RangeCalendarProps;

export default function Calendar(props: CalendarProps) {
  const {
    className,
    placeholder = "날짜를 선택하세요",
    numberOfMonths,
    mode = "single",
  } = props;

  // Popover open state
  const [open, setOpen] = React.useState(false);

  // Internal state
  const initialSingleDate =
    mode === "single" ? (props as SingleCalendarProps).selected : void 0;
  const initialRangeDate =
    mode === "range" ? (props as RangeCalendarProps).selected : void 0;

  const [singleDate, setSingleDate] = React.useState<Date | undefined>(
    initialSingleDate,
  );
  const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>(
    initialRangeDate,
  );

  // range 선택 단계 추적: 0 = 시작 전, 1 = from 선택됨, 2 = to 선택됨(완료)
  const rangeStep = React.useRef(0);

  // Sync with external state
  React.useEffect(() => {
    if (mode === "single") {
      setSingleDate((props as SingleCalendarProps).selected);
    } else {
      setRangeDate((props as RangeCalendarProps).selected);
    }
  }, [mode, props]);

  const handleSingleChange = (date: Date | undefined) => {
    // 동일한 날짜 선택 시 undefined로 초기화하지 않음
    const newDate = date ?? singleDate;
    setSingleDate(newDate);
    if (mode === "single" && (props as SingleCalendarProps).onSelect) {
      (props as SingleCalendarProps).onSelect!(newDate);
    }
    // 날짜 선택 시 Popover 닫기
    setOpen(false);
  };

  const handleRangeSelect = (
    _selected: DateRange | undefined,
    triggerDate: Date,
  ) => {
    if (rangeStep.current === 0 || rangeStep.current === 2) {
      // 새 범위 시작: from만 설정
      const newRange: DateRange = { from: triggerDate, to: void 0 };
      setRangeDate(newRange);
      rangeStep.current = 1;
      if (mode === "range" && (props as RangeCalendarProps).onSelect) {
        (props as RangeCalendarProps).onSelect!(newRange);
      }
    } else if (rangeStep.current === 1) {
      // 범위 완료: to 설정
      const from = rangeDate?.from;
      if (!from) return;

      // from과 to 순서 정렬
      const [start, end] =
        from <= triggerDate ? [from, triggerDate] : [triggerDate, from];
      const newRange = { from: start, to: end };
      setRangeDate(newRange);
      rangeStep.current = 2;
      if (mode === "range" && (props as RangeCalendarProps).onSelect) {
        (props as RangeCalendarProps).onSelect!(newRange);
      }
      // 범위 완료 시 Popover 닫기
      setOpen(false);
    }
  };

  const formatDisplayText = () => {
    if (mode === "single") {
      return singleDate
        ? format(singleDate, "yyyy.MM.dd", { locale: ko })
        : null;
    }
    if (rangeDate?.from) {
      return rangeDate.to
        ? `${format(rangeDate.from, "yyyy.MM.dd", { locale: ko })} - ${format(rangeDate.to, "yyyy.MM.dd", { locale: ko })}`
        : format(rangeDate.from, "yyyy.MM.dd", { locale: ko });
    }
    return null;
  };

  const displayText = formatDisplayText();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="bs-border-base flex h-[44px] items-center justify-start gap-2 rounded-lg px-3 font-normal">
          <div className="flex h-full w-full items-center gap-2">
            <PopoverTrigger asChild>
              <div className="flex h-full w-0 grow cursor-pointer items-center gap-2">
                <CalendarIcon
                  className="size-5"
                  color={
                    displayText
                      ? theme.colors.icon.base
                      : theme.colors.icon.disabled
                  }
                />
                <div className="w-0 grow text-start">
                  {displayText ?? (
                    <span
                      className={cn(
                        displayText ? "text-txt-base" : "text-txt-disabled",
                      )}
                    >
                      {placeholder}
                    </span>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            {!props.isHideClearButton && (
              <CircleX
                onClick={() => {
                  if (mode === "single") {
                    setSingleDate(void 0);
                  } else {
                    setRangeDate(void 0);
                  }
                }}
                className="size-6 cursor-pointer"
                fill={theme.colors.icon.disabled}
                color={theme.colors.icon.white}
              />
            )}
          </div>
        </div>
        <PopoverContent
          className="border-border-base w-auto overflow-hidden rounded-lg p-0"
          align="start"
        >
          {mode === "single" ? (
            <ShadcnCalendar
              mode="single"
              selected={singleDate}
              onSelect={handleSingleChange}
              locale={ko}
              numberOfMonths={numberOfMonths}
            />
          ) : (
            <ShadcnCalendar
              mode="range"
              selected={rangeDate}
              onSelect={handleRangeSelect}
              locale={ko}
              numberOfMonths={numberOfMonths ?? 2}
              defaultMonth={rangeDate?.from}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
