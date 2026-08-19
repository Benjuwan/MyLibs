---
title: "【React】Context API をはじめ、状態管理ライブラリ Jotai, Zustand も使った上で比較してみる"
emoji: "🔍"
type: "tech"
topics:
  - "react"
  - "typescript"
  - "jotai"
  - "zustand"
published: true
published_at: "2025-12-19 13:42"
---

## はじめに
筆者は普段 React や Next.js においてグローバルステートを扱う際は`Context API`か`Jotai`を使っていました。

理由としては、`Context API`は**React標準**で、`Jotai`は**useStateライクな書き方・使い方で学習コストが低い**からです。

他方、`Zustand`は store という概念があって（`Jotai`にもありますが使用は必須ではない）、それをベースにした処理になります。そういった点で少し学習コストを感じて距離を置いていたのですが最近軽めの新規プロジェクトがあったので良い機会だと思って`Zustand`を使ってみました。

結果としては **`Zustand`の store ベースの処理が責務分離やシンプルさの観点から中〜大規模にも対応しやすそうで、さらにDXも良さそう**という印象です。

しかしもちろん`Jotai`が使いづらいとかいうことは決してなく、**小〜中規模で、スピード感が求められつつも保守性やDXも意識したい**というようなケースに向いている印象を受けました。

すでに本記事の結論を述べた感はあるのですが、`Context API`も交えながら、状態管理ライブラリ `Jotai`, `Zustand`をどっちも使った上で比較して行きたいと思います。

## React標準`Context API`
筆者がグローバルステートを作る際に一番初めにお世話になったReact標準のAPIです（今でもお世話になっています）。

::: message
[React 19になって`Provider`の記述が不要](https://ja.react.dev/blog/2024/12/05/react-19#context-as-a-provider)になりました。

```diff
const ThemeContext = createContext('');

function App({children}) {
  return (
-    <ThemeContext.Provider value="dark">  
+    <ThemeContext value="dark">
      {children}
+    </ThemeContext>
-    </ThemeContext.Provider>
  );  
}
```
:::

### `Context API`の基本的な使い方
- `EditContext.ts`：コンテクストの作成
```ts
import { createContext } from "react";

type checkEditModeType = {
    isEdit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditContext = createContext({} as checkEditModeType);
```

- `EditContextFragment.ts`：コンテクストプロバイダの作成
```ts
import { ReactNode, useState } from "react";
import { EditContext } from "./EditContext";

type defaultContext = {
    children: ReactNode
};

export const EditContextFragment = (props: defaultContext) => {
    const [isEdit, setEdit] = useState<boolean>(false);

    return (
        // React 19以降 Provider は不要
        <EditContext value={{isEdit, setEdit}}>
            {props.children}
        </EditContext>
    );
}
```

- `main.tsx`
プロジェクト全体にグローバルステートとして適用するために当該コンテクストプロバイダで`App`コンポーネントをラップする。
※コンテクストプロバイダが増える（例：`AnotherContextFragment`）たびにラップも増えていきます。

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { EditContextFragment } from './providers/EditContextFragment.tsx'
import { AnotherContextFragment } from './providers/AnotherContextFragment.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EditContextFragment>
        <AnotherContextFragment>
            <App />
        </AnotherContextFragment>
    </EditContextFragment>
  </StrictMode>,
)
```

#### 設定した Context の使用方法
- コンポーネント
```ts
import { memo, useContext, useEffect } from "react";
import { AnotherContext } from "../providers/AnotherContext";
import { EditContext } from "../providers/EditContext";

