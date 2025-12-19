---
title: フロントエンドを軸としたwebセキュリティ学習まとめ⑥ | 〜CSRF、クリックジャッキング、その他の攻撃〜
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
- 第2回：オリジンとCORS
- 第3回：サイドチャネル攻撃とSite Isolation
- 第4回：XSS（クロスサイトスクリプティング）
- 第5回：CSP（Content Security Policy）
- **第6回：CSRF、クリックジャッキング、その他の攻撃**（本記事）
- 第7回：認証・認可とセキュアな実装

---

## CSRF（クロスサイトリクエストフォージェリ）
攻撃者の用意した**罠によってWebアプリケーションがもともと持っている機能（アカウント操作や投稿などログイン後の機能）がユーザーの意思に関係なく呼び出されてしまう攻撃**（アカウント乗っ取りのような）のことです。

XSSと違って、攻撃者が自由にスクリプトを動作（例：不正なリクエスト発行など）させるのは不可能。

ただし、Webアプリケーションが持つ機能に対して（ユーザー本人になりすまして）不正な操作（例：送金処理やアカウント削除、投稿など）を行うことが可能となる。

::: note info
- XSS（クロスサイトスクリプティング）
攻撃者が悪意のあるスクリプトコードを正規のWebサイトに注入し、そのサイトを閲覧する他のユーザーのブラウザで実行させる攻撃。
機密情報の漏洩、Webアプリケーションの改ざん、意図しない操作、なりすまし（ユーザーの機密情報の窃取）、セッションハイジャック、フィッシング攻撃のリスクが生じる。
:::

### 基本的な仕組み
1. ユーザーのセッション情報を攻撃者が詐取
2. それを使って、正規ユーザーになりすます形でリクエストを送信（不正な操作を実行）

#### 詐取から被害発生までの事例フロー
##### 1. ユーザーが正規サイトにログインし、ブラウザにセッションCookieが保存される

##### 2. 攻撃者は、被害者に「攻撃用ページ」を踏ませる（罠サイト・メール・SNSなど）

##### 3. 罠ページには、被害者のブラウザから自動的に正規サイトへリクエストを送らせる仕組みが仕込まれている
- `<form>`要素から送信される内容は同一オリジンポリシーの制限を受けないため
    - 正規サイトのCookieがブラウザに保存されている場合は、それに準じてユーザーを誤認して処理を進めてしまう

::: note info
- **同一オリジンポリシー**

ブラウザに組み込まれているアクセス制限の仕組みです。

異なるwebアプリケーションとの間に境界（オリジン）を設けるブラウザの機能によって、開発者は特別な対策をしなくともwebアプリケーションからのアクセスを制限できます。

ブラウザはデフォルトで同一オリジンポリシーを有効にしていて、以下のようなアクセスは制限されます。

- JavaScript を使ったクロスオリジンへのリクエスト送信
- JavaScript を使った iframe内のクロスオリジンのページへのアクセス
- クロスオリジンの画像を読み込んだ 要素のデータへのアクセス
- Web Storage や IndexDB に保存されたクロスオリジンのデータへのアクセス

※他にも制限される機能はいくつかあります
※クロスオリジン：スキーム、ホスト、ポート番号のいずれかが異なる場合はクロスオリジン（Cross-Origin） となります
:::

##### 4. ブラウザは「正規サイト宛の通信」であるため、**セッションCookieを自動的に付与してしまう**
- ページ遷移時やフォーム送信時といったリクエスト処理時に、**ブラウザはCookieを自動的にサーバへ送信**する。この働きにより元来ステートレスなHTTPが状態（ログイン有無やカートの中身などの情報）維持できるようになる

##### 5. サーバはそれを「ログイン済みユーザーの正規操作」と誤認し、処理を実行してしまう

※CSRFでは、攻撃者がセッションIDそのものを盗み見る必要はありません。
「被害者のブラウザに、勝手にCookie付きリクエストを送らせる」だけで成立します。

### CSRFへの対策方法
#### トークン発行
罠サイトからの不正なリクエストなのか、Webアプリケーションからの正規のリクエストなのかを**サーバ内で検証するのが最も重要な対策**となります。
この要点を抑えるのが「トークン（乱数・一意な固有の文字列）発行」という対策方法です。

