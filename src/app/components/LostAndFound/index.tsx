"use client";

import { PackageSearch } from "lucide-react";
import { theme } from "@/theme/theme";

export default function LostAndFound() {
  return (
    <div className="bs-border-base flex-center fixed bottom-[20px] left-[20px] size-[48px] cursor-pointer rounded-full shadow-2xs">
      <PackageSearch color={theme.colors.icon.base} />
    </div>
  );
}