export const NormalBtn = memo(() => {
    const { AnotherGlobalState } = useContext(AnotherContext);
    const { isEdit, setEdit } = useContext(EditContext);

    useEffect(() => {
        if (!isEdit) {
            setEdit(true);
        }
    }, [isEdit, setEdit]);

    return (
        <>
            {AnotherGlobalState ?
            <>
                ...
                ..
            </>
            : ...
});
```

- カスタムフック
```ts
import { useContext } from "react";
import { EditContext } from "../providers/EditContext";

export const useChangeEditMode = () => {
    const { isEdit, setEdit } = useContext(EditContext);
    ...
    ..
    .
    if (!isEdit) {
        setEdit(true);
    }
    ..
    .
```

#### `Context API`を使用する上での注意点
先のようにして使うのですが、`Context API`には**コンポーネントまたはフックが参照しているコンテクスト（state）が変更・更新されると参照元（自身）も更新される**という重要な注意点があります。

そもそも、React においてコンポーネントが更新されるのは以下の条件です。

::: message
- **Reactにおいてコンポーネントが再レンダリングされるとき**
    1. 親コンポーネントが再レンダリングされたとき（その配下の子コンポーネントも全て再レンダリングされる）
    2. 参照している props が変更・更新されたとき
    3. 参照している state が変更・更新されたとき

※条件1（親コンポーネント起因の再レンダリング）は`memo`化などで再レンダリングを防げますが本筋から逸れるので詳細は割愛します。
:::

`Context API`は条件3（参照している state が変更・更新）に該当するので、コンテクスト（state）が変更・更新されると参照元（自身）も更新されてしまいます。

また、先の記述を確認してもらったように**グローバルステートを用意したいだけなのにシンプルだが冗長なつくり**になってしまいます。

一方、`Jotai`や`Zustand`はもっとシンプルに用意できます。

## Jotai

https://jotai.org/

Jotaiは **"atom（原子）" を最小単位とした状態管理ライブラリ** です。
Reactの`useState`を拡張していて、**グローバルに共有できる**、**必要なものだけ購読できる**といった特徴を持っています。

::: message
「**購読**」って何？と思われた方は「その状態（の変化）を監視し続ける」というようなイメージを持っておいてください。
:::

### `atom`
最小限の（更新・購読可能な）単位の状態です。
`number`, `string`, `boolean`など各種「型」のデータ・値を State として扱います。

```js
const priceAtom = atom(10);
const messageAtom = atom('hello');
const productAtom = atom({ id: 12, name: 'good stuff' });
```

配列の場合、`Jotai` の `atom` は**初期値が空配列 [] の場合に限って**デフォルトでは初期値の型を `never`（値を持たない型）として扱います。
これに対処するためには、 **`atom`を作成する際に初期値の型を指定** します。

```ts
// 型定義した初期値
const initAnimalsData: animalsDataType = {
    name: 'dog',
    weight: '12.2',
    height: '30.6'
};

// 当該 atom が指定された要素に準拠した型定義となる（never -> animalsDataType[]）
export const AnimalsAtom = atom([initAnimalsData]);
```

### `useAtom`
`atom`を読み込んで状態管理を行うフックで、`useState`とほぼ同じインターフェースです。

```ts
// const [value, setValue] = useState<type>(initValue);
const [value, setValue] = useAtom(atom);
```

`useState`とほぼ同じ見た目ですが`useAtom`は`useContext`に似た働きも持っていて、 **外部ファイルで管理した`atom`（state）をコンポーネント間で共有**できます。

### `atom`の宣言場所
`atom`と`useAtom`について説明してきましたが、それぞれ使用時において以下の違いがあるので注意してください。

- atomの宣言: コンポーネントの**外部**で行う
- useAtomの使用: コンポーネントの**内部**で使用する

```ts
/* コンポーネント外で atom を宣言 */
const countAtom = atom(0);

export const TheComponent = () => {
  /* コンポーネント内で useAtom を使用 */
  const [count, setCount] = useAtom(countAtom);
}
```

上記のように`atom`を作成して使用することもできますが**一般的には外部ファイルで定義して使用**します。

#### `atom`はコンポーネント・ロジック間での共有を考慮して外部ファイル（例: `ts/atom.ts`）で定義する

```js
import { hogeItemAtom, hogeListAtom } from "./ts/atom";

// 外部ファイル（ts/atom.ts）で宣言した atom を呼び出して使用
const [hogeItem, setHogeItem] = useAtom(hogeItemAtom);
const [hogeList] = useAtom(hogeListAtom);
```

### store
これまでに説明してきた`atom`, `useAtom`だけでも十分なのですが`Zustand`同様、store が`Jotai`にも用意されています。

store は共有データの保管場所を定義する機能で、`createStore`で新しいストアを作成できます。

store は以下3つのメソッドを持っています。

- `get` : `atom`の値を取得する
- `set` : `atom`の値を設定する
- `sub` : `atom`の変更を購読する

```ts
const myStore = createStore() // 空のstoreを作成
const countAtom = atom(0)
myStore.set(countAtom, 1) // countAtomに初期値1を設定

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={myStore}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

### Provider
Provider を使用することで、囲われたコンポーネントのみに閉じられた`atom`を提供できます。コンポーネントツリーごとに異なる`atom`を保持する必要がある場合に有効です。

::: message
※Providerについて、筆者としては「シンプルに`useState`使って、`props drilling`で良くない？」とか、開発が進む中で「`props drilling`が2コンポーネント以上など規模が大きくなってきたらコンポーネントを分離したり、それこそ`atom`でグローバルステートにしたら良いのでは？」と思っていて、あまり使用したことはありません。
:::

### Jotaiの設計上の特徴まとめ
- atomは **小さく・独立して定義**
- state とロジックは **コンポーネント側に寄りやすい**
- **考えずに増やせる**が、設計ルールは必要

## Zustand

https://zustand-demo.pmnd.rs/

`Zustand`は、これまでの`Context API`（`useContext`）や`Jotai`の`atom`（`useAtom`）たちのように`useState`ライクなアプローチではありません。

store という**対象データ（state）と、その更新処理ロジックを一元管理したオブジェクト**をベースにしたアプローチです。

※`Redux`を使っている（使ったことがある）方なら**アクションを通じてstateを更新するフロー**という点で馴染みやすいかもしれません。

また特徴的な部分として、stateの更新に React 18 の[`useSyncExternalStore`](https://ja.react.dev/reference/react/useSyncExternalStore)を利用しています。

※`useSyncExternalStore`については、以下の記事が（コメント欄を含めて）とても分かりやすいです。

https://zenn.dev/gemcook/articles/5fd016c4c8fac0

### state と アクション を一元管理する store を用意
`Zustand`では state と アクション（※）を一元管理する store オブジェクトが肝になります。

::: message
※アクション：**セッター関数** + **単純な更新処理**をはじめ、**条件分岐などを含んだりする各種ロジック・振る舞い**を指す。
:::

```js
// 例1
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({
    count: state.count < 10 ? state.count + 1 : state.count
    // ↑ 上限チェックを追加
  })),
}));

// 例2
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setCount: (newCount) => set({ count: newCount }), // ← 直接値を設定
}));
```

上記のように store オブジェクトの中に**state をはじめ、セッター関数を含めたロジックや振る舞い**を記述していきます。

::: message
- **呼び出し元のコンポーネントやファイルでロジックや振る舞いを実装しない**
呼び出し元のコンポーネントやファイルなどロジック側で各種処理を実装できるものの、それでは **`any`的な何でもありの更新処理が生まれてしまうリスク** があります。
健全な処理実行を実現するためにも**原則、storeオブジェクトで更新処理を担うアクションを設定**するのがベターです。
:::

### `Zustand`と`useState`の類似性
先ほど「store オブジェクトの中に **state をはじめ、セッター関数を含めたロジックや振る舞い** を記述する」と説明しましたが、筆者は初見では中々理解できませんでした。

以下の store をベースに説明していきます。
```ts
const countStore = create<countType>((set) => ({
    count: 0,
    increment: () => set((state: number) => ({ count: state.count + 1 })),
    setCount: (newCount: number) => set({ count: newCount }),
}));
```

馴染み深い`useState`をベースに store オブジェクトにおけるセッター関数を考えてみると以下のようになります。

- 当該 state の現状値（既存値）を使った更新処理
`useState`で表現すると`setCount((prev) => prev +1 )`です。
これを`Zustand`で表現すると以下になります（※`increment`アクションにあたります）
```js
// 更新処理を store オブジェクトを通じて行う
set((state) => ({ count: state.count + 1 }));
```

- 当該 state の値を更新
`useState`で表現すると`setCount(newCount)`です。
この state の直接更新処理を`Zustand`で表現すると以下になります。
```js
// state の直接更新も store オブジェクトを通じて行う
setCount: (newCount) => set({ count: newCount });
```

### セレクター関数でパフォーマンスを最適化
`Zustand`では「セレクター関数」を使って、store から**必要な部分だけを取得することで不要な再レンダリングを防ぐ**ことができます。

- `store/useStore.js`
```js
const useStore = create((set) => ({
  count: 0,
  user: { name: 'John', age: 30 },
  items: [],
  increment: () => set((state) => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
}));
```

#### 悪い例： store 全体を取得
以下の事例では、`useStore`オブジェクトの`count`, `user`, `items`の **いずれかが変更されると再レンダリング** されてしまいます。

```js
const Component = () => {
  // ストア全体を取得（不要な再レンダリング）
  const store = useStore();
  
  return <div>{store.count}</div>;
};
```

#### 良い例： store から必要な部分だけ取得
以下の事例だと、`useStore`オブジェクトの **`count`が変更された時だけ再レンダリング** されます。

```js
const Component = () => {
  const count = useStore((state) => state.count);
  
  return <div>{count}</div>;
};
```

##### store から必要な部分だけ取得する処理フロー
セレクター関数は引数で state を受け取り、必要な部分を返しているのです。

```js
const increment = useStore((state) => state.increment);
//                         ↑ state = { count: 0, increment: [Function], ... }
//                                    ↑ この中から increment だけを取り出す

// 以下処理は上と同じ意味
const increment = useStore((state) => {
  return state.increment;
});
```

### 複数の値を取得する場合
同一 store オブジェクトから複数の値を取得したい場合は2つのアプローチがあります。

#### パターン1：個別に取得
```js
const Component = () => {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  
  return <button onClick={increment}>{count}</button>;
};
```

#### パターン2：オブジェクトでまとめて取得
```js
const Component = () => {
    // 以下はNG. ストア全体を購読するため不要な再レンダリングが発生してしまう
    // const { count, increment } = useStore();

    // 必要な値だけを選択して購読することで最適化
    const { count, increment } = useStore((state) => ({
        count: state.count,
        increment: state.increment,
    }));
  
    return <button onClick={increment}>{count}</button>;
};
```

※この方法では、ケースによって「オブジェクトの中身を比較するshallow比較」が必要な場合があるので注意してください。**パターン1：個別に取得**を推奨します。

### 各 state ごとに各 store ファイルを用意する
一つの React プロジェクト内で数値や文字列、真偽値、何らかの配列データなど複数の state を用いるケースがほとんどでしょう。

これまで説明してきた通り、`Zustand`は「store（というオブジェクト）で各種 state やアクション（ロジックや更新処理など）を一元管理」します。
一つのファイルに全ての store を詰め込んでも機能はしますが、保守や運用といった現実的なところを考慮する必要があります。

そこで、 **基本的には state ごとにファイル分割し、大規模の場合はアクションを含む store オブジェクトだけ別ファイルに分離** するのが一般的です。

#### 小規模〜中規模
- `store/useUserStore.js`
```js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

- `store/useCartStore.js`
```js
import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
}));
```

- `store/useUIStore.js`
```js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
```

---

- コンポーネントで各種 store を使用
```js
import { useUserStore } from "@/stores/useUserStore";
import { useCartStore } from "@/stores/useCartStore";
import { useUIStore } from "@/stores/useUIStore";

const Component = () => {
  // `store/useUserStore.js`
  const user = useUserStore((state) => state.user);
  const logout = useCartStore((state) => state.logout);

  // `store/useCartStore.js`
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // `store/useUIStore.js`
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
};
```

各 state ごとに store 別で管理するため責務分離や疎結合となって、プロジェクト内の state 管理がしやすく、全体的にも見通しが良くなりますね！

### 大規模
store を大分類と小分類に分けて管理していきます。

```
- store
  |--- useStore.js（大分類 store）
  |--- slices（ディレクトリ）
    |--- userSlice.js（小分類 store）
    |--- cartSlice.js（小分類 store）
```

- `store/slices/userSlice.js`
※小分類 store では`create`関数を使用せず store のみ定義する

```js
export const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
});
```

- `store/slices/cartSlice.js`
※小分類 store では`create`関数を使用せず store のみ定義する

```js
export const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
});
```

- `store/useStore.js`
小分類 store をまとめる大本の大分類 store。
```js
import { create } from 'zustand';
import { createUserSlice } from './slices/userSlice';
import { createCartSlice } from './slices/cartSlice';

