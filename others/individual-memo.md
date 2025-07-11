# 個人的なメモ（備忘録）
個人的なメモ / 随時更新

---

- **自然言語で表現できないことは実装できない**。まずは実装内容をしっかり把握及び精査して言語化する。

- フレームワーク中心の学習ではスキルセットが（特定のツールに）偏るリスクがある。標準的な技術を理解し、複数のツールに応用可能なスキルを育成する観点から言語レベルの基礎部分を重視したほうが良い。

## 所感
- 疎結合とコロケーションが（読み手の認知不可を軽減し修正コストを下げて）拡張性と保守性を向上させる

- 条件文や比較演算におけるスタンダードな書き方
```js
// 左辺： 調査（target）対象  （変動値）
// 右辺： 比較（compare）対象 （固定値）
target > compare
```

### 工数出し
タスクを細分化して(※ボトルネックを見つけつつ)スケジュールを逆算(かつバッファを設けて)して工数を割り出す？
  - ※ボトルネックも細分化またはカテゴライズしていく。
  例えば、技術やスキル不足(言語をはじめライブラリやフレームワークの使用など)由来なのか、<br>人的リソース由来か、<br>外部(ライブラリやAPI、協力会社との連携など)由来か、といったリスクを見つけていく。<br><br>
技術の試用検証やチームのコミュニケーション、適切な見積もりや工数を心がけて対策しておきたい。

---

## 汎用
### (目的) UX：ユーザーにストレスを感じさせないための配慮。
### (手段) UI：UXを達成するための仕様・デザイン。
例：サービスを通じて○○という**顧客体験（UX）**を提供するためには、△△や◎◎などの**デジタルインターフェース上の顧客接点（UI）**が大切になってくる。

### As-Is：現状把握
### To-Be：本来あるべき姿

### `RAG`(Retrieval Augmented Generation)：検索拡張生成
大まかに言うと「（ブラウザの自然）検索と生成を組み合わせた仕組み」のこと。生成AI（LLM： 自然言語の処理と理解に特化したモデル）が単独で回答を作るのではなく、事前に検索エンジンやデータベースから関連情報を取得（検索）して、その情報をもとに回答を生成する仕組み。

### `IO`：入出力 / input | output

