# Gemini CLI → Claude Code 移行比較まとめ

## 1. ワークフロー・設定ファイルの配置

### Gemini CLI の場合
専用ワークスペース（`gemini-cli-template`）に全て集約する方式。

```
gemini-cli-template/
├── GEMINI.md                        # AIの「憲法」・最上位ルール
├── prompt-entry.md                  # プロンプトのエントリーポイント
├── .agents/
│   ├── rules/
│   │   ├── over-engineering-prevention.md
│   │   ├── security-guidelines.md
│   │   ├── subagent-policy.md
│   │   └── workflow.md
│   └── workflows/
│       ├── task-tracking.md
│       └── verification-workflow.md
└── .gemini/
    ├── settings.json
    ├── policies/rules.toml
    └── skills/
        ├── grill-me/
        ├── handover/          # HANDOVER.md 生成スキル
        ├── mon-repo/
        ├── requirement-risk-review/
        └── tech-article-reviewer/
```

対象ファイルはこのテンプレート内に配置して作業する。

---

### Claude Code の場合
**グローバル層**と**プロジェクト層**の2層構造。

#### グローバル層（全プロジェクト共通）
```
~/.claude/
├── CLAUDE.md          # 全プロジェクト共通の行動規範
├── settings.json      # グローバル設定
├── skills/            # 全プロジェクトで使えるスキル
└── agents/            # グローバルサブエージェント
```

#### プロジェクト層（リポジトリ単位）
```
your-project/
├── CLAUDE.md                   # プロジェクト共通（git commit 推奨）
└── .claude/
    ├── CLAUDE.md               # 個人用上書き（gitignore 推奨）
    ├── settings.json           # フック・権限設定（commit 可）
    ├── settings.local.json     # ローカル個人設定（gitignore）
    ├── agents/                 # プロジェクト専用サブエージェント
    ├── commands/               # スラッシュコマンド（/review など）
    ├── hooks/                  # PreToolUse / PostToolUse スクリプト
    └── skills/                 # プロジェクト専用スキル
```

#### ロード優先順位
`Global → Project root → Subdirectory → User-specific`（後が優先）

#### benjuwan 方式に近いテンプレートリポジトリ構成
```
claude-code-template/
├── CLAUDE.md                        # GEMINI.md 相当（最上位の行動規範）
└── .claude/
    ├── settings.json                # サンドボックス・権限設定
    ├── agents/
    │   └── codebase-investigator.md # subagent-policy.md 相当
    ├── hooks/                       # 破壊的操作の禁止など決定論的ルール
    ├── skills/
    │   ├── handover/                # HANDOVER.md 生成スキル
    │   ├── grill-me/
    │   └── tech-article-reviewer/
    └── commands/                    # スラッシュコマンド化したワークフロー
```

#### Gemini CLI との重要な設計上の違い
| 要素 | Gemini CLI | Claude Code |
|---|---|---|
| CLAUDE.md（アドバイザリー） | ルールファイル群で代替 | ガイドライン（推奨） |
| Hooks（決定論的） | なし（ルールファイルで代替） | **必ず実行されるガードレール** |

`over-engineering-prevention.md` のような「絶対に守らせたいルール」は Hooks に移すと精度が上がる。

---

## 2. 料金・アクセス窓口の比較

### Google と Claude の対称性

| 区分 | Google | Anthropic (Claude) |
|---|---|---|
| **チャットベース（定額サブスク）** | AI Pro / Ultra | Pro / Max |
| **API（従量課金）** | AI Studio | Console |
| **関係** | 別々の独立した契約 | 別々の独立した契約 |

### Claude サブスクプランの詳細

| プラン | 月額（目安） | 主な内容 |
|---|---|---|
| Pro | $20 | Claude chat + Claude Code + Sonnet/Opus 利用可 |
| Max 5x | $100 | Pro の5倍使用量 |
| Max 20x | $200 | Pro の20倍使用量・Extended Thinking 等 |
| API（Console） | 従量 | Sonnet $3/$15、Opus $5/$25（per MTok 入力/出力） |

### 重要な注意点

- サブスク（Pro/Max）と API（Console）は**完全に別の課金系統**
- Claude Code は Pro/Max サブスクに含まれる（追加料金なし）
- `ANTHROPIC_API_KEY` が環境変数に設定されていると、サブスクではなく API 課金に切り替わるため注意
- 自動化・CI/CD 用途は利用規約上 API 課金が必須（サブスクでの自動化は規約違反）

### `ANTHROPIC_API_KEY` 環境変数による課金切り替えについて

APIキーが環境変数にセットされていると、Pro/Max サブスクでログイン済みであっても **API 従量課金に自動的に切り替わる**。別のConsoleアカウントのキーでも同様。

認証の優先順位（高い順）：
1. クラウドプロバイダー認証（Bedrock / Vertex AI / Foundry）
2. `ANTHROPIC_API_KEY`（環境変数）
3. OAuthログイン（サブスク）

