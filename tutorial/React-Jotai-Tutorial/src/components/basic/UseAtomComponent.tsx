import { Provider, atom, createStore, useAtom } from "jotai"
import { countsAtom } from "./ts/atom"
import { CountBtn } from "./CountBtn"
import { CountUpdateBtn } from "./CountUpdateBtn"

const valueAtom = atom(100)
/**
 * 以下の処理を事前に atom として用意しておける
 *（valueには50がセットされ、setVal(x)でvalueの値をx倍する）
 * const [value, setVal] = useAtom(valueAtom)
 * const setValue = (x: number) => setVal((_prevVal) => value * x);
*/
const addingValueAtom = atom(
    // (get) => get(valueAtom) / 2,
    (get) => get(valueAtom),
    (get, set, num: number) => {
        set(valueAtom, get(valueAtom) * num)
    },
)

const pricesAtom = atom(100)
/**
 * 以下の処理を事前に atom として用意しておける
 * const [prices, addPrice] = useAtom(pricesAtom)
 * const addPrices = (x: number) => addPrice((_prevVal) => prices + x);
*（read関数で読み込まれた値がpriceにセットされる）
*/
const addingPricesAtom = atom(
    (get) => get(pricesAtom), // read関数ではそのままpricesAtomの値を返す
    (get, set, num: number) => {
        // write関数では与えられた値を加算する
        set(pricesAtom, get(pricesAtom) + num)
    },
)

/* --------- Store によるグローバルステートの取り扱い ---------  */
const countsStore = createStore() // storeを宣言
countsStore.set(countsAtom, 100) // storeの中にcountsAtomを初期値100としてセットする

/* --------- atom の宣言はコンポーネントの範囲外で行う --------- */
export const UseAtomComponent = () => {
    /* --------- useAtom はコンポーネントの範囲内で使用する --------- */

    // const [value, setValue] = useAtom(addingValueAtom)
    const [value, setVal] = useAtom(valueAtom)
    const setValue = (x: number) => setVal((_prevVal) => value * x);

    // const [prices, addPrices] = useAtom(addingPricesAtom)
    const [prices, addPrice] = useAtom(pricesAtom)
    const addPrices = (x: number) => addPrice((_prevVal) => prices + x);

    return (
        <>
            <p>pricesAtom：{String(pricesAtom)}</p>
            <p>valueAtom：{String(valueAtom)}</p>
            <div style={{ 'display': 'flex', 'gap': '2%' }}>
                {/* ボタンを押された場合はaddingPriceAtomの第3引数に100がセットされる */}
                <button type="button" onClick={() => addPrices(100)}>
                    <b>{prices} yen</b><br />Add 100 yen
                </button>
                <button type="button" onClick={() => setValue(2)}>
                    <b>value：{value}</b><br />値を2倍にしていく
                </button>
            </div>
            {/* --------- Store によるグローバルステートの取り扱い --------- */}
            <Provider store={countsStore}>
                <h1>Proverで切り分けした空間</h1>
                <CountUpdateBtn />
                <CountUpdateBtn />
                <CountBtn />
            </Provider>
            <h1>グローバルステート空間</h1>
            <CountBtn />
        </>
    )
}