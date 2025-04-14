import { createContext } from "react";

type PagerType = {
    pagerNum: number;
    setPagerNum: React.Dispatch<React.SetStateAction<number>>;
    offset: number;
    setOffset: React.Dispatch<React.SetStateAction<number>>;
};

export const PagerContext = createContext({} as PagerType);