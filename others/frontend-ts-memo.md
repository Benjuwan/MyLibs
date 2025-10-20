## keyof typeof <対象要素>
`typeof`：対象要素の値から型を抽出（値を適切な型に変換）し、`keyof`：そのプロパティ（キー）名の文字列リテラルかつユニオン型を取得する。

- 事例コード
```ts
const targetObject ={
  en: "Butterfly",
  fr: "Papillon",
  it: "Farfalla",
  es: "Mariposa"
};

keyof typeof targetObject
```

1. `typeof`で対象要素の**値から型を抽出（値を適切な型に変換）**する
- TypeSciptでは、型レベルの処理となるので`string`となる<br>
※TypeScript の typeofは値から型を抽出する型演算子で型定義の文脈でのみ使用可能
- JavaScriptでは、値レベルの処理となるのでランタイム時に`"string"（文字列値）`となる

```ts
type targetObjectPropsType = {
  en: string;
  fr: string;
  it: string;
  es: string;
};
```

2. `keyof`で（対象要素の） **プロパティ（キー）名の文字列リテラルかつユニオン型** を取得
```ts
type targetObjectKeysType = "en" | "fr" | "it" | "es";
```

> [!NOTE]
> ### `keyof typeof`の対象要素が、プリミティブな文字列や数値、文字列配列などオブジェクト型ではない場合
> 結論：各種型が持つプロパティが返ってくる。しかし、リテラル型の場合は（プロパティがないので）型エラーとなる（※typeofを通さない場合限定）
```ts
/* 文字列型 */
const str = "hello";
type StrKeys = keyof typeof str;
// "length" | "toUpperCase" | "charAt" | ... などメソッド名の文字列リテラルかつユニオン型となる

/* 数値型 */
const num = 123;
type NumKeys = keyof typeof num;
// "toFixed" | "toString" | ...

/* 真偽値 */
const flag = true;
type FlagKeys = keyof typeof flag;
// "valueOf" | "toString" | ...

/* イテラブル */
const arr = ["a", "b", "c"];
type ArrKeys = keyof typeof arr;
// "length" | "toString" | "push" | "pop" | ...
```

## Mapped Types
対象要素が持つプロパティ（キー）に即したオブジェクト型を生成する。<br>
※補足：[`Record<Keys, Type>`](https://typescriptbook.jp/reference/type-reuse/utility-types/record)といったユーティリティ型はこの仕組みを応用して定義されている。

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

1. `readonly`で、プロパティ名を編集不可に
2. `keyof`で、ジェネリクス（※ここではオブジェクトを想定）のプロパティ名を文字列リテラルかつユニオン型で取得
3. `T[P]`は**ジェネリクスのオブジェクトの各種キーにブラケット記法でアクセス**していて、その値の型を取得している（`targetObject[en]`の値は文字列なので型レベルで`string`となる）
    - TypeSciptでは、型レベルのインデックスアクセスとなるので`string`となる
    - JavaScriptでは、値レベル（オブジェクトのプロパティへ）のインデックスアクセスとなるので`Butterfly`となる
4. `P in keyof T`：<br>
ここの`in`は[JavaScript の`in 演算子`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/in)ではなく、Mapped Types固有の記述。対象要素の各キーを取得するシンプルなループ処理の働きをしている。

## TypeScriptにおける`extends`の意味と使われ方
TypeScriptの`extends`には、文脈によって3つの意味がある。<br>
**左辺が右辺の部分型である（T ⊆ U）**という考え方は、型制約や条件型の場面で特に重要となる。

| 用途                       | 例                             | 意味                                                                 |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------ |
| ① クラス継承（値レベル）            | `class Dog extends Animal {}` | 値レベルでの継承。プロトタイプチェーンを形成し、`Animal`のメソッドやプロパティを`Dog`が引き継ぐ。            |
| ② 型制約（ジェネリクス）            | `T extends Animal`            | **型レベル**の制約。`T`は`Animal`の部分型であり、`Animal`として扱える（`構造的部分型`：T ⊆ Animal）。 |
| ③ 条件型（`conditional types`） | `T extends U ? X : Y`         | **条件分岐型**。`T`が`U`の部分型なら`X`、そうでなければ`Y`を返す。                          |

### 補足
- TypeScriptは**`構造的部分型`（structural subtyping）**を採用<br>
つまり、TがUのメンバー構造を満たしていれば「部分型」として扱われる。
- 「`extends`＝継承」というよりも、「互換性」や「代入可能性（assignability）」のチェックを意味する場合が多い。
