# MyLibs
フロントエンド開発、WordPress、Web開発手法、サイト分析・改善のナレッジや自作コンポーネント、学習チュートリアル、技術記事バックアップを集約した個人リポジトリです。

## 📁 ディレクトリ構成

| ディレクトリ | 内容 | 状態 / 備考 |
| :--- | :--- | :--- |
| [`references/`](references/) | 実践的なノウハウ・分析手法を体系化したリファレンス・ナレッジベース | **主要ナレッジ集約**（React 19/Next.js 15+ カタログ、サイト分析等） |
| [`libs/`](libs/) | 実案件・個人開発で再利用可能なライブラリ・コンポーネント | 問い合わせフォーム、WordPress複数絞り込み検索 |
| [`tutorial/`](tutorial/) | 書籍・教材に基づくハンズオン学習リポジトリ & 検証メモ | フロントエンドテスト入門（Vitest対応）、りあクト！応用編 |
| [`others/`](others/) | 環境構築、Web開発手法比較、WordPress運用などの実務・備忘メモ | GitHub SSH、モダンWeb開発比較、FSE、Local移行手順など |
| [`articles/`](articles/) | Qiita・Zenn向けに執筆した技術記事の原稿・バックアップ | Qiita（60本）、Zenn（30本）を連番管理 |

## 📚 主要コンテンツ詳細

### 1. リファレンス・ナレッジベース ([`references/`](references/))
- **[`knowledge-catalog/`](references/knowledge-catalog/)**: フロントエンド & Next.js 実装ナレッジカタログ
  - **[`ui-interactions.md`](references/knowledge-catalog/ui-interactions.md)**: UI操作・インタラクション（モーダル・ダイアログ、ドラッグ＆ドロップ並べ替え、スライダー、ページネーション、タイマー、ゲームUI等）
  - **[`nextjs-patterns.md`](references/knowledge-catalog/nextjs-patterns.md)**: Next.js App Router 設計ナレッジ（Server Actionsフォーム、Suspense・Streaming、Optimistic UI、Route Handlers、キャッシュ制御）
- **[`_site-analytics-document/`](references/_site-analytics-document/)**: Webサイト分析・改善ナレッジベース（全7章＋目次）
  - [総合目次](references/_site-analytics-document/00_index.md) / [第1章 基本プロセス & 心得](references/_site-analytics-document/01_basic_process_and_mindset.md) / [第2章 GA4 & GTM 基礎](references/_site-analytics-document/02_ga4_gtm_foundation.md) / [第3章 GA4 探索レポート実践](references/_site-analytics-document/03_ga4_exploration_reports.md) / [第4章 SNS運用・データ活用](references/_site-analytics-document/04_sns_marketing_and_data.md) / [第5章 データ可視化・改善点抽出](references/_site-analytics-document/05_data_visualization_and_analysis.md) / [第6章 サイト種別ごとの改善施策](references/_site-analytics-document/06_site_type_strategies.md) / [第7章 施策管理・KPI設計](references/_site-analytics-document/07_kpi_and_project_management.md)

### 2. ライブラリ・コンポーネント ([`libs/`](libs/))
- **[`contact-form/`](libs/contact-form/)**: 確認画面付きの問い合わせフォーム（PHP + Vanilla JS + CSS / デモページ対応）
- **[`FilterSearchAtWordPress/`](libs/FilterSearchAtWordPress/)**: WordPress向けカスタムタクソノミー複数絞り込み検索機能セット（テンプレート・パーツ・CSS一式）

### 3. チュートリアル・学習リポジトリ ([`tutorial/`](tutorial/))
- **[`frontend-test-beginner/`](tutorial/frontend-test-beginner/)**: 書籍『フロントエンド開発のためのテスト入門』の学習リポジトリ
  - マッチャー、モック、テストの基本、UIテスト、および最新の **Vitest 実践ガイド ([`about-vitest.md`](tutorial/frontend-test-beginner/about-vitest.md))** や TypeScript+Jest設定を網羅
- **[`reAct-booth/`](tutorial/reAct-booth/)**: 『りあクト！ TypeScriptで始めるつらくないReact開発 第4版【③ React応用編】』の個人用ハンズオンファイルおよびメモ

### 4. 開発メモ・ガイド ([`others/`](others/))
- **[`github-ssh-setup-flow.md`](others/github-ssh-setup-flow.md)**: GitHub SSH認証セットアップと開発フロー
- **[`web_development_guide.md`](others/web_development_guide.md)**: 現代のWeb開発とデプロイメント手法の比較ガイド（JAMstack, SSR, SSG, ホスティング比較）
- **[`wp-about-fse.md`](others/wp-about-fse.md)**: WordPress ブロックテーマ（FSE: Full Site Editing）の概念・設計
- **[`wp-localsite-copy.md`](others/wp-localsite-copy.md)**: 本番環境サイトをLocal（LocalWP）へ移行する手順（クラシックテーマ前提）
- **[`individual-memo.md`](others/individual-memo.md)** / **[`individual-memo-tips.md`](others/individual-memo-tips.md)**: 個人的な技術備忘録・Tips

### 5. 記事バックアップ ([`articles/`](articles/))
- **[`articles/qiita/`](articles/qiita/)**: Qiita投稿記事のバックアップ原稿（連番管理: `qiita-article-001.md` 〜）
- **[`articles/zenn/`](articles/zenn/)**: Zenn投稿記事のバックアップ原稿（連番管理: `zenn-article-001.md` 〜）
