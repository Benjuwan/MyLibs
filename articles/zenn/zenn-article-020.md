---
title: "【TypeScript】オプショナルな型を含むオブジェクト型から存在する型だけを抽出して利用したい"
emoji: "🍀"
type: "tech"
topics:
  - "react"
  - "typescript"
  - "vite"
  - "contest2025ts"
published: true
published_at: "2025-05-18 09:00"
---

## はじめに
ある個人開発で「オプショナルな型を含むオブジェクト型から存在する型だけを抽出して利用したい」場面がありました。

具体的には以下のようなオブジェクト型です。
```ts
export type quizChoicesType = {
    one: quizChoiceContentType;
    two: quizChoiceContentType;
    three: quizChoiceContentType;
    four?: quizChoiceContentType;
    five?: quizChoiceContentType;
    six?: quizChoiceContentType;
    seven?: quizChoiceContentType;
    eight?: quizChoiceContentType;
};
```

これはクイズゲームの設問数（回答選択肢）になります。
基本的には各問ごとに3つの選択肢としながら、最大8つの選択肢までを用意できるようにしたかったのです。

各種クイズゲームのデータ（問題及び回答、得点）は別途`json`ファイルで用意していて、今回事例とする個人開発はそれを読み込んでクイズを表示するSPA（`React 19`）です。

今回、本記事で紹介するのは筆者が「クイズデータの各クイズにおける設問数を柔軟に表示（＝オプショナルな型を含むオブジェクト型から存在する型だけを抽出）したい」という目的から実装した内容となります。

## 抽出するためのカスタムフック
以下が当該カスタムフックとなります。
（※これは型システム的に問題のある記述内容です）

- `useConvertTargetType.ts`
```ts
export const useConvertTargetType = () => {
    const { quizCollectAnswerScores } = useContext(QuizCollectAnswerScoresContext);

    // quizCollectAnswerScores（オブジェクト）の中に key があるかチェックして
    // あれば「既に存在が保証されている型」を key に指定（型アサーション： 型推論の上書き）
    // なければ undefined
    const convertTargetType = (key: string): keyof quizChoicesType | undefined =>
    key in quizCollectAnswerScores ? (key as keyof quizChoicesType) : undefined;

    return { convertTargetType }
}
```

:::details ※ 後述する問題点を解消した修正版

`key in quizCollectAnswerScores`の部分を、`Object.hasOwn(quizCollectAnswerScores, key)`に変更しています。

```ts
export const useConvertTargetType = () => {
    const { quizCollectAnswerScores } = useContext(QuizCollectAnswerScoresContext);

    const convertTargetType = (key: string): keyof quizChoicesType | undefined => {
    return Object.hasOwn(quizCollectAnswerScores, key) ?
            (key as keyof quizChoicesType) : undefined;
    }

    return { convertTargetType }
}
```

:::

1. 処理結果として、オブジェクト型からプロパティを（文字列リテラル）型として抽出
```ts
const convertTargetType = (key: string): keyof quizChoicesType | undefined => ...
```
カスタムフックの処理結果として、`オブジェクト型からプロパティを（文字列リテラル）型として抽出したもの（例：`one`,`two`,`three`...`eight`）`または`undefined`を返すようにしています。

2. [`in 演算子`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/in)でチェック
中のロジックに関しては、`in 演算子`を用いて`quizCollectAnswerScores`（オブジェクト）の中に `key` があるかチェックして、あれば「既に存在が保証されている型」を `key` に指定し、なければ `undefined`を返す、というものです
```ts
// convertTargetType の処理内容
key in quizCollectAnswerScores ?
    (key as keyof quizChoicesType) :
    undefined;
```

`quizCollectAnswerScores`は`Context API`を使ったグローバルステートでして、以下のように動的に設定できるようにしてあります。
```ts
export type quizCollectAnswerScoresType = {
    /* key（プロパティ名）は（オブジェクトの）ブラケット記法で動的に命名 */
    [choiceLabel: string]: string[];
};
```

