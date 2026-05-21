"use client";

import { useState } from "react";
import type { BoothResponse } from "@/app/api/festivals.type";

interface BoothTabProps {
  booths: BoothResponse[];
}

export function BoothTab({ booths }: BoothTabProps) {
  const [tag, setTag] = useState("ALL");
  const tags = ["ALL", ...Array.from(new Set(booths.map((b) => b.tag)))];
  const filtered = tag === "ALL" ? booths : booths.filter((b) => b.tag === tag);

  return (
    <div>
      <div className="f-day-row">
        {tags.map((t) => (
          <button
            key={t}
            className="f-chip"
            data-active={tag === t ? "true" : "false"}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontFamily: "var(--mono-font)",
            fontSize: 13,
          }}
        >
          등록된 부스가 없습니다.
        </div>
      ) : (
        <div className="f-booth-grid">
          {filtered.map((b) => (
            <div key={b.id} className="f-booth-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "space-between",
                }}
              >
                <div className="name">{b.name}</div>
                <span
                  className="f-tag"
                  style={{ background: "var(--faint)", color: "var(--fg)" }}
                >
                  {b.tag}
                </span>
              </div>
              <div className="meta">
                <span>{b.loc}</span>
                <span>·</span>
                <span>{b.dept}</span>
              </div>
              <div className="meta" style={{ color: "var(--fg)" }}>
                {b.schedule}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
