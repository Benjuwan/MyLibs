"use client"

import { memo, useContext, useEffect, useMemo } from "react";
import { PagerContext } from "@/providers/PagerContext";
import { jsonPostType } from "@/ts/json-post";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { useSearchParams } from "next/navigation";

function PagerContents({ getData }: { getData: jsonPostType[] }) {
    const { pagerNum, setPagerNum, offset, setOffset } = useContext(PagerContext);

    const getCurrUrlPath = useSearchParams();
    const targetPagesPathStr: string | null = getCurrUrlPath.get('pages');
    const getPager: number | undefined = targetPagesPathStr !== null ? parseInt(targetPagesPathStr.split('-')[0]) : undefined;
    const getOffset: number | undefined = targetPagesPathStr !== null ? parseInt(targetPagesPathStr.split('-')[1]) : undefined;

    useEffect(() => {
        if (typeof getPager === 'undefined' || typeof getOffset === 'undefined') {
            return;
        }
        setPagerNum(getPager);  // ページャ数を更新
        setOffset(getOffset);   // オフセット数を更新
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrUrlPath]);

    const pagersNumber: number = Math.floor(getData.length / OFFSET_NUMBER);
    const isFinalPage: boolean = useMemo(() => {
        return pagerNum === pagersNumber;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagerNum]);

    const adjustData: jsonPostType[] = useMemo(() => {
        // 開始値
        const begin: number = typeof getOffset !== 'undefined' ? getOffset - OFFSET_NUMBER :
            pagerNum === 1 ? 0 : offset;
        // 通常（最終ページ以外）の終了値
        const regularFinish: number = typeof getOffset !== 'undefined' ? getOffset :
            pagerNum === 1 ? offset : offset + OFFSET_NUMBER;
        // 最終ページにおける終了値（※最終ページ以外では regularFinish となる）
        const finalFinish: number = isFinalPage ? regularFinish + (getData.length - offset) : regularFinish;
        return [...getData].slice(begin, finalFinish);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    return (
        <div className="contens mb-[5em]">
            {
                adjustData.map(data => (
                    <article key={data.id} className="not-last-of-type:mb-[2.5em]">
                        <p className="text-sm">- data:id | {data.id}</p>
                        <h3 className="text-lg font-bold border-b border-b-dotted border-b-[#333] pb-[.5em] mb-[.5em]">{data.title}</h3>
                        <p>{data.body}</p>
                    </article>
                ))
            }
        </div>
    );
}

export default memo(PagerContents);