"use client"

import { memo, useContext } from "react";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { ROUTING_PASS } from "@/constant/routingpass";
import { PagerContext } from "@/providers/PagerContext";
import Link from "next/link";

/* 各種ページャボタン */
function Pagers({ maxPage }: { maxPage: number }) {
    const { pagerNum } = useContext(PagerContext);

    const createPagers: () => number[] = () => {
        let srcNum: number = maxPage;

        // 各ページャー項目を生成
        // srcNum（引算用途の上限数値）が 0 を切るまでオフセット数を倍数していくループ処理
        let Accumuration = 0;
        while (srcNum >= 0) {
            Accumuration++;
            srcNum = srcNum - OFFSET_NUMBER;
        }

        //（コンテンツデータに応じた）ページャー（項目）数の要素を持つ配列を用意して（初期値として）0をセット
        // map 処理で各初期値をインデックスインクリメント（順次繰り上げ）した数に置換（加工）する
        return Array(Accumuration).fill(0).map((_, i) => i + 1);
    }
    const thePagers: number[] = createPagers();

    const scrollTop: () => void = () => {
        window.scrollTo(0, 0);
    }

    return (
        <div className="w-full flex flex-wrap justify-start items-center gap-[1em] mb-[2em] md:justify-center">
            {thePagers.map(pager => (
                <Link
                    key={pager}
                    href={`${ROUTING_PASS}${pager}-${OFFSET_NUMBER * pager}`}
                    className="rounded-full grid place-items-center text-xs bg-[#333] text-white border border-transparent text-center w-[2rem] h-[2rem] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] data-[current=true]:pointer-events-none data-[current=true]:bg-[#2b2bd3] data-[current=true]:text-[#fff]"
                    data-current={pagerNum === pager}
                    onClick={scrollTop}
                >{pager}</Link>
            ))}
        </div>
    );
}

/* 前へ / 次へ ページャボタン */
function PagerBtns({ maxPage }: { maxPage: number }) {
    const { pagerNum, offset } = useContext(PagerContext);

    const prevAction = () => {
        if (pagerNum === 1) {
            return;
        }
        window.scrollTo(0, 0);
    }

    const nextAction = () => {
        if (pagerNum > Math.floor(maxPage / OFFSET_NUMBER)) {
            return;
        }
        window.scrollTo(0, 0);
    }

    return (
        <div className="ctrlBtns flex flex-wrap justify-between items-center">
            <Pagers maxPage={maxPage} />
            <Link
                href={pagerNum === 1 ? '/' : `${ROUTING_PASS}${pagerNum - 1}-${offset - OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:pointer-events-none data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum === 1}
                onClick={prevAction}
            >前へ</Link>
            <Link
                href={`${ROUTING_PASS}${pagerNum + 1}-${offset + OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:pointer-events-none data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum > Math.floor(maxPage / OFFSET_NUMBER)}
                onClick={nextAction}
            >次へ</Link>
        </div>
    );
}

export default memo(PagerBtns);