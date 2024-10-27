import { useEffect } from "react";
import { todoItemType } from "./ts/todoItemType";
import { useAtom } from "jotai";
import { isDesktopViewAtom, todoMemoAtom } from "../../ts/calendar-atom";
import { localstorageLabelName } from "../../ts/calendar-localstorageLabel";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

export const Todo = ({ todoID }: { todoID: string }) => {
    const [, setTodoMemo] = useAtom(todoMemoAtom);
    const [desktopView] = useAtom(isDesktopViewAtom);

    const localstorageLabel = localstorageLabelName;

    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem(localstorageLabel);
        if (getLocalStorageItems !== null) {
            const SaveLocalStorageDateItems: todoItemType[] = JSON.parse(getLocalStorageItems);
            setTodoMemo((_prevTodoList) => [...SaveLocalStorageDateItems]);
        } else {
            setTodoMemo((_prevTodoList) => []); // 前月や次月に移動するたびに ToDo メモを初期化
        }
    }, [todoID]);

    return (
        <>
            {desktopView ?
                <>
                    <TodoForm props={{
                        todoId: todoID
                    }} />
                    <TodoList todoID={todoID} />
                </> :
                <TodoForm props={{
                    todoId: todoID
                }} />
            }
        </>
    );
}