import { memo, SyntheticEvent } from 'react';
import { useCardShuffle } from './hooks/useCardShuffle';
import { useCardAction } from './hooks/useCardAction';

type CardAry = {
    cards: Array<number>;
    tabIndexOffset: number;
    specificClassName?: true;
};

export const CardLists: React.FC<CardAry> = memo((props) => {
    const { cards, tabIndexOffset, specificClassName } = props;

    const { CardShuffle } = useCardShuffle();
    const shuffledCard = CardShuffle(cards);

    // クリック or Enter キー の度に Tab 操作の可否判定を行う
    /**
     * 当初（クリック処理に応じる boolean の）グローバル State を用意して React.useEffect の依存配列に指定して上記処理を行う形にしていたが、State 更新による再レンダリング処理に伴って「都度カードがシャッフルされてしまう事態になった」ので純粋な関数として処理を進める形で調整
    */
    const tabCtrlJudgement = () => {
        const cardLists = document.querySelectorAll('ul');
        cardLists.forEach(cardList => {
            if (cardList.classList.contains('inertState')) {
                cardList.querySelectorAll('li').forEach(liItems => {
                    liItems.setAttribute('inert', 'true');
                });
            }
        });
    }

    const { cardAction } = useCardAction();

    const handleCardAction: (e: SyntheticEvent<HTMLLIElement>) => void = (e: SyntheticEvent<HTMLLIElement>) => {
        cardAction(e.currentTarget);
        tabCtrlJudgement();
    }

    return (
        <ul className={`CardListEls ${specificClassName ? 'rightLists' : 'leftLists'} grid grid-cols-[repeat(3,1fr)] gap-[2em] w-[45%] max-w-40rem] md:grid-cols-[repeat(5,1fr)]`}>
            {
                shuffledCard.map((card, cardIndex) => (
                    <li
                        key={cardIndex}
                        className={`${specificClassName ? 'bg-[#dadada]' : 'bg-[#eaeaea]'} grid place-items-center self-center mb-[2%]hover:brightness-[1.25]`}
                        onClick={handleCardAction}>
                        {/* tabIndex は offset でスタート数値を指定して昇順になるように調整 */}
                        <button
                            type='button'
                            className='cursor-pointer p-[2em] h-full'
                            tabIndex={tabIndexOffset + (cardIndex + 1)}
                        >
                            {Number(card) < 10 ?
                                <span className='opacity-[0]'>0{card}</span> :
                                <span className='opacity-[0]'>{card}</span>
                            }
                        </button>
                    </li>
                ))
            }
        </ul>
    )
});