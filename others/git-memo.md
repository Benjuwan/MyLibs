# `GitHub`関連のメモ・備忘録

## 普段の個人的な`GitHub`の使い方フロー
### 既存プロジェクト
1. `git branch -a`でブランチを確認
2. `git pull origin main`で主ブランチの内容をローカルに反映
  - `git pull`：リモートリポジトリの最新の内容を取得し、それをローカルリポジトリに統合または順応させる<br>
  大抵は`git pull origin <branchname>`で問題ないものの**事前に変更差分を把握したり、各ブランチ内容をチェックしてから変更を取り込んだりする場合**は`git fetch origin <branchname>` -> `git merge origin/<branchname>`と**最新の内容取得及び統合・順応作業を分割して行うケース**もある。
  - `git fetch origin <branchname>`：指定した（リモートリポジトリの）ブランチの最新の内容を取得
  - `git merge origin/<branchname>`：指定した（リモートリポジトリの）ブランチの内容をローカルリポジトリに**統合（変更が競合しない場合スムーズに合併される）**または**順応（ローカルの状態がリモートの最新状態に合わせて調整される）**させる
3. 作業開始（※この際に`git checkout -b topic`で別ブランチに切ることもある）
4. 先の工程で別ブランチに切っていない場合は`git checkout -b topic` -> `git push -u origin topic`でブランチを切ってリモートの当該リポジトリに接続
5. `git branch -vv`で今いるブランチを確認（※**主ブランチへの誤push防止**の観点から）
6. `git status`で変更内容を確認（して必要に応じて`git restore`で不要なファイルを省く）
7. 問題なければ、`git add .` または `git add 各ファイル` -> `git commit -m"コミットメッセージ"` -> `git push`でリモートリポジトリにアップ
8. プルリクエスト出して問題なければ merge する

### 新規プロジェクト（GUIベース）
1. GitHubのページからGUIで新規リポジトリ作成
2. 表示された初期設定コマンドを対象プロジェクトのターミナルに転記して実行
3. `git checkout -b topic` -> `git push -u origin topic`でブランチを切ってリモートの当該リポジトリに接続
4. `git add .` または `git add 各ファイル` -> `git commit -m"コミットメッセージ"` -> `git push`でリモートリポジトリにアップ
5. プルリクエスト出して問題なければ merge する

### 既存プロジェクトを別環境で初めて利用
1. `git clone リポジトリの cloneアドレス`でプロジェクトを用意
2. 環境構築（例：フロントエンドの場合`npm install`で各種設定をインストール）
3. 編集や確認など作業実施（その後の変更点の反映などはこれまでのフローと同じ）

## 差分チェック
- `git diff`<br>
`add`されていないファイルとの差分を見ることができます。
  - ステージングされた（addされた）ファイルの差分をみる
    - `git diff --staged`
  - 最新のコミットとの差分をみる場合
```bash
git diff HEAD   # 最新のコミット
git diff HEAD^  # 最新のコミットの1つ前
git diff HEAD^^ # 最新のコミットから2つ前
git diff HEAD~2 # HEAD^^（最新のコミットから2つ前）と一緒
```

  - 特定のコミットの状態との差分チェック
```bash
git diff abc123 def456  # コミットIDの頭文字を使う
git diff main topic   # ブランチごとの差分チェック
```

> [!NOTE]
> ### 直近のコミット「メッセージ」の変更（修正）
> ```bash
> git commit --amend -m "変更したいメッセージ"
> ```

## 特定のファイルをアンステージ（`add`を取り消す）
- `git restore --staged`
```bash
# 指定したファイルをインデックス（ステージングエリア）から外す。
# ただし、ワークツリーの内容は変更されない。
git restore --staged <file>
```

- ワーキングツリーから変更を破棄（`git restore <file>`）
```bash
# 指定したファイルの変更を「最新のコミットの状態に戻す」ことで破棄
# ファイルは「ステージングエリアにも存在しない状態」に戻ります。
git restore <file>
```

- すべての変更を破棄する場合（`git restore .`）
```bash
git restore .
```

> [!NOTE]
> ※`git restore`はローカルの変更を破棄するだけであり、リモートのリポジトリには影響を与えない。
> - 破棄した変更は復元できないので、必要に応じて変更を`stash`に保存しておく。
> ```bash
> git stash push -m "一時保存"
> ```

### `commit`や`push`を取り消す場合
基本的には`git reset`コマンドか、（チーム開発の場合では）`git revert`コマンドを使用

> [!NOTE]
> ```bash
> git reset --hard # コミットとワークツリーの内容を完全に戻す（危険な操作）
> git reset --soft # コミットだけを戻し、変更内容は維持
> git revert       # 新しいコミットとして戻す変更を作成（履歴が残るため安全）
> ```

