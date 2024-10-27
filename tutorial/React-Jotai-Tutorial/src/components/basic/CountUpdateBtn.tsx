import { useAtom } from "jotai";
import { countsAtom } from "./ts/atom";

export const CountUpdateBtn = () => {
    const [count, setCount] = useAtom(countsAtom);
    return (
        <>
            <div>CountUpdateBtn：{count}</div>
            <button style={{ 'borderColor': 'red' }} onClick={() => setCount((p) => p + 1)}>
                +1するボタン
            </button>
        </>
    )
}