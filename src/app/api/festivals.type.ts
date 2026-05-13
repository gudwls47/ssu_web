import { Timestamp } from "firebase/firestore";

export type FestivalStatus = "UPCOMING" | "LIVE" | "ENDED";

export interface FestivalResponse {
  id: string;
  status: FestivalStatus;
  title: string;
  target: string;
  createdAt: Timestamp;
  startDate: Timestamp;
  endDate: Timestamp;
}

export interface GetFestivalsParams {
  page: number;
  orderByCreatedTimestamp?: "asc" | "desc";
  status?: FestivalStatus;
  size?: number;
}
