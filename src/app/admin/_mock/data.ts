export type FestivalStatus = "live" | "upcoming" | "ended";

export interface Festival {
  id: string;
  name: string;
  en: string;
  school: string;
  start: string;
  end: string;
  status: FestivalStatus;
  participants: number;
  tagline: string;
  colors: [string, string, string];
  boothCount: number;
  lastModified: string;
}

export interface Booth {
  id: string;
  name: string;
  dept: string;
  loc: string;
  schedule: string;
  tag: "FOOD" | "BAR" | "GAME" | "GOODS" | "EXP";
}

export interface LineupSet {
  time: string;
  artist: string;
  sub: string;
  tag: string;
  stage: string;
}

export interface Notice {
  id: string;
  title: string;
  preview: string;
  time: string;
  pinned?: boolean;
}

export interface MapPin {
  id: string;
  type: "stage" | "booth" | "toilet" | "smoking" | "info";
  label: string;
  x: number;
  y: number;
}

export const FESTIVALS: Festival[] = [
  {
    id: "ssu-daedongje-2026",
    name: "2026 숭실 대동제",
    en: "DAEDONGJE",
    school: "숭실대학교",
    start: "2026-05-12",
    end: "2026-05-14",
    status: "live",
    participants: 8420,
    tagline: "숭실의 봄이 깨어나다",
    colors: ["#FF1E7A", "#BDFF1E", "#2A0F4E"],
    boothCount: 24,
    lastModified: "2026-05-12",
  },
  {
    id: "ssu-itfest-2026",
    name: "제25회 IT대학 학술제",
    en: "IT FESTA",
    school: "숭실대학교",
    start: "2026-05-20",
    end: "2026-05-22",
    status: "upcoming",
    participants: 3200,
    tagline: "기술과 축제의 만남",
    colors: ["#6B2EE6", "#BDFF1E", "#1B0832"],
    boothCount: 12,
    lastModified: "2026-05-10",
  },
  {
    id: "ssu-sportsfest-2026",
    name: "2026 숭실 체육대회",
    en: "SPORTS FEST",
    school: "숭실대학교",
    start: "2026-06-05",
    end: "2026-06-05",
    status: "upcoming",
    participants: 2100,
    tagline: "하나 되는 숭실인",
    colors: ["#FF7A66", "#F2C94C", "#14172B"],
    boothCount: 8,
    lastModified: "2026-05-08",
  },
  {
    id: "ssu-daedongje-2025",
    name: "2025 숭실 대동제",
    en: "DAEDONGJE 2025",
    school: "숭실대학교",
    start: "2025-09-20",
    end: "2025-09-22",
    status: "ended",
    participants: 7800,
    tagline: "지난 가을의 추억",
    colors: ["#E85D4A", "#FBF6EC", "#14172B"],
    boothCount: 20,
    lastModified: "2025-09-22",
  },
];

export const BOOTHS: Record<string, Booth[]> = {
  "ssu-daedongje-2026": [
    { id: "b1", name: "컴공 과자전", dept: "컴퓨터학부", loc: "A-01", schedule: "12:00–18:00", tag: "FOOD" },
    { id: "b2", name: "전자 노래방", dept: "전자정보공학부", loc: "A-02", schedule: "11:00–20:00", tag: "GAME" },
    { id: "b3", name: "미디어 굿즈샵", dept: "미디어학부", loc: "B-01", schedule: "10:00–18:00", tag: "GOODS" },
    { id: "b4", name: "경영 맥주바", dept: "경영학부", loc: "B-02", schedule: "16:00–21:00", tag: "BAR" },
    { id: "b5", name: "사범대 체험관", dept: "사범대학", loc: "C-01", schedule: "10:00–17:00", tag: "EXP" },
    { id: "b6", name: "법대 사주카페", dept: "법과대학", loc: "C-02", schedule: "11:00–19:00", tag: "EXP" },
  ],
};

export const LINEUPS: Record<string, Record<string, LineupSet[]>> = {
  "ssu-daedongje-2026": {
    "2026-05-12": [
      { time: "17:00", artist: "오프닝 공연", sub: "숭실대 밴드부", tag: "BAND", stage: "메인" },
      { time: "18:00", artist: "기리보이", sub: "Giriboy", tag: "HIPHOP", stage: "메인" },
      { time: "19:00", artist: "BIBI", sub: "비비", tag: "R&B", stage: "메인" },
      { time: "20:00", artist: "pH-1", sub: "피에이치원", tag: "HIPHOP", stage: "메인" },
    ],
    "2026-05-13": [
      { time: "17:00", artist: "아이유", sub: "IU", tag: "POP", stage: "메인" },
      { time: "18:30", artist: "적재", sub: "Jukjae", tag: "INDIE", stage: "메인" },
      { time: "20:00", artist: "DEAN", sub: "딘", tag: "R&B", stage: "메인" },
    ],
    "2026-05-14": [
      { time: "17:00", artist: "EXO", sub: "엑소", tag: "K-POP", stage: "메인" },
      { time: "19:00", artist: "DJ Soda", sub: "DJ소다", tag: "DJ", stage: "메인" },
      { time: "21:00", artist: "피날레", sub: "전원", tag: "BAND", stage: "메인" },
    ],
  },
};

export const NOTICES: Record<string, Notice[]> = {
  "ssu-daedongje-2026": [
    { id: "n1", title: "우천 시 행사 일정 변경 안내", preview: "강수량에 따라 야외 무대가 실내로 이동될 수 있습니다.", time: "2시간 전", pinned: true },
    { id: "n2", title: "메인 무대 라인업 최종 확정", preview: "5/12~14 전체 아티스트 스케줄이 확정되었습니다.", time: "1일 전" },
    { id: "n3", title: "부스 운영 안내 및 주의사항", preview: "음식 부스의 경우 위생 검사 필수 통과 후 운영 가능합니다.", time: "2일 전" },
    { id: "n4", title: "셔틀버스 운행 일정", preview: "캠퍼스 주요 건물에서 메인 무대까지 셔틀버스가 운행됩니다.", time: "3일 전" },
  ],
};

export const MAP_PINS: MapPin[] = [
  { id: "p1", type: "stage", label: "메인 스테이지", x: 160, y: 120 },
  { id: "p2", type: "booth", label: "부스 A구역", x: 80, y: 200 },
  { id: "p3", type: "booth", label: "부스 B구역", x: 240, y: 200 },
  { id: "p4", type: "toilet", label: "화장실 1", x: 60, y: 320 },
  { id: "p5", type: "toilet", label: "화장실 2", x: 260, y: 320 },
  { id: "p6", type: "smoking", label: "흡연구역", x: 290, y: 80 },
  { id: "p7", type: "info", label: "안내소", x: 160, y: 360 },
];

export const STATUS_META = {
  live: { en: "LIVE NOW", ko: "진행중", cls: "live" },
  upcoming: { en: "UPCOMING", ko: "예정", cls: "upcoming" },
  ended: { en: "ENDED", ko: "종료", cls: "ended" },
} as const;

export function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return start === end ? fmt(s) : `${fmt(s)} – ${fmt(e)}`;
}
