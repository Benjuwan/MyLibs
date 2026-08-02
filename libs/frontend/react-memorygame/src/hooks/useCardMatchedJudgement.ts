export const useCardMatchedJudgement = () => {
    // マッチ成立時の hook
    const cardMatched: (cardNumberEls: HTMLLIElement, cardNumberStr: string) => void
        = (
            cardNumberEls: HTMLLIElement,
            cardNumberStr: string
        ) => {
            // クリックカードに不活性化の処理を行う
            cardNumberEls.classList.add('matching');
            cardNumberEls.setAttribute('inert', 'true');

            // 対象配列（クリックしていない方のカードリスト）のデフォルトは右側（.rightLists）
            let targetAry: HTMLUListElement | null = document.querySelector('ul.rightLists');
            if (cardNumberEls.parentElement?.classList.contains('rightLists')) {
                // 右側のカードリストのカードをクリックした場合、対象配列はクリックしていない方の（左側の）カードリストになる
                targetAry = document.querySelector('ul.leftLists');
            }
            if (targetAry?.children) {
                for (let i = 0; i < targetAry?.children.length; i++) {
                    const targetCardLists: NodeListOf<HTMLLIElement> | null = targetAry?.querySelectorAll('li');
                    // クリックカード（の数値：文字列）と一致する対象配列内のカード（の数値：文字列）に不活性化の処理を行う
                    if (targetCardLists[i].textContent === cardNumberStr) {
                        targetCardLists[i].classList.add('matching');
                        targetCardLists[i].setAttribute('inert', 'true');
                    }
                }
            }
        }

    // マッチ不成立時の hook
    const cardMissMatched: (targetElsClassName: string) => void = (
        targetElsClassName: string
    ) => {
        const listOnViewEls: NodeListOf<HTMLLIElement> = document.querySelectorAll(`.${targetElsClassName}`);
        listOnViewEls.forEach(listOnViewEl => {
            listOnViewEl.classList.remove(targetElsClassName);
        });
    }

    return { cardMatched, cardMissMatched }
}