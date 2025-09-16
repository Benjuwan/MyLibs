import { SyntheticEvent } from "react";

export const useViewTodoCtrl = () => {
    const viewTodoCtrl: (ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>) => void = (
        ctrlHandlerElm: HTMLButtonElement | SyntheticEvent<HTMLFormElement>
    ) => {
        let parentTodoViewElm: HTMLDivElement | null = null;
        if (ctrlHandlerElm instanceof HTMLButtonElement) {
            const btnCtrlHandlerElm = ctrlHandlerElm.closest(".todoView") as HTMLDivElement;
            parentTodoViewElm = btnCtrlHandlerElm;
        } else {
            const formCtrlHandlerElm = ctrlHandlerElm.currentTarget.closest(".todoView") as HTMLDivElement;
            parentTodoViewElm = formCtrlHandlerElm;
        }

        if (parentTodoViewElm?.classList.contains("OnView")) {
            parentTodoViewElm.classList.remove("OnView");
            return;
        }
        parentTodoViewElm?.classList.add("OnView");
    }

    return { viewTodoCtrl }
}