- 具体例
```bash
# 直前のコミットを取り消してステージに戻す
git reset --soft HEAD~

# コミットと変更内容の両方を完全に取り消す（※変更内容が完全に消えるため取り戻せない）
git reset --hard HEAD~
```
PS. [後述の救済措置](#救済措置-git-reset---hard-で削除した内容を復元する)を行えば`git reset --hard`を取り消せる。

## コンフリクトが起きた時
すでにステージングしてコミット、プッシュまで行ってコンフリクトしたと想定して進めます。
1. `git status`で状態確認
    - ※ 必要に応じて`git fetch origin main`で最新の状態を確認
2. `git pull origin main`を実行してリモートの`main`リポジトリ最新内容の反映を試みる
    - ※`git checkout <他のブランチ>`で上記を実行するのも可
3. `Already up to data`と表示された場合<br>`git checkout <他のブランチ>`で`main`ブランチまたは`feature`ブランチなどに一旦切り替える
4. `git log`でログを確認して、最新のコミットIDを取得する
5. `git reset --soft <コミットID>`でコンフリクト前のデータやファイルを復元
    - ※ または`git merge --abort`でマージを中止し、クリーンな状態に戻す
6. `git stash`を行ってデータやファイルを一時退避
7. `git pull origin main`を実行して最新内容が反映されているかを確認<br>`Already up to data`と表示されたらok.
8. `git stash pop`を実行して一時退避させていたデータやファイルを復元
    - ※`git checkout <他のブランチ>`で`feature`ブランチなどにいる場合は、`git push -u origin <ブランチ名>`を行って「ローカルのブランチをリモートリポジトリにアップロードし、追跡ブランチを設定」する
9. `git diff`で変更内容を確認
10. あとは従来通り`add`（ステージング）して`commit`（ローカルリポジトリへ変更を記録）して`push`（当該リモートリポジトリへ変更をアップ）する
11. プルリクエストを処理（マージまたはクローズ）

## データ復元（`add`や`commit`, `push`後の差し戻し方法）
1. `git log`で差し戻したいコミットIDを確認する
```bash
git log --oneline    # 1行表示で見やすく
git log --graph      # ブランチの分岐を視覚的に確認
```

2. `git checkout -b <他のブランチ>`などブランチを切る（1と2は逆でもok）
3. `git reset --hard <コミットID>`または`git reset --soft <コミットID>`、または`git revert <コミットID>`
  - 個人の場合：`git reset --hard <コミットID>`または`git reset --soft <コミットID>`
    - `--hard`の場合
```bash
# --hard オプション使用前に以下を推奨
git stash               # 現在の作業内容を退避
git tag backup-YYYYMMDD # 現在の状態をタグとして保存
```

  - チームの場合：`git revert <コミットID>`

> [!NOTE]
> ```bash
> git reset --hard # コミットとワークツリーの内容を完全に戻す（危険な操作）
> git reset --soft # コミットだけを戻し、変更内容は維持
> git revert       # 新しいコミットとして戻す変更を作成（履歴が残るため安全）
> ```

4.  再修正して再度、`git add` → `git commit` → `git push`

## 【救済措置】 `git reset --hard` で削除した内容を復元する
```bash
git reflog  # HEADの変更を確認する（※この記録は約30日間保持される）

# 上記の実行結果
e5f1c7b HEAD@{0}: reset: moving to 1a2b3c4
bf5f890 HEAD@{1}: commit: Fix login bug

# 間違ったresetを元に戻す（※ HEAD@{1} を指定）
git reset --hard HEAD@{1}
```

## `git revert`
コミットの変更を**取り消すための新しいコミットを作成**する。<br>
`revert`は**新しいコミットとして変更を打ち消していく**アプローチを取る。

```bash
# Eを打ち消す場合
git revert <EのコミットID>
# 結果: A -> B -> C -> D -> E -> E'

# さらにDも打ち消す場合
git revert <DのコミットID>
# 結果: A -> B -> C -> D -> E -> E' -> D'
```

- 各コミットは独立して打ち消される（＝**コミットIDごとに`revert`する必要**がある）
- 打ち消しも新しいコミットとして記録される
- 履歴が残るため、何を打ち消したのかが追跡可能


## `git rebase`
コミット履歴の整理を行う（切ったブランチの分岐をまとめて一直線の履歴に修正する）。<br><br>

*例： 作業ブランチ（`feature`）を、最新の主ブランチ（`main`）の先端に適用する（移動して再構成する）*<br><br>

これにより作業履歴が一直線になり、きれいに整理される。<br>
注意点として`git rebase`では、**あくまで作業ブランチ側が変更**されて（プッシュしてマージするまでは）主ブランチは変更されない。

- コンフリクト発生時のフロー
1. コンフリクト発生時、`rebase`が一時停止
2. 従来通り手動でコンフリクトを解消
3. `git add`でコンフリクト解消を記録
4. `git rebase --continue`で再開<br>
必要に応じて2〜4を繰り返す<br><br>
変更履歴が書き換わるため、最後にプッシュする時は以下を実行する。

```bash
# 安全なフォースプッシュ
git push --force-with-lease origin feature
```

結局のところ、`rebase`でしていることは「履歴の管理（見え方）が異なる」だけで、一般的な手法で行うとすれば`git add <変更ファイル>`, `git commit -m"featureブランチの変更をmainブランチにマージ（プルリク）"`, `git push`してマージするのと同じ。

---

> [!NOTE]
> ### `git rebase --onto`
> 上記で説明したフローをより端的に行える`git rebase --onto`というものもある。
> ```bash
> git rebase --onto <新しいベース> <古いベース> <移動させたいブランチ>
> ```
> 
> - 具体例
> ```bash
> # branch2 に移動（※ branch2 がすでにある前提）
> git checkout branch2 # checkout は非推奨なのでブランチ切替・移動の場合は switch 推奨
> 
> # branch2 の基点を branch1 から main に変える
> # 1. branch1 のコミットのうち main に含まれていないものを特定する。
> # 2. branch2 のコミットのうち branch1 由来のものを除外する。
> # 3. branch2 の変更を main の先端に適用する。
> git rebase --onto main branch1 branch2
> ```

- 参考情報：[Gitの衝突を回避！ git rebase --onto の活用法](https://qiita.com/schoo_y_kawamura/items/57c8eeedf9e9259cf707)

---

```bash
- `git rebase`： ひとつにまとめる一元管理
- `git add` → `git commit` → `git push`： 一般的なコミット履歴管理
```

## `git stash` / `git stash pop`（作業の一時保存/復元）
例えば、実際の作業場所（デスク）があって、作業内容を一時保存できる箱があるとします。<br>
途中で別の作業が入った場合など、デスクで作業していた内容を箱に保存するのが`stash`です。<br><br>
そして別の作業が済んで、元の作業を行いたいときに`stash pop`すると箱の中の**直近の作業内容をデスクに取り出せます**。<br>
この時、すでに複数の作業内容が箱に入っている場合は`stash pop {number}`で特定の作業内容を取り出して復元することも可能です。ただし、このとき指定した作業内容も削除されます。

```bash
git stash list             # スタック内の作業内容を確認
git stash pop stash@{3}    # 3番目の作業内容を取り出して削除
```

例えば、A～Eまで箱に入っていて、`{3}`を指定するとCの作業内容を復元し、箱からCの作業内容が削除されます。<br><br>

### 注意点
`git stash pop`は取り出した内容を適用しようとするが、 **適用できない場合（コンフリクト）** が発生する可能性がある。<br>その場合、手動でコンフリクトを解消し、必要に応じて再度`git stash drop`を実行して該当のスタッシュを削除する必要がある。

```bash
git stash apply stash@{3}    # 特定の作業内容を取り出して適用（ただし削除しない）
git stash drop stash@{3}     # 手動で特定のスタッシュを削除
```

- 参照[【Git】 git stash について 簡単に説明するよ](https://qiita.com/tsubasa_k0814/items/73b76a3a2a6a4099ab99)

## バックアップ用に日付付きでブランチを切る
```bash
# 今日の日付が 2025-05-11 の場合 
# `develop`ブランチを元に`develop-backup-20250511`のようなブランチを作成
git branch develop-backup-20250511 develop
```

> 定期的なメンテナンスやマージ前に、現在のブランチを日付付きでバックアップしたい場合に便利なコマンド<br>
> これで、万が一のロールバックが必要になった際にも簡単に復元できます。

- 参照記事：[【Git】小技集](https://qiita.com/climber-miyagi/items/9ba0af1e7cb19c0ccb53)

## `Squash Merge`（細かな修正・作業内容を一つにまとめてマージする）
（`GitHub Flow`を前提で述べると）`topic`または`feature`ブランチで作業を行い、当該ブランチにて都度コミットし、ある程度まとめて`main`ブランチにマージする、という手法。<br>
マージする際、そのブランチの**全てのコミットを1つの単一のコミットに圧縮（squash）**する。結果として`main`ブランチには`topic`ブランチの作業内容が**1つのクリーンなコミットとして統合**される。

### 具体的な処理例
1. `git checkout -b topic`（または`feature`）
2. `git push -u origin topic`（または`feature`）<br>
※ここまでは事前準備フェーズ<br><br>

3. （`git status` -> ）`git add <ファイル>`（または`.`）
4. `git commit -m"fix: ..."`<br>
※ここで作業・修正を重ねる（squash用の各commitをためる）<br><br>

5. `git push`<br>
最後にプッシュして`main`ブランチにマージ（`Squash Merge`の実施）
  - ※`Pull Request`画面で`Squash and merge`を選択すること<br>マージ後は通常通り、使用した作業ブランチを削除する

## 既存のリポジトリから接続解除
```bash
# 削除されたリモートリポジトリとの接続を削除
git remote remove origin

# 必要に応じてブランチ名を変更（topicからmainへ）
git branch -m topic main
```
