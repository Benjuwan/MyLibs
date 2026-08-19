---
title: "Next.js + SupaBase でコンテンツ更新機能を実装した際の備忘録"
emoji: "👓"
type: "tech"
topics:
  - "next"
  - "react"
  - "typescript"
  - "supabase"
  - "jotai"
published: true
published_at: "2024-01-18 14:47"
---

## はじめに
これは筆者の`Next.js`勉強中の備忘録に近い内容になります。
せっかく記事にするので筆者と似たような方を対象とした記事になるように書いていきます。

- `Next.js`勉強中もしくは初心者
- `SupaBase`初心者
- `React`は触ったことがある
- 状態管理ライブラリ`Jotai`を知っている、もしくは使ったことがある

ちなみに、筆者が勉強で使用しているのは以下のUdemy教材になります。

https://www.udemy.com/course/nextjs13_learning_with_microblog/

この教材の内容に沿った説明になっていきます。

## `SupaBase`でのコンテンツ制作・読込・更新・削除
そもそも`SupaBase`って何？という方は以下の記事を参照してください。

https://qiita.com/kaho_eng/items/8a7faf77222a599fb31c#%E3%81%9D%E3%82%82%E3%81%9D%E3%82%82supabase%E3%81%A3%E3%81%A6%E3%81%AA%E3%82%93%E3%81%9E%E3%82%84

超簡潔に言うと`SupaBase`は手軽に利用できるデータベースです。

先ほど紹介した筆者がお世話になっているUdemy教材では「`SupaBase`でのコンテンツ制作・読込・削除（`CRUD`でいうところの`CRD`）」に関して丁寧に教えてくださっています。
残りの「更新（update）機能」は『自分でチャレンジしてみて下さい』という先生からの愛の鞭なので実装チャレンジしてみることにしました。

結論から言うと筆者のスキルレベルが原因で結構苦戦しました。
そういった経験も今回、備忘録として記事にしようと思ったモチベーションだったりします。

次から詰まった点と解決策について書いていきます。

::: message
間違っている部分や冗長な部分などもあるかと思いますので、そういった場合は良ければコメントでご指摘下さいますと嬉しく存じます。
:::

## 詰まった点と解決策
- そもそもどうやって更新するの？
`HTTP`に関する知識は漠然とあった（クライアントとサーバー間におけるデータのやり取りを担う奴がHTTPかぁ。という程度）のですが、実際それを使って何か行うという経験がなかったので先ずは調べました。

幸い、教材で制作・読込・削除の部分は教えていただいていたので調べる中でイメージが付きやすく理解促進も早まった気がします。

こちらの`SupaBase`公式ドキュメント（`JavaScript`）を参照に書いた記述が以下になります。

https://supabase.com/docs/reference/javascript/update

```ts
const { id } = req.query; // GET, DELETE は req.query で処理を進める
...
..
.
/* 個別記事の更新 */
else if (req.method === 'PUT') {
    const { title, content } = req.body;

    const { data: putData, error: putError } = await supabase
        .from('SupaBase-Table-Name')
        .update([{ title, content, createdAt: new Date().toISOString() }]).eq('id', id); // 個別記事のURLに基づいて処理を行う

    if (putError) {
        return res.status(500).json({ error: putError.message }); // エラー時は 500 番を返す
    }

    return res.status(200).json(putData);
}
```

上記のコードから筆者が詰まった点を深ぼっていきたいと思います。

- `PUT`は`POST`と同じく`req.body`からコンテンツ情報を取得する。
以下は`req.body`について`Chat-GPT`に聞いた回答です。
> req.body は、HTTPリクエストのボディ（body）に含まれるデータを取得するために使用されます。通常、POSTリクエストやPUTリクエストのように、クライアントからサーバにデータを送信する場合に使用されます。例えば、HTMLフォームを使用してデータを送信し、そのデータをサーバで処理する場合にreq.bodyを使用することがあります。

筆者は愚直にも`req.query`で処理を行おうとしており、うまくいきませんでした。
```ts
const { id, title, content } = req.query;
```

`req.query`についても`Chat-GPT`に聞いて見ました。
> HTTPリクエストのクエリパラメータを取得するために使用されます。クエリパラメータは、URLに?で始まり、その後にキーと値がペアになったもので、複数のパラメータは&で区切られます。通常、GETリクエストで送信されたパラメータを取得する場合に使用されます。

`GET`機能実装時に記述していた`req.query`をそのまま使おうとしていたことが失敗の原因でした。

解決策としてはシンプルで「`req.body`を使用する」となります。

