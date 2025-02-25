# `Local`へ既存 WordPress サイトを移行（バックアップ）する方法
## 必要素材の用意
- 当該WordPressサイトのDB(`xxxx.sql`)
- 当該WordPressサイトの当該期間の静的ファイル（`uploads`ディレクトリ内）
- （変更・修正・更新した場合）各種ファイルやデータ（`themes`ディレクトリ内）

## テキストエディタ（例：VSCode）で当該WordPressサイトのDB(`xxxx.sql`)を調整
1. テーブルプレフィックス（変更している場合のみ）の確認<br>
`wp_`ではない場合、全テーブルのプレフィックスを`wp_`の形式に全置換する
2. `wp_options`テーブルにある下記項目を修正（置換）
- `siteurl`（全置換）       ← `local`サイトのURLに置換<br>
- `home`（全置換）          ← `local`サイトのURLに置換<br>
- `blogname`              ← 任意（【Local】を先頭に前置）<br>
- `blogdescription`       ← 任意（【Local】を先頭に前置）<br>
- `admin_email`（全置換）   ← `local`サイトで登録した管理者アドレスに置換<br>
※各種メディアファイルは別途、当該`local`サイトの`uploads`ディレクトリへの反映（アップまたは上書き）が必要

---

3. `Local`を開いてDB(`xxxx.sql`)をインポートする
- 事前に当該`local`サイトの`sql`（/Local Sites/当該localサイト/app/sql/`local.sql`）をバックアップしておく
- 当該サイトを（クリックして）アクティブにし、`Database` - `Open AdminerEvo`をクリック
- 表示された全テーブルのチェック項目を選択（全項目選択状態）して下部にある`削除`ボタンでDBの中を一旦空にする
- 左側ダッシュボードの左上にある`インポート`タブをクリックし、`ファイルをアップロード`エリアにある`ファイル選択`を押下して先ほど（1〜2の工程で）調整した当該WordPressサイトのDB(`xxxx.sql`)を選択
- `実行`ボタンクリックでインポート実施
