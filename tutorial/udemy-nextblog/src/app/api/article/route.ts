/* SupaBase のテーブルから全記事を取得するためのAPI */

import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request
) {
    const { data, error } = await supabase.from('benjuwan-next13-udemy-posts').select('*');

    if (error) {
        return NextResponse.json(error)
    }

    return NextResponse.json(data, { status: 200 })

};

/* 投稿 */
export async function POST(
    req: Request
) {
    const { id, title, content } = await req.json();

    const { data, error } = await supabase
        .from('benjuwan-next13-udemy-posts')
        .insert([{ id, title, content, createdAt: new Date().toISOString() }]);

    if (error) {
        return NextResponse.json(error)
    }

    return NextResponse.json(data, { status: 201 })

};
