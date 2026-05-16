import { Timestamp } from "firebase/firestore";

// ── Status ────────────────────────────────────────────────
export type FestivalStatus = "UPCOMING" | "LIVE" | "ENDED";

// ── Firestore 저장 형식 (Timestamp 사용) ──────────────────
export interface FestivalDoc {
  name: string;           // 축제명
  nameEn: string;         // 영문명
  school: string;         // 학교명
  tagline: string;        // 태그라인
  description: string;    // 소개
  thumbnail: string;      // 썸네일 URL (Storage)
  colors: string[];       // 포스터 색상 ["#FF1E7A", ...]
  participants: number;   // 참여자 수
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── API 응답 형식 (id 포함, 날짜는 ISO string) ────────────
export interface FestivalResponse extends Omit<FestivalDoc, "startDate" | "endDate" | "createdAt" | "updatedAt"> {
  id: string;
  start: string;   // ISO date "2026-05-12"
  end: string;
  status: FestivalStatus;   // 날짜 기반 자동 계산
  createdAt: string;
  updatedAt: string;
}

// ── 생성/수정 입력 형식 ────────────────────────────────────
export interface FestivalInput {
  name: string;
  nameEn: string;
  school: string;
  tagline?: string;
  description?: string;
  thumbnail?: string;
  colors?: string[];
  start: string;   // "2026-05-12"
  end: string;
}

// ── 쿼리 파라미터 ─────────────────────────────────────────
export interface GetFestivalsParams {
  page?: number;
  size?: number;
  status?: FestivalStatus;
  orderByCreatedTimestamp?: "asc" | "desc";
}

// ── 부스 ──────────────────────────────────────────────────
export type BoothTag = "FOOD" | "BAR" | "GAME" | "GOODS" | "EXP";

export interface BoothDoc {
  name: string;
  dept: string;
  loc: string;
  schedule: string;
  tag: BoothTag;
  order: number;
  days: string[];   // 운영 날짜 목록 ["2026-05-18", ...], 비어있으면 전체 기간
}

export interface BoothResponse extends BoothDoc {
  id: string;
  festivalId: string;
}

export type BoothInput = Omit<BoothDoc, "order">;

// ── 라인업 ────────────────────────────────────────────────
export interface LineupDoc {
  day: string;      // "2026-05-12"
  time: string;     // "19:00"
  artist: string;
  sub: string;
  tag: string;      // K-POP | BAND | HIPHOP | R&B | DJ | INDIE | POP
  stage: string;    // 메인 | 서브
  order: number;
}

export interface LineupResponse extends LineupDoc {
  id: string;
  festivalId: string;
}

export type LineupInput = Omit<LineupDoc, "order">;

// ── 공지 ──────────────────────────────────────────────────
export interface NoticeDoc {
  title: string;
  content: string;
  pinned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NoticeResponse extends Omit<NoticeDoc, "createdAt" | "updatedAt"> {
  id: string;
  festivalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeInput {
  title: string;
  content: string;
  pinned?: boolean;
}

// ── 지도 핀 ───────────────────────────────────────────────
export type MapPinType = "stage" | "booth" | "toilet" | "smoking" | "info";

export interface MapPinDoc {
  type: MapPinType;
  label: string;
  x: number;
  y: number;
}

export interface MapPinResponse extends MapPinDoc {
  id: string;
  festivalId: string;
}

export type MapPinInput = MapPinDoc;
