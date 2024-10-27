"use client"

import { FC } from "react";
import { useRouter } from "next/navigation";

type updateBtnPropsType = {
    articleId: string;
    updateTitle: string;
    updateContent: string;
    edit: boolean;
    changeEditMode: () => void;
}

export const UpdateBtn: FC<updateBtnPropsType> = (
    {
        articleId,
        updateTitle,
        updateContent,
        edit,
        changeEditMode
    }
) => {
    const router = useRouter(); // リダイレクト処理

    const handleClickUpdate = async () => {
        const id = articleId;
        const title: string = updateTitle;
        const content: string = updateContent;

        const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
        /* エンドポイント：app/api/article */
        await fetch(`${API_URL}/api/article/${articleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title, content }) // テーブルデータ名と（リクエストボディに渡す値の名前）State名は【全く同じ】にしないと機能しない
        });

        router.push('/'); // top へリダイレクト
        router.refresh(); // リダイレクト処理後のクリーンアップ
    }

    return (
        <>
            {edit &&
                <button type="button" onClick={handleClickUpdate} className="bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-5">更新</button>
            }
            <button type="button" onClick={changeEditMode} className={`bg-green-500 hover:bg-green-600 rounded-md py-2 px-5 ${edit && 'ml-10'}`}>{edit ? 'やめる' : '編集'}</button>
        </>
    );
}