---
title: Next.js（v15）× Prisma × SQLite で会議室予約システムを作ってみた
tags: Next.js prisma SQLite ORM React
author: benjuwan
slide: false
---
## はじめに
筆者の所属企業はグループ展開しており、各社の社員が自由に使用できる会議室やフリースペースが本社内に3つほど設けられています。
それら会議室などの予約システムとして`Perl`×`CGI`の仕組みで動くライブラリを使っているのですが、UI含めて古くなってきており社内でメンテナンスできる人材もいない状態で長年使用されてきました。

そこで今回、予約システムをモダナイゼーションしようと昨年12月ごろから本格的に開発を進めてきました。パートナーにしたのは主に`claude`です。

開発したものは以下の2パターンで、本記事では「1：開発・テスト用」を紹介したいと思います。
1. 開発・テスト用：`Next.js`（v15）×`prisma`×`SQLite`
2. 本番用：`Next.js`（v15）×`prisma`×`PostgreSQL`

というのも、当初`SQLite`で完結しようと思っていたのですが`Next.js`のAPI操作（今回`Route Handlers`を使用）を行うのにサーバーサイドの実行環境が必要で、いつも使っているホスティング先では対応していなかったので「2：本番用」も作成した次第です。

内容としては従来使っていた予約システムに沿った以下機能となります。
- 各部屋ごとに予約・編集できる
  - 編集作業は予約時に一緒に登録したパスワードで制御
- 各部屋の予約時間を視覚的に確認できるタイムテーブル
- 予約時間に関する検証機能（他者との予約重複や指定時間帯外への登録）

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

## 作成した予約システムのキャプチャ
- 登録
  1. 初期表示画面（会議室予約画面）
  ![001.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/308444b4-8418-01fa-dcd6-6a0f896af8b9.png)<br><br>

  2. 各日付のアイコンをクリックして表示される登録フォーム
  ![002.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/59db4f6a-41fb-f833-5239-01df599f8374.png)
  ※入力したパスワードを用いて自身の登録内容を編集できるようになります。<br><br>

  3. 予約概要がスケジュールテーブルに、予約時間が該当予約室のタイムテーブルに表示される
  ![003.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/48732c94-3ef4-51b8-feef-0e311bc8fe21.png)
  ※ 当日（キャプチャだと2025/1/9）の予約内容のみが各種テーブルに反映されます<br><br>

- 編集
  1. 登録したパスワード入力後に編集フォームが表示される
  ![004.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/0ce4ebce-7bcf-76ca-ff7e-e355943d5018.png)
    ![005.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/3733ea3e-c24f-062b-7232-eb4da202a914.png)<br><br>

  2. 変更した予約概要がスケジュールテーブルに、予約時間が該当予約室のタイムテーブルに表示される
  ![006.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e04760a9-6625-8fd8-65cb-f317e0e5c81c.png)

## 開発面で意識したこと
UIなどは適宜変更しつつも、従来の予約システムと同じ機能の実装は絶対としました。

先ほども掲載しましたが、従来の予約システムの機能は以下となります。
- 各部屋ごとに予約・編集できる
  - 編集作業は予約時に一緒に登録したパスワードで制御
- 各部屋の予約時間を視覚的に確認できるタイムテーブル
- 予約時間に関する検証機能（他者との予約重複や指定時間帯外への登録）

従来の予約システムでは、編集作業や各部屋の予約内容を確認するには各部屋ページに遷移しないと操作・確認できませんでした。
そこで今回は、一画面（会議室予約画面）で登録・確認・編集が行えるUIに変更しました。

## 部屋と予約時間の管理
各部屋と時間帯は以下のように一ファイルで一元管理しています。
```ts
import { atom } from "jotai";
import { roomsType } from "../components/rooms/ts/roomsType";

export const timeBlockBegin: number = 9; // 予約可能-開始時間
export const timeBlockEnd: number = 21;  // 予約可能-終了時間

//「：」より後の文字がスケジュールテーブルに表示されます
const rooms: roomsType = [
    { room: '会議室：2F' },
    { room: '多目的ホール：3F' },
    { room: '応接室：4F' }
];
export const roomsAtom = atom<roomsType>(rooms);
```

各部屋はデータベースでテーブル管理しているわけではないので、部屋数や時間帯などは上記ファイルで柔軟かつ容易に変更できるようになっています。

