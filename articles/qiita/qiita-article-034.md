---
title: Next.js: クライアントコンポーネントで fetch と use() の組み合わせは注意！ ハイドレーションエラーが起こる原因と解決策について
tags: Next.js React fetch jotai zustand
author: benjuwan
slide: false
---
これは、筆者の「2025振り返り用ひとりアドカレ」記事の一つです。

## はじめに
本記事は、筆者がNext.js（v16）を使って開発しているサイトをビルド＆デプロイした際に発生したハイドレーションエラーの原因究明録です。

先に結論を書いておくと、 **`use()`をデータフェッチ処理で使用したこと（※）や、SSGとの相性の悪さが原因**でした。
※正確には 「**クライアントコンポーネントのレンダリング関数内で`fetch`を直接実行して、その`Promise`を`use()`で処理するのがアンチパターン**」

::: note info
なお、今回の一件はReact単体（CSR）の場合は該当しません。
（※筆者の別 Reactプロジェクトで`use()`をデータフェッチ処理で使用して問題なく動いているのです。理由としては**SSG/SSRというビルド時HTML固定が存在しない**ためです）

しかし、**`use()`をデータフェッチ処理で使用するのは一般的ではない**のでご注意ください。
:::

かいつまむと、以下のような流れでハイドレーションエラーが発生していました。

1. SSRされた内容（クライアントサイドでのハイドレーション前）
2.  **`use()`によるレンダリング中のPromiseを解決及び即時更新（データが更新されて差分発生）**
3.  クライアントサイドでの useEffect（データ更新）処理が実施される（が、**既に前段階②で差分が生じておりハイドレーションエラーが発生**）

::: note info
- ハイドレーションエラーについて
簡潔に説明すると、「Next.jsやReactによるレンダリングにおいて、サーバサイドである程度生成したページ内容（SSR）と、それを受け取ってクライアントサイドで完成系ページ（CSR）にする過程で、**SSRの内容とCSRの内容とで齟齬が発生している**」ことへの指摘となります。
:::

### 筆者の状況・環境
かなり独特なケースですが、筆者は「SSG × CSR の擬似的CMSのような仕様」で開発していました。
外部のjsonファイルからサイト内に表示するコンテンツデータを取得および表示する仕組みで、jsonファイルを更新すれば自ずとサイトも更新されるというイメージです。

そもそも、NextにはSSR/ISRといった便利な機能があるので、本来上記のような「データフェッチから加工、描画まで」の処理は以下のように`Container / Presentational`パターンのような形でシンプルに実現できます。

1. サーバーコンポーネントでデータフェッチ
2. それを`props`で描画用の子コンポーネントに渡していく

---

しかしプロジェクトの制約上「サーバー実行環境がないホスティング先」だったので擬似的CMSな要件を達成するには「SSG × CSR」という方向性になったのです。

## `use()`を使ったデータフェッチを実施
まず、今回の技術構成は以下になります。

```
- @types/node@24.10.2
- @types/react-dom@19.2.3
- @types/react@19.2.7
- eslint-config-next@16.0.8
- eslint@9.39.1
- html-react-parser@5.2.10
- next@16.0.8
- react-dom@19.2.1
- react@19.2.1
- swiper@12.0.3
- swr@2.3.7
- typescript@5.9.3
- zustand@5.0.9
```

