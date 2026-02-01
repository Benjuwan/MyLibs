---
title: フロントエンド側の人間が 1からPythonを学んでみて⑤ ～ループ処理・条件分岐編～
tags: Python 業務効率化 初心者向け 条件分岐 ループ処理
author: benjuwan
slide: false
---
これは、筆者の「2025振り返り用ひとりアドカレ」記事の一つです。

## はじめに
本記事は普段 React, Next.jsなどを使う筆者が2025年に**業務効率化を絶対目標**としてPython学習したことに際し、「フロントエンド側の人間が 1からPythonを学んでみて」というテーマで書いていくシリーズ記事の一つです。

### 対象読者
- 業務効率化を願うビジネスパーソン
- バックエンド側に興味があるフロントエンド側の方々
- バックエンド側とフロントエンド側の言語における違いや共通性が知りたい方々
- Pythonを学び始めた方々
- Pythonを学ぼうとしているフロントエンドエンジニアの方々

::: note
**わざわざ学ばなくても、AI（LLM）に任せれば良くね？**

筆者がPython学習のモチベーションとしたのは「**業務効率化を絶対目標**」とすることです。

正直これはAIで簡単に行える世界になりつつありますが、筆者はAIの成果物を正しく活用するには**チェックできるだけの基礎力が大事**だと思っています。

そのため遠回りに見えつつもPythonを体系的にじっくり学んでいくルートを選びました。
:::

## イテレーション（繰り返し・ループ処理）
### `for 変数 in イテラブル:`
```py
# リストの要素を直接繰り返し
for element in array:
    print(element)

# 数値範囲での繰り返し
for i in range(len(array)):
    print(array[i])
```

### インデックスと要素の両方を使う場合
#### `enumerate(イテラブル, 開始値):` （イニュームレイト）
イテラブルから要素を取り出す時に何番目の要素なのかを把握できるようになる繰り返し処理で、戻り値は **`カウント`と`要素の値`のタプル`tuple()`** となる。

※**第二引数の`開始値`は省略可**

```py
# ※第二引数の`開始値`は省略可
for i, elm in enumerate(イテラブル, 開始値):
    # 処理
```
第二引数の`開始値`はカウントの開始値を指す。

- 具体例
```py
# 各要素とそのインデックスをペアとして返す
for i, element in enumerate(array):
    print(f"No.{i}: タイトル：{element}")
```

### `while 条件式:`
他の言語と同様の（繰り返し処理）機能。
指定した条件を達するまで繰り返し処理を行う。

```py
index_key_while = 0

# index_key_while が 10になるまで 1ずつインクリメント
while index_key_while < 10:
    index_key_while += 1
    print(index_key_while)
```

### `continue`と`break`
#### `continue`
他の言語と同様、`for`や`while`の繰り返し処理におけるスキップ機能。
ループ内部に残っている処理を**実行せずに次の処理に移行**する。

#### `break`
他の言語と同様、`for`や`while`の繰り返し処理における強制終了機能。
ループ内部に残っている処理を**実行せずに当該繰り返し処理を終了**する。

---

### イテラブルに関する関数
※筆者の独断と偏見でよく利用する関数には<font color="red">★</font>マークを付けています。

#### `zip`
複数のイテラブルに対して同時に繰り返し処理を行いたい場合に便利な関数。
引数に指定された複数のイテラブルから要素を集めて**タプルにまとめて返す**。

```py
food_name = ["burger", "potato", "snack"]
food_price = [110, 150, 120]

# zip(イテラブル, ...)
for food in zip(food_name, food_price):
    print(f"{food[0]} is {food[1]} yen.")
    # burger is 110 yen.
    # potato is 150 yen.
    # snack is 120 yen.

for n, p in zip(food_name, food_price):
    print(f"{n} is {p} yen.")
    # burger is 110 yen.
    # potato is 150 yen.
    # snack is 120 yen.
```

##### `zip`関数を用いた柔軟なイテラブル（リスト）生成
```py
food_name = ["burger", "potato", "snack"]
food_price = [110, 150, 120]

print(list(zip(food_name, food_price)))
# [('burger', 110), ('potato', 150), ('snack', 120)]
```

