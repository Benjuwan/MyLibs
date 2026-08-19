---
title: "Vercel で 504 （FUNCTION_INVOCATION_TIMEOUT）タイムアウトが発生した時はリージョンの設定を変えてみる"
emoji: "🌐"
type: "tech"
topics:
  - "nextjs"
  - "react"
  - "vercel"
  - "error"
  - "debug"
published: true
published_at: "2024-08-26 11:52"
---

## はじめに
`Next.js`,`vercel`でサイト制作していて、そちらではサーバーコンポーネントから外部エンドポイントにデータフェッチしてコンテンツを取得・表示する仕様にしていました。
（※実際にデータを描画するのはデータをpropsで渡されたクライアントコンポーネントです）

今回、データフェッチ処理において504（`FUNCTION_INVOCATION_TIMEOUT`）が発生してコンテンツが取得・表示されないエラーに遭遇したので、その時の対応策を備忘録がてら残しておきたいと思います。

もし同じ状況に困っている人が検索でヒットして解決の一助になれれば幸いです。

## リージョンをデフォルトのワシントンDCから東京や大阪など日本に変更
先に結論・解決策を述べると`vercel`のダッシュボードから当該サイトの[Setting]欄へ移動し、`Function Region`を**デフォルトのワシントンDCから東京や大阪など日本のリージョンに変更**することで504（`FUNCTION_INVOCATION_TIMEOUT`）が解消されました。

![](https://storage.googleapis.com/zenn-user-upload/dbc8b1357c62-20240826.png)

エッジコンピューティングのような、サーバーの物理的な距離の近さで処理負担を軽減したことにより当該エラーを解消できたと推察しています。

## 504 （FUNCTION_INVOCATION_TIMEOUT）
504（`FUNCTION_INVOCATION_TIMEOUT`）とはタイムアウトエラーです。
大雑把に説明すると「処理に時間がかかりすぎて中断された状況」です。

https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT

> このFUNCTION_INVOCATION_TIMEOUTエラーは、関数の呼び出しが許容実行時間よりも長くかかる場合に発生します。これは、関数自体のエラー、ネットワーク呼び出しの遅さ、または関数が実行されている環境の問題が原因である可能性があります。

vercelではプランごとに「許容実行時間」が異なります。

![](https://storage.googleapis.com/zenn-user-upload/5942841b6044-20240826.png)

無料の`Hobby`プランではデフォルトが10秒で上限60秒となっています。

::: message
※他にもキャプチャ画像の下部にあるように`Memory size limits`などプランごとに制限が違ってきます。本筋から逸れるので詳しくは話しませんが気になる方は以下の参照ページから確認してみてください。
::: 

https://vercel.com/docs/functions/runtimes#max-duration

https://vercel.com/docs/limits/overview

ちなみに、筆者は最初`Function Max Duration`を変更しようと思ったのですが「請求に悪影響を及ぼす可能性がある」という警告文が出てビビったので別のアプローチを考えました。

その時に、リージョンに目が行って「物理的な距離の問題では？」と思ってダメ元で変更したところうまくいきました。

これは先程も触れた通り、サーバーの物理的な距離の近さで処理負担を軽減したことにより当該エラーを解消できたと推察しています。

## さいごに
開発環境では問題なく動いていて、デプロイするとエラーが出てしまった時は焦ると思います。
（筆者は焦りました）

この記事が、そんな焦って解決策を探している人のお役に立てれば嬉しい限りです。

## 参考情報
https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT

https://vercel.com/docs/functions/runtimes#max-duration

https://vercel.com/docs/limits/overview