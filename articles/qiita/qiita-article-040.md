---
title: 【TypeScript】個人的に理解に詰まったTS関数や概念、機能に関する備忘録
tags: TypeScript JavaScript 備忘録
author: benjuwan
slide: false
---
これは、筆者の「2025振り返り用ひとりアドカレ」記事の一つです。

## はじめに
筆者はTypeScriptを実務および個人開発で数年使っています。
しかし、まだまだ知らなかったりするのも多いため、本年お世話になったものをはじめ、理解に詰まったりした内容などを備忘録としてまとめていきます。

## <font color="red">keyof</font> <font color="blue">typeof</font> <対象要素>
<font color="blue">`typeof`</font>：対象要素の値から型を抽出（値から型情報を取り出す）し、
<font color="red">`keyof`</font>：そのプロパティ（キー）名の文字列リテラルかつユニオン型を取得する。

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

### 1. `typeof`で対象要素の **値から型を抽出（値から型情報を取り出す）** する
- TypeSciptでは、型レベルの処理となるので`string`となります
  - ※TypeScriptの`typeof`は値から型を抽出する型演算子で型定義の文脈でのみ使用可能
- JavaScriptでは、値レベルの処理となるのでランタイム時に`"string"（文字列値）`となります

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

### 2. `keyof`で（対象要素の） **プロパティ（キー）名の文字列リテラルかつユニオン型** を取得
```ts
type targetObjectKeysType = "en" | "fr" | "it" | "es";
```

::: note info
### `keyof typeof`の対象要素が、プリミティブな文字列や数値、文字列配列などではない場合
各種型が持つプロパティが返ってくる。
しかし、リテラル型の場合は（プロパティがないので）型エラーとなる（※ typeof を通さない場合限定）

```ts
/* 文字列型 */
const str = "hello";
type StrKeys = keyof typeof str;
// "length" | "toUpperCase" | "charAt" | ... など
// メソッド名の文字列リテラルかつユニオン型となる

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
:::



## [Mapped Types](https://typescriptbook.jp/reference/type-reuse/mapped-types)
対象要素が持つプロパティ（キー）に即したオブジェクト型を生成する。
※補足：[`Record<Keys, Type>`](https://typescriptbook.jp/reference/type-reuse/utility-types/record)といったユーティリティ型はこの仕組みを応用して定義されています。

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
    - JavaScriptにおけるブラケット記法では、値レベル（実体のオブジェクトのプロパティ）へのインデックスアクセスとなり、結果として "Butterfly" のような**実際の値**が取得される
4. `P in keyof T`：
ここの`in`は[JavaScript の`in 演算子`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/in)ではなく、Mapped Types固有の記述。**対象要素の各キーを取得するシンプルなループ処理の働き**をしている。

::: note info
- [`Mapped Types`では`Index Signature`（インデックスアクセス）に注意](https://typescriptbook.jp/reference/type-reuse/mapped-types#%E3%82%A4%E3%83%B3%E3%83%87%E3%83%83%E3%82%AF%E3%82%B9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%AE%E6%B3%A8%E6%84%8F%E7%82%B9)
  - **症状**：プロパティ（キー）に即したオブジェクト型を生成する性質から「存在しないキーにアクセスしてもキーが必ずあるかのように扱われるためランタイムエラーを引き起こす」可能性（プロトタイプチェーン）がある
  - **対処**：`tsconfig.json`で、TypeScriptのコンパイラオプション[`noUncheckedIndexedAccess`](https://typescriptbook.jp/reference/tsconfig/nouncheckedindexedaccess)を指定（有効化）する

---

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

:::

## TypeScriptにおける`extends`の意味と使われ方
TypeScriptの`extends`には、文脈によって3つの意味があります。
**左辺が右辺の部分型である（T ⊆ U）** という考え方は、型制約や条件型の場面で特に重要となる印象です。

| 用途                       | 例                             | 意味                                                                 |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------ |
| ① クラス継承（値レベル）            | `class Dog extends Animal {}` | 値レベルでの継承。プロトタイプチェーンを形成し、`Animal`のメソッドやプロパティを`Dog`が引き継ぐ。            |
| ② 型制約（ジェネリクス）            | `T extends Animal`            | **型レベル**の制約。`T`は`Animal`の部分型であり、`Animal`として扱える（`構造的部分型`：T ⊆ Animal）。 |
| ③ 条件型（`conditional types`） | `T extends U ? X : Y`         | **条件分岐型**。`T`が`U`の部分型なら`X`、そうでなければ`Y`を返す。                          |

### 補足
- TypeScriptは **`構造的部分型`（structural subtyping）** を採用
つまり、TがUのメンバー構造を満たしていれば「部分型」として扱われる。
- 「`extends`＝継承」というよりも、「互換性」や「代入可能性（assignability）」のチェックを意味する場合が多い。

## ReturnType
型注釈するには面倒な量のプロパティを持つオブジェクトがある場合に役立つ機能です。
対象オブジェクトに準じた型定義をしてくれるという便利な働きをしてくれます。

::: note warn
- `ReturnType`は関数の戻り値にしか使えない
以下の参考記事にも記載ありますが、`ReturnType`は**関数の戻り値（return の型）を抜き出すためのユーティリティ型**です。
つまり、`T`が関数型（例：`() => T`やメソッド型）の場合にのみ、その戻り値の型を抽出します。
例えば、それ以外の型（例：非同期処理で返ってくる型`promise<any>`, `any`, `object`, プリミティブ型など）に対しては適用できません。
:::

以下の記事が大変分かりやすく参考になりました。

https://qiita.com/makoto-ogata@github/items/a5abe54a2ef387973d17

::: note info
### 記事から拝借
```ts

const getInitialUser = () => {
  return {
    id: 12345,
    name: "Guest",
    preferences: {
      theme: "dark",
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      layout: {
        sidebar: "collapsed",
        density: "compact"
      }
    },
    lastLoginAt: new Date(),
    tags: ["new", "trial", "mobile"]
  };
};
```

上記オブジェクトを型定義した場合

```ts

type User = {
  id: number;
  name: string;
  preferences: {
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    layout: {
      sidebar: string;
      density: string;
    };
  };
  lastLoginAt: Date;
  tags: string[];
};
```

上記のような型定義を書いていくのが面倒（かつ記述漏れのリスクもあるという場合）な時に`ReturnType`を使えばたった一行で型定義できます。

```ts
type User = ReturnType<typeof getInitialUser>
```

:::


## さいごに
本記事は、今後も筆者がTypeScriptを使っていて書き残しておきたいもの（書いておかないと忘れてしまいそうなこと）を随時更新していく予定です。

筆者の知識不足もあるかと思いますので、何かお気づきの方はご教授いただけますと嬉しく思います。

ここまで読んでいただき、ありがとうございました。

## 参照

https://qiita.com/makoto-ogata@github/items/a5abe54a2ef387973d17

