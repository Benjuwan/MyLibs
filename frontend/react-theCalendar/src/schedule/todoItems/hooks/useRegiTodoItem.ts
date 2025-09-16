import { v4 as uuidv4 } from 'uuid'; // key へ渡すための固有の識別子を生成する npm ライブラリ

import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom, todoMemoLocalStorageAtom } from "../../../ts/calendar-atom";
import { localstorageLabelName } from "../../../ts/calendar-localstorageLabel";

export const useRegiTodoItem = () => {
    const [, setLocalstorage] = useAtom(todoMemoLocalStorageAtom); // 更新関数のみ使用
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    const localstorageLabel = localstorageLabelName;

    /* ToDo の登録 */
    const regiTodoItem: (todoItems: todoItemType) => void = (todoItems: todoItemType) => {
        const shallowCopyTodoItems: todoItemType = { ...todoItems }

        const newTodoList: todoItemType = {
            ...shallowCopyTodoItems,
            uuid: uuidv4() // key へ渡すための固有の識別子（uuid：Universally Unique Identifier）を生成
        }

        if (shallowCopyTodoItems.todoContent.length > 0) {
            setTodoMemo([...todoMemo, newTodoList]);
            /* ---------------- localStorage 関連の処理（登録）---------------- */
            setLocalstorage([...todoMemo, newTodoList]);
            localStorage.setItem(localstorageLabel, JSON.stringify([...todoMemo, newTodoList]));
        }
    }

    return { regiTodoItem }
}