##### トークン発行による防御の仕組み
###### 1. ページアクセスのリクエストを受け取ったサーバは、**ランダムな文字列（トークン）を生成してセッションごとにサーバ内に保管**し、そのトークンをHTMLに埋め込む

なお、トークンは以下のいずれかの方法で実装する：
※いずれも攻撃者がトークンを推測できないよう、暗号学的に安全な乱数生成が必須

- セッションごとに異なるランダム値を生成し、サーバー側で検証
- リクエストごとに異なるトークン（ワンタイムトークン）を発行

```html
<form action="/transfer" method="POST">
  <!-- トークンはユーザーにとって見える必要のない情報なので hidden で非表示にしておくこと -->
  <input type="hidden" name="csrfToken" value="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6">

  <input type="text" name="to" value="john@example.com">
  <input type="number" name="amount" value="1000">
  <button type="submit">送金</button>
</form>
```

###### 2. フォーム送信時に、CSRF対策用のトークンも一緒に送信させる
```bash
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: sessionid=xyz789abc123; JSESSIONID=AB12CD34EF56
Content-Type: application/x-www-form-urlencoded
Content-Length: 89

csrfToken=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6&to=john%40example.com&amount=1000
```

###### 3. サーバは受け取ったトークンと、セッションごとに保管したトークンとが一致するか検証し、一致しなかった場合は不正なリクエストとして処理する

攻撃者はセッションごとに変化するトークンを知ることができないので、サーバ内の各セッションに紐づいたトークンと同じ値を送ることは不可能となる。

多くのフレームワークが「ワンタイムトークン」の発行を自動で行ってくれるので、それら実績のあるフレームワーク（例：Django, Ruby on Rails, Laravel）やライブラリ（例：Axios, Auth.js：旧NextAuth.js）を使用するのが無難。

※ Auth.js は Better Auth に引き継がれたようです

https://zenn.dev/stellarcreate/articles/20251129-better-auth-authjs-successor

#### Double Submit Cookie（二重送信クッキー）
先ほど、トークン発行の対策方法では「サーバ内でセッションごとにトークンを保管するアプローチ」と説明したが、ブラウザのCookieにトークンを保持させる方法もあります。

::: note warn
`Double Submit Cookie`には、XSSのリスクがある他、サブドメイン攻撃に対して弱い部分があるので**サーバーサイドでのトークン検証を優先し、補助的な対策として使用する**のが賢明だと思います。
:::

##### 二重送信クッキーによる防御の仕組み
###### 1. サーバがトークンを生成

###### 2. そのトークンをCookieに設定
- ※セッション用のCookieとはまた別物
- ※正規ページからのログイン時に、セッション用Cookieに加えて、CSRF対策用のトークンを持った**HttpOnly属性の付いていないCookieを発行**する
    - ※ただし、HttpOnly属性が付いていないので（JavaScriptからCookieにアクセス可能となって）**XSSのリスク**が高まる

###### 3. 同じトークンをフォーム（またはリクエストヘッダ）にも含める
- ブラウザのJavaScriptを使ってCookie内のトークンを取り出し、フォームデータと共にCookieもサーバに送信する
    - ※ドメインが異なるページのCookieにはアクセスできないようブラウザが制御しているので、正規ユーザーが罠サイトを踏んでも罠サイト側でCookieを詐取するのは不可能

###### 4. サーバはCookieのトークンとリクエスト内のトークンが一致するかチェック
- 一致しない場合は不正なリクエストとしてエラー処理


::: note alert
- `Double Submit Cookie`の重大な制限
1. サブドメイン攻撃に脆弱
    - 攻撃者が`evil.example.com`を制御できる場合、`.example.com`ドメインにCookieを設定可能
2. XSS脆弱性がある場合、完全に無効化される
    - HttpOnly属性がないため、攻撃者がトークンを読み取り可能
        - 対応方法: サーバーサイドでのトークン検証を優先し、`Double Submit Cookie`は補助的な対策として使用する

```js
// CSRFトークンをCookieとヘッダ両方で送信
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfTokenFromCookie(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```
:::

##### 二重送信クッキーのユースケース
###### APIサーバとフロントエンド用のサーバが分かれているような場合
リクエストを受ける側のサーバー（APIサーバー）では（フロントエンド用のサーバーが発行した）トークンを持っていないので、フロントエンド用のサーバーが生成したトークンをAPIサーバーに保存したいケースにおいて二重送信クッキーは有効な手となる。

