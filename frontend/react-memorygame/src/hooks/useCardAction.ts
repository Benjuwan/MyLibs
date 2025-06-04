import { useContext } from "react";
import { GlobalContext } from "../providers/TheGlobalContext";
import { useCardActionInertRemove } from "./useCardActionInertRemove";
import { useCardMatchedJudgement } from "./useCardMatchedJudgement";

export const useCardAction = () => {
    const { clickedCardNumbers } = useContext(GlobalContext);

    // 特定の属性値を取り除く hook
    const { cardActionInertRemoveAttr, cardActionInertRemoveClass } = useCardActionInertRemove();

    // カードマッチの成立可否時の処理に関する hook
    const { cardMatched, cardMissMatched } = useCardMatchedJudgement();

    const cardAction: (cardNumberEls: HTMLLIElement) => void = (
        cardNumberEls: HTMLLIElement
    ) => {
        const cardNumberStr = cardNumberEls.textContent;
        cardNumberEls.classList.add('listOnView');

        // 初期クリック時の処理
        if (clickedCardNumbers.length <= 0) {
            if (cardNumberStr !== null) {
                /**
                 * 新たに配列を用意して State変数（配列: Array<string>）をスプレッド構文で展開してから対象の値を push して State関数でマージ～という処理ではなく、そのまま グローバルの State変数に処理を行っている...
                */
                clickedCardNumbers.push(cardNumberStr);
            }

            cardNumberEls.parentElement?.classList.add('inertState');

            // [inert]：inert 属性を持っている要素
            cardActionInertRemoveAttr('[inert]', 'matching');
        }

        // 1枚目をクリック・選んだ後の処理
        else {
            // マッチ成立
            if (clickedCardNumbers[0] === cardNumberStr) {
                // TypeScript では if 文の引数に alert() を指定できないので非同期処理で対応
                new Promise((resolve) => {
                    resolve(alert(`選んだカードは「${cardNumberStr}」でマッチします！\n引き続きトライしてください。`));

                    // rejuct('rejuct が呼ばれた');
                }).then(() => {
                    setTimeout(() => {
                        cardMatched(cardNumberEls, cardNumberStr);
                        // 初期化処理：非アクティブ化 → アクティブ化
                        cardActionInertRemoveClass('ul', 'inertState');
                        cardActionInertRemoveAttr('[inert]', 'matching');
                    }, 500);
                }).catch((data) => {
                    console.error(new Error(data));
                });
            }

            // マッチ不成立
            else {
                new Promise((resolve) => {
                    resolve(alert(`選んだカードは「${cardNumberStr}」でマッチ失敗です。\n再トライしてみてください。`));
                }).then(() => {
                    setTimeout(() => {
                        // 初期化処理：非アクティブ化 → アクティブ化
                        cardMissMatched('listOnView');
                        cardActionInertRemoveClass('ul', 'inertState');
                        cardActionInertRemoveAttr('[inert]', 'matching');
                    }, 500);
                });
            }

            // クリックカード番号をリセット・初期化
            clickedCardNumbers.splice(0, 1);
        }
    }

    return { cardAction }
}