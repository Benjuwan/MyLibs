# 現代のWeb開発とデプロイメント手法の比較ガイド

## 1. 従来のFTPクライアントについて

### 現状の評価
- **CyberduckやFileZillaを使ったweb開発は現在モダンではない**
- **グローバルでは一般的でもない**
- **しかし、日本国内では現実的な手段として依然利用されている**

### 従来手法の問題点
- バージョン管理が困難
- チーム開発に向かない
- 手動作業によるミスが発生しやすい
- バックアップや復元が面倒
- セキュリティリスクが高い

## 2. 現代の主流デプロイメント手法

### 静的サイト
- **Netlify、Vercel**: 自動CI/CD付き
- **AWS S3**: 確実に一般的
- **GitHub Pages、GitLab Pages**: 無料で手軽
- **Cloudflare Pages**: 高速配信

### 動的サイト（WordPress等）
**海外・大規模プロジェクト:**
- AWS EC2、Google Cloud、Azure

**日本国内の実情:**
- エックスサーバー、ロリポップ、さくらのレンタルサーバー
- ConoHa WING、mixhost
- 従来のレンタルサーバーが依然として主流

## 3. 日本特有の課題と解決策

### 課題
日本の従来レンタルサーバーには、NetlifyやVercelのような**自動CI/CD機能が標準で提供されていない**

### 解決策

#### 3.1 GitHub Actions + FTP
```yaml
# .github/workflows/deploy.yml の例
name: Deploy to FTP
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: FTP Deploy
      uses: SamKirkland/FTP-deploy-action@4.3.3
      with:
        server: ftp.example.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        server-dir: /public_html/
```

**仕組み:**
- GitHub Actionsが**FTPクライアントの役割を自動化**
- CyberduckやFileZillaの手動作業を、コードpushで自動実行
- 従来のレンタルサーバーでもモダンなワークフローを実現

#### 3.2 SSH + Git（リモートリポジトリ作成）
```bash
# エックスサーバーのSSH接続先で
mkdir mysite.git
cd mysite.git
git init --bare  # ベアリポジトリを作成

# ローカルから
git remote add production user@server.com:/path/to/mysite.git
git push production main
```

**重要な理解:**
- リモートリポジトリはGitHubだけでなく、**どこにでも作成可能**
- レンタルサーバー自体をGitのリモートリポジトリにできる

## 4. GitHub Actionsの理解

### 基本概念
- **CI/CDを構築するツール・機能システム**
- GitHubリポジトリとデプロイ先を連携
- 安全な更新経路を提供

### 重要な特徴
- **どんなデプロイ先でも対応可能**
- Vercel、Netlifyなどの特別な機能は不要
- 既存のFTPサーバーでも自動化可能

## 5. ハイブリッド運用パターン

### 基本構成
```
ローカル開発環境
    ↓ (git push origin main)
GitHub/GitLab (開発・レビュー・バージョン管理)
    ↓ (git push production main)
本番サーバー (デプロイ専用)
```

> [!IMPORTANT]
> - **`origin`, `production`はブランチ名ではなく、リモートリポジトリの名前**<br>
> `git push <リモートリポジトリ> <ブランチ名>`

- リモート接続先は別々であるものの中身（main）は同じ<br>
`origin`, `production`どちらもローカルの`main`ブランチを`push`しており、それぞれのリモートに同じ履歴が複製されている状態。
```
ローカルリポジトリ
├── main（ブランチ）
│
├── origin（GitHub での主流リポジトリ）
│    └── main（origin/main： 同名ブランチ`main`だがリモート接続先`origin`が別）
│
└── production（エックスサーバー等ホスティング先の公開用途）
     └── main（production/main： 同名ブランチ`main`だがリモート接続先`production`が別）
```

### 実際の作業フロー
1. **開発フェーズ**
   ```bash
   git checkout -b feature/new-function
   
   # -u または --set-upstream： リモートとブランチのペア付け。「今後このブランチはどのリモート・ブランチと紐づくか」を記録
   git push -u origin feature/new-function
   
   git add .
   git commit -m "新機能追加"
   git push

   # マージ後はリモートブランチを削除（GitHub上のGUI操作でも可）
   git push origin --delete feature/new-function

   # 開発用ローカルブランチも削除しておく
   git branch -d feature/new-function
   ```

2. **GitHubでのレビュー・マージ**
   - Pull Request作成
   - コードレビュー
   - mainブランチにマージ

3. **本番デプロイ**
   ```bash
   git checkout main
   git pull origin main
   git push production main  # 本番サーバーに直接push
   ```

### 重要なポイント
- **mainブランチの保存先は2箇所**
  - GitHub/GitLab: 開発・バージョン管理・バックアップ
  - 本番サーバー: デプロイ専用
- エックスサーバー等ホスティング先の公開用途ブランチには**プルリクエストではなく、直接push**<br>
GitHub上では Pull Request を使ってレビュー＆マージするが、エックスサーバー上では「レビュー機能がない」ためデプロイは`git push production main`による直接反映となる

### 本番サーバーでの管理
```bash
# サーバー上で（一度だけ実行）
git init --bare /path/to/repo.git

# 自動デプロイの設定（post-receiveフック）
#!/bin/bash
cd /var/www/html
git --git-dir=/path/to/repo.git --work-tree=/var/www/html checkout -f
```

## 6. 学習の推奨順序

### 理想的な学習フロー
- TDD/テスト → GitHub Actions（テスト自動実行） → 自動デプロイ

#### 理由
1. **テストが土台**: CI/CDの「CI」は自動テスト実行が核心
2. **安全性**: テストなしの自動デプロイは危険
3. **自然な発展**: テスト習慣 → 自動実行 → 自動デプロイ

## 7. 実践例：Reactプロジェクトのデプロイ

### 手動パターン（少数派：手動管理）
```
開発リポジトリ (React プロジェクト)
    ↓ npm run build
    ↓ 手動でdistファイルをコピー
distリポジトリ (ビルド済みファイル)
    ↓ プルリクエスト＆マージ
本番環境
```

### 自動化パターン（ハイブリッド運用）
```
開発リポジトリ (GitHub)
    ↓ 開発・レビュー・マージ
mainブランチ (本番環境と同じ内容)
    ↓ git push production main
ホスティング先サーバー (自動更新)
```

### さらなる自動化（GitHub Actions）
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build
      run: npm run build
    - name: Deploy to server
      # dist の内容を直接サーバーにpush
```

## まとめ

- **FTPクライアントはモダンではないが、日本では現実的な選択肢として残存**
- **GitHub Actions + FTPやSSH + Gitで、従来サーバーでもモダンなワークフローを実現可能**
- **ハイブリッド運用により、GitHubでの開発管理と直接サーバーデプロイを両立**
- **本質は「git push = ファイルの更新」、自動化のレベルが違うだけ**
- **学習は テスト → CI/CD の順序が理想的**