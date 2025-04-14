"use client"

import { memo, useContext, useMemo } from "react";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { ROUTING_PASS } from "@/constant/routingpass";
import { PagerContext } from "@/providers/PagerContext";
import Link from "next/link";

/* 各種ページャボタン */
function Pagers({ maxPage }: { maxPage: number }) {
    const { pagerNum } = useContext(PagerContext);

    const pagersNumber: number = Math.floor(maxPage / OFFSET_NUMBER);
    const thePagers: number[] = useMemo(() => {
        // pagersNumber 個の要素を持つ配列を用意して（初期値として）0をセット
        // map 処理で各初期値をインデックスインクリメント（順次繰り上げ）した数に置換（加工）する
        return Array(pagersNumber).fill(0).map((_, i) => i + 1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxPage]);

    return (
        <>
            {thePagers.map(pager => (
                <Link
                    key={pager}
                    href={`${ROUTING_PASS}${pager}-${OFFSET_NUMBER * pager}`}
                    className="rounded-full grid place-items-center text-xs bg-[#333] text-white border border-transparent text-center w-[2rem] h-[2rem] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] data-[current=true]:pointer-events-none data-[current=true]:bg-[#2b2bd3] data-[current=true]:text-[#fff]"
                    data-current={pagerNum === pager}
                >{pager}</Link>
            ))}
        </>
    );
}

/* 前へ / 次へ ページャボタン */
function PagerBtns({ maxPage }: { maxPage: number }) {
    const { pagerNum, setPagerNum, offset, setOffset } = useContext(PagerContext);

    const prevAction = () => {
        if (pagerNum === 1) {
            return;
        }
        setPagerNum((prevPager) => prevPager - 1);
        setOffset((prevOffset) => prevOffset - OFFSET_NUMBER);
    }

    const nextAction = () => {
        if (pagerNum >= Math.floor(maxPage / OFFSET_NUMBER)) {
            return;
        }
        setPagerNum((prevPager) => prevPager + 1);
        setOffset((prevOffset) => prevOffset + OFFSET_NUMBER);
    }

    return (
        <div className="ctrlBtns flex justify-between items-center">
            <Link
                href={pagerNum === 1 ? '/' : `${ROUTING_PASS}${pagerNum - 1}-${offset - OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:pointer-events-none data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum === 1}
                onClick={prevAction}
            >前へ</Link>
            <Pagers maxPage={maxPage} />
            <Link
                href={`${ROUTING_PASS}${pagerNum + 1}-${offset + OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:pointer-events-none data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum >= Math.floor(maxPage / OFFSET_NUMBER)}
                onClick={nextAction}
            >次へ</Link>
        </div>
    );
}

export default memo(PagerBtns);