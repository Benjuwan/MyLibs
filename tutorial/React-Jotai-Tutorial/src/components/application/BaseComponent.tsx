import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { pokeItemAtom } from "./ts/atom";
import { pokeListType } from "./ts/pokedata";
import { Items } from "./Items";
import { SingleData } from "./SingleData";
import { MultiData } from "./MultiData";
import { useFetchData } from "./hooks/useFecthData";

export const BaseComponent = () => {
    const containerStyle: object = {
        'display': 'flex',
        'flexWrap': 'wrap',
        'gap': '5%',
    }

    /* -------- 外部ファイル（ts/atom.ts）で宣言した atom を呼び出して使用する -------- */
    const [pokeItem] = useAtom(pokeItemAtom);

    const [pokeData, setPokeData] = useState<pokeListType[]>([]); // fecth 処理結果を格納する配列

    const { FetchData } = useFetchData(); // fecth 処理
    useEffect(() => {
        const promisePokeData = FetchData();
        promisePokeData.then((data) => {
            setPokeData((_prevPokeData) => [...pokeData, ...data]);
        });
    }, []);

    return (
        <>
            {pokeData.length > 0 &&
                <div style={containerStyle}>
                    <Items pokeData={pokeData} />
                    {/* SingleData には props として渡して、MultiData では直接 atom を呼び出して使用 */}
                    <SingleData pokeItem={pokeItem} />
                    <MultiData />
                </div>
            }
        </>
    );
}