export const useCardShuffle = () => {
    const CardShuffle: (cardsNumber: Array<number>) => number[] = (
        cardsNumber: Array<number>
    ) => {
        cardsNumber.forEach((cardNumber, i) => {
            // 順列の要素を代入（保存）
            const card: number = cardNumber;

            // 配列の数だけランダム数を生成
            const rand: number = Math.floor(Math.random() * i);

            // 配列の順列別要素に、ランダム数値に準じた配列の要素を代入
            cardsNumber[i] = cardsNumber[rand];

            // ランダム数値に準じた配列の要素に（保存していた）順列の要素を代入（インデックス番号の重複回避）
            cardsNumber[rand] = card;
        });
        console.log(cardsNumber);

        return cardsNumber;
    }

    return { CardShuffle }
}