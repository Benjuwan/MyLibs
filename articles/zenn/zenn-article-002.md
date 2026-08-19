---
title: "【React】Jotai を使ってみて"
emoji: "✏️"
type: "tech"
topics:
  - "react"
  - "typescript"
  - "jotai"
published: true
published_at: "2024-01-08 14:48"
---

## はじめに
今まで`React`でのコンポーネント間における`state`（グローバルステートの）管理では`Context`ばかり使ってきたのですが、幅を広げたいと思って`Jotai`を使ってみました。今回は、`Context`ばかり使ってきた筆者の所感と、その比較を交えて書いていこうと思います。

## まず結論
**`Jotai`すごく使いやすかった**です。今後は`Context`ではなく、`Jotai`をメインに使っていこうかなと思いました（実際は、その時の状況や仕様に応じてフレキシブルに選択すると思いますが）。

新しい技術に慣れるにはインプットからのアウトプットが常套手段なので、今回まずは以下の記事とチュートリアルを元に試用。

参考にさせていただいた記事：
https://qiita.com/moritakusan/items/9a5e8c315b2565a02848

そのあと応用編として自分で使用してみました。
応用編で作ったものは以下になります（[PokeAPI](https://pokeapi.co/)を利用しています）。

@[codesandbox](https://codesandbox.io/embed/nh35qv?view=preview&module=%2Fsrc%2FApp.tsx)

::: message
選択したポケモンが表示されるものです。
・【ポケモンの入れ替え】別のポケモンを選択すると変更されます。
・【ポケモンの追加】別のポケモンを選択すると選択済みのポケモンの後ろに追加されます。
:::

## Jotai に好感を持てた点
- `useAtom`は`useState`と`useContext`を足した感じで、シンプルで分かりやすくグローバルステートを（更新・管理など）扱える
- `Provider`を使うことも、使わないこともできる
- 前もって`atom`（`state`）の更新処理を仕込んでおける
- `atom`を外部ファイル（例：`atom.ts`）に分割して一元管理できるので楽

ざっと挙げてみてこのくらいで、今後使っていくにつれて増えていくかもしれません。

- `useAtom`は`useState`と`useContext`を足した感じで、シンプルで分かりやすくグローバルステートを（更新・管理など）扱える
まずは`useState`のような使用感について下記コードをもとに説明します。

```ts
import { atom, useAtom } from "jotai"
..
.
// atom に初期値100を指定
const valueAtom = atom(100)
.
..
export const TheComponent = () => {
..
.
// valueAtom（初期値100を指定したatom）を state に変数と更新関数を用意
const [value, setVal] = useAtom(valueAtom) 
// useState と同じ要領で使用（変数の更新）
const setValue = (x: number) => setVal((_prevVal) => value * x);
..
.
<button type="button" onClick={() => setValue(2)}>
  <b>value：{value}</b><br />値を2倍にしていく
</button>
..
.
```

このように`useState`と同じ要領で atom を更新できます。
`const setValue = (x: number) => setVal((_prevVal) => value * x);`

次に、`useContext`のような使用感について。

```ts
.
..
/* -------- 外部ファイル（ts/atom.ts）で宣言した atom を呼び出して使用する -------- */
const [pokeItem] = useAtom(pokeItemAtom);
const [pokeList] = useAtom(pokeListAtom);
..
.
/* 呼び出した atom をコンポーネントに渡す */
<SingleData pokeItem={pokeItem} />
<MultiData pokeList={pokeList} />
..
.
```

もちろん、コンポーネントで直接`atom`を呼び出してもokです。

```ts
import { useAtom } from "jotai";
import { pokeListAtom } from "./ts/atom";

export const MultiData = () => {
    const [pokeList] = useAtom(pokeListAtom); // `atom`を呼び出す

    return (
        <div style={listStyle}>
            {pokeList.map((pokemon, i) => (
                /* 処理 */
            ))}
        </div>
    );
}
```

ちなみに、先ほど挙げた好感ポイントの3つ目にある、
- 前もって`atom`（`state`）の更新処理を仕込んでおける
に関して、先ほどの`useState`の使用感についてのコードを以下のようにすることで同様の結果が得られます。

```ts
import { atom, useAtom } from "jotai"
..
.
// atom に初期値100を指定
const valueAtom = atom(100)
const addingValueAtom = atom(
    (get) => get(valueAtom), // valueAtom（初期値100を指定したatom）を取得
    (get, set, num: number) => {
        set(valueAtom, get(valueAtom) * num) // 取得した valueAtom に num を掛けて更新
    },
)
.
..
export const TheComponent = () => {
..
.
// addingValueAtom を state に変数と更新関数を用意
const [value, setValue] = useAtom(addingValueAtom) 
..
.
<button type="button" onClick={() => setValue(2)}>
  <b>value：{value}</b><br />値を2倍にしていく
</button>
..
.
```

この部分は先ほど紹介した[参考記事](https://qiita.com/moritakusan/items/9a5e8c315b2565a02848)から拝借しており、そちらでより詳しく説明していただいているので是非ご確認ください。

- `Provider`を使うことも、使わないこともできる
`Context`でグローバルステートの管理を行うと、再レンダリング（*1）のことを考慮して設けたグローバルステート（`Context`）の数だけ`Provider`を用意することになり、以下のように`Provider`によって階層が深くなってしまう事態もあります。
*1：`context`の値が更新・変更されると、その`context`を参照しているコンポーネント全てが再レンダリングされる

```react
.
..
<React.StrictMode>
    <TheHogeContextFlagment>
      <TheFooContextFlagment>
        <TheBarContextFlagment>
          <App />
        </TheBarContextFlagment>
      </TheFooContextFlagment>
    </TheHogeContextFlagment>
</React.StrictMode>,
..
.
```

しかし、`jotai`ではこのようなことをしても良いし、**しなくても良い**ような作りになっています。
具体的には、この好感ポイントも参考記事にて分かりやすく説明されていますが、こちらでは筆者が試用検証したもので進めていきます。

以下のコンポーネント（`Counter.tsx`, `CountUpdateBtn.tsx`）は中身が同じ**カウント+1する**ためのボタンコンポーネントで、カウントの更新には`countsAtom`という`atom`を使っています。

```ts:Counter.tsx
import { useAtom } from "jotai";
import { countsAtom } from "./ts/atom";

export const CountBtn = () => {
    // countsAtom を state に変数と更新関数を用意
    const [count, setCount] = useAtom(countsAtom);
    return (
        <>
            <div>Counter：{count}</div>
            <button onClick={() => setCount((p) => p + 1)}>
                +1するボタン
            </button>
        </>
    )
}
```

```ts:CountUpdateBtn.tsx
.
..
// button 要素にスタイルをあてているだけで、他は Counter.tsx と同じ内容
<button style={{ 'borderColor': 'red' }} onClick={() => setCount((p) => p + 1)}>
..
.
```

`atom`を管理する外部ファイル（`atom.ts`）
```ts:atom.ts
import { atom } from "jotai";
export const countsAtom = atom(0);
```

```ts:TheComponent.tsx
import { Provider, atom, createStore, useAtom } from "jotai"
import { countsAtom } from "./ts/atom"
import { CountBtn } from "./CountBtn"
import { CountUpdateBtn } from "./CountUpdateBtn"

// store（共有するデータの保管場所を定義するもの）を宣言
const countsStore = createStore()
// storeの中にcountsAtomを初期値100としてセットする
countsStore.set(countsAtom, 100)
.
..
export const TheComponent = () => {
..
.
<Provider store={countsStore}>
  <h1>Proverで切り分けした空間</h1>
  <CountUpdateBtn />
  <CountUpdateBtn />
  <CountBtn />
</Provider>
<h1>グローバルステート空間</h1>
<CountBtn />
..
.
```

`Counter.tsx`と`CountUpdateBtn.tsx`は処理は同じでも別々の異なるコンポーネントです。ですがボタンを押下すると`store`で指定した値（100）が更新されていきます。

```ts
countsStore.set(countsAtom, 100)
```

![gif画像-1](https://storage.googleapis.com/zenn-user-upload/1e64664b3010-20240108.gif)

一方、`Provider`に囲われていない`Counter.tsx`（CountBtn コンポーネント）を押下すると`atom.ts`で指定した`countsAtom`値（0）が更新されていきます。

```ts
export const countsAtom = atom(0);
```

- `atom`を外部ファイル（例：`atom.ts`）に分割して一元管理できるので楽
上記では`atom.ts`で一つの`atom`（countsAtom）しか管理していないのでメリットを感じづらいかもしれません。しかし管理する`atom`が増えてくると一元管理できるありがたみが実感できます。

以下は冒頭に掲載した応用編で作ったものの`atom.ts`です。

```ts
import { atom } from "jotai";
import { pokeDataType } from "./pokedata";

const defaultPokeListData: pokeDataType = {
    name: '【hogemon】---',
    weight: 100,
    height: 100
}

const defaultPokeSingleData: pokeDataType = { name: undefined }

// ポケモンの入れ替え用 atom
// 引数には defaultPokeSingleData ではなく、defaultPokeListData でもok.
export const pokeItemAtom = atom(defaultPokeSingleData);

// ポケモンの追加用 atom
export const pokeListAtom = atom([defaultPokeListData]);
```

ここは少し詰まったところだったのですが、`atom`を作成する際のデフォルト値の型は`never`だそうで「`atom`に型注釈ってどうするのだろう？」と右往左往しました。
そこで`ChatGPT`に質問を投げると、以下のように自身でデフォルト値を設ける必要があることを知りました。
> Jotai の atom はデフォルトでは初期値の型を never として扱います。これに対処するためには、atom を作成する際にジェネリクスを使用して、初期値の型を指定することができます。

そのため上記では`defaultPokeListData: pokeDataType`や`defaultPokeSingleData: pokeDataType`などを用意してそれを`atom`の引数に指定しています。

```ts
// 最初は never だが、
const pokeItemAtom: PrimitiveAtom<never> & WithInitialValue<never>

// 引数に型注釈したものを指定すると型を解釈してくれる。すごい Jotai というか TypeScript？
const pokeItemAtom: PrimitiveAtom<pokeDataType> & WithInitialValue<pokeDataType>
```

デフォルト値とかを各コンポーネントごとに用意する必要が特になければ一元管理できた方が楽ですよね。

## さいごに
まだまだ`Jotai`を完全に理解し、マスターできたわけではありませんが、今後積極的に使って習熟度を高めたいと思います。
あと、言わずもがなグローバルステートの管理には`Redux`や`Recoil`, `Zustand`などたくさんありますので、追々それらにも手を伸ばして幅を広げたいなと。

`Context`ばかり使っている筆者が言うのもなんですが、今回使ってみた`Jotai`は身構えて臨んだ割に拍子抜けするくらいシンプルで分かりやすい状態管理ライブラリでした！
まだ使ったことのない方がいらしたらぜひ試してみてください。

https://jotai.org/

ここまで読んでいただき、ありがとうございました。

## 参考記事
https://qiita.com/moritakusan/items/9a5e8c315b2565a02848

https://jotai.org/