---
title: "Next.js（v15）× Prisma × PostgreSQL で会議室予約システムを作ってみた"
emoji: "⭐"
type: "tech"
topics:
  - "nextjs"
  - "postgresql"
  - "react"
  - "prisma"
  - "orm"
published: true
published_at: "2025-01-15 11:20"
---

## はじめに
本記事は、以下記事の派生版になります。

https://qiita.com/benjuwan/items/c4341ca41758b076a385

ローカル環境で直ぐに試せる`Prisma`×`SQLite`の組み合わせで作成しています。
記事では主に`Prisma`×`SQLite`の設定をはじめ、予約システムの概要や開発面で意識したこと、API操作やUIについてなど包括的な説明を行っています。

本記事では、タイトルにあるように`Prisma`×`PostgreSQL（Vercel）`における各種設定やつまづきポイントなどの話を軸にしたいと思います。

というのも、データベース（`PostgreSQL`）の用意や設定、デプロイにおける設定、別PCでの開発環境設定など上記記事（`Prisma`×`SQLite`）の内容と諸々勝手が異なる部分があったので別記事にしようと思った次第です。

今回筆者が作成した会議室予約システムに関心を持っていただいた方は、恐れ入りますが詳細に関しては先の記事をご覧いただけますとありがたいです。

### 本記事の概要
本記事では、会議室予約システムや開発経緯など概要は手短に説明し、本題（`Prisma`×`PostgreSQL`における各種設定やつまづきポイント）に話を進めていきたいと思います。

