import { getDetailArticle } from "@/app/hooks/blogApis";
import Link from "next/link";
import { articleType } from "@/types";
import { DeleteBtn } from "../../components/DeleteBtn"; // クライアントコンポーネント
import { PageItem } from "./PageItem";

const ArticleDetails = async ({ params }: { params: { id: string } }) => {
    /* getDetailArticle：json-server 用 */
    // const detailArticle = await getDetailArticle(params.id); // サーバーコンポーネントなのでトップレベル await が使用可能（コンポーネント名に async 付与必要）

    const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
    // app/api/article なのでエンドポイントは article
    const res = await fetch(`${API_URL}/api/article/${params.id}`, { next: { revalidate: 60 } }); // ISR
    const detailArticle: articleType = await res.json();
    // console.log(detailArticle);

    return (
        <div className="max-w-3xl mx-auto p-5">
            <p hidden>ArticleDetails：{params.id}</p>
            <PageItem article={detailArticle} />
            <DeleteBtn articleId={params.id} />
            <Link href='/' className="block pt-8">to TOP</Link>
        </div>
    )
}

export default ArticleDetails;