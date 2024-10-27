import { useAtom } from "jotai";
import { countTimerAtom, timeIntervalAtom } from "../ts/atom";
import { useCountTimerAction } from "./useCountTimerAction";
import { useInputValSplitUserSelectedTime } from "./useInputValSplitUserSelectedTime";

export const useCountActionJudgement = () => {
    const [timeInterval, setTimeInterval] = useAtom(timeIntervalAtom);
    const [countTimer] = useAtom(countTimerAtom);
    const { countTimerAction } = useCountTimerAction();
    const { inputValSplitUserSelectedTime } = useInputValSplitUserSelectedTime();

    const countAction_Judgement: (isInputVal: string) => void = (isInputVal: string) => {
        const userSelectedTimeObj = inputValSplitUserSelectedTime(isInputVal);

        const thisYear: number = new Date().getFullYear();
        const thisMonth: number = new Date().getMonth() + 1;
        const today: number = new Date().getDate();
        const nowHours: number = new Date().getHours();
        const nowMinutes: number = new Date().getMinutes();

        const currentNumber: string[] = [thisYear.toString(), thisMonth.toString().padStart(2, '0'), today.toString().padStart(2, '0'), nowHours.toString().padStart(2, '0'), nowMinutes.toString().padStart(2, '0')];

        if (countTimer !== null) {
            const userSelectedValue = `${userSelectedTimeObj.year}${userSelectedTimeObj.month.toString().padStart(2, '0')}${userSelectedTimeObj.dayDate.toString().padStart(2, '0')}${userSelectedTimeObj.hour.toString().padStart(2, '0')}${userSelectedTimeObj.minute.toString().padStart(2, '0')}`;

            // console.log(currentNumber.join(''), userSelectedValue);

            if (parseInt(currentNumber.join('')) >= parseInt(userSelectedValue)) {
                alert('過去は選択できません');
                return; // return で処理終了
            } else {
                if (timeInterval !== null) clearInterval(timeInterval);
                setTimeInterval(null);
                countTimerAction(isInputVal);
            }
        }
    }

    return { countAction_Judgement }
}