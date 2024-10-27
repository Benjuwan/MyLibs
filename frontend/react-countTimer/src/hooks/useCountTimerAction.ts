import { countTimerType, monthsAndDaysType } from "../ts/countTimerType";
import { useAtom } from "jotai";
import { countTimerAtom, remandViewAtom, timeIntervalAtom } from "../ts/atom";
import { useRemandCalcYearMonths } from "./useRemandCalcYearMonths";
import { useRemandCalcDayDate } from "./useRemandCalcDayDate";
import { useRemandCalcHoursMinutes } from "./useRemandCalcHoursMinutes";
import { useRemandCalcSeconds } from "./useRemandCalcSeconds";
import { useRemandCalcVerFutureGetMonthsDays } from "./useRemandCalcVerFutureGetMonthsDays";
import { useInputValSplitUserSelectedTime } from "./useInputValSplitUserSelectedTime";

export const useCountTimerAction = () => {
    const [, setTimeInterval] = useAtom(timeIntervalAtom);
    const [, setCountTimer] = useAtom(countTimerAtom);
    const [, setRemandView] = useAtom(remandViewAtom);
    const { inputValSplitUserSelectedTime } = useInputValSplitUserSelectedTime();

    const countTimerAction: (isInputVal: string) => void = (isInputVal: string) => {
        const userSelectedTimeObj: countTimerType = inputValSplitUserSelectedTime(isInputVal);

        const thisYear: number = new Date().getFullYear();
        const thisMonth: number = new Date().getMonth() + 1;

        const { remandCalcYear, remandCalcMonth } = useRemandCalcYearMonths();
        const { remandCalc_DayDate } = useRemandCalcDayDate();
        const { remandCalcHours, remandCalcMinutes } = useRemandCalcHoursMinutes();
        const { remandCalc_Seconds } = useRemandCalcSeconds();
        const { remandCalcVerFuture_GetMonthsDays } = useRemandCalcVerFutureGetMonthsDays();

        const currTimeInterval: number = setInterval(() => {
            let remandTime_Year: number = remandCalcYear(
                userSelectedTimeObj.year,
                thisYear,
                userSelectedTimeObj.month,
                thisMonth
            );

            let remandTime_Month: number = remandCalcMonth(
                userSelectedTimeObj.month,
                thisMonth
            );

            let remandTime_Daydate: number = remandCalc_DayDate(
                userSelectedTimeObj.year,
                userSelectedTimeObj.month,
                thisMonth,
                userSelectedTimeObj.dayDate
            );

            const remandTime_Hours: number = remandCalcHours(userSelectedTimeObj.hour, userSelectedTimeObj.minute);

            const remandTime_Minutes: number = remandCalcMinutes(userSelectedTimeObj.minute);

            const theSeconds: number = remandCalc_Seconds();

            /* 指定数値が翌年以上の場合の「月」と「日」*/
            const isFuture: boolean = parseInt(userSelectedTimeObj.year) > thisYear;
            if (isFuture) {
                const remandCalcVerFutureGetMonthsDays: monthsAndDaysType = remandCalcVerFuture_GetMonthsDays(
                    userSelectedTimeObj.year,
                    userSelectedTimeObj.month,
                    userSelectedTimeObj.dayDate,
                    thisYear,
                    thisMonth
                );

                if (typeof remandCalcVerFutureGetMonthsDays.year !== 'undefined') remandTime_Year = remandCalcVerFutureGetMonthsDays.year;
                remandTime_Month = remandCalcVerFutureGetMonthsDays.months;
                remandTime_Daydate = remandCalcVerFutureGetMonthsDays.days;
            }

            if (
                remandTime_Year === 0 &&
                remandTime_Month === 0 &&
                remandTime_Daydate === 0 &&
                remandTime_Hours === 0 &&
                remandTime_Minutes === 0 &&
                theSeconds === 0
            ) {
                clearInterval(currTimeInterval);
                setTimeInterval(null);
                setRemandView(false);
                return; // return で処理終了
            }

            const newCountTimerItem: countTimerType = {
                year: remandTime_Year.toString(),
                month: remandTime_Month.toString(),
                dayDate: remandTime_Daydate.toString(),
                hour: remandTime_Hours.toString().padStart(2, '0'),
                minute: remandTime_Minutes.toString().padStart(2, '0'),
                second: theSeconds.toString().padStart(2, '0')
            }
            setCountTimer((_prevCountTimer) => newCountTimerItem);
            setTimeInterval((_prevTimeInterval) => currTimeInterval);
            setRemandView(true);
        }, 1000);
    }

    return { countTimerAction }
}