---
title: フロントエンドを軸としたwebセキュリティ学習まとめ② | 〜オリジンとCORS〜
tags: JavaScript HTML Security 初心者向け 中級者向け
author: benjuwan
slide: false
---
これは、筆者の「2025振り返り用ひとりアドカレ」記事の一つです。

## はじめに
本記事は、フロントエンドに携わっている筆者がwebセキュリティを学習した際にメモ書きしていたものを体系的にまとめ直した内容です。
かなり長くなったので7記事のシリーズとして投稿していきます。

これまでの開発において、エスケープ処理やサニタイズ、アクセス制御などセキュリティを意識して行ってきましたが、そもそも「**どういった経緯で、どうなる（なってしまう）から、どのような対策が必要となるか**」を深く理解できていない自覚がありました。

そこで【フロントエンド開発のためのセキュリティ入門 知らなかったでは済まされない脆弱性対策の必須知識】をベースに生成AIも使いながらインプットしていきました。

https://www.shoeisha.co.jp/book/detail/9784798169477

もちろん今でもまだまだだと思っていますし、本記事は備忘録の側面が強いかもしれませんが、初学者をはじめ、筆者のように**セキュリティ対策の重要性は理解しているがどこか表層的な部分に留まっているかも**というような方々に少しでも役立つように書いていきたいと思います。

---

## シリーズ目次
- 第1回：Web通信の基礎知識
- **第2回：オリジンとCORS**（本記事）
- 第3回：サイドチャネル攻撃とSite Isolation
- 第4回：XSS（クロスサイトスクリプティング）
- 第5回：CSP（Content Security Policy）
- 第6回：CSRF、クリックジャッキング、その他の攻撃
- 第7回：認証・認可とセキュアな実装

---

## オリジンに関する事項
### オリジン（Origin）とは
異なるwebアプリケーション同士でアクセスを制限するための境界を指します。
基本的にオリジンは`スキーム（プロトコル）`、`ホスト名（ドメイン名）`、`ポート番号`で構成されています。
※ポート番号は見えていないことも多いです。

::: note info
#### オリジンの説明事例
```
https://example.com:443/about
```

- https://
スキーム（プロトコル）

- example.com
ホスト名（ドメイン名）

- :443
ポート番号
    - ポート番号例：
        - 80, 8080 | http://
        - 443 | https://
        - 21 | FTP
        - 3000, 5173, 5174 ... | localhost

- about
ページパス（ディレクトリ/フォルダ名）
:::

### 同一オリジンポリシー（Same-Origin Policy）
ブラウザに組み込まれているアクセス制限の仕組みです。

異なるwebアプリケーションとの間に境界（オリジン）を設けるブラウザの機能によって、開発者は特別な対策をしなくともwebアプリケーションからのアクセスを制限できます。

::: note warn
スキーム、ホスト、ポート番号の**いずれかが異なる場合はクロスオリジン（Cross-Origin）** となる
:::

**ブラウザはデフォルトで同一オリジンポリシーを有効**にしていて、以下のような**アクセスは制限**されます。

- JavaScript を使ったクロスオリジンへのリクエスト送信
- JavaScript を使った iframe内のクロスオリジンのページへのアクセス
- クロスオリジンの画像を読み込んだ <canvas> 要素のデータへのアクセス
- Web Storage や IndexDB に保存されたクロスオリジンのデータへのアクセス

※他にも制限される機能はいくつかあります。

#### JavaScript を使ったクロスオリジンへのリクエスト送信
`fetch API`や`XMLHttpRequest`を使ったクロスオリジンへのリクエストは制限されます。
具体的にはCORS（クロスオリジン・リソース・シェアリング）に関するエラーが表示されて、回避するにはCORSに則ったアプローチを採る必要があります。

回避例：リクエストヘッダを調整したり、サーバーサイドで許可サイト対象を調整したり

#### JavaScript を使った iframe内のクロスオリジンのページへのアクセス
Webアプリケーション内に iframeで埋め込んだクロスオリジンのページへのアクセスは制限されます。
ただし、`postMessage`関数を利用することでデータの送信元のオリジンをチェックできるためクロスオリジンでも安全にデータのやり取りが行えます。

#### クロスオリジンの画像を読み込んだ`<canvas>`要素のデータへのアクセス
クロスオリジンの画像を読み込んだ`<canvas>`要素は汚染された状態とみなされてデータの取得に失敗する。
この制限を回避するにはCORSが必要となります。

#### Web Storage や IndexDB に保存されたクロスオリジンのデータへのアクセス
Web Storage（localStorage, sessionStorage）や IndexDB といったブラウザの組み込みデータベース機能に保存されたデータも、同一オリジンポリシーによりアクセスを制限されています。

※ sessionStorage は、オリジン間のみならず新しく開いたタブやウィンドウ間のアクセスも制限する

