import { countTimerType } from "../ts/countTimerType";

export const useInputValSplitUserSelectedTime = () => {
    const inputValSplitUserSelectedTime: (isInputVal: string) => countTimerType = (isInputVal: string) => {
        const splitDateTime: string[] = isInputVal.split('-');
        const userSelectedHoursMinutes: string[] = [...splitDateTime][splitDateTime.length - 1].split('T')[1].split(':');
        const userSelectedYear: string = splitDateTime[0];
        const userSelectedMonth: string = splitDateTime[1];
        const userSelectedDayDate: string = [...splitDateTime][splitDateTime.length - 1].split('T')[0];
        const userSelectedHours: string = userSelectedHoursMinutes[0];
        const userSelectedMinutes: string = userSelectedHoursMinutes[1];

        const userSelectedTimeObj: countTimerType = {
            year: userSelectedYear,
            month: userSelectedMonth,
            dayDate: userSelectedDayDate,
            hour: userSelectedHours,
            minute: userSelectedMinutes
        };

        return userSelectedTimeObj;
    }

    return { inputValSplitUserSelectedTime }
}