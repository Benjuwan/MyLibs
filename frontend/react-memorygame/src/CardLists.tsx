import React, { memo } from 'react';
import styled from 'styled-components';
import { useCardShuffle } from './hooks/useCardShuffle';
import { useCardAction } from './hooks/useCardAction';

type CardAry = {
    cards: Array<number>;
    tabIndexOffset: number;
    specificClassName?: true;
}

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

    return (
        <CardListEls className={specificClassName ? 'rightLists' : 'leftLists'}>
            {
                shuffledCard.map((card, cardIndex) => (
                    <li key={cardIndex} onClick={(cardEl) => {
                        cardAction(cardEl.currentTarget);
                        tabCtrlJudgement();
                    }}>
                        {/* tabIndex は offset でスタート数値を指定して昇順になるように調整 */}
                        <button tabIndex={tabIndexOffset + (cardIndex + 1)}>
                            {Number(card) < 10 ?
                                <span>0{card}</span> :
                                <span>{card}</span>
                            }
                        </button>
                    </li>
                ))
            }
        </CardListEls>
    )
});

const CardListEls = styled.ul`
display: flex;
flex-flow: row wrap;
justify-content: center;
gap: 2%;
width: calc(100vw/2);

&.rightLists{
    & li {
        background-color: #dadada;
    }
}

&.inertState {
    filter: invert(.75);
    /* hooks で setAttribute('inert', 'true') が指定できないので CSS で対応 */
    pointer-events: none;
}

    & li{
        display: grid;
        place-items: center;
        align-items: center;
        background-color: #eaeaea;
        margin-bottom: 2%;

        & button{
            appearance: none;
            border: none;
            border-radius: 0;
            background-color: transparent;
            cursor: pointer;
            padding: 2em;
            height: 100%;

            & span{
                opacity: 0;
            }
        }

        &.listOnView,
        &.matching {
            & button{
                & span {
                    opacity: 1;
                }
            }
        }
        
        &.matching {
             filter: invert(.75);
        }

        &:hover{
            filter: brightness(1.25);
        }
    }
`;