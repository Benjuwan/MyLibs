import { memo, SyntheticEvent } from 'react';
import { useCardShuffle } from './hooks/useCardShuffle';
import { useCardAction } from './hooks/useCardAction';

type CardAry = {
    cards: Array<number>;
    tabIndexOffset: number;
    specificClassName?: boolean;
};

export const CardLists: React.FC<CardAry> = memo((props) => {
    const { cards, tabIndexOffset, specificClassName } = props;

    const { CardShuffle } = useCardShuffle();
    const shuffledCard = CardShuffle(cards);

    const { cardAction } = useCardAction();

    const handleCardAction: (e: SyntheticEvent<HTMLLIElement>) => void = (e: SyntheticEvent<HTMLLIElement>) => {
        cardAction(e.currentTarget);
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