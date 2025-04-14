import { memo, Suspense } from "react";
import { jsonPostType } from "@/ts/json-post";
import Loading from "@/app/loading";
import DataFecthChild from "./DataFecthChild";

function TheDataFetchParent() {
    const fetchPathUrl: string = "https://jsonplaceholder.typicode.com/posts";

    // ※ await はしない。Promise を返す記述にする。Promise が未完了ならサスペンド状態となる（Suspense の fallback が返る） 
    const fetchdataPromise: Promise<jsonPostType[]> = fetch(fetchPathUrl).then(res => res.json());

    // デモとして、あえて遅延処理を実施（※ Promiseインスタンスを使って、解決処理にフェッチしたデータ内容を格納した Promise として返却）
    // const fetchdataPromise: Promise<jsonPostType[]> = new Promise(resolve => {
    //     setTimeout(() => {
    //         fetch(fetchPathUrl).then(res => res.json()).then(data => resolve(data));
    //     }, 3000);
    // });

    return (
        <main className="w-[clamp(20rem,100%,60rem)] my-[5em] mx-auto p-[1.5em]">
            {/* Suspense 必須 */}
            <Suspense fallback={<Loading />}>
                <DataFecthChild fetchdataPromise={fetchdataPromise} />
            </Suspense>
        </main>
    );
}

export default memo(TheDataFetchParent);