# WordPress | ブロックテーマ（FSE：Full Sites Editing）

## ブロックテーマ概要
従来のクラシックテーマのように`xxxx.php`, `xxxx.css`, `functions.php` でサイト制作（開発）するのではなく、`theme.json`というファイルで以下の設定を行い開発していく。
- テンプレート{テーマファイル}の制作（`header`, `footer`, カスタムテンプレートなど）
- カスタムプロパティの生成（各種ブロック{要素}へのスタイル指定+生成）
- `functions.php`で行っていたテーマサポート（`add-theme-support()`）の設定など（※ブロックテーマでも`functions.php`は使用する）

- ブロックテーマでは`language_attributes`, `wp_head`, `wp_body_open`, `wp_footer`などを`wp-includes/template-canvas.php`にて事前に用意してくれる。
  > ブロックテーマでは、基本的にすべてのページは「wp-includes/template-canvas.php」をテンプレートとして表示されます。
  - 参照：[【WordPress】ブロックテーマのテンプレート構造](https://zenn.dev/yggrit/articles/c9ab45f91c86cc)

- ブロックテーマでは、エディター（旧サイトエディター）でカスタマイズした内容はデータベースに保存される（＝サイトエディターで編集した内容はテーマを変更しても維持される）
  > ブロックテーマでは、エディター（旧サイトエディター）でカスタマイズした内容はデータベースに保存されます。<br>
  > このため、テスト環境で作成したものを本番環境に適用するのが難しいです。<br>
  > また、クラシックテーマの時は編集内容をGitで管理していましたが、データベースに保存されてしまうのではGitが使えません。
  - 参照：[クラシックテーマ制作者の私がブロックテーマ制作で悩んだこと](https://www.cherrypieweb.com/5938#google_vignette)<br><br>

  - すでに管理画面（サイトエディター）でテンプレートを制作・追加している場合（それらはDBに保存されているため）`xxxx.html`より優先的に使用されてしまう（※ケース・バイ・ケースでサイトエディターでのコード・タグなどの制作行為、検証・編集は避けたほうが無難）

  > テンプレート情報の保存先<br><br>
  > このような手順でユーザーが管理画面から編集した、インデックステンプレートや単一テンプレートの設定はすべてデータベース※に保存されます。最初に用意した<br>HTMLファイルやJSONファイルなどに書き込まれるわけではありません。このように、同じテーマを有効化したであっても、エディターによって全く違う構成のサイトを作成できるのが、ブロックテーマの特徴です。<br><br>
  > ※実際はwp_template（テンプレートパーツはwp_template_part）というカスタム投稿タイプとして保存されます。
  - 参照：[WordPressサイトエディター対応のブロックテーマ開発（基本編） - テンプレート情報の保存先](https://kiwi-dev.com/2022/11/27/wordpress-block-editor-basic/)

- ブロックテーマはその名の通り各種ブロックを積み上げて構築していく
  > ブロックテーマには、ブロックマークアップ（block markup）と呼ばれる記述法があります。<br>
  > 例を出すと下記のようなものです。<br>
  > ```<!-- wp:site-title /-->```<br>
  > ▲ WordPressサイトのタイトルが出力される。<br>
  > ```<!-- wp:navigation /-->```<br>
  > ▲ ナビゲーションが出力される<br>
  > こんな感じのHTMLのコメントアウトで宣言的に記述していくものです。
- 参照：(WordPressのブロックテーマとやらに入門してみる - ブロックマークアップ)[https://zenn.dev/link/comments/e7c17d1007bee3]

> [!NOTE]  
> ブロックテーマの場合、投稿（single）や固定（page）ページ用のテンプレートファイルにループを用意する必要はない。ループ設定はブロックエディターの`クエリループ`ブロックを使用して設定する。

- 設定したブロックテーマのエクスポート方法
エディター画面の右上にある「`︙`（縦三点リーダー）」を クリックしてエクスポート

- ブロックテーマでも`css`, `js`の読込は`functions.php`で行う
  > ブロックテーマでは、 wp_head() などを自動的に出力してくれる。
  > そのため、CSSを呼び出すような機構が無く、全て functions.php から指示を投げる必要がある。
  - 参照：[WordPressのブロックテーマとやらに入門してみる](https://zenn.dev/masa5714/scraps/973a8ab75f2c1f)
  ```php
  // スクリプトをエンキュー
  function theme_enqueue_styles_scripts() {
    wp_enqueue_script('origin', get_template_directory_uri().'/assets/js/origin.js'); // origin.js
  }
  add_action('wp_enqueue_scripts', 'theme_enqueue_styles_scripts');

  //（別テーマ：synergy_souken から）スタイルをエンキュー
  function enqueue_other_theme_style() {
    wp_enqueue_style( 'import-style', get_option('site_url').'/wp-content/themes/synergy_souken/common/css/import.css');
  }
  add_action( 'wp_enqueue_scripts', 'enqueue_other_theme_style' );
  ```

  > CSSの読み込みとブロック別CSS<br><br>
  > ブロックテーマでは、これまでのwp_enqueue_style()関数に加え、ブロックごとのCSSが追加できるようになりました。ブロックごとのCSSは該当のブロックが使われているページのみで読み込まれるのが特徴で、wp_enqueue_block_style()関数を使って設定します。
  - 参照：[WordPressサイトエディター対応のブロックテーマ開発（機能編）- CSSの読み込みとブロック別CSS](https://kiwi-dev.com/2022/12/03/wordpress-block-editor-functions/)

## `theme.json`について
`theme.json`はテーマの見た目や設定を定義するためのファイルです。ブロックテーマを開発する上で必要なファイルの1つです。`theme.json`で設定する内容の例は以下の通りです。
- ブロックテーマとしてテーマを認識させるための必須ファイル
  - `style.css`, `templates/index.html`, `theme.json`
- マージンやパディング、行間などの調整機能の有効化・無効化、設定できる値
- カラーパレット、グラデーション、Duotoneなどの設定
- フォントサイズ、フォントの種類などの設定
- コンテンツ幅の設定
- 追加のCSS変数の定義
- テンプレートパーツに関する情報

```
theme/
  |-- style.css        // 内容は従来（クラシックテーマ>）と同じ
  |-- functions.php    // ※1
  |-- index.php
  |-- templates        // コンテンツ系が`templates`ディレクトリ
    |-- index.html     // ※2
    |-- single.html    // ※3
    |-- archive.html   // ※3
    |-- category.html  // ※3
    |-- tags.html      // ※3
  |-- parts            // インクルード系が`parts`ディレクトリ
    |-- header.html    // ※3
    |-- footer.html    // ※3
  |-- theme.json
```

- ※1: `functions.php`の用意は任意。テーマサポート（`add-theme-support()`）の大半は`theme.json`ファイルに記述していく。<br>
- ※2: `templates/index.html`がないと**管理画面（ダッシュボード）関連のツールバーが表示されない**（＝ `wp_head`や`wp_footer`が呼び出されない）。<br>
- ※3: `<!-- wp: ～ /-->`ブロック要素と呼ばれるWordPressが独自開発する要素を軸に書き込んで（コーディングして）いく。<br>
  - 例: `<!-- wp:template-part {"slug": "header", "tagName": "header", "className": "", "classElements" } /-->`<br>`header.html`を"header"タグで呼び出し"classElements"というクラス名を付与
- **ブロックテーマでは従来の`xxxx.php`というテンプレートファイルを持っていない（持たない）**
  - `xxxx.php`のようなテンプレートファイルの代わりに`xxxx.html`がある。

| 項目名      | 内容                                                                                                               |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| $schema   | JSONで設定する項目に関する情報が格納されているURLです。必須ではありませんが、記載しているとVSCodeなどでコード補完や説明の表示ができるようになります。この記事では最新版を参照していますが、WordPressのバージョンを指定した記述（https://schemas.wp.org/wp/6.1/theme.json など）も可能です。 |
| version   | 必須。JSONの定義（設定できる項目や構成）のバージョン。WP6.1時点では2を設定します。バージョン1は互換性がありません（詳細はマイグレーションガイドをご覧ください）。                          |
| settings    | テーマに関する各種設定を記載します。                                                                                          |
| styles      | ルート要素や各ブロックに設定する値を記載します。                                                                                    |
| templateParts   | テンプレートパーツ（parts/配下）に関する情報を記載します。パーツ名や表示する領域（ヘッダー、フッターなど）を指定する場合などに使用します。                                            |
| customTemplates | テンプレート（templates/配下）に関する情報を記載します。WordPressで定義されているファイル名以外のテンプレートを作成した場合に、適用可能な投稿タイプを指定する際などに使用します（定義例）。          |
| patterns    | パターンディレクトリで公開されているパターンを、パターン一覧に登録するために使用します。                                                                    |

## カスタムテンプレート作成
- theme.json
```json
"customTemplates": [
  {
    "name": "page-home-block", //【name:記述必須】テンプレートファイル名（から拡張子を除いた部分）
    "title": "エディタで表示されるテンプレートのタイトル" //【title:記述必須】contact, about など。日本語でもok
  },
  {
    "name": "page-contact", // テンプレート編集モードを使うためには該当する値（`post-`または`page-`のいずれか）を必ず付ける
    "title": "お問合せ",
    "postType": [
      "page" // デフォルトは`page`
    ]
  }
]
```

## Styles
各要素へのスタイル指定を行う（インラインCSSで出力）
- プロパティと（指定する）階層によって適用が変わるので注意。
- `Styles`プロパティの直下（ルート）でスタイルを指定した場合は、サイト全体（body, editor-styles-wrapper）に適用される。
- `Styles`プロパティの直下以外（`blocks`, `elements`）では`Settings`プロパティの定義から自動生成される（CSSカスタムプロパティを値に使用するのが現実的）。
- `theme.json`でスタイル指定を設定した場合、CSSカスタムプロパティが生成されて該当しそうなプロパティ種類のクラスが自動生成される。

- `Styles`でも`Settings`同様（`styles.blocks`）`blocks`プロパティで特定のブロックにスタイル（設定）を行える（指定できる）。
```json
"blocks": {
  "core/heading": {
    "color": {
      "text": "blue"
    }
  }
}
```

- `styles.elements`では特定要素（`h1`~`h6`,`a`）に設定を行える。
```json
"styles": {
  "elements": {
    "h2": {
      "color": {
        "text": "blue"
      }
    }
  }
}
```

- `Settings.layout.contentSize`
  - コンテンツの最大幅... `contentSize`("contentSize": "850px")
- `Settings.layout.wideSize`
  - 特大コンテンツの最大幅... `wideSize`("wideSize": "900px")

1. `contentSize`を設定すると、エディター画面及びサイト表示で指定したスタイルがあたる（指定しないと幅広max{余白無しで}表示される）
2. エディター画面の[デフォルトレイアウトの継承]を ON にすると子ブロックに適用される

> [!TIP]
> Settings では設定プロパティの`slug`（ケバブケースで指定：kebab-case）で指定した文字列を基にCSSカスタムプロパティが自動生成される。<br>例：`--wp--preset--color--{slug}:{color};`

## Settings
カラーパレットやフォントサイズなどブロックエディターの機能関連をはじめ、`add-theme-support`関連の設定などまで担っている。

- `add-theme-support`による設定があって、しかも`theme.json`にもそれに相当する設定が記述されていた場合は`theme.json`の設定が優先される。
- 各ブロック側で指定する機能をサポートしていない場合`theme.json`を介しても有効化できない。
- `settings.blocks`プロパティを使えばブロック個別に設定を行える。
```json
{
  "$schema": "～",
  "version": 2,
  "settings": {
   "blocks": {
    "core/heading": {  // 見出しブロックの
      "color": {
        "background": false  // 背景の設定を無効にする
      }
    }
   }
  }
}
```

---

## 参照・参考
- Kiwi blog
  - [WordPressサイトエディター対応のブロックテーマ開発（基本編）](https://kiwi-dev.com/2022/11/27/wordpress-block-editor-basic/)
  - [WordPressサイトエディター対応のブロックテーマ開発（機能編）](https://kiwi-dev.com/2022/12/03/wordpress-block-editor-functions/)
  - [WordPressサイトエディター対応のブロックテーマ開発（theme.json編）](https://kiwi-dev.com/2022/12/05/wordpress-block-editor-json/)
- zenn
  - [【WordPress】ブロックテーマのテンプレート構造](https://zenn.dev/yggrit/articles/c9ab45f91c86cc)
  - [WordPressのブロックテーマつくるメモ](https://zenn.dev/chiilog/scraps/7ee31b4dd9d3e3)
  - [WordPressのブロックテーマとやらに入門してみる](https://zenn.dev/masa5714/scraps/973a8ab75f2c1f)
- [クラシックテーマ制作者の私がブロックテーマ制作で悩んだこと](https://www.cherrypieweb.com/5938#google_vignette)