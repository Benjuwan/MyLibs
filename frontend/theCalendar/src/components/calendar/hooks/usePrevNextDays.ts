import { calendarItemType } from "../ts/calendarItemType";
import { useGetCalndarItem } from "./useGetCalendarItem";

export const usePrevNextDays = () => {
    const prevNextDays = (
        year: number,
        month: number,
        dayDateBox: calendarItemType[],
    ) => {
        const { getCalendarItem } = useGetCalndarItem();

        const targetPrevDays: calendarItemType[] = [];
        const targetNextDays: calendarItemType[] = [];
        [...dayDateBox].forEach((day, i) => {
            /* 次月関連の処理 */
            if (i === dayDateBox.length - 1) {
                const targetNum: number = 7 - day.dayDateNum;
                const nextStartDay: number = new Date(year, month, 1).getDate();
                const targetDay: number = new Date(year, month, targetNum).getDate();
                for (let day = nextStartDay; day <= targetDay; day++) {
                    const newCalendarItem: calendarItemType = getCalendarItem(year, month + 1, day, true);
                    targetNextDays.push(newCalendarItem);
                }
            }

            /* 先頭（1日目）が日曜日（0）の場合は前月関連の処理は無し */
            else if (i === 0 && day.dayDateNum === 0) {
                return;
            }

            /* 前月関連の処理 */
            else if (i === 0 && day.dayDateNum !== 0) {
                const getLastSundayDayDate: number = 1 - day.dayDateNum;
                const getLastSundayDay: number = new Date(year, month - 1, getLastSundayDayDate).getDate();
                const prevFinalDay: number = new Date(year, month - 1, 0).getDate();
                for (let day = getLastSundayDay; day <= prevFinalDay; day++) {
                    const newCalendarItem: calendarItemType = getCalendarItem(year, month - 1, day, true);
                    targetPrevDays.push(newCalendarItem);
                }
            }
        });

        const theCalendar: calendarItemType[] = [...targetPrevDays, ...dayDateBox, ...targetNextDays];
        return theCalendar
    }

    return { prevNextDays }
}