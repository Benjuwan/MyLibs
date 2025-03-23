import { useAtom } from "jotai";
import { dataOptionsAtom } from "../providers/atom";
import { useCreateEachSelectOptions } from "./useCreateEachSelectOptions";
import { useSelectedYearMonthLastDate } from "./useSelectedYearMonthLastDate";
import { ChangeEvent } from "react";

export const useChangeData = () => {
    const [, setDateOptions] = useAtom(dataOptionsAtom);

    const { createEachSelectOptions } = useCreateEachSelectOptions();
    const { selectedYearMonthLastDate } = useSelectedYearMonthLastDate();

    /* 年と月の select 要素のイベントハンドラーによる日数の変更調整 */
    const changeData: (e: ChangeEvent<HTMLSelectElement>) => void = (e: ChangeEvent<HTMLSelectElement>) => {
        const theName: string = e.target.name;
        const theValue: number = parseInt(e.target.value);

        const lastDate: number = selectedYearMonthLastDate(theName, theValue);
        const updateDateOptions: string[] = createEachSelectOptions(1, lastDate);

        setDateOptions(updateDateOptions); // 選択年月に準じた日数の更新
    }

    return { changeData }
}