### サブスクライブ（subscribe）：
購読（監視／変更検知）する。購読という言葉のように「特定の処理や挙動などをずっと見ておく（＝購読）機能や振る舞いというニュアンスで**監視／変更検知**」という意味合いになっている場合もある。
  - 参照例： [初めてのuseSyncExternalStore](https://zenn.dev/gemcook/articles/5fd016c4c8fac0#discuss)
  > `useEffect`はレンダリング後に動作しますが、`useSyncExternalStore`はレンダリング中に状態を**購読**し、サーバーとクライアント間の一貫性を維持します。

### シングルサインオン
親会社の社員証を持っていれば子会社でも身分確認できますよ的な「一つの権限・アカウントで関連する全体へ関われる」ようになる認証で、一般的には大規模なシステムで導入されるような代物。

### `CORS`の簡易説明
CORSは異なるウェブサイトが、お互いに許可を得た上で情報をやり取りできるようにするルールのようなものです。普通は、あるウェブサイトが別のウェブサイトの情報を直接取得することはできませんが、特別な約束（CORSの設定）をすることで、安全に情報を共有できるようになります。

### `Maintenance LTS`（メンテナンスLTS）
すでにアクティブな開発・新機能追加が終了し、今後は主にセキュリティ修正や重大なバグ修正のみが行われるフェーズ。<br>
既に次の LTS バージョンが登場し、役割が移行している段階。一定期間後にサポート終了（EOL: End of Life） となる。<br>
- `Node.js`の[リリーススケジュール](https://nodejs.org/ja/about/previous-releases)を確認
- 各プロジェクト（※`Next.js`が例）における`Node.js`のアップデートコマンド
```bash
npm install --save-dev @types/node@latest
```

  - `npm`のアップデートコマンド
```bash
npm install -g npm
```

実行後に以下を行って動作確認してみる

1. `npm doctor`：各種`OK`が表示されるかどうか
```
C:\Users\username>npm doctor
Connecting to the registry
Ok

Checking npm version
Ok
current: v11.1.0, latest: v11.1.0

Checking node version
Ok
current: v22.14.0, recommended: v22.14.0

Checking configured npm registry
Ok
using default registry (https://registry.npmjs.org/)

Checking for git executable in PATH
Ok
C:\Program Files\Git\cmd\git.EXE

Checking for global bin folder in PATH
Ok
```

2. `node -p "console.log('Node.js 動作確認')"`：ログ出力されるかどうか

---

> [!NOTE]
> ### `Windows OS`限定： `Node.js`アップデート後に`VSCode`で`npm`コマンドが実行できなくなった際の対処法
> `Windows`の`PowerShell`のセキュリティポリシーに関連する問題で、`Node.js`アップデート後に`npm`コマンドが実行できなくなるケースがある。<br>
> 今回、`コマンド プロンプト`では実行できるが、`VSCode`で`npm`コマンドが実行できないというケースだった。<br>
> 対処法は以下<br>
> - `VSCode`で`Ctrl + ,`を押して設定を開く
>   - 検索バーに「`terminal.integrated.defaultProfile.windows`」と入力
>   - `null` → `Command Prompt`または`Git Bash`を選択
> 
> ※ `Mac`（および`Linux`）では、`Unix`ベースのシェル（`bash`, `zsh`など）を使用しており、`PowerShell`のような実行ポリシーの制限はないため、メジャーバージョンアップデート時にこのような権限の問題は発生しない

---

> [!NOTE]
> ### `package.json`と`package-lock.json`について
>   - `package.json`：<br>`package.json`は、インストールした各`npm`パッケージ(`node_modules`内の各種ファイルやデータ)のバージョンや依存関係、コマンドラインなどの情報が記載されたインストール済み`npm`リストのようなもの。<br>`npm init -y`でオールデフォルト設定の`package.json`を生成できる（**※ホームディレクトリではなく当該ディレクトリで行うこと**）。
>   - 依存関係の詳細について
>     - `dependencies`：本番環境で必要なパッケージ
>     - `devDependencies`：開発時のみ必要なパッケージ（テストツール、ビルドツールなど）
>   - `package-lock.json`：<br>他方、`package-lock.json`は各`npm`パッケージをインストールした時点のバージョンや依存関係を管理する詳細情報リストのようなもの。例えば、異なる時期に別の環境でインストールした際、都度`package.json`が生成されてしまうのでバージョンや依存関係に齟齬が出てアプリケーションが機能しない可能性がある。それを防止するためにインストール時の`package.json` の情報をロックした`package-lock.json`が必要となる。<br>※`package.json`の依存関係を更新する場合は、必ず`package-lock.json`も更新する必要がある。

---

> [!NOTE]
> ### パーミッションの数値について
> 「数値が高い / 少ない」は全く関係なく **`r`,`w`,`x`という三項目ごとの和** から成る<br>
> ```
> `r` // 読み込み（`Readable`：4）
> `w` // 書き込み（`Writable`：2）
> `x` // 実行（`eXecutable`：1）
> `-` // なにもできない：0
> ```
> 属性値 = 読み込み（r）+ 書き込み（w）+ 実行（x）
> 
> - 例：`644`というパーミッションの場合<br>
> ```
> 属性値 6：自分      = 4（r）+ 2（w）+ 0（x）
> 属性値 4：グループ   = 4（r）+ 0（x）+ 0（x）
> 属性値 4：他人      = 4（r）+ 0（x）+ 0（x）
> ```
> 
> - `Cyberduck`では、`当該ファイルを右クリック` -> `情報` -> `アクセス権` ->` unixアクセス権`（※これがパーミッション）に`数値を記入`して`enter`押下で更新完了

### `PoC`（`Proof of Concept`）
概念実証。新しいアイデアや技術の実現可能性を検証すること。技術検証との違いは、あくまで技術の実現可能性のみをスコープとするか、概念（ビジネスのアイデア全体）の実現可能性をスコープとするかという点で異なる。

### 多言語対応について
#### モダンなフロントエンド（`React`, `Vue.js`, `Next.js`等）
  - 組み込み`i18n`ライブラリ活用
    - `react-i18next`
    - `vue-i18n`
    - `Next.js i18n`
  - 特徴: フレームワークに最適化、`TypeScript`サポート、動的な言語切り替え、高い拡張性

#### `WordPress`
  - 専用プラグイン
    - `WPML`（有料）
    - `Polylang`（無料/有料）
    - `WordPress`標準機能の利用
  - 特徴: 管理画面から操作、SEO対応、翻訳管理、商用サイトに適している

#### 静的サイト
  - `Intl API`の利用
  - 言語ファイル管理
  - 静的サイトジェネレーター
    - `Jekyll`
    - `Hugo`
    - `Eleventy`
  - 言語別サイト作成
  - 特徴: 軽量、シンプルな実装、高いカスタマイズ性、メンテナンスが容易、SEO対策が可能

### 進数
```bash
# 10進数（一般的な数値）
123

# 2進数
1111011

# 8進数
173

# 16進数
7b
```

## tech汎用
### テスト駆動開発(TDD)
まずはテストを書いてエラーを起こし、そのエラーを解決するだけの必要最低限の実装をしてアプリケーションを作成

### プログレッシブエンハウスメント
ネット環境が悪かったり(例：`JavaScript`が無効化)、デバイスのスペックが低かったりする場合でも、そのサイトやサービスが提供するコア部分を見れるまたは扱える状態にしておき、逆にネット環境が良かったり、スペックが高かったりすると(`JavaScript`を用いた)リッチなユーザー体験を提供する

### シグニチャ
関数の１行目つまり関数名、引数

### モノレポ（モノリシックリポジトリ）
フロントエンドとバックエンドを含めた複数のプロジェクトを1つのリポジトリで管理する手法（一つの動作環境にシステムのすべての機能が詰め込まれている構成）。コード共有や依存関係の統一が容易になる一方で、大規模になると管理が複雑化（例：一部の変更が他の部分に思わぬ影響を及ぼす等）する。

### セッション
訪問先サイトのサーバ側で管理する「訪問ユーザーの状態情報」。HTTPは原則ステートレス（※前回のやり取り内容を覚えていない）なので、セッションを用いてユーザーのログイン有無やカート情報、クッキーやキャッシュ情報などを管理する

#### クッキー
セッションIDをはじめ、言語設定や表示設定など先のユーザー固有情報を管理・把握する一意の識別子。訪問先サイトのサーバーが発行し、閲覧ブラウザに保存される。4kbほどのデータ容量しか無いので多くの情報は保存できない

#### キャッシュ
訪問先サイトのアセットデータ（画像やファイルなど）を一時的に保持してブラウザのレンダリング負荷を軽減する働きを持つ

### ポート番号
サーバ内のサービスを識別する番号を指す。サーバは、Webアプリケーションやメールサーバ、FTPサーバなどサービスごとに個別のポート番号を割り当てることで複数のサービスを提供している。例えば、IPアドレスがインターネット上の住所とすると、ポート番号は当該アドレスにあるwebサーバーやメールサーバー、FTPサーバーといった各種サービス接続への識別用数値と言える。
- 具体例
  - Webサーバーは通常80番ポート
  - HTTPSは443番ポート
  - メールサーバー（SMTP）は25番ポート
  - FTPは21番ポート

### インタプリタ(`Ruby`, `Python`, etc)
コード1行ずつ翻訳 → 実行する

### コンパイル(`Java`, `Go`, etc)
全て翻訳してから実行する。コンパイル方式のほうがインタプリンタ方式より効率がよくて速い

### デコレータ
「装飾」の意味で、コードの構造を変更せずにクラス、クラスのフィールドとメソッドに機能を追加できる仕組み。具体的にはデコレータによってメソッド、フィールド、クラスまでも置き換えてしまうことで機能の置き換えや拡張を実現できる

### 疎結合
各々が独立自立していて複雑に絡み合っていない（密結合ではない）ので汎用性や再利用性が高い。「責務を分離する」「コンポーネント指向で作る」を意識すれば（粒度設定によるものの）自ずと疎結合になる。

### コロケーション
1つのコンポーネントに関連するすべてのリソースを同じ場所に含めること

### シングルトン(singleton) 
一度だけインスタンス化でき、どこからでもアクセスできるクラス・オブジェクトのこと

### マイグレーション
システムやデータなどを新しい環境に移行・反映すること

### エッジコンピューティング
中央集中のCloudだけでなく、エンドユーザーから物理的距離の近いエッジ（`CDN`）などで軽めのプログラムを低遅延で実行する仕組み

### `IdP`
ユーザーが複数のSaaSに対して一度のログインで安全にアクセスできるようにするサービス。代表例：`Okta` 

### `curl`（カール）
様々なプロトコルを使用してデータ転送を行うことができるコマンド。APIの動作確認でHTTPリクエストしたり、手軽にサーバーのレスポンスを確認したい時など。

## AI
- [【超初心者向け】MCPって何なん？ どう使うん？](https://qiita.com/benjuwan/items/0fb8cc0f034f8b0d942f)<br>
個人的な備忘録・キャッチアップ記録として記事にまとめ

### `Markdown AI`
`Markdown AI`とは、マークダウン記法とAI機能を活用し、誰でも簡単にWebサイトを作成・公開できるサーバレスAIサイトビルダー。ノーコードでAI機能搭載のサイトを作成でき、サーバー代やホスティング費用も必要ないそう。
  - マークダウンベースの簡単操作
  - コーディング不要でAIサイトが作れる
  - サーバー設定やデプロイが自動化されている
  - AI機能の組み込みが簡単
  - 必要に応じて`HTML`や`JavaScript`によるカスタマイズも可能

### Cline（クライン）
`Cline`は、`GitHub Copilot`のようなコーディング・プログラミングの最適化・向上、補助（支援）を担うツール（自律AI / コーディングエージェント）で、`VSCode`の拡張機能として提供されている。<br>
`Cline`自体は無料でインストール・利用できるが、それをハンドリングするためのブレイン（生成AI）がないと十全に活用できず、費用がかかるとすれば利用する生成AIのプラン料金（及び使用料）となる。
- `Cline`で使用できるモデルやプロバイダー（2025/02）
  - OpenAI (GPTシリーズ)
  - Anthropic (Claude)
  - Google Gemini
  - DeepSeek
  - AWS Bedrock
  - GCP Vertex AI
  - Mistral
  - OpenRouter
  - OpenAI Compatible
  - LM Studio
  - Ollama

- `perplexity`の回答
> 費用が発生するのは、選択したAIモデルのAPI利用料金です。これはトークン使用量に応じて課金されます。<br>
> API利用料金は、選択するAIモデルやプロバイダーによって異なります。例えば、GPT-4oは100万トークンあたり入力$2.5、出力$10、Claude 3.5 Sonnetは入力$3、出力$15です。<br>
> Clineは、プロンプトキャッシングなどの機能を通じてAPIコストの削減を支援しています。<br>
> ユーザーはCline内でトークン使用量とAPIコストをリアルタイムで追跡・管理できます。

### AIエージェント（搭載のテキストエディタ）について
`GitHub Copilot`や`Windsurf`,`Cursor`などがある。

- 試した所感記事：[Vibe Coding を試してみた感想](https://qiita.com/benjuwan/items/6b90286b9e55125ad723)

#### [`Cursor`](https://www.cursor.com/ja)
- Cursor：月額 $20
- 幅広い範囲で計画、実装を行うので、ガンガン開発を進めたい人向け
  - 0 -> 1 での実装は、`Windsurf`と比べて`Cursor`の方が費用対効果が良いかも
- ルールの設定は必須（**ルールの設定なしでバイブコーディングは自爆行為**）

##### [`Rules`（ルール）](https://docs.cursor.com/context/rules)
AIに「こんな風に開発して」という指示（メタ設定）を事前に与えておく機能。
ルールファイルは歯車アイコン（設定）から作成でき、`.cursor > rules > ファイル名.mdc`というパスで保存される。<br>以下のようなルール設定が可能
- `User Rules`: 全プロジェクト共通のルール<br>
- `Project Rules`: プロジェクト固有のルール<br>
これらをうまく使い分けることで、AIの精度と効率を大幅に向上させられる。

> [!NOTE]
> Cursor 公式ドキュメントには 500 行以下を目安にとの記載があるが、実際には 100 行以下を目安にした方が良い。<br>ルールの内容が多くなると、AI がルールを理解するのに時間がかかり、結果として AI の応答速度が遅くなるため。

- [`Rules`（ルール）設定の参考例](https://github.com/kinopeee/cursorrules/blob/main/.cursor/rules/global.mdc)

##### 所定のデータやファイルを`Cursor`に理解させることで業務を効率化

> [!NOTE]
> - 秘匿性の高いファイルには注意<br>
> `Cursor`のプライバシーモードを使っていても**各種LLMのサーバーに一時的でも内容が保存される場合がある**ので**秘匿性の高いファイルでは以下作業を行わない**ほうが無難。

1. 参照情報ソース（用語集やテンプレート、ドキュメントなど）を、`Markdown`ファイル（.md）で作成する。<br>
`.pdf`, `.csv`, `.xlsx`, `.docx`などを`.md`に変換する作業は LLM にしてもらう。<br>
（いきなり全てをAIに教えるよりも、まずは一つの知識エリア、一つのドキュメントテンプレートから試してみるのがベター。そして徐々に範囲を広げていくのが現実的だそう。）<br><br>

2. 作成した`Markdown`ファイルを、プロジェクトルートの`.cursor/docs/`ディレクトリに格納する。<br>
これにより、AIチャットで`@docs <ディレクトリパス込みのファイル名>`を使って`Cursor`にこれらの情報を参照してもらうことが可能。<br><br>

3. （必要に応じて）`.cursor/rules/*.mdc`で制約を設ける。<br>
> - .mdcファイルとは<br>
> .mdcファイルは、CursorのAIアシスタントが参照する、プロジェクト固有のルールやコンテキストを定義するための設定ファイルです。<br>
> 
> AIがコード補完、生成、リファクタリングなどを行う際に、このファイルに記述された指示やガイドラインを参照します。これにより、以下のような情報をAIに伝達できます。<br>
> 
> - プロジェクト固有のコーディング規約
> - チームで定められた命名規則
> - 特定のフレームワーク利用時のベストプラクティス
> - セキュリティに関する注意点<br>
>
> つまり、.mdcファイルを使うことで、汎用的なAIアシスタントを 「このプロジェクト専用のアシスタントへとカスタマイズできるってことですね。

> 現在では Project Rules (.cursor/rules/*.mdc) を活用することが推奨されています。公式の案内にもある通り、将来的にcursorrulesはremoveされそうです。

- 参照記事：[Cursorで使う.mdcファイルとは](https://zenn.dev/channnnsm/articles/0df0ea29d63be3)

#### `GitHub Copilot`
右下に表示される`Copilot`アイコンをクリックすると、`Copilot`のメニューが表示される。<br>
`Workspace Index`という項目にある`Build`をクリックすると、`Copilot`が当該プロジェクトのコンテキストを取得する（現在のプロジェクトのコードを解析してインデックスを作成する）。<br>
インデックスが作成されると、`Copilot`はプロジェクト内のコードをより効果的に理解し、提案を行うことができるようになる。<br>`Copilot`のインデックスは、プロジェクトのコードを解析して生成されるもので、プロジェクト内の関数や変数、クラスなどの情報を含んでいる。<br>

> 現在、Cursor や Windsurf などの VSCode のフォークエディタが流行っていますが、Github がソースコード管理の覇権を握っている以上、コードベースやソースコードの理解は Github Copilot がいずれ最も優れた AI エージェントになるのではと私は思っています。

> なぜ Copilot を使わないのか？ （...中略）Agent モードが来た現状でも、Cursor や Windsurf と同レベルとは言えないためです。最近ようやく追いついてきましたが、ターミナルとの連携や設定、操作性などまだまだで、Github の強みを活かしたコードベース理解がすごく優れているわけでもないという状態なので、コード品質の優位性が無い以上、現状はまだ Windsurf を使う判断になっています。

- 引用元：[私が Cursor ではなく Windsurf を選択した理由](https://zenn.dev/mizuko_dev/articles/92fa0a54e2a9e3)

#### [`Windsurf`](https://windsurf.com/)
- Windsurf：月額 $15
  - `Cursor`より安いものの、クレジット消費は`Windsurf`のほうが多いので**自力実装+AIサポートというスタイルの人**に向いている
- 指定したコンテキストに対してのみタスク計画、実装を行ってくれる（小さなタスクで慎重に問題を解決して行きたい人向け）
- ルール無しでいきなりやり取りする場合は、`Windsurf`のほうに優位性があるかも

#### バイブコーディング
AIにコーディング作業を委ねるスタイルで**雰囲気コーディング**という意味。

##### 作業時の留意点
- 完全にゼロから全てを任せるより、基本的な雛形を用意した方がスムーズ
  - 例えば、ルンバに掃除して貰う前にザッと掃除しておいたり、食洗機に掛ける前にサッと手洗いしておいたりなど**何かフレームワークを使う場合は、環境構築などプロジェクトの初期設定を行っておく**と良い
- 要件定義をしっかり作る
  - 生成AIを用いた要件定義の作成Tips記事：[個人的 Vibe Coding のやりかた](https://zenn.dev/yoshiko/articles/my-vibe-coding)
- 小さくタスクを振る
- 具体的な指示を意識
- エラー対応などは画像を使って指示・質問・依頼をするのも手

#### 参照情報
- [VSCode の最近 v1.99](https://qiita.com/shiminori0612/items/ae427e5b8b5765204a24)<br>
記事内に記載ある`github.copilot.nextEditSuggestions.enabled`など各種設定コマンドは、`VS Code`の左下歯車アイコン（設定）から`設定`を選択し、`設定`画面の検索バーにコマンド名を入力して検索することで確認できる。<br>
  - [Github MCP で Pull Request のレビュー依頼をする](https://qiita.com/shiminori0612/items/ef68132781937a8b0566)
- [個人的 Vibe Coding のやりかた](https://zenn.dev/yoshiko/articles/my-vibe-coding)
- [私が Cursor ではなく Windsurf を選択した理由](https://zenn.dev/mizuko_dev/articles/92fa0a54e2a9e3)

---

> [!NOTE]
> ### 支援AIに対する筆者の現状所感 
> 現状（2025年6月）の業界トレンドとして、Claudeなど各種AI（LLM）がユーザー（開発者）の目的とする成果物を生成できる（しやすい）ようなルール設定を研鑽し合っている状況だと感じています。<br>
> `xxxx.md`や`rules`などの「ルール」とは、言わば**AIに、人間側の意図を適切に汲んでもらったり、期待に沿って開発してもらったりするためのレール**であり、**最適なレールの敷き方（ベストプラクティス）を模索している段階**であるような気がするのです。<br>
> こういった状況も加味して今後はコード実装力や実装速度よりも、設計力など上流工程に関するスキルが重要になってくるように感じています。<br>
> 極力無料主義の筆者は、このレールを敷いたり、簡単にレール設定できたりなどする汎用化かつ拡張された無料版の到来を口を開けて待ちつつ、その時が来れば存分に味わえるように情報収集に勤しみながら無料版を使い倒して慣れておこうと。具体的にはプロンプトエンジニアリングが一つの要点になるかな？

---

## フロントエンド
### `Bun`
トランスパイラー、ミニファイヤー、タスクランナー、バンドラー、ビルド、ポリフィルなどの諸機能を一纏めにしたツール(コード整形やコード規約は未対応)

### jsonサーバー
ウェブアプリケーションの開発時に、実際のサーバーにリクエストを送らなくても、APIのレスポンスを模倣（モック）するためのツール

### Prettier
`JavaScript`（`Typecript`）、`HTML`や`CSS`などの言語をサポートしたコードフォーマッタ

### ESLint
コード整形(コードフォーマッタ)に加えて構文チェックを行うコード規約チェックツール。最近はESLint の設定推奨ルールを適用するとPrettierとの機能衝突の問題もあってスタイル系のルールは外されているそう

### JavaScript
#### 関数
##### 高階関数
引数に（任意・特定の）関数を受け取る関数。関数を戻り値として返す場合もある。<br>高階関数は、関数をデータとして扱うことができる特性を活かし、柔軟なプログラミングを実現する。
##### コールバック関数
（関数の）引数として渡される関数

#### クロージャ
祖先（親や兄弟）のスコープ内にある変数や関数（の参照を維持してそれら）を子から使用できる（＝子から親や兄弟の変数・関数を呼び出せる）仕組みのようなもの
```js
function sayHello() {
  const message = 'Hello';  // 外側のスコープの変数
  
  function inner() {
    console.log(message);  // 外側のスコープの変数にアクセス
  }
  
  inner();
}
sayHello();  // "Hello" が出力される
```

#### `Promise`の引数と`Promise`内での遅延処理について
- 遅延処理の実装は`Promise`インスタンスを用いる
- `Promise`インスタンスの引数には必ず2つ指定する（※`resolve`のみ使用の場合は第二引数は省略可能）
- 引数の命名は自由（`resolve`,`rejuct`でも、`success`,`failed`でもok）
  - `resolve`,`rejuct`（の引数）に渡したデータはその次の処理（`then`,`catch`）に渡せる。
    - また補足として`then`,`catch`はチェーンで複数処理をつなげていける（.then(...).then(...).catch(...)）
```js
const fetchdata = async () => {
  // Promise インスタンスの引数には必ず2つ指定する（※ resolve のみ使用の場合は第二引数は省略可能）
  // 引数の命名は自由（ resolve, rejuct でも、 success, failed でもok）
  await new Promise((resolve, reject) => setTimeout(() => reject('reject'), 3000)).catch((d) => console.error(d)); // 3秒の遅延を追加

  const res = await fetch(fetchPathUrl);
  const resObj = res.json();
  return resObj;
}
const fetchdataPromise = fetchdata();

// Promise インスタンスの引数には必ず2つ指定する（※ resolve のみ使用の場合は第二引数は省略可能）
// 引数の命名は自由（ resolve, rejuct でも、 success, failed でもok）
const fetchdataPromise = new Promise(resolve => {
  setTimeout(() => {
    fetch(fetchPathUrl).then(res => res.json()).then((resData) => resolve(resData)).then((resData) => console.log(resData)).catch((resData) => console.error(resData));
  }, 3000);
});
```

#### `includes`メソッドについて
`includes`メソッドの挙動は**配列では完全一致、文字列では部分一致**となる。ただし、文字列の部分一致を判定する際には、左辺オペランド（レシーバ）と右辺オペランド（引数）の関係が適切である必要がある。<br>具体的には、以下の条件が満たされる場合に`true`となる。
  - 左辺オペランドが右辺オペランドを部分文字列として含んでいる
  - 型が適切であり、比較可能な文字列である
```js
'SpecialGreatMeals'.includes('SpecialGreatMeals[]');
// 'SpecialGreatMeals'（という文字列内）に 'SpecialGreatMeals[]' は存在しない（`[]`がない）ため false

'SpecialGreatMeals[]'.includes('SpecialGreatMeals');
// true： `SpecialGreatMeals[]`（という文字列内）に`SpecialGreatMeals`が含まれているので true
```

---

> [!NOTE]
> #### ソフトナビゲーションとハードナビゲーションについて
>   - ソフトナビゲーション：<br>フレームワークやライブラリ（`React Router（Remix）`、`Next.js`の`Link`など）が提供するナビゲーション機能を使用し、`JavaScript`を使用してクライアントサイドで画面遷移を制御する。SPA（CSR）なのでアプリケーションの状態を維持したまま画面遷移が可能で、ブラウザの履歴API（ヒストリーAPI）を適切に制御し、ブラウザの戻る/進むボタンも正しく機能する。差分検知～更新（必要な部分のみを更新）というフローなため高速な画面遷移が特徴。
>   - ハードナビゲーション：<br>通常のHTMLの`<a>`タグによる遷移で、ブラウザの標準的なページ読み込みが発生するため**アプリケーションの状態が完全にリセットされる**。つまり、ページ全体が再読み込みされるためソフトナビゲーションに比べると遅く、フレームワークによる遷移の制御や最適化の恩恵も受けられない。外部サイトへのリンクやログアウトなどに使用するのが一般的。

---

---

> [!NOTE]
> #### `npm`と`npx`の違い
>   - `npm（Node Package Manager）`<br>`Node.js`のパッケージ管理システム。いわゆるサードパーティ製のライブラリ（便利な機能）そのものを指したり、それらをインストールするためのコマンドライン
>   - `npx（Node Package Executor）`<br>`npm`をインストールすると同時に付属してくるもの。インストールした（`node_modules`内の）ライブラリにあるコマンドラインを実行するための（コマンドライン）ツール。`npx`の主な利点は、**グローバルインストールせずに使い捨てでパッケージを実行できる**こと、また複数バージョンの衝突を避けられることにある。

---

#### `JavaScript`での無名関数とアロー関数における`this`の違い
  - 無名関数<br>イベントの発生元が`this`になる
  - アロー関数<br>呼び出し元のオブジェクト（※何もない場合は`Window`）が`this`になる
```js
const btn = document.querySelector('button');

// アロー関数
btn.addEventListener('click', ()=>{
    console.log(this); // Window
});

// 無名関数
btn.addEventListener('click',function() {
    console.log(this); // <button type="button">run</button>
});

// オブジェクト（無名関数）
const asObjMethod = {
    btnClicked: function() {
        btn.addEventListener('click',function() {
            console.log(this); // <button type="button">run</button>
        });
    }
}
asObjMethod.btnClicked();

// オブジェクト（アロー関数）
const asObjMethodAllowFu = {
    btnClicked: () => {
        btn.addEventListener('click', ()=>{
            console.log(this); // Window
        });
    }
}
asObjMethodAllowFu.btnClicked();

const obj = {
    method: ()=> {
        console.log(this); // obj （{method: ƒ}）
    }
};
obj.method();
```

## バックエンド
### PHP
> [!NOTE]  
> #### PHP制のメールフォーム機能をホスティングするだけで使える理由
>   - `html`のformタグの`action`属性に設定したメール機能実行ファイル（PHP）が`submit`（フォーム送信）時に実行される（※ブラウザの標準機能として`HTTP`の`POST`メソッドとしてフォーム内容を送信する）
>   - メール機能実行ファイル（PHP）内の`$_POST`にはクライアント（ブラウザ側）から送られた各種情報が含まれており、 **ホスティング会社のウェブサーバーがメールを取り扱えるような設定（PHPスクリプトを実行する環境{`PHPインタープリタ`}を備えている）をしている場合** はPHPの`mail()`関数などメール機能に関わるメソッドを用いてウェブサーバーとのやり取りを実現できる。
>     - `$_POST`連想配列<br>JavaScrptでいうオブジェクトのような形式で、中にはブラウザから送信されたフォーム内容や各種情報が格納されており、ブラケット記法（`obj[key]`）で各種値を扱える。
>     - PHPの`mail()`関数などメール機能に関わるメソッドを用いてウェブサーバーとやり取りした内容（＝問い合わせ内容や送受信内容）は、宛先メールサーバーに配送される。
>     - 宛先メールサーバーに配送される、とは？<br>
> 送信されたメールは、ホスティング先のメールサーバーを一時的に経由して宛先のメールサーバーへ転送される。つまり、**ホスティング先のメールサーバーは送受信やり取りにおける一時中継ポイント**なだけ。
>   - ユーザー（開発側）で必要な対応は？<br>
>     - ホスティングサービスによっては、PHPの設定ファイル (`php.ini`) でメール関連の設定 (例： `sendmail_path`など) を適切に設定する必要がある。
>     - メールフォームのPHPスクリプト自体も、送信先メールアドレス、件名、本文などを適切に設定する必要がある。
>     - スパム対策 (`reCAPTCHA`の導入など) や セキュリティ対策 (入力値の検証、クロスサイトスクリプティング対策など) は、メールフォームを安全に運用するために開発者側で考慮・実装する必要がある。

## API
### GraphQL
`REST API`のようにクライアントとサーバー間のデータ問い合わせに特化した（APIのクエリ）言語。`REST API`とは異なり「欲しいデータだけを取得する」ことができる。`Fetch API`でリクエストすることもできるし、`graphql-request`や`ApolloClient`といったクライアントライブラリを用いるのも一般的。

### RPC
`Remote Procedure Call`（遠隔手続き呼び出し）の略。クライアントから別のサーバーの関数・メソッドにリクエストを送り、そのレスポンスを受け取る。別のサーバーにある関数・メソッドを呼び出して使う（特定の処理を行う）ようなイメージ。

### gRPC
Googleが開発したオープンソースのRPCフレームワーク

### tRPC
`Typecript`を使用してサーバーからクライアントまで一貫した型安全なAPIを構築するためのフレームワーク

## DB
### `Supabase`
`PostgreSQL`ベースの`RDB`（リレーショナルデータベース）であり、`BaaS`（Backend as a Service）としてGoogleの`Firebase`の代替品と言われている。
- 主な機能は以下
  - **認証機能**<br>（5万MAUまでは無料プランでクレジットカードなしで使える）
  - ストレージ機能
  - リアルタイムデータ同期
  - エッジ関数（サーバーレス環境でのコード実行）

### `DuckDB`
列指向データベース。`BigQuery`や`Redshift`のように、データ分析用途で利用する。ちなみに、`MySQL`や`PostgreSQL`などは行指向データベース。<br>行指向の場合は意味のある単位でデータ処理できるため、更新処理やトランザクションに強い。対して、列指向は特定の列に対する計算が早く、CPUなどもリソース効率も高い。

### `Convex`
<img width="812" alt="Image" src="https://github.com/user-attachments/assets/ca2f3937-15f7-4ca1-8e0d-7385b13c525f" />

- 引用元：[【図解解説/入門】ReactとJotaiを使って実用的なNotion風ノートアプリを開発するチュートリアル【Convex/TypeScript/MDXEditor】](https://qiita.com/Sicut_study/items/ee41f1bb59fcda45a50b#convex%E3%81%A8%E3%81%AF)

---

### `SQLite`
軽量で組み込み型のリレーショナルデータベース。単一のファイルでデータベースを管理できるため、ファイルをコピーするだけで簡単にデータベースを移行できる。つまり、プロジェクト内でデータベースを持てるので外部にサーバーを立てる必要がない。本番用ではなく、一般的にはモックやプロトタイプ、小規模なプロジェクトで使用される。

### `Cloudflare D1`
> D1を使って、サーバーレスのリレーショナルデータベースを数秒で作成しましょう
- [`Cloudflare D1`](https://www.cloudflare.com/ja-jp/developer-platform/products/d1/)<br>
`Supabase`に比べると`Cloudflare D1`の制限が圧倒的に少ないので`Cloudflare D1`の方がコスパが良い。また、`RDB`（リレーショナルデータベース）のみならず、`Cloudflare KV`という`NoSQL`（Not only SQL：SQLを使わずにデータを保存するデータベース）の一種である`KVs`（Key-Value store）も利用できる。<br>
`Cloudflare Pages`でORMを使う場合は、`Prisma`より`Drizzle`のほうが（学習コストも低くて）相性が良い。

## フレームワーク
### `Django`（ジャンゴ）
`Python`のフレームワーク。

### `FastAPI`
API作成に特化した`Python`のフレームワーク。Python3.6以上で動作し、簡単にRESTfulなAPIを作成できる

### `ASP.NET`
`C#`のフレームワーク

### `Spring Framework`
`Java`言語のアプリケーション開発のために作られたフレームワークの集合体。
- `Spring boot`<br>
集合体となった機能を使いやすくするためのフレームワーク。

### `Tauri`
`Tauri 1.0`のときはデスクトップアプリ開発のためのフレームワークだったが、`Tauri 2.0`になり、モバイルアプリもカバーできるようになった。画面部分はWebViewで構築され、`JavaScript`フレームワークを使って記述できる。<br>モバイルアプリを`JavaScript`で構築する場合は、`React Native (Expo)`も選択肢に上がってくる。<br>`React Native`は画面部分をネイティブコンポーネント + WebViewを使うため、Webアプリをそのまま移植することが難しく、`React Native`用のコンポーネントに置き換える必要がある。`Tauri`はWebで動いていたアプリをそのまま移植できるためモバイルアプリの検証をするのに便利。

## ライブラリ
### `aspida`
APIの型定義をTSで書くと、型安全にAPIを叩くクライアントが自動生成されるライブラリ

### `openapi2aspida`
`aspida`で通信するエンドポイントの型を、APIで記述したopenapi形式のファイルから自動で生成してくれる。これにより、`aspida`でありもしないエンドポイントにアクセスすることが避けられる。しかも、APIの返却値を格納する`state`の型指定に適用することで必要なデータの取り出しやすくなる。

### `Satori`
`HTML`で画像を生成できる？

## AWS
### AWS CDK
`CDK`（`Cloud Development Kit`）は **`Infrastructure as Code`（IaC）** を実現するツール。インフラのリソースをコードで管理する。

## その他
### `Prisma`
データベースとのやり取りを簡単にする`ORM`というツール。`ORM`とはデータベースのテーブルをオブジェクトとして操作できる技術で`SQL`を書かなくても`JavaScript`（`TypeScript`）のコードだけでデータベース操作ができるようになる代物。

### `Docker`（ドッカー）
アプリケーションとその実行に必要な全ての環境（OS、ライブラリ、設定等）を、独立した軽量なコンテナとしてパッケージ化し、どの環境でも同じように動作することを保証するプラットフォーム

#### Kubernetes（k8s）：クバネティスについて
1. クバネティスとは、大規模なシステムやwebサービスの「コンテナオーケストレーション・プラットフォーム（作業環境を包括管理する仕組み・場所のようなイメージ）」を指す
2. クバネティスの根底には`Docker`が提供するような**コンテナ**という技術があって、コンテナは一般的なイメージ通り「その中にそれぞれ固有・特有のものを入れておける箱」という感じのもの。ICT業界における上では「ライブラリや使用ツールそれぞれの特定verを維持し、その依存関係をも管理する仕組み」と言える

少し脱線すると、特定のverをはじめ、どのツールがどのツールに依存または、特定verでしか動かないなどの依存関係は、webサービスやシステムにおいて大きな影響を持っていて、それらverや依存関係を手動管理するのは現実的ではない。<br>
そこで、先のコンテナという仕組みを用いることで「どんなPCやOS、作業環境でもコンテナを開けば全く同じ仮想環境を用意できる」というのは大きな利点になっている。<br><br>

つまり**コンテナを構築・共有することで不特定多数でも同じ作業環境を用意して堅実かつ効率的に開発していける**ということ。<br><br>

話を戻すと、クバネティスはこういったコンテナが数十から数千ほど必要な場合に、それらを包括管理（複数コンテナを**自動的に**配置・管理・修復・拡張・監視）するためのツールで、その性質から基本的に大規模サービス・システムに導入されている。

## テスト
### 偽陽性(false positive)
実際には機能に問題がないのにテストが失敗すること

### スタブ
未完成機能の代替（機能のアタリ）

### モック
APIなど外部依存データの代替（データのアタリ）

---
