import { ChangeEvent, useEffect, useState } from "react";
import { countTimerType } from "../ts/countTimerType";
import { useAtom } from "jotai";
import { countTimerAtom, remandViewAtom } from "../ts/atom";
import { RemandViewer } from "./RemandViewer";
import { useCountActionJudgement } from "../hooks/useCountActionJudgement";

export const DateInputer = () => {
    const [countTimer, setCountTimer] = useAtom(countTimerAtom);
    const [remandView] = useAtom(remandViewAtom);
    const [currTime, setCurrTime] = useState<string>('');

    const { countAction_Judgement } = useCountActionJudgement();

    const [isInputVal, setInputVal] = useState<string>('');
    const handleInput = (inputVal: string) => {
        setInputVal((_prevInputVal) => inputVal);

        const splitDateTime = inputVal.split('-');
        const userSelectedHoursMinutes = [...splitDateTime][splitDateTime.length - 1].split('T')[1].split(':');

        const userSelectedYear = splitDateTime[0];
        const userSelectedMonth = splitDateTime[1];
        const userSelectedDayDate = [...splitDateTime][splitDateTime.length - 1].split('T')[0];
        const userSelectedHours = userSelectedHoursMinutes[0];
        const userSelectedMinutes = userSelectedHoursMinutes[1];

        const newCountTimerItem: countTimerType = {
            year: userSelectedYear,
            month: userSelectedMonth,
            dayDate: userSelectedDayDate,
            hour: userSelectedHours,
            minute: userSelectedMinutes
        }
        setCountTimer((_prevCountTimer) => newCountTimerItem);
    }

    const handleClick = () => {
        if (countTimer !== null) countAction_Judgement(isInputVal);
    }

    useEffect(() => {
        const thisYear: number = new Date().getFullYear();
        const thisMonth: number = new Date().getMonth() + 1;
        const today: number = new Date().getDate();
        const nowHours: number = new Date().getHours();
        const nowMinutes: number = new Date().getMinutes();
        setCurrTime(`${thisYear}年${thisMonth.toString().padStart(2, '0')}月${today.toString().padStart(2, '0')}日${nowHours.toString().padStart(2, '0')}：${nowMinutes.toString().padStart(2, '0')}`);
    }, [countTimer]);

    return (
        <>
            <input id="datetime" type="datetime-local" value={isInputVal} onInput={(inputVal: ChangeEvent<HTMLInputElement>) => handleInput(inputVal.target.value)} />
            <button type="button" id="runBtn" onClick={handleClick}>run</button>
            {remandView &&
                <>
                    <p style={{ 'lineHeight': '2', 'marginTop': '.5em' }}>現在 / {currTime}</p>
                    <RemandViewer />
                </>
            }
        </>
    );
}