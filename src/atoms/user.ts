import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atom<{ id: number } | null>(null);
export const fcmTokenAtom = atomWithStorage("fcmToken", null);
export const locationPermissionAtom = atom<"granted" | "denied" | null>(null);
