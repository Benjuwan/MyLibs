"use client" // submit イベントの使用はクライアントコンポーネントでしか不可能

import { useFetchPost } from "@/app/hooks/useFetchIPost";
import { createArticle } from "@/app/hooks/blogApis";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components"; // クライアントコンポーネントでしか使用できない

/* 任意のコンポーネント名を付けてもokだが、命名規則はパスカルケースを守ること */
const CreateBlogPage = () => {
    /*（カスタム）フック系統の処理は クライアントコンポーネント（ファイル先頭に use client 記述）でしか不可能 */
    const { fetchPost } = useFetchPost();
    useEffect(() => {
        const post = fetchPost("https://jsonplaceholder.typicode.com/posts");
        console.log(post);

        /* fetch 不可能 */
        // const fetchArticleData_test = async () => {
        //     const res = await fetch(`http://localhost:3001/src/data/posts.json`, { cache: "no-store" });
        //     const articleData = await res.json();
        //     console.log(articleData);
        // }
        // fetchArticleData_test();
    }, []);

    const router = useRouter(); // リダイレクト処理
    const [loading, setLoading] = useState<boolean>(false);
    const [id, setId] = useState<string>(''); // url
    const [title, setTitle] = useState<string>(''); // タイトル
    const [content, setContent] = useState<string>(''); // 本文

    /* form の送信イベント（記述内容をPOST）*/
    const handleSubmit = async (formElm: ChangeEvent<HTMLFormElement>) => {
        formElm.preventDefault();
        // console.log(urlInput, titleInput, contentTextArea);
        setLoading(true);

        /* json-server 用 */
        // createArticle(urlInput, titleInput, contentTextArea);

        const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
        // pages/api/create.ts なのでエンドポイントは create
        // app/api/article なのでエンドポイントは article
        await fetch(`${API_URL}/api/article`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // json 形式で扱うことを明記
            },
            body: JSON.stringify({ id, title, content }) // テーブルデータ名と（リクエストボディに渡す値の名前）State名は【全く同じ】にしないと機能しない
        });


        setLoading(false);
        router.push('/'); // top へリダイレクト
        router.refresh(); // リダイレクト処理後のクリーンアップ
    }

    return (
        <div className="min-h-screen py-8 px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-4">ブログ新規作成</h2>
            <form className="bg-slate-200 p-6 rounded shadow-lg" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"><FormElmLable>URL</FormElmLable><input value={id} onInput={(inputElm: ChangeEvent<HTMLInputElement>) => setId((_prevInputElmVal) => inputElm.target.value)} type="text" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" /></label>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"><FormElmLable>タイトル</FormElmLable><input value={title} onInput={(inputElm: ChangeEvent<HTMLInputElement>) => setTitle((_prevInputElmVal) => inputElm.target.value)} type="text" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" /></label>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2"><FormElmLable>本文</FormElmLable><textarea value={content} onInput={(textAreaElm: ChangeEvent<HTMLTextAreaElement>) => setContent((_prevTextAreaElmVal) => textAreaElm.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" cols={30} rows={10}></textarea></label>
                </div>

                <button
                    className={`py-2 px-4 border rounded-md ${loading
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-400 hover:bg-orange-500"
                        } text-white font-semibold focus:outline-none`}
                    disabled={loading}
                >
                    作成
                </button>
            </form>
        </div>
    );
}

export default CreateBlogPage;

const FormElmLable = styled.p`
    background-color: #1bb71b;
    border-left: 4px solid #0d5e0d;
    color: #fff;
    border-radius: 0 4px 4px 0;
    width: fit-content;
    padding: .25em .5em;
    margin-bottom: .5em;
`