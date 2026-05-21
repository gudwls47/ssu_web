"use client";

import type { FestivalResponse } from "@/app/api/festivals.type";
import { STATUS_META } from "./constants";
import { fmtRange } from "./utils";

interface HeroSectionProps {
  fest: FestivalResponse;
}

export function HeroSection({ fest }: HeroSectionProps) {
  const [c0, c1, c2] = fest.colors || ["#3D6EE6", "#F2C94C", "#14172B"];
  const meta = STATUS_META[fest.status];

  return (
    <div
      className="f-detail-hero"
      style={{
        background: `radial-gradient(120% 80% at 80% 0%, ${c0 || "#3D6EE6"} 0%, ${c1 || "#F2C94C"} 35%, ${c2 || "#14172B"} 100%)`,
      }}
    >
      {fest.thumbnail && (
        <img
          src={fest.thumbnail}
          alt={fest.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 10px, rgba(255,255,255,0.04) 10px 11px)",
        }}
      />
      <div className="grad" />
      <div className="detail-submeta">
        <span className={`f-tag ${meta.cls}`}>{meta.en}</span>
        <span>{fest.school}</span>
        <span>{fmtRange(fest.start, fest.end)}</span>
        {fest.status === "LIVE" && (
          <span>참여자 {fest.participants.toLocaleString()}명</span>
        )}
      </div>
      <div className="detail-name">{fest.name}</div>
      {fest.nameEn && (
        <div
          style={{
            position: "relative",
            fontFamily: "var(--display-font)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginTop: 6,
          }}
        >
          {fest.nameEn}
        </div>
      )}
      {fest.tagline && (
        <div
          style={{
            position: "relative",
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {fest.tagline}
        </div>
      )}
    </div>
  );
}
