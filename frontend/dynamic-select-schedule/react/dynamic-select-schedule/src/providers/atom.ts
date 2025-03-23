import { atom } from "jotai";

/* 年（初期値は今年）*/
const currYear: number = new Date().getFullYear();
export const yearAtom = atom(currYear);

/* 月（初期値は今月）*/
const currMonth: number = new Date().getMonth() + 1;
export const monthAtom = atom(currMonth);

/* 日（初期値は今日）*/
const currDate: number = new Date().getDate();
export const dateAtom = atom(currDate);

// 各 select の option 生成（用の文字列型インデックス数を格納した配列を用意）する関数
/**
 * src\hooks\useCreateEachSelectOptions.ts と全く同じ処理内容だが、
 * top level でのカスタムフックの使用は lint エラーが発生するので
 * 以下のように同じ処理関数を作成して対応
*/
const createEachSelectOptions: (loopStart: number, loopFinish: number) => string[] = (loopStart: number, loopFinish: number) => {
    const elms: string[] = []
    for (let i = loopStart; i <= loopFinish; i++) {
        elms.push(i.toString());
    }
    return elms;
}

/* 日数（初期値は今年今月の日数）*/
const initLastDate = new Date(currYear, currMonth, 0).getDate();
const initDateOptions: string[] = createEachSelectOptions(1, initLastDate);
export const dataOptionsAtom = atom(initDateOptions);