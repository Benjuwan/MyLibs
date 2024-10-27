/* SupaBase のテーブルから個別記事を【取得】するためのAPI */

import { supabase } from "@/utils/supabaseClient";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

/* Next13以降では function [GET] 部分は、投稿ならPOST、更新ならPUT、削除ならDELETE を指定 */
export async function GET(
    req: Request,
    { params }: { params: { id: string } },
    _res: Response
) {
    /* エンドポイント：app/api/article */
    // const id = req.url?.split('/article/')[1]; // http://localhost:3000/api/article 以下の内容（例：post-test）
    const id = params.id;

    /* fetch API の method のデフォルトは 'GET' */
    if (req.method === 'GET') {
        // 全テーブル（benjuwan-next13-udemy-posts）データ内にある id のデータを「一つだけ」取得
        const { data, error } = await supabase
            .from('benjuwan-next13-udemy-posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json(error)
        }

        if (!data) {
            notFound(); // next/navigation：data が無い場合は 404 ページへ飛ばす
        }

        return NextResponse.json(data, { status: 200 })
    }
};



/* 削除 */
export async function DELETE(
    req: Request,
    _res: Response
) {
    /* エンドポイント：app/api/article */
    const id = req.url?.split('/article/')[1]; // http://localhost:3000/api/article 以下の内容（例：post-test）

    const { error: deleteError } = await supabase
        .from('benjuwan-next13-udemy-posts')
        .delete().eq('id', id); // 個別記事のURLに基づいて処理を行う

    if (deleteError) {
        return NextResponse.json(deleteError)
    }

    return NextResponse.json({ message: '削除成功' })

};



/* 更新 */
export async function PUT(
    req: Request,
    _res: Response
) {
    const { id, title, content } = await req.json();

    const { data: putData, error: putError } = await supabase
        .from('benjuwan-next13-udemy-posts')
        .update([{ title, content, createdAt: new Date().toISOString() }]).eq('id', id); // 個別記事のURLに基づいて処理を行う

    if (putError) {
        return NextResponse.json(putError)
    }

    return NextResponse.json(putData, { status: 201 })

};