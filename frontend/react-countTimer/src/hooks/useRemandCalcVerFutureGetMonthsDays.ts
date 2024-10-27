import { monthsAndDaysType } from "../ts/countTimerType";

export const useRemandCalcVerFutureGetMonthsDays = () => {
    const calcThisYearRemandDays: (userSelectedYear: string, userSelectedMonth: string, thisYear: number, today: number, isJan: boolean, sameMonth?: boolean) => number = (
        userSelectedYear: string,
        userSelectedMonth: string,
        thisYear: number,
        today: number,
        isJan: boolean,
        sameMonth: boolean = false
    ) => {
        /* 入力年または今年が閏年かどうかを判定 */
        const isFeb29_userSelectedYear: boolean = new Date(parseInt(userSelectedYear), 2, 0).getDate() === 29;
        const isFeb29_thisYear: boolean = new Date(thisYear, 2, 0).getDate() === 29;

        if (sameMonth) {
            /* 入力月と今月が同じ場合は、指定した月に対する「今年の「前月」までの経過月」 */
            const thisYearPrePassedMonths: number[] = [];
            for (let i = 1; i < parseInt(userSelectedMonth); i++) {
                const finalDayDate = new Date(thisYear, i, 0).getDate();
                thisYearPrePassedMonths.push(finalDayDate);
            }
            const thisYearPrePassedDays: number = thisYearPrePassedMonths.reduce((acuu, curr) => acuu + curr);
            // console.log(thisYearPrePassedMonths);

            if (isFeb29_thisYear || isFeb29_userSelectedYear) {
                return 366 - (thisYearPrePassedDays + today);
            } else {
                return 365 - (thisYearPrePassedDays + today);
            }
        } else {
            /* 指定した月に対する「今年の経過月」 */
            const thisYearPassedMonths: number[] = [];
            if (isJan) {
                /* 入力月または今月が 1月の場合 */
                for (let i = 1; i <= parseInt(userSelectedMonth) + 1; i++) {
                    const finalDayDate = new Date(thisYear, i, 0).getDate();
                    thisYearPassedMonths.push(finalDayDate);
                }
            } else {
                for (let i = 1; i < parseInt(userSelectedMonth) + 1; i++) {
                    const finalDayDate = new Date(thisYear, i, 0).getDate();
                    thisYearPassedMonths.push(finalDayDate);
                }
            }
            const thisYearPassedDays: number = thisYearPassedMonths.reduce((acuu, curr) => acuu + curr);
            // console.log(thisYearPassedMonths);

            if (isFeb29_thisYear || isFeb29_userSelectedYear) {
                return 366 - (thisYearPassedDays + today);
            } else {
                return 365 - (thisYearPassedDays + today);
            }
        }
    }


    const remandCalcVerFuture_GetMonthsDays: (userSelectedYear: string, userSelectedMonth: string, userSelectedDayDate: string, thisYear: number, thisMonth: number) => monthsAndDaysType = (
        userSelectedYear: string,
        userSelectedMonth: string,
        userSelectedDayDate: string,
        thisYear: number,
        thisMonth: number
    ) => {
        const thisMonthFinalDayDate: number = new Date(thisYear, thisMonth, 0).getDate(); // 当年当月の最終日付け
        const today: number = new Date().getDate(); // 本日

        const isJan: boolean = (parseInt(userSelectedMonth) || thisMonth) === 1; // 入力月または今月が 1月かどうかを判定

        const futureTargetPassedMonths: number[] = [];
        if (isJan) {
            futureTargetPassedMonths.push(parseInt(userSelectedDayDate));
        } else {
            /* 指定した月に対する「来年の「前月」までの経過対象月」 */
            for (let i = 1; i < parseInt(userSelectedMonth); i++) {
                const finalDayDate = new Date(parseInt(userSelectedYear), i, 0).getDate();
                futureTargetPassedMonths.push(finalDayDate);
            }
        }
        let futureTargetPassedDays: number = futureTargetPassedMonths.reduce((acuu, curr) => acuu + curr);

        /* 今月に対して（未来の）過去月を指定した場合 */
        const isFuture_but_pastMonthsAgainstThisMonths: boolean = parseInt(userSelectedMonth) <= thisMonth;
        if (isFuture_but_pastMonthsAgainstThisMonths) {
            let thisYearRemandDays: number = 0;
            if (thisMonth === parseInt(userSelectedMonth)) {
                thisYearRemandDays = calcThisYearRemandDays(userSelectedYear, userSelectedMonth, thisYear, today, isJan, true);
            } else {
                thisYearRemandDays = calcThisYearRemandDays(userSelectedYear, userSelectedMonth, thisYear, today, isJan);
            }

            const remandDays: number = thisYearRemandDays + futureTargetPassedDays;
            // console.log(thisYearRemandDays, futureTargetPassedMonths, remandDays);

            const isJustNextYear: boolean = parseInt(userSelectedYear) - thisYear === 1;
            const monthsAndDays: monthsAndDaysType = {
                year: isJustNextYear ? 0 : parseInt(userSelectedYear) - thisYear,
                months: 0,
                days: 0
            }

            let resultDays: number = 0;
            if (isJan) resultDays = remandDays;
            else resultDays = remandDays + parseInt(userSelectedDayDate);
            // console.log(remandDays, resultDays);

            if (resultDays > 365) {
                monthsAndDays.days = resultDays - 365;
                const isNextYear: boolean = parseInt(userSelectedYear) - thisYear >= 1;
                monthsAndDays.year = isNextYear ? parseInt(userSelectedYear) - thisYear : 0;
            } else {
                monthsAndDays.days = resultDays;
            }

            return monthsAndDays; // return で処理終了
        }

        const remandDays: number = parseInt(userSelectedDayDate) + (thisMonthFinalDayDate - today);

        const isNextMonth: boolean = parseInt(userSelectedMonth) - thisMonth === 1;
        const monthsAndDays: monthsAndDaysType = {
            months: isFuture_but_pastMonthsAgainstThisMonths || isNextMonth ? 0 : futureTargetPassedMonths.length - 3, // 日数（の加算分）を考慮して-3
            days: remandDays
        }

        return monthsAndDays;
    }

    return { remandCalcVerFuture_GetMonthsDays }
}