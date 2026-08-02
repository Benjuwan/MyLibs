import { useAtom } from "jotai";
import { monthAtom, yearAtom } from "../providers/atom";

export const useSelectedYearMonthLastDate = () => {
    const [year] = useAtom(yearAtom);
    const [month] = useAtom(monthAtom);

    /*（選択）年月に準ずる日数を生成 */
    const selectedYearMonthLastDate: (theName: string, theValue: number) => number = (
        theName: string,
        theValue: number
    ) => {
        const lastDate = theName.includes('year') ?
            new Date(theValue, month, 0).getDate() :
            new Date(year, theValue, 0).getDate();
        return lastDate;
    }

    return { selectedYearMonthLastDate }
}