export const useCardActionInertRemove = () => {
    // 属性値 を取り除く場合
    const cardActionInertRemoveAttr: (targetEls: string, exceptClassName: string) => void = (
        targetEls: string,
        exceptClassName: string
    ) => {
        const inertCardLists = document.querySelectorAll(targetEls);
        inertCardLists.forEach(inertEls => {
            if (!(inertEls.classList.contains(exceptClassName))) {
                inertEls.removeAttribute('inert');
            }
        });
    }

    // クラス属性 を取り除く場合
    const cardActionInertRemoveClass: (targetEls: string, targetClassName: string) => void = (
        targetEls: string,
        targetClassName: string
    ) => {
        const inertCardLists = document.querySelectorAll(targetEls);
        inertCardLists.forEach(inertEls => {
            if (inertEls.classList.contains(targetClassName)) {
                inertEls.classList.remove(targetClassName);
            }
        });
    }

    return { cardActionInertRemoveAttr, cardActionInertRemoveClass }
}