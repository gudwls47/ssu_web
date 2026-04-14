"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";

import Calendar from "@/app/components/Calendar";
import Chip from "@/app/components/Chip";
import Select from "@/app/components/Select";
import { theme } from "@/theme/theme";

// 축제 상태 타입
type FestivalStatus = "UPCOMING" | "ONGOING" | "COMPLETED";

interface Festival {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: FestivalStatus;
  thumbnail?: string;
}

const MOCK_FESTIVALS: Festival[] = [
  {
    id: 1,
    title: "2026 숭실대학교 봄 축제",
    description:
      "새로운 시작을 알리는 숭실대학교의 봄 축제입니다. 다양한 공연과 먹거리가 준비되어 있습니다.",
    startDate: "2026-05-10",
    endDate: "2026-05-12",
    status: "UPCOMING",
  },
  {
    id: 2,
    title: "제 25회 IT대학 학술제",
    description:
      "IT대학 학생들의 열정과 기술을 엿볼 수 있는 학술제입니다. 혁신적인 프로젝트들을 만나보세요.",
    startDate: "2026-04-01",
    endDate: "2026-04-15",
    status: "ONGOING",
  },
  {
    id: 3,
    title: "2025 숭실대학교 대동제",
    description:
      "지난 가을, 모두가 하나 되어 즐겼던 대동제의 추억을 다시 한번 떠올려보세요.",
    startDate: "2025-09-20",
    endDate: "2025-09-22",
    status: "COMPLETED",
  },
];

const STATUS_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "예정", value: "UPCOMING" },
  { label: "진행중", value: "ONGOING" },
  { label: "종료", value: "COMPLETED" },
];

export default function FestivalListPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(void 0);

  const getStatusChip = (status: FestivalStatus) => {
    switch (status) {
      case "UPCOMING":
        return <Chip label="예정" variant="info" />;
      case "ONGOING":
        return <Chip label="진행중" variant="primary" />;
      case "COMPLETED":
        return <Chip label="종료" variant="gray" />;
    }
  };

  return (
    <div className="flex flex-col gap-[40px]">
      {/* 배너 섹션 */}
      <section className="bg-bg-primary/20 relative h-[240px] w-full overflow-hidden rounded-[24px] md:h-[320px]">
        <div className="flex h-full flex-col justify-center px-[40px] md:px-[60px]">
          <h1 className="text-txt-base text-[28px] font-bold md:text-[40px]">
            숭실대학교 축제 목록
          </h1>
          <p className="text-txt-sub mt-[12px] text-[16px] md:text-[18px]">
            현재 진행 중이거나 예정된 축제 정보를 확인하세요.
          </p>
        </div>
        {/* 장식용 그래픽 요소 (필요 시 이미지로 대체) */}
        <div className="bg-button-primary/10 absolute right-[-40px] bottom-[-40px] size-[200px] rounded-full md:size-[300px]" />
      </section>

      {/* 필터 및 목록 섹션 */}
      <div className="flex flex-col gap-[24px]">
        {/* 필터 바 */}
        <div className="bs-border-base bg-bg-white flex flex-col gap-[16px] rounded-[16px] p-[20px] md:flex-row md:items-center">
          <div className="flex flex-col gap-[8px] md:w-[200px]">
            <span className="text-txt-base text-[14px] font-bold">상태</span>
            <Select
              items={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="상태 선택"
            />
          </div>
          <div className="flex flex-col gap-[8px] md:w-[320px]">
            <span className="text-txt-base text-[14px] font-bold">
              진행 기간
            </span>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              placeholder="시작일 - 종료일"
            />
          </div>
        </div>

        {/* 축제 목록 */}
        <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_FESTIVALS.map((festival) => (
            <div
              key={festival.id}
              className="bs-border-base group bg-bg-white cursor-pointer overflow-hidden rounded-[20px] transition-all hover:shadow-xl"
            >
              {/* 썸네일 이미지 */}
              <div className="bg-bg-gray aspect-[16/9] w-full overflow-hidden">
                {festival.thumbnail ? (
                  <img
                    src={festival.thumbnail}
                    alt={festival.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-bg-primary/5 flex h-full w-full items-center justify-center">
                    <span className="text-txt-disabled text-[14px]">
                      이미지 없음
                    </span>
                  </div>
                )}
              </div>

              {/* 축제 정보 */}
              <div className="flex flex-col p-[24px]">
                <div className="flex items-center justify-between">
                  {getStatusChip(festival.status)}
                  <span className="text-txt-sub text-[13px]">
                    {festival.startDate.replace(/-/g, ".")} ~{" "}
                    {festival.endDate.replace(/-/g, ".")}
                  </span>
                </div>
                <h3 className="text-txt-base group-hover:text-txt-primary mt-[16px] text-[20px] font-bold transition-colors">
                  {festival.title}
                </h3>
                <p className="text-txt-sub mt-[10px] line-clamp-2 text-[15px] leading-relaxed">
                  {festival.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