ちなみに、テーブルの中身は以下です。
```
model Reservation {
  id          String   @id @default(uuid()) // 主キーの指定（UUID）
  todoID      String                        // 日付 (yyyy/mm/d)
  todoContent String                        // 予約内容
  edit        Boolean  @default(false)
  pw          String                        // 編集可否パスワード
  person      String                        // 予約者名
  rooms       String                        // 予約会議室名
  startTime   String                        // 開始時間 (hh:mm)
  finishTime  String                        // 終了時間 (hh:mm)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

上記内容のオブジェクトを予約リストとして`jotai`で状態管理しています。
また、今回の開発で「非同期の初期値を扱える`atomWithDefault`」を初めて知りました。

### `atomWithDefault`について
`atomWithDefault`：非同期の初期値を扱える`jotai`のユーティリティ。引数として渡した非同期関数（例：`fetch`関数など）が実行され、その結果が`atom`の初期値として設定される。

```ts
export const fetchTodoMemoAtom = atomWithDefault(async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // GET処理： api/reservations/route.ts の GET によりDBからのデータを取得 
    const response: Response = await fetch(`${API_URL}api/reservations`, { cache: 'no-store' });
    const resObj: todoItemType[] = await response.json();
    return resObj;
});
```

```tsx
const [fetchTodoMemo] = useAtom(fetchTodoMemoAtom);
...
..
    useEffect(() => {
        if (fetchTodoMemo.length > 0) {
            const exceptPastTodoMemos: todoItemType[] = [...fetchTodoMemo].filter(memo => {
                const memoDate: number = parseInt(memo.todoID.replaceAll('/', ''));
                if (memoDate >= present) {
                    return memo;
                } else {
                    /* 過去分はDBから削除 */
                    deleteReservation(memo.id);
                }
            });
            /* 当日以降の予定のみスケジュールとして管理・把握 */
            setTodoMemo(exceptPastTodoMemos);
        }
    }, []);
```

`atomWithDefault`は、コンポーネント内で `useAtom(atomWithDefaultで設定したatom)` を使用すると、自動的に以下の処理を行うようです。
1. フェッチ処理が実行される
2. データが取得できるまでの間は`undefined`または`Promise`の状態になる
3. データ取得完了後、取得したデータで状態が更新される

## `Prisma`×`SQLite`の設定
こちらの[`GitHub`リポジトリ](https://github.com/Benjuwan/reserve-sys-sqlite)を`git clone`または`zip`ダウンロードして`npm install`していただければ直ぐに使えるようになっていますが、自身の備忘録や情報共有の観点から`Prisma`×`SQLite`の設定を一から行う場合のフローを残します。

※本記事の予約システムを試したい方は上記方法で自由に触ってみてください。

これから予約システムに関するAPI操作やUIについても書いていくので、`Prisma`×`SQLite`の設定に関して特に興味のない方は[データのCRUD（API操作）について](#データのcrudapi操作について)や[各種フォーム項目の更新](#各種フォーム項目の更新)、[UIについて](#uiについて)、[データベースの仕様テーブル更新](#データベースの仕様テーブル更新)などに飛んでください。

---

- `Prisma`と`SQLite`について簡潔なおさらい
  - `Prisma`
  `Prisma`は、データベースとのやり取りを簡単にする`ORM`というツールです。`ORM`とはデータベースのテーブルをオブジェクトとして操作できる技術で、`SQL`を書かなくても`JavaScript`（`TypeScript`）のコードだけでデータベース操作ができるようになる代物です。

  - `SQLite`
  `SQLite`は、軽量で組み込み型のリレーショナルデータベースです。単一のファイルでデータベースを管理できるため、ファイルをコピーするだけで簡単にデータベースを移行できます。つまり、プロジェクト内でデータベースを持てるので外部にサーバーを立てる必要がありません。本番用ではなく、一般的にはモックやプロトタイプ、小規模なプロジェクトで使用されます。

### `Prisma`の設定
以下のフローで`Prisma`をインストール＆設定していきます。

この記事内の「4. データの永続化をする」が参考になりました。

https://qiita.com/Sicut_study/items/13c9f51c1f9683225e2e#4-%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E6%B0%B8%E7%B6%9A%E5%8C%96%E3%82%92%E3%81%99%E3%82%8B

1. `Prisma`のインストール
    ```bash
    # Prisma のプロジェクトを初めてセットアップするケース
    # CLI ツールとクライアントの両方をインストール
    npm install prisma @prisma/client

    # Prisma クライアントをインストールまたは更新するだけのケース
    # たとえば、本番環境やすでに Prisma CLI をセットアップ済みの場合
    npm install @prisma/client
    ```
    <br>

2. `Prisma`の初期化
    ```bash
    npx prisma init
    ```
    <br>

3. マイグレーションの実行
    ```bash
    npx prisma migrate dev --name init
    ```
    ※マイグレート（設定した内容を実際のデータベースに反映させる作業）
    <br>

4. クライアントの生成
    ```bash
    npx prisma generate
    ```

- `.env`と`.env.local`の設定
    - `.env`
        ```bash
        DATABASE_URL="file:./dev.db"
        ```
        <br>
    
    - `.env.local`
        ```bash
        # 今回 Next.js なので NEXT_PUBLIC を使用
        NEXT_PUBLIC_API_URL="http://localhost:3000/"
        ```

::: note warn
蛇足ですが**環境変数に`NEXT_PUBLIC`を前置したものはクライアントサイドに露出する**のでセンシティブな情報（例：APIキーなど）には付けないよう気をつけたいところです。
:::

ここまででインストール＆設定は済んだので、次は`Prisma`利用時におけるデータベースの種別やテーブル設定に進みます。

### データベースの種別やテーブル設定
#### スキーマ設定
- `prisma/schema.prisma`
```bash
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
  pw          String                        // 編集可否パスワード
  person      String                        // 予約者名
  rooms       String                        // 予約会議室名
  startTime   String                        // 開始時間 (hh:mm)
  finishTime  String                        // 終了時間 (hh:mm)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### `prisma`クライアントの設定
