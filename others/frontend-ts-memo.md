TypeScriptの基礎はある程度理解しているのを前提として、少しニッチな情報または自身が知らなかった内容などを備忘録としてまとめています。

## keyof typeof <対象要素>
`typeof`：対象要素の値から型を抽出（値を適切な型に変更）し、`keyof`：そのプロパティ（キー）名の文字列リテラルかつユニオン型を取得する。

- 事例コード
```ts
const targetObject ={
  en: "Butterfly",
  fr: "Papillon",
  it: "Farfalla",
  es: "Mariposa"
};

type targetObjectKeysType = keyof typeof targetObject;
// type targetObjectKeysType = "en" | "fr" | "it" | "es"
```

1. `typeof`で対象要素の **値から型を抽出（値を適切な型に変更）** する
- TypeSciptでは、型レベルの処理となるので`string`となる
  - ※TypeScriptの`typeof`は値から型を抽出する型演算子で型定義の文脈でのみ使用可能
- JavaScriptでは、値レベルの処理となるのでランタイム時に`"string"（文字列値）`となる

```ts
const targetObject ={
  en: "Butterfly",
  fr: "Papillon",
  it: "Farfalla",
  es: "Mariposa"
};

type targetObjectType = typeof targetObject;
/**
 type targetObjectType = {
    en: string;
    fr: string;
    it: string;
    es: string;
}
*/
```

2. `keyof`で（対象要素の） **プロパティ（キー）名の文字列リテラルかつユニオン型** を取得
```ts
type targetObjectKeysType = "en" | "fr" | "it" | "es";
```

> [!NOTE]
> ### `keyof typeof`の対象要素が、プリミティブな文字列や数値、文字列配列などではない場合
> **結論**：各種型が持つプロパティが返ってくる。しかし、リテラル型の場合は（プロパティがないので）型エラーとなる（※typeofを通さない場合限定）
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

## [Mapped Types](https://typescriptbook.jp/reference/type-reuse/mapped-types)
対象要素が持つプロパティ（キー）に即したオブジェクト型を生成する。<br>
※補足：[`Record<Keys, Type>`](https://typescriptbook.jp/reference/type-reuse/utility-types/record)といったユーティリティ型はこの仕組みを応用して定義されている。

```ts
type SystemSupportLanguage = "en" | "fr" | "it" | "es";

type Butterfly = {
  [key in SystemSupportLanguage]: string;
};
/**
 type Butterfly = {
    en: string;
    fr: string;
    it: string;
    es: string;
}
*/
```

### `Mapped Types`を使ったユーティリティ型の一つ：`Readonly<T>`
`Readonly<T>`は、プロパティを読み取り専用にする`readonly`をそのオブジェクトのすべてのプロパティに適用するというユーティリティ型です。
`Mapped Types`の機能を使って、次のように実装されています。

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
ここの`in`は[JavaScript の`in 演算子`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/in)ではなく、Mapped Types固有の記述。**対象要素の各キーを取得するシンプルなループ処理の働き**をしている。

> [!NOTE]
> - [`Mapped Types`では`Index Signature`（インデックスアクセス）に注意](https://typescriptbook.jp/reference/type-reuse/mapped-types#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%AE%E6%B3%A8%E6%84%8F%E7%82%B9)<br>
> **症状**：プロパティ（キー）に即したオブジェクト型を生成する性質から「存在しないキーにアクセスしてもキーが必ずあるかのように扱われるためランタイムエラーを引き起こす」可能性がある<br>
> **対処**：`tsconfig.json`で、TypeScriptのコンパイラオプション[`noUncheckedIndexedAccess`](https://typescriptbook.jp/reference/tsconfig/nouncheckedindexedaccess)を指定（有効化）する

- `tsconfig.json`例：
```json
{
  "compilerOptions": {
    "target": "ES2022",                   // 出力するJavaScriptのバージョン
    "module": "ESNext",                   // モジュールシステム
    "strict": true,                       // 厳格な型チェックを有効化
    "noImplicitAny": true,                // 暗黙のany型を禁止
    "noUnusedLocals": true,               // 未使用ローカル変数を警告
    "noUnusedParameters": true,           // 未使用パラメータを警告
    "noUncheckedIndexedAccess": true,     // インデックスアクセスの安全性を型で保証
    "forceConsistentCasingInFileNames": true, // ファイル名の大文字小文字を厳密に扱う
    "esModuleInterop": true,              // CommonJSとの互換性
    "skipLibCheck": true,                 // ライブラリ型定義のチェックをスキップ
    "outDir": "./dist",                   // 出力先ディレクトリ
    "rootDir": "./src",                   // ソースコードのルート
    "resolveJsonModule": true,            // JSONインポートを許可
    "moduleResolution": "node"            // Node.js互換のモジュール解決
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## TypeScriptにおける`extends`の意味と使われ方
TypeScriptの`extends`には、文脈によって3つの意味がある。<br>
**左辺が右辺の部分型である（T ⊆ U）** という考え方は、型制約や条件型の場面で特に重要となる。

| 用途                       | 例                             | 意味                                                                 |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------ |
| ① クラス継承（値レベル）            | `class Dog extends Animal {}` | 値レベルでの継承。プロトタイプチェーンを形成し、`Animal`のメソッドやプロパティを`Dog`が引き継ぐ。            |
| ② 型制約（ジェネリクス）            | `T extends Animal`            | **型レベル**の制約。`T`は`Animal`の部分型であり、`Animal`として扱える（`構造的部分型`：T ⊆ Animal）。 |
| ③ 条件型（`conditional types`） | `T extends U ? X : Y`         | **条件分岐型**。`T`が`U`の部分型なら`X`、そうでなければ`Y`を返す。                          |

### 補足
- TypeScriptは **`構造的部分型`（structural subtyping）** を採用<br>
つまり、TがUのメンバー構造を満たしていれば「部分型」として扱われる。
- 「`extends`＝継承」というよりも、「互換性」や「代入可能性（assignability）」のチェックを意味する場合が多い。
