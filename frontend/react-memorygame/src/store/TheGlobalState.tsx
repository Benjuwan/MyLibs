import React from "react";
import { createContext } from "react";

type Default = {
    clickedCardNumbers: Array<string>;
    // setClickedCardNumbers: React.Dispatch<React.SetStateAction<Array<string>>>;
}
export const GlobalContext = createContext({} as Default);


type globalChildren = {
    children: React.ReactNode;
}
export const GlobalContextContent: React.FC<globalChildren> = (props) => {
    // カードマッチ判定用の配列（クリックカードの数値を格納）
    const [
        clickedCardNumbers,
        // setClickedCardNumbers
    ] = React.useState<Array<string>>([]);

    return (
        <GlobalContext.Provider value={{
            clickedCardNumbers,
            // setClickedCardNumbers,
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}