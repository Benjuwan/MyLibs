import { memo, Suspense } from "react";
import Loading from "@/app/loading";
import { jsonPostType } from "../ts/json-post";
import DataFecthChild from "./DataFecthChild";

function TheDataFetchParent() {
    const fetchPathUrl: string = "https://jsonplaceholder.typicode.com/posts";

    // ※ await はしない。Promise を返す記述にする。Promise が未完了ならサスペンド状態となる（Suspense の fallback が返る） 
    const fetchdataPromise: Promise<jsonPostType[]> = fetch(fetchPathUrl).then(res => res.json());

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