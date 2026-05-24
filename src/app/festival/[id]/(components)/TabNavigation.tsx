"use client";

import { TABS, type TabType } from "./constants";

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ currentTab, onTabChange }: TabNavigationProps) {
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
      <button className="f-btn accent sm" style={{ alignSelf: "center" }}>
        + 참여 등록
      </button>
    </div>
  );
}
