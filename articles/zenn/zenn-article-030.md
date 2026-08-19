---
title: "Microsoft 謹製 デスクトップアプリ「Skill Recorder」で業務効率化スキル（SKILL.md）の作成が捗る？"
emoji: "🌤️"
type: "tech"
topics:
  - "ai"
  - "skill"
  - "chatgpt"
  - "claude"
  - "antigravity"
published: true
published_at: "2026-08-04 13:57"
---

## はじめに
スキル（SKILL.md）で定型業務をAIに移譲したり、特定業務の自動化・半自動化を実現したりといった状況は珍しくなくなってきたと思います。

例えば、ブラウザ操作のトレースは`playwright-mcp`または`playwright-cli`で行い、そのトレース結果からAIに業務効率化のスキル作成までをしてもらうのも一般的でしょう。

とはいえ、あくまで**ブラウザ操作ベース**での話になります。

ここ最近、**ローカルPCのアプリケーションやソフトといったPC操作ベース**での業務効率化スキルを作成できる術を探していたところ、今回紹介する[`microsoft/skill-recorder`](https://github.com/microsoft/skill-recorder)を知りました。

## Microsoft Skill Recorder で PC操作録画からの業務棚卸し・言語化・AIによるスキル化
`microsoft/skill-recorder`（※以降は`Skill Recorder`で統一）を使えば、PC画面での操作録画と音声解説から定型業務を言語化し、AIエージェント用スキル（`SKILL.md`）をとても簡単に作れます。
本記事では、その概要、仕組み、インストール・起動方法、詳細な使用手順、および利用上の注意点をまとめていきます。

::: message
`microsoft/skill-recorder`（`Skill Recorder`）は今年7/25に登場したツールなので、今後どんどん改善されていくはずです。本記事の内容も陳腐化していくと思うので参考程度に読み進めてください。
:::

## 結論
- Node.js 24 以降、GitHub account（※GitHub Copilot へのアクセス権限付きのもの）が必要
- `Skill Recorder`を十分に活用するには`Microsoft 365`が必要
- 企業内で機密性の高い業務の棚卸しを行う（本格的に業務利用していく）場合は、データがAIの学習に使用されないことが保証された **GitHub Copilot Business / Enterprise** 契約下で利用することを推奨
- 起動時に注意書きが表示されますが、録画画面やテキストに、パスワード、APIキー、個人情報、機密情報が含まれないよう注意

## 業務効率化には棚卸しや言語化が必須で腰が重い...
個人の業務効率化を推進するにあたり、最大の問題となるのが **「各個人が普段行っている業務の言語化・構造化（棚卸し）の負担の大きさ」**と**「言語化精度の個人差」** だと思っています。

`Skill Recorder`は、**「普段の業務を一度録画・実況解説するだけで、AIがその意図と手順を理解し、再利用可能なスキル（`SKILL.md`）へ自動変換」** してくれるので、上記のハードルを大きく下げてくれるでしょう。

### `Skill Recorder`主な特徴
- **画面録画 ＋ 音声実況（ナレーション）の同時収集:**
  単なるマウス操作のキャプチャだけでなく、ユーザーが口頭で解説した音声もキャプチャします。
- **ローカルファースト処理:**
  録画・画面フレーム抽出・音声文字起こし（Whisper）はすべてユーザーのローカルPC上で行われます。
- **AI（GitHub Copilot）による言語化:**
  録画データ・イベントログ・音声テキストから、業務の「意図（Intent）」と「順序立てられた手順（Steps）」を自動構築します。
- **単なるRPA（操作再生）ではないスキル化:**
  UIの絶対座標を連打するマクロではなく、`gh` CLIやWeb API、検索ツール（`web_fetch`, `Grep` 等）などAIエージェントが自律的に実行可能な汎用形式（`SKILL.md`）として書き出します。

## インストールとアプリ起動手順
`Skill Recorder`はCLIからコマンド1行でビルド・登録されますが、**日常的な使い勝手はグローバルインストールされた単体デスクトップアプリそのもの**です。
インストール後はMacの「アプリケーション」フォルダやSpotlight、Windowsの「スタートメニュー」から通常アプリとして起動可能となります。
※初回起動時のみ GitHub account の連携操作が必要です。

### 前提条件
- **GitHub アカウント:** GitHub Copilot へのアクセス権限があるアカウント（無料枠 Copilot Free でも可）。
- **Node.js 24:** 「*Requires Node.js 24*」とREADMEに記載ある通り Node.js 24 以降が必要です。
- ※Windows の場合のみ: **Windows 11**（x64 または ARM64）

### macOS での手順

#### インストールコマンド
ターミナル（Terminal.app）を開き、以下のワンライナーコマンドを実行します。

https://github.com/microsoft/skill-recorder#install-it

```bash
commit="<コミットハッシュ>"; curl -fsSL "https://raw.githubusercontent.com/microsoft/skill-recorder/$commit/install.sh" | SKILL_RECORDER_COMMIT="$commit" SKILL_RECORDER_DETACHED=1 bash
```

::: message
**※`commit="<コミットハッシュ>"` について:**  
本スクリプトはセキュリティおよびビルドの再現性を保つため、40桁のコミットハッシュ（SHA）指定が必須となっています。例えば Release 0.3.1 のコミットハッシュは`commit="32fd0b57e02c3ea1e016cca0d64e59052e93a9b9"`です。
:::

#### アプリ起動と初期設定
1. **アプリの起動:**
   Spotlight または Launchpad / Finder の `~/Applications`（ホームディレクトリ内のアプリケーション）から **「Skill Recorder (Source)」** を起動します。
2. **画面収録の許可設定 (初回のみ):**
   macOS から画面アクセス許可を求められます。「`システム設定 ＞ プライバシーとセキュリティ ＞ 画面収録`」を開き、「Skill Recorder (Source)」の権限をオンに設定してください。
3. **GitHub サインイン:**
   アプリ起動後、表示される案内に従って GitHub アカウントでサインイン（Copilot 認証）を行います。

### Windows OS（Windows 11）での手順

::: message
筆者 Windows OS では未検証です。恐縮ですがご了承ください。
:::

#### 前提条件
- **Windows 11**（x64 または ARM64）

#### インストールコマンド
PowerShell を開き、以下のコマンドを実行します。

https://github.com/microsoft/skill-recorder#install-it

```powershell
$commit="<コミットハッシュ>"; $env:SKILL_RECORDER_COMMIT=$commit; irm "https://raw.githubusercontent.com/microsoft/skill-recorder/$commit/install.ps1" | iex
```

::: message
**※`commit="<コミットハッシュ>"` について:**  
本スクリプトはセキュリティおよびビルドの再現性を保つため、40桁のコミットハッシュ（SHA）指定が必須となっています。例えば Release 0.3.1 のコミットハッシュは`$commit="32fd0b57e02c3ea1e016cca0d64e59052e93a9b9"`です。
:::

#### アプリ起動と初期設定
1. **アプリの起動:**
   デスクトップまたはスタートメニューに追加された **「Skill Recorder (Source)」** のショートカットをダブルクリックして起動します。
2. **GitHub サインイン:**
   初回利用時（または最初の「Analyze」実行時）に画面の指示に従い、GitHub アカウントでサインインします。

### バージョン更新（アップデート）方法
新機能がリリースされた場合は、[GitHub リポジトリのリリースページ](https://github.com/microsoft/skill-recorder/releases/latest) から最新バージョンのインストールコマンド（40桁のコミットハッシュが含まれたもの）をコピーし、ターミナル等で再実行することで最新版にアップデートできます。

## Skill Recorder を使ってみよう

### 1. 録画の開始と停止
- **ショートカットキー:** **`⌘ + Shift + R` (Mac)** / **`Ctrl + Shift + R` (Windows)** を押すと、画面上のどこからでも即座に録画が開始されます。
- **UIボタン:** アプリ画面上の「🔴 Record」ボタンを押して開始することも可能です。

![録画の開始と停止](https://static.zenn.studio/user-upload/0b51f84c3540-20260804.png)

- Narrate: ここで使用言語とマイクの設定ができます
- Records your screen and activity: Skill Recorder 使用時の注意事項などがポップアップ表示されます
- Review sessions: 既存のセッションです。初回起動時など一つもなければ表示されません

### 2. 録画中のコントロール（オーバーレイバー）
録画中は画面上に最前面表示のコントロールバーが現れます。

- **マイク切替・ミュート:** ナレーション用マイクのオン/オフやマイク入力デバイスを切り替え可能。
- **Discard (破棄):** 操作を間違えた際、確認ダイアログを経てそのテイクを破棄できます。
- **Finish (完了):** 業務操作が終わったら Finish ボタンを押して録画を停止します。

### 3. ナレーション実況
録画中は「今から〇〇の顧客データを抽出するためにシステムAを開きます」「ここは毎月15日締めのデータのみを選択します」といった**声での解説実況を交えて操作すること**で言語化精度を高められます。

![ナレーション実況](https://static.zenn.studio/user-upload/a2a1afd42ef7-20260804.png)

例えば、これは私がローカルのメールアプリを開いて「松井さん」でソートをかけた時の内容ですが、「メールアプリを開いて『松井』でフィルタリングします」とナレーションしていました。

### 4. 解析（Analyze）とステップの編集（CREATE SKILL 画面）
録画停止後、「Analyze」を押すとAIによる解析が行われ、**「CREATE SKILL」画面**が表示されます。

![解析（Analyze）とステップの編集（CREATE SKILL 画面）](https://static.zenn.studio/user-upload/5057bdba537c-20260804.png)

`+ Add step`で任意のタスクフローを追加できますし、既存のフロー項目を選択すれば編集、ソートもできます。
タスクフローが整えば、右下にある赤色の`CREATE SKILL`ボタンを押下して次に進みます。

### 5. 成果物フォーマットの選択
ステップの調整が完了したら、目的の用途に応じて以下の成果物フォーマットを選択します。

![成果物フォーマットの選択](https://static.zenn.studio/user-upload/7ccf04bcc926-20260804.png)

| 選択肢 | 役割・概要 | 主な用途 |
| :--- | :--- | :--- |
| **Scout skill**<br />*(推奨)* | **オンデマンド型 AIスキル (`SKILL.md`)**<br />タスク指示に応じてAIエージェントが自動照合・呼び出しする汎用スキル。 | **ブラウザ閲覧・情報要約などの一般的な定型業務のスキル化** |
| **Scout automation** | **トリガー/スケジュール実行型**<br />定時実行や特定イベントトリガーで定期動作する自動化ワークフロー。 | 毎日朝の定期レポート作成など全自動化 |
| **Cowork skill** | **Microsoft 365 Copilot (Cowork) 用**<br />M365 Copilot 環境へ組み込んで社内共有するためのエクスポート形式。 | 社内Copilot環境への導入・展開 |
| **Copilot Studio** | **Microsoft Copilot Studio 連携**<br />（現在準備中 / Coming soon） | カスタムコパイロット プラットフォーム連携 |

---

![成果物フォーマットの選択2](https://static.zenn.studio/user-upload/d3ac08e59275-20260804.png)

このキャプチャ画像の右下にある`Export...`ボタンを押すと即座に`SKILL.md`が作成されて当該スキルフォルダのダウンロード先を選択する画面が表示されます。
すぐに当該スキルフォルダが欲しい時はショートカットできて便利ですね。

### 6. `SKILL.md`（スキルフォルダ）の作成完了
成果物フォーマットの選択で`Scout skill`を選ぶと以下キャプチャのような当該スキルのファイルパスが記載された画面が表示されます。`Reveal file`ボタンを押すと当該スキルファイルを選択済みのフォルダ一覧画面に移ります（当該スキルファイルへのショートカット）。

![SKILL.md（スキルフォルダ）の作成完了](https://static.zenn.studio/user-upload/2dce6610084d-20260804.png)

## 作成したスキルを使ってみる
さて、これまでのフローで作成されたスキルを実際に使ってみましょう。

:::details 作成された summarize-contact-emails スキル

```markdown
---
name: summarize-contact-emails
description: "summarize emails from contact; summarize latest N emails; open mail and pick contact"
allowed-tools:
  - workiq_search_people
  - workiq_search_emails
  - workiq_get_email
  - Write
---

When to use
Use this skill when you need a concise Markdown summary of the most recent N emails from a colleague or contact in your Microsoft 365 org.

Procedure
1. Locate the contact by name (calculation — workiq_search_people).
- Search the org directory for the provided contact display name (partial or full) using workiq_search_people.
- If multiple matches are returned, choose the top result; if ambiguity remains, prompt the user to select which match to use.
- Record the chosen contact's displayName and primary email address for the next steps.

2. Search for recent emails from contact (calculation — workiq_search_emails).
- Query mail with the contact's email address (e.g., filter by from address) using workiq_search_emails.
- Request results sorted by date descending and limit to the requested N messages.
- If fewer than N messages exist, proceed with whatever is returned; if zero, stop and report no messages found.

3. Retrieve full message bodies (calculation — workiq_get_email).
- For each message returned, fetch the full message (subject, date, sender, recipients, and body) using workiq_get_email.
- Convert HTML bodies to plain text if necessary and extract a short snippet (first ~200 characters) for each message.

4. Create a markdown summary file (action — Write).
- Compose a single Markdown file containing:
  - Title header with the chosen contact displayName and email, and the date/time range covered by the messages.
  - For each message: a subsection with the subject, date/time (local), sender/recipients, the short snippet, and a 2–4 sentence summary of the message body.
- Use concise, factual summarization (extractive or brief abstractive) and avoid adding new claims.
- Save the file to a local path: prefer an agent-provided path; otherwise use a sensible default like ~/Documents/<contact>-emails-summary-YYYYMMDD.md.
- Return the file path and a short report of how many messages were summarized.

Inputs
- contact_name (string): partial or full display name to search for.
- n (integer): maximum number of recent messages to summarize.
- output_path (optional string): local path to save the markdown file; if omitted, use the default path described above.

Edge cases
- If multiple directory matches and the user does not disambiguate, pick the top match but note the decision in the report.
- If zero messages are found, return a clear message and do not create a summary file.
- If workiq calls fail, surface the error and stop; do not perform writes unless message data is successfully retrieved.

Outputs
- Path to the generated Markdown summary file and a short JSON-like report: {contact_displayName, contact_email, messages_found, file_path}.

```

:::

筆者は Antigravity CLI を愛用しているので、手元にある Antigravity のテンプレプロジェクトのスキルフォルダに先ほどの`summarize-contact-emails`スキルフォルダを突っ込みます。

![作成したスキルを使ってみる1](https://static.zenn.studio/user-upload/71432b3f8758-20260804.png)

スキルを起動してみます。
対象となるメールアドレスなど、こちらでいくつか設定する必要があるので入力していきます。
※`Skill Recorder`では Matsui を指定していましたが、AIが汎用性を加味してメールアドレスまたは名前で作業できるように調整してくれたようです。

![作成したスキルを使ってみる2](https://static.zenn.studio/user-upload/1d54c9a3498e-20260804.png)

おっと、Microsoft 365 連携ツールが前提なようです。
筆者はMicrosoft 365に契約していないのでここまでとなります。

![作成したスキルを使ってみる3](https://static.zenn.studio/user-upload/a13a2a5217f8-20260804.png)

つまり、筆者が希望したような**ローカルPCのアプリケーションやソフトといったPC操作ベース**を前提として、`Skill Recorder`を活用するには**Microsoft 365 が必須**ということですね。

---

上記で詰まってしまったので、Qiita, Zenn, はてブ[テクノロジー] などから希望ジャンルの記事をいくつか選別および要約のスキル作成も試してみました。
結果的に無事作成はできましたが、ブラウザベースでの操作の場合は`playwright-mcp`または`playwright-cli`でも十分なので詳細は割愛いたします。

## `Skill Recorder`の仕組みとアーキテクチャ
`Skill Recorder`は、ローカルで動く Electron デスクトップアプリケーションと、バックエンドで動作する GitHub Copilot CLI によって構成されています。

```
[ ユーザーの業務操作 & ナレーション ]
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ ローカルPC処理 (Electron アプリ)                         │
│  ├─ 画面・ウィンドウ・URLキャプチャ                      │
│  ├─ 低頻度の画面静止画（スナップショット）抽出           │
│  └─ 音声文字起こし (ローカル Whisper モデル / 252MB)     │
└────────────────────────────────────────────────────────┘
          │ 「Analyze」実行時のみ送信
          ▼
┌────────────────────────────────────────────────────────┐
│ AI処理 (GitHub Copilot CLI)                            │
│  └─ 意図（Intent）と手順（Steps）の構造化・言語化       │
└────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│ 成果物 (再利用可能なアセット)                          │
│  ├─ SKILL.md (AIエージェント用スキル定義 / マニュアル)   │
│  └─ Scheduled Automation (自動実行設定)                │
└────────────────────────────────────────────────────────┘
```

### インストール先ディレクトリと保存データの詳細場所
ユーザーのホームディレクトリ内に配置されます。当ツールが不要になった時は以下のディレクトリ（フォルダ）ごと削除すれば問題ありません。

::: message
**2つのフォルダ表記（差異）の使い分け:**  
- **`SkillRecorder` (PascalCase / 大文字混じり):** インストーラーが構築した**本体プログラム・ポータブル Node.js ランタイム基盤**
- **`skill-recorder` (kebab-case / 小文字ハイフン):** Electron アプリの起動・録画に伴う**ユーザー設定・アプリデータ・Whisper音声モデル（~252MB）・ログキャッシュの保存領域**
:::

#### macOS での配置場所
- **本体・ランタイム (`~/Library/Application Support/SkillRecorder` - PascalCase):**
- **アプリデータ・キャッシュ(`~/Library/Application Support/skill-recorder` - kebab-case):**
  - Electron アプリが動的に作成・使用するユーザー設定、ローカルにダウンロードされた Whisper 音声認識モデル (`~252MB`)、録画ログ、セッションキャッシュデータ領域

#### Windows 11 での配置場所
- **本体・ランタイム (`%LOCALAPPDATA%\SkillRecorder\` - PascalCase):**
- **アプリデータ・キャッシュ (`%APPDATA%\skill-recorder\` - kebab-case):**
  - Electron アプリが動的に作成・使用するユーザー設定、ローカルにダウンロードされた Whisper 音声認識モデル (`~252MB`)、録画ログ、セッションキャッシュデータ領域

## 利用時の注意点・制約事項

### 1. 無料枠（GitHub Copilot Free）での利用制限
- **画面録画・音声文字起こし:**
  ローカル処理のため**無制限・完全無料**。
  
- **Analyze（解析・言語化）:**
従来の Copilot Freeでは固定の「月50リクエスト」という枠でしたが、現行は 1.自動モデルの選択経由でのみモデルを利用できる、2.GitHub AI Creditsの消費量に応じて使える範囲が変動する、という仕様になっています（[GitHub Copilotのプラン](https://docs.github.com/ja/copilot/get-started/plans)）。具体的な無料枠のクレジット量は公式に数値化されていないため、実際にどれくらい Analyze を回せるかは不明瞭です。
とはいえ、本格的な業務利用を考慮するなら GitHub Copilot Business / Enterprise の契約が必須となってくるので無料枠では試用検証に留める程度が適切だと思います。

- **利用目安:**
上記の制限により、1タスクあたり数回の Analyze 試行を考慮すると、お試し・PoC利用で **月 15〜20 タスク程度** のスキル生成が無料枠での現実的な目安となります（※実利用からの推定値）。日常的・大量の棚卸しを行う場合は Copilot Pro / Business への移行が必要です。

### 2. セキュリティ・プライバシー対策
- 録画画面やテキストに、パスワード、APIキー、個人情報、機密情報が含まれないよう注意してください。
- 企業内で機密性の高い業務の棚卸しを行う場合は、データがAIの学習に使用されないことが保証された **GitHub Copilot Business / Enterprise** 契約下で利用することを強く推奨します。

### 3. 推奨録画時間（タスクの分割）
- 1つの録画は **「5分〜15分程度」** の1単位のタスクに分割して行うことを推奨します。長すぎる動画はスキルの再利用性が下がり、AIの解析精度にも影響するためです（※公式の推奨値ではなく、実用上の目安です）。

## さいごに
Microsoft 365 や GitHub アカウントが必須、Node.js 24以降など、いくつかの制約があるものの、**ローカルPCのアプリケーションやソフトといったPC操作ベース**での業務効率化スキルの作成という点においては従来よりハードルが下がった気がします。

なお、筆者は「Microsoft 365が必須」というのがネックだったので競合や似たツールを探ってみました。

### ローカルAI自動化ツール 3分類比較

| 観点 | ① Power Automate Desktop (PAD) | ② OpenClaw | ③ skill-recorder系（Claude Cowork / Codex Record & Replay 含む） |
|---|---|---|---|
| **アプローチ** | Windows OSレベルのUI要素を直接認識して記録・再生 | LLMで一度操作を発見・記録し、Playwright/Excel/Word/APIの決定論的スクリプトにコンパイル | 画面録画＋ナレーションから「意図」をSKILL.md化し、実行時にAIが状況を見て再解釈 |
| **実行時のコスト** | ゼロ（ローカルRPAエンジン） | ゼロ（記録後はPythonスクリプトを直接実行、LLM呼び出しなし） | 都度LLM推論が必要（トークンコスト・レイテンシが発生） |
| **堅牢性・再現性** | 高い（OSレベルのUI要素認識でボタン位置変化に強い） | 高い（一度検証すれば毎回同じスクリプトが決定論的に動く） | UI変化に柔軟だが、実行のたびに解釈が変わりうるため厳密な再現性は劣る |
| **カバー範囲** | Windowsローカルアプリ・レガシー社内システムに強い | ブラウザ（Playwright）＋Office（Excel/Word）＋API呼び出しが中心。Windowsデスクトップアプリ全般は対象外 | Computer Use経由でデスクトップGUI・ブラウザ・プラグイン連携まで横断可能（Codexは現状macOS限定） |
| **柔軟性（未知の状況への対応）** | 低い（決められたフロー通りにしか動かない） | 低い（コンパイル後は固定スクリプト） | 高い（AIが都度状況を見て自律的に判断・代替行動できる） |
| **代表例** | Microsoft（商用・エンタープライズ） | laziobird/openclaw-rpa（OSS） | microsoft/skill-recorder、Anthropic Claude Cowork「Record a Skill」、OpenAI Codex「Record & Replay」（2026/6/18〜、v26.616） |
| **向いている用途** | 定型業務を安定・高速に自動化したい実務用途 | ランニングコストを抑えつつ高速反復実行したい用途 | UIが変化しやすい／状況判断が必要な業務をAIエージェントに"概念ごと"教えたい先進用途 |

---

個人的に気になっているのは ChatGPT の[`Computer Use`](https://learn.chatgpt.com/docs/computer-use)や[`Record & Replay`](https://learn.chatgpt.com/docs/extend/record-and-replay)または[Claude Cowork の`Record a skill`](https://www.techno-edge.net/article/2026/07/22/5317.html)です。

とはいえ、`Skill Recorder`はUI/UXも良かったので Microsoft 365 を検討しつつ、使い続けていきたいと思います。

ここまで読んでいただき、ありがとうございました。

## 参考
https://github.com/microsoft/skill-recorder

https://www.itmedia.co.jp/aiplus/article/2608/04/2000000361/

https://learn.chatgpt.com/docs/computer-use

https://learn.chatgpt.com/docs/extend/record-and-replay

https://www.techno-edge.net/article/2026/07/22/5317.html
