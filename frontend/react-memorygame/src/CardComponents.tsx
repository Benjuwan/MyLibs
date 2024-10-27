import React, { memo } from "react";
import { CardLists } from "./CardLists";
import { styled } from "styled-components";

export const CardComponents = memo(() => {
    let cardsNumber = 18;

    const [cards, setCards] = React.useState<Array<number>>([]);
    React.useEffect(() => {
        const newAry: Array<number> = [...cards];
        for (let cardIndex = 0; cardIndex < cardsNumber; cardIndex++) {
            newAry.push(cardIndex + 1);
        }
        setCards(newAry);
    }, []);
    // console.log(cards);

    return (
        <CardComponent>
            <CardLists cards={cards} tabIndexOffset={0} />
            <CardLists cards={cards} tabIndexOffset={cardsNumber} specificClassName={true} />
        </CardComponent>
    );
});

const CardComponent = styled.div`
    display: flex;
    gap: 2%;
    padding: 0 4em;
`;