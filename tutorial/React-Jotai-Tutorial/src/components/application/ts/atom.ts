import { atom } from "jotai";
import { pokeDataType } from "./pokedata";

/**
 * Jotai では、useAtomフックを使用してアトムの状態を読み取り、setAtom 関数を使用して状態を更新します。
 * コンポーネント間でアトムを共有するには、アトムを外部で定義し、そのアトムをuseAtomで使用することで、異なるコンポーネントで同じアトムを参照できます。
*/

const defaultPokeListData: pokeDataType = {
    name: '【hogemon】---',
    weight: 100,
    height: 100
}

const defaultPokeSingleData: pokeDataType = { name: undefined }

/* Jotai の atom はデフォルトでは初期値の型を never として扱います。これに対処するためには、atom を作成する際にジェネリクスを使用して、初期値の型を指定することができます。*/
export const pokeItemAtom = atom(defaultPokeSingleData);
export const pokeListAtom = atom([defaultPokeListData]);