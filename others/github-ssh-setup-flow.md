# GitHub SSH認証セットアップと開発フロー

## 1. SSH認証の初期設定

### 1.1. SSHキーペアの生成
```bash
# 1. SSHキーの生成（メールアドレスは自身のGitHubアカウントのものを使用）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. SSH-Agentの起動と鍵の登録
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. 公開鍵の内容を表示（これをGitHubに登録）
cat ~/.ssh/id_ed25519.pub
```

<details>
<summary>別の方法</summary>

```bash
# 1. 当該ディレクトリに.sshディレクトリがない場合は作成
mkdir -m 700 .ssh    # パーミッション700で作成（重要）

# 2. SSH鍵の生成（現在推奨される方式）
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- ディレクトリ作成<br>
`mkdir .ssh`の際にパーミッションを設定することを推奨<br>
`-m 700`を追加（所有者のみ読み書き実行可能）<br>

- `-C` "メールアドレス"でコメントを追加すると管理が容易<br>

</details>

### 1.2. GitHubへの公開鍵の登録
1. GitHubにログイン
2. Settings > SSH and GPG keys > New SSH key
3. タイトルを入力（例：My Work Laptop）
4. 公開鍵の内容をKey欄に貼り付け
5. [Add SSH key]をクリック

### 1.3. 接続テスト
```bash
ssh -T git@github.com
# "Hi username! You've successfully authenticated..." が表示されれば成功
```

## 2. 既存リポジトリのSSH認証への切り替え

### 2.1. リモートURLの確認と変更
```bash
# 現在のリモートURLを確認
git remote -v

# SSHのURLに変更（usernameとrepositoryは実際のものに置き換え）
git remote set-url origin git@github.com:username/repository.git
```

> [!NOTE]  
> `git remote -v`の出力に`git@github.com:username/repository.git`の形式が含まれていれば、それはSSH認証です。<br>つまり、URLに`git@github.com:`が含まれている場合は、すでにSSH認証が設定されているということになります。

## 3. 開発フロー

### 3.1. 新規リポジトリのクローン
```bash
# SSHでクローン
git clone git@github.com:username/repository.git
cd repository
```

### 3.2. ブランチ作成から開発
```bash
# 開発用ブランチの作成と切り替え
git checkout -b feature/new-feature

# 変更の追加とコミット
git add .
git commit -m "Add new feature"

# リモートへのプッシュ
git push origin feature/new-feature
```

### 3.3. プルリクエストとマージ
1. GitHubのリポジトリページを開く
2. [Compare & pull request]をクリック
3. プルリクエストの内容を記入
   - タイトル
   - 説明
   - レビュアーの指定（必要に応じて）
4. [Create pull request]をクリック
5. レビュー後、承認されたら[Merge pull request]をクリック

### 3.4. ローカルの更新
```bash
# mainブランチに切り替え
git checkout main

# リモートの変更を取り込む
git pull origin main

# 不要になった開発ブランチの削除
git branch -d feature/new-feature
```

## 4. トラブルシューティング

### 4.1. よくある問題と解決方法
- 認証エラー → SSH-Agentが起動しているか確認
- Permission denied → 公開鍵が正しくGitHubに登録されているか確認
- Host key verification failed → ~/.ssh/known_hostsを確認・更新

### 4.2. SSHキーのバックアップ
- 秘密鍵（~/.ssh/id_ed25519）は安全な場所にバックアップ
- 新しいデバイスでの作業時は、新しいSSHキーを生成することを推奨

--- 

### 参照
[これだけはできてほしいgitとGitHub](https://qiita.com/tomoswifty/items/be3ff39ab3361a8e9c47#3-ssh%E3%81%A7%E3%81%AEgithub)