- `update`の使い方で詰まる
前述した[`SupaBase`の公式ドキュメント](https://supabase.com/docs/reference/javascript/update)では`update`に関して以下のように書かれていました。

```js
const { error } = await supabase
  .from('countries')
  .update({ name: 'Australia' })
  .eq('id', 1)
```

「ふむふむ、なるほど……。`.update({ name: 'Australia' })`という形で書くのだな。
じゃあ、記述例での`name`キーの値の部分（'Australia'）は、グローバルステートで渡すしかなさそうだ」と思った筆者は状態管理ライブラリ`Jotai`をインストール。

記事詳細ページで用意した各種（タイトルと本文）ステートを更新して、それを渡せば良いと思って以下の記述にしました。

```ts
const [titleAtom] = useAtom(updateTitle);
const [contentAtom] = useAtom(updateContent);
..
.
/* 個別記事の更新 */
else if (req.method === 'PUT') {
    ..
    .
        .update([{ 
	title: titleAtom, 
	content: contentAtom, 
	createdAt: new Date().toISOString()
	}]).eq('id', id); // 個別記事のURLに基づいて処理を行う
    ..
    .
```

しかし、この方法だと更新機能はおろか、削除機能まで動かなくなりました。
ログを見ると500番エラーが出ており、`Atom`関連の処理をコメントアウトすると**削除機能は復活**しました。
原因は不明ですがAPIに関する動的ファイルではライブラリが使えない（？）ようです。
原因を究明しようとしたりして、ここらへんで結構時間を食ってしまいました。

解決策としては別の場所で`atom`（グローバルステート）を使用することでした。

記事詳細ページを反映する`articles/[id]/page.tsx`を以下のように書き換えました。

```ts:articles/[id]/page.tsx
.
..
const ArticleDetails = async ({ params }: { params: { id: string } }) => {
    const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
    const res = await fetch(`${API_URL}/api/${params.id}`, { next: { revalidate: 60 } });
    const detailArticle: articleType = await res.json();

    return (
        <div className="max-w-3xl mx-auto p-5">
	    {/* 記事コンテンツコンポーネント */}
            <PageItem article={detailArticle} />
	    
	    {/* 削除ボタンコンポーネント */}
            <DeleteBtn articleId={params.id} />
            <Link href='/' className="block pt-8">to TOP</Link>
        </div>
    )
}

export default ArticleDetails;
```

記事コンテンツコンポーネントである`PageItem`では、記事内容の表示及び、タイトルと記事本文部分を編集するためのモード切り替えを行っています。

```ts:PageItem.tsx
"use client"
..
.
/* 状態管理ライブラリ：Jotai */
import { useAtom } from "jotai";
import { updateContent, updateTitle } from "@/ts/atom";
..
.
export const PageItem = ({ article }: { article: articleType }) => {
    const [edit, setEdit] = useState<boolean>(false);
    const changeEditMode: () => void = () => setEdit(!edit);

    /* Jotai */
    const [title, setTitle] = useAtom(updateTitle); // タイトル
    const [content, setContent] = useAtom(updateContent); // 本文

    return (
        <>
            <Image
                src={`https://source.unsplash.com/collection/1346951/1000x500?sig=${article.id}`}
                alt=""
                width={640}
                height={300}
            />
	    {/* edit ステート true で編集モードに切替 */}
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
                        <p>{article.content}</p>
                    </div>
                </>

            }
	    
	    {/* 記事の更新ボタンコンポーネント */}
            <UpdateBtn
                articleId={article.id}
                edit={edit}
                changeEditMode={changeEditMode}
            />
        </>
    );
}
```

記事の更新ボタンコンポーネントである`UpdateBtn`には、詳細ページの記事URLと、編集モードのステート、それを更新する処理を`props`として渡しています。

```ts:UpdateBtn.tsx
"use client"
..
.
/* 状態管理ライブラリ：Jotai */
import { updateContent, updateTitle } from "@/ts/atom";
import { useAtom } from "jotai";

type updateBtnPropsType = {
    articleId: string;
    edit: boolean;
    changeEditMode: () => void;
}

export const UpdateBtn: FC<updateBtnPropsType> = ({ articleId, edit, changeEditMode }) => {
    const router = useRouter(); // リダイレクト処理

    /* Jotai */
    const [titleAtom] = useAtom(updateTitle);
    const [contentAtom] = useAtom(updateContent);

    const handleClickUpdate = () => {
        const id = articleId;
        const title: string = titleAtom;
        const content: string = contentAtom;

        const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
        fetch(`${API_URL}/api/${articleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, title, content })
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
```

これにより、無事に記事更新が行えるようになりました！
削除も更新も500番エラーなく行えますし、記事の投稿も行えるので一安心……。

と思ったのですが、この記事を書いていて別に`Jotai`を使う必要ってなかったなと。
普通にステートを`PageItem.tsx`から`props`として`UpdateBtn.tsx`に渡してあげればいいですね。


最後に備忘録という観点で、`SupaBase`から個別記事を【取得、削除、更新】するためのAPIを書いたコード全文を残しておきます。


```ts:pages/api/[id].ts
import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query; // GET, DELETE は req.query で処理を進める

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('SupaBase-Table-Name')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            notFound(); // next/navigation：data が無い場合は 404 ページへ飛ばす
        }

        return res.status(200).json(data);
    }

    /* 個別記事の削除 */
    else if (req.method === 'DELETE') {
        const { error: deleteError } = await supabase
            .from('SupaBase-Table-Name')
            .delete().eq('id', id); // 個別記事のURLに基づいて処理を行う

        if (deleteError) {
            res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: '削除に成功しました' });
    }

    /* 個別記事の更新 */
    else if (req.method === 'PUT') {
        const { id, title, content } = req.body; // PUT は req.body で処理を進める

        const { data: putData, error: putError } = await supabase
            .from('SupaBase-Table-Name')
            .update([{ id, title, content, createdAt: new Date().toISOString() }]).eq('id', id); // 個別記事のURLに基づいて処理を行う

        if (putError) {
            return res.status(500).json({ error: putError.message }); // エラー時は 500 番を返す
        }

        return res.status(200).json(putData);
    }

    else {
        throw new Error('page/api/[id].ts ERROR.');
    }
};
```

## さいごに
ここまで読んでいただき、ありがとうございました。
この記事が筆者のように情報を求めてネットを彷徨う方のオアシスに少しでもなれれば嬉しく思います。