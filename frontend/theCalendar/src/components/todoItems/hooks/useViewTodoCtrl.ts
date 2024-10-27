import { SyntheticEvent } from "react";
import todoStyle from "../css/todoStyle.module.css";

export const useViewTodoCtrl = () => {
    const viewTodoCtrl: (ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>) => void = (
        ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>
    ) => {
        let parentTodoViewElm: HTMLDivElement | null = null;
        if (ctrlHandlerElm instanceof HTMLButtonElement) {
            const btnCtrlHandlerElm = ctrlHandlerElm.closest(`.${todoStyle.todoView}`) as HTMLDivElement;
            parentTodoViewElm = btnCtrlHandlerElm;
        } else {
            const formCtrlHandlerElm = ctrlHandlerElm.currentTarget.closest(`.${todoStyle.todoView}`) as HTMLDivElement;
            parentTodoViewElm = formCtrlHandlerElm;
        }

        if (parentTodoViewElm?.classList.contains(todoStyle.OnView)) {
            parentTodoViewElm.classList.remove(todoStyle.OnView);
            return;
        }
        parentTodoViewElm?.classList.add(todoStyle.OnView);
    }

    return { viewTodoCtrl }
}