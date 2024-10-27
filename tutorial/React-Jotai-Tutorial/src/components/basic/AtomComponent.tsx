import { atom } from 'jotai'

/* atom では number, string, object など各種「型」を（State）変数のような形で取り扱える */
const priceAtom = atom(10)
const messageAtom = atom('hello')
const productAtom = atom({ id: 12, name: 'good stuff' })
console.log(priceAtom, messageAtom, productAtom)

// priceAtomの値段を2倍にして読み取る
const doublePriceAtom = atom((get) => get(priceAtom) * 2)
console.log(doublePriceAtom)

// priceAtomから引数で受け取ったdiscountを減算した値を書き込む
const discountPriceAtom = atom(
    null, // wirteOnlyなのでnullに設定
    (get, set, discount: number) => {
        set(priceAtom, get(priceAtom) - discount)
    },
)
// praiceAtomを2倍にして読み取り、newPriceの1/2を書き込む
const readWriteAtom = atom(
    (get) => get(priceAtom) * 2,
    (get, set, newPrice: number) => {
        set(priceAtom, newPrice / 2)
    },
)
console.log(discountPriceAtom, readWriteAtom);

export const AtomComponent = () => {
    return (
        <>
            {/* <p>priceAtom：{priceAtom}</p> */}
        </>
    );
}