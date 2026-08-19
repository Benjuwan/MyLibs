---
title: "ログインやアカウント登録も不要なイベントスケジュール公開機能"
emoji: "🗓️"
type: "idea"
topics:
  - "nextjs"
  - "react"
  - "typescript"
  - "prisma"
  - "zennfes2025free"
published: true
published_at: "2025-09-12 14:42"
---

# はじめに
先にネタバレしておくと、タイトルにある「ログインやアカウント登録も不要」とは「特定ページ（`/ctrl-schedules`）でのみイベントスケジュールの編集が行える」というものです。

![gifキャプチャ](https://storage.googleapis.com/zenn-user-upload/5535ba8af065-20250911.gif)

つまり、**当該ページ（`/ctrl-schedules`）の存在さえ知っていれば誰でもアクセスして編集でき（てしまい）ます**。

そうです。**明らかに実用的ではありません**。

では、何故こんなものを筆者が作ったかというと「業務におけるアカウント発行やログインという行為自体を億劫に感じる（※必要に応じて当然行うものの極力したくはない）」という方々の存在を知ったためです。
具体的には、筆者所属のグループ企業内における種々の方々がペルソナになります。

当機能は Next.js（v15）で作っており、本来であれば（筆者は未使用ですが）[`Auth.js`](https://authjs.dev/)など認証系ライブラリまたはサービスを使ってログイン機能を実装するのが一般的だと思います。

しかし、先に少し述べたように「ちょっとしたサービス（機能）ならもっと気軽に使いたいんだ！」という動機を持つユーザーのために作成した次第です。

ニーズはまぁ少ないでしょうが、もしかしたら当グループ企業内の社員たちと同じような気持ちの方々もいるかもしれないと思い、記事にして公開することにしました。

## ログインやアカウント登録も不要なイベントスケジュール公開機能
https://github.com/Benjuwan/event-calendar-sqlite

技術構成は以下になります。
```
@eslint/eslintrc@3.3.1
@prisma/client@6.15.0
@types/node@22.18.0
@types/react-dom@19.0.2 overridden
@types/react@19.0.1 overridden
@types/uuid@10.0.0
eslint-config-next@15.1.1
eslint@8.57.1
jotai@2.13.1
next@15.5.2
prisma@6.15.0
react-dom@19.0.0
react@19.0.0
typescript@5.9.2
uuid@11.1.0
```

大まかに、Next.js でフロントエンド・バックエンド領域を対応していて、SQLite（イベントスケジュールデータを管理するDB）をORM（Prisma）を通じて使っているというものです。
状態管理ライブラリには jotai を利用していて、固有ID発行のために uuid を使っているといった具合で他は特筆すべきところはありません。

## 一般ユーザーが行えること
一般ユーザーが行えるのは「イベントスケジュールの確認」だけです。

![](https://storage.googleapis.com/zenn-user-upload/35af9e774163-20250911.png)

具体的には、上部タイムテーブルには当日から1週間分のテーブルが表示されるようになっていて、イベントが登録されている場合は当該時間帯にマーカーが表示されます。
そのマーカー箇所をマウスオーバー（スマホだとタップ）するとイベント詳細情報がツールチップとして表示されます。

![](https://storage.googleapis.com/zenn-user-upload/9a2578c8f294-20250911.gif)

下部のスケジュール欄にあるイベント情報をクリックするとイベント詳細情報がモーダル表示されます。

## 管理者（`/ctrl-schedules`ページ）で行えること
一般ユーザーが行えるスケジュール確認をはじめ、登録・編集作業も行えます。

### イベントスケジュールの管理（作成・削除といった編集作業）
- 下部スケジュール欄の各日付にあるアイコンを押下するとイベント登録画面がモーダル表示されます
 
※過去の登録内容は自動的に削除されていきます。ここは[後述しますがコードを数行消すだけで自動削除機能をオフ](#自動削除機能のオフ)にできます。
![](https://storage.googleapis.com/zenn-user-upload/4a15e5f1e417-20250911.png)

その他、`/ctrl-schedules`ページではイベント詳細モーダルに`内容修正`ボタンが表示されており、そちらから編集できるようになっています。

![](https://storage.googleapis.com/zenn-user-upload/eb245596b0f4-20250911.png)

### 自動削除機能のオフ
`src/components/schedule/calendar/hooks/useRemovePastSchedule.ts`ファイル内の39～40行目の以下コードを削除する
```diff
.
..
else {
-    /* 過去分はDBから削除 */
-    deleteReservation(memo.id);
    return false; // 明示的に false を返す
}
..
.
```

## イベント会場やイベント登録可能時間の調整
イベント会場（キャプチャでは「○○組」といった部分）や登録可能時間は`rooms-atom.ts`ファイルで一元管理しているので、そちらを編集することで自由に会場の追加・削除、登録可能時間の増減が可能です。

- `src/types/rooms-atom.ts`
```ts
import { atom } from "jotai";
import { roomsType } from "../components/rooms/ts/roomsType";

export const timeBlockBegin: number = 9; // 予約可能-開始時間
export const timeBlockEnd: number = 19;  // 予約可能-終了時間

//「：」より後の文字がスケジュールテーブルに表示されます
const rooms: roomsType = [
    { room: 'ちゅーりっぷ組：0歳児' },
    { room: 'たんぽぽ組：1歳～2歳児' },
    { room: 'すみれ組：3歳～4歳児' },
    { room: 'こすもす組：5歳児' }
];
export const roomsAtom = atom<roomsType>(rooms);

// 予約内容確認用のツールチップ
export const roomsInfoToolTipAtom = atom<string | undefined>(undefined);
```

## さいごに
ここまで読んでいただき、ありがとうございました。

これがセキュリティや信頼性などに目を瞑ってでも、運用や実装の手軽さを重視したい方のお役に立てると幸いです。

---

以降は、実際に活用したいと思われた方に向けて書いてあるセットアップや調整、補足といった内容です。このイベントスケジュール公開機能に関心を持って下さった方はご覧ください。

## 実際に活用したい方へ
以下の GitHub から自由にお使いください。

https://github.com/Benjuwan/event-calendar-sqlite

### セットアップ（起動）に必要な作業
`node.js`がインストール済みであるのを前提としますので、ローカル環境に`node.js`がない方は[ダウンロード](https://nodejs.org/ja/download)してください。

1. `.env.local`を用意
```bash
# NEXT_PUBLIC を前置した環境変数はクライアントサイドに露出するので注意 
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

2. `Prisma`クライアントを更新してスキーマを反映（`npx prisma generate`を実行）
```bash
npx prisma generate
```

### イベントに登録する項目を変更したい場合
データベース（テーブル）を更新する場合、以下フローを実行する必要があります。

#### `prisma/schema.prisma`
`model`オブジェクトの内容を編集（以下コード内の`model Reservation`部分）

```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

datasource db {
  provider = "sqlite"         // 使用するDBの種類を指定（今回はSQLite）
  url      = "file:./dev.db"  // プロジェクト内の dev.db をデータベースの参照URLとして設定
}

generator client {
  provider = "prisma-client-js" // Prismaクライアントを生成するためのライブラリを指定
}

// データベースのテーブル内容とリンクさせるための設定
model Reservation {
  id          String   @id @default(uuid()) // 主キーの指定（UUID）
  todoID      String                        // 日付 (yyyy/mm/d)
  todoContent String                        // 予約内容
  edit        Boolean  @default(false)
  person      String                        // 予約者名
  rooms       String                        // 会場名
  startTime   String                        // 開始時間 (hh:mm)
  finishTime  String                        // 終了時間 (hh:mm)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### `model`編集後、以下のコマンドをターミナルに打つ
```bash
# マイグレーションファイルを作成し、データベースに変更を適用
npx prisma migrate dev --name what_you_changed # --name 以降は任意の命名

# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```

#### その他の更新・修正が必要なファイル
- `src/app/components/schedule/todoItems/ts/todoItemType.ts`
登録内容の型情報を編集してください

- `src/app/components/schedule/todoItems/TodoForm.tsx`
    - `todoItems`ステートの初期値である`initTodoItems`オブジェクトを編集してください
    - （変更した）当該登録内容に関する入力フォームを必要に応じて（`src/app/components/schedule/todoItems/utils`配下に）用意または調整してください
- `src/app/api/reservations/`配下の`Route Handlers`の登録内容を編集してください
    - `POST`, `PUT`に関する`data`オブジェクト内を編集してください

#### イベント編集ページのパス名を変更
便宜上、イベントスケジュール編集（管理者）ページを`/ctrl-schedules`というパス名にしています。
特に変更しなくとも挙動に影響はありませんが、`src/app`内の当該ディレクトリ名と`src/constants/adminPagePathName.ts`ファイル内の定数（`ADMIN_PAGE_PATH_NAME`）値を適宜変更してください。

- `src/constants/adminPagePathName.ts`
```ts
export const ADMIN_PAGE_PATH_NAME: string = 'ctrl-schedules';
```

---

以上となります！
先にも書きましたが、改変など含めて自由にお使いください。