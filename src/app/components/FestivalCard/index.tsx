"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { FestivalResponse } from "@/app/api/festivals.type";
import { cn } from "@/app/shadcn/lib/utils";

export interface FestivalCardProps {
  data: FestivalResponse;
}

const tagCva = cva(
  "flex cursor-default items-center gap-[4px] h-[22px] px-[8px] rounded-[6px] font-(--body-font) font-semibold text-[11px] leading-none tracking-[0.04em] uppercase",
  {
    variants: {
      status: {
        LIVE: "bg-(--live) text-white before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-current before:animate-[f-pulse_1.2s_infinite]",
        UPCOMING: "bg-(--upcoming) text-white",
        ENDED: "bg-(--faint) text-(--ended)",
      },
    },
    defaultVariants: {
      status: "UPCOMING",
    },
  },
);

const STATUS_TEXT = {
  LIVE: "LIVE",
  UPCOMING: "UPCOMING",
  ENDED: "ENDED",
};

function fmtTimestamp(ts: any) {
  if (!ts) return "00/00";
  let date: Date;
  if (typeof ts.toDate === "function") {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else {
    date = new Date(ts);
  }
  if (Number.isNaN(date.getTime())) return "00/00";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function PosterArt({
  colors,
  school,
  year,
  title,
}: {
  colors: [string, string, string];
  school: string;
  year: number;
  title: string;
}) {
  const [c0, c1, c2] = colors;
  return (
    <div
      className="absolute inset-0 overflow-hidden text-white"
      style={{
        background: `radial-gradient(120% 80% at 80% 0%, ${c0} 0%, ${c1} 35%, ${c2} 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.04) 10px 11px)",
        }}
      />
      <div className="absolute right-[16px] bottom-[14px] left-[16px] text-[28px] leading-[0.9] font-(--display-font) font-(--display-weight,700) tracking-[-0.03em] [text-shadow:0_2px_16px_rgba(0,0,0,0.3)]">
        <div className="mb-[8px] text-[9px] font-(--mono-font) font-medium tracking-[0.18em] uppercase opacity-[0.85]">
          {school} · {year}
        </div>
        {title}
      </div>
    </div>
  );
}

export default function FestivalCard({ data }: FestivalCardProps) {
  const dummy = {
    en: "DAEDONGJE",
    school: "숭실대학교",
    colors: ["#FF1E7A", "#BDFF1E", "#2A0F4E"] as [string, string, string],
  };

  const getYear = (ts: any) => {
    if (!ts) return 2026;
    const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    return Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
  };
  const year = getYear(data.start);

  return (
    <Link
      href={`/festival/${data.id}`}
      className="group border-border flex cursor-pointer flex-col overflow-hidden rounded-[20px] border bg-(--surface) no-underline transition-all duration-150 ease-in-out hover:-translate-y-[2px] hover:shadow-(--shadow)"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt={data.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <PosterArt
            colors={(data.colors ?? dummy.colors) as [string, string, string]}
            school={data.school || dummy.school}
            year={year}
            title={data.nameEn || dummy.en}
          />
        )}
        <div className="absolute top-[12px] left-[12px] flex gap-[6px]">
          <span className={cn(tagCva({ status: data.status }))}>
            {STATUS_TEXT[data.status]}
          </span>
        </div>
      </div>
      <div className="grid flex-1 gap-[8px] p-[18px]">
        <div className="text-[20px] leading-[1.05] font-(--display-font) font-(--display-weight,700) tracking-[-0.02em] text-(--fg)">
          {data.name}
        </div>
        <div className="text-muted flex flex-wrap gap-[12px] pt-[4px] text-[12px] leading-[1.4] font-(--mono-font) font-medium">
          <span>{data.school || dummy.school}</span>
          <span className="text-(--faint)">·</span>
          <span>
            {fmtTimestamp(data.start)} – {fmtTimestamp(data.end)}
          </span>
          {data.status === "LIVE" && (
            <>
              <span className="text-(--faint)">·</span>
              <span>진행 중</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