###### Originヘッダを利用したCSRF対策
上記ケースの場合は、APIサーバー内でOriginヘッダを検証することで、許可していないオリジンからのリクエストを拒否できるため、Originヘッダを利用してCSRF対策を取ることもできる。
※Originヘッダはリクエスト送信元オリジンの文字列を値として持っていて、リクエスト時にブラウザに自動的に付与される

- コード例
```js
// APIサーバー側でのOriginヘッダを利用したCSRF対策

const corsOptions = {
  // 許可するオリジンを限定(ここでOriginヘッダを検証)
  origin: ['https://myapp.example.com'],
  
  // クッキーを含むリクエストを許可
  credentials: true,
  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization']
};

app.use(cors(corsOptions));
```

#### SameSite Cookie
プライバシー保護の観点から考案された SameSite Cookie というものがあります。

これを応用して Cookieの送信を同一サイト（SameSite）に制限することでCSRF対策とする方法もあります。
なお、同一サイト（SameSite）とはeTLD+1 が同一のURLを指します。

::: note info
- eTLD（トップレベルドメイン）
.com, .jp, .co.jp といったドメインを含む
:::

---

CSRFとは、つまるところ**攻撃者が罠サイト経由で正規ユーザーのセッション（に紐づくCookie）を詐取し、それを利用される（正規ユーザーになりすます）形で不正なリクエストが行われてしまう**という攻撃です。

そのため、ログイン済みのセッション情報を保管しているCookieさえ送信しなければ多くのCSRF攻撃を防御できます。

#### SameSite Cookie による防御の仕組み
`Set-Cookie`ヘッダでCookieをセットする際に`SameSite`属性を指定する。

```bash
Set-Cookie: sessionid=abc123; SameSite=Strict; Secure; HttpOnly
```

##### `SameSite`属性に指定できる値
###### `Strict`
クロスサイトから送信するリクエストにはCookieを付与しない
  - ※他のWebアプリケーションのリンクから遷移した際にもCookieを送信しない設定のため、一度ログインしていたとしても未ログイン状態となる

###### `Lax`
デフォルト値。URLが変わるような画面遷移かつGETメソッドを使ったリクエストであれば、クロスサイトでもCookieを送る。なお、開発者が`SameSite`属性を指定していない場合 Chrome や Edge などでは`Lax`を指定する。
  - ※他の方法（例：GETメソッド以外のリクエストや`fetch`関数などを用いたJavaScriptから送信されるリクエスト）を使ったクロスサイトからのリクエストには**Cookieを付与しないのでCSRF対策**となる

###### `None`
サイトに関係なく、すべてのリクエストでCookieを送信する

- SameSite 属性を指定しない場合、現在の Chrome や Edge などの主要ブラウザでは即座に`Lax`として扱われる
    - かつては一時的な緩和措置として「Cookie 発行後 約2分間は`Lax`が適用されない」仕様が存在したが、**現在はすでに廃止**されている
- セキュリティ設計としては `SameSite` を明示的に指定すること自体が重要であり、省略に依存する設計は推奨されない
- `SameSite = None; Secure`をセットで指定した場合のみ、すべてのクロスサイトからのリクエストでもCookieが送信される
    - `Secure`フラグのみの場合、httpsでのみcookieが送信される

#### CORSを活用
CORSのプリフライトリクエストを利用する形でCSRF対策を取ることも可能です。
しかし、プリフライトリクエストの送信によってリクエスト回数が増えるのでパフォーマンス面で良くない影響があるため、最終手段として念頭に置く程度でも良いでしょう。

::: note info
- プリフライトリクエスト
事前にリクエスト内容をサーバに検証してもらってから実際に通信を行うという安全なリクエスト方法
:::

<details>
<summary>フロントエンドとバックエンドでの実装例</summary>

- `'X-Requested-With': 'XMLHttpRequest'`のような任意のヘッダを付与して意図的にプリフライトリクエストを発生させる

```js
// 正当なフロントエンドからのリクエスト（プリフライトが発生）
async function apiRequest() {
  const response = await fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'  // カスタムヘッダでプリフライトを強制
    },
    credentials: 'include',  // クッキーを含める
    body: JSON.stringify({ data: 'value' })
  });
  
  return response.json();
}
```

