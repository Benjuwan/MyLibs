"use client"

import { memo, useContext, useEffect, useMemo } from "react";
import { PagerContext } from "@/providers/PagerContext";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { jsonPostType } from "../ts/json-post";
import { useSearchParams } from "next/navigation";

function PagerContents({ getData }: { getData: jsonPostType[] }) {
    const { pagerNum, setPagerNum, offset, setOffset } = useContext(PagerContext);

    const getCurrUrlPath = useSearchParams();
    const targetPagesPathStr: string | null = getCurrUrlPath.get('pages');
    const getPager: number | undefined = targetPagesPathStr !== null ? parseInt(targetPagesPathStr.split('-')[0]) : 1; // false の場合は初期値を設定
    const getOffset: number | undefined = targetPagesPathStr !== null ? parseInt(targetPagesPathStr.split('-')[1]) : OFFSET_NUMBER; // false の場合は初期値を設定

    useEffect(() => {
        if (typeof getPager === 'undefined' || typeof getOffset === 'undefined') {
            return;
        }
        setPagerNum(getPager);  // ページャ数を更新
        setOffset(getOffset);   // オフセット数を更新
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrUrlPath]);

    const adjustData: jsonPostType[] = useMemo(() => {
        // 開始値
        const begin: number = typeof getOffset !== 'undefined' ? getOffset - OFFSET_NUMBER :
            pagerNum === 1 ? 0 : offset;
        // 終了値
        const finish: number = typeof getOffset !== 'undefined' ? getOffset :
            pagerNum === 1 ? offset : offset + OFFSET_NUMBER;
        return [...getData].slice(begin, finish);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    return (
        <div className="contens mb-[5em] md:grid md:gap-[2em] md:grid-cols-[repeat(3,1fr)]">
            {
                adjustData.map(data => (
                    <article key={data.id} className="bg-[#eaeaea] p-[1em] rounded not-last-of-type:mb-[2.5em]">
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