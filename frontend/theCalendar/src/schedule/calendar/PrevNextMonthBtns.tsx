import { FC } from "react";
import { useAtom } from "jotai";
import { todoMemoLocalStorageAtom } from "../../ts/calendar-atom";
import { localstorageLabelName } from "../../ts/calendar-localstorageLabel";

type btnsPropsType = {
    ctrlMonth: number;
    setCtrlYear: React.Dispatch<React.SetStateAction<number>>;
    ctrlYear: number;
    setCtrlMonth: React.Dispatch<React.SetStateAction<number>>;
};

export const PrevNextMonthBtns: FC<btnsPropsType> = (props) => {
    const { ctrlYear, setCtrlYear, ctrlMonth, setCtrlMonth } = props;

    const [localstorageData] = useAtom(todoMemoLocalStorageAtom); // 変数のみ使用（カレンダー移動時の登録・更新作業）

    const localstorageLabel: string = localstorageLabelName;

    const nextCalendarView = () => {
        if (ctrlMonth === 12) {
            setCtrlYear(ctrlYear + 1);
            setCtrlMonth(1);
        } else {
            setCtrlMonth(ctrlMonth + 1);
        }
        /* ---------------- localStorage 関連の処理（登録）---------------- */
        localStorage.setItem(localstorageLabel, JSON.stringify([...localstorageData]));

        window.scrollTo(0, 0);
    }

    const prevCalendarView = () => {
        if (ctrlMonth === 1) {
            setCtrlYear(ctrlYear - 1);
            setCtrlMonth(12);
        } else {
            setCtrlMonth(ctrlMonth - 1);
        }
        /* ---------------- localStorage 関連の処理（登録）---------------- */
        localStorage.setItem(localstorageLabel, JSON.stringify([...localstorageData]));

        window.scrollTo(0, 0);
    }

    return (
        <div className="flex justify-between">
            <button type="button" className="cursor-pointer py-[.5em] px-[1em] bg-[#333] text-white rounded active:opacity-[.75]" onClick={prevCalendarView}><span className="material-symbols-outlined align-middle">
                navigate_before
            </span></button>
            <button type="button" className="cursor-pointer py-[.5em] px-[1em] bg-[#333] text-white rounded active:opacity-[.75]" onClick={nextCalendarView}><span className="material-symbols-outlined align-middle">
                navigate_next
            </span></button>
        </div>
    );
}