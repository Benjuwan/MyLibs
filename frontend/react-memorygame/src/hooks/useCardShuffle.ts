import React from "react";

export const useCardShuffle = () => {
    const CardShuffle = React.useCallback((
        targetAry: Array<number>
    ) => {
        targetAry.forEach((el, i) => {
            // 順列の要素を代入（保存）
            let els = el;

            // 配列の数だけランダム数を生成
            let rand = Math.floor(Math.random() * i);

            // 配列の順列別要素に、ランダム数値に準じた配列の要素を代入
            targetAry[i] = targetAry[rand];

            // ランダム数値に準じた配列の要素に（保存していた）順列の要素を代入（インデックス番号の重複回避）
            targetAry[rand] = els;
        });
        console.log(targetAry);
        
        return targetAry;
    }, []);

    return { CardShuffle }
}