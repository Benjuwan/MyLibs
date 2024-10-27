/* SupaBase のテーブルから個別記事を【取得, 削除, 更新】するためのAPI */
/* ---------------- Next12 までの書き方（Next13でも使用可）---------------- */

/**
 * Next12 までの書き方
 * https://nextjs-ja-translation-docs.vercel.app/docs/api-routes/introduction
*/

import { supabase } from "@/utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";

/* この動的関数ファイル（[id].ts）で Atom（というかライブラリ？）は使えない。使うと PUT や DELETE 処理でサーバー接続エラー（500）が発生してしまう */

/* 関数宣言は以下の記述【export default async function handler】でないと機能しない */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    /**
     *【req.query】
     * HTTPリクエストのクエリパラメータを取得するために使用されます。
     * クエリパラメータは、URLに?で始まり、その後にキーと値がペアになったもので、複数のパラメータは&で区切られます。
     * 通常、GETリクエストで送信されたパラメータを取得する場合に使用されます。
    */
    const { id } = req.query; // GET（default）, DELETE は req.query で処理を進める

    /* fetch API の method のデフォルトは 'GET' */
    if (req.method === 'GET') {
        // 全テーブル（benjuwan-next13-udemy-posts）データ内にある id のデータを「一つだけ」取得
        const { data, error } = await supabase
            .from('benjuwan-next13-udemy-posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message }); // エラー時は 500 番を返す（※失敗時のレスポンス生成であり、実際の処理の流れには影響を与えない）
        }

        if (!data) {
            notFound(); // next/navigation：data が無い場合は 404 ページへ飛ばす
        }

        return res.status(200).json(data); // 問題ない場合は 200 番に、そして json形式で（dataを）返す（※成功時のレスポンス生成であり、実際の処理の流れには影響を与えない）
    }

    /* 個別記事の削除 */
    else if (req.method === 'DELETE') {
        const { error: deleteError } = await supabase
            .from('benjuwan-next13-udemy-posts')
            .delete().eq('id', id); // 個別記事のURLに基づいて処理を行う

        if (deleteError) {
            res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: '削除に成功しました' });
    }

    /* 個別記事の更新 */
    else if (req.method === 'PUT') {
        /**
         *【req.body】
        * HTTPリクエストのボディ（body）に含まれるデータを取得するために使用されます。
        * 通常、POSTリクエストやPUTリクエストのように、クライアントからサーバにデータを送信する場合に使用されます。
        * 例えば、HTMLフォームを使用してデータを送信し、そのデータをサーバで処理する場合にreq.bodyを使用することがあります。
        */
        const { title, content } = req.body; // PUT は req.body で処理を進める

        const { data: putData, error: putError } = await supabase
            .from('benjuwan-next13-udemy-posts')
            .update([{ title, content, createdAt: new Date().toISOString() }]).eq('id', id); // 個別記事のURLに基づいて処理を行う

        if (putError) {
            return res.status(500).json({ error: putError.message });
        }

        return res.status(200).json(putData);
    }

    else {
        throw new Error('page/api/[id].ts ERROR.');
    }
};