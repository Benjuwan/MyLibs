export const useCloseModalWindow = () => {
    const closeModalWindow: () => void = () => {
        const modalWindowEls: NodeListOf<HTMLElement> = document.querySelectorAll('.modalWindow');
        modalWindowEls.forEach(modalWindowElm => modalWindowElm.classList.remove('modalWindowOnView'));
    }

    return { closeModalWindow }
}