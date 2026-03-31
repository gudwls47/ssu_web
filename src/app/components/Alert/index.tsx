"use client";

import React from "react";

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

export interface AlertProps {
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

export default function Alert({
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
}: AlertProps) {
  const hasFooter = cancelButtonText || submitButtonText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("rounded-2xl! border-none! px-4 py-5", contentClassName)}
      >
        <div className="flex flex-col gap-2">
          {title && (
            <DialogHeader>
              <DialogTitle className="text-base">{title}</DialogTitle>
            </DialogHeader>
          )}
          {children}
        </div>
        {hasFooter && (
          <div className="flex justify-end gap-4">
            {cancelButtonText && (
              <DialogClose asChild>
                <Button
                  variant="grayOutline"
                  size="xs"
                  className=""
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
                  size="xs"
                  className=""
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

export { DialogClose as AlertClose };
