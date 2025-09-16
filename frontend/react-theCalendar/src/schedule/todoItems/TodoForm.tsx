import { ChangeEvent, SyntheticEvent, useState } from "react";
import { todoItemType } from "./ts/todoItemType";
import { useUpdateTodoItem } from "./hooks/useUpdateTodoItem";
import { useRegiTodoItem } from "./hooks/useRegiTodoItem";
import { useViewTodoCtrl } from "./hooks/useViewTodoCtrl";
import { useCloseModalWindow } from "./hooks/useCloseModalWindow";
import { useHandleFormEntries } from "../../hooks/useHandleFormEntries";

type TodoFormType = {
    todoItem?: todoItemType;
    todoId?: string;
};

export const TodoForm = ({ props }: { props: TodoFormType }) => {
    const { todoItem, todoId } = props;

    const initTodoItems: todoItemType = {
        uuid: todoItem ? todoItem.uuid : '001',
        todoID: todoId ? todoId : todoItem ? todoItem.todoID : '001',
        todoContent: '',
        startTime: '',
        finishTime: '',
        edit: todoItem ? todoItem.edit : false
    }
    const [todoItems, setTodoItems] = useState<todoItemType>(initTodoItems);

    const { updateTodoItem } = useUpdateTodoItem();
    const { regiTodoItem } = useRegiTodoItem();
    const { viewTodoCtrl } = useViewTodoCtrl();
    const { closeModalWindow } = useCloseModalWindow();
    const { handleFormEntries } = useHandleFormEntries();

    const handleOpenClosedBtnClicked: (ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>) => void = (ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>) => {
        viewTodoCtrl(ctrlHandlerElm);
        window.scrollTo(0, 0);
    }

    const resetStates: () => void = () => {
        setTodoItems(initTodoItems);
        setTimeout(() => window.scrollTo(0, 0)); // buttonのクリックイベントでスクロールトップしないので回避策として疑似的な遅延処理
    }

    const handleRegiUpdateAction: (e: SyntheticEvent<HTMLButtonElement>) => void = (e: SyntheticEvent<HTMLButtonElement>) => {
        if (!todoItems.edit) {
            regiTodoItem(todoItems);
            handleOpenClosedBtnClicked(e.currentTarget);
        } else {
            e.stopPropagation(); // 親要素のクリックイベント（OnViewModalWindow）発生を防止
            updateTodoItem(todoItems);
            closeModalWindow();
        }
        resetStates();
    }

    const handleFormSubmit: (e: SyntheticEvent<HTMLFormElement>) => void = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!todoItems.edit) {
            regiTodoItem(todoItems);
            handleOpenClosedBtnClicked(e);
        } else {
            updateTodoItem(todoItems);
        }
        resetStates();
    }

    console.log(todoItem);

    return (
        <form className="text-[0.875rem] leading-[1.8] w-full max-w-[32rem] mx-auto mb-[1em] flex flex-col"
            onSubmit={handleFormSubmit}>
            <label className="block w-full mb-[1em] md:mb-0">
                <input
                    type="text"
                    value={todoItems.todoContent}
                    id="todoContent"
                    className="text-[1rem] leading-[1.5] border border-[#919191] bg-white rounded w-full pl-[.5em]"
                    onInput={(e: ChangeEvent<HTMLInputElement>) => handleFormEntries<todoItemType>(e, todoItems, setTodoItems)} />
            </label>
            <div className="flex justify-start gap-[1em]">
                <label className="block w-full text-left mb-[1em] text-[clamp(0.625rem,100%,0.875rem)] my-[1em]">開始時刻
                    <input
                        type="time"
                        id="startTime"
                        className="appearance-none block text-[1rem] leading-[2] border border-[#919191] bg-white rounded w-full pl-[.25em]"
                        value={todoItems.startTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormEntries<todoItemType>(e, todoItems, setTodoItems)} /></label>
                <label className="block w-full text-left mb-[1em] text-[clamp(0.625rem,100%,0.875rem)] my-[1em]">終了時刻
                    <input
                        type="time"
                        id="finishTime"
                        className="appearance-none block text-[1rem] leading-[2] border border-[#919191] bg-white rounded w-full pl-[.25em]"
                        value={todoItems.finishTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFormEntries<todoItemType>(e, todoItems, setTodoItems)} /></label>
            </div>
            <button
                type="button"
                id="regiUpdateBtn"
                className="text-[0.875rem] leading-[2] py-[1em] w-full bg-[#333] text-white rounded disabled:bg-[#919191] disabled:text-[#dadada] not-disabled:cursor-pointer not-disabled:hover:opacity-[.75]"
                disabled={
                    todoItems.todoContent.length <= 0 ||
                    (todoItems.startTime === '' || todoItems.finishTime === '')
                }
                onClick={handleRegiUpdateAction}>{!todoItems.edit ? '登録' : '再登録'}</button>
        </form>
    );
}