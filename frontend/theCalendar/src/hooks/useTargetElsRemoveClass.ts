export const useTargetElsRemoveClass = () => {
    const targetElsRemoveClass: (targetEls: string, removeClassName: string) => void = (targetEls: string, removeClassName: string) => {
        const targetElms = document.querySelectorAll(`.${targetEls}.${removeClassName}`);
        targetElms.forEach(elm => elm.classList.remove(removeClassName));
    }

    return { targetElsRemoveClass }
}