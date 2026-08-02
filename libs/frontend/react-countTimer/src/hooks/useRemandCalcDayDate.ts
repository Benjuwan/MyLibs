export const useRemandCalcDayDate = () => {
    const remandCalc_DayDate: (userSelectedYear: string, userSelectedMonth: string, thisMonth: number, userSelectedDayDate: string) => number = (
        userSelectedYear: string,
        userSelectedMonth: string,
        thisMonth: number,
        userSelectedDayDate: string,
    ) => {
        const isFutureMonths = parseInt(userSelectedMonth) - thisMonth;
        const today: number = new Date().getDate();

        if (isFutureMonths === 0) {
            return parseInt(userSelectedDayDate) - today;
        } else if (isFutureMonths >= 1) {
            const thisMonthFinalDayDate: number = new Date(parseInt(userSelectedYear), thisMonth, 0).getDate();
            return parseInt(userSelectedDayDate) + (thisMonthFinalDayDate - today);
        } else {
            return isFutureMonths;
        }
    }

    return { remandCalc_DayDate }
}