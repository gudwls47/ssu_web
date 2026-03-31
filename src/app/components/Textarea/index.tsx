import React, { useEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  rowCount?: number;
  minRowCount?: number;
  isAutoHeight?: boolean;
  fontSize?: number;
  lineHeight?: number;
  label?: string;
  labelClassName?: string;
  borderColor?: string;
  isViewMode?: boolean;
  compareValue?: string;
  error?: string;
}

const textareaCva = cva("", {
  variants: {
    isViewMode: {
      true: "text-txt-base!",
      false: "",
    },
    isDiffCompareValue: {
      true: "bg-bg-warning",
      false: "",
    },
  },
  defaultVariants: {
    isViewMode: false,
    isDiffCompareValue: false,
  },
});

function Textarea({
  className,
  rowCount = 2,
  minRowCount = 1,
  isAutoHeight,
  fontSize = 14,
  lineHeight = 20,
  label,
  labelClassName,
  borderColor = theme.colors.border.base,
  isViewMode = false,
  compareValue,
  error,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const paddingY = 12 * 2 + 2;
  const singleLineHeight = lineHeight;

  const [currentHeight, setCurrentHeight] = useState<number>(
    singleLineHeight * minRowCount + paddingY,
  );

  const handleResizeHeight = () => {
    if (!isAutoHeight || !textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;

    textarea.style.height = `${singleLineHeight + paddingY}px`;
    const scrollHeight = textarea.scrollHeight;
    // 총 몇 줄이 필요한지 계산함
    const totalLineCount = Math.ceil(
      (scrollHeight - paddingY) / singleLineHeight,
    );

    // const maxHeight = rowCount * singleLineHeight + paddingY;
    const minHeight = minRowCount * singleLineHeight + paddingY;
    const resultHeight = Math.max(
      totalLineCount * singleLineHeight + paddingY,
      minHeight,
    );
    // const resultHeight = Math.min(
    //   maxHeight,
    //   Math.max(totalLineCount * singleLineHeight + paddingY, minHeight),
    // );
    setCurrentHeight(resultHeight);
    textarea.style.height = `${resultHeight}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isAutoHeight) {
      handleResizeHeight();
    }
    props.onChange?.(e);
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      if (isAutoHeight) {
        handleResizeHeight();
      } else {
        textarea.style.height = `${singleLineHeight * rowCount + paddingY}px`;
      }
    }
  }, [isAutoHeight, props.value]);

  return (
    <div>
      {label && (
        <p
          className={cn(
            "mb-[8px] text-[14px] leading-[1.4] font-bold",
            labelClassName,
          )}
        >
          {label}
        </p>
      )}

      <textarea
        className={textareaCva({
          className: cn(
            `placeholder:text-txt-disabled focus:border-border-black! disabled:bg-bg-gray disabled:text-txt-disabled w-full resize-none rounded-[8px] px-[16px] py-[12px] outline-none disabled:cursor-not-allowed`,
            className,
          ),
          isViewMode,
          isDiffCompareValue:
            typeof compareValue !== "undefined" && compareValue !== props.value,
        })}
        {...props}
        onChange={handleChange}
        disabled={isViewMode ? true : props.disabled}
        placeholder={
          (props.disabled || isViewMode) && !props.value
            ? "미입력"
            : props.placeholder
        }
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
          border: `1px solid ${error ? theme.colors.status.error : borderColor}`,
          minHeight: `${singleLineHeight + paddingY}px`,
          height: `${currentHeight}px`,
        }}
        ref={textareaRef}
      />
      {error && <p className="text-status-error mt-1 text-[13px]">{error}</p>}
    </div>
  );
}

export default Textarea;
