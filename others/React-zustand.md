# Zustandの要点まとめ

## zustand と useStateの類似性
まずzustandでは`useState`を使っておらず、その派生のReact18から導入された`useSyncExternalStore`を使っている。


```javascript
`set((state) => ({ count: state.count + 1 }))`は、
`setCount((prev) => prev +1 )`のようなもの
（当該Stateの現状値を使った更新処理：storeオブジェクトを通じて行う）

`setCount: (newCount) => set({ count: newCount })`は、
`setCount(newCount)`のようなもの
（Stateの直接更新）
```


## zustandではStateとアクションを一元管理するstoreファイルを用意する
zustandではStateとアクション（**セッター関数** + 単純な更新処理をはじめ、条件分岐などを含んだりする**各種処理**）を一元管理するstoreオブジェクトが肝になる。


```javascript
// 例1
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({
    count: state.count < 10 ? state.count + 1 : state.count
    //    ↑ 上限チェックを追加
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

呼び出しコンポーネントやファイルなどロジック側で更新処理を実装できるものの、それではany的な何でもありの更新処理が生まれてしまうリスクがある。
健全な処理実行を実現するために**原則、storeオブジェクトで更新処理を担うアクションを設定**する。

## セレクター関数でパフォーマンス最適化
Zustandではセレクター関数を使って、ストアから必要な部分だけを取得することで不要な再レンダリングを防ぐことができる。

### 基本的な使い方

```javascript
// store/useStore.js
const useStore = create((set) => ({
  count: 0,
  user: { name: 'John', age: 30 },
  items: [],
  increment: () => set((state) => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
}));

// ❌ 悪い例：ストア全体を取得
const Component = () => {
  const store = useStore(); 
  // ↑ count, user, items のいずれかが変更されると再レンダリング
  return <div>{store.count}</div>;
};

// ✅ 良い例：必要な部分だけ取得
const Component = () => {
  const count = useStore((state) => state.count);
  // ↑ countが変更されたときだけ再レンダリング
  return <div>{count}</div>;
};
```

### セレクター関数の仕組み

```javascript
// セレクター関数は引数でstateを受け取り、必要な部分を返す
const increment = useStore((state) => state.increment);
//                         ↑ state = { count: 0, increment: [Function], ... }
//                                    ↑ この中から increment だけを取り出す

// これは以下と同じ意味
const increment = useStore((state) => {
  return state.increment;
});
```

### 複数の値を取得する場合

```javascript
// ✅ パターン1：個別に取得（推奨）
const Component = () => {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  
  return <button onClick={increment}>{count}</button>;
};

// ✅ パターン2：オブジェクトでまとめて取得
const Component = () => {
  const { count, increment } = useStore((state) => ({
    count: state.count,
    increment: state.increment,
  }));
  
  return <button onClick={increment}>{count}</button>;
};

// ⚠️ パターン2の注意点：shallow比較が必要な場合がある
import { shallow } from 'zustand/shallow';

const { count, increment } = useStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow // オブジェクトの中身を比較
);
```

### 再レンダリングの最適化例

```javascript
// 例：ユーザー情報とカウントが同じストアにある場合
const useStore = create((set) => ({
  count: 0,
  user: { name: 'John', age: 30 },
  increment: () => set((state) => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
}));

// ❌ 悪い例
const CountDisplay = () => {
  const store = useStore();
  // user が変更されても再レンダリングされてしまう
  return <div>{store.count}</div>;
};

// ✅ 良い例
const CountDisplay = () => {
  const count = useStore((state) => state.count);
  // count が変更されたときだけ再レンダリング
  return <div>{count}</div>;
};

const UserDisplay = () => {
  const user = useStore((state) => state.user);
  // user が変更されたときだけ再レンダリング
  return <div>{user.name}</div>;
};
```

### セレクター関数のポイント

- **必要な部分だけを取得**することで、関係ない状態の変更による再レンダリングを防ぐ
- **アクション関数（increment等）は変更されない**ため、取得しても再レンダリングの原因にならない
- 複数の値をオブジェクトで取得する場合は、`shallow`比較を使うことを検討する
- セレクター関数は毎回新しい関数を作るのではなく、可能な限りシンプルに保つ

## 各Stateごとに各storeファイルを用意する
基本的にはStateごとにファイル分割し、大規模の場合はアクションを含むstoreオブジェクトだけ別ファイルに分離する。

### 小規模〜中規模

```javascript
// store/useUserStore.js
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// store/useCartStore.js
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
}));

// store/useUIStore.js
export const useUIStore = create((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));

// コンポーネントで使用
const Component = () => {
  const user = useUserStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const openModal = useUIStore((state) => state.openModal);
};
```


### 大規模

```javascript
// store/slices/userSlice.js
export const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
});

// store/slices/cartSlice.js
export const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
});

// store/useStore.js
import { create } from 'zustand';
import { createUserSlice } from './slices/userSlice';
import { createCartSlice } from './slices/cartSlice';

export const useStore = create((set) => ({
  ...createUserSlice(set),
  ...createCartSlice(set),
}));
```

## 参考

https://zenn.dev/b13o/articles/tutorial-zustand