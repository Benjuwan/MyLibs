import { atom } from "jotai";
import { todoItemType } from "../schedule/todoItems/ts/todoItemType";
import { localstorageLabelName } from "./calendar-localstorageLabel";

const localstorageLabel: string = localstorageLabelName;

export let todoMemoLocalStorageAtom = atom<todoItemType[]>([]);

/* 既存の localStorage データを取得して（データがあれば）Atom に代入 */
const getLocalStorageItems: string | null = localStorage.getItem(localstorageLabel);
if (getLocalStorageItems !== null) {
    const SaveLocalStorageDateItems: todoItemType[] = JSON.parse(getLocalStorageItems);
    todoMemoLocalStorageAtom = atom([...SaveLocalStorageDateItems]);
}

export const todoMemoAtom = atom<todoItemType[]>([]);

export const isDesktopViewAtom = atom<boolean>(false);