# frontend-dev-security
[フロントエンド開発のためのセキュリティ入門 知らなかったでは済まされない脆弱性対策の必須知識](https://www.shoeisha.co.jp/book/detail/9784798169477)に関する備忘録。<br>生成AIを用いた学習ドキュメントで、書籍記載以外の情報も書き残しています。

## 目次
### 1. [前提として](#前提として)
- [機能要件・非機能要件](#機能要件非機能要件)
  - [機能要件](#機能要件)
  - [非機能要件](#非機能要件)
  - [非機能要求の6つのカテゴリ](#非機能要求の6つのカテゴリ)

### 2. [TCP/IP](#tcpip)
- [TCP/IPの4つのレイヤーとその役割・代表的なプロトコル](#tcpipの4つのレイヤーとその役割代表的なプロトコル)
  - [アプリケーション層：レイヤー4](#アプリケーション層レイヤー4最上位)
  - [トランスポート層：レイヤー3](#トランスポート層レイヤー3)
  - [インターネット層：レイヤー2](#インターネット層レイヤー2)
  - [ネットワークインターフェース（データリンク）層：レイヤー1](#ネットワークインターフェースデータリンク層レイヤー1最下位)
- [実際の通信フロー例](#実際の通信フロー例)

### 3. [HTTPメッセージ](#httpメッセージ)
- [HTTPメッセージの形式](#httpメッセージの形式)
- [HTTPリクエスト](#httpリクエスト)
  - [プリフライトリクエスト](#プリフライトリクエスト)
  - [代表的なリクエストヘッダ](#代表的なリクエストヘッダ)
- [HTTPレスポンス](#httpレスポンス)
  - [代表的なレスポンスヘッダ](#代表的なレスポンスヘッダ)
  - [セッション](#セッション)
  - [クッキー](#クッキー)
  - [キャッシュ](#キャッシュ)
  - [HTTPメソッド](#httpメソッド)
- [代表的なエンティティヘッダ](#代表的なエンティティヘッダ)

### 4. [HTTPSの仕組み](#httpsの仕組み)
- [TLS（Transport Layer Security）](#tlstransport-layer-security)
  - [TLSによる通信データの暗号化](#tlsによる-通信データの暗号化)
  - [TLSによる通信相手の検証](#tlsによる-通信相手の検証)
  - [TLSによる通信データの改ざんチェック](#tlsによる-通信データの改ざんチェック)
- [HTTPS通信でないと処理できない内容（Secure Context）](#https通信でないと処理できない内容secure-context)
- [Mixed Contentの危険性](#mixed-contentの危険性)

### 5. [オリジンに関する事項](#オリジンに関する事項)
- [同一オリジンポリシー（Same-Origin Policy）](#同一オリジンポリシーsama-origin-policy)
  - [JavaScriptを使ったクロスオリジンへのリクエスト送信](#javascriptを使ったクロスオリジンへのリクエスト送信)
  - [JavaScriptを使ったiframe内のクロスオリジンのページへのアクセス](#javascriptを使ったiframe内のクロスオリジンのページへのアクセス)
  - [クロスオリジンの画像を読み込んだcanvas要素のデータへのアクセス](#クロスオリジンの画像を読み込んだ-canvas-要素のデータへのアクセス)
  - [Web StorageやIndexDBに保存されたクロスオリジンのデータへのアクセス](#web-storageやindexdbに保存されたクロスオリジンのデータへのアクセス)
  - [制限されないクロスオリジンアクセス事例（8例）](#制限されないクロスオリジンアクセス事例8例)
- [CORS（Cross-Origin Resource Sharing）](#corscross-origin-resource-sharing)
  - [CORSの仕組み](#corsの仕組み)
  - [crossorigin属性](#crossorigin属性)
  - [JSファイルに対してCORSヘッダーを追加](#jsファイルに対してcorsヘッダーを追加)
  - [crossorigin属性とfetch APIのcredentialsとの対応関係比較](#crossorigin属性とfetch-apiのcredentialsとの対応関係比較)
- [CORS-safelisted](#cors-safelisted)
  - [CORS-safelisted methodの一覧](#cors-safelisted-methodの一覧)
  - [CORS-safelisted request-headerの一覧](#cors-safelisted-request-headerの一覧)

### 6. [サイドチャネル攻撃](#サイドチャネル攻撃)
- [サイドチャネル攻撃を防ぐSite Isolation](#サイドチャネル攻撃を防ぐ-site-isolation)
  - [Site Isolationによって制限されてしまった機能の有効化](#site-isolationによって制限されてしまった機能の有効化)
  - [CORP, COEP, COOP](#corp-coep-coop)

### 7. [クロスサイトスクリプティング（XSS）](#クロスサイトスクリプティングxsscross-site-scripting)
- [基本的な仕組み](#基本的な仕組み)
- [主な種類](#主な種類)
  - [反射型XSS（Reflected XSS）](#主な種類)
  - [蓄積型・格納型XSS（Stored XSS）](#主な種類)
  - [DOM型XSS（DOM-based XSS）](#主な種類)
- [フロントエンドに密接なDOM型XSSの仕組み](#フロントエンドに密接な-dom型xss-の仕組み)
  - [Source（ソース）](#sourceソースdom-based-xssを引き起こす原因となる箇所入口)
  - [Sink（シンク）](#sinkシンクソースからjavascriptを生成実行してしまう箇所出口)
- [対策](#対策)

### 8. [CSP（Content Security Policy）](#cspcontent-security-policy)
- [CSPの設定方法](#cspの設定方法httpヘッダ-またはmeta要素に設定)
- [ディレクティブ（ポリシーディレクティブ）](#ディレクティブポリシーディレクティブ)
  - [CSPの代表的なディレクティブ一覧](#cspの代表的なディレクティブ一覧)
  - [CSPに指定できるソースのキーワード](#cspに指定できるソースのキーワード)
- [Strict CSP](#strict-csp)
  - [nonce-source](#nonce-source)
  - [hash-source](#hash-source)
- [Trusted Type](#trusted-type)
  - [制限対象となるDOM API](#制限対象となるdom-api)
  - [型の種類](#型の種類)
- [Report-Onlyモード](#report-only-モード)
  - [段階的なCSP導入ロードマップ](#段階的なcsp導入ロードマップ)
  - [Report-Onlyモードの概要](#report-only-モードの概要)

### 9. [CSRF（クロスサイトリクエストフォージェリ）](#csrfクロスサイトリクエストフォージェリ)
- [基本的な仕組み](#基本的な仕組み-1)
- [詐取から被害発生までの事例フロー](#詐取から被害発生までの事例フロー)
- [CSRFへの対策方法](#csrfへの対策方法)
  - [トークン発行](#トークン発行)
  - [トークン発行による防御の仕組み](#トークン発行による防御の仕組み)
  - [Double Submit Cookie（二重送信クッキー）](#double-submit-cookie二重送信クッキー)
  - [二重送信クッキーによる防御の仕組み](#二重送信クッキーによる防御の仕組み)
  - [二重送信クッキーのユースケース](#二重送信クッキーのユースケース)
  - [SameSite Cookie](#samesite-cookie)
  - [SameSite Cookieによる防御の仕組み](#samesite-cookieによる防御の仕組み)
  - [SameSite属性に指定できる値](#samesite属性に指定できる値)
  - [CORSを活用](#corsを活用)

### 10. [クリックジャッキング（ClickJacking）](#クリックジャッキングclickjacking)
- [クリックジャッキングの仕組み](#クリックジャッキングの仕組み)
- [クリックジャッキングの対策方法](#クリックジャッキングの対策方法)
  - [X-Frame-Optionsヘッダ](#x-frame-options-ヘッダ)
  - [CSPのframe-ancestorsディレクティブ](#cspのframe-ancestorsディレクティブ)

### 11. [クリックフィックス（ClickFix）](#クリックフィックスclickfix)
- [クリックフィックスの事例紹介](#クリックフィックスの事例紹介)
- [クリックフィックスの対策方法](#クリックフィックスの対策方法)

### 12. [オープンリダイレクト](#オープンリダイレクト)
- [オープンリダイレクトの仕組み](#オープンリダイレクトの仕組み)
- [オープンリダイレクトの対策方法](#オープンリダイレクトの対策方法)
  - [URL検査（ホワイトリスト方式）](#url検査ホワイトリスト方式)

### 13. [認証・認可](#認証認可)
- [Authentication：認証（あなたは誰？）](#authentication-認証あなたは誰)
  - [認証の種類](#認証の種類)
  - [古くからあるパスワード認証に対する攻撃](#古くからあるパスワード認証に対する攻撃)
- [Authorization：認可（どのような権限を持っている？）](#authorization-認可どのような権限を持っている)
- [ログイン情報の漏洩に注意する](#ログイン情報の漏洩に注意する)
  - [ユーザー情報を入力するページにおいて、Web解析ツールの導入は慎重に](#ユーザー情報を入力するページにおいてweb解析ツールの導入は慎重に)
  - [ブラウザへのセンシティブ情報の保持は慎重に](#ブラウザへのセンシティブ情報の保持は慎重に)
  - [Cookieの取り扱い](#cookieの取り扱い)
  - [Webストレージ使用時の注意点](#webストレージlocalstoragesessionstorageのみ使用時の注意点)
  - [Webストレージ保存を実装する開発者に必要な意識](#webストレージ保存を実装する開発者に必要な意識)
- [補足：パスワード入力時のUXを向上させるフォームづくりのTips](#補足パスワード入力時のuxを向上させるフォームづくりのtips)

### 14. [用語集](#用語集)

---

## 📊 クイックリファレンス

### 攻撃手法一覧
| 攻撃手法 | 主な標的 | 主な対策 |
|---------|---------|---------|
| [XSS](#クロスサイトスクリプティングxsscross-site-scripting) | クライアント側スクリプト実行 | サニタイズ、CSP、HttpOnly Cookie |
| [CSRF](#csrfクロスサイトリクエストフォージェリ) | ユーザーの意図しないリクエスト送信 | CSRFトークン、SameSite Cookie |
| [クリックジャッキング](#クリックジャッキングclickjacking) | ユーザーの意図しないクリック | X-Frame-Options、frame-ancestors |
| [オープンリダイレクト](#オープンリダイレクト) | 不正サイトへの誘導 | URLホワイトリスト検証 |

### セキュリティヘッダー一覧
| ヘッダー名 | 目的 | 関連セクション |
|-----------|------|---------------|
| Content-Security-Policy | スクリプト実行制御 | [CSP](#cspcontent-security-policy) |
| X-Frame-Options | iframe埋め込み制御 | [クリックジャッキング対策](#クリックジャッキングの対策方法) |
| Strict-Transport-Security | HTTPS強制 | [HTTPS](#httpsの仕組み) |
| Set-Cookie (SameSite) | CSRF対策 | [SameSite Cookie](#samesite-cookie) |

---

## 前提として
- セキュリティの動向は時代背景や技術進歩、攻撃手法の変化から年々変わるものという意識を持つ

### 機能要件・非機能要件
#### 機能要件
顧客からのヒアリングなどを通じて得る顧客要望（システムで必ず満たすべき）を指す
#### 非機能要件
セキュリティ対策をはじめ、サイトのサーバ負荷対策、レスポンス速度、SEO対策など開発するシステムを利用する上で主目的にならないような事項を指す

> [!NOTE]
> IPA（情報処理推進機構）が出している「[非機能要求グレード](https://www.ipa.go.jp/archive/digital/iot-en-ci/jyouryuu/hikinou/ent03-b.html)」というものがある
> > 「非機能要求グレード」は、「非機能要求」についてのユーザと開発者との認識の行き違いや、互いの意図とは異なる理解を防止することを目的とし、非機能要求項目を網羅的にリストアップして分類するとともに、それぞれの要求レベルを段階的に示したものです。重要な項目から順に要求レベルを設定しながら、両者で非機能要求の確認を行うことができるツール群です。
> ---
> #### 非機能要求の6つのカテゴリ
> 1. 可用性（Availability）
> 概要: システムがどれだけの時間、停止せずに稼働できるか。
> 例: 稼働時間の割合（稼働率99.99%など）、障害時の復旧時間、メンテナンス時間帯の明示。
> 2. 性能・拡張性（Performance and Scalability）
> 概要: システムの応答速度や処理能力、将来的な拡張のしやすさ。
> 例: 画面表示の応答時間、同時アクセス数、スループット、拡張に要する工数や影響範囲。
> 3. 運用・保守性（Operability and Maintainability）
> 概要: システムの運用のしやすさ、障害対応や変更対応のしやすさ。
> 例: 障害発生時のログ出力内容、設定変更の容易さ、運用手順書の有無。
> 4. 移行性（Portability）
> 概要: 他の環境やバージョンへシステムを移行する際の容易さ。
> 例: データ移行の手段、OS変更時の対応範囲、バージョンアップ時の互換性。
> 5. セキュリティ（Security）
> 概要: システムやデータを不正アクセスや破壊から守る能力。
> 例: 認証方式、アクセス権管理、通信の暗号化、ログの改ざん防止。
> 6. システム環境・エコロジー（System Environment and Ecology）
> 概要: システムが稼働するための環境条件や、環境負荷の配慮。
> 例: 対応ブラウザ・OS、電力消費、設置スペース、利用端末制限。

## TCP/IP
### TCP/IPの4つのレイヤーとその役割・代表的なプロトコル
### アプリケーション層：レイヤー4（最上位）
- **主な役割**: アプリケーションに応じた通信をする
- **代表的なプロトコル**: HTTP, FTP, DNS, SMTP, POP3, IMAP

### トランスポート層：レイヤー3
- **主な役割**: インターネット層から受け取ったデータをどのアプリケーション層に渡すかを決めたり、データの誤りを検知したりする
- **代表的なプロトコル**: 
  - **TCP**: 送信したデータを確実に相手に届けたい場合
  - **UDP**: リアルタイム通信など速度を重視したい場合

### インターネット層：レイヤー2
- **主な役割**: どのコンピュータにデータを届ける（伝達経路の選択：ルーティングする）か決定する
- **代表的なプロトコル**: IP, ICMP, ARP, IGMP

### ネットワークインターフェース（データリンク）層：レイヤー1（最下位）
- **主な役割**: 通信機器は文字や数字のデータをそのまま送ることができず、物理的に送信可能な電気信号に変換してデータをやりとりする。データリンク層は電気信号を相手に届けたり、電気信号の伝送制御や誤りの検知を行う
- **代表的なプロトコル**: 
  - **Ethernet**: 有線LAN
  - **IEEE 802.11**: 無線LAN
  - **Wi-Fi**: 無線LAN（※Wi-FiはIEEE 802.11規格の商標名なので実質的には同じもの）
  - **PPP**: Point-to-Point Protocol

### 実際の通信フロー例
- データ送信時：アプリケーション層 → トランスポート層 → インターネット層 → ネットワークインターフェース層
- データ受信時：ネットワークインターフェース層 → インターネット層 → トランスポート層 → アプリケーション層
この階層構造により、各レイヤーは独立して機能し、保守性と拡張性を高めています。

## HTTPメッセージ
### HTTPメッセージの形式
リクエストとレスポンスの2種類あるが形式は以下同じ

```
開始行
----------
メッセージヘッダ
----------
空白行
----------
メッセージボディ
```

#### HTTPリクエスト
HTTPによるブラウザとサーバの通信は、ブラウザからサーバへ要求を送ることからはじまる。<br>
この要求を送ることをリクエスト（処理要求）という。

```bash
# リクエストライン
POST / HTTP/1.1
# ヘッダ：2行目から空白行まで
Host: localhost:8080
Connection: keep-alive
...
..
.
Cache-Control: max-age=0
# 空白行（ここまでヘッダ）
# ボディ：以降の行
id=1&user=hoge
```

- リクエストライン<br>
`GET`や`POST`といったHTTPメソッドをはじめ、リソースのパス名、HTTPバージョンが含まれている
- ヘッダ<br>
ブラウザの情報や接続に関する情報などデータのやりとりに必要な付加情報が含まれている
- ボディ<br>
リクエスト本文。取得したい情報のキーワードや登録したい情報が記載されている（※リクエスト内容によってはボディが空の場合もある）

##### プリフライトリクエスト
特定の条件を満たすHTTPヘッダが付与されていたり、PUTやDELETEといったサーバ内のリソースを変更・削除するメソッドが使われている場合は慎重に処理される必要がある。<br>
そこで、このような**リクエスト時にはブラウザからサーバへ事前リクエストして問題ないかを問い合わせる。そしてサーバから許可されたリクエストは受理されるという仕組み**。<br>
この安全なやり取り実現のために事前リクエストすることをプリフライトリクエストという。プリフライトリクエストにはOPTIONSメソッドが用いられる。

- OPTIONSメソッド<br>
HTTPメソッドの一つで、サーバがサポートしているHTTPメソッドを確認する

- Access-Control-Max-Ageヘッダ<br>
常時プリフライトリクエストを行うと、ネットワーク環境が低速な場合や大量のリクエストを送る場合などにおいてパフォーマンス面で支障をきたす可能性がある。そこで、プリフライトリクエストの内容をキャッシュさせておく際にAccess-Control-Max-Ageヘッダを使用する。
```bash
# キャッシュ時間：1時間
Access-Control-Max-Age: 3600
```

#### 代表的なリクエストヘッダ
開発者ツールの`Network`パネルから確認可能

##### Host
- 概要: リクエスト先のホスト名とポート番号を指定
- 例: `Host: www.example.com`

##### User-Agent
- 概要: クライアントのブラウザやアプリケーションの情報を送信
- 例: `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`

##### Accept
- 概要: クライアントが受け入れ可能なコンテンツタイプを指定
- 例: `Accept: text/html,application/json`

##### Accept-Language
- 概要: クライアントが希望する言語を指定
- 例: `Accept-Language: ja,en-US;q=0.9`

##### Accept-Encoding
- 概要: クライアントが対応している圧縮方式を指定
- 例: `Accept-Encoding: gzip, deflate, br`

##### Authorization
- 概要: 認証情報（トークンやパスワード）を送信
- 例: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

##### Cookie
- 概要: 以前にサーバから送信されたクッキーを送信
- 例: `Cookie: session_id=abc123; user_pref=dark_mode`

> [!IMPORTANT]
> ###### 補足：自動的なCookieの送信
> ページ遷移時やフォーム送信時といったリクエスト処理時に、**ブラウザは`Cookie`を自動的にサーバへ送信**する。
> この働きにより元来ステートレスなHTTPが状態（ログイン有無やカートの中身などの情報）維持できるようになる。

##### Referer
- 概要: リクエストの元となったページのURLを指定
- 例: `Referer: https://www.google.com/search?q=example`

##### If-Modified-Since
- 概要: 指定日時以降に更新されたリソースのみを要求
- 例: `If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT`

#### HTTPレスポンス
リクエスト（ブラウザからサーバへの処理要求）に応じて、サーバが送信する情報をレスポンスという。

```bash
# ステータスライン
HTTP/1.1 200 OK
# ヘッダ：2行目から空白行まで
content-encoding: gzip
content-type: text/html;
...
..
.
content-length: 648
# 空白行（ここまでヘッダ）
# ボディ：以降の行
<!doctype html>
<html>
...
..
.
```

- ステータスライン<br>
リクエストに応じたサーバの処理結果。200：正常終了, 400系：クライアントエラー, 500系：サーバエラー
- ヘッダ<br>
サーバに関する情報や送信したリソースの形式などの付加情報が含まれている
- ボディ<br>
レスポンス本文。リクエストされた情報やサーバの処理結果などが記載されている（※リクエスト内容によってはボディが空の場合もある）

#### 代表的なレスポンスヘッダ
開発者ツールの`Network`パネルから確認可能

##### Status
- 概要: HTTPステータスコードとメッセージを示す
- 例: `200 OK`, `404 Not Found`, `500 Internal Server Error`

##### Server
- 概要: サーバーソフトウェアの情報を送信
- 例: `Server: Apache/2.4.41 (Ubuntu)`

##### Set-Cookie
- 概要: クライアントにクッキーを設定（保存）するよう指示
- 例: `Set-Cookie: SESSION_ID=abc123; Path=/; HttpOnly`
    - **保存形式**：`SESSION_ID: abc123`（`キー: 値`）

> [!NOTE]
> ##### セッション
> 訪問先サイトのサーバ側で管理する「訪問ユーザーの状態情報」。<br>HTTPは原則ステートレス（※前回のやり取り内容を覚えていない）なので、セッションを用いてユーザーのログイン有無やカート情報、クッキーやキャッシュ情報などを管理する
> ###### クッキー
> セッションIDをはじめ、言語設定や表示設定など先のユーザー固有情報を管理・把握する一意の識別子。<br>訪問先サイトのサーバが発行し、閲覧ブラウザに保存される。4kbほどのデータ容量しか無いので多くの情報は保存できない
> ###### キャッシュ
> 訪問先サイトのアセットデータ（画像やファイルなど）を一時的に保持してブラウザのレンダリング負荷を軽減する働きを持つ

##### Location
- 概要: リダイレクト先のURLを指定（主に3xxステータスで使用）
- 例: `Location: https://www.example.com/new-page`

##### Cache-Control
- 概要: キャッシュの動作を制御
- 例: `Cache-Control: no-cache, must-revalidate`

##### Expires
- 概要: リソースの有効期限を指定
- 例: `Expires: Wed, 21 Oct 2015 07:28:00 GMT`

##### Last-Modified
- 概要: リソースが最後に更新された日時を示す
- 例: `Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT`

##### ETag
- 概要: リソースの固有識別子（バージョン管理用）
- 例: `ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"`

##### WWW-Authenticate
- 概要: 認証が必要な場合の認証方式を指定
- 例: `WWW-Authenticate: Basic realm="Restricted Area"`

##### HTTPメソッド
- GET
    - 役割: サーバからリソースを取得する
    - 特徴: 安全で冪等性がある（何度実行しても同じ結果）
    - 使用例: Webページの表示、データの取得

- POST
    - 役割: サーバにデータを送信して新しいリソースを作成する
    - 特徴: 安全ではなく、冪等性もない
    - 使用例: フォームの送信、ユーザー登録、データの作成

- PUT
    - 役割: サーバ上のリソースを更新または新規作成する
    - 特徴: 冪等性がある（同じ操作を繰り返しても結果は同じ）
    - 使用例: ファイルのアップロード、データの完全更新

- DELETE
    - 役割: サーバ上のリソースを削除する
    - 特徴: 冪等性がある
    - 使用例: ファイルの削除、ユーザーアカウントの削除

- HEAD
    - 役割: GETと同じだが、レスポンスボディを返さずヘッダのみを取得
    - 特徴: 安全で冪等性がある
    - 使用例: リソースの存在確認、メタデータの取得

- CONNECT
    - 役割: プロキシサーバを通じてSSL/TLSトンネルを確立する
    - 特徴: 主にHTTPS通信でプロキシを経由する際に使用（※通信先の制限などをしないと攻撃者に悪用されるリスクがある）
    - 使用例: プロキシサーバ経由でのHTTPS接続、VPN接続

- OPTIONS
    - 役割: サーバがサポートしているHTTPメソッドを確認する
    - 特徴: 安全で冪等性がある
    - 使用例: CORS（Cross-Origin Resource Sharing）での事前確認

- PATCH
    - 役割: リソースの部分的な更新を行う
    - 特徴: 冪等性は実装によって異なる
    - 使用例: ユーザー情報の一部更新、設定の変更

- TRACE（現在ではほとんど使用されていない）
    - 役割: クライアントのリクエストがサーバに到達するまでの経路を確認
    - 特徴: 安全で冪等性がある
    - 使用例: デバッグ、ネットワーク診断（セキュリティ上の理由で無効化されることが多い）

#### 代表的なエンティティヘッダ
リクエストとレスポンスのどちらにも使えるHTTPヘッダのことをエンティティヘッダという。

##### Content-Type
- 概要: 送信データ（リソース）のメディアタイプを指定
- 例: `Content-Type: application/json; charset=utf-8`

##### Content-Length
- 概要: 送信データ（リソース）のバイト数を指定
- 例: `Content-Length: 1024`

##### Content-Encoding
- 概要: データの圧縮方式を指定
- 例: `Content-Encoding: gzip`

##### Content-Language
- 概要: データの言語を指定
- 例: `Content-Language: ja`

##### Content-Location
- 概要: データの元となる場所のURLを指定
- 例: `Content-Location: /documents/report.pdf`

##### Content-Disposition
- 概要: データの処理方法を指定（インライン表示またはダウンロード）
- 例: `Content-Disposition: attachment; filename="report.pdf"`

##### Content-Range
- 概要: 部分的なデータ送信時の範囲を指定
- 例: `Content-Range: bytes 200-1023/2048`

##### Allow
- 概要: リソースで使用可能なHTTPメソッドを指定
- 例: `Allow: GET, POST, PUT, DELETE`

## HTTPSの仕組み
HTTPSとは、暗号化されておらず、改ざんなどのリスクがあるHTTP（通信）の危険性を回避するための技術であり通信規格を指す。

### TLS（Transport Layer Security）
HTTPSは、TLSという通信プロトコルを用いてHTTPデータを暗号化して通信している
- HTTPデータをやり取りする前に、TLSハンドシェイクという一連の手順によって暗号通信を確立する<br>
TLSでの通信では、**通信データの暗号化**、**通信相手の検証**、**通信データの改ざんチェック**などを実現する

#### TLSによる 通信データの暗号化
プレーンテキストを暗号化して相手へ送り、受信側は復号してデータの中身を確認できる。暗号化と復号化に必要な鍵（秘密鍵）は、ブラウザとサーバが情報のやり取りを行って安全に共有する。つまり、鍵を持つ者だけが復号できるので安全ということ。

- 秘密鍵<br>
TLSの通信ごとに作られる一時的なもので、通信が終わると廃棄される。これにより、データの盗聴や改ざんなどを防いでいる

#### TLSによる 通信相手の検証
電子証明書を用いて通信相手が本物かどうかを検証する。電子証明書は、認証局（CA）と呼ばれる社会的に信頼されている機関が発行していて、サーバから送信された電子証明書が正しいかどうかをブラウザが検証する。<br>
あらかじめ、ブラウザやOSには電子証明書が組み込まれていて、それらと照合する仕組みなので、もしCAから発行されていない電子証明書が使用されている場合にブラウザは警告画面（例：この接続ではプライバシーが保護されません）を表示する。<br>
つまり、サーバ側は必ず信用できるCAから発行される電子証明書を用いなければならない。

#### TLSによる 通信データの改ざんチェック
改ざんがなかったことを証明するために**認証タグ**という検証用データをTLSは用いる。認証タグはデータの暗号化と同時に作成され、通信相手に送信される。<br>
受信側は復号と同時に認証タグを使って暗号文の改ざんチェックを実施し、もし形跡があった場合は通信は行われずにエラー処理される。ちなみに、改ざんチェックに関しては、TLSハンドシェイク中にも実施されている。

### HTTPS通信でないと処理できない内容（Secure Context）

- Service Workers<br>
オフラインでもwebアプリケーションを表示可能とする機能

- Payment Request API<br>
web上の決済を手軽に実現するための機能。ブラウザに記憶させた決済情報を使って決済が行える

---

上記のような機能はWebサービスや開発の拡充に有用だが、Payment Request API など悪用されるとリスクの高いものもある。そのため、これら機能に関しては「安全なコンテキスト（Secure Context）」上でのみ利用可能となっている。具体的には以下の条件を満たすと Secure Context とみなされる。

- https:// または wss:// といった暗号通信で配信されている
- http://localhost, http://127.0.0.1, file:// といったローカルホスト通信

※Secure Contextを要件としているブラウザの機能は先の2つ以外にもたくさんある

### Mixed Contentの危険性
Mixed Content とは（HTTPS化されたWebアプリケーション内で）https通信またはhttp通信で読み込んでいるファイルが一つのwebページ内で混在している際に発生する警告。<br>
Passive mixed content（画像や音声、動画ファイルなど）はそこまでリスクはないものの、Active mixed content（JavaScriptやCSSファイルなど）というプログラムに影響を与えるものが Mixed Content の場合はリスクが高まる。<br>
※Chrome, Firefox, Safari など主要ブラウザは別サイトから配信されている Active mixed content のサブリソースへのアクセスをブロックする。

## オリジンに関する事項
### 同一オリジンポリシー（Sama-Origin Policy）
ブラウザに組み込まれているアクセス制限の仕組み。異なるwebアプリケーションとの間に境界（オリジン）を設けるブラウザの機能によって、開発者は特別な対策をしなくともwebアプリケーションからのアクセスを制限できる。

- オリジン（Origin）<br>
異なるwebアプリケーション同士でアクセスを制限するための境界を指す。基本的にオリジンは`スキーム（プロトコル）`、`ホスト名（ドメイン名）`、`ポート番号`で構成される。

```
https://example.com:443/about

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
パス
```

> [!IMPORTANT]
> スキーム、ホスト、ポート番号のいずれかが異なる場合は **クロスオリジン（Cross-Origin）** となる

ブラウザはデフォルトで同一オリジンポリシーを有効にしていて、以下のようなアクセスは制限される。

- JavaScript を使ったクロスオリジンへのリクエスト送信
- JavaScript を使った iframe内のクロスオリジンのページへのアクセス
- クロスオリジンの画像を読み込んだ <canvas> 要素のデータへのアクセス
- Web Storage や IndexDB に保存されたクロスオリジンのデータへのアクセス

※他にも制限される機能はいくつかある。

#### JavaScript を使ったクロスオリジンへのリクエスト送信
`fetch API`や`XMLHttpRequest`を使ったクロスオリジンへのリクエストは制限される。具体的にはCORS（クロスオリジン・リソース・シェアリング）に関するエラーが表示されて、回避するにはCORSに則ったアプローチを採る必要がある。

#### JavaScript を使った iframe内のクロスオリジンのページへのアクセス
Webアプリケーション内に iframeで埋め込んだクロスオリジンのページへのアクセスは制限される。<br>
ただし、`postMessage`関数を利用することでデータの送信元のオリジンをチェックできるためクロスオリジンでも安全にデータのやり取りが行える。

#### クロスオリジンの画像を読み込んだ <canvas> 要素のデータへのアクセス
クロスオリジンの画像を読み込んだ <canvas> 要素は汚染された状態とみなされてデータの取得に失敗する。この制限を回避するにはCORSが必要となる。

#### Web Storage や IndexDB に保存されたクロスオリジンのデータへのアクセス
Web Storage（localStorage, sessionStorage）や IndexDB といったブラウザの組み込みデータベース機能に保存されたデータも、同一オリジンポリシーによりアクセスを制限されている。sessionStorage は、オリジン間のみならず新しく開いたタブやウィンドウ間のアクセスも制限する。<br>
つまり、ユーザーが罠サイトにアクセスしてしまっても**ブラウザに保存されたデータは同一オリジンからしかアクセスできないので罠サイトへ情報漏洩することはない**。ただし、**以下の注意書きに留意**すること。

> [!NOTE]
> 1. XSSがあればアウト<br>
> 同一オリジン内でスクリプトを実行できる脆弱性（XSS）がある場合、罠サイト経由でそのオリジンにスクリプトを注入し、保存データを盗み出される。
> 2. クロスサイトスクリプトインクルージョン（XSSI）やJSONP的手法は関係なし<br>
> localStorageやIndexedDBは「DOM API」でしかアクセスできないため、<script src> などでは直接読み出せないものの、アプリがデータをサーバ経由で返す仕組みを持っていると、別経路から抜かれる可能性がある。
> 3. ブラウザバグや拡張機能による漏洩<br>
> ごくまれにブラウザ実装の不具合や悪意ある拡張機能で読み出される例もある（安全設計では防ぎにくい）。

#### 制限されないクロスオリジンアクセス事例（8例）
1. `<script>` 要素によるクロスオリジン JavaScript 読み込み  
   - 例:  
     ```html
     <script src="https://cross-origin.com/app.js"></script>
     ```  
   - JavaScriptファイルはCORS不要でロード可能（ただし実行されるのは読み込んだコード）。  

2. `<img>` 要素によるクロスオリジン画像読み込み  
   - 例:  
     ```html
     <img src="https://cross-origin.com/image.png">
     ```  
   - 表示は可能だが、`canvas` に描画してピクセル情報を読む場合は `crossorigin`属性やCORS対応が必要。

3. `<link rel="stylesheet">` によるクロスオリジンCSS読み込み  
   - 例:  
     ```html
     <link rel="stylesheet" href="https://cross-origin.com/style.css">
     ```  
   - CSSはCORS不要で適用可能（ただし、`@import`内で画像やフォントを読み込むときに挙動が異なる場合あり）。

4. `@font-face` によるクロスオリジンWebフォント読み込み  
   - 例:  
     ```css
     @font-face {
       font-family: 'MyFont';
       src: url('https://cross-origin.com/font.woff2');
     }
     ```  
   - 多くのブラウザはフォントにCORS制約を課すが、古いブラウザや特定設定では制限されずに使えることがある。

5. `<video>` / `<audio>` によるクロスオリジンメディア読み込み  
   - 例:  
     ```html
     <video src="https://cross-origin.com/video.mp4" controls></video>
     ```  
   - 再生は可能だが、フレーム取得や音声解析などのAPIアクセスはCORS必須。

6. `<iframe>` によるクロスオリジンページ埋め込み  
   - 例:  
     ```html
     <iframe src="https://cross-origin.com"></iframe>
     ```  
   - 表示は可能だが、JavaScriptでDOMへアクセスは不可（同一オリジン制約は働く）。

7. `<object>` / `<embed>` / `<applet>` によるクロスオリジンリソース読み込み  
   - 例:  
     ```html
     <object data="https://cross-origin.com/file.pdf" type="application/pdf"></object>
     ```  
   - 埋め込み表示はできるが、中身の直接操作は不可。

8. `<form>`要素によるフォーム送信  
   - 例:  
     ```html
     <form action="https://cross-origin.com/mail.php" method="post">
     ```  

---

これらのHTML要素からのアクセスも、`crossorigin`属性やCORS対応することでアクセス制御できる。

#### `CORS`（`Cross-Origin Resource Sharing`）
CORSとは**クロスオリジンへのリクエストを可能にしたり、サーバからアクセス許可が出ているリソースへはアクセスできるようにしたりする仕組み**を指す。<br>
同一オリジンポリシーによって、自社管理の異なるドメイン（クロスオリジン）へのリクエスト送信、またはリクエスト受信すらも制限下に置かれてしまう状態になる。<br>これでは自社の複数サービスを連携させるような開発・運用をはじめ、CDNを使ってJavaScriptやCSS、画像ファイルなどのリソース読み込みにも支障をきたしてしまう。<br>
自社WebサービスやCDNなど**信頼できる接続先においてはクロスオリジンの制限を解除したい**のは当然で、**そのための回避策としてオリジンをまたいだネットワークアクセスを可能とするCORS**がある。

##### `CORS`の仕組み
`XMLHttpRequest`や`fetch`関数を使ってクロスオリジンへリクエストすることは同一オリジンポリシーによって禁止されている（※具体的には、クロスオリジンから受信したレスポンスのリソースへのアクセスが禁止）。<br>
ただし、レスポンスに付与されている一連のHTTPヘッダによって、**サーバからアクセス許可が出ているリソースへはアクセス可能**となる。<br>
この**一連のHTTPヘッダに、アクセス許可するためのリクエスト条件が記載されていて、その条件を満たしたリクエストであればブラウザは受信したリソースへJavaScriptを使ってアクセスすることを認める**。<br>
他方、満たさない場合はリクエスト及びリソースの取り扱いを禁止してレスポンスを破棄する。

##### `crossorigin`属性
`<img>`や`<script>`要素などHTML要素から送信されるリクエストのモードは、同一オリジンに送信される場合は same-origin となり、クロスオリジンへ送信される場合は no-cors となる。これらHTML要素に`crossorigin`属性を付与することで、cors モードとしてリクエストできるようになる。

> [!IMPORTANT]
> `type="module"`を指定したスクリプトは、`crossorigin`属性がなくとも自動的にCORSモードで読み込まれる<br>
> 例えば、Viteのビルド成果物は`ES Modules`として出力されるのでクロスドメインにホスティングしたSPAを読み込みたい場合などは上記のようなことに特に注意する（[対応策は後述](#jsファイルに対してcorsヘッダーを追加)）

- 以下は**CORSにおけるリクエストモードの種類（Fetch APIやブラウザが使用するリクエストモード）**<br>
※`crossorigin`属性の属性値に指定するものではないので注意
  - `same-origin`<br>
  クロスオリジンへのリクエストは送信されずエラーになる
  - `no-cors`<br>
  クロスオリジンへのリクエストは **「単純リクエスト（※）」** のみに制限される。**レスポンスの内容にJavaScriptからアクセスできない**。
    - ※単純リクエスト（Simple Request）<br>
    GETまたはPOSTによるブラウザがデフォルトで送信できるリクエストのことで、具体的には後述の`CORS-safelisted`とみなされたリクエストを指す
  - `cors`<br>
  CORSの設定がされていない、またはCORS違反となるリクエストが送信された時はエラーとなる。`fetch API`で`mode`引数を省略した際のデフォルト値（※仕様ではデフォルト値は no-cors なものの、多くのブラウザでは cors をデフォルト値にしている）。

###### JSファイルに対してCORSヘッダーを追加
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

`crossorigin`属性を付与することで cors モードとなるので、読み込むリソースのレスポンスには `Access-Control-Allow-Origin`レスポンスヘッダなどのCORSヘッダが必要となる。<br>
例えば、`crossorigin`属性を付与した`<img>`から画像ファイルをリクエストした時に、画像ファイルのレスポンスにCORSヘッダが付与されていない場合や、サーバから許可されていない場合は画像が表示されない。

###### `crossorigin`属性と`fetch API`の`credentials`との対応関係比較

| crossorigin属性 | fetch credentials | 同一オリジン Cookie | クロスオリジン Cookie | 認証情報 | CORSリクエスト |
|----------------|------------------|-------------------|-------------------|---------|---------------|
| 属性なし または ""（空文字）指定 | `"same-origin"` | ✅ 送信 | ❌ 送信しない | 同一オリジンのみ | クロスオリジンのみ |
| `"anonymous"` | `"omit"` | ❌ 送信しない | ❌ 送信しない | 含まない | 常に |
| `"use-credentials"` | `"include"` | ✅ 送信 | ✅ 送信 | 常に含む | 常に |

#### CORS-safelisted
`CORS-safelisted`とみなされたHTTPメソッドやHTTPヘッダのみが送信されるリクエストは、ブラウザがデフォルトで送信できる。つまり、**`CORS-safelisted`以外のHTTPヘッダを許可する場合は、`Access-Control-Allow-Headers`を送信しなければならない**。

- example-Token-Header ヘッダを許可するコードをサーバ側の処理に追加
```js
.
..
if(req.method === "OPTIONS"){
  res.header("Access-Control-Allow-Origin", "example-Token-Header")
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

- `Access-Control-Allow-Origin`<br>
アクセス許可されたオリジンをブラウザに伝えるためのレスポンスヘッダ
```js
"Access-Control-Allow-Origin": "https://cross-origin.com"
```

※**複数のオリジンを指定することはできない**ものの、`*`を使うことで全てのオリジンからのアクセスを許可できる。
```js
# すべてのオリジンからのアクセスを許可（※あまりに危険なので実用性は低い）
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
  // Origin ヘッダが存在している かつ リクエスト許可するリスト内に Origin ヘッダの値が含まれているかチェック
  if(req.headers.origin && allowLists.includes(req.headers.origin)){
    res.header("Access-Control-Allow-Headers", "example-Token-Header");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
}

..
.
```

## サイドチャネル攻撃
同一オリジンポリシーなどソフトウェア以外の、CPUやメモリなどハードウェアの特性を悪用した攻撃。

### サイドチャネル攻撃を防ぐ Site Isolation
境界（サイト）ごとにプロセスを分離する仕組みのこと。<br><br>
プログラムの中には、他のプログラムのデータへアクセスできるものもあり、ケースによっては危険な場合がある。<br>
一般的に、OSは「プロセス」という単位でプログラムの処理を管理していて、メモリ領域をプロセスごとに隔離している。これによって、プロセスをまたいだメモリへのアクセスはできないようになっている。<br><br>
ブラウザは内部でWebアプリケーションごとにプロセスを分けることでサイドチャネル攻撃を防いでいる。<br>
例えば、レンダリング（描画）プロセスを各サンドボックス内に入れて個別管理し、それらサンドボックスの各種処理を全体包括する形でブラウザプロセスが成り立っている。ここでいう個別管理がプロセスの隔離にあたり、これは「サイト」という単位で行われている。このサイトは、webサイトのそれとは異なり「オリジンと異なる定義を持ったセキュリティのための境界（サイト）」という意味となる。<br>
サイトの定義は「`eTLD+1`」と決まっていて、eTLD（トップレベルドメイン）とは`.com`,`.jp`,`.co.jp`,`.github.io`といったドメインを含む。<br>

#### Site Isolation によって制限されてしまった機能の有効化
Site Isolation によってサイドチャネル攻撃の大部分を防ぐことができるようになった代わりに、いくつかのAPIや機能が無効化されてしまうことになった。これら制限された機能を有効にするには、オリジンごとにプロセスを分けてサイドチャネル攻撃が発生しないことを保障せねばならならない。オリジンごとにプロセスを分離する仕組みを`Cross-Origin Isolation`といって、これをWeb開発者が任意で有効化できる仕組みが用意されている。

##### `CORP`, `COEP`, `COOP`
以下の3つの仕組みを有効化（レスポンスヘッダに設定）することで、Site Isolation によって制限された機能を扱えるようになる

- `Cross-Origin Resource Policy`（`CORP`）<br>
リソースの読み込み制御：他のオリジンからのリソース読み込みを制限するポリシー
- `Cross-Origin Embedder Policy`（`COEP`）<br>
埋め込みリソースの制御：ページに埋め込まれるすべてのリソースに対してCORSまたはCORPの明示的な許可（設定強制）を要求
- `Cross-Origin Opener Policy`（`COOP`）<br>
ウィンドウ間の情報漏洩を防止：新しいタブやウィンドウを開いた際の相互アクセスを制限する

## クロスサイトスクリプティング（XSS：Cross-Site Scripting）
Webアプリケーションの脆弱性を悪用した攻撃手法の一つ。<br>XSSは、攻撃者が悪意のあるスクリプトコードを正規のWebサイトに注入し、そのサイトを閲覧する他のユーザーのブラウザで実行させる攻撃を指す。<br>クロスオリジンのページで実行されるJavaScriptからの攻撃は同一オリジンポリシーでブロックされるが、XSSは**攻撃対象のページ内でJavaScriptを実行するため同一オリジンポリシーでも防げない**。<br>
この攻撃により、機密情報の漏洩、Webアプリケーションの改ざん、意図しない操作、なりすまし（ユーザーの機密情報の窃取）、セッションハイジャック、フィッシング攻撃などが可能となる。

### 基本的な仕組み
XSS攻撃は以下の流れで実行される：<br>
1. 脆弱性の発見: 攻撃者がWebアプリケーションでユーザー入力を適切にサニタイズしていない箇所を見つける
2. スクリプト注入: 攻撃者が悪意のあるJavaScriptコードを含む入力をWebサイトに送信する
3. コード実行: 他のユーザーがそのページを閲覧した際に、注入されたスクリプトがユーザーのブラウザで実行される
4. 被害発生: 実行されたスクリプトにより、Cookieの窃取、個人情報の取得、不正な操作などが行われる

### 主な種類
- 反射型XSS（Reflected XSS）<br>
攻撃コードがリクエストの一部として送信され、レスポンスに即座に反映される形式です。例：罠サイトへアクセスして攻撃ページへ遷移させられたユーザが、攻撃ページを閲覧した際にそのブラウザ上で攻撃コードが実行される。
- 蓄積型・格納型XSS（Stored XSS）<br>
攻撃コードがサーバのデータベースに保存され、そのデータが表示される度に実行される形式です。掲示板やコメント機能で発生しやすいです。例：悪意のあるコードが含まれた画像データが投稿され、それを閲覧した不特定多数のユーザーがXSSの被害を受けるという最も危険なXSS攻撃。
- DOM型XSS（DOM-based XSS）<br>
これまでのサーバ側ではなく、クライアント側のJavaScriptによるDOM（Document Object Model）操作が原因で発生する形式です。

#### フロントエンドに密接な DOM型XSS の仕組み
##### Source（ソース）: DOM-based XSSを引き起こす原因となる箇所（入口）
- location.href, location.search, location.hash
- document.referrer
- document.cookie
- document.URL
- window.name
- localStorage, sessionStorage, IndexDB
- postMessage

##### Sink（シンク）: ソースからJavaScriptを生成・実行してしまう箇所（出口）
- innerHTML, outerHTML
- document.write(), document.writeln() （※現状非推奨）
- insertAdjacentHTML()
- $.html() （※ jQuery を使用している場合）
- eval()
- setTimeout()
- setInterval()
- element.src への代入
- location.href への代入

> [!IMPORTANT]
> 結局、DOM型XSSの予防策としては極力これら「シンク」となる機能を使わないのに限る。

#### 対策
1. サニタイズなどのエスケープ処理
  - 例えば、`<a>`の`href`属性の値で、`JavaScript:`に続いて指定された任意のJavaScript（例：`JavaScript:evilAttack(1)`）は`<a>`がクリックされると実行されてしまう。**ユーザー操作によるリンク生成機能を用意する場合は注意**。

2. HTTPOnlyフラグ付きCookieを用いてJavaScriptからのアクセスを制御する（※セッションハイジャック対策）
  - サーバサイドでCookieを発行する際にHTTPOnly属性を付与することでCookie（に格納しているセッションIDなど）の漏洩リスクを軽減する。
```js
// NG例
Set-Cookie: SESSIONID=abcdef123456

document.cookie; // 'SESSIONID=abcdef123456'が返ってくる

// OK例
Set-Cookie: SESSIONID=abcdef123456; HTTPOnly
document.cookie; // ''（空文字）が返ってくる
```

3. CSP（Content Security Policy）というブラウザの機能で、サーバから許可されていない JavaScript の実行やリソース読み込みなどをブロックする。ほとんどのブラウザがサポート済み。
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

---

最も賢明なのはXSS対策を自動で行ってくれるようなライブラリ（React, Vue）やフレームワーク（Next.js Nuxt）を使用すること。<br>※ただし、`dangerouslySetInnerHTML`（React）や`v-html`（Vue）を使用する場合は注意が必要。<br><br>

自前実装する場合は、パース系のライブラリ（例：[`html-react-parser`](https://www.npmjs.com/package/html-react-parser), [`DOMPurify`](https://github.com/cure53/DOMPurify)）を用いたり、[Sanitizer API（HTMLコンテンツのサニタイズを行うWeb標準API）](./sethtml-guide.md/#sanitizer-api)を用いたりして安全に実装する必要がある。

## CSP（Content Security Policy）
CSPは、XSSなど不正なコードを埋め込むインジェクション攻撃を検知して被害の発生を防ぐためのブラウザの機能。サーバから許可されていない JavaScript の実行やリソース読み込みなどをブロックする。ほとんどのブラウザがサポート済み。

> [!IMPORTANT]
> CSPは、不明瞭なJavaScript（コード及びファイル）やリソースの読込をブロックしてセキュアを担保してくれるブラウザの機能だが、その副作用（JavaScriptの各種制限など）によって意図しない挙動不具合を引き起こす可能性もある<br>
> [Report-Only モード](#report-only-モード)を設定して段階ごとに設定していくのが現実的なアプローチとなりそう。

### CSPの設定方法（HTTPヘッダ または `meta`要素に設定）
CSPは、`Content-Security-Policy`ヘッダをページのレスポンスに含めるか、HTMLの`meta`要素にCSP設定を埋め込むことで有効化できる<br>
※ただし、HTMLの`meta`要素にCSP設定を埋め込む場合はHTTPヘッダでのCSP設定が優先されたり、一部の設定が使えなかったりするので注意。
  
- `Content-Security-Policy`ヘッダをページのレスポンスに含める
```bash
Content-Security-Policy: script-src *.trusted.example.com
```

- HTMLの`meta`要素にCSP設定を埋め込む
```bash
Content-Security-Policy: script-src *.trusted.example.com
```

```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="script-src *.trusted.example.com"
>
```

### ディレクティブ（ポリシーディレクティブ）
前述を例とすると、`script-src *.trusted.example.com`のような値の箇所。<br>
ディレクティブは、コンテンツの種類ごとにどのようなリソースを読み込むかの制限指定を行う。<br>
`meta`要素の場合は`content`属性にディレクティブを指定する。

#### `script-src *.trusted.example.com`の場合
trusted.example.com およびそのサブドメインの（JavaScript）ファイルのみ読込許可する。<br>
※ディレクティブに指定されていないホスト名のサーバからは、JavaScriptファイルを一切読み込まない（ブロックしてエラーとなる）。

#### `'self'`キーワードで自身（のホスト）を対象外にする
CSPは、自身のドメインでホスティングしているJavaScriptファイルの読込も制限するので、同一ホストから読み込みたい場合は`'self'`キーワードを指定する
```bash
Content-Security-Policy: script-src 'self' *.trusted.example.com
```

##### `;`で区切って複数のディレクティブを指定することも可能
```bash
Content-Security-Policy: default-src 'self'; script-src 'self' *.trusted.example.com
```

#### CSPの代表的なディレクティブ一覧
- default-src
  - すべてのリソースタイプのデフォルトポリシーを設定。指定されていないディレクティブを一括で許可する
  - 以下項目に続く、他の*-srcディレクティブが指定されていない場合のフォールバック

- script-src
  - JavaScriptの実行を制御

- style-src
  - CSSスタイルシートの読み込み（適用許可）を制御

- img-src
  - 画像の読み込み元を制御

- font-src
  - フォントファイルの読み込み元を制御

- connect-src
  - XMLHttpRequest、fetch()、WebSocketなどの接続先を制御

- media-src
  - 音声・動画メディアの読み込み元を制御

- frame-src
  - iframe内で読み込み可能なURLを制御

- form-action
  - フォームの送信先URLを制御

- frame-ancestors
  - iframeなどで現在のページの埋め込み許可を制御

- upgrade-insecure-requests
  - HTTPリクエストを自動的にHTTPSに変換

- block-all-mixed-content
  - 混在コンテンツ（HTTPS内のHTTPリソース）をブロック

- report-uri
  - CSP違反時のレポート送信先URL<br>※Report-Onlyモードのみならず、実際にCSP適用後でもレポート送信は可能

- sandbox
  - コンテンツをサンドボックス化して隔離させることで外部からのアクセスを制御する

---

`meta`要素の場合は以下のディレクティブは指定不可能
- frame-ancestors
- report-uri
  - `Report-Only モード`も設定不可
- sandbox

##### CSPに指定できるソースのキーワード
- 'self'
  - 同一オリジン（プロトコル、ドメイン、ポート）のリソースを許可

- 'none'
  - すべてのリソースを拒否

- 'unsafe-inline'（※セキュリティリスク有）
  - script-src や style-src ディレクティブにて、インラインスクリプト（※`<script>`要素を使った記述）やインラインスタイル（※`<style>`要素や`style`属性を使ったスタイル指定）を許可

- 'unsafe-eval'（※セキュリティリスク有）
  - script-src ディレクティブにて eval() や Function() コンストラクタの使用を許可

- 'unsafe-hashes'（※セキュリティリスク有）
  - script-src ディレクティブにて、DOMに設定された onclick, onfoucus などのイベントハンドラーの実行は許可するが、`<script>`要素を使ったインラインスクリプトや`JavaScript:`スキームを使ったJavaScriptの実行は許可しない

---

CSPを適用したページでは、明示的に`'unsafe-inline'`キーワードを用いないとインラインスクリプトやスタイルは禁止されているので使用できない。これを回避（して安全にインラインスクリプト・スタイルを実装）するために、`nonce-source`や`hash-source`と呼ばれるCSPヘッダのソースを利用する。

### Strict CSP
ディレクティブにホスト名を指定したCSP設定ではXSSの脆弱性が発生するケースがあるらしく、Googleではホスト名を指定する代わりに`nonce-source`や`hash-source`を使った「Strict CSP」を推奨しているそう。

```bash
Content-Security-Policy: 
  script-src 'nonce-r4nd0m123abc' 'strict-dynamic';
  style-src 'nonce-r4nd0m123abc' 'unsafe-inline' https:;
  object-src 'none';
  base-uri 'none';
  require-trusted-types-for 'script'
```

- 'strict-dynamic'
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

- object-src
  - `<object>`, `<embed>`, `<applet>`要素の制御
  - `object-src 'none'`と指定することで Flash などのプラグインを悪用した攻撃を防げる

- base-uri
  - `<base>`要素（そのページ内のリンクやリソースのURL基準となるURL{例：相対パス}を設定する）で使用可能なURLを制御
  - `base-uri 'none'`と指定することで、攻撃者によって罠サイトへのURLへと変更されるような`<base>`要素の挿入をブロックする

#### nonce-source
- 概要: サーバが生成する一意のランダム値（トークン）を使用してスクリプトを許可
- 形式: `'nonce-[BASE64値]'`
- 特徴: リクエストごとに異なる値（トークン）を生成し、予測不可能

```bash
Content-Security-Policy: script-src 'nonce-r4nd0m123abc'
```

- nonce属性を用いたインラインスクリプトの実行可否の例<br>
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

> [!NOTE]
> nonce-source が有効なページでは、onclick属性などで指定されたイベントハンドラーの実行が禁止される<br>
> 対応としては`addEventListener`でクリックイベントを指定する

#### hash-source
- 概要: スクリプトやスタイルの内容をハッシュ化（ハッシュ値を指定）して許可。<br>ハッシュ値が異なればそのスクリプトは実行されないので hash-source は常に同じ値でも問題ない。<br>HTML, CSS, JavaScript のみで構成された静的サイトの場合、リクエストごとに nonceの値を生成できないが、 hash-source だと安全にCSPを設定できる
- 形式: `'sha256-[ハッシュ値]'`, `'sha384-[ハッシュ値]'`, `'sha512-[ハッシュ値]'`
- 特徴: スクリプトの内容が変更されるとハッシュ値も変わるため、改ざんを検知可能

```bash
Content-Security-Policy: script-src 'sha256-xyz123...'
```

### Trusted Type
Trusted Typeとは、WebアプリケーションでXSS攻撃を防ぐためのWeb標準APIを指す。危険なDOM APIへの**文字列の直接代入を制限**し、代わりに「信頼できる型」を使用する（＝**ポリシーを強制する**）ことで悪意のあるスクリプトの実行を防ぐ。<br>
このポリシーの強制が重要で、例えばサニタイズ処理用の関数を用意していたとしても開発者が実装漏れするリスクがある。Trusted Typeを指定しておけば（ポリシー強制によって）漏れの心配がなく、リスク検知を行ってくれる。

- CSPでの設定
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
- document.write
- eval
- `<script>`要素の src属性など

#### 型の種類：
- TrustedHTML：HTML文字列用
- TrustedScript：JavaScript文字列用
- TrustedScriptURL：スクリプトURL用

### Report-Only モード
CSPはXSSを防ぐ強力な手段だが、間違った実装をすると（JavaScript）プログラムの動作不具合を引き起こす可能性もある。そこで、**CSP適用時にWebアプリケーションの動作チェックを担うテストのために用意されているのが「Report-Only モード」**である。<br>
CSPの実施においては、Report-Only モードで数週間～数か月運用してみてCSP違反がないことを確認した上で実施し、 **CSP適用後もレポートを送信して監視を続けることが推奨**されている。

#### 段階的なCSP導入ロードマップ
##### Phase 1: Report-Onlyモードで検証
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report

##### Phase 2: 基本的な制約を適用
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.trusted.com

##### Phase 3: Strict CSPへ移行
Content-Security-Policy: 
  script-src 'nonce-{random}' 'strict-dynamic';
  object-src 'none';
  base-uri 'none'

#### Report-Only モードの概要
Report-Only モードとは、CSP適用時に発生する影響をまとめたレポートをJSON形式（かつPOSTメソッド）で送信する機能である。Webアプリケーションには実際に適用しないので影響はないものの、もし適用していた場合の不具合検証をチェックできる。

- Report-Only モードの設定（Content-Security-Policy-Report-Onlyヘッダを使用）
  - HTTPヘッダ
```bash
Content-Security-Policy-Report-Only: default-src https:;
  report-uri /csp-report-url/;
  report-to csp-endpoint;
```

実際に活用する際は、サーバへ送信されたJSONデータをデータベースなどに保存しておき、適当なツール（例：`Redash`など）を使って開発者がレポート内容を検索しやすくしておくのが推奨されている。その際、User-Agent などヘッダの情報も保存しておくとユーザーが使用したブラウザ情報なども確認できるのでエラー調査に役立つ。

> [!NOTE]
> **`meta`要素では、Report-Only モードの設定は不可能**なので注意

## CSRF（クロスサイトリクエストフォージェリ）
攻撃者の用意した罠によってWebアプリケーションがもともと持っている機能（アカウント操作や投稿などログイン後の機能）がユーザーの意思に関係なく呼び出されてしまう攻撃（アカウント乗っ取りのような）を指す。<br>
XSSと違って、攻撃者が自由にスクリプトを動作（例：不正なリクエスト発行など）させるのは不可能。<br>
ただし、Webアプリケーションが持つ機能に対して（ユーザー本人になりすまして）不正な操作（例：送金処理やアカウント削除、投稿など）を行うことが可能となる。

### 基本的な仕組み
1. ユーザーのセッション情報を攻撃者が詐取
2. それを使って、正規ユーザーになりすます形でリクエストを送信（不正な操作を実行）

#### 詐取から被害発生までの事例フロー
1. ユーザーが銀行サイトへログイン
2. ログインに成功すると[セッションIDがCookieに書き込まれる](#クッキー)
3. ユーザーが、攻撃者へ送金させるための不正なフォームが仕掛けられた**正規サイトそっくりの罠サイトへ誘導**される
  - [`<form>`要素から送信される内容は同一オリジンポリシーの制限を受けない](#制限されないクロスオリジンアクセス事例8例)
  - 銀行サイトのCookieがブラウザに保存されている場合は、それに準じてユーザーを誤認して処理を進めてしまう
4. [ユーザーのCookie付きで罠サイトから銀行サイトへ不正なリクエストが自動で送信される](#補足自動的なcookieの送信)
5. 銀行サイトのサーバは（送信されたCookieに準じた） **ログイン済みユーザーからのリクエストと勘違いしてフォームの内容を処理** してしまう

### CSRFへの対策方法
#### トークン発行
罠サイトからの不正なリクエストなのか、Webアプリケーションからの正規のリクエストなのかを**サーバ内で検証するのが最も重要な対策**となる。この要点を抑えるのが「トークン（乱数・一意な固有の文字列）発行」という対策方法になる。

##### トークン発行による防御の仕組み
1. ページアクセスのリクエストを受け取ったサーバは、**ランダムな文字列（トークン）を生成してセッションごとにサーバ内に保管**し、そのトークンをHTMLに埋め込む

なお、トークンは以下のいずれかの方法で実装する：<br>
※いずれも攻撃者がトークンを推測できないよう、暗号学的に安全な乱数生成が必須<br>
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

2. フォーム送信時に、CSRF対策用のトークンも一緒に送信させる
```bash
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: sessionid=xyz789abc123; JSESSIONID=AB12CD34EF56
Content-Type: application/x-www-form-urlencoded
Content-Length: 89

csrfToken=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6&to=john%40example.com&amount=1000
```

3. サーバは受け取ったトークンと、セッションごとに保管したトークンとが一致するか検証し、一致しなかった場合は不正なリクエストとして処理する

> [!NOTE]
> 攻撃者はセッションごとに変化するトークンを知ることができないので、サーバ内にある各セッションに紐づいたトークンと同じ値を送ることは不可能となる。<br>
> 多くのフレームワークが「ワンタイムトークン」の発行を自動で行ってくれるので、それら実績のあるフレームワーク（例：`Django`, `Ruby on Rails`, `Laravel`）やライブラリ（例：`Axios`, `NextAuth.js`）を使用するのが無難。

#### Double Submit Cookie（二重送信クッキー）
トークン発行の対策方法では、サーバ内でセッションごとにトークンを保管するアプローチと説明したが、ブラウザのCookieにトークンを保持させる方法もある。

##### 二重送信クッキーによる防御の仕組み
1. サーバがトークンを生成
2. そのトークンをCookieに設定
  - ※セッション用のCookieとはまた別物
  - ※正規ページからのログイン時に、セッション用Cookieに加えて、CSRF対策用のトークンを持った**HttpOnly属性の付いていないCookieを発行**する
    - HttpOnly属性が付いていないので（JavaScriptからCookieにアクセス可能になり）**XSSのリスク**が高まる
3. 同じトークンをフォーム（またはリクエストヘッダ）にも含める
  - ブラウザのJavaScriptを使ってCookie内のトークンを取り出し、フォームデータと共にCookieもサーバに送信する
    - ※ドメインが異なるページのCookieにはアクセスできないようブラウザが制御しているので、正規ユーザーが罠サイトを踏んでも罠サイト側でCookieを詐取するのは不可能
4. サーバはCookieのトークンとリクエスト内のトークンが一致するかチェック（※一致しない場合は不正なリクエストとしてエラー処理）

> [!NOTE]
> - `Double Submit Cookie`の重大な制限
>   1. サブドメイン攻撃に脆弱
>      - 攻撃者が`evil.example.com`を制御できる場合、`.example.com`ドメインにCookieを設定可能
>   2. XSS脆弱性がある場合、完全に無効化される
>      - HttpOnly属性がないため、攻撃者がトークンを読み取り可能
>
> 対応方法: サーバーサイドでのトークン検証を優先し、`Double Submit Cookie`は補助的な対策として使用する

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

##### 二重送信クッキーのユースケース
- APIサーバとフロントエンド用のサーバが分かれているような場合<br>
リクエストを受ける側のサーバ（APIサーバ）では（フロントエンド用のサーバが発行した）トークンを保持できない。フロントエンド用のサーバが生成したトークンをAPIサーバに保存したいケースにおいて二重送信クッキーは有効な手となる。

> [!NOTE]
> - Originヘッダを利用したCSRF対策<br>
> 上記ケースの場合は、Originヘッダを利用してCSRF対策を取ることもできる<br>
> APIサーバ内でOriginヘッダを検証することで、許可していないオリジンからのリクエストを拒否できるため<br>
> ※Originヘッダはリクエスト送信元オリジンの文字列を値として持っていて、リクエスト時にブラウザに自動的に付与される

#### SameSite Cookie
プライバシー保護の観点から考案された SameSite Cookie だが、それを応用して Cookieの送信を同一サイト（SameSite）に制限することで実現するCSRF対策。なお、同一サイト（SameSite）とは[eTLD+1 が同一のURL](#サイドチャネル攻撃を防ぐ-site-isolation)を指す。<br><br>

CSRFとは、つまるところ攻撃者が罠サイト経由で正規ユーザーのセッション（に紐づくCookie）を詐取し、それを利用される（正規ユーザーになりすます）形で不正なリクエストが行われてしまうという攻撃である。<br>
そのため、ログイン済みのセッション情報を保管しているCookieさえ送信しなければ多くのCSRF攻撃を防御できる。

##### SameSite Cookie による防御の仕組み
`Set-Cookie`ヘッダでCookieをセットする際に`SameSite`属性を指定する。

```bash
Set-Cookie: sessionid=abc123; SameSite=Strict; Secure; HttpOnly
```

###### `SameSite`属性に指定できる値
- `Strict`<br>
クロスサイトから送信するリクエストにはCookieを付与しない
  - ※他のWebアプリケーションのリンクから遷移した際にもCookieを送信しない設定のため、一度ログインしていたとしても未ログイン状態となる
- `Lax`<br>
デフォルト値。URLが変わるような画面遷移かつGETメソッドを使ったリクエストであれば、クロスサイトでもCookieを送る。なお、開発者が`SameSite`属性を指定していない場合 Chrome や Edge などでは`Lax`を指定する（後述）。
  - ※他の方法（例：GETメソッド以外のリクエストや`fetch`関数などを用いたJavaScriptから送信されるリクエスト）を使った**クロスサイトからのリクエストにはCookieを付与しないのでCSRF対策となる**
  - ※上記性質から、意図せずCookieが送信されないバグを見つけた場合は`SameSite`属性値をチェックしてみると良い
- `None`<br>
サイトに関係なく、すべてのリクエストでCookieを送信する

> [!NOTE]
> - `SameSite`属性を指定しない場合、一定時間後に`Lax`が付与される（※ただしこれはChromeの一時的な緩和措置であり、すべてのブラウザで適用されるわけではない）<br>
> `SameSite=Lax`（デフォルト）の場合「クロスサイトからのリクエストにはCookieを付与しない」ので、Webアプリケーションに意図しない影響を及ぼすリスクがある<br>
> そのため Chromeなど一部ブラウザでは、緩和策として **`SameSite`属性が指定されていないCookieは発行後 2分ほど経過した後に`Lax`となる** ようにしている。<br>
> つまり、**Cookie発行から2分ほどはCSRFのリスクがある**ので、`Lax`がデフォルトであるのを過信して`SameSite`属性を指定しないことを是とせずに、この緩和策を保険的対策としてとらえておく方が良い

#### CORSを活用
CORSのプリフライトリクエスト（事前にリクエスト内容をサーバに検証してもらってから実際に通信を行うという安全なリクエスト方法）を利用する形でCSRF対策を取ることも可能。しかし、プリフライトリクエストの送信によってリクエスト回数が増えるのでパフォーマンス面で良くない影響があるため、最終手段として念頭に置く程度でも良い。

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

- サーバ側（`Node.js`/`Express`）でプリフライトリクエストを検証
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
クリックジャッキングは、ユーザーの意図とは異なるボタンやリンクをなどをクリックさせることで、意図しない処理を実行させる攻撃のこと。<br>
具体的には、**正規ページの上に全く同じサイズの透過背景（別レイヤー層）のコンテンツを敷いて正規ページのCTAボタンなどをクリックすると、透過背景の悪意あるコードが仕込まれたボタンがクリックされたことになってしまう**ような現象。

### クリックジャッキングの仕組み
1. 攻撃者は正規サイトを iframe で読み込み、その上に透明レイヤーや別の要素を配置する
2. ユーザーは正規サイトのボタンを押しているつもりだが、実際には攻撃者の意図したリンクやボタンを押してしまう
3. これにより不正送金、アカウント設定変更、SNSシェアなどの強制操作が行われる

### クリックジャッキングの対策方法

#### X-Frame-Options ヘッダ
`X-Frame-Options`ヘッダを付与されたページは iframe などフレーム内へのページ埋め込みが制限される。

- `X-Frame-Options: DENY`<br>
全てのオリジンに対してフレーム内への埋め込みを禁止

- `X-Frame-Options: SAMEORIGIN`<br>
同一オリジンからのみフレーム内への埋め込みを許可（クロスオリジンからは禁止）

- `X-Frame-Options: ALLOW-FROM uri`（※不安定なので使用時は慎重に）<br>
`ALLOW-FROM`の後に続く *uri* の箇所に指定したオリジンに対してフレーム内への埋め込みを許可する。 *uri* の部分には`https://example.com`のようなURIを指定する。
  - ※`ALLOW-FROM`をサポートしていないブラウザや、 **この機能自体にバグがあったり**するので、オリジンを指定したい場合はCSPの`frame-ancestors`ディレクティブを利用するのが無難

#### CSPの`frame-ancestors`ディレクティブ
`X-Frame-Options`同様に、フレーム内へのページ埋め込みを制限する。

- `Content-Security-Policy: frame-ancestors 'none'`<br>
`X-Frame-Options: DENY`と同じ。全てのオリジンに対してフレーム内への埋め込みを禁止する。

- `Content-Security-Policy: frame-ancestors 'self'`<br>
`X-Frame-Options: SAMEORIGIN`と同じ。同一オリジンからのみフレーム内への埋め込みを許可（クロスオリジンからは禁止）

- `Content-Security-Policy: frame-ancestors uri`<br>
`X-Frame-Options: ALLOW-FROM uri`と同じ。`ALLOW-FROM`の後に続く *uri* の箇所に指定したオリジンに対してフレーム内への埋め込みを許可する。 *uri* の部分には`https://example.com`のようなURIを指定する。

> [!NOTE]
> `frame-ancestors example.com`のようにスキーム（プロトコル）を指定しない方法をはじめ、`frame-ancestors https://*.example.com`のようにワイルドカード（`*`）を使用して文字列の部分一致を指定する方法もある<br>
> また、`frame-ancestors 'self' https://*.example.com https://site.example `のように複数指定することも可能

## クリックフィックス（ClickFix）
ウェブページに偽の警告画面や偽CAPTCHAなどを表示し、その解決策として**不正な操作方法を提示**することで、**ユーザー自身にPCを操作させてマルウェアをダウンロードさせる**手法。Windowsに標準搭載されているPowershellやコマンドプロンプトなどを悪用する。

### クリックフィックスの事例紹介
1. 機械的なアクセスでないことを証明させる**「偽CAPTCHA画面」が表示**される
2. 証明の方法として`［Windows］＋［R］`キーでWindowsの「ファイル名を指定して実行」を表示し、`［Ctrl］＋［V］`キーを押して［Enter］キーを押すように、と指示される
3. 手順を表示するために**画面をクリックしたときクリップボードに悪意のあるコマンドの文字列がコピー**される
4. 操作が何を行うものか理解せず、促されるままに操作してしまったユーザーは、マルウェアを自分でインストールしてしまうことになる

### クリックフィックスの対策方法
アドレスバーに記載されたアドレスが怪しい形態でないかを確認するとともに、いつもと異なる証明方法（特定ファイルの実行や貼り付け作業など）の場合は処理を進めない

## オープンリダイレクト
オープンリダイレクトとは、Webアプリケーション内にあるリダイレクト機能を利用して罠サイトなど攻撃者の用意したページへ強制遷移させる攻撃を指す。フィッシングサイトや悪意あるスクリプトが埋め込まれたページへリダイレクトさせられて、ユーザーの機密情報が盗まれるというリスクがある。<br>
****ユーザーは正規のリンク先にアクセスしたつもりでも、知らぬ間に罠サイトへ遷移してしまっている****のがオープンリダイレクトの特徴。

### オープンリダイレクトの仕組み
多くのWebアプリケーションには、ログイン後や処理完了後に特定ページへ遷移させる「リダイレクト機能」が存在する。<br>
このとき、遷移先のURLをクエリパラメータとして外部から受け取る仕組みになっていると、攻撃者が意図的に改ざんしたURLをユーザーに踏ませることで、次のような流れで攻撃が成立する。

1. 攻撃者が正規ドメインを利用して、リダイレクト先パラメータを細工したURLを作成する
```
https://example.com/redirect?next=https://evil.com
```
2. ユーザーは「example.com」の正規ドメインであるため安心してアクセスする
3. 結果、サーバが外部入力された https://evil.com をそのまま使用してリダイレクト処理を行う
4. 最終的に、ユーザーは攻撃者の用意した**罠サイトに意図せず遷移**してしまう

### オープンリダイレクトの対策方法
#### URL検査（ホワイトリスト方式）
オープンリダイレクトの主な原因は、外部からパラメータに指定されたURLをそのままリダイレクト処理に使ってしまうことにある。
対策としては、外部入力されたURLを**事前に検証**し、以下を確認する必要がある。

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
      return res.redirect("/home");
    }

    // 条件3: 許可された外部ドメインの場合 → OK
    if (allowedHosts.includes(url.hostname)) {
      return res.redirect(url.href);
    }

    // それ以外は拒否 → デフォルトページへ
    return res.redirect("/home");

  } catch (e) {
    // パースに失敗した場合も安全に処理
    return res.redirect("/home");
  }
});

app.get("/home", (req, res) => {
  res.send("This is a safe home page");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

> [!NOTE]
> クライアントサイドのJavaScriptだけで制御しても完全な防御にはならない（※攻撃者は直接サーバにリクエストを投げられるため）ので、実際には上記のようにサーバーサイドで検証することが推奨されている。

## 認証・認可
### Authentication： 認証（あなたは誰？）
ユーザーが**本当にその人であるか**を確認するプロセスで、誰がアクセスしているかを判別することが目的。
- 例：ログイン機能、多要素認証、二段階認証、生体認証

#### 認証の種類
##### SMS認証
ログインに必要なリンクやパスコードなどの情報をSMSで送信し、ユーザーが受信したメッセージ内の情報を使ってログインする認証方法

##### ソーシャルログイン
GoogleやGitHub、Xなど各種ソーシャルサービスのアカウントを使ってログインする認証方法

##### FIDO（Fast IDentity Online）
指紋認証や顔認証、パスコードなどをもとに生成した公開鍵と秘密鍵を利用してユーザー認証する技術

##### WebAuthn（パスキー）
FIDOの発展版「FIDO2」をWebで利用するために W3C が策定した仕様で複数のブラウザで実装されている。また、WebAuthnは「パスキー（Passkeys）」の技術的基盤となる仕様でもあり、現在 WebAuthnという土台の上に、各社がパスキーという形で実装を進めている。

#### 古くからあるパスワード認証に対する攻撃
##### ブルートフォース攻撃（総当たり攻撃）
色々な組み合わせのIDやパスワードをひっきりなしに入力して突破しようとする攻撃。これの副次的効果として、ターゲットサイトをアクセス過多にして処理負荷からダウン（サーバの処理対応量を超過させて処理できないようにする）させるDDoS攻撃・DoS攻撃もある。しかし、ブルートフォース攻撃の主目的はログイン突破である。

##### 辞書攻撃
一般的な単語や予測可能なID・パスワードを網羅的に入力して突破しようとする攻撃。

##### パスワードリスト攻撃
過去の漏洩データから得られた実際のID・パスワードを用いてログインを試みる攻撃。

##### リバースブルートフォース攻撃
パスワードを固定してID入力に総当たり攻撃してくる攻撃手法。この攻撃の場合、従来のログイン試行回数制限による対策では防御が困難となる特徴がある。

### Authorization： 認可（どのような権限を持っている？）
認証済みのユーザーが**どの操作やリソースにアクセスできるか**を確認するプロセス。許可されていない操作は拒否される。
- 例：未ログイン状態（他人の投稿の一部閲覧のみ）、ログイン状態（他人の投稿閲覧をはじめ、自身の投稿や編集など）

### ログイン情報の漏洩に注意する
#### ユーザー情報を入力するページにおいて、Web解析ツールの導入は慎重に
`EFO`：`Entry Form Optimization`（エントリーフォーム最適化）の観点からフォームにWeb解析ツールを導入しているところも少なくないが、 **ユーザーが入力したセンシティブ情報がWeb解析業者に（誤って）送られる**ケースもある。フォームへのWeb解析ツール導入時は設定を変えたりして、Web解析サービスにデータが送られないようにするのも情報漏洩のリスクヘッジとなる。

#### ブラウザへのセンシティブ情報の保持は慎重に
##### Cookieの取り扱い
ログイン情報やアクセストークンをブラウザに保存しておけば、再度Webアプリケーションにアクセスした時もログイン状態を維持できる。ログイン状態を把握する「セッションID」や「トークン」の保管場所には、古くからあるCookieが選ばれることも多い。しかし、通信が盗聴された時やXSS攻撃でログイン情報やアクセストークンが漏洩するリスクもある。そこで、 **ログイン情報やアクセストークンをCookieに保存する際には以下のような設定を行ってカバーしておく**こと。

- HTTPS接続でしかCookieを送信しないように制限する`Secure属性`を設定
- JavaScriptではアクセスできないように制限する`HttpOnly属性`を設定

##### Webストレージ（`localStorage`,`sessionStorage`）使用時の注意点
Webストレージに保存されたデータは**同一オリジンポリシーによって制限されており、データを保存したオリジンと異なるオリジンはそのデータにアクセスできない**。<br>
しかし、Webストレージに保存したデータは**JavaScriptからのアクセスを制限できない**ため、**WebアプリケーションにXSS脆弱性があるとデータ漏洩のリスクが高まる**。<br><br>

この点、XSS脆弱性があったとしても`HttpOnly属性`を設定したCookieだとセキュリティ面での優位性は高い。<br><br>

他にも例えば、APIサーバとフロントエンド用のサーバが分かれているような場合に、リクエストを受ける側のサーバ（APIサーバ）では（フロントエンド用のサーバが発行した）トークンやCookieを保持または妥当性の検証ができない。<br>
このような時でも、 **ログイン情報などはWebストレージに保存せず、必要な時にサーバへ都度問い合わせる方が安全**である。

##### Webストレージ保存を実装する開発者に必要な意識
ログアウト時にWebストレージの情報を削除する処理を実装していても、セッション切れでログアウトしてしまうとユーザーやWebアプリケーションの意図とは関係なくWebストレージにセンシティブ情報が残ってしまう。<br>
例えば、ログイン情報や機密情報が残ってしまった場合、XSS脆弱性によって情報漏洩するリスクがある。<br>
他にも、職場やネットカフェなどの共有PCの`localStorage`にそれら情報が残っていると、他の利用者が情報を盗み見ることも可能となってしまう。<br>
開発者はこのようなリスクと危険性を意識しながらWebストレージに保存していいデータかどうかを慎重に検討する必要がある。

### 補足：パスワード入力時のUXを向上させるフォームづくりのTips
> [!NOTE]
> #### パスワード入力時のUXを向上させるフォームづくりのTips
> `<input type="password">`は入力すると`*`で視認できなくなるので、「パスワードを確認」や「目のアイコン」を用意してユーザーがそれをクリックすると`<input type="text">`となって視認できるようにすることでUXを向上させられる。

- 実装例<br>
```js
const passwordInput = document.querySelector('input[type="password"]');
const toggleButton = document.querySelector('button.toggle-password');

const eyeIcon = document.querySelector('#eyeIcon');
const eyeOffIcon = document.querySelector('#eyeOffIcon');
    
toggleButton.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';

  // inputのtypeを'text'と'password'で切り替え
  passwordInput.type = isPassword ? 'text' : 'password';

  // アイコンの表示も切り替え
  eyeIcon.style.display = isPassword ? 'none' : 'block';
  eyeOffIcon.style.display = isPassword ? 'block' : 'none';

  // フォーカスを維持してUXを向上
  passwordInput.focus();
});
```

## 用語集
### `CDN`（`Content Delivery Network`）
Webページのリソースを高速かつ効率よく配信するためのサーバを提供する仕組み。<br>世界中にサーバを用意することで、遠い国で開発されているWebアプリケーションでも、近くのCDNサーバからコンテンツ（※主にJavaScriptやCSSなど各種ライブラリまたは画像ファイルなど）を取得することができ、Webページの表示を高速化できる。<br><br>
オリジンサーバに都度問い合わせるのではなく、近場にデータをキャッシュしておいて、それを参照する「エッジコンピューティング」の仕組みに似ている。