export const useStore = create((set) => ({
  ...createUserSlice(set),
  ...createCartSlice(set),
}));
```

### Zustandの設計上の特徴まとめ
- state とアクションを**明示的に設計**
- ロジックは store 側に集約
- 大規模アプリでも破綻しにくい

## `Jotai` vs `Zustand`

| 項目 | Jotai | Zustand |
|------|-------|---------|
| 基本思想 | atomベースの細かい状態管理 | storeオブジェクトによる一元管理 |
| 状態共有 | Contextライクに状態を共有 | グローバルストアとして共有 |
| 状態分離 | Provider / Store による柔軟な分離が可能 | ストア単位で分離 |
| 依存関係の扱い | atom間の依存関係を明示的に定義可能 | セレクターで必要な状態のみ購読 |
| APIの特徴 | `useState`に近い宣言的な書き方 | シンプルで直感的なAPI |
| パフォーマンス | atom単位で再レンダリングを制御 | セレクターによる最適化が強力 |
| 向いているケース | - コンポーネント単位で細かく状態管理したい場合<br>- 状態の依存関係が複雑な場合<br>- Context APIの置き換え | - グローバルな状態管理が中心の場合<br>- パフォーマンス最適化を重視する場合<br>- シンプルな設計を好む場合 |

## さいごに
上記テーブルのように、`Jotai`と`Zustand`は目的は同じく「状態管理」ですが双方全く異なるアプローチを採っています。

筆者的には冒頭に書いた再掲となりますが、**`Zustand`の store ベースの処理が責務分離やシンプルさの観点から中〜大規模にも対応しやすそうで、さらにDXも良さそう**という印象です。

しかしもちろん`Jotai`が使いづらいとかいうことは決してなく、**小〜中規模で、スピード感が求められつつも保守性やDXも意識したい**というようなケースに向いている印象を受けました。

つまり、完全な小規模（DIY的な個人開発など）では React標準の`Context API`（`useContext`）を使って、小〜中規模でスピード重視だが保守性とDXも求めたい場合は`Jotai`、または小〜大規模で、堅実な実装を求めつつも保守性とDXも求めたい場合は`Zustand`という思考に至りました。

とは言え、組織やチームメンバー間のスキルセットなど現実的に考慮する部分はケースバイケースなので、そういった観点も加味した総合的判断で、そのプロジェクトや自分たちに最適な状態管理ライブラリを選ぶべきだと思います。

ここまで読んでいただき、ありがとうございました。

## 参考

https://ja.react.dev/blog/2024/12/05/react-19#context-as-a-provider

https://qiita.com/moritakusan/items/9a5e8c315b2565a02848

https://zenn.dev/gemcook/articles/5fd016c4c8fac0

https://zenn.dev/b13o/articles/tutorial-zustand
