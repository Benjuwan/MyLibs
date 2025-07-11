# MyLibs
各種チュートリアルやUdemyなど教材関連のメモをはじめ、自作のいろいろライブラリ／コンポーネント

## tutorial
各種チュートリアルやUdemyなど教材関連のメモ

### [reActBooth（`tutorial/reActBooth`）](https://github.com/Benjuwan/MyLibs/tree/main/tutorial/reActBooth)
[りあクト！ TypeScriptで始めるつらくないReact開発 第4版【③ React応用編】](https://booth.pm/ja/items/2367992) の個人用メモ

### [udemy-nextblog（`tutorial/udemy-nextblog`）](https://github.com/Benjuwan/MyLibs/tree/main/tutorial/udemy-nextblog)
 [【Next.js13】最新バージョンのNext.js13をマイクロブログ構築しながら基礎と本質を学ぶ講座](https://www.udemy.com/course/nextjs13_learning_with_microblog/)<br />
※本`README`に記載されている一部はカリキュラム終了後に自分が制作した`Next`プロジェクトを通じて得た情報も含まれています。

## frontend
フロントエンド関連の自作のいろいろライブラリ／コンポーネント

### Tailwind CSS についての備忘録ドキュメント
※まとめていたものを以下の記事に移行<br>
- [styled-components から Tailwind CSS への移行作業を終えて](https://zenn.dev/benjuwan/articles/4041e4698dee1b)

### ActionStateDemo（`frontend/ActionStateDemo`）
`React 19`で追加された`useActionState`の試用検証ファイル（コンポーネント）

### dragDropSort（`frontend/dragDropSort`）
- [codepen](https://codepen.io/benjuwan/pen/xxvXGrQ)<br>
リストをドラッグ&ドロップで任意の順番に並び替えられる（ソート）機能です。

### dynamic-select-schedule（`frontend/dynamic-select-schedule`）
年月日の`select`メニューUI。`codepen`と`React`の2パターン。

### emoSlider（`frontend/emoSlider`）
【ネタコンポーネント】（個人的に）エモさを感じるスライダー

### FilterSearchAtWordPress（`frontend/FilterSearchAtWordPress`）
WordPressサイトで使用できる「絞り込み（複数）検索機能」を実装するためのファイルセットです。検索項目（カテゴリー）の設定は《カスタムタクソノミー》を使用（左記や以下の説明で出てくるカテゴリーはタクソノミーを指します）<br />
Qiitaに記事としても紹介しています。<br />
[カスタム投稿タイプとタクソノミーを使った絞り込み検索機能を作りたい](https://qiita.com/benjuwan/items/605cd52078b2af903acd)

### react-countTimer（`frontend/react-countTimer`）
現在時刻（入力時刻）から`input`タグの`type="datetime-local"`でユーザーが入力した年月日時分までのタイムカウンター。

### react-memorygame（`frontend/react-memorygame`）
神経衰弱ゲーム

### the-pagination
`Next.js`のシンプルで汎用的なページネーションコンポーネント

### theCalendar（`frontend/theCalendar`）
カレンダー（簡易なスケジュール管理）<br />
各日付にある`［+アイコン］`を押して表示される登録フォームから当該日のスケジュール（予定内容と開始・終了時間）を設定できます。

## others
その他。備忘録／メモなど

### WordPressブロックテーマ（FSE：フルサイト編集）に関する備忘録メモ
[`others/wp-about-fse.md`](./others/wp-about-fse.md)

### `Local`へ既存 WordPress サイトを移行（バックアップ）する方法
[`others/wp-localsite-copy.md`](./others/wp-localsite-copy.md)

### 備忘録／メモ
[`others/individual-memo.md`](./others/individual-memo.md)

### 備忘録／メモ（Tips）
[`others/individual-memo-tips.md`](./others/individual-memo-tips.md)

### GitHub SSH認証セットアップと開発フロー
[`others/github-ssh-setup-flow.md`](./others/github-ssh-setup-flow.md)

### GitHub関連のメモ・備忘録
[`others/git-memo.md`](./others/git-memo.md)

### デザイン関連
[`others/about-design.md`](./others/about-design.md)

### 関数で作るか、オブジェクト（クラス）で作るかという悩み
[`others/fp-vs-oop.md`](./others/fp-vs-oop.md)

### Reactの状態管理ライブラリ`Jotai`に関するメモ書き
[`others/React-Jotai-Tutorial.md`](./others/React-Jotai-Tutorial.md)

## libs
ライブラリなど

### contact-form
確認画面付きの問い合わせフォーム

### checkDuplicateWordAndCounts
引数に指定した文字列配列内（`string[]`）の各文字列における「文字列内での重複文字と重複回数」をチェックする処理