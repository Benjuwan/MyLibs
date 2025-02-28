# MyLibs
各種チュートリアルやUdemyなど教材関連のメモをはじめ、自作のいろいろライブラリ／コンポーネント

## tutorial
各種チュートリアルやUdemyなど教材関連のメモ

### React-Jotai-Tutorial（`tutorial/React-Jotai-Tutorial`）
`React`の状態管理ライブラリ`jotai`の試用検証ファイル

### reActBooth（`tutorial/reActBooth`）
[りあクト！ TypeScriptで始めるつらくないReact開発 第4版【③ React応用編】](https://booth.pm/ja/items/2367992) の個人用ハンズオンファイル及びメモ

### udemy-nextblog（`tutorial/udemy-nextblog`）
 [【Next.js13】最新バージョンのNext.js13をマイクロブログ構築しながら基礎と本質を学ぶ講座](https://www.udemy.com/course/nextjs13_learning_with_microblog/)<br />
※本`README`に記載されている一部はカリキュラム終了後に筆者が制作した`Next`プロジェクトを通じて得た情報も含まれています。

## frontend
フロントエンド関連の自作のいろいろライブラリ／コンポーネント

### dragDropSort`frontend/dragDropSort`）
- [codepen](https://codepen.io/benjuwan/pen/xxvXGrQ)<br>
リストをドラッグ&ドロップで任意の順番に並び替えられる（ソート）機能です。

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

### theCalendar（`frontend/theCalendar`）
カレンダー（簡易なスケジュール管理）<br />
各日付にある`［+アイコン］`を押して表示される登録フォームから当該日のスケジュール（予定内容と開始・終了時間）を設定できます。

### theForm（`frontend/theForm`）
ユーザーの認識負荷を軽減するために、問い合わせ内容ごとに画面を切り分けたタイプのフォーム（問い合わせ項目が多い場合などに使用）<br>※バリデーション未実装

## others
その他。備忘録／メモなど

### WordPressブロックテーマ（FSE：フルサイト編集）に関する備忘録メモ
`others/wp-about-fse.md`

### `Local`へ既存 WordPress サイトを移行（バックアップ）する方法
`others/wp-localsite-copy.md`

### 備忘録／メモ
`others\individual-memo.md`

### 備忘録／メモ（Tips）
`others/individual-memo-tips.md`

### GitHub SSH認証セットアップと開発フロー
`others/github-ssh-setup-flow.md`

### GitHub関連のメモ・備忘録
`others/git-memo.md`

### デザイン関連
`others/about-design.md`

## libs
ライブラリなど

### contact-form
確認画面付きの問い合わせフォーム

### checkDuplicateWordAndCounts
引数に指定した文字列配列内（`string[]`）の各文字列における「文字列内での重複文字と重複回数」をチェックする処理