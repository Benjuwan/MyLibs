import { countTimerType } from "../ts/countTimerType";
import { useAtom } from "jotai";
import { countTimerAtom, remandViewAtom, timeIntervalAtom } from "../ts/atom";
import { useInputValSplitUserSelectedTime } from "./useInputValSplitUserSelectedTime";

export const useCountTimerAction = () => {
    const [, setTimeInterval] = useAtom(timeIntervalAtom);
    const [, setCountTimer] = useAtom(countTimerAtom);
    const [, setRemandView] = useAtom(remandViewAtom);
    const { inputValSplitUserSelectedTime } = useInputValSplitUserSelectedTime();

    const countTimerAction: (isInputVal: string) => void = (isInputVal: string) => {
        const userSelectedTimeObj: countTimerType = inputValSplitUserSelectedTime(isInputVal);

        const currTimeInterval: number = setInterval(() => {
            const now = new Date();
            const target = new Date(
                parseInt(userSelectedTimeObj.year),
                parseInt(userSelectedTimeObj.month) - 1,
                parseInt(userSelectedTimeObj.dayDate),
                parseInt(userSelectedTimeObj.hour),
                parseInt(userSelectedTimeObj.minute),
                0
            );

            let diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(currTimeInterval);
                setTimeInterval(null);
                setRemandView(false);
                return;
            }

            let years = target.getFullYear() - now.getFullYear();
            let months = target.getMonth() - now.getMonth();
            let days = target.getDate() - now.getDate();
            let hours = target.getHours() - now.getHours();
            let minutes = target.getMinutes() - now.getMinutes();
            let seconds = target.getSeconds() - now.getSeconds();

            if (seconds < 0) {
                seconds += 60;
                minutes--;
            }
            if (minutes < 0) {
                minutes += 60;
                hours--;
            }
            if (hours < 0) {
                hours += 24;
                days--;
            }
            if (days < 0) {
                // Get the number of days in the previous month of target
                const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
                days += prevMonth.getDate();
                months--;
            }
            if (months < 0) {
                months += 12;
                years--;
            }

            const newCountTimerItem: countTimerType = {
                year: years.toString(),
                month: months.toString(),
                dayDate: days.toString(),
                hour: hours.toString().padStart(2, '0'),
                minute: minutes.toString().padStart(2, '0'),
                second: seconds.toString().padStart(2, '0')
            };

            setCountTimer(newCountTimerItem);
            setTimeInterval(currTimeInterval);
            setRemandView(true);
        }, 1000);
    }

    return { countTimerAction }
}