つまり、ユーザーが罠サイトにアクセスしてしまっても**ブラウザに保存されたデータは同一オリジンからしかアクセスできないので罠サイトへ情報漏洩することはない**のです。

ただし、**以下の注意書きに留意**してください。

::: note alert
#### 1. XSSがあればアウト
同一オリジン内でスクリプトを実行できる脆弱性（XSS）がある場合、罠サイト経由でそのオリジンにスクリプトを注入し、保存データを盗み出される。

#### 2. クロスサイトスクリプトインクルージョン（XSSI）やJSONP的手法は関係なし
localStorageやIndexedDBは「DOM API」でしかアクセスできないため、`<script src>`などでは直接読み出せないものの、アプリがデータをサーバ経由で返す仕組みを持っていると、別経路から抜かれる可能性がある。

#### 3. ブラウザバグや拡張機能による漏洩
ごくまれにブラウザ実装の不具合や悪意ある拡張機能で読み出される例もある（安全設計では防ぎにくい）。
:::

#### 制限されないクロスオリジンアクセス事例（8例）
##### 1. `<script>` 要素によるクロスオリジン JavaScript 読み込み  
```html
<script src="https://cross-origin.com/app.js"></script>
```  
- JavaScriptファイルはCORS不要でロード可能（ただし実行されるのは読み込んだコード）。  

##### 2. `<img>` 要素によるクロスオリジン画像読み込み  
```html
<img src="https://cross-origin.com/image.png">
```  
- 表示は可能だが、`canvas` に描画してピクセル情報を読む場合は `crossorigin`属性やCORS対応が必要

##### 3. `<link rel="stylesheet">` によるクロスオリジンCSS読み込み  
```html
<link rel="stylesheet" href="https://cross-origin.com/style.css">
```  
- CSSはCORS不要で適用可能（ただし、`@import`内で画像やフォントを読み込むときに挙動が異なる場合あり）

##### 4. `@font-face` によるクロスオリジンWebフォント読み込み  
```css
@font-face {
    font-family: 'MyFont';
    src: url('https://cross-origin.com/font.woff2');
}
```  
- 多くのブラウザはフォントにCORS制約を課すが、古いブラウザや特定設定では制限されずに使えることがある

##### 5. `<video>` / `<audio>` によるクロスオリジンメディア読み込み  
```html
<video src="https://cross-origin.com/video.mp4" controls></video>
```  
- 再生は可能だが、フレーム取得や音声解析などのAPIアクセスはCORS必須

##### 6. `<iframe>` によるクロスオリジンページ埋め込み  
```html
<iframe src="https://cross-origin.com"></iframe>
```  
- 表示は可能だが、JavaScriptでDOMへアクセスは不可（同一オリジン制約は働く）

##### 7. `<object>` / `<embed>` / `<applet>` によるクロスオリジンリソース読み込み  
```html
<object data="https://cross-origin.com/file.pdf" type="application/pdf"></object>
```  
- 埋め込み表示はできるが、中身の直接操作は不可

##### 8. `<form>`要素によるフォーム送信  
```html
<form action="https://cross-origin.com/mail.php" method="post">
```  

---

ただし、これらのHTML要素からのアクセスも、 **`crossorigin`属性やCORS対応することでアクセス制御可能**となります。

### `CORS`（`Cross-Origin Resource Sharing`）
CORSとは**クロスオリジンへのリクエストを可能にしたり、サーバからアクセス許可が出ているリソースへはアクセスできるようにしたりする仕組み**を指します。

同一オリジンポリシーによって、自社管理の異なるドメイン（クロスオリジン）へのリクエスト送信、またはリクエスト受信すらも制限下に置かれてしまう状態になる。これでは自社の複数サービスを連携させるような開発・運用をはじめ、CDNを使ってJavaScriptやCSS、画像ファイルなどのリソース読み込みにも支障をきたしてしまうでしょう。

自社WebサービスやCDNなど**信頼できる接続先においてはクロスオリジンの制限を解除したい**のは当然で、**そのための回避策としてオリジンをまたいだネットワークアクセスを可能とするCORS**があります。

ただし気をつけたいのは、**CORSは同一オリジンポリシーを無条件に回避する仕組みではない**という点です。**サーバーが明示的に許可した場合にのみ、ブラウザが例外的に同一オリジンポリシーを緩和するための安全装置**です。

#### `CORS`の仕組み
`XMLHttpRequest`や`fetch`関数を使ってクロスオリジンへリクエストすることは同一オリジンポリシーによって禁止されている（※具体的には、クロスオリジンから受信したレスポンスのリソースへのアクセスが禁止）。

ただし、レスポンスに付与されている一連のHTTPヘッダによって、**サーバからアクセス許可が出ているリソースへはアクセス可能**となります。

この一連のHTTPヘッダに、アクセス許可するためのリクエスト条件が記載されていて、その条件を満たしたリクエストであればブラウザは受信したリソースへJavaScriptを使ってアクセスすることを認められます。