- 今回筆者が作成した会議室予約システムについて
  - 制作経緯 
    - 筆者所属企業及びグループ企業で使用している従来の会議室予約システム（`Perl`×`CGI`の仕組みで動くライブラリ）が、UI含めて古くなってきており社内でメンテナンスできる人材もいない状態で長年使用されてきたのでモダナイゼーションしようと昨年12月ごろから本格的に開発スタート
  - 機能（従来の予約システムと同じ機能）
    - 各部屋ごとに予約・編集できる
      - 編集作業は予約時に一緒に登録したパスワードで制御
    - 各部屋の予約時間を視覚的に確認できるタイムテーブル
    - 予約時間に関する検証機能（他者との予約重複や指定時間帯外への登録）
  - 2パターン作成
    - 開発・テスト用：`Next.js`（v15）×`prisma`×`SQLite`
    - 本番用：`Next.js`（v15）×`prisma`×`PostgreSQL`
  - UIキャプチャ
    - スケジュール画面
    ![スケジュール画面](https://storage.googleapis.com/zenn-user-upload/368c1b689431-20250114.png)
    - 予約内容の編集フォーム画面
    ![予約内容の編集フォーム画面](https://storage.googleapis.com/zenn-user-upload/7887727f9590-20250114.png)
    - 編集完了後のスケジュール画面
    ![編集完了後のスケジュール画面](https://storage.googleapis.com/zenn-user-upload/ac3b6f1140bf-20250114.png)

従来の予約システムでは、編集作業や各部屋の予約内容を確認するには各部屋ページに遷移しないと操作・確認できませんでしたが、一画面（会議室予約画面）で登録・確認・編集が行えるUIに変更しました。

## 技術構成
├── @prisma/client@6.2.1
├── @types/node@20.16.11
├── @types/react-dom@19.0.2
├── @types/react@19.0.1
├── @types/uuid@10.0.0
├── eslint-config-next@15.1.1
├── eslint@8.57.1
├── jotai@2.10.0
├── next@15.1.3
├── prisma@6.2.1
├── react-dom@19.0.0
├── react@19.0.0
├── typescript@5.6.2
└── uuid@10.0.0

## 部屋と予約時間の管理
予約システムにおける各部屋と時間帯は以下のように一ファイルで一元管理しています。
```ts
import { atom } from "jotai";
import { roomsType } from "../components/rooms/ts/roomsType";

export const timeBlockBegin: number = 9; // 予約可能-開始時間
export const timeBlockEnd: number = 21;  // 予約可能-終了時間

//「：」より後の文字がスケジュールテーブルに表示されます
const rooms: roomsType = [
    { room: '会議室A(大) ※奥：4F-A' },
    { room: '会議室B(小) ※手前：4F-B' },
    { room: 'フリースペース：7F' }
];
export const roomsAtom = atom<roomsType>(rooms);
```

各部屋はデータベースでテーブル管理しているわけではないので、部屋数や時間帯などは上記ファイルで柔軟かつ容易に変更できるようになっています。

ちなみに、テーブルの中身は以下です。
```
model Reservation {
  id          String   @id @default(uuid())
  todoID      String
  todoContent String
  edit        Boolean  @default(false)
  pw          String
  person      String
  rooms       String
  startTime   String
  finishTime  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

上記内容のオブジェクトを予約リストとして`jotai`で状態管理しています。

## `Prisma`の設定
- `Prisma`について簡潔なおさらい
`Prisma`は、データベースとのやり取りを簡単にする`ORM`というツールです。`ORM`とはデータベースのテーブルをオブジェクトとして操作できる技術で、`SQL`を書かなくても`JavaScript`（`TypeScript`）のコードだけでデータベース操作ができるようになる代物です。

### `Vercel`×`Prisma`
以下は新規でデータベース作成及び反映させる手順になります。

1. `Vercel`に当該`GitHub`リポジトリをリンク（デプロイする）
2. `Vercel`ダッシュボード内の[`Storage`]で[データベース](#neon%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)を作成
3. 以下の`prisma`の設定を行っていく
 - Prismaのインストール（※インストールしていない場合）
 ```bash
 # Prisma のプロジェクトを初めてセットアップするケース
 # CLI ツールとクライアントの両方をインストール
 npm install prisma @prisma/client

 # Prisma クライアントをインストールまたは更新するだけのケース
 # たとえば、本番環境やすでに Prisma CLI をセットアップ済みの場合
 npm install @prisma/client
 ```

 - Prismaの初期化
 ```bash
 npx prisma init
 ```

 - マイグレーションフォルダの生成
 ```bash
 npx prisma migrate dev --name init
 ```

 - クライアントの生成
 ```bash
 npx prisma generate
 ```

4. `.env`, `.env.local`の設定をはじめ、Vercel での環境変数の設定も行う
- `.env`
`.env`は`npx prisma studio`の実行（`prisma studio`の起動）に必要なので用意する。
※`prisma studio`は`GUI`でテーブル操作できる`prisma`の機能の一つ。`GUI`でパパっと手っ取り早くテーブル操作したい場合に便利です。

`DATABASE_URL`は[`vercel`ダッシュボード]-[当該プロジェクト名]-[Storage]ページの`Quickstart`欄で確認する
```bash
DATABASE_URL=postgres://...
```

- `.env.local`
必要な各種環境変数の管理
```bash
# Vercel（本環境）の環境変数に設定する`NEXT_PUBLIC_API_URL`には、リンク（デプロイ）時に生成されたURLアドレス（例： https://my-vercel-app.vercel.app/ ）を記述
NEXT_PUBLIC_API_URL="http://localhost:3000/"

# データベース（postgresql）に関わる各種環境変数は[ vercel ダッシュボード]-[当該プロジェクト名]-[Storage]ページの Quickstart 欄で確認
```

`Vercel`（本環境）の環境変数に`NEXT_PUBLIC_API_URL`を用意（設定）するのを忘れないようにしてください。

::: message
蛇足ですが**環境変数に`NEXT_PUBLIC`を前置したものはクライアントサイドに露出する**のでセンシティブな情報（例：APIキーなど）には付けないよう気をつけたいところです。
:::

5. `prisma`クライアントやスキーマの設定
- `prisma`クライアントの設定
```ts
// src/lib/prisma.ts

/* クライアントで prisma を通じてデータベースを操作・利用するための機能をインポート */
import { PrismaClient } from '@prisma/client';

/* グローバルスコープに PrismaClient のインスタンスを保持するための型定義 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/* PrismaClient のインスタンスが存在しない場合は新規作成 */
export const prisma = globalForPrisma.prisma || new PrismaClient();

/* 開発環境の場合のみ、グローバルオブジェクトに PrismaClient インスタンスを保持 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- `prisma\schema.prisma`の設定
```
generator client {
  provider = "prisma-client-js" // Prismaクライアントを生成するためのライブラリを指定
}

datasource db {
  provider = "postgresql"           // 使用するDBの種類を指定（vercel postgresql）
  url      = env("DATABASE_URL")    // データベースの参照先URL（.env の DATABASE_URL の値）
}

// データベースの（ Reservation ）テーブル内容とリンクさせるための設定
model Reservation {
  id          String   @id @default(uuid())
  todoID      String
  todoContent String
  edit        Boolean  @default(false)
  pw          String
  person      String
  rooms       String
  startTime   String
  finishTime  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

ここまで進めてデプロイ後、もしサイトがうまく表示されない場合は環境変数が適切に反映されていないかもしれないので**再度デプロイを試みて**ください。

https://vercel.com/docs/deployments/managing-deployments#redeploy-a-project

#### `Vercel`デプロイ時に`prisma`起因のエラー
ちなみに、筆者は`Vercel`デプロイ時に`prisma`起因のエラーに遭遇しました。
```
Error [PrismaClientInitializationError]: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the `prisma generate` command during the build process.
```

デプロイ時に上記エラーが`Vercel`ログに出力され、サイトが全く表示されませんでした。

これは`Vercel`の「`Node.js`の依存関係をキャッシュ」する働きによって「古い`Prisma Client`が使用されてしまって」デプロイエラーになっていたようです（＝`Prisma Client`の自動生成が正しく実行されていなかった）。

解決策は以下になります。
- `build`時に`prisma generate`で`Prisma Client`を新規制作するように変更する
```diff
// package.json

{
  "scripts": {
    "dev": "next dev",
-   "build": "next build",
+   "build": "prisma generate && next build",
    ...
    ..
    .
  }
}
```

この変更で無事にサイトが表示されました。

#### `Neon`について
補足として、`Vercel`では現在`Neon`というサービスを通じて`PostgreSQL`を使用できるようです。

> Vercel Postgres is powered by a partnership with Neon

以下記載の通り`Neon`のアカウントを別途作成しなくとも利用できます。

> You do not need to create a Neon account to use Vercel Postgres.

https://vercel.com/docs/storage/vercel-postgres

ちなみに、データベースの使用制限に近づいた、または超えた場合は通知及び停止処理が行われて30日後の制限解除を待たねばなりません。

> Vercel will send you emails as you are nearing your usage limits. You will not pay for any additional usage. However, you will not be able to access Vercel Postgres if limits are exceeded. In this scenario, you will have to wait until 30 days have passed before using it again.
> Vercelは利用限度額に近づくとメールを送信します。追加の利用料金を支払う必要はありません。ただし、制限を超えるとVercel Postgresにアクセスできなくなります。この場合、30日経過してから再度ご利用ください。

https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing

`Neon`のページにも似たような記述がありました

> If you go over the 5 compute hour allowance for non-default branch computes, those computes are suspended until the allowance resets at the beginning of the month. If you go over the 191.9 compute hour allowance, all computes are suspended until the beginning of the month.
> デフォルトのブランチ以外のコンピュートで5コンピュート時間の許容量を超えると、月初に許容量がリセットされるまで、それらのコンピュートは一時停止されます。191.9時間の計算時間を超過した場合、すべての計算が月初めまで中断されます。

https://neon.tech/docs/introduction/plans

--- 

ここまで完了すると、新規作成した（`Neon`の）データベース（`postgreSQL`）と連携したサイトを使えるようになっていると思います。

もし、サイトがうまく表示されない場合は、`Vercel`のダッシュボードから当該プロジェクトを選んで[Logs]欄を確認してみてください。そこにエラー情報が記述されているはずです。

https://vercel.com/docs/observability/runtime-logs#view-runtime-logs

## 異なる開発環境（別PC）で作業する場合
筆者は主に Windows と Mac を使っており、今回は Windows メインで開発を進めていました。上記の設定及びデプロイが完了して Mac のローカルデータ（ローカルリポジトリ）に最新情報を`pull`したところ、サイトが表示されるものの予約機能が一切動作しませんでした。

原因は単純で「Macのローカルリポジトリには、環境変数をはじめ、`Vercel`での各種設定が全く反映されていない」ためです。

メインで進めていた Windows のローカルリポジトリには`Vercel`での設定時に自動的に用意された`.vercel`ファイルがありましたが、これは秘匿性の高いファイルなのか`.env`ファイルなどと同様に ignore の扱いになっていました。

当初、この`.vercel`ファイルをそのまま Mac のローカルリポジトリにコピーすれば良いかと思った（絶対良くない）のですが、順当な方法を知っておきたいと思って検証しました。

--- 

前提として`.vercel`フォルダをはじめ、各種環境変数（`.env`, `.env.local`）の設定を行わなければなりません。
これらの設定を通じて Vercel（を通じて連携しているデータベース`postgresql`）に接続し、開発環境を整えることができます。

1. [`Vercel CLI`](https://vercel.com/docs/cli)をインストール
```bash
npm i -g vercel
```
 - 上記コマンドを権限制限により実行できない（インストール許可がされない）場合は
   - Windows
   `vscode`のターミナルではなく`コマンドプロンプト`で実行してみる。それでもできない場合は以下に進む（`vscode`利用）
   - Mac
     1. `vscode`を開いて`com/ctrl + shift + p`で表示される入力項目に`Shell`と打鍵し、`シェルコマンド:PATH内に'code'コマンドをインストールします`を選択。選択後は画面に表示されるフロー通り許可してインストールを進めていく。
     2. 以下のフローを進める
        - グローバルパッケージのインストール先ディレクトリを確認。通常`/usr/local`や`/usr/lib/node_modules`など管理者権限が必要な場所が表示される。
        ```bash
        npm config get prefix
        ```
        
        - グローバルパッケージのインストール先をユーザーディレクトリに変更
        ```bash
        mkdir -p ~/.npm-global
        npm config set prefix '~/.npm-global'
        ```
        
        - 環境設定： `~/.zshrc`や`~/.bashrc`など、使用しているシェルの設定ファイル末尾に`export PATH=~/.npm-global/bin:$PATH`を追加。
          `nano ~/.zshrc`で当該ファイル（使用しているシェルの設定ファイル）を開ける
        ```bash
        export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

        ## 以下を追加
        export PATH=~/.npm-global/bin:$PATH
        ```
        
        - 設定を反映
        ```bash
        source ~/.zshrc  # または ~/.bashrc
        ```
        
        - 再度インストールを試す
        ```bash
        npm i -g vercel
        ```
        
     3. Vercel へログイン
     ```bash
     vercel link
     ```
     
     ログイン種別（`GitHub`, `GitLab`, `Bitbucket`, `Email`など）を選択後、ターミナルに表示された指示通りに進めて（データベース連携している）当該プロジェクトを設定すると`.vercel`フォルダが生成されます。用が済んだら以下でログアウトしていても良いかもです。
     
     ```bash
     vercel logout
     ```
     
     4. 環境変数の設定
     データベース接続に必要な環境変数を、 Vercel ダッシュボードで確認し、ローカル環境の`.env`, `.env.local`ファイルに設定。
     5. Vercel（を通じて連携しているデータベース`postgresql`）に接続
     ::: message
     開発初期段階またはプロトタイプの場合は`npx prisma db push`で良いのですが、既に中身のある**本環境で機能しているデータベースの場合**は`npx prisma migrate dev`でなければなりません。
     :::
     - `npx prisma migrate dev`を使う理由（※`claude`回答）
       - データの整合性と安全性
         - `migrate dev`は、データ損失のリスクを最小限に抑えるように設計されている
         - 変更の影響を事前に確認でき、危険な操作がある場合は警告が表示される
       - 変更の追跡と管理
         - 各変更がSQLファイルとして記録されるため、どのような変更が行われたか常に把握できる
         - 問題が発生した場合、変更履歴を追跡して原因特定が容易
       - チーム開発との整合性
         - 他の開発者も同じマイグレーション履歴に従うことで、環境間の一貫性が保たれる
         - 本番環境とステージング環境で同じ変更を確実に適用できる
       - ロールバックの可能性
         - 問題が発生した場合、以前の状態に戻すことが可能
         - `db push`ではこのような安全性は確保できません

---

`Prisma`×`SQLite`ではこのような設定を行う必要がなかったので、この点は少し手間でした。
このあたりは単一ファイルでデータベース管理できる`SQLite`のメリットでもありますね。

あと、筆者の知識や経験不足から冗長で複雑な手順になっているかもしれません。
もし何かお気づきの方はお教えいただけますとありがたく存じます！

最後にテーブルの変更・更新について書いていきます。
こちらは`Prisma`×`SQLite`と同じ方法で済みました。

## データベースの仕様（テーブル）更新
登録している現状の内容（テーブル）から特定項目を削除したり、追加したりといった変更は以下のように行います。

- `prisma/schema.prisma`
`model`オブジェクトの内容を編集（登録内容を追加・削除）
- `prisma/schema.prisma`の`model`オブジェクト編集後、以下のコマンドをターミナルに打つ
```bash
# マイグレーションファイルを作成し、データベースに変更を適用
npx prisma migrate dev --name what_you_changed # --name 以降は任意の命名

# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```

::: message
- `prisma/dev.db-journal`
`dev.db-journal`という設定中のデータベース（今回は`postgresql`）の内部処理用ファイルが自動的に生成・削除されるが無視して構いません。`dev.db-journal`は`postgresql`が自動的に管理する`postgresql`のトランザクションログファイルで、データベース操作の一時的な記録を保持しています。
:::

---

※**本記事で紹介している予約システムのテーブル更新を行う場合は更に以下のフローが必要**になります。

- `src/app/components/schedule/todoItems/ts/todoItemType.ts`
登録内容の型情報を編集
- `src/app/components/schedule/todoItems/TodoForm.tsx`
  - `todoItems`ステートの初期値である`initTodoItems`オブジェクトを編集（オブジェクトに当該登録内容であるプロパティ・キーを追加・削除）
  - （変更した）当該登録内容に関する入力フォームを（`src/app/components/schedule/todoItems/utils`配下に）用意または調整
- `src/app/api/reservations/`配下の`Route Handlers`の登録内容を編集
  - `POST`, `PUT`に関する`data`オブジェクト内を編集（例：プロパティ・キーの追加など）
    - ※`data`オブジェクト編集後に型エラーが表示される場合は一旦`VSCode`を閉じてみる

::: message
- 上記フローを経ても予約登録機能が動かない場合
上記フローを経て、`git pull origin main`で当該リモートリポジトリと整合性を取ったのに**予約登録機能が動かない**場合は以下のコマンドを`ターミナル`で打つ。
※ WindowsPC でコマンドを実行した際に権限上のエラーが発生した場合は`コマンドプロンプト`で再度試してみる。
```bash
# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```
::: 

## さいごに
今回の開発では`Next.js`（v15）を実際に使ってみたことに加えて、以前から気になっていた`ORM`（`Prisma`）や`PostgreSQL`も触れたので一石三鳥のようなものでした。

筆者としてはキャッチアップになったので良かったですが、やはり`SQLite`は開発やテスト、プロトタイプとしての用途が強いように感じます。
本格的な運用を前提とする場合は初めから`Supabase`など`BaaS`を利用したり、`MySQL`や`PostgreSQL`などデータベースを用意したりするのが無難だと感じました。

本記事に関して何か間違いや気になる点があればご教授いただけますとありがたく存じます！

ちなみに、今回作った予約システムに関する`GitHub`は自由に使っていただいて結構ですので関心のある方はどうぞです。

https://github.com/Benjuwan/reserve-sys