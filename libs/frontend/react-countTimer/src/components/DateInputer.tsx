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
    const handleInput: (inputVal: string) => void = (inputVal: string) => {
        setInputVal(inputVal);

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
        setCountTimer(newCountTimerItem);
    }

    const handleClick: () => void = () => {
        if (countTimer === null) {
            return;
        }
        countAction_Judgement(isInputVal);
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
        <form action="" className="w-[calc(100vw/2)] my-[5em] mx-auto text-center">
            <input id="datetime" className="border border-[#dadada] rounded py-[.5em] px-[1em]" type="datetime-local" value={isInputVal} onInput={(inputVal: ChangeEvent<HTMLInputElement>) => handleInput(inputVal.target.value)} />
            <button
                type="button"
                id="runBtn"
                className="tracking-[0.25em] py-[.5em] px-[1em] ml-[1em] bg-[#333] text-white rounded border border-transparent transition duration-[.25s] disabled:bg-[#dadada] disabled:text-[#333] not-disabled:hover:text-[#333] not-disabled:hover:cursor-pointer not-disabled:hover:border-[#333] not-disabled:hover:bg-white"
                disabled={countTimer === null}
                onClick={handleClick}
            >run</button>
            {remandView &&
                <>
                    <p style={{ 'lineHeight': '2', 'marginTop': '.5em' }}>現在 / {currTime}</p>
                    <RemandViewer />
                </>
            }
        </form>
    );
}