- `src/lib/prisma.ts`
```ts
/* クライアントで prisma を通じてデータベースを操作・利用するための機能をインポート */
import { PrismaClient } from '@prisma/client';

/* グローバルスコープに PrismaClient のインスタンスを保持するための型定義 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

/* PrismaClient のインスタンスが存在しない場合は新規作成 */
export const prisma = globalForPrisma.prisma || new PrismaClient();

/* 開発環境の場合のみ、グローバルオブジェクトに PrismaClient インスタンスを保持 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

ここまで進めると`Prisma`×`SQLite`の設定は完了になります！

### `prisma studio`
`Prisma`には、`prisma studio`という`GUI`でテーブル操作できる機能があります。
```bash
npx prisma studio
```
`GUI`でパパっと手っ取り早くテーブル操作したい場合に便利です。

--- 

## データのCRUD（API操作）について
今回`Route Handlers`でCRUDを実現しています。
- `src/app/api/reservations/route.ts`
データの取得と投稿の処理
```ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { todoItemType } from '@/app/components/schedule/todoItems/ts/todoItemType';

// GET（取得）
export async function GET() {
  const reservations = await prisma.reservation.findMany();
  return NextResponse.json(reservations);
}

// POST（投稿）
export async function POST(request: Request) {
  const data: todoItemType = await request.json();

  const reservation = await prisma.reservation.create({
    /**
     * POST 操作において id は記述不要
     * prisma\schema.prisma で主キーとして id（uuid）を指定しているので data 内に記述すると重複処理でエラーとなる 
    */ 
    data: {
      todoID: data.todoID,
      todoContent: data.todoContent,
      edit: data.edit,
      pw: data.pw,
      person: typeof data.person !== 'undefined' ? data.person : '',
      rooms: typeof data.rooms !== 'undefined' ? data.rooms : '',
      startTime: typeof data.startTime !== 'undefined' ? data.startTime : '',
      finishTime: typeof data.finishTime !== 'undefined' ? data.finishTime : '',
    },
  });

  return NextResponse.json(reservation);
}
```

- `src/app/api/reservations/[id]/route.ts`
データの更新と削除の処理
```ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { todoItemType } from "@/app/components/schedule/todoItems/ts/todoItemType";

// PUT（更新）
export async function PUT(request: Request) {
    const data: todoItemType = await request.json();

    const id: string = request.url.split('/reservations/')[1];
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const reservation = await prisma.reservation.update({
        where: {
            id: id,
        },
        data: {
            todoID: data.todoID,
            todoContent: data.todoContent,
            edit: data.edit,
            pw: data.pw,
            person: typeof data.person !== 'undefined' ? data.person : '',
            rooms: typeof data.rooms !== 'undefined' ? data.rooms : '',
            startTime: typeof data.startTime !== 'undefined' ? data.startTime : '',
            finishTime: typeof data.finishTime !== 'undefined' ? data.finishTime : '',
        },
    });

    return NextResponse.json(reservation);
}

