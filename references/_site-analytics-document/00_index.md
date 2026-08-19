# Webサイト分析・改善ナレッジベース 総合目次

Webサイト分析・改善に関する知識や手法を体系化・相互関連付けしたMarkdownドキュメント群です。

## 大前提
ユーザーのニーズに即したデザインやサービスにするためには、経験則や主観的な推測、思い込み（バイアス）を避けて**ユーザーの実情（困りごとや課題）をきちんと知る・理解する・把握する必要がある**。そのために大切なのが**ユーザー分析＝データ（情報）**である。一つひとつの困りごとを解決していくことで世界はより良くなっていく。

---

## 全7章 体系的目次

### [第1章 Webサイト分析・改善の基本プロセス & 心得](01_basic_process_and_mindset.md)
Webサイト分析の全体心得、ユーザー/アナリスト視点、ファネル4指標（集客力・閲覧力・誘導力・成果力）、仮説出し手法、E-E-A-T基準。

- [1-1. サイト分析の心得と基本プロセス（5ステップ）](01_basic_process_and_mindset.md#sec-1-1)
- [1-2. 施策立案の大まかな流れ & アプローチ手法](01_basic_process_and_mindset.md#sec-1-2)
- [1-3. ボリュームゾーンの見つけ方（集客力・閲覧力・誘導力・成果力）](01_basic_process_and_mindset.md#sec-1-3)
- [1-4. 閲覧力と誘導力の分析手法 & 離脱防止テクニック](01_basic_process_and_mindset.md#sec-1-4)
- [1-5. 仮説を立てる3つの方法 & Googleコンテンツ評価基準「E-E-A-T」](01_basic_process_and_mindset.md#sec-1-5)
- [1-6. GA4における優良コンテンツ量産アプローチ](01_basic_process_and_mindset.md#sec-1-6)
- [1-7. 成果力（しっかりCVにつなげられているか？）の分析とフォーム改善](01_basic_process_and_mindset.md#sec-1-7)

### [第2章 Google Analytics 4 (GA4) & GTM の基礎と仕様](02_ga4_gtm_foundation.md)
GA4の計測軸（イベントベース）、推奨/カスタムイベント、サンプリング対策、セグメント仕様、GTM設定と2重計測防止、直帰率の計算式。

- [2-1. GA4の分析軸（ディメンション・セグメント・指標）とイベント仕様](02_ga4_gtm_foundation.md#sec-2-1)
- [2-2. レポートの注意点（Other項目・サンプリング対策・SPA・動画計測）](02_ga4_gtm_foundation.md#sec-2-2)
- [2-3. セッションタイムアウト・カスタムディメンション/指標の登録手順](02_ga4_gtm_foundation.md#sec-2-3)
- [2-4. BigQuery設定（ストリーミング費用） & データストリーム](02_ga4_gtm_foundation.md#sec-2-4)
- [2-5. セグメント（条件適用）機能の基礎と3つの単位（ユーザー・セッション・イベント）](02_ga4_gtm_foundation.md#sec-2-5)
- [2-6. セグメント抽出結果の比較（ユーザーセグメント） & セグメントの仕様諸々](02_ga4_gtm_foundation.md#sec-2-6)
- [2-7. レポート［ランディングページ］の解析手順（見方）](02_ga4_gtm_foundation.md#sec-2-7)
- [2-8. GTMトリガー設定 & GA4の直帰率の計算式と定義](02_ga4_gtm_foundation.md#sec-2-8)
- [2-9. 探索レポート画面の各設定項目 & ディメンション・指標・セグメントの役割](02_ga4_gtm_foundation.md#sec-2-9)
- [2-10. サイト速度・OGP・UX & GTMとGAタグの併用不可（補足メモ）](02_ga4_gtm_foundation.md#sec-2-10)

### [第3章 GA4 探索レポートの実践と設定パターン](03_ga4_exploration_reports.md)
探索内の7つの手法（自由形式、コホート、目標到達プロセス、セグメント重複、経路分析、エクスプローラ、ライフタイム）と8つの推奨設定パターン。

- [3-1. 「分析」機能を担う探索内の手法の種類](03_ga4_exploration_reports.md#sec-3-1)
- [3-2. 目標到達プロセスデータ探索 & オススメ探索設定例①時系列レポート](03_ga4_exploration_reports.md#sec-3-2)
- [3-3. オススメ探索レポート設定例②集客レポート & ③初回獲得エンゲージメントレポート](03_ga4_exploration_reports.md#sec-3-3)
- [3-4. オススメ探索レポート設定例④入口・出口 ⑤コンバージョン ⑥外部リンククリック](03_ga4_exploration_reports.md#sec-3-4)
- [3-5. オススメ探索レポート設定例⑦ファイルDL & ⑧コンバージョン直前ページ逆引き](03_ga4_exploration_reports.md#sec-3-5)

### [第4章 SNS運用・マーケティングとデータ活用](04_sns_marketing_and_data.md)
SNS運用の基本、運用分岐点（1日1時間）、市場調査×eng、UGC活用、KPI目安（CTR・CVR）、年齢層別SNS特性、目的別解析と炎上対応。

- [4-1. SNS（Twitter/X関連）運用の基本とサイクル](04_sns_marketing_and_data.md#sec-4-1)
- [4-2. エンゲージメントの高いコンテンツ・UGC活用・ターゲット別SNS](04_sns_marketing_and_data.md#sec-4-2)
- [4-3. SNS解析の目的別見るポイント & 炎上に対する基本対応](04_sns_marketing_and_data.md#sec-4-3)

### [第5章 データ可視化と改善点の抽出テクニック](05_data_visualization_and_analysis.md)
インフォグラフィック（円・棒・散布図・折れ線・レーダーチャート）、起点調整、ROI/ROAS計算、HTMLメール手法、直帰率改善（バケツの穴）、広告ターゲティング、レコメンド・クロスセル。

- [5-1. インフォグラフィック: グラフの種類と使い分け](05_data_visualization_and_analysis.md#sec-5-1)
- [5-2. グラフの起点調整・凡例配置 & 表とグラフの使い分け](05_data_visualization_and_analysis.md#sec-5-2)
- [5-3. 改善点の抽出テクニック & 直帰・離脱要因の分析](05_data_visualization_and_analysis.md#sec-5-3)
- [5-4. ROI/ROAS計算・HTMLメール手法 & 広告目的別評価基準](05_data_visualization_and_analysis.md#sec-5-4)
- [5-5. 流入元別の改善点 & 直帰率改善の考え方 & ターゲティング手法](05_data_visualization_and_analysis.md#sec-5-5)
- [5-6. 訪問日時分析・OS別差異 & ECレコメンド・クロスセル手法](05_data_visualization_and_analysis.md#sec-5-6)

### [第6章 サイト種別ごとの改善施策（EC / BtoB / メルマガ）](06_site_type_strategies.md)
ECサイト（顧客5分類マトリクス、アドバンスセグメント、新規・リピート施策）、BtoBサイト（見込み客育成、中間成果、導入事例の掲載法）、メルマガ（登録UI、件名6パターン、配信タイプ4種）。

- [6-1. ECサイトで意識すること & 訪問者の分類マトリクス](06_site_type_strategies.md#sec-6-1)
- [6-2. EC分析のアドバンスセグメント設定例 & 新規・リピーター獲得施策](06_site_type_strategies.md#sec-6-2)
- [6-3. BtoBサイトで意識すること（対法人向け）](06_site_type_strategies.md#sec-6-3)
- [6-4. 問い合わせの質と導入実績・事例の掲載テクニック](06_site_type_strategies.md#sec-6-4)
- [6-5. メルマガで意識すること & 登録率を高めるUI設計](06_site_type_strategies.md#sec-6-5)
- [6-6. メルマガ件名の代表的6パターン & 配信タイプ4種](06_site_type_strategies.md#sec-6-6)

### [第7章 施策管理・KPI設計とプロジェクト推進](07_kpi_and_project_management.md)
施策エントリーフォーム設計、重要度/緊急度A〜D判定、工数管理（人日・人月の落とし穴）、KPI設計と逆算アプローチ、週次/日次モニタリング、パラグラフ・ライティング。

- [7-1. 関係各位とうまく情報を共有する — 施策エントリーフォーム設計](07_kpi_and_project_management.md#sec-7-1)
- [7-2. 施策管理の進捗共有・KPI設計 & 現状との差分逆算アプローチ](07_kpi_and_project_management.md#sec-7-2)
- [7-3. 納期・金額の見積リスク管理 & 「人月」の落とし穴](07_kpi_and_project_management.md#sec-7-3)
- [7-4. パラグラフ・ライティングの基本 & 相手への説明で意識すること](07_kpi_and_project_management.md#sec-7-4)