- サーバー側（`Node.js`/`Express`）でプリフライトリクエストを検証
```js
const express = require('express');
const cors = require('cors');
const app = express();

// CORS設定
const corsOptions = {
  origin: ['https://myapp.example.com'],  // 許可するオリジンを限定
  credentials: true,  // クッキーを許可
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// プリフライトリクエストの確認ミドルウェア
app.use('/api', (req, res, next) => {
  const hasCustomHeader = req.headers['x-requested-with'];
  const hasJsonContentType = req.headers['content-type'] === 'application/json';
  const isComplexMethod = !['GET', 'HEAD', 'POST'].includes(req.method);
  
  // プリフライトが発生する条件
  const isPreflightRequired = hasCustomHeader || hasJsonContentType || isComplexMethod;
  
  if (!isPreflightRequired) {
    // プリフライトが発生しない簡単なリクエストは拒否
    return res.status(403).json({ error: 'Invalid request type' });
  }
  
  next();
});

// API エンドポイント
app.post('/api/data', (req, res) => {
  res.json({ message: 'Success', data: req.body });
});
```

</details>

## クリックジャッキング（ClickJacking）
クリックジャッキングは、ユーザーの意図とは異なるボタンやリンクをなどをクリックさせることで、意図しない処理を実行させる攻撃を指します。

具体的には、**正規ページの上に全く同じサイズの透過背景（別レイヤー層）のコンテンツを敷いて、正規ページのCTAボタンなどをクリックすると、透過背景の悪意あるコードが仕込まれたボタンをクリックした**ことになってしまうような現象。

### クリックジャッキングの仕組み
1. 攻撃者は正規サイトを iframe で読み込み、その上に透明レイヤーや別の要素を配置する
2. ユーザーは正規サイトのボタンを押しているつもりだが、実際には攻撃者の意図したリンクやボタンを押してしまう
3. これにより不正送金、アカウント設定変更、SNSシェアなどの強制操作が行われる

### クリックジャッキングの対策方法

#### X-Frame-Options ヘッダ
`X-Frame-Options`ヘッダを付与されたページは iframe などフレーム内へのページ埋め込みが制限される。

- `X-Frame-Options: DENY`
全てのオリジンに対してフレーム内への埋め込みを禁止

- `X-Frame-Options: SAMEORIGIN`
同一オリジンからのみフレーム内への埋め込みを許可（クロスオリジンからは禁止）

- `X-Frame-Options: ALLOW-FROM uri`（※不安定なので使用時は慎重に）
`ALLOW-FROM`の後に続く`uri`の箇所に指定したオリジンに対してフレーム内への埋め込みを許可する。`uri`の部分には`https://example.com`のようなURIを指定する。
  - ※`ALLOW-FROM`をサポートしていないブラウザや、 **この機能自体にバグがあったり**するので、オリジンを指定したい場合はCSPの`frame-ancestors`ディレクティブを利用するのが無難

#### CSPの`frame-ancestors`ディレクティブ
`X-Frame-Options`同様に、フレーム内へのページ埋め込みを制限する。

- `Content-Security-Policy: frame-ancestors 'none'`
`X-Frame-Options: DENY`と同じ。全てのオリジンに対してフレーム内への埋め込みを禁止する。

- `Content-Security-Policy: frame-ancestors 'self'`
`X-Frame-Options: SAMEORIGIN`と同じ。同一オリジンからのみフレーム内への埋め込みを許可（クロスオリジンからは禁止）

- `Content-Security-Policy: frame-ancestors uri`
`X-Frame-Options: ALLOW-FROM uri`と同じ。`ALLOW-FROM`の後に続く`uri`の箇所に指定したオリジンに対してフレーム内への埋め込みを許可する。 `uri`の部分には`https://example.com`のようなURIを指定する。

::: note info
`frame-ancestors example.com`のようにスキーム（プロトコル）を指定しない方法をはじめ、`frame-ancestors https://*.example.com`のようにワイルドカード（`*`）を使用して文字列の部分一致を指定する方法もある。
また、`frame-ancestors 'self' https://*.example.com https://site.example `のように複数指定することも可能。
:::

## クリックフィックス（ClickFix）
ウェブページに偽の警告画面や偽CAPTCHAなどを表示し、その解決策として**不正な操作方法を提示**することで、**ユーザー自身にPCを操作させてマルウェアをダウンロードさせる**攻撃手法です。
Windowsに標準搭載されているPowershellやコマンドプロンプトなどを悪用します。

