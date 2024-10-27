import { pokeListType, pokeRootType } from "../ts/pokedata";

export const useFetchData = () => {
    const FetchData = async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10'); // defaultPokeData があるので指定数値 +1 のデータが描画される
        const resObj: pokeRootType = await response.json();
        const pokeResults: pokeListType[] = resObj.results;
        return pokeResults;
    }

    return { FetchData }
}