Next 16 と React 19 を使っていているので、React 19から導入された[`use()`](https://ja.react.dev/reference/react/use)を使ってデータフェッチすることにしました。

※くどいですが、`use()`をデータフェッチ処理で使用するのは一般的ではありません。
筆者はドキュメント内の「*...プロミス (Promise) やコンテクストなどのリソースから値を読み取るための React API...*」という部分を独自解釈し、フェッチデータ（Promise）も扱えるようなAPIだと勘違いしていました。

### データフェッチするためのコンポーネント
- `DataFetchMiddleware.tsx`
```tsx
"use client"

import { memo, Suspense } from "react";
import { magazineType } from "@/types/MagazineType";
import { notificationType } from "@/types/notificationType";
import { useMagazineDataStore } from "@/stores/useMagazineDataStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import Skeleton from "@/utils/Skeleton";
import TopMainContents from "./layouts/TopMainContents";

function DataFetchMiddleware() {
    const magazineData = useMagazineDataStore((state) => state.magazinesData);
    const notificationData = useNotificationStore((state) => state.notifications);

    const fetchMagazineDataPathUrl: string = `${process.env.NEXT_PUBLIC_FETCH_URL}/magazine-data.json`;
    const fetchNotificationPathUrl: string = `${process.env.NEXT_PUBLIC_FETCH_URL}/notification.json`;

    // ※ await はしない。Promise を返す記述にする。Promise が未完了ならサスペンド状態となる（Suspense の fallback が返る） 
    const magazineDataFetch: Promise<magazineType[]> | undefined = magazineData.length === 0 ? 
        fetch(fetchMagazineDataPathUrl).then(res => res.json()) : undefined;
    const notificationFetch: Promise<notificationType[]> | undefined = notificationData.length === 0 ? 
        fetch(fetchNotificationPathUrl).then(res => res.json()) : undefined;

    return (
        <Suspense fallback={<Skeleton skeletonHeight={1080} />}>
            <TopMainContents props={{
                magazineDataFetch: magazineDataFetch,
                notificationFetch: notificationFetch
            }} />
        </Suspense>
    );
}

export default memo(DataFetchMiddleware);
```

### データ描画用の子コンポーネントへデータを渡す役割を持つコンポーネント
- `TopMainContents.tsx`
```tsx
"use client"

...
..
.

type dataFetchMiddlewareProps = {
    magazineDataFetch: Promise<magazineType[]> | undefined;
    notificationFetch: Promise<notificationType[]> | undefined;
};

function TopMainContents({ props }: { props: dataFetchMiddlewareProps }) {
    const { magazineDataFetch, notificationFetch } = props;

    const magazinesData = useMagazineDataStore((state) => state.magazinesData);
    const createMagazinesData = useMagazineDataStore((state) => state.createMagazinesData);

    const notificationData = useNotificationStore((state) => state.notifications);
    const createNotificationData = useNotificationStore((state) => state.createNotificationData);

    // use()でPromiseの中身を取得（Promiseが未完了ならこのコンポーネントはサスペンドする）
    const fetchedMagazineData = typeof magazineDataFetch !== 'undefined' ?
        use(magazineDataFetch) : magazinesData;
    const fetchedNotificationData = typeof notificationFetch !== 'undefined' ?
        use(notificationFetch) : notificationData;

    useEffect(() => {
        if (magazinesData.length === 0) {
            createMagazinesData(fetchedMagazineData);
        }

        if (notificationData.length === 0) {
            createNotificationData(fetchedNotificationData);
        }

    }, [magazinesData.length, createMagazinesData, fetchedMagazineData, notificationData.length, createNotificationData, fetchedNotificationData]);

    return (
        <>
            {/* データ描画用の子コンポーネントへデータを渡していく */}
            <TopFirstView magazinesData={magazinesData.length === 0 ? 
                fetchedMagazineData : magazinesData} />
            {fetchedNotificationData.length > 0 &&
                <NotificationElm notificationData={notificationData.length === 0 ? 
                fetchedNotificationData : notificationData} />
            }
        </>
    );
}

export default memo(TopMainContents);
```

### 処理の流れ
`DataFetchMiddleware.tsx`でデータフェッチを実施し、子の`TopMainContents.tsx`で受け取ったPromiseデータを`use()`を使ってレンダリングできるようにしておく、という流れです。

開発時は何の問題もなく意図した挙動になっていました。
エラーなく表示されるし、更新用の各jsonファイルを修正して再読み込みすると無事に更新もされていたのです。

そのため何の懸念もなく開発を進めてビルド＆デプロイし、サイトに行って何のエラーがないことも確認。
挙動確認の一環でjsonファイルを更新してみると内容は無事に更新されているものの、、、
ログを見るとハイドレーションエラーが発生！

原因は冒頭で述べたように「**`use()`がレンダリングフェーズ中に即座にPromiseを解決** -> **SSGとCSRで「同じ初期状態」を保証できなくなり、ハイドレーションエラー発生**」です。

実は筆者は色々と勘違いしておりました。

## 筆者の Next.js（クライアントコンポーネント）に対する勘違い
実は、Next.js において **（`use client`宣言をした）クライアントコンポーネントでも、初回時はプリレンダリング（SSR）される**という仕様を筆者は知りませんでした。
つまり、以下のような事態になっていたのです。

### 開発時
1. サーバーサイドでのデータフェッチ：
親コンポーネントでの`fetch`が`Node.js`環境で実行されてデータを取得
    - ※フェッチデータをログ出力するとターミナルに表示されるのはこのため
2. クライアントサイドでのハイドレーション：
子コンポーネントで`use()`を通じて受け取った`props`からコンテンツを表示

### 本番環境（ビルド後）
**サーバーサイドでのビルド（SSG）とブラウザ閲覧時の描画（CSR）** という2つの世界線が干渉し合う

#### サーバーサイドでのビルド（SSG）
##### 1. ビルド時は`Node.js`環境で、親コンポーネント（サーバーサイド）がデータフェッチしてページ情報を生成
##### 2. 上記結果の静的HTMLを生成

#### ブラウザ閲覧時の描画（CSR）
##### 3. 子コンポーネントに渡った`props`を通じてクライアントサイドでハイドレーション
CSRでのデータ更新処理が走ってSSGとの差分が生じてしまい、ハイドレーションエラーが発生

---

上記3の工程で以下のような事が起きています。

- ①SSRされた内容 -> **②`use()`によるレンダリング中のPromiseを解決及び即時更新** -> ③クライアントサイドでの useEffect（データ更新）処理が実施される（が、**既に前段階②で差分が生じておりハイドレーションエラーが発生**）

しかし、筆者は以下のように勘違いしていたので混乱しました。
- 勘違い（1）： そもそも、クライアントコンポーネント（`use client`宣言したコンポーネント及びその子コンポーネントたち）はSSRなんてされない
    - 先に述べたように **（`use client`宣言をした）クライアントコンポーネントでも、初回時はプリレンダリング（SSR）されます**
- 勘違い（2）： だから、SSRされた内容 -> クライアントサイドで`use()`でデータ取得 -> useEffect（データ更新）処理が実施される
    - `use()`によってレンダリング中のPromiseが解決された時点で即時更新されます（この時点でビルド時の内容と差分発生）

### 筆者が混乱した理由のひとつ
実は、今回と同じような構成・作り方、`use()`によるデータフェッチの方法で、ハイドレーションエラーが発生せずに期待通り動いているプロジェクトがあるのです。

違いは**状態管理ライブラリに`jotai`を使っている**という点です。

今回キャッチアップを兼ねて今まで使ったことがなかった`Zustand`を状態管理ライブラリとして選びました。

`jotai` と `Zustand` の思想や設計の違いを本記事で詳細に掘り下げると論旨が逸れるため割愛しますが、両者の大きな違いとして以下が挙げられます。

- `Zustand`は内部実装で [`useSyncExternalStore`](https://ja.react.dev/reference/react/useSyncExternalStore) を使用している
    - 外部ストアとして`useSyncExternalStore`に完全準拠
- `jotai`は`useState`ライクな設計を採っている
    - `atom`単位での局所的な状態同期

`useSyncExternalStore` は、サーバー描画時（SSR / SSG）に使用されたスナップショットと、クライアント初回描画時（CSR）に取得されるスナップショットが、完全に一致していることを React 側が前提とする仕組みです。

`Zustand`は内部で以下のような状態管理をしています。

```js
useSyncExternalStore(
  subscribe,
  getSnapshot,       // CSR 用
  getServerSnapshot  // SSR / SSG 用
)
```

`useSyncExternalStore`は、サーバーレンダリングとクライアントのハイドレーションの間で、スナップショットの不一致を検出します。
サーバーで使用した`getServerSnapshot`の戻り値と、クライアントで使用する`getSnapshot`の戻り値が一致していない場合、ハイドレーションの不整合となるのでしょう。

つまり、「`jotai`だからうまくいった、`Zustand`がダメだった」という表層的なことを言いたいのではなく「`jotai`は`Zustand`に比べて設計・構造的にハイドレーション不一致が起きづらいだけで、筆者のアプローチ方法（`use()`によるデータフェッチ）自体が一番の問題だった」ということです。

`useSyncExternalStore`をしっかり追いきれていないのですが、`jotai`を使ってうまく行っていることに対して筆者はこのような仮説を持ちました。

## 筆者が採った解決策
`useSWR`を使ったデータフェッチ処理に変更しました。
`useSWR`によって、ローディング段階やエラー段階など明示的に処理できるようになり、SSG と CSR 初回の「前提状態」が完全に一致するようになりました。
これにより、筆者が希望していた通り、 **必ず useEffect 後にデータ更新される**ようになりました。

<details>
<summary>useSWRを使った DataFetchMiddleware.tsx と TopMainContents.tsx</summary>

### データフェッチするためのコンポーネント
- `DataFetchMiddleware.tsx`
```tsx
"use client";

import { memo, useEffect } from "react";
import useSWR from "swr";
import { magazineType } from "@/types/MagazineType";
import { notificationType } from "@/types/notificationType";
import { useMagazineDataStore } from "@/stores/useMagazineDataStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import TopMainContents from "./layouts/TopMainContents";

/* useSWRのフェッチ用関数 */
async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`「${url}」エンドポイントでのデータフェッチ処理は失敗しました | status： ${res.status}`);
    return res.json();
}

/* 各種jsonデータを取得して子コンポーネントに渡すための中間処理を担うコンポーネント */
function DataFetchMiddleware() {
    const createMagazinesData = useMagazineDataStore((state) => state.createMagazinesData);
    const createNotificationData = useNotificationStore((state) => state.createNotificationData);

    const magazineUrl = `${process.env.NEXT_PUBLIC_FETCH_URL}/magazine-data.json`;
    const notificationUrl = `${process.env.NEXT_PUBLIC_FETCH_URL}/notification.json`;

    const {
        data: magazineData,
        error: isErrorMagazineData
    } = useSWR<magazineType[]>(magazineUrl, fetcher);

    const {
        data: notificationData,
        error: isErrorNotificationData
    } = useSWR<notificationType[]>(notificationUrl, fetcher);

    useEffect(() => {
        if (magazineData) {
            createMagazinesData(magazineData);
        }

        if (notificationData) {
            createNotificationData(notificationData);
        }

    }, [magazineData, createMagazinesData, notificationData, createNotificationData]);

    // エラー時：`src/app/error.tsx`の内容を表示
    if (isErrorMagazineData || isErrorNotificationData) {
        throw new Error(`
            ${isErrorMagazineData ?
                `コンテンツデータの状態：${magazineData?.length}` :
                `お知らせデータの状態：${notificationData?.length}`
            }
            が原因で例外が発生しました | from DataFetchMiddleware.tsx
        `);
    }

    return <TopMainContents />;
}

export default memo(DataFetchMiddleware);
```

### データ描画用の子コンポーネントへデータを渡す役割を持つコンポーネント
- `TopMainContents.tsx`
```tsx
"use client"

...
..
.

/* データを受け取って描画用の子コンポーネントへデータを渡す役割を持ったデータセンター的なコンポーネント */
function TopMainContents() {
    const magazinesData = useMagazineDataStore((state) => state.magazinesData);
    const notificationData = useNotificationStore((state) => state.notifications);

    if (magazinesData.length === 0) {
        return <Skeleton skeletonHeight={1080} />;
    }

    return (
        <>
            <TopFirstView magazinesData={magazinesData} />
            {notificationData.length > 0 &&
                <NotificationElm notificationData={notificationData} />
            }
        </>
    );
}

export default memo(TopMainContents);
```

</details>

---

データフェッチ処理は`useSWR`や`Tanstack Query`といったデファクトスタンダードなライブラリが推奨されている理由を実感できました。

## さいごに
今回の一件は、そもそも`use()`を想定外な用途で使用していたことをはじめ、`use()`によって「SSG と CSR　初回で異なるデータがレンダリングされた」ことがハイドレーションエラーの原因です。

そして解決策としては、`useSWR`によって「初回をローディング状態に統一」したことで対応できました。

実際、`use()`のドキュメントで以下のように書かれているので筆者の確認不足も原因の一つです。

![スクリーンショット 2025-12-09 12.39.55.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/0a9847d2-813a-4bbd-9af3-2c505d69b4de.png)

> プロミスが解決 (resolve) された時点で、サスペンスフォールバックは、use() から返されたデータを使用してレンダーされたコンポーネントの内容に置き換わります

とはいえ、こういったトラブルシューティングを通じて実際に手を動かすことで理解が深まります。
それに、ライブラリのありがたみや使う理由を実感できるので、AI全盛ですがキャッチアップや理解促進という点においては自分の手を使うのも良いかと思います。

本記事が、筆者と同じように「SSG × CSR の擬似的CMSのような仕様」を実現したい方の参考になりますと幸いです。
ここまで読んでいただき、ありがとうございました。

## 参照

https://ja.react.dev/reference/react/use

https://zenn.dev/takeshi0518/articles/30bdd78a7901b0#next.js-%E3%81%AE-ssr-%E3%81%A8%E3%81%AF%EF%BC%9F

https://ja.react.dev/reference/react/useSyncExternalStore

https://zenn.dev/gemcook/articles/5fd016c4c8fac0

