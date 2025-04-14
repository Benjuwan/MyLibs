"use client"

import { memo, useContext } from "react";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { PagerContext } from "@/providers/PagerContext";
import Link from "next/link";

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
        <div className="ctrlBtns flex justify-between">
            <Link
                href={pagerNum === 1 ? '/' : `?pages=${pagerNum - 1}-${offset - OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum === 1}
                onClick={prevAction}
            >Prev</Link>
            <Link
                href={`?pages=${pagerNum + 1}-${offset + OFFSET_NUMBER}`}
                className="rounded bg-[#333] text-white border border-transparent text-center leading-[2.75rem] w-fit px-[1em] transition duration-[.25s] hover:bg-white hover:text-[#333] hover:border-[#333] active:bg-white active:text-[#333] active:border-[#333] data-[disabled=true]:bg-[#919191] data-[disabled=true]:text-[#dadada]"
                data-disabled={pagerNum >= Math.floor(maxPage / OFFSET_NUMBER)}
                onClick={nextAction}
            >Next</Link>
        </div>
    );
}

export default memo(PagerBtns);