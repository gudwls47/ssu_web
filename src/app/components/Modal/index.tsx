"use client";

import React from "react";

import { X } from "lucide-react";
import { Button, ButtonProps } from "@/app/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shadcn/components/ui/dialog";
import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  isHideClose?: boolean;
  contentClassName?: string;
  cancelButtonText?: string;
  onClickCancel?: () => void;
  submitButtonText?: string;
  onClickSubmit?: () => void;
  cancelButtonProps?: Omit<ButtonProps, "onClick">;
  submitButtonProps?: Omit<ButtonProps, "onClick">;
}

export default function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  isHideClose = false,
  contentClassName,
  cancelButtonText,
  onClickCancel,
  submitButtonText,
  onClickSubmit,
  cancelButtonProps,
  submitButtonProps,
}: ModalProps) {
  const hasFooter = cancelButtonText || submitButtonText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("gap-0 rounded-xl! border-none! p-0", contentClassName)}
      >
        <div className="flex max-h-[680px] flex-col">
          {title && (
            <DialogHeader className="bb-border-base flex h-[48px] flex-row items-center justify-between px-4">
              <DialogTitle className="flex-1 text-base font-semibold">
                {title}
              </DialogTitle>
              <div>
                {!isHideClose && (
                  <DialogClose asChild>
                    <X
                      className="size-6 cursor-pointer"
                      color={theme.colors.icon.disabled}
                      onClick={() => {
                        onOpenChange?.(false);
                      }}
                    />
                  </DialogClose>
                )}
              </div>
            </DialogHeader>
          )}
          <div className="p-4">{children}</div>
        </div>
        {hasFooter && (
          <div className="bt-border-base flex justify-end gap-4 px-4 py-3">
            {cancelButtonText && (
              <DialogClose asChild>
                <Button
                  variant="grayOutline"
                  className="flex-1"
                  {...cancelButtonProps}
                  onClick={onClickCancel}
                >
                  {cancelButtonText}
                </Button>
              </DialogClose>
            )}
            {submitButtonText && (
              <DialogClose asChild>
                <Button
                  variant="primary"
                  className="flex-1"
                  {...submitButtonProps}
                  onClick={onClickSubmit}
                >
                  {submitButtonText}
                </Button>
              </DialogClose>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { DialogClose as ModalClose };
