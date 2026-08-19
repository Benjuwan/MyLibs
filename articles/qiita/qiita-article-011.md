title: 爆誕！童心をくすぐる！ポケモン図鑑！

tags: React TypeScript 個人開発

## はじめに
昔、ゲームの攻略本とかで武器や防具、アイテムが一覧で載っているページってワクワクしませんでしたか？
今回、下記記事で[「Poke API」](https://pokeapi.co/)という存在を知りまして、触ってみようと思い`React`、`TypeScript`でポケモン図鑑を制作しました。

https://qiita.com/hato_code/items/e75f215ef2d5191341dc

この記事からコードの一部を参考及びファイルを拝借（ポケモン名の和訳jsonファイル）させていただきました。

:::note info
2023/11/24 追加更新
和訳ファイルを使用せず、APIデータからポケモンの和名を直接取得・反映させるようにしました。
ピカチュウって今、こんなに色々なバリエーションあるんですね……。

![スクリーンショット 2023-11-24 175650.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/dd627786-9c98-a507-92eb-1e2a4173d294.png)
:::

## 作ったもの
https://pokeview-pi.vercel.app/

![254aef95e2d6ff58f5ce88c980716aa4.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/cc14854c-e8dd-adf5-38cf-6be3139f87a8.gif)
~~※画質悪し。~~ @hato_code さんにご教授いただいた動画キャプチャーサービス[Gyazo](https://gyazo.com)を利用して再アップしました。

各ポケモンを選択すると以下のように詳細情報が確認できます。
カラカラの紹介文……切なすぎますね泣。幸せになってくれ泣。
![スクリーンショット 2023-11-19 113819.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e2faa725-4107-3da4-8992-f0487e716783.png)

## こだわり
- 1：ポケモンが動く
筆者が幼き頃、ポケモンで遊んでいて衝撃を受けたのが**ポケモンが動いている**ことでした。確かクリスタル？とかから動くようになった記憶が……あまり話過ぎると年齢がバレそうですね（まぁバレても何の問題もないのですが）。
今回「童心をくすぐる」ということなので、ポケモンたちには動いてもらうことにしました。結構ノスタルジックな思いになりましたが、これはまさしく自己満仕様です。
![45d72efbd96e315772ab9e4726d09170.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/1e2fbf51-1a2a-85ff-b634-381816ac3f9a.gif)
~~※画質悪し。~~ @hato_code さんにご教授いただいた動画キャプチャーサービス[Gyazo](https://gyazo.com)を利用して再アップしました。

ついでの説明になりますが、図鑑なので検索機能も設けました。上記はルギアを検索したところですね。<font color="lightgray">タイトルも「爆誕」ですし……</font>

- 2：背景画像のランダム表示
これも昔、ポケモンをポケモンセンターに預けてボックス（でしたかね？）で確認する時「確かポケモンが並んでいた背景画像が随時切り替わっていたような……」という記憶から実装することを決意。
スマートフォン閲覧時は全く分かりませんが（笑）、ページ遷移するたびに背景画像がランダム表示される仕組みになっています。もちろんこれも自己満仕様です。

ちなみに、これらの背景画像は Bing の[`Image Creator`](https://www.bing.com/create)に生成してもらいました。

![スクリーンショット 2023-11-16 160017.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/466c1f06-3056-3d43-b34e-e5137ce832f1.png)
![スクリーンショット 2023-11-15 204322.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/5750191b-4b1d-a9e4-1865-01897654a883.png)

<font color="lightgray">ピカチュウとかむっちゃピカチュウなんですけど良いんでしょうかね？
</font>

:::note info
話が逸れるので深入りしませんが、「Image Creator」には DALL・E 3 が使用されていています。OpenAI の ChatGPT と違って商用利用不可になっているのでご注意ください。
:::

https://forest.watch.impress.co.jp/docs/serial/yajiuma/1543573.html

- 3：モンスターボールを使ったインタラクション
ページ送り時にモンスターボールが「うにょっ」と動くのが個人的にお気に入りです！
![pokeView.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/cb3a27ce-4cb5-2069-1d4d-27dca74c44b6.gif)

- 4：自作のページネーション（ページ送り）機能
以前自分が作ったサイト（不動産取引情報取得サイト）から応用できるのでは？と思い、その機能を持ってきました。
`React`はコンポーネントベースなので融通が効いていいですね！

https://qiita.com/benjuwan/items/4a3207fb9fc5fddba9d4

## さいごに
今回制作したポケモン図鑑の`GitHub`を載せておきます。
気になる方は自由にダウンロードしてご使用ください。

https://github.com/Benjuwan/pokeView

ここまで読んでいただいて、ありがとうございました！
