"use client"

import { ReactNode, useState } from "react";
import { OFFSET_NUMBER } from "@/constant/offsetnum";
import { PagerContext } from "./PagerContext";

type defaultContext = {
    children: ReactNode
}

export const PagerContextFlagment = (props: defaultContext) => {
    const [pagerNum, setPagerNum] = useState<number>(1);
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