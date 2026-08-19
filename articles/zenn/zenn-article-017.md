---
title: "【JavaScript / TypeScript】Mapについてまとめてみる"
emoji: "🐥"
type: "tech"
topics:
  - "javascript"
  - "typescript"
published: true
published_at: "2025-02-05 22:57"
---

## はじめに
> MapはJavaScriptの組み込みAPIのひとつで、キーと値のペアを取り扱うためのオブジェクトです。Mapにはひとつのキーについてはひとつの値のみを格納できます。

https://typescriptbook.jp/reference/builtin-api/map

上記`Map`について、筆者はインプットしただけで全然使ったことがありませんでした。
つい最近はまっていた処理を`Map`によってスマートに解決できたので、自身の~~戒め~~備忘録としてまとめていきたいと思います。

::: message
先ほどの[Map<K, V> | サバイバルTypeScript](https://typescriptbook.jp/reference/builtin-api/map)の内容と重複している部分がありますが備忘録なので悪しからずご了承ください。
:::

## `Map`の基本概念
`JavaScript（TypeScript）`の`Map`は、`key（property）`と`value`のペアを保持するコレクション（`Python`でいえば`dict（辞書）`に近い概念）だそうです。

`key（property）`と`value`のペアと言うとオブジェクトを想起しそうですが、通常のオブジェクトとは違って**任意の型（オブジェクト、関数なども）を`key（property）`に使用**できます。

また、`key（property）`の順序が挿入順で保持されるのも特徴です。

```ts
// 新しいMap（空）の作成
const createMap: Map<any, any> = new Map();

// 新しいMap（文字列）の作成
const map_str_str: Map<string, string> = new Map([
    ['key1', 'value1']
]);

// 新しいMap（文字列と数値）の作成
const map_str_number: Map<string, number> = new Map([
    ['key1', 100]
]);

const hello: () => void = () => {
    console.log('hello');
}
// 新しいMap（文字列と関数）の作成
const map_hello: Map<string, () => void> = new Map([
    ['key1', hello]
]);
```

### 主要なメソッド
- `set`
値のセット
```ts
// 単一の値をセット
createMap.set('key1', 'value1');
```

- `get`
値の取得
```ts
// 'key1'の値：'value1'
console.log(createMap.get('key1'));
// 存在しないキー・プロパティの場合：undefined
console.log(createMap.get('noKey'));
```

- `has`
キー・プロパティの存在確認
```ts
// true
console.log(createMap.has('key1'));
// false
console.log(createMap.has('キー'));
```

- `delete`
値の削除
```ts
createMap.delete('key1');
```

- `size`
サイズ（配列でいう`length`）の取得
```ts
// 配列でいう length
console.log(createMap.size);

// しかし Map オブジェクトでは length で処理不可能なので注意
console.log(createMap.length); // ← これ無理
```

- `clear`
全ての値をクリア（配列でいう`splice(0)`）
```ts
createMap.clear();

// 配列でいう splice(0)
// const lists: string[] = ["beer", "wine", "whisky", "water", "soda"];
// lists.splice(0);
```

### 通常のオブジェクトとの違いや、イテレーション（反復処理）について
通常のオブジェクトとは違って**任意の型（オブジェクト、関数なども）を`key（property）`に使用**できます。と冒頭で説明した通り、`Map`では以下のような形式でも`key（property）`と`value`を用意できます。

```ts
const fruitMap: Map<string, number> = new Map([
    ['apple', 5],
    ['banana', 3],
    ['orange', 2]
]);
```
- イテレーション（反復処理）について
```ts
// キーと値の両方を取得（引数順序は`(value, key)`でなければならない）
// ※ Map.forEach() のコールバック関数は仕様により、
// 引数の順序が(value, key)となっているため 
fruitMap.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});

// キーのみを取得
for (const key of fruitMap.keys()) {
    console.log(key);
}

// 値のみを取得
for (const value of fruitMap.values()) {
    console.log(value);
}

// エントリー（[key, value]のペア）を取得
for (const [key, value] of fruitMap.entries()) {
    console.log(`${key}: ${value}`);
}

// または以下のように Mapオブジェクトのイテレータ にして処理を進める方法もある
const fruitMapIterator: MapIterator<[string, number]> = fruitMap[Symbol.iterator]();
for (const items of fruitMapIterator) {
  console.log(`${items[0]}: ${items[1]}`);
}
// 上記の出力部分を console.log(items); にすると以下結果
// > Array ["apple", 5]
// > Array ["banana", 3]
// > Array ["orange", 2]
```

### `Map`の利点
- パフォーマンス：大量のデータの追加/削除が頻繁な場合に優れています
- キーの型の柔軟性：任意の型をキーとして使用可能
- イテレーションが簡単：順序が保証され、様々な反復メソッドが利用可能

#### 利用例
- キーと値のペアを管理する必要がある場合
```ts
// 例：ユーザーIDと名前の管理
const userMap: Map<number, string> = new Map();
userMap.set(1, "John");
userMap.set(2, "Alice");
```

- 対象文字列における重複文字と重複回数のカウント
```ts
const charMap: Map<string, number> = new Map();
for (const char of "hello") {
    // 第二引数部分の処理： char がまだ存在しない（false の）場合は 0を指定し、
    // 既に存在する場合は取得した char の値（既存の値）に +1する
    charMap.set(char, (charMap.get(char) || 0) + 1);
}
console.log(charMap);
// Map { 'h' => 1, 'e' => 1, 'l' => 2, 'o' => 1 }
```

## さいごに
`Map`について知っているようで全然知らなかったと実感しました。無知の知。
やはり、インプットした後はしっかりアウトプットして（かつ**継続的に使用**して）自身の血肉にしていくしかないですね。

ここまで読んでいただき、ありがとうございました。
何かお気づきの点などありましたらご教授ください。