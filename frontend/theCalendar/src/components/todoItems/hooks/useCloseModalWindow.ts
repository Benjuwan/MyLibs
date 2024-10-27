import todoStyle from "../css/todoStyle.module.css";

export const useCloseModalWindow = () => {
    const closeModalWindow: () => void = () => {
        const modalWindowEls: NodeListOf<HTMLElement> = document.querySelectorAll(`.${todoStyle.modalWindow}`);
        modalWindowEls.forEach(modalWindowElm => modalWindowElm.classList.remove(todoStyle.modalWindowOnView));
    }

    return { closeModalWindow }
}