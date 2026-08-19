---
title: "【JavaScriptの配列操作】シャローコピーと非破壊的メソッドの違いは？"
emoji: "🤔"
type: "tech"
topics:
  - "javascript"
  - "typescript"
  - "tips"
published: true
published_at: "2025-01-16 11:24"
---

## 結論：非破壊的メソッドの方が可読性やパフォーマンス面で推奨される
非破壊的な配列操作メソッドは、特定の配列操作を**非破壊的に行うために特化して設計されたメソッド**となります。メソッド自体が新しい配列を生成し、元の配列は変更しません。

後者はシャローコピーと同じですが「非破壊的に行うために特化して設計されたメソッド」という点が大きな違いですね。つまり、非破壊的な配列操作メソッドは「内部で最適化された1つの処理として実行される」のでパフォーマンス面で優位に立ちそうです。

しかし、この辺りは各ブラウザや実際に処理させる規模感でも変わってくるようです。

筆者がこれから例示するような簡潔な処理の場合は顕著な違いは生まれないと思いますが、複雑だったり、記述量が増えてきたり、規模感が大きくなったりすると差異が出てくるかもしれません。

パフォーマンス面では上記のような感じですが、コードの可読性という面では非破壊的な配列操作メソッドの方が意図が明確で分かりやすいと思います。

ほんのちょっとしたことな気もしますが、シャローコピーの場合は「コピーを作成する意図」なのか「非破壊的な操作を行う意図」なのかが**その後の操作（記述）を見ないと判断できない**かなと。

他方、非破壊的な配列操作メソッドは、その処理や挙動を知っている方から見ると意図が明確となります。

## サンプル例
タイトルにある通りのことが気になって軽く調査＆検証してみました。
具体的な例としては以下のようなことで処理結果に違いはありません。

```js
const ary = [1, 2, 3, 4, 5];

// ソース元配列（ary）をシャローコピーして反転
const copiedAry = [...ary].reverse();

// ES2023で追加された非破壊的メソッド（toReversed）で反転
const nonBreak_ary = ary.toReversed();

console.log(ary, copiedAry, nonBreak_ary);
/*
[1,2,3,4,5] // ary
[5,4,3,2,1] // copiedAry
[5,4,3,2,1] // nonBreak_ary
*/
```

::: message
- 破壊的・非破壊的について
もし、配列操作の破壊的・非破壊的がイメージ付きづらい方は上記のシャローコピーを使った記述箇所を以下のように変更して実行してみてください。

```diff
- const copiedAry = [...ary].reverse();
+ const copiedAry = ary.reverse();
```

ログ出力の結果が以下のように変わるはずです。
```js
[5,4,3,2,1]
[5,4,3,2,1]
[1,2,3,4,5]
```

`reverse`による破壊的な変更によってソース元配列（`ary`）の中身も変わって（反転されて）しまっています。
:::

## ES2023で新規追加された非破壊的な配列操作メソッド
例示で使った`toReversed`以外には、以下の非破壊的な配列操作メソッドがあります。

```js
// toSorted(): 並び替え
const arr1 = [3, 1, 2];
const sorted = arr1.toSorted();  // [1, 2, 3]

// toSpliced(): 要素の削除・置換
const arr3 = [1, 2, 3, 4];
const spliced = arr3.toSpliced(1, 2, 'a');  // [1, 'a', 4]

// with(): インデックスを指定して要素を置換
const arr4 = [1, 2, 3];
const modified = arr4.with(1, 'new');  // [1, 'new', 3]
```

## オブジェクトを対象にした場合の注意事項
注意点として、非破壊的な配列操作メソッドは**内部的にシャローコピーを行います**。
そのため、配列の要素がオブジェクトのように参照型の場合、**新しい配列でも元の配列と要素の参照が共有**されます。
この結果、**新しい配列で要素の内容を変更するとソース元配列（オブジェクト）にもその変更が反映される**ことがあります。

```js
const originalArray = [
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
  { id: 3, value: 'C' }
];

// toReversed() で非破壊的に反転
const reversedArray = originalArray.toReversed();

console.log(originalArray, reversedArray);
/* originalArray */
// 0: {id: 1, value: 'A'}
// 1: {id: 2, value: 'B'}
// 2: {id: 3, value: 'C'}
// length: 3

/* reversedArray */
// 0: {id: 3, value: 'C'}
// 1: {id: 2, value: 'B'}
// 2: {id: 1, value: 'A'}
// length: 3
```

上記でログを確認後に以下を実行してみると……。

```js
// reversedArray の最初のオブジェクトを変更
reversedArray[0].value = 'X';

/* reversedArray */
console.log("reversedArray:", reversedArray);
// 0: {id: 3, value: 'X'}
// 1: {id: 2, value: 'B'}
// 2: {id: 1, value: 'A'}
// length: 3

/* originalArray（同じ参照を持っている要素が変更）*/
console.log("originalArray:", originalArray);
// 0: {id: 1, value: 'A'}
// 1: {id: 2, value: 'B'}
// 2: {id: 3, value: 'X'} // 同じ参照を持っている要素が変更されている（＝元の配列が変更されている）
// length: 3
```

## 参考

https://future-architect.github.io/articles/20241205a/