#### <font color="red">★</font> `map`
JavaScript と挙動は似ており「指定した処理（条件）で加工した（イテラブル内の）各要素」のイテレータオブジェクトを返します。
```py
map(関数, イテラブル)
```

- `map`関数のコード例
```py
food_name = ["burger", "potato", "snack"]
food_price = [90, 150, 120]

print(list(map(len, food_name)))
# [6, 6, 5]

# 数値型リストを文字列型リストへ変換し、上記と同じく各要素の文字列数を取得する
convert_str_list = list(map(str, food_price))
print(list(map(len, convert_str_list)))
# [2, 3, 3]
```

#### <font color="red">★</font> `filter`
JavaScript と挙動は似ており「指定した条件に合致する（イテラブル内の）各要素」のイテレータオブジェクトを返します。
```py
filter(関数, イテラブル)
```

- `filter`関数のコード例
```py
fruits = ["apple", "", "grape", "melon", "", "", "water-melon"]
print(len(fruits)) # 7

# len が 0以外（以上）のものが True 判定される
print(list(filter(len, fruits)))
# ['apple', 'grape', 'melon', 'water-melon']

print(len(list(filter(len, fruits)))) # 4
```

#### `all`
JavaScript でいう`every`にあたる。
イテラブルの全ての要素が（指定した条件に）`True`の場合は`True`を返す。

```py
person_a_score = [90, 75, 88, 100, 82]
person_b_score = [90, 85, 98, 100, 96]

# 全てが80以上
print(all(score > 80 for score in person_a_score)) # False
print(all(score > 80 for score in person_b_score)) # True
```

- JavaScript での実装イメージ
```js
const person_a_score = [90, 75, 88, 100, 82];
const person_b_score = [90, 85, 98, 100, 96];

const all_method = (targetAry)=>{
    const result = targetAry.every(elm => elm > 80);
    console.log(`${result}：全てが80以上`);
}
all_method(person_a_score);
all_method(person_b_score);
```

#### `any`
JavaScript でいう`some`にあたる。
どれか一つでも（指定した条件に）`True`の場合は`True`を返す。

```py
person_a_score= [90, 75, 88, 100, 82]
person_b_score = [90, 85, 98, 100, 96]

# どれか一つでも80未満
print(any(score < 80 for score in person_a_score))  # True
print(any(score < 80 for score in person_b_score))  # False
```

- JavaScript での実装イメージ
```js
const person_a_score = [90, 75, 88, 100, 82];
const person_b_score = [90, 85, 98, 100, 96];

const any_method = (targetAry)=>{
    const result = targetAry.some(elm => elm < 80);
    console.log(`${result}：どれか一つでも80未満`);
}
any_method(person_a_score);
any_method(person_b_score);
```

## 条件文
他の言語同様 Python にも条件分岐処理があります。

::: note info
- 真偽値について
JavaScript では`true`, `false`ですが、Python では`True`, `False`というように頭文字が大文字なので混同しないように注意してください。
:::

### `if 条件式:`
```py
isBool: bool = True

if isBool:
    # True 判定の処理
```

#### 否定形
Pythonでは`!変数`や`!==`といったような記述方法はなく、`not (条件式)`という直感的に分かりやすい書き方をします。

```py
isBool: bool = True

# `not (条件式)`で否定形（JavaScript でいう`!isBool`）
if not (isBool):
    # False 判定の処理
```

#### 複数条件
```py
# A かつ B かつ C
if(A and B and C):

# A または B または C
if(A or B or C):

elif 別の条件:
    # ※JavaScript でいう else if
    # 別の条件が True 判定の処理

else:
    # ※JavaScript と同じ
    # どの条件にも合致しなかった場合の処理
```

- TypeScript（JavaScript）での実装イメージ
```js
const isBool: boolean = true;

if(isBool) {
  // True 判定の処理
}

/* 否定形 */
if(!isBool) {
  // False 判定の処理
}

/* 複数条件 */
// A かつ B かつ C
if(A && B && C)

// A または B または C
if(A || B || C)

else if(別の条件) {
  // 別の条件が True 判定の処理
}

else {
  // どの条件にも合致しなかった場合の処理
}
```

