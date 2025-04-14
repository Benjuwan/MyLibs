import { memo, use } from "react";
import { jsonPostType } from "@/ts/json-post";
import PagerContents from "@/utils/PagerContents";
import PagerBtns from "@/utils/PagerBtns";

function DataFecthChild({ fetchdataPromise }: { fetchdataPromise: Promise<jsonPostType[]> }) {
    // use()でPromiseの中身を取得（Promiseが未完了ならこのコンポーネントはサスペンドする）
    const getData: jsonPostType[] = use(fetchdataPromise);

    return (
        <>
            {getData.length > 0 &&
                <section className="rounded-[8] shadow-[0_0_8px_rgba(0,0,0,.25)_inset] p-[2em] leading-[1.8] text-base">
                    <h2 className="text-3xl mb-[2.5em]">the posts</h2>
                    <PagerContents getData={getData} />
                    <PagerBtns maxPage={getData.length} />
                </section>
            }
        </>
    );
}

export default memo(DataFecthChild);