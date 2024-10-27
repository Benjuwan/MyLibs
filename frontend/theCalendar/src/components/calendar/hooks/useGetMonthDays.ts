import { calendarItemType } from "../ts/calendarItemType";
import { useGetCalndarItem } from "./useGetCalendarItem";
import { usePrevNextDays } from "./usePrevNextDays";

export const useGetMonthDays = () => {
    const getMonthDays: (year: number, month: number, setDays: React.Dispatch<React.SetStateAction<calendarItemType[]>>) => void = (
        year: number,
        month: number,
        setDays: React.Dispatch<React.SetStateAction<calendarItemType[]>>
    ) => {
        const { getCalendarItem } = useGetCalndarItem();
        const { prevNextDays } = usePrevNextDays();

        /* yyyy/MM/最終日 の 日付 を取得 */
        const daysInMonth = new Date(year, month, 0).getDate(); // new Date() の第三引数は「日にち」（日にちに0を指定すると、前月の最終日（つまり指定した年月の前月の最終日）となる）

        const dayDateBox: calendarItemType[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const newCalendarItem = getCalendarItem(year, month, day);
            dayDateBox.push(newCalendarItem);
        }

        const theCalendar: calendarItemType[] = prevNextDays(year, month, dayDateBox);
        setDays((_prevDays) => theCalendar);
    }

    return { getMonthDays }
}