::: note info
#### 数値型の真偽値判定に注意
0は`False`、（負の値含む）0以外は`True`という判定になる
:::

### 三項演算子（条件式）
JavaScript のように`条件 ? trueの値 : falseの値`という書き方とは大きく異なり、Python では以下のように`Trueの値 if 条件 else Falseの値`という書き方になります。

```py
# Trueの値 if 条件 else Falseの値
result = "passed" if score >= 60 else "failed"
```

### `AND演算子`と`OR演算子`
先ほどの`if`文で出ていましたが、Python での`AND演算子`は`&&`ではなく`and`、`OR演算子`は`||`ではなく`or`と記述します。

::: note info
**`OR演算子`よりも`AND演算子`の方が演算子の優先順位が高い**ので、両方を一度の処理に含む場合は注意
:::

```py
target_int = 10

# AND演算子
# 左辺が True の場合に右辺を返す ※False の場合は左辺の結果（False）を返す
target_int > 0 and f"{target_int}は0以上の数値"

# OR演算子
# 左辺が False の場合に右辺を返す ※True の場合は左辺の結果（True）を返す
target_int < 0 or f"{target_int}は0以上の数値"
```

### 厳密等価演算子（※Pythonには存在しない）
Python には、厳密等価演算子（`===`, `!==`）はありません。
Python で値の比較は `==`（等価）と `!=`（非等価）を使います。

他方、Python には `is` / `is not`という書き方があります。
しかしこれは**オブジェクトが同一かどうかを比較する演算子**で、値の比較には使用しません（つまり結局は JavaScript の`===`の代わりにはならない）。

また、`isinstance(オブジェクト, クラス)`で判定する方法も一般的です。
```py
print(isinstance(123, int))     # True
print(isinstance("123", int))   # False
print(isinstance("123", str))   # True
print(isinstance(3.14, float))  # True
```

より厳密に判定したい場合は`type(変数a) == type(変数b)`, `type(変数a) != type(変数b)`のように記述することもできます。

```py
# 事例 1
# True: int と float でも値が等しいため
print(1 == 1.0)
# False: 'is' はオブジェクトの同一性を比較するため
print(1 is 1.0)

# 事例 2
a = 100    # int
b = 100.0  # float

if type(a) == type(b) and a == b:
    print("型も値も一致しています")
else:
    print("型または値が一致しません")
```

::: note info
Pythonの`==`演算子は、異なる型同士でも値の等価性を柔軟に判定します。

例えば`1 == 1.0`は`True`になります（`int`：数値型と`float`：浮動小数点数型で数値として等しい場合）。
一方、`"1" == 1`は`False`です（文字列と数値は比較できません）。

厳密に型まで確認したい場合は、`isinstance()`や`type()`を使用しましょう。
:::

### `in`演算子
`in`は`所属検査演算（メンバーシップテスト演算）`です。これは、指定した値が含まれているか瞬時に判定する演算処理となります。

```py
traffic_signal = {"green", "red", "blue"}

print(f"{'green' in traffic_signal} # True")
print(f"{'pink' in traffic_signal} # False")
print(f"{'purple' not in traffic_signal} # True")
print(f"{'red' not in traffic_signal} # False")
```

#### `in`演算子, `not in`演算子は各種データ構造（リスト、タプル、集合、辞書）のほか、文字列にも使用可能
```py
# in演算子： 値が含まれていることを判定
値 in イテラブルまたは文字列

# not in演算子： 値が含まれていないことを判定
値 not in イテラブルまたは文字列
```

- 文字列での検証例
```py
message = "Hello, Python!"

print("Python" in message)      # True
print("Java" in message)        # False
print("hello" in message)       # False（大文字小文字を区別）
print("Hello" not in message)   # False
```

::: note info
ハッシュ法のおかげで**集合と辞書は特に`in`と`not in`を高速に実行**できます
:::

## さいごに
本記事ではPythonにおけるイテレーション（ループ処理）と条件分岐に触れてきました。
これを理解することで実装できる範囲が大きく広がるはずです。

次の記事では、内包表記 / ラムダ関数など Python 独自の機能などを紹介していきたいと思います。

ここまで読んでいただき、ありがとうございました。

