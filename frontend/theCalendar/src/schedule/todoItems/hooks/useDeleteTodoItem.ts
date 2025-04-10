import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom, todoMemoLocalStorageAtom } from "../../../ts/calendar-atom";
import { localstorageLabelName } from "../../../ts/calendar-localstorageLabel";

export const useDeleteTodoItem = () => {
    const [, setLocalstorage] = useAtom(todoMemoLocalStorageAtom); // 更新関数のみ使用
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    const localstorageLabel = localstorageLabelName;

    const deleteTodoItem: (uuid: string) => void = (uuid: string) => {
        const exceptRemoveTodoItems: todoItemType[] = [...todoMemo].filter(todoItem => todoItem.uuid !== uuid);
        setTodoMemo(exceptRemoveTodoItems);
        /* ---------------- localStorage 関連の処理（更新）---------------- */
        if (todoMemo.length <= 1) {
            localStorage.removeItem(localstorageLabel);
            setLocalstorage([]);
            return;
        }

        setLocalstorage(exceptRemoveTodoItems);
        localStorage.setItem(localstorageLabel, JSON.stringify([...exceptRemoveTodoItems]));
    }

    return { deleteTodoItem }
}