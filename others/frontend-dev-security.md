# frontend-dev-security
[フロントエンド開発のためのセキュリティ入門 知らなかったでは済まされない脆弱性対策の必須知識](https://www.shoeisha.co.jp/book/detail/9784798169477)に関するまとめ（個人的備忘録）

## 前提として
- セキュリティの動向は時代背景や攻撃手法の変化から年々変わるものという意識を持つ

## 細目
### 機能要件・非機能要件
#### 機能要件
顧客からのヒアリングなどを通じて得る顧客要望（システムで必ず満たすべき）を指す
#### 非機能要件
セキュリティ対策をはじめ、サイトのサーバー負荷対策、レスポンス速度、SEO対策など開発するシステムを利用する上で主目的にならないような事項を指す

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
### アプリケーション層：レイヤー4
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

### ネットワークインターフェース（データリンク）層：レイヤー1
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
特定の条件を満たすHTTPヘッダが付与されていたり、PUTやDELETEといったサーバー内のリソースを変更・削除するメソッドが使われている場合は慎重に処理される必要がある。<br>
そこで、このような**リクエスト時にはブラウザからサーバーへ事前リクエストして問題ないかを問い合わせる。そしてサーバーから許可されたリクエストは受理されるという仕組み**。<br>
この安全なやり取り実現のために事前リクエストすることをプリフライトリクエストという。プリフライトリクエストにはOPTIONSメソッドが用いられる。

- OPTIONSメソッド<br>
HTTPメソッドの一つで、サーバーがサポートしているHTTPメソッドを確認する

- Access-Control-Max-Ageヘッダ<br>
常時プリフライトリクエストを行うと、ネットワーク環境が低速な場合や大量のリクエストを送る場合などにおいてパフォーマンス面で支障をきたす可能性がある。そこで、プリフライトリクエストの内容をキャッシュさせておく際にAccess-Control-Max-Ageヘッダを使用する。
```bash
# キャッシュ時間：1時間
Access-Control-Max-Age: 3600
```

#### 代表的なリクエストヘッダ
開発者ツールの`Network`パネルから確認可能

##### Host
- **概要**: リクエスト先のホスト名とポート番号を指定
- **例**: `Host: www.example.com`

##### User-Agent
- **概要**: クライアントのブラウザやアプリケーションの情報を送信
- **例**: `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`

##### Accept
- **概要**: クライアントが受け入れ可能なコンテンツタイプを指定
- **例**: `Accept: text/html,application/json`

##### Accept-Language
- **概要**: クライアントが希望する言語を指定
- **例**: `Accept-Language: ja,en-US;q=0.9`

##### Accept-Encoding
- **概要**: クライアントが対応している圧縮方式を指定
- **例**: `Accept-Encoding: gzip, deflate, br`

##### Authorization
- **概要**: 認証情報（トークンやパスワード）を送信
- **例**: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

##### Cookie
- **概要**: 以前にサーバーから送信されたクッキーを送信
- **例**: `Cookie: session_id=abc123; user_pref=dark_mode`

> [!IMPORTANT]
> - 補足<br>
> ページ遷移時やフォーム送信時といったリクエスト処理時に、**ブラウザは`Cookie`を自動的にサーバへ送信**する。
> この働きにより元来ステートレスなHTTPが状態（ログイン有無やカートの中身などの情報）維持できるようになる。

##### Referer
- **概要**: リクエストの元となったページのURLを指定
- **例**: `Referer: https://www.google.com/search?q=example`

##### If-Modified-Since
- **概要**: 指定日時以降に更新されたリソースのみを要求
- **例**: `If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT`

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
content-lenght: 648
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
- **概要**: HTTPステータスコードとメッセージを示す
- **例**: `200 OK`, `404 Not Found`, `500 Internal Server Error`

##### Server
- **概要**: サーバーソフトウェアの情報を送信
- **例**: `Server: Apache/2.4.41 (Ubuntu)`

##### Set-Cookie
- **概要**: クライアントにクッキーを設定（保存）するよう指示
- **例**: `Set-Cookie: SESSION_ID=abc123; Path=/; HttpOnly`
    - **保存形式**：`SESSION_ID: abc123`（`キー: 値`）

> [!NOTE]
> ##### セッション
> 訪問先サイトのサーバ側で管理する「訪問ユーザーの状態情報」。<br>HTTPは原則ステートレス（※前回のやり取り内容を覚えていない）なので、セッションを用いてユーザーのログイン有無やカート情報、クッキーやキャッシュ情報などを管理する
> ###### クッキー
> セッションIDをはじめ、言語設定や表示設定など先のユーザー固有情報を管理・把握する一意の識別子。<br>訪問先サイトのサーバーが発行し、閲覧ブラウザに保存される。4kbほどのデータ容量しか無いので多くの情報は保存できない
> ###### キャッシュ
> 訪問先サイトのアセットデータ（画像やファイルなど）を一時的に保持してブラウザのレンダリング負荷を軽減する働きを持つ

##### Location
- **概要**: リダイレクト先のURLを指定（主に3xxステータスで使用）
- **例**: `Location: https://www.example.com/new-page`

##### Cache-Control
- **概要**: キャッシュの動作を制御
- **例**: `Cache-Control: no-cache, must-revalidate`

##### Expires
- **概要**: リソースの有効期限を指定
- **例**: `Expires: Wed, 21 Oct 2015 07:28:00 GMT`

##### Last-Modified
- **概要**: リソースが最後に更新された日時を示す
- **例**: `Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT`

##### ETag
- **概要**: リソースの固有識別子（バージョン管理用）
- **例**: `ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"`

##### WWW-Authenticate
- **概要**: 認証が必要な場合の認証方式を指定
- **例**: `WWW-Authenticate: Basic realm="Restricted Area"`

##### HTTPメソッド
- GET
    - 役割: サーバーからリソースを取得する
    - 特徴: 安全で冪等性がある（何度実行しても同じ結果）
    - 使用例: Webページの表示、データの取得

- POST
    - 役割: サーバーにデータを送信して新しいリソースを作成する
    - 特徴: 安全ではなく、冪等性もない
    - 使用例: フォームの送信、ユーザー登録、データの作成

- PUT
    - 役割: サーバー上のリソースを更新または新規作成する
    - 特徴: 冪等性がある（同じ操作を繰り返しても結果は同じ）
    - 使用例: ファイルのアップロード、データの完全更新

- DELETE
    - 役割: サーバー上のリソースを削除する
    - 特徴: 冪等性がある
    - 使用例: ファイルの削除、ユーザーアカウントの削除

- HEAD
    - 役割: GETと同じだが、レスポンスボディを返さずヘッダーのみを取得
    - 特徴: 安全で冪等性がある
    - 使用例: リソースの存在確認、メタデータの取得

- CONNECT
    - 役割: プロキシサーバーを通じてSSL/TLSトンネルを確立する
    - 特徴: 主にHTTPS通信でプロキシを経由する際に使用（※通信先の制限などをしないと攻撃者に悪用されるリスクがある）
    - 使用例: プロキシサーバー経由でのHTTPS接続、VPN接続

- OPTIONS
    - 役割: サーバーがサポートしているHTTPメソッドを確認する
    - 特徴: 安全で冪等性がある
    - 使用例: CORS（Cross-Origin Resource Sharing）での事前確認

- PATCH
    - 役割: リソースの部分的な更新を行う
    - 特徴: 冪等性は実装によって異なる
    - 使用例: ユーザー情報の一部更新、設定の変更

- TRACE（現在ではほとんど使用されていない）
    - 役割: クライアントのリクエストがサーバーに到達するまでの経路を確認
    - 特徴: 安全で冪等性がある
    - 使用例: デバッグ、ネットワーク診断（セキュリティ上の理由で無効化されることが多い）

#### 代表的なエンティティヘッダ
リクエストとレスポンスのどちらにも使えるHTTPヘッダのことをエンティティヘッダという。

##### Content-Type
- **概要**: 送信データ（リソース）のメディアタイプを指定
- **例**: `Content-Type: application/json; charset=utf-8`

##### Content-Length
- **概要**: 送信データ（リソース）のバイト数を指定
- **例**: `Content-Length: 1024`

##### Content-Encoding
- **概要**: データの圧縮方式を指定
- **例**: `Content-Encoding: gzip`

##### Content-Language
- **概要**: データの言語を指定
- **例**: `Content-Language: ja`

##### Content-Location
- **概要**: データの元となる場所のURLを指定
- **例**: `Content-Location: /documents/report.pdf`

##### Content-Disposition
- **概要**: データの処理方法を指定（インライン表示またはダウンロード）
- **例**: `Content-Disposition: attachment; filename="report.pdf"`

##### Content-Range
- **概要**: 部分的なデータ送信時の範囲を指定
- **例**: `Content-Range: bytes 200-1023/2048`

##### Allow
- **概要**: リソースで使用可能なHTTPメソッドを指定
- **例**: `Allow: GET, POST, PUT, DELETE`

## HTTPSの仕組み
HTTPSとは、暗号化されておらず、改ざんなどのリスクがあるHTTP（通信）の危険性を回避するための技術であり通信規格を指す。

### TLS（Transport Layer Security）
HTTPSは、TLSという通信プロトコルを用いてHTTPデータを暗号化して通信している
- HTTPデータをやり取りする前に、TLSハンドシェイクという一連の手順によって暗号通信を確立する<br>
TLSでの通信では、**通信データの暗号化**、**通信相手の検証**、**通信データの改ざんチェック**などを実現する

#### TLSによる 通信データの暗号化
プレーンテキストを暗号化して相手へ送り、受信側は復号してデータの中身を確認できる。暗号化と復号化に必要な鍵（秘密鍵）は、ブラウザとサーバーが情報のやり取りを行って安全に共有する。つまり、鍵を持つ者だけが復号できるので安全ということ。

- 秘密鍵<br>
TLSの通信ごとに作られる一時的なもので、通信が終わると廃棄される。これにより、データの盗聴や改ざんなどを防いでいる

#### TLSによる 通信相手の検証
電子証明書を用いて通信相手が本物かどうかを検証する。電子証明書は、認証局（CA）と呼ばれる社会的に信頼されている機関が発行していて、サーバーから送信された電子証明書が正しいかどうかをブラウザが検証する。<br>
あらかじめ、ブラウザやOSには電子証明書が組み込まれていて、それらと照合する仕組みなので、もしCAから発行されていない電子証明書が使用されている場合にブラウザは警告画面（例：この接続ではプライバシーが保護されません）を表示する。<br>
つまり、サーバー側は必ず信用できるCAから発行される電子証明書を用いなければならない。

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
> スキーム、ホスト、ポート番号のいずれかが異なる場合は**クロスオリジン（Cross-Origin）**となる

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
> localStorageやIndexedDBは「DOM API」でしかアクセスできないため、<script src> などでは直接読み出せないものの、アプリがデータをサーバー経由で返す仕組みを持っていると、別経路から抜かれる可能性がある。
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

これらのHTML要素からのアクセスも、`crossorigin`属性やCORS対応することでアクセス制御できる。<br><br>
CORSとは、ここまでの説明通りクロスオリジンから受信したレスポンスのリソースへのアクセスは禁止されているものの、レスポンスに付与されている一連のHTTPヘッダによって、**サーバーからアクセス許可が出ているリソースへはアクセスできる**ようになる仕組みを指す。

##### `crossorigin`属性
`<img>`や`<script>`要素などHTML要素から送信されるリクエストのモードは、同一オリジンに送信される場合は same-origin となり、クロスオリジンへ送信される場合は no-cors となる。これらHTML要素に`crossorigin`属性を付与することで、cors モードとしてリクエストできるようになる。

- `same-origin`<br>
クロスオリジンへのリクエストは送信されずエラーになる
- `no-cors`<br>
クロスオリジンへのリクエストは「単純リクエスト（※）」のみに制限される
  - ※単純リクエスト（Simple Request）<br>
  GETまたはPOSTによるブラウザがデフォルトで送信できるリクエストのことで、具体的には後述の`CORS-safelisted`とみなされたリクエストを指す
- `cors`<br>
CORSの設定がされていない、またはCORS違反となるリクエストが送信された時はエラーとなる。`fetch API`で`mode`引数を省略した際のデフォルト値（※仕様ではデフォルト値は no-cors なものの、多くのブラウザでは cors をデフォルト値にしている）。

---

`crossorigin`属性を付与することで cors モードとなるので、読み込むリソースのレスポンスには Access-Control-Allow-Header ヘッダなどのCORSヘッダが必要となる。<br>
例えば、`crossorigin`属性を付与した`<img>`から画像ファイルをリクエストした時に、画像ファイルのレスポンスにCORSヘッダが付与されていない場合や、サーバーから許可されていない場合は画像が表示されない。

###### `crossorigin`属性と`fetch API`の`credentials`との対応関係比較

| crossorigin属性 | fetch credentials | 同一オリジン Cookie | クロスオリジン Cookie | 認証情報 | CORSリクエスト |
|----------------|------------------|-------------------|-------------------|---------|---------------|
| 属性なし または ""（空文字）指定 | `"same-origin"` | ✅ 送信 | ❌ 送信しない | 同一オリジンのみ | クロスオリジンのみ |
| `"anonymous"` | `"omit"` | ❌ 送信しない | ❌ 送信しない | 含まない | 常に |
| `"use-credentials"` | `"include"` | ✅ 送信 | ✅ 送信 | 常に含む | 常に |

#### CORS-safelisted
CORS-safelisted とみなされたHTTPメソッドやHTTPヘッダのみが送信されるリクエストは、ブラウザがデフォルトで送信できる。つまり、**CORS-safelisted 以外のHTTPヘッダを許可する場合は、`Access-Control-Allow-Headers`を送信しなければならない**。

- example-Token-Header ヘッダを許可するコードをサーバー側の処理に追加
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

- `Access-Control-Allow-Origin`ヘッダ<br>
アクセス許可されたオリジンをブラウザに伝えるためのヘッダ
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
サイトの定義は「eTLD+1」と決まっていて、eTLD（トップレベルドメイン）とは`.com`,`.jp`,`.co.jp`,`.github.io`といったドメインを含む。<br>

#### Site Isolation によって制限されてしまった機能の有効化
Site Isolation によってサイドチャネル攻撃の大部分を防ぐことができるようになった代わりに、いくつかのAPIや機能が無効化されてしまうことになった。これら制限された機能を有効にするには、オリジンごとにプロセスを分けてサイドチャネル攻撃が発生しないことを保障せねばならならない。オリジンごとにプロセスを分離する仕組みを`Cross-Origin Isolation`といって、これをWeb開発者が任意で有効化できる仕組みが用意されている。

##### `COPR`, `COEP`, `COOP`
以下の3つの仕組みを有効化（レスポンスヘッダに設定）することで、Site Isolation によって制限された機能を扱えるようになる

- `Cross-Origin Resource Policy`（`COPR`）<br>
リソースの読み込み制御：他のオリジンからのリソース読み込みを制限するポリシー
- `Cross-Origin Embedder Policy`（`COEP`）<br>
埋め込みリソースの制御：ページに埋め込まれるすべてのリソースに対してCORSまたはCORPの明示的な許可（設定強制）を要求
- `Cross-Origin Opener Policy`（`COOP`）<br>
ウィンドウ間の情報漏洩を防止：新しいタブやウィンドウを開いた際の相互アクセスを制限する

---

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
攻撃コードがサーバーのデータベースに保存され、そのデータが表示される度に実行される形式です。掲示板やコメント機能で発生しやすいです。例：悪意のあるコードが含まれた画像データが投稿され、それを閲覧した不特定多数のユーザーがXSSの被害を受けるという最も危険なXSS攻撃。
- DOM型XSS（DOM-based XSS）<br>
これまでのサーバー側ではなく、クライアント側のJavaScriptによるDOM（Document Object Model）操作が原因で発生する形式です。

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
  - 例えば、`<a>`の`href`属性の値で、`javascript:`に続いて指定された任意のJavaScript（例：`javascript:evilAttack(1)`）は`<a>`がクリックされると実行されてしまう。**ユーザー操作によるリンク生成機能を用意する場合は注意**。

2. HTTPOnlyフラグ付きCookieを用いてJavaScriptからのアクセスを制御する（※セッションハイジャック対策）
  - サーバーサイドでCookieを発行する際にHTTPOnly属性を付与することでCookie（に格納しているセッションIDなど）の漏洩リスクを軽減する。
```js
// NG例
Set-Cookie: SESSIONID=abcdef123456

document.cookie; // 'SESSIONID=abcdef123456'が返ってくる

// OK例
Set-Cookie: SESSIONID=abcdef123456; HTTPOnly
document.cookie; // ''（空文字）が返ってくる
```

3. CSP（Content Security Policy）というブラウザの機能で、サーバーから許可されていない JavaScript の実行やリソース読み込みなどをブロックする。ほとんどのブラウザがサポート済み。
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

---

最も賢明なのはXSS対策を自動で行ってくれるようなライブラリ（React, Vue）やフレームワーク（Next.js Nuxt）を使用すること。<br>※ただし、`dangerouslySetInnerHTML`（React）や`v-html`（Vue）を使用する場合は注意が必要。<br><br>

自前実装する場合は、パース系のライブラリ（例：[`html-react-parser`](https://www.npmjs.com/package/html-react-parser), [`DOMPurify`](https://github.com/cure53/DOMPurify)）を用いたり、[Sanitizer API（HTMLコンテンツのサニタイズを行うWeb標準API）](./sethtml-guide.md/#sanitizer-api)を用いたりして安全に実装する必要がある。

## CSP（Content Security Policy）
CSPは、XSSなど不正なコードを埋め込むインジェクション攻撃を検知して被害の発生を防ぐためのブラウザの機能。サーバーから許可されていない JavaScript の実行やリソース読み込みなどをブロックする。ほとんどのブラウザがサポート済み。

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
※ディレクティブに指定されていないホスト名のサーバーからは、JavaScriptファイルを一切読み込まない（ブロックしてエラーとなる）。

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
  - CSP違反時のレポート送信先URL

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
  - script-src ディレクティブにて、DOMに設定された onclick, onfoucus などのイベントハンドラーの実行は許可するが、`<script>`要素を使ったインラインスクリプトや`javascript:`スキームを使ったJavaScriptの実行は許可しない

---

CSPを適用したページでは、明示的に`'unsafe-inline'`キーワードを用いないとインラインスクリプトやスタイルは禁止されているので使用できない。これを回避（して安全にインラインスクリプト・スタイルを実装）するために、`nonce-source`や`hash-source`と呼ばれるCSPヘッダのソースを利用する。

### Strict CSP
ディレクティブにホスト名を指定したCSP設定ではXSSの脆弱性が発生するケースがあるらしく、Googleではホスト名を指定する代わりに`nonce-source`や`hash-source`を使った「Strict CSP」を推奨しているそう。

```bash
Content-Security-Policy: 
  script-src 'nonce-r4nd0m123abc' 'strict-dynamic';
  style-src 'nonce-r4nd0m123abc';
  https: 'unsafe-inline';
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
- 概要: サーバーが生成する一意のランダム値（トークン）を使用してスクリプトを許可
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
