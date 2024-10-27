"use client"

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import parse from "html-react-parser" // npm i html-react-parser
import { articleType } from "@/types";
import { UpdateBtn } from "@/app/components/UpdateBtn";

export const PageItem = ({ article }: { article: articleType }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const changeEditMode: () => void = () => setEdit(!edit);
    const [title, setTitle] = useState<string>(''); // タイトル
    const [content, setContent] = useState<string>(''); // 本文
    const [contentParse, setContentParse] = useState<string>(''); // パース用本文

    useEffect(() => {
        const contentTxt = article.content.replaceAll('\n', '<br />'); // 改行を<br />に変換
        setContentParse((_prevContentParse) => contentTxt);
    }, [edit]);

    return (
        <>
            <Image
                src={`https://source.unsplash.com/collection/1346951/1000x500?sig=${article.id}`} // sig=数値：数値の変更で画像変更
                alt=""
                width={640}
                height={300}
            />
            {edit ?
                <>
                    <div className="text-slate-900 text-center mb-10 mt-10">
                        <input type="text" style={{ 'width': '100%' }} value={title} onInput={(titleElm: ChangeEvent<HTMLInputElement>) => setTitle((_prevTitle) => titleElm.target.value)} />
                    </div>
                    <div className="text-lg leading-relaxed text-justify mb-10">
                        <textarea value={content} onInput={(textAreaElm: ChangeEvent<HTMLTextAreaElement>) => setContent((_prevTextAreaElmVal) => textAreaElm.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" cols={30} rows={10}></textarea>
                    </div>
                </> :
                <>
                    <h1 className="text-4xl text-center mb-10 mt-10">{article.title}</h1>
                    <div className="text-lg leading-relaxed text-justify mb-10">
                        <p>{parse(contentParse)}</p>
                    </div>
                </>

            }
            <UpdateBtn
                articleId={article.id}
                updateTitle={title}
                updateContent={content}
                edit={edit}
                changeEditMode={changeEditMode}
            />
        </>
    );
}