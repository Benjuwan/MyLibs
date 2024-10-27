# React-Jotai-Tutorial

- [Jotai](https://jotai.org/)

- 参考情報：[初学者でも分かるようにJotaiを丁寧に解説していく](https://qiita.com/moritakusan/items/9a5e8c315b2565a02848)

## メモ

- `atom`<br />
最小限の（更新・購読可能な）単位の状態。`number`, `string`, `object`など各種「型」のデータ・値を（`State`）変数のような形で取り扱える。

```
const priceAtom = atom(10);
const messageAtom = atom('hello');
const productAtom = atom({ id: 12, name: 'good stuff' });
```

- 配列の場合<br />
`Jotai` の `atom` はデフォルトでは初期値の型を `never`（値を持たない型）として扱う。これに対処するためには、**`atom`を作成する際にジェネリクスを使用して初期値の型を指定**する。

```  
.
..
const defaultPokeListData: pokeDataType = {
    name: '【hogemon】---',
    weight: 100,
    height: 100
}

export const pokeListAtom = atom([defaultPokeListData]);
..
.
```

- `atom`の宣言はコンポーネントの範囲外で、`useAtom`はコンポーネントの範囲内で使用する（※ログに警告が出る：Warning: Maximum update depth exceeded...）<br />ただし一般的に`atom`の宣言は、**コンポーネント間での`atom`共有を考慮して外部ファイル（例：`ts/atom.ts`）で定義**する。

```
/* ------- atom の宣言はコンポーネントの範囲外で行う ------- */
export const TheComponent = () => {
/* ------- useAtom はコンポーネントの範囲内で使用する ------- */
```

- `useAtom`<br />
  - `atom`を読み込んで状態管理を行う変数にセットする。`React`の`useState`とほとんど同じインターフェース。

  ```
  const [value, setValue] = useAtom(atom);
  ```

  - `useAtom`は`Context`の`useContext`と似たような働きも持つ。`atom`を外部ファイルで管理してコンポーネント間での`atom`（State）の共有を行える。

    - `atom`の更新<br />
    ```
    // Items.tsx
    .
    /* Single Mode */
        const [, setPokeItem] = useAtom(pokeItemAtom); // 更新関数のみ用意（変数は使用しないので無し）
        const fetchPokeDataSetItem = (pokemonUrl: string) => {
            const pokemons: Promise<pokeDataType> = FetchPokeData(pokemonUrl);
            pokemons.then((data) => {
                setPokeItem((_prevPokeItem) => data); // フェッチしたデータを pokeItemAtom に格納
            });
        }


    /* Multi Mode */
        const [pokeList, setPokeList] = useAtom(pokeListAtom);
        const fetchPokeDataSetList = (pokemonUrl: string) => {
            const pokemons: Promise<pokeDataType> = FetchPokeData(pokemonUrl);
            pokemons.then((data) => {
                setPokeList((_prevPokeList) => [...pokeList, data]); // フェッチしたデータを pokeListAtom に格納
            });
        }
    ```

  上の処理で更新された`atom`（State）を呼び出して使用。

  ```
  // BaseComponent.tsx
  .
  import { pokeItemAtom, pokeListAtom } from "./ts/atom";
  ..
  .
  /* -------- 外部ファイル（ts/atom.ts）で宣言した atom を呼び出して使用する -------- */
  const [pokeItem] = useAtom(pokeItemAtom);
  const [pokeList] = useAtom(pokeListAtom);
  ```

- `Store`<br />
共有するデータの保管場所を定義するもの。`createStore`を使用することで、新しい空のストアを作成することができ、下記の3つのメソッドを持っている。
  - `get` : `atom`の値を取得する
  - `set` : `atom`の値を設定する
  - `sub` : `atom`の値を更新する

  ```
  .
  ..
  const myStore = createStore() // 空のstoreの宣言
  const countAtom = atom(0) // （number の）atom を作成
  myStore.set(countAtom, 1) // 宣言したstoreにcountAtomに初期値として1を代入した状態でセットする

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={myStore}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
  ```

  - `Provider`（`Context`のそれとほぼ同じ機能）<br />
  `Provider`を使用することで`Provider`に囲われているコンポーネントだけに閉じられた`atom`を提供できる。コンポーネントツリー毎に異なる`atom`を保持する必要がある場合は、`Provider`と`Store`を使うことで空間的に切り分けられた環境で`atom`を使用できる。

- ライブラリ使用時に不明な型が発生した場合は、大抵`*.d.ts`（型定義ファイル）で管理されている

```
// CountUpdateBtn.tsx

/* 
    WithInitialValue は 以下の型定義ファイルにて
    [\node_modules\jotai\esm\vanilla\atom.d.mts] or
    [\node_modules/jotai/vanilla/atom.d.ts]
    以下の形で型定義されている。
*/
type WithInitialValue<Value> = {
    init: Value;
};

type btnProps = {
    countAtom: PrimitiveAtom<number> & WithInitialValue<number>
}
```

- `atom`はそのままでは`JSX`内で使えない<br />
`useAtom`を使って`atom`を（State）変数？のような形にすることで`JSX`内で使用できる。

```
// AtomComponent.tsx

return (
  <>
    {/* TypeScript からの警告：【型 'PrimitiveAtom<number> & WithInitialValue<number>' を型 'ReactNode' に割り当てることはできません。】*/}
    <p>priceAtom：{priceAtom}</p>
  </>
);
```