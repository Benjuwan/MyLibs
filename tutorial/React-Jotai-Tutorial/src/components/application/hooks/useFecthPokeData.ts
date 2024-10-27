import { pokeDataType } from "../ts/pokedata";

export const useFetchPokeData = () => {
    const FetchPokeData = async (pokeUrl: string) => {
        const response = await fetch(pokeUrl);
        const resObj: pokeDataType = await response.json();
        return resObj;
    }

    return { FetchPokeData }
}