**よくある落とし穴：** 以前のプロジェクトや前職のAPIキーを `.zshrc` / `.bashrc` に書いたまま忘れていて、気づかずAPI課金になっているケース。

```bash
# 現在どちらで動いているか確認
/status   # Claude Code 内で実行

# 環境変数にキーがあるか確認
echo "$ANTHROPIC_API_KEY"

# サブスクに戻したい場合
unset ANTHROPIC_API_KEY
claude logout
claude login   # Pro/Max 認証のみで再ログイン
```

### 自動化・CI/CD とサブスク利用規約について

Anthropic の公式ドキュメントに明記されていて、OAuthによるサブスク認証は「Claude Code や claude.ai などのAnthropicの公式アプリを通常利用する個人」向けの設計。製品・サービスを構築する開発者や自動化用途は Console の API キーを使う必要がある。

**NG（規約違反）：**
- Cursor、Cline、OpenCode 等のサードパーティツールでサブスクのOAuthトークンを使う
- CI/CD パイプラインでサブスク認証を使ったスクリプト実行
- VPS 上でサブスクのOAuthトークンを転用する

> 2026年1月〜2月にかけて、OpenCode等のサードパーティツールをサブスクで使っていたユーザーのアカウント停止が相次ぎ話題になった（いわゆる OpenClaw 対策）。Anthropic は同年2月に規約を改定・明文化し、サードパーティツールへのサブスク認証使用を明示的に禁止した。

**公式が認めている自動化の方法：**

| 用途 | 推奨認証 | 課金 |
|---|---|---|
| 手動でターミナルから使う | OAuthログイン（サブスク） | 定額 |
| CI/CD・スクリプト（軽量） | `CLAUDE_CODE_OAUTH_TOKEN`（`claude setup-token`で生成） | 定額（サブスク消費） |
| CI/CD・自動化（本格的） | `ANTHROPIC_API_KEY` | 従量（API） |
| サードパーティツール | `ANTHROPIC_API_KEY` | 従量（API） |

なお Antigravity（Google）は Google の公式ハーネスなので、Gemini CLI と同様「公式ツール」扱いでこの規約の対象外。

---

## 3. グローバルインストールの比較

| 項目 | Gemini CLI | Claude Code |
|---|---|---|
| 配布形態 | npm パッケージのみ | **ネイティブバイナリ**（npm も一応対応） |
| インストール | `npm install -g @google/gemini-cli` | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Node.js 依存 | **あり** | **なし** |
| バージョン管理ツールとの競合 | nvm / asdf 等に紐づくため環境依存が起きやすい | `~/.local/bin/` の単独バイナリのため競合なし |
| アップデート | `npm update -g` で手動 | **バックグラウンド自動更新** / `claude update` で手動も可 |
| 各プロジェクトへの呼び出し | Node.js バージョンに紐づくため不安定になることがある | どのディレクトリからでも安定して呼び出し可能 |

### インストール方法別アップデート比較（Claude Code）

| インストール方法 | アップデート |
|---|---|
| **ネイティブインストーラー（推奨）** | **バックグラウンド自動更新** |
| npm グローバル | `npm update -g @anthropic-ai/claude-code`（手動） |
| Homebrew | `brew upgrade claude-code`（手動） |

> npm インストールも内部的には同じネイティブバイナリを取得する仕組みのため、実体は同じ。ただし自動更新が効かないため現在は非推奨。

### ネイティブインストーラーが推奨される理由

```bash
# 推奨インストールコマンド（macOS / Linux / WSL 共通）
curl -fsSL https://claude.ai/install.sh | bash
```

- **Node.js 不要** → nvm / asdf 等のバージョン管理ツールと競合しない
- **自動更新** → バックグラウンドで常に最新版を維持
- **コード署名済み** → Anthropic の GPG 署名 + macOS は Apple 公証済みバイナリ
- **PATH 自動設定** → `~/.local/bin/claude` に配置され、どのディレクトリからも呼び出し可能

npmインストールは「特定バージョンを固定したい」「CI環境でnpmが標準」といった特別な理由がある場合のみ。

---

## まとめ

Gemini CLI から Claude Code に移行する場合、最も大きな違いは以下の4点：

1. **設定の置き場所** → ワークスペース集約型から `~/.claude/`（グローバル）＋ `.claude/`（プロジェクト）の2層構造へ
2. **料金** → 構造はほぼ同じ（定額サブスク vs 従量API）。Claude Code は Pro/Max サブスクに含まれる
3. **インストール** → npm 依存から脱却したネイティブバイナリ（curl 推奨）で、自動更新・環境依存なしで安定運用できる
4. **利用規約** → サブスクはインタラクティブな個人利用が前提。自動化・サードパーティツール経由での利用は API キーが必要
