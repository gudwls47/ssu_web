import React from "react";

export const MAP_W = 320;
export const MAP_H = 420;

export type MapTemplate = {
  id: string;
  label: string;
  desc: string;
  render: (w: number, h: number) => React.ReactNode;
};

export const MAP_TEMPLATES: MapTemplate[] = [
  {
    id: "basic",
    label: "기본형",
    desc: "중앙 무대 + 좌우 부스",
    render: (w, h) => (
      <>
        <rect width={w} height={h} fill="#f5f0ff" />
        <g stroke="#c8b8e8" strokeWidth="0.5" opacity="0.6">
          {Array.from({ length: Math.ceil(w / 40) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / 40) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} />
          ))}
        </g>
        <rect
          x="20"
          y="20"
          width={w - 40}
          height={h - 40}
          fill="none"
          stroke="#9b80d0"
          strokeWidth="1.5"
          rx="10"
        />
        <rect x="80" y="40" width="160" height="70" fill="#c4a8f0" rx="6" />
        <text
          x={w / 2}
          y="80"
          textAnchor="middle"
          fontSize="9"
          fill="#6040a0"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          MAIN STAGE
        </text>
        <rect
          x={w / 2 - 20}
          y="110"
          width="40"
          height={h - 150}
          fill="#e0d4f8"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`lb${i}`}
            x="30"
            y={130 + i * 54}
            width="100"
            height="44"
            fill="#d4c4f0"
            rx="4"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`rb${i}`}
            x="190"
            y={130 + i * 54}
            width="100"
            height="44"
            fill="#d4c4f0"
            rx="4"
          />
        ))}
        <rect
          x={w / 2 - 25}
          y={h - 40}
          width="50"
          height="20"
          fill="#9b80d0"
          rx="4"
        />
        <text
          x={w / 2}
          y={h - 26}
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontFamily="sans-serif"
        >
          입구
        </text>
      </>
    ),
  },
  {
    id: "stadium",
    label: "운동장형",
    desc: "트랙 + 중앙 잔디",
    render: (w, h) => (
      <>
        <rect width={w} height={h} fill="#f0f5ee" />
        <g stroke="#b8d4b0" strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: Math.ceil(w / 40) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / 40) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} />
          ))}
        </g>
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2 - 20}
          ry={h / 2 - 40}
          fill="#c8e0c0"
          stroke="#8aba80"
          strokeWidth="2"
        />
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2 - 50}
          ry={h / 2 - 70}
          fill="#a8d898"
          stroke="#6aaa60"
          strokeWidth="1.5"
        />
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2 - 80}
          ry={h / 2 - 100}
          fill="#78c870"
        />
        <rect
          x={w / 2 - 50}
          y="60"
          width="100"
          height="36"
          fill="#5080e0"
          rx="6"
        />
        <text
          x={w / 2}
          y="83"
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          STAGE
        </text>
        <text
          x={w / 2}
          y={h / 2 + 4}
          textAnchor="middle"
          fontSize="10"
          fill="#3a7a30"
          fontFamily="sans-serif"
        >
          잔디
        </text>
        <rect
          x={w / 2 - 20}
          y={h - 28}
          width="40"
          height="16"
          fill="#5080e0"
          rx="3"
        />
        <text
          x={w / 2}
          y={h - 16}
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontFamily="sans-serif"
        >
          입구
        </text>
      </>
    ),
  },
  {
    id: "cross",
    label: "十자형",
    desc: "4구역 분리형",
    render: (w, h) => (
      <>
        <rect width={w} height={h} fill="#fff5f0" />
        <g stroke="#e0c0b0" strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: Math.ceil(w / 40) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / 40) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} />
          ))}
        </g>
        <rect
          x="20"
          y="20"
          width={w / 2 - 30}
          height={h / 2 - 30}
          fill="#f8d8c8"
          rx="8"
        />
        <rect
          x={w / 2 + 10}
          y="20"
          width={w / 2 - 30}
          height={h / 2 - 30}
          fill="#c8d8f8"
          rx="8"
        />
        <rect
          x="20"
          y={h / 2 + 10}
          width={w / 2 - 30}
          height={h / 2 - 30}
          fill="#c8f8d8"
          rx="8"
        />
        <rect
          x={w / 2 + 10}
          y={h / 2 + 10}
          width={w / 2 - 30}
          height={h / 2 - 30}
          fill="#f8f8c8"
          rx="8"
        />
        <text
          x={w / 4}
          y={h / 4}
          textAnchor="middle"
          fontSize="10"
          fill="#c06040"
          fontFamily="sans-serif"
        >
          A구역
        </text>
        <text
          x={(3 * w) / 4}
          y={h / 4}
          textAnchor="middle"
          fontSize="10"
          fill="#4060c0"
          fontFamily="sans-serif"
        >
          B구역
        </text>
        <text
          x={w / 4}
          y={(3 * h) / 4}
          textAnchor="middle"
          fontSize="10"
          fill="#40c060"
          fontFamily="sans-serif"
        >
          C구역
        </text>
        <text
          x={(3 * w) / 4}
          y={(3 * h) / 4}
          textAnchor="middle"
          fontSize="10"
          fill="#b0a020"
          fontFamily="sans-serif"
        >
          D구역
        </text>
        <rect
          x={w / 2 - 10}
          y="0"
          width="20"
          height={h}
          fill="white"
          opacity="0.9"
        />
        <rect
          x="0"
          y={h / 2 - 10}
          width={w}
          height="20"
          fill="white"
          opacity="0.9"
        />
        <circle cx={w / 2} cy={h / 2} r="22" fill="#e05080" />
      </>
    ),
  },
  {
    id: "ushape",
    label: "ㄷ자형",
    desc: "U자형 행사장",
    render: (w, h) => (
      <>
        <rect width={w} height={h} fill="#f0f4ff" />
        <g stroke="#b8c4e8" strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: Math.ceil(w / 40) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / 40) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} />
          ))}
        </g>
        <path
          d={`M 20 ${h - 30} L 20 20 L ${w - 20} 20 L ${w - 20} ${h - 30}`}
          fill="none"
          stroke="#7080d0"
          strokeWidth="3"
        />
        <rect x="60" y="30" width={w - 120} height="60" fill="#8090e0" rx="6" />
        <text
          x={w / 2}
          y="65"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          MAIN STAGE
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`l${i}`}
            x="30"
            y={110 + i * 48}
            width="70"
            height="38"
            fill="#c0c8f0"
            rx="4"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`r${i}`}
            x={w - 100}
            y={110 + i * 48}
            width="70"
            height="38"
            fill="#c0c8f0"
            rx="4"
          />
        ))}
        <rect x="110" y="110" width="100" height="250" fill="#dce4ff" rx="4" />
        <text
          x={w / 2}
          y={240}
          textAnchor="middle"
          fontSize="10"
          fill="#5060a0"
          fontFamily="sans-serif"
        >
          오픈스페이스
        </text>
        <rect
          x={w / 2 - 30}
          y={h - 30}
          width="60"
          height="16"
          fill="#7080d0"
          rx="3"
        />
        <text
          x={w / 2}
          y={h - 18}
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontFamily="sans-serif"
        >
          입구
        </text>
      </>
    ),
  },
  {
    id: "plaza",
    label: "광장형",
    desc: "중앙 광장 + 주변 부스",
    render: (w, h) => (
      <>
        <rect width={w} height={h} fill="#fdf5e8" />
        <g stroke="#e0d0b0" strokeWidth="0.5" opacity="0.5">
          {Array.from({ length: Math.ceil(w / 40) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} />
          ))}
          {Array.from({ length: Math.ceil(h / 40) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} />
          ))}
        </g>
        <rect
          x="10"
          y="10"
          width={w - 20}
          height={h - 20}
          fill="none"
          stroke="#c09050"
          strokeWidth="1.5"
          rx="8"
        />
        <rect
          x="80"
          y="100"
          width="160"
          height="200"
          fill="#f0e0c0"
          stroke="#c09050"
          strokeWidth="1"
          rx="6"
        />
        <text
          x={w / 2}
          y="205"
          textAnchor="middle"
          fontSize="11"
          fill="#805020"
          fontFamily="sans-serif"
        >
          중앙 광장
        </text>
        <rect x="60" y="20" width="200" height="60" fill="#e09040" rx="6" />
        <text
          x={w / 2}
          y="55"
          textAnchor="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          MAIN STAGE
        </text>
        {[0, 1, 2].map((i) => (
          <rect
            key={`l${i}`}
            x="20"
            y={110 + i * 65}
            width="50"
            height="50"
            fill="#f0d0a0"
            rx="4"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <rect
            key={`r${i}`}
            x={w - 70}
            y={110 + i * 65}
            width="50"
            height="50"
            fill="#f0d0a0"
            rx="4"
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`b${i}`}
            x={20 + i * 72}
            y={h - 70}
            width="56"
            height="40"
            fill="#f0d0a0"
            rx="4"
          />
        ))}
        <rect
          x={w / 2 - 20}
          y={h - 20}
          width="40"
          height="12"
          fill="#c09050"
          rx="2"
        />
        <text
          x={w / 2}
          y={h - 10}
          textAnchor="middle"
          fontSize="8"
          fill="white"
          fontFamily="sans-serif"
        >
          입구
        </text>
      </>
    ),
  },
];

export function isPresetId(val: string) {
  return MAP_TEMPLATES.some((t) => t.id === val);
}

export function getTemplate(id: string): MapTemplate {
  return MAP_TEMPLATES.find((t) => t.id === id) ?? MAP_TEMPLATES[0];
}
