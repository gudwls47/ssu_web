import { josa } from "@toss/hangul";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export type ToastType =
  | "FORM_BLANK"
  | "FORM_INVALID"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "READ"
  | "CUSTOM"
  | "DUPLICATE"
  | "DOWNLOAD"
  | "DOWNLOAD_ERROR"
  | "UPDATE_APPLY"
  | "CREATE_APPLY"
  | "UPLOAD"
  | "UPLOAD_ERROR";

export function getDefaultMessage(name: string, type: ToastType): string {
  switch (type) {
    case "FORM_BLANK":
      return `${josa(name, "을/를")} 입력해주세요.`;
    case "FORM_INVALID":
      return `${name} 형식이 올바르지 않습니다.`;
    case "CREATE":
      return `${name} 등록이 완료되었습니다.`;
    case "CREATE_APPLY":
      return `${name} 등록내용이 반영되었습니다.`;
    case "UPDATE":
      return `${name} 수정이 완료되었습니다.`;
    case "UPDATE_APPLY":
      return `${name} 수정내용이 반영되었습니다.`;
    case "DELETE":
      return `${name} 삭제가 완료되었습니다.`;
    case "READ":
      return `${name} 불러오기에 성공했습니다.`;
    case "DUPLICATE":
      return `이미 존재하는 ${name}입니다.`;
    case "DOWNLOAD":
      return `${name} 다운로드가 완료되었습니다.`;
    case "DOWNLOAD_ERROR":
      return `${name} 다운로드에 실패했습니다.`;
    case "UPLOAD":
      return `${name} 업로드가 완료되었습니다.`;
    case "UPLOAD_ERROR":
      return `${name} 업로드에 실패했습니다.`;
    case "CUSTOM":
      return name;
    default:
      return name;
  }
}

function createToastMethod(fn: (message: string) => string | number) {
  return (
    name: string,
    type: ToastType,
    error?: Error,
    errorFn?: (err: Error) => string | undefined,
  ) => {
    let message = getDefaultMessage(name, type);

    if (error) {
      if (errorFn && errorFn(error)) {
        message = errorFn(error)!;
      } else if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response?.data?.message;
      }
    }

    return fn(message);
  };
}

export const openToast = {
  success: createToastMethod(toast.success),
  error: createToastMethod(toast.error),
  info: createToastMethod(toast.info),
  warning: createToastMethod(toast.warning),
  message: createToastMethod(toast),
};
