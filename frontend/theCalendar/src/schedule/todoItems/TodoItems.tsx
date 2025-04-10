import { SyntheticEvent } from "react";
import { todoItemType } from "./ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "../../ts/calendar-atom";
import { TodoForm } from "./TodoForm";
import { useDeleteTodoItem } from "./hooks/useDeleteTodoItem";
import { useCloseModalWindow } from "./hooks/useCloseModalWindow";

export const TodoItems = ({ todoItem }: { todoItem: todoItemType }) => {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    const { deleteTodoItem } = useDeleteTodoItem();
    const { closeModalWindow } = useCloseModalWindow();

    const handleCloseModalWindowBtnClicked: (btnEl: SyntheticEvent<HTMLButtonElement>) => void = (btnEl: SyntheticEvent<HTMLButtonElement>) => {
        btnEl.stopPropagation(); // 親要素のクリックイベント（OnViewModalWindow）発生を防止
        closeModalWindow();
        window.scrollTo(0,0);
    }

    const changeMode: (todoItem: todoItemType) => void = (todoItem: todoItemType) => {
        let editState: boolean | null = null;
        if (todoItem.edit === false) editState = true;
        else editState = false;

        const updateTodoList: todoItemType = {
            ...todoItem,
            edit: editState
        }

        if (todoItem.startTime || todoItem.finishTime) {
            updateTodoList.startTime = todoItem.startTime;
            updateTodoList.finishTime = todoItem.finishTime;
        }

        const exceptUpdateTodoMemos: todoItemType[] = [...todoMemo].filter(todoMemoItem => todoMemoItem.uuid !== todoItem.uuid);

        setTodoMemo([...exceptUpdateTodoMemos, updateTodoList]);
    }

    return (
        <div className="modalWindow fixed w-screen h-full m-auto pt-[2.5em] px-[1em] pb-[1em] top-[50%] left-[50%] transform-[translate(-50%,-50%)] bg-[rgba(255,255,255,.5)] backdrop-blur-sm transition-[opacity] transition-[visibility] duration-[.25s] overflow-y-auto overscroll-contain">
            <div className="flex flex-row flex-wrap justify-center gap-[1em] max-w-[35rem] m-auto bg-white shadow-[0_0_4px_rgba(0,0,0,.5)_inset] rounded p-[1em]">
                {todoItem.edit ?
                    <>
                        <div className="text-left cursor-default">
                            <p>--- 編集前 ---</p>
                            <p>ToDo：{todoItem.todoContent}</p>
                            {todoItem.startTime && <p>開始時刻：{todoItem.startTime}</p>}
                            {todoItem.finishTime && <p>終了時刻：{todoItem.finishTime}</p>}
                        </div>
                        <TodoForm props={{
                            todoItem: todoItem
                        }} />
                        <div className="cursor-default flex gap-[1em] w-full mt-[2.5em] mx-0 mb-[1em]">
                            <button id="deleteBtn" className="cursor-pointer aspect-square rounded-lg w-full border border-transparent h-[2.75rem] grid place-content-center m-auto rounded-lg tracking-[.25em] bg-[#cc3226] text-white hover:bg-white hover:text-[#cc3226] hover:border-[#cc3226]" type="button" onClick={(deleteBtn: SyntheticEvent<HTMLButtonElement>) => {
                                handleCloseModalWindowBtnClicked(deleteBtn);
                                deleteTodoItem(todoItem.uuid);
                            }}>削除</button>
                            <button className="cursor-pointer aspect-square rounded-lg w-full border border-transparent h-[2.75rem] grid place-content-center m-auto rounded-lg tracking-[.25em] bg-[#59b835] text-white hover:bg-white hover:text-[#59b835] hover:border-[#59b835]" type="button" onClick={() => changeMode(todoItem)}>戻る</button>
                        </div>
                    </> :
                    <div className="w-full flex flex-col gap-[1em]">
                        <div className="text-left cursor-default">
                            <p>--- 現在の予定内容 ---</p>
                            <p>ToDo：{todoItem.todoContent}</p>
                            {todoItem.startTime && <p>開始時刻：{todoItem.startTime}</p>}
                            {todoItem.finishTime && <p>終了時刻：{todoItem.finishTime}</p>}
                        </div>
                        <button className="cursor-pointer aspect-square rounded-lg w-full h-[2.75rem] grid place-content-center m-auto rounded-lg tracking-[.25em] border border-transparent text-white bg-[#59b835] transition duration-[.25s] hover:bg-white hover:text-[#59b835] hover:border-[#59b835]" type="button" onClick={() => changeMode(todoItem)}>編集</button>
                    </div>
                }
            </div>
            <button id="closeBtn" className="cursor-pointer aspect-square rounded-lg w-full max-w-[35rem] border border-transparent text-white h-[2.75rem] grid place-content-center m-auto rounded-lg tracking-[.25em] mt-[1em] text-[#333] bg-[#f0b20e] transition duration-[.25s] hover:bg-white hover:text-[#f0b20e] hover:border-[#f0b20e]" type="button" onClick={handleCloseModalWindowBtnClicked}>詳細画面を閉じる</button>
        </div>
    );
}