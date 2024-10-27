import { articleType } from "../../types";
import { notFound } from "next/navigation"; // 404 ページへのリダイレクト

/* 記事一覧取得：配列で返すので articleType[] と指定（各データ要素としてなら articleType と指定で ok）*/
export const getAllArticles: () => Promise<articleType[]> = async (): Promise<articleType[]> => {
    /* Next.js 13 からはトップレベルで await を使用してフェッチできる */
    const response = await fetch('http://localhost:3001/posts', { cache: "no-store" }); // json-server で指定した portNumber を末尾に指定（絶対パスでURL指定）

    if (response.status !== 200) {
        throw new Error('throw 文は式を直接投げるのに対して、throw new 文は新しいエラーオブジェクトを生成して投げることができます。通常【詳細なエラー情報】が必要な場合には throw new Error の形式がより適しています');
    }

    await new Promise((resolve) => setTimeout(resolve, 500)); // ローディング表示のための疑似的な遅延処理

    const articles: articleType[] = await response.json();
    return articles;
}

/* 個別記事取得：個別詳細ページ */
export const getDetailArticle: (id: string) => Promise<articleType> = async (id: string): Promise<articleType> => {
    const response = await fetch(`http://localhost:3001/posts/${id}`, { next: { revalidate: 60 } }); // ISR

    if (response.status === 404) {
        notFound(); // 404 ページへのリダイレクト（next/navigation から import）
    } else if (response.status !== 200) {
        throw new Error('throw 文は式を直接投げるのに対して、throw new 文は新しいエラーオブジェクトを生成して投げることができます。通常【詳細なエラー情報】が必要な場合には throw new Error の形式がより適しています');
    }

    const article: articleType = await response.json();
    return article;
}

/* 記事投稿 */
export const createArticle = async (
    id: string,
    title: string,
    content: string
): Promise<articleType> => {
    const currentDatetime = new Date().toISOString(); // toISOString：現在の日時を取得

    const response = await fetch('http://localhost:3001/posts', {
        method: "POST", // create なので POST
        headers: {
            "Content-Type": "application/json", // json 形式で扱うことを明記
        },
        body: JSON.stringify({ id, title, content, createdAt: currentDatetime }) // 引数の内容を json 文字列形式でリクエストボディに渡す
    });

    console.log(response.status); // 201

    if (!response.ok) {
        throw new Error('throw 文は式を直接投げるのに対して、throw new 文は新しいエラーオブジェクトを生成して投げることができます。通常【詳細なエラー情報】が必要な場合には throw new Error の形式がより適しています');
    }

    const newArticle: articleType = await response.json();
    return newArticle;
}

/* 記事削除 */
export const deleteArticle = async (id: string): Promise<articleType> => {
    const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: "DELETE", // delete なので DELETE、データの扱いに関する記述（headers, body, etc...）は不要
    });

    console.log(response.status); // 200

    if (!response.ok) {
        throw new Error('throw 文は式を直接投げるのに対して、throw new 文は新しいエラーオブジェクトを生成して投げることができます。通常【詳細なエラー情報】が必要な場合には throw new Error の形式がより適しています');
    }

    const deleteArticle: articleType = await response.json();
    return deleteArticle;
}