他方、満たさない場合はリクエスト及びリソースの取り扱いを禁止してレスポンスを破棄されます。

#### `crossorigin`属性
`<img>`や`<script>`要素などHTML要素から送信されるリクエストのモードは、同一オリジンに送信される場合は same-origin となり、クロスオリジンへ送信される場合は no-cors となる。これらHTML要素に`crossorigin`属性を付与することで、cors モードとしてリクエストできるようになる。

::: note alert
`type="module"`を指定したスクリプトは、`crossorigin`属性がなくとも自動的にCORSモードで読み込まれます。

例えば、Vite（Vite / React）のビルド成果物は`ES Modules`として出力されるので、クロスドメインにホスティングしたSPAを読み込みたい場合などは対象となります。

対応策としては以下になります。

##### JSファイルに対してCORSヘッダーを追加
- `Apache（.htaccessまたはhttpd.conf）`
```bash
<FilesMatch "\.(js|mjs)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>
```

- `Nginx`
```bash
location ~* \.(js|mjs)$ {
    add_header Access-Control-Allow-Origin *;
}
```

- `特定のディレクトリのみ許可する場合`
```bash
<Directory "/path/to/quiz-raj/dist">
    <FilesMatch "\.(js|mjs)$">
        Header set Access-Control-Allow-Origin "https://your-frontend-domain.com"
    </FilesMatch>
</Directory>
```

---

とはいえ、**サーバから許可されていない場合**は結局CORSになるので注意してください。
:::

- 以下は**CORSにおけるリクエストモードの種類（Fetch APIやブラウザが使用するリクエストモード）**
※**`crossorigin`属性の属性値に指定するものではない**ので注意
##### `same-origin`
クロスオリジンへのリクエストは送信されずエラーになる

##### `no-cors`
クロスオリジンへのリクエストは **「単純リクエスト（※）」** のみに制限される。**レスポンスの内容にJavaScriptからアクセスできない**。※レスポンスは`opaque response`（中身が一切読めない応答）として扱われ、成功・失敗すらJavaScriptから判別できません。
- ※単純リクエスト（Simple Request）
GETまたはPOSTによるブラウザがデフォルトで送信できるリクエストのことで、具体的には後述の`CORS-safelisted`とみなされたリクエストを指す
- `no-cors`モードが暗黙的に使われるのは `<img>`, `<script>` など一部のHTML要素経由の通信において

##### `cors`
CORSの設定がされていない、またはCORS違反となるリクエストが送信された時はエラーとなる。`fetch API`で`mode`引数を省略した際のデフォルト値

#### CORS-safelisted
`CORS-safelisted`とみなされたHTTPメソッドやHTTPヘッダのみが送信されるリクエストは、ブラウザがデフォルトで送信できる。

つまり、**`CORS-safelisted`以外のHTTPヘッダを許可する場合は、`Access-Control-Allow-Headers`を送信しなければ**なりません。

- example-Token-Header ヘッダを許可するコードをサーバ側の処理に追加
```js
.
..
if(req.method === "OPTIONS"){
  res.header("Access-Control-Allow-Headers", "example-Token-Header")
}
..
.
```

- リクエストを送信する処理
```js
const sendReq = async () => {
  await fetch("https://site.example/api-endpoint", {
    headers: {"example-Token-Header": "abc123def456"}
  });
}

sendReq();
```

##### CORS-safelisted method の一覧
- GET
- POST
- HEAD

##### CORS-safelisted request-header の一覧
- Accept
- Accept-Language
- Content-Language
- Content-Type
  - ※値が`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`のいずれか

---

- `Access-Control-Allow-Origin`
アクセス許可されたオリジンをブラウザに伝えるためのレスポンスヘッダ
```js
"Access-Control-Allow-Origin": "https://cross-origin.com"
```

※**複数のオリジンを指定することはできない**ものの、`*`を使うことで全てのオリジンからのアクセスを許可できる。
```js
// すべてのオリジンからのアクセスを許可
// ※あまりに危険なので本番環境では絶対に行わず開発フェーズに留める
"Access-Control-Allow-Origin": "*"
```

以下のような記述にすることで**複数のオリジンを指定できる**ようになる
```js
.
..

const allowLists = [
  "http://localhost",
  "https://example.site",
  "https://cross-origin.com"
];

..
.

{
  // Origin ヘッダが存在している かつ リクエスト許可するリスト内に 
  // Origin ヘッダの値が含まれているかチェック
  if(req.headers.origin && allowLists.includes(req.headers.origin)){
    res.header("Access-Control-Allow-Headers", "example-Token-Header");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
}

..
.
```

## さいごに
ここまで読んでいただき、ありがとうございました。

筆者の知識・経験不足から間違った点や、誤解を招きかねない表現がありましたらご教示・ご指摘いただけますとありがたい限りです。

