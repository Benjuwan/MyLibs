import { createContext } from "react";

type Default = {
    clickedCardNumbers: Array<string>;
};
export const GlobalContext = createContext({} as Default);