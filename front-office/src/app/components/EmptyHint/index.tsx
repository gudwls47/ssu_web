import { Info } from "lucide-react";

import { cn } from "@/app/shadcn/lib/utils";
import { theme } from "@/theme/theme";

interface EmptyHintProps {
  title?: string;
  className?: string;
}

export default function EmptyHint({
  title = "등록된 이미지가 없습니다.",
  className,
}: EmptyHintProps) {
  return (
    <div
      className={cn("flex-center h-[120px] w-full flex-col gap-2", className)}
    >
      <Info size={24} color={theme.colors.txt.sub2} />
      <p className="text-font-subText02 text-sm">{title}</p>
    </div>
  );
}
