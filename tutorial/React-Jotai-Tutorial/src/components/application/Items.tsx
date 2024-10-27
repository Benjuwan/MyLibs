import { useAtom } from "jotai";
import { pokeDataType, pokeListType } from "./ts/pokedata";
import { useFetchPokeData } from "./hooks/useFecthPokeData";
import { pokeItemAtom, pokeListAtom } from "./ts/atom";

type itemsPropsType = {
    pokeData: pokeListType[]; // pokeListType[]：配列（オブジェクト）として扱うことで map などループ処理が利用可能
}

export const Items = ({ pokeData }: itemsPropsType) => {
    const paragraphStyle: object = {
        cursor: "pointer",
        lineHeight: "1.2",
        fontSize: "14px",
        margin: "1em 0 0",
    };

    const changePokeStyle: object = {
        ...paragraphStyle, // スプレッド構文でオブジェクトを展開
        color: "blue",
    };

    const addPokeStyle: object = {
        ...paragraphStyle,
        color: "red",
    };

    const { FetchPokeData } = useFetchPokeData();

    /* -------------- useAtom はコンポーネントの範囲内でok -------------- */

    /* Single Mode */
    const [, setPokeItem] = useAtom(pokeItemAtom); // 更新関数のみ用意（変数は使用しないので無し）
    const fetchPokeDataSetItem = (pokemonUrl: string) => {
        const pokemons: Promise<pokeDataType> = FetchPokeData(pokemonUrl);
        pokemons.then((data) => {
            setPokeItem((_prevPokeItem) => data); // フェッチしたデータを pokeItemAtom に格納
        });
    }

    /* -------------- useAtom はコンポーネントの範囲内でok -------------- */

    /* Multi Mode */
    const [pokeList, setPokeList] = useAtom(pokeListAtom);
    const fetchPokeDataSetList = (pokemonUrl: string) => {
        const pokemons: Promise<pokeDataType> = FetchPokeData(pokemonUrl);
        pokemons.then((data) => {
            setPokeList((_prevPokeList) => [...pokeList, data]); // フェッチしたデータを pokeListAtom に格納
        });
    }

    return (
        <>
            {pokeData.map((pokemon, i) => (
                <div style={{ 'width': '25%' }} key={i}>
                    <h2 style={{ 'fontSize': '16px' }}>--- {pokemon.name}</h2>
                    <p style={changePokeStyle} onClick={() => fetchPokeDataSetItem(pokemon.url)}>・ポケモンの入れ替え<span hidden>pokeItemAtom 更新</span></p>
                    <p style={addPokeStyle} onClick={() => fetchPokeDataSetList(pokemon.url)}>・ポケモンの追加<span hidden>pokeListAtom 更新</span></p>
                </div>
            ))}
        </>
    );
}