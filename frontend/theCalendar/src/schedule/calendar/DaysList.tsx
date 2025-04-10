import { memo, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { todoMemoAtom } from "../../ts/calendar-atom";
import { calendarItemType } from "./ts/calendarItemType";
import { todoItemType } from "../todoItems/ts/todoItemType";
import { localstorageLabelName } from "../../ts/calendar-localstorageLabel";
import { TodoForm } from "../todoItems/TodoForm";
import { TodoList } from "../todoItems/TodoList";
import { TodoCtrlClosedBtn } from "../todoItems/TodoCtrlClosedBtn";
import { TodoCtrlOpenBtn } from "../todoItems/TodoCtrlOpenBtn";

type todaySignal = {
    thisYear: number;
    thisMonth: number;
    today: number;
}

export const DaysList = memo(({ days }: { days: calendarItemType[] }) => {
    const today: todaySignal = useMemo(() => {
        return {
            thisYear: new Date().getFullYear(),
            thisMonth: new Date().getMonth() + 1,
            today: new Date().getDate()
        }
    }, []);

    const [, setTodoMemo] = useAtom(todoMemoAtom);

    const localstorageLabel = localstorageLabelName;

    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem(localstorageLabel);
        if (getLocalStorageItems !== null) {
            const SaveLocalStorageDateItems: todoItemType[] = JSON.parse(getLocalStorageItems);
            setTodoMemo([...SaveLocalStorageDateItems]);
        } else {
            setTodoMemo([]); // 前月や次月に移動するたびに ToDo メモを初期化
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {days.map(day => (
                // カスタムデータ属性の指定は low-case でないと React から怒られる
                <li
                    key={`${day.year}/${day.month}/${day.day}`}
                    data-daydate={day.dayDateNum}
                    // day.dayDateNum === 0 日曜日
                    // day.dayDateNum === 6 土曜日
                    className={`p-[.5em] self-stretch w-full border border-[#dadada] text-center ${(
                        today.thisYear === day.year &&
                        today.thisMonth === day.month &&
                        today.today === day.day
                    ) ? 'bg-[#e8ffea]' : undefined} ${day.dayDateNum === 0 ? 'bg-[#f5c0c0]' : undefined} ${day.dayDateNum === 6 ? 'bg-[#c0dff5]' : undefined}`}>
                    <p className="leading-[2] wrap-anywhere">
                        {day.signalPrevNextMonth && <span>{day.month}/</span>}{day.day}
                    </p>
                    {day.signalPrevNextMonth ? null :
                        <div className="todoView">
                            <TodoCtrlOpenBtn />
                            <div className="todoCtrlElm w-screen h-full fixed top-[50%] left-[50%] pt-[2.5em] px-[1em] pb-[1em] transform-[translate(-50%,-50%)] bg-[rgba(255,_255,_255,_.5)] backdrop-blur-sm transition duration-[.25s] lg:p-[5em]">
                                <TodoCtrlClosedBtn />
                                <p className="text-[1.5rem] pb-[1.5em]">{day.month}/{day.day}（{day.dayDate}）</p>
                                <TodoForm props={{
                                    todoId: `${day.year}/${day.month}/${day.day}`
                                }} />
                            </div>
                            <TodoList todoID={`${day.year}/${day.month}/${day.day}`} />
                        </div>
                    }
                </li>
            ))}
        </>
    );
});