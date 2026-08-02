import { atom } from "jotai";
import { countTimerType } from "./countTimerType";

export const remandViewAtom = atom(false);
export const countTimerAtom = atom<countTimerType | null>(null);
export const timeIntervalAtom = atom<number | null>(null);