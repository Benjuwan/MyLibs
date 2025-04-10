import React from "react";
import { GlobalContext } from "./TheGlobalContext";

type globalChildren = {
    children: React.ReactNode;
};
export const GlobalContextContent: React.FC<globalChildren> = (props) => {
    // カードマッチ判定用の配列（クリックカードの数値を格納）
    const [clickedCardNumbers] = React.useState<Array<string>>([]);

    return (
        <GlobalContext.Provider value={{
            clickedCardNumbers
        }}>
            {props.children}
        </GlobalContext.Provider>
    );
}