"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/app/api/auth";
import { useIsJoined, useToggleJoin } from "@/app/api/userFestivals";
import type { FestivalResponse } from "@/app/api/festivals.type";
import { TABS, type TabType } from "./constants";

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  fest: FestivalResponse;
}

export function TabNavigation({
  currentTab,
  onTabChange,
  fest,
}: TabNavigationProps) {
  const router = useRouter();
  const { user } = useAuthState();
  const { data: isJoined } = useIsJoined(user?.uid, fest.id);
  const toggle = useToggleJoin(user?.uid, fest);
  const [copied, setCopied] = useState(false);

  const handleJoin = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    toggle.mutate({ joined: !!isJoined });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("링크 복사에 실패했습니다.");
    }
  };

  return (
    <div className="f-tabs">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          data-active={currentTab === value ? "true" : "false"}
          onClick={() => onTabChange(value)}
        >
          {label}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button
        className="f-btn ghost sm"
        style={{ alignSelf: "center" }}
        onClick={handleShare}
      >
        {copied ? "✓ 링크 복사됨" : "🔗 축제 공유"}
      </button>
      <button
        className={`f-btn ${isJoined ? "ghost" : "accent"} sm`}
        style={{ alignSelf: "center", minWidth: 88 }}
        onClick={handleJoin}
        disabled={toggle.isPending}
      >
        {isJoined ? "✓ 참여 중" : "+ 참여 등록"}
      </button>
    </div>
  );
}