今回この部分も大切な役割を果たしています。
以下のコードでは、取得したデータの内容から設問項目名（例：`one`,`two`,`three`...`eight`）を取り出し、`quizCollectAnswerScoresType`に即したオブジェクトを生成しています。

```ts
const { setQuizCollectAnswerScores } = useContext(QuizCollectAnswerScoresContext);

// getQuizData は親コンポーネントにて use API を使って取得したクイズゲームのデータ props
const quizDataChoices: quizChoicesType[] = useMemo(() => getQuizData.map(quizData => quizData.choices), [getQuizData]);

/* 設問数（getQuizData.length）に応じた空要素('')を用意 */
const scoreEntriesAry: string[] = new Array(getQuizData.length).fill('');

const choiceLabel: string[][] = Object.values(quizDataChoices).map((eachQuizChoice, i) => {
    if (i === 0) {
        /* 設問項目名（例：'one' | 'two' | 'three'）を抽出 */
        return Object.keys(eachQuizChoice);
    }
    }).filter((eachQuizChoice): eachQuizChoice is string[] => typeof eachQuizChoice !== 'undefined');

/* quizCollectAnswerScores の生成 */
/* 2次元配列（string[][]）を1次元配列（string[]）に変換して処理を進める */
const theChoices: quizCollectAnswerScoresType[] = choiceLabel.flat().map(label => {
    return {
        /* key（プロパティ名）は（オブジェクトの）ブラケット記法で動的に命名 */
        [label]: scoreEntriesAry
        }
    });

/* Object.assign(target, src) ： {}（空オブジェクト）を用意し、スプレッド演算子で展開した theChoices の中身で上書き（格納）する */
const objMarged_newChoices: quizCollectAnswerScoresType = Object.assign({}, ...theChoices);
setQuizCollectAnswerScores(objMarged_newChoices);
```

この工程を経て、先に載せた以下処理が成り立つようになります。
```ts
key in quizCollectAnswerScores
```

:::message alert
ただし、この記述だと構造的部分型や`in演算子`、JavaScriptの`__proto__`などの影響から型と実行時の値に不一致が生じてしまいます。
:::

上記の件は、コメントにてご教示いただきました。@ghaaj さんありがとうございます！

--- 

構造的部分型によって、期待するプロパティを持っていれば追加のプロパティがあっても型チェックを通過してしまいます。
例えば、`quizChoicesType`に定義されていない余分なプロパティ（例：`isHoge: true`）を持つオブジェクトも、必要なプロパティ（`one,two,three...eight`）さえ持っていれば同じ型として扱われます。

`in演算子`では「型の絞り込み（Narrowing）」が起きないようになっていて、かつ「継承元のプロパティも引き継いでしまう」ため、余分なキー・プロパティを含んでいる場合に`TypeScript`は同じとみなしてしまいます。

しかも、JavaScriptには「すべてのオブジェクトが持つ特殊なプロパティ`__proto__`」があり、オブジェクトのプロトタイプ（継承元）を参照するため、これにより型システムと実行時の値に不一致が生じます。

コメントで教示いただいだ内容をもとに修正したのが以下です。

```diff
const convertTargetType = (key: string): keyof quizChoicesType | undefined =>
- key in quizCollectAnswerScores ? 
+ Object.hasOwn(quizCollectAnswerScores, key) ?
(key as keyof quizChoicesType) : undefined;
```

[`Object.hasOwn`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)を用いることで、オブジェクト自身のプロパティだけをチェックし、プロトタイプチェーンは検索しないため先のような問題を回避できます。

## さいごに
筆者の知識・スキル不足で冗長気味かつ間違った記述や説明もあるかもしれません。
何か気づいたり、気になったりされた方はコメントなどでご教授いただければ幸いです。

ここまで読んでいただき、ありがとうございました。