// DELETE（削除）
export async function DELETE(request: Request) {
    const id: string = request.url.split('/reservations/')[1];
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.reservation.delete({
        where: {
            id: id,
        },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
}
```

`prisma.reservation.findMany`や`prisma.reservation.create`, `prisma.reservation.update`, `prisma.reservation.delete` といった簡潔な記述でCRUDが行える（データベースのデータを扱える）ことに「`prisma`ってすごー！ほんとに`SQL`書かずに済んでるやん」という驚きと感動を覚えました。

ちなみに、投稿や更新、削除は以下のようにカスタムフックに切り分けて実装しています

<details><summary>投稿や更新、削除に関する記述</summary>

- 投稿
```ts
import { v4 as uuidv4 } from 'uuid'; // key へ渡すための固有の識別子を生成する npm ライブラリ
import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from '@/app/types/calendar-atom';

export const useRegiTodoItem = () => {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    /* データベース（SQLite）に予約を登録 */
    const createReservation: (data: todoItemType) => Promise<todoItemType> = async (data: todoItemType) => {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    /* ToDo（予約）の登録 */
    const regiTodoItem: (todoItems: todoItemType) => void = (todoItems: todoItemType) => {
        const shallowCopyTodoItems: todoItemType = { ...todoItems }

        const newTodoList: todoItemType = {
            ...shallowCopyTodoItems,
            id: uuidv4() // key へ渡すための固有の識別子（uuid：Universally Unique Identifier）を生成
        }

        if (shallowCopyTodoItems.todoContent.length > 0) {
            createReservation(newTodoList);
            setTodoMemo([...todoMemo, newTodoList]);
            location.reload(); // 登録直後に当該内容を更新すると 500エラーになるため再読み込みさせて登録完了させておく 
        }
    }

    return { regiTodoItem }
}
```

- 更新
```ts
import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/app/types/calendar-atom";

export const useUpdateTodoItem = () => {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    /* データベース（SQLite）の当該予約を更新 */
    const updateReservation: (data: todoItemType) => Promise<todoItemType> = async (data: todoItemType) => {
        const response = await fetch(`/api/reservations/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    /* ToDo（予約）の更新 */
    const updateTodoItem: (todoItems: todoItemType) => void = (todoItems: todoItemType) => {
        const updateTodoList: todoItemType = { ...todoItems };

        const exceptRemoveTodoItems: todoItemType[] = [...todoMemo].filter(todoItem => todoItem.id !== updateTodoList.id); // 今回更新（削除）対象の todoItem 以外を返す

        if (updateTodoList.todoContent.length > 0) {
            updateReservation(updateTodoList);
            setTodoMemo([...exceptRemoveTodoItems, updateTodoList]);
        }
    }

    return { updateTodoItem, updateReservation }
}
```

- 削除
```ts
import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/app/types/calendar-atom";

export const useDeleteTodoItem = () => {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    /* データベース（SQLite）から当該予約を削除 */
    const deleteReservation: (id: string) => Promise<void> = async (id: string) => {
        await fetch(`/api/reservations/${id}`, {
            // delete なので DELETE、データの扱いに関する記述（headers, body, etc...）は不要
            method: "DELETE"
        });
    }

    const deleteTodoItem: (id: string) => void = (id: string) => {
        deleteReservation(id);
        const exceptRemoveTodoItems: todoItemType[] = [...todoMemo].filter(todoItem => todoItem.id !== id);
        setTodoMemo(exceptRemoveTodoItems);
    }

    return { deleteTodoItem, deleteReservation }
}
```

</details>

## 各種フォーム項目の更新
部屋や時間帯、予約内容などフォームを通じて登録する各項目に関しては、以下の汎用的なカスタムフックを用意して処理しています。

```ts
import { ChangeEvent } from "react";
import { useHandleInputValueSanitize } from "./useHandleInputValueSanitize";

type handleFormEntriesType = <T>(
    targetElm: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    targetFormEntries: T,
    setEntries: React.Dispatch<React.SetStateAction<T>>
) => void

export const useHandleFormEntries = () => {
    // サニタイズしたいラベルを用意（input の id属性名）
    const isCheckIdAttr_forSanitize = ['todoContent', 'pw'];
    const { handleInputValueSanitize } = useHandleInputValueSanitize();

    /* <T>：ジェネリクスで任意の型を指定 */
    const handleFormEntries: handleFormEntriesType = function <T>(
        targetElm: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        targetFormEntries: T,
        setEntries: React.Dispatch<React.SetStateAction<T>>
    ): void {
        // id属性からプロパティ名を取得 
        const type: string = targetElm.currentTarget.id;
        let value: string | number | boolean = targetElm.currentTarget.value;

        // サニタイズが必要なラベルには実施
        if (isCheckIdAttr_forSanitize.includes(type)) {
            value = handleInputValueSanitize(targetElm.currentTarget.value);
        }

        const newEntries: T = {
            ...targetFormEntries,
            [type]: value // id属性と一致するkeyの値にvalueをセット
        }
        setEntries(newEntries);
    }

    return { handleFormEntries }
}
```

- コンポーネントでの使用例
```tsx
<label>
    <span>予定内容</span>
    <input 
        type="text" 
        value={todoItems.todoContent} 
        id="todoContent" 
        onInput={
            (e: ChangeEvent<HTMLInputElement>) => 
            handleFormEntries<todoItemType>(e, todoItems, setTodoItems)
        } 
        />
</label>
```


## UIについて
- 当日以前（過去）の日付には予約用アイコンを表示しない（予約可能箇所の明示化）
- スケジュール表の当日日付には背景色を付けて差別化
- スマホなど表示幅が狭い端末ではタイムテーブルを横スクロール表示
- タイムテーブルの各時間帯には15分刻みでラインを入れて判別性を向上
- 当日以前（過去）の予約内容の自動削除機能

上記で列挙したようにこだわった点はたくさんあるものの、実装含めて苦労したのは「各部屋の予約時間を視覚的に確認できるタイムテーブル」部分でした。

![スクリーンショット 2025-01-15 8.13.58.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/c371b54f-b76a-7254-695d-32fcb021d02b.png)


```tsx
// TimeTable.tsx

import { timeBlockBegin, timeBlockEnd } from "@/app/types/rooms-atom";

function TimeTable({ room, todoMemo }: { room: string, todoMemo: todoItemType[] }) {
    const timeBlocks: number[] = [];
    // timeBlockBegin：開始時間（9時）〜 timeBlockEnd：終了時間（21時）までの時間帯の配列を用意
    for (let i = timeBlockBegin; i < timeBlockEnd; i++) timeBlocks.push(i);

    return (
        <ul>
            {timeBlocks.map(timeBlock => (
                <li key={timeBlock}>
                    <span>{timeBlock}</span>
                    <div className={roomStyle.minBlocks}>
                        {/* 各時間の分を表示するコンポーネント */}
                        <TimeBlock props={{
                            room: room,
                            timeBlock: timeBlock,
                            todoMemo: todoMemo
                        }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default memo(TimeTable);
```

```tsx
// TimeBlock.tsx

function TimeBlock({ props }: { props: TimeBlockType }) {
    const { room, timeBlock, todoMemo } = props;

    const minBlocks: number[] = [];
    for (let i = 1; i <= 59; i++) minBlocks.push(i);

    const today: string = useMemo(() => `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`, []);

    // 動的な予約情報（当日限定及び各部屋ごとのタイムテーブル配列）の取得 
    const relevantReservations: todoItemType[] = useMemo(() => {
        return [...todoMemo].filter(memo =>
            (memo.todoID === today) &&
            (typeof memo.rooms !== 'undefined' && memo.rooms === room)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoMemo, room]);

    // some 処理によって一つでも true なら true が返却される
    const reservedFlag: (timeBlock: number, minBlock: number) => boolean = (timeBlock: number, minBlock: number) => {
        return relevantReservations.some(reservation => {
            const theTime = parseInt(`${timeBlock}${minBlock.toString().padStart(2, '0')}`);
            const start = parseInt(reservation.startTime?.split(':').join('') ?? '0');
            const finish = parseInt(reservation.finishTime?.split(':').join('') ?? '0');
            return theTime >= start && theTime <= finish;
        });
    };

    return (
        <>
            {minBlocks.map(minBlock => (
                <div
                    key={minBlock}
                    data-minblock={minBlock}
                    data-reserved={reservedFlag(timeBlock, minBlock)}
                >&nbsp;</div>
            ))}
        </>
    );
}

export default memo(TimeBlock);
```

やっていることはすごく地味で、（時間と）分の配列を用意し、各自を予約開始と終了時間とで比較して予約時間内の場合は`data-reserved`を`true`にする仕組みです。`data-reserved`が`true`の場合のスタイルを別途用意することで視覚的なUIを実現しています。

1.（時間と）分の配列を用意
```tsx
const minBlocks: number[] = [];
for (let i = 1; i <= 59; i++) minBlocks.push(i);
```

2.各自を予約開始と終了時間とで比較
```tsx
// some 処理によって一つでも true なら true が返却される
const reservedFlag: (timeBlock: number, minBlock: number) => boolean = (timeBlock: number, minBlock: number) => {
    return relevantReservations.some(reservation => {
        const theTime = parseInt(`${timeBlock}${minBlock.toString().padStart(2, '0')}`);
        const start = parseInt(reservation.startTime?.split(':').join('') ?? '0');
        const finish = parseInt(reservation.finishTime?.split(':').join('') ?? '0');
        return theTime >= start && theTime <= finish;
    });
};
...
..
.

// 予約時間内の場合は`data-reserved`を`true`
{minBlocks.map(minBlock => (
    <div
        key={minBlock}
        data-minblock={minBlock}
        data-reserved={reservedFlag(timeBlock, minBlock)}
    >&nbsp;</div>
))}
```

3.`data-reserved`が`true`の場合のスタイルを別途用意
```css
.minBlocks {
    & div {
        width: 1px;

        &[data-reserved=true] {
            background-color: #b6f7ba;
        }
    }
}
```

これらロジック面は自分でまかなえたものの、「当日の予約内容のみ表示」する以下実装において`claude`に助けてもらいました。

```tsx
const today: string = useMemo(() => `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`, []);

// 動的な予約情報（当日限定及び各部屋ごとのタイムテーブル配列）の取得 
const relevantReservations: todoItemType[] = useMemo(() => {
    return [...todoMemo].filter(memo =>
        (memo.todoID === today) &&
        (typeof memo.rooms !== 'undefined' && memo.rooms === room)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [todoMemo, room]);
```

シンプルに予約リスト（`todoMemo`）を軸にして処理を進めれば良いのに、別途タイムテーブル用の変数を設けて処理させる冗長かつ複雑な実装を行っていたせいで意図したUIを実現できずにいました。
~~（自身のスキル不足は一旦置いておいて）~~ こういった点でも生成AIを活用した便利な開発体験を実感しました。

最後に、データベースの仕様（テーブル）更新の方法を紹介したいと思います。

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

::: note
- `prisma/dev.db-journal`
`dev.db-journal`という`SQLite`の内部処理用ファイルが自動的に生成・削除されますが無視して構いません。
`dev.db-journal`は`SQLite`が自動的に管理する`SQLite`のトランザクションログファイルで、データベース操作の一時的な記録を保持しています。
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

::: note
- 上記フローを経ても予約登録機能が動かない場合
上記フローを経て、`git pull origin main`で当該リモートリポジトリと整合性を取ったのに**予約登録機能が動かない**場合は以下のコマンドを`ターミナル`で打つ。
※ WindowsPC でコマンドを実行した際に権限上のエラーが発生した場合は`コマンドプロンプト`で再度試してみる。
```bash
# Prismaクライアントを更新して新しいスキーマを反映
npx prisma generate
```
::: 

## さいごに
今回の開発では`Next.js`（v15）を実際に使ってみたことに加えて、以前から気になっていた`ORM`（`prisma`）や`SQLite`も触れたので一石三鳥のようなものでした。

しかし冒頭でも書いた通り本来は`Next.js`（v15）×`prisma`×`SQLite`で完結するつもりだったのが、ホスティング先のサーバーサイドの実行環境の有無から`Next.js`（v15）×`prisma`×`PostgreSQL`での開発に切り替えました。

本番用のホスティング先は`Vercel`にしたのですが、データベース（`PostgreSQL`）の用意や設定、デプロイにおける設定、別PCでの開発環境設定など本記事の内容と諸々勝手が異なる部分も多々ありました。
そちらに関しては別の記事で紹介しています。

https://zenn.dev/benjuwan/articles/0179dbad007742

筆者としてはキャッチアップになったので良かったですが、やはり`SQLite`は開発やテスト、プロトタイプとしての用途が強いように感じます。
本格的な運用を前提とする場合は初めから`Supabase`など`BaaS`を利用したり、`MySQL`や`PostgreSQL`などデータベースを用意したりするのが無難だと感じました。

本記事に関して、なにか間違いや気になる点があればご教授いただけますとありがたく存じます！

ちなみに、記事の途中でも述べたように今回作った予約システムに関する`GitHub`は自由に使っていただいて結構ですので関心のある方はどうぞです。

https://github.com/Benjuwan/reserve-sys-sqlite