### クリックフィックスの事例紹介
1. 機械的なアクセスでないことを証明させる **「偽CAPTCHA画面」が表示** される
2. 証明の方法として`［Windows］＋［R］`キーでWindowsの「ファイル名を指定して実行」を表示し、`［Ctrl］＋［V］`キーを押して［Enter］キーを押すように、と指示される
3. 手順を表示するために**画面をクリックしたときクリップボードに悪意のあるコマンドの文字列がコピー**される
4. 操作が何を行うものか理解せず、促されるままに操作してしまったユーザーは、マルウェアを自分でインストールしてしまうことになる

### クリックフィックスの対策方法
アドレスバーに記載されたアドレスが怪しい形態でないかを確認するとともに、いつもと異なる証明方法（特定ファイルの実行や貼り付け作業など）の場合は処理を進めない

## オープンリダイレクト
オープンリダイレクトとは、Webアプリケーション内にあるリダイレクト機能を利用して罠サイトなど攻撃者の用意したページへ強制遷移させる攻撃を指します。
フィッシングサイトや悪意あるスクリプトが埋め込まれたページへリダイレクトさせられて、ユーザーの機密情報が盗まれるというリスクがあります。

**ユーザーは正規のリンク先にアクセスしたつもりでも、知らぬ間に罠サイトへ遷移してしまっている**のがオープンリダイレクトの特徴。

### オープンリダイレクトの仕組み
多くのWebアプリケーションには、ログイン後や処理完了後に特定ページへ遷移させる「リダイレクト機能」が存在します。
このとき、遷移先のURLをクエリパラメータとして外部から受け取る仕組みになっていると、攻撃者が意図的に改ざんしたURLをユーザーに踏ませて次のような流れで攻撃が成立してしまいます。

#### 1. 攻撃者が正規ドメインを利用して、リダイレクト先パラメータを細工したURLを作成する
```
https://example.com/redirect?next=https://evil.com
```

#### 2. ユーザーは「example.com」の正規ドメインであるため安心してアクセスする

#### 3. 結果、サーバが外部入力された `https://evil.com` をそのまま使用してリダイレクト処理を行う

#### 4. 最終的に、ユーザーは攻撃者の用意した**罠サイトに意図せず遷移**してしまう

### オープンリダイレクトの対策方法
#### URL検査（ホワイトリスト方式）
オープンリダイレクトの主な原因は、外部からパラメータに指定されたURLをそのままリダイレクト処理に使ってしまうことにある。
対策としては、外部入力されたURLを**事前に検証**し、以下を確認する必要があります。

- リダイレクトが許可された特定のドメインまたはパスに該当するか
- それ以外の場合はリダイレクトを拒否、もしくはデフォルトの安全なページに遷移させる

```js
const express = require("express");
const app = express();

// 許可するドメインのホワイトリスト
const allowedHosts = ["example.com", "trusted.com"];

app.get("/redirect", (req, res) => {
  const nextUrl = req.query.next || "";

  try {
    // URLをパース（絶対URL・相対URLどちらも処理可能）
    const url = new URL(nextUrl, "http://example.com");

    // 条件1: 相対パスの場合 → OK
    if (url.origin === "http://example.com") {
      return res.redirect(url.pathname);
    }

    // 条件2: プロトコルの検証
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return res.redirect("/");
    }

    // 条件3: 許可された外部ドメインの場合 → OK
    if (allowedHosts.includes(url.hostname)) {
      return res.redirect(url.href);
    }

    // それ以外は拒否 → デフォルトページへ
    return res.redirect("/");

  } catch (e) {
    // パースに失敗した場合も安全に処理
    return res.redirect("/");
  }
});

app.get("/home", (req, res) => {
  res.send("This is a safe home page");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

クライアントサイドのJavaScriptだけで制御しても完全な防御にはならない（※攻撃者は直接サーバにリクエストを投げられるため）ので、実際には上記のようにサーバーサイドで検証することが推奨されています。

クライアントサイドでのみバリデーションせずにサーバーサイドでも実施するというのは他のことでも当てはまりますね。

## さいごに
ここまで読んでいただき、ありがとうございました。

筆者の知識・経験不足から間違った点や、誤解を招きかねない表現がありましたらご教示・ご指摘いただけますとありがたい限りです。

