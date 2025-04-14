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

    useEffect(() => {
        if (targetPagesPathStr !== null) {
            const getPager: number = parseInt(targetPagesPathStr.split('-')[0]);
            const getOffset: number = parseInt(targetPagesPathStr.split('-')[1]);
            setPagerNum(getPager);
            setOffset(getOffset);
        }
    }, [getCurrUrlPath]);

    const adjustData: jsonPostType[] = useMemo(() => {
        const begin: number = pagerNum === 1 ? 0 : offset;
        const finish: number = pagerNum === 1 ? offset : offset + OFFSET_NUMBER;
        return [...getData].slice(begin, finish);
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