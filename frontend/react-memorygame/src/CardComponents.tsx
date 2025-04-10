import { memo, useEffect, useState } from "react";
import { CardLists } from "./CardLists";

export const CardComponents = memo(() => {
    const cardsNumber: number = 18;

    const [cards, setCards] = useState<Array<number>>([]);
    useEffect(() => {
        const newAry: Array<number> = [...cards];
        for (let cardIndex = 0; cardIndex < cardsNumber; cardIndex++) {
            newAry.push(cardIndex + 1);
        }
        setCards(newAry);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // console.log(cards);

    return (
        <section className="flex flex-wrap gap-[5em] px-[4em]">
            <CardLists cards={cards} tabIndexOffset={0} />
            <CardLists cards={cards} tabIndexOffset={cardsNumber} specificClassName={true} />
        </section>
    );
});