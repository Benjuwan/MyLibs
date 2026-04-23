import { getDetailArticle } from "@/app/hooks/blogApis";
import Link from "next/link";
import { articleType } from "@/types";
import { DeleteBtn } from "../../components/DeleteBtn"; // クライアントコンポーネント
import { PageItem } from "./PageItem";

const ArticleDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
    // app/api/article なのでエンドポイントは article
    const res = await fetch(`${API_URL}/api/article/${id}`, { next: { revalidate: 60 } }); // ISR
    const detailArticle: articleType = await res.json();
    // console.log(detailArticle);

    return (
        <div className="max-w-3xl mx-auto p-5">
            <p hidden>ArticleDetails：{id}</p>
            <PageItem article={detailArticle} />
            <DeleteBtn articleId={id} />
            <Link href='/' className="block pt-8">to TOP</Link>
        </div>
    )
}

export default ArticleDetails;
