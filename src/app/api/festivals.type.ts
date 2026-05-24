import { Timestamp } from "firebase/firestore";

// ── Status ────────────────────────────────────────────────
export type FestivalStatus = "UPCOMING" | "LIVE" | "ENDED";

// ── Firestore 저장 형식 (Timestamp 사용) ──────────────────
export interface FestivalDoc {
  name: string; // 축제명
  nameEn: string; // 영문명
  school: string; // 학교명
  tagline: string; // 태그라인
  description: string; // 소개
  thumbnail: string; // 썸네일 URL (Storage)
  mapImage?: string; // 지도 배경 이미지 URL
  colors: string[]; // 포스터 색상 ["#FF1E7A", ...]
  participants: number; // 참여자 수
  ownerUid: string; // 등록한 주최자 UID
  address?: string; // 축제 장소 주소
  lat?: number; // 위도
  lng?: number; // 경도
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  schoolName?: string;
  enSchoolName?: string;
  targetYear?: number;
  title: string;
}

// ── API 응답 형식 (id 포함, 날짜는 ISO string) ────────────
export interface FestivalResponse extends Omit<
  FestivalDoc,
  "createdAt" | "updatedAt" | "startDate" | "endDate"
> {
  id: string;
  start: string; // ISO date "2026-05-12"
  end: string;
  status: FestivalStatus; // 날짜 기반 자동 계산
  createdAt: string;
  updatedAt: string;
  // ownerUid는 FestivalDoc 에서 상속
}

// ── 생성/수정 입력 형식 ────────────────────────────────────
export interface FestivalInput {
  name: string;
  nameEn?: string; // 선택사항
  school: string;
  tagline?: string;
  description?: string;
  thumbnail?: string;
  mapImage?: string;
  colors?: string[];
  start: string; // "2026-05-12"
  end: string;
  address?: string;
  lat?: number;
  lng?: number;
}

// ── 쿼리 파라미터 ─────────────────────────────────────────
export interface GetFestivalsParams {
  page?: number;
  size?: number;
  status?: FestivalStatus;
  orderByCreatedTimestamp?: "asc" | "desc";
  ownerUid?: string; // 지정하면 해당 관리자가 등록한 축제만 반환
}

// ── 부스 ──────────────────────────────────────────────────
export type BoothTag = "FOOD" | "BAR" | "GAME" | "GOODS" | "EXP";

export interface BoothDoc {
  name: string;
  dept: string;
  loc: string;
  schedule: string;
  desc?: string; // 부스 상세 설명
  tag: BoothTag;
  order: number;
  days: string[]; // 운영 날짜 목록 ["2026-05-18", ...], 비어있으면 전체 기간
  likes?: number; // 좋아요 수
  dislikes?: number; // 싫어요 수
}

export interface BoothResponse extends BoothDoc {
  id: string;
  festivalId: string;
}

export type BoothInput = Omit<BoothDoc, "order">;

// ── 라인업 ────────────────────────────────────────────────
export interface LineupDoc {
  day: string; // "2026-05-12"
  time: string; // "19:00"
  artist: string;
  sub: string;
  tag: string; // K-POP | BAND | HIPHOP | R&B | DJ | INDIE | POP
  stage: string; // 메인 | 서브
  order: number;
}

export interface LineupResponse extends LineupDoc {
  id: string;
  festivalId: string;
}

export type LineupInput = Omit<LineupDoc, "order">;

// ── 공지 ──────────────────────────────────────────────────
export type NoticeCategory = "긴급" | "안내" | "교통" | "굿즈";

export interface NoticeDoc {
  title: string;
  content: string;
  category: NoticeCategory;
  pinned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NoticeResponse extends Omit<
  NoticeDoc,
  "createdAt" | "updatedAt"
> {
  id: string;
  festivalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeInput {
  title: string;
  content: string;
  category: NoticeCategory;
}

// ── 지도 핀 ───────────────────────────────────────────────
export type MapPinType = "stage" | "booth" | "toilet" | "smoking" | "info";

export interface MapPinDoc {
  type: MapPinType;
  label: string;
  x: number;
  y: number;
  boothIds?: string[]; // booth 타입 핀에 연결된 부스 목록 (날짜별로 다른 부스 가능)
}

export interface MapPinResponse extends MapPinDoc {
  id: string;
  festivalId: string;
}

export type CommentTag = "라인업" | "지도" | "부스" | "공지";

export interface FestivalCommentDoc {
  id: string;
  content: string;
  createdAt: Timestamp;
  createdUser?: string;
  festivalId: string;
  tag?: CommentTag; // 연관 탭 태그
}

export interface FestivalCommentResponse extends Omit<
  FestivalCommentDoc,
  "createdUser"
> {
  createdUser?: UserResponse;
  createdUserUid?: string; // 원본 UID (소유권 체크용)
}

export interface FestivalCommentRequest {
  festivalId: string;
  createdUser?: string;
  content: string;
  createdAt: Timestamp;
  tag?: CommentTag;
}

export interface UserResponse {
  id: string;
  createdAt: Timestamp;
  displayName: string;
  email: string;
  organization: string;
  role: "admin" | "user";
}

export type MapPinInput = MapPinDoc;
