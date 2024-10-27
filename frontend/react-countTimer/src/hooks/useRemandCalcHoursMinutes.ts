export const useRemandCalcHoursMinutes = () => {
    const remandCalcHours = (
        userSelectedHours: string,
        userSelectedMinutes: string
    ) => {
        const thisHours: number = new Date().getHours();
        const isJustNextFrag: boolean = parseInt(userSelectedHours) - thisHours === 1;
        if (isJustNextFrag) {
            const thisMinutes: number = new Date().getMinutes();
            const userSelectedMinutesAhead: boolean = parseInt(userSelectedMinutes) >= thisMinutes;
            if (userSelectedMinutesAhead) return 1;
            else return 0
        }

        let calcValue: number = 0;
        const currentValue: number = new Date().getHours();

        const isPast: boolean = parseInt(userSelectedHours) - currentValue < 0;
        if (isPast) {
            calcValue = 24 + (parseInt(userSelectedHours) - currentValue);
        } else if (parseInt(userSelectedHours) - currentValue === 0) {
            return calcValue;
        } else {
            calcValue = parseInt(userSelectedHours) - currentValue;
        }

        return calcValue;
    }

    const remandCalcMinutes: (userSelectedMinutes: string) => number = (
        userSelectedMinutes: string
    ) => {
        let calcValue: number = 0;
        const currentValue: number = new Date().getMinutes() + 1; // 秒数の数値（の加算分）を考慮して分の数値には +1

        const isPast: boolean = parseInt(userSelectedMinutes) - currentValue < 0;
        if (isPast) {
            calcValue = 60 + (parseInt(userSelectedMinutes) - currentValue);
        } else if (parseInt(userSelectedMinutes) - currentValue === 0) {
            return calcValue;
        } else {
            calcValue = parseInt(userSelectedMinutes) - currentValue;
        }

        return calcValue;
    }

    return { remandCalcHours, remandCalcMinutes }
}