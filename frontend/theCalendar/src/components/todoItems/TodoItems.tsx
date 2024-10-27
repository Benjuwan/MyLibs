import { SyntheticEvent } from "react";
import todoStyle from "./css/todoStyle.module.css";
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
    const handleCloseModalWindowBtnClicked = (btnEl: SyntheticEvent<HTMLButtonElement>) => {
        btnEl.stopPropagation(); // 親要素のクリックイベント（OnViewModalWindow）発生を防止
        closeModalWindow();
        window.scrollTo(0, 0);
    }

    const changeMode: (todoItem: todoItemType) => void = (todoItem: todoItemType) => {
        let editState: boolean | null = null;
        if (todoItem.edit === false) editState = true;
        else editState = false;

        const updateTodoList: todoItemType = {
            uuid: todoItem.uuid,
            todoID: todoItem.todoID,
            todoContent: todoItem.todoContent,
            edit: editState
        }

        if (todoItem.startTime || todoItem.finishTime) {
            updateTodoList.startTime = todoItem.startTime;
            updateTodoList.finishTime = todoItem.finishTime;
        }

        const exceptUpdateTodoMemos: todoItemType[] = [...todoMemo].filter(todoMemoItem => todoMemoItem.uuid !== todoItem.uuid);
        setTodoMemo((_prevTodoList) => [...exceptUpdateTodoMemos, updateTodoList]);
    }

    return (
        <div className={todoStyle.modalWindow}>
            <div className={todoStyle.modalWindowChild}>
                {todoItem.edit === true ?
                    <>
                        <div className={todoStyle.editTargetContent}>
                            <p>--- 編集前 ---</p>
                            <p>ToDo：{todoItem.todoContent}</p>
                            {todoItem.startTime && <p>開始時刻：{todoItem.startTime}</p>}
                            {todoItem.finishTime && <p>終了時刻：{todoItem.finishTime}</p>}
                        </div>
                        <TodoForm props={{
                            todoItem: todoItem
                        }} />
                        <div className={todoStyle.editerIntoCtrlBtns}>
                            <button id={todoStyle["deleteBtn"]} className={todoStyle.formBtns} type="button" onClick={(deleteBtn: SyntheticEvent<HTMLButtonElement>) => {
                                handleCloseModalWindowBtnClicked(deleteBtn);
                                deleteTodoItem(todoItem.uuid);
                            }}>削除</button>
                            <button className={`${todoStyle.formBtns} ${todoStyle.editBtn}`} type="button" onClick={() => {
                                changeMode(todoItem);
                            }}>戻る</button>
                        </div>
                    </> :
                    <div className={todoStyle.editFalseMode}>
                        <div className={todoStyle.editTargetContent}>
                            <p>--- 現在の予定内容 ---</p>
                            <p>ToDo：{todoItem.todoContent}</p>
                            {todoItem.startTime && <p>開始時刻：{todoItem.startTime}</p>}
                            {todoItem.finishTime && <p>終了時刻：{todoItem.finishTime}</p>}
                        </div>
                        <button className={`${todoStyle.formBtns} ${todoStyle.editBtn}`} type="button" onClick={() => {
                            changeMode(todoItem);
                        }}>編集</button>
                    </div>
                }
            </div>
            <button id={todoStyle["closeBtn"]} type="button" className={todoStyle.formBtns} onClick={(closeBtnEl: SyntheticEvent<HTMLButtonElement>) => handleCloseModalWindowBtnClicked(closeBtnEl)}>詳細画面を閉じる</button>
        </div>
    );
}