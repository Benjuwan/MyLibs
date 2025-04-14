"use client"

import { ReactNode, useState } from "react";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { PagerContext } from "./PagerContext";

type defaultContext = {
    children: ReactNode
};

export const PagerContextFragment = (props: defaultContext) => {
    // ページャ数
    const [pagerNum, setPagerNum] = useState<number>(1);

    // ページに表示するコンテンツデータ数（posts_per_page）
    const [offset, setOffset] = useState<number>(OFFSET_NUMBER);

    return (
        <PagerContext value={
            {
                pagerNum, setPagerNum,
                offset, setOffset
            }
        }>
            {props.children}
        </PagerContext>
    );
}