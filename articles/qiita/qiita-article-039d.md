---
title: フロントエンドを軸としたwebセキュリティ学習まとめ④ | 〜XSS（クロスサイトスクリプティング）〜
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
- **第4回：XSS（クロスサイトスクリプティング）**（本記事）
- 第5回：CSP（Content Security Policy）
- 第6回：CSRF、クリックジャッキング、その他の攻撃
- 第7回：認証・認可とセキュアな実装

---

本記事では、フロントエンドで最も注意すべき攻撃の一つであるクロスサイトスクリプティングを挙げていきます。
書籍でもこの部分に紙幅が費やされていたことからも重要性が感じ取れます。

## クロスサイトスクリプティング（XSS：Cross-Site Scripting）
Webアプリケーションの脆弱性を悪用した攻撃手法の一つです。

XSSは、**攻撃者が悪意のあるスクリプトコードを正規のWebサイトに注入し、そのサイトを閲覧する他のユーザーのブラウザで実行させる攻撃**を指します。

クロスオリジンのページで実行される JavaScript からの攻撃は同一オリジンポリシーでブロックされるが、XSSは**攻撃対象のページ内でJavaScriptを実行するため同一オリジンポリシーでも防げない**のです。

::: note info
- 同一オリジンポリシー
ブラウザに組み込まれているアクセス制限の仕組みです。
異なるwebアプリケーションとの間に境界（オリジン）を設けるブラウザの機能によって、開発者は特別な対策をしなくともwebアプリケーションからのアクセスを制限できます。
:::

この攻撃により、**機密情報の漏洩、Webアプリケーションの改ざん、意図しない操作、なりすまし（ユーザーの機密情報の窃取）、セッションハイジャック、フィッシング攻撃などが可能**となってしまいます。

### 基本的な仕組み
XSS攻撃は以下の流れで実行される：

#### 1. 脆弱性の発見
攻撃者がWebアプリケーションでユーザー入力を適切にサニタイズ（無害化）していない箇所を見つける

#### 2. スクリプト注入
攻撃者が悪意のあるJavaScriptコードを含む入力をWebサイトに送信する

#### 3. コード実行
他のユーザーがそのページを閲覧した際に、注入されたスクリプトがユーザーのブラウザで実行される

#### 4. 被害発生
実行されたスクリプトにより、Cookieの窃取、個人情報の取得、不正な操作などが行われる

### 主な種類
#### 反射型XSS（Reflected XSS）
攻撃コードがリクエストの一部として送信され、レスポンスに即時反映される形式です。
- 例：罠サイトへアクセスして攻撃ページへ遷移させられたユーザが、攻撃ページを閲覧した際にそのブラウザ上で攻撃コードが実行される

#### 蓄積型・格納型XSS（Stored XSS）
攻撃コードがサーバのデータベースに保存され、そのデータが表示される度に実行される形式です。掲示板やコメント機能で発生しやすいです。
- 例：悪意のあるコードを含んだ画像データが投稿され、それを閲覧した不特定多数のユーザーがXSSの被害を受けるという攻撃

#### DOM型XSS（DOM-based XSS）
これまでとは異なり、クライアント側の JavaScript による`DOM`（Document Object Model）操作が原因で発生する形式です。

#### フロントエンドに密接な DOM型XSS の仕組み
##### Source（ソース）
DOM-based XSSを引き起こす原因となる箇所（入口）

- location.href, location.search, location.hash
- document.referrer
- document.cookie
- document.URL
- window.name
- localStorage, sessionStorage, IndexDB
- postMessage

##### Sink（シンク）
ソースからJavaScriptを生成・実行してしまう箇所（出口）

- innerHTML, outerHTML
- document.write(), document.writeln() （※現状非推奨）
- insertAdjacentHTML()
- $.html() （※ jQuery を使用している場合）
- eval()
- setTimeout()
- setInterval()
- element.src への代入
- location.href への代入

::: note info
結局、DOM型XSSの予防策としては極力これら「シンク」となる機能を使わないのに限ります。
:::

#### 対策
##### 1. サニタイズなどのエスケープ処理
例えば、`<a>`の`href`属性の値で、`javaScript:`に続いて指定された任意のJavaScript（例：`javaScript:evilAttack(1)`）は`<a>`がクリックされると実行されてしまう。
**ユーザー操作によるリンク生成機能を用意する場合は注意**が必要です。

##### 2. HTTPOnlyフラグ付きCookie
HTTPOnlyフラグ付きCookieを用いることで**JavaScriptからのアクセスを制御**できます。セッションハイジャック対策にもなるでしょう。

- サーバサイドでCookieを発行する際にHTTPOnly属性を付与することでCookie（に格納しているセッションIDなど）の漏洩リスクを軽減する
```js
// NG例
Set-Cookie: SESSIONID=abcdef123456

document.cookie; // 'SESSIONID=abcdef123456'が返ってくる

// OK例
Set-Cookie: SESSIONID=abcdef123456; HTTPOnly
document.cookie; // ''（空文字）が返ってくる
```

##### 3. `CSP`（Content Security Policy）
サーバから許可されていない JavaScript の実行やリソース読み込みなどをブロックするブラウザ標準の機能を活用する。ほとんどのブラウザがサポート済みです。

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

`CSP`は情報量が多いので次回の記事で書いていきたいと思います。

---

個人的に最も賢明な対策方法は、**XSS対策を自動で行ってくれるようなライブラリ（React, Vue）やフレームワーク（Next.js Nuxt）を使用**することだと思います。

::: note alert
※ただし、`dangerouslySetInnerHTML`（React）や`v-html`（Vue）を使用する場合はライブラリ・フレームワークの守備範囲から外れるので注意が必要です。
:::

自前実装する場合は、パース系のライブラリ（例：[`html-react-parser`](https://www.npmjs.com/package/html-react-parser), [`DOMPurify`](https://github.com/cure53/DOMPurify)）を用いたり、[`Sanitizer API`](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)（HTMLコンテンツのサニタイズを行うWeb標準API）を用いたりして安全に実装する必要があります。

::: note warn
補足ですが、Sanitizer API は現状実装や開発は止まっているようです
:::

https://www.mitsue.co.jp/knowledge/blog/frontend/202407/04_0815.html

https://developer.chrome.com/blog/sanitizer-api-deprecation?hl=ja

## さいごに
ここまで読んでいただき、ありがとうございました。

筆者の知識・経験不足から間違った点や、誤解を招きかねない表現がありましたらご教示・ご指摘いただけますとありがたい限りです。

