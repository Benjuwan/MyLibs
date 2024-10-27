import { useAtom } from "jotai";
import { countsAtom } from "./ts/atom";

// ボタンを押すと+1されるカウンター
export const CountBtn = () => {
    const [count, setCount] = useAtom(countsAtom);
    return (
        <>
            <div>Counter：{count}</div>
            <button onClick={() => setCount((p) => p + 1)}>
                +1するボタン
            </button>
        </>
    )
}