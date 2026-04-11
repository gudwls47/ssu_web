import * as React from "react";

import { useEffect } from "react";
import { cva } from "class-variance-authority";
import { Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

export interface InputProps extends Omit<
  React.ComponentProps<"input">,
  "height" | "width"
> {
  label?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  error?: string;
  height?: number;
  wrapperClassName?: string;
  width?: number;
  borderRadius?: number;
  isViewMode?: boolean;
  customType?: "text" | "int" | "float" | "password";
  isDecimal?: boolean;
  decimalProps?: {
    max?: number;
    min?: number;
    isDouble?: boolean;
    doubleLength?: number;
    isComma?: boolean;
    isBigInt?: boolean;
  };
  required?: boolean;
  compareValue?: string;
  suffix?: React.ReactNode;
  isChipInput?: boolean;
  isShowSearchIcon?: boolean;
}

const INPUT_LIMITS = {
  text: {
    maxLength: 255,
  },
  int: {
    max: 2147483647,
  },
  bigInt: {
    max: 922337203685477580n,
  },
  float: {
    max: 2147483647,
    maxDecimal: 10,
  },
} as const;

const inputCva = cva("", {
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      customType = "text",
      label,
      startAdornment,
      endAdornment,
      error,
      height = 44,
      wrapperClassName,
      width,
      borderRadius = 8,
      isViewMode = false,
      isDecimal,
      decimalProps,
      onChange,
      onBlur,
      required,
      compareValue,
      suffix,
      isChipInput,
      isShowSearchIcon,
      ...props
    },
    ref,
  ) => {
    const [hidePassword, setHidePassword] = React.useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }

      let value = e.target.value;

      if (customType === "int" || customType === "float") {
        value = value.replace(/[^0-9.]/g, "");

        const partsList = value.split(".");
        let result = partsList[0].slice(0, 9);

        if (partsList.length > 1) {
          result += `.${partsList.slice(1).join("")}`;
        }

        value = result;
      }

      if (isDecimal) {
        let decimalRegex = isChipInput ? /[^0-9,]/g : /[^0-9]/g;

        if (decimalProps?.isDouble) {
          if (isChipInput) {
            decimalRegex = /[^0-9.,]/g;
          } else {
            decimalRegex = /[^0-9.]/g;
          }
        }

        value = value.replace(decimalRegex, "");

        const dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
          value = value.slice(0, value.lastIndexOf("."));
        }

        if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
          value = value.substring(1);
        }

        if (value[0] === ".") {
          value = "";
        }

        if (decimalProps?.isDouble) {
          const [intPart, decimalPart] = value.split(".");
          const doubleLength = decimalProps?.doubleLength || 3;
          if (decimalPart && decimalPart.length > doubleLength) {
            value = `${intPart}.${decimalPart.substring(0, doubleLength)}`;
          }
        }

        const numericValue = Number(value);
        if (decimalProps?.max && numericValue > decimalProps.max) {
          value = String(decimalProps.max);
        }
        if (decimalProps?.min && numericValue < decimalProps.min) {
          value = String(decimalProps.min);
        }

        if (decimalProps?.isBigInt) {
          if (numericValue > INPUT_LIMITS.bigInt.max) {
            value = String(INPUT_LIMITS.bigInt.max);
          }
        } else {
          const partsList = value.split(".");
          let result = partsList[0].slice(0, 9);

          if (partsList.length > 1) {
            result += `.${partsList.slice(1).join("")}`;
          }

          value = result;
        }

        if (decimalProps?.isComma) {
          value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }

      if (!props.type || props.type === "text") {
        const limit = INPUT_LIMITS.text.maxLength;
        if (value.length > limit) {
          value = value.slice(0, limit);
        }
      }

      e.target.value = value;
      onChange(e);
    };

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (decimalProps?.isDouble && e.target.value !== "") {
        e.target.value = Number(e.target.value).toString();
        e.currentTarget.value = Number(e.target.value).toString();
      }
      onBlur?.(e);
    };

    const renderEndAdornment = () => {
      if (customType === "password") {
        if (hidePassword) {
          return (
            <EyeOff
              color={theme.colors.icon.disabled}
              className="absolute right-3 z-10 size-5 cursor-pointer"
              onClick={() => setHidePassword(!hidePassword)}
            />
          );
        }
        return (
          <Eye
            color={theme.colors.icon.disabled}
            className="absolute right-3 z-10 size-5 cursor-pointer"
            onClick={() => setHidePassword(!hidePassword)}
          />
        );
      }
      if (endAdornment) {
        return <div className="absolute right-3 z-10">{endAdornment}</div>;
      }
      return null;
    };

    useEffect(() => {
      if (props.value == null) {
        return;
      }
      const raw = String(props.value);
      let fixed = raw;

      switch (customType) {
        case "text": {
          const limit = INPUT_LIMITS.text.maxLength;
          if (raw.length > limit) {
            fixed = raw.slice(0, limit);
          }
          break;
        }
        case "int": {
          fixed = raw.replace(/[^0-9]/g, "");
          if (fixed.length > 9) {
            fixed = fixed.slice(0, 9);
          }
          if (fixed !== "") {
            const num = Number(fixed);
            if (num > INPUT_LIMITS.int.max) {
              fixed = String(INPUT_LIMITS.int.max);
            }
          }
          break;
        }
        case "float": {
          fixed = raw.replace(/[^0-9.]/g, "");
          const parts = fixed.split(".");
          if (parts.length > 2) {
            fixed = parts[0] + "." + parts.slice(1).join("");
          }
          const [intPart, decPart = ""] = fixed.split(".");
          if (intPart.length > 9) {
            fixed = intPart.slice(0, 9) + (decPart ? `.${decPart}` : "");
          }
          if (decPart.length > INPUT_LIMITS.float.maxDecimal) {
            fixed =
              intPart + "." + decPart.slice(0, INPUT_LIMITS.float.maxDecimal);
          }
          const num = parseFloat(fixed);
          if (!Number.isNaN(num) && num > INPUT_LIMITS.float.max) {
            fixed = String(INPUT_LIMITS.float.max);
          }
          break;
        }
        default:
          break;
      }

      if (fixed !== raw) {
        const syntheticEvent = {
          target: { value: fixed },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }, [props.value, customType]);

    return (
      <div
        className={cn("flex w-full flex-col", wrapperClassName)}
        style={{ width: width ? `${width}px` : "100%" }}
      >
        {label && (
          <div className="flex items-start gap-1">
            <p className="mb-2 text-sm font-bold">{label}</p>
            {required && <p className="text-primary text-sm font-bold">*</p>}
          </div>
        )}
        <div className="flex w-full items-center gap-[8px]">
          <div
            className="relative flex w-full items-center"
            style={{ height: `${height - 2}px` }}
          >
            {startAdornment ||
              (isShowSearchIcon && (
                <div className="absolute left-3 z-10">
                  {startAdornment || (
                    <Search
                      color={theme.colors.icon.disabled}
                      className="size-5"
                    />
                  )}
                </div>
              ))}
            <input
              maxLength={
                customType === "text" ? 255 : customType === "int" ? 9 : 30
              }
              type={
                !hidePassword
                  ? "text"
                  : customType === "int" || customType === "float"
                    ? "number"
                    : customType
              }
              className={inputCva({
                className: cn(
                  `placeholder:text-font-disabled hover:bg-bg-lightGray focus:border-border-black disabled:bg-bg-gray disabled:text-txt-disabled relative flex w-full items-center border border-solid px-[12px] focus:outline-none disabled:cursor-not-allowed ${error ? "border-status-error" : "border-border-default"}`,
                  className,
                ),
                isViewMode,
                isDiffCompareValue:
                  typeof compareValue !== "undefined" &&
                  compareValue !== props.value,
              })}
              ref={ref}
              value={props.value}
              onChange={handleChange}
              onBlur={handleOnBlur}
              disabled={isViewMode ? true : props.disabled}
              {...props}
              style={{
                height: `${height - 2}px`,
                borderRadius: `${borderRadius}px`,
                paddingLeft:
                  startAdornment || isShowSearchIcon ? "36px" : "12px",
                paddingRight: endAdornment ? "36px" : "12px",
                ...props.style,
              }}
              placeholder={
                (props.disabled || isViewMode) && !props.value
                  ? "미입력"
                  : props.placeholder
              }
            />
            {renderEndAdornment()}
          </div>
          {suffix && (
            <div className="flex items-center text-sm font-bold">{suffix}</div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
