"use client"

import { deleteArticle } from "@/app/hooks/blogApis";
import { useRouter } from "next/navigation";

export const DeleteBtn = ({ articleId }: { articleId: string }) => {
    const router = useRouter(); // リダイレクト処理

    const handleClickDelete = async () => {
        /* deleteArticle：json-server 用 */
        // deleteArticle(articleId);

        const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
        /* エンドポイント：app/api/article */
        await fetch(`${API_URL}/api/article/${articleId}`, {
            method: "DELETE", // delete なので DELETE、データの扱いに関する記述（headers, body, etc...）は不要
        });

        router.push('/'); // top へリダイレクト
        router.refresh(); // リダイレクト処理後のクリーンアップ
    }

    return (
        <button type="button" onClick={handleClickDelete} className="bg-red-500 hover:bg-red-600 rounded-md py-2 px-5 ml-10">削除</button>
    );
}