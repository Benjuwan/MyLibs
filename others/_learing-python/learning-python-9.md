---
title: フロントエンド側の人間が 1からPythonを学んでみて⑨ ～便利なメソッド・関数の紹介編～
tags: Python 業務効率化 初心者向け
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

本記事では、基礎的なものをはじめ、知っておくと便利な組み込み関数・メソッドを紹介していきます。
※本記事は「すべてを覚える」ためではなく、「Pythonで何ができるかの地図を作る」ことを目的としています。

## 他の言語でもよく見る基礎的なメソッド
### 文字列関連（`str`）
#### `split()`
JavaScript と同じ挙動で、引数に指定した文字列で分割する（※何も指定しない場合、文字列に半角スペースがあればそこで区切られる）。戻り値は常にリスト型となる。

```py
text = "apple banana cherry"
words = text.split()
print(words)  
# ["apple", "banana", "cherry"]

# 指定したデリミタ（区切り文字）で分割も可能
url = "sports/football/fw"
url_paths = url.split('/')
print(url_paths)  
# ["sports", "football", "fw"]
```

#### `join(イテラブル)`
指定したデリミタ（区切り文字）でリストを結合して文字列を返す。
※挙動としては JavaScript と同じだが記述方法が異なるので注意。

```py
url_paths = ["sports", "football", "fw"]

# デリミタ.join(イテラブル)
url = "/".join(url_paths)
print(url)
```

#### `replace()`
文字列内の特定の部分（文字列）を指定した別の文字列で置換する。

```py
# 第一引数には置換対象の文字列（target）を、
# 第二引数には変更文字列（src）を、
# 第三引数には置換個数の上限（count）を、
# それぞれダブルクォーテーションで囲って指定する
str.replace(target, src, count)
```

- 具体例
```py
anaconda = "anaconda"

# すべて置換
print(anaconda.replace("a", "A"))
# AnAcondA

# 初めの一つだけ置換
print(anaconda.replace("a", "A", 1))
# Anaconda

# 2つ目まで置換
print(anaconda.replace("a", "A", 2))
# AnAconda
```

#### `startswith`, `endswith`
開始（先頭）文字列と終了（末尾）文字列が引数に指定した文字列と合致するか検証し、その真偽値を返す。

- `startswith`
「開始（先頭）文字列」が引数に指定した文字列と合致するか検証

- `endswith`
「終了（末尾）文字列」が引数に指定した文字列と合致するか検証

```py
# 先頭が指定した接頭辞から始まる場合は True を返す
文字列.startswith(接頭辞の文字列)

# 末尾が指定した接尾辞で終わる場合は True を返す
文字列.endswith(接尾辞の文字列)
```

`startswith`, `endswith`ともに引数には**タプル形式で複数値を指定できる**
```py
url = "https://example.co.jp"
if url.startswith(("https://", "http://", "/")):
    # True の場合の処理
```

#### `count`
対象要素（文字列やリスト、タプル）における検索文字列の出現回数を取得する。

```py
search_str: str = '検索文字列'
target_str_ary.count(search_str)
```

### 数値関連（`int`：数値型 / `float`：浮動小数点数型）
#### `isnumeric()`
文字列が数字だけで構成されているかどうかを調べて、その真偽値を返す。

```py
文字列.isnumeric()
```

#### `range()`
引数に指定した数字と範囲に応じた処理を行う。

- `range(終了値)`
```py
# 0〜9まで格納された list生成
print(list(range(10)))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

- `range(開始値, 終了値)`
```py
# 20〜30まで格納された list生成
print(list(range(20, 31)))
# [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
```

- `range(開始値, 終了値, ステップ)`
第三引数の`ステップ`には負の整数も指定可能
```py
# 20〜30までの5の倍数（5刻み）のものが格納された list生成
print(list(range(20, 31, 5)))
# [20, 25, 30]
```

### 汎用系
#### `index`
指定した値に一致する要素のうち最も先頭に近い要素のインデックスが取得できる。
第二引数と第三引数を指定して検索範囲を設けることも可能。
JavaScript でいう`indexOf`メソッドに近い。

※値が見つからない場合は`ValueError`例外が発生します

```py
# index(値, 開始インデックス, 終了インデックス)

target_lists = ['hoge', 'foo', 'bar', 'piyo']
target_lists.index('bar') # 2
```

::: note info
- JavaScriptにおける`index`と近しい挙動のメソッド
  - `indexOf`メソッド
  ```js
  const lists = ['hoge', 'foo', 'bar', 'piyo'];
  lists.indexOf('bar'); // 2
  ```
  - `findIndex`メソッド
  配列内の指定された条件（テスト関数`hasTargetStr`）に合格する **最初の要素のインデックス** を返す。（テスト関数`hasTargetStr`に）合格する要素がなかった場合は`-1`を返す。
  ```js
  const lists = ['hoge', 'foo', 'bar', 'piyo'];
  const hasTargetStr = (word) => word === 'bar';
  console.log(lists.findIndex(hasTargetStr)); // 2
  ```
:::

## メソッドでも関数でもないが知っておくと便利な`pass`文
### `pass`文
処理をパスする（何もしない）ための構文です。
関数やクラス作成時に「何もしない処理や挙動が発生」したものの、構文ルール的に何かしらを記述しなければならない場合に`pass`文を使用します。
または、後で処理を書くことを意図して、とりあえず`pass`を置いておくようなプレースホルダー的な使い方もあります。

```py
for i in range(10000):
  # ここに何らかを記述しなければならないが、特に記述することが無い場合は pass を用いる
  pass
```

## ビルトイン関数（組み込み関数）
### `type`
JavaScriptでいう[`typeof`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof)に近い挙動で、引数に指定したオブジェクトの型を表示します。

```py
type(オブジェクト)
```

### `isinstance`
JavaScriptでいう[`instanceof`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/instanceof)（※左辺が右辺クラスのインスタンスかを判定する）に近い挙動で、引数に指定したオブジェクトが**特定のクラスかどうかをチェック**する。
```py
# isinstance(オブジェクト, クラス)
print(isinstance(123, int))     # True
print(isinstance("123", int))   # False
print(isinstance("123", str))   # True
print(isinstance(3.14, float))  # True
```

::: note info
- **`issubclass`関数**
あるクラスの派生クラス（サブクラス）かどうかをチェックする
```py
issubclass(クラスA, クラスB)
# クラスA が クラスB のサブクラスであるかどうかをチェックし、
# True の場合は True、False の場合は False となる。
```
:::

#### `sorted(イテラブル)`
指定したイテラブルに対してソート（並び替え）処理を行う。

```py
some_numbers = [100, 10, 25, 8, 64]

# [8, 10, 25, 64, 100]
print(sorted(some_numbers))

# [100, 64, 25, 10, 8]
print(sorted(some_numbers, reverse=True))
```

##### `sorted`に指定する引数について
- `reverse`：`True`にすることで反転
- `key`： **ソート基準（値）** となる`関数`を指定できる。Pythonは（シーケンスの）各要素に対して指定された関数を適用し、その結果をソートの基準として使用する。デフォルトのソートは「シーケンス間で対応する要素同士を前から順次比較（小さい方を前に）する」という方法。

::: note info
- シーケンス
文字列やリストなどインデックスで要素の位置を指定（＝指定したインデックスで要素を取得）できるオブジェクトのこと
:::

###### `key`引数について
`key`引数に渡す関数は**引数を明示的に指定する必要はありません**。
注意事項として**常に一つの要素だけを関数に渡すので直接的に複数引数を持つ関数には使えません**。

```py
target_sort_tuple_list = [("burger", 110, 234), ("potato", 150, 226), ("shake", 120, 218)]

# price でソート
# `key`は一つの要素だけを関数に渡す。以下の場合は`item[1]`（110, 150, 120 が該当）
print(sorted(target_sort_tuple_list, key=lambda item: item[1]))
# [('burger', 110, 234), ('shake', 120, 218), ('potato', 150, 226)]

# 上記 lambda式 を関数定義で実行
def price_sort(item):
    return item[1]

# key の関数には引数を明示的に指定しない
print(sorted(target_sort_tuple_list, key=price_sort))
# [('burger', 110, 234), ('shake', 120, 218), ('potato', 150, 226)]
```

::: note info
- **`リスト.sort()`**：メソッド
`sort()`メソッドも機能としては`sorted(イテラブル)`関数と全く同じで、指定できる引数の`reverse`と`key`も同じ働きをします。
違いとしては`リスト.sort()`の場合は**リスト専用**であり、**元リストを並び替える破壊的処理**である点です。
:::

### `format`関数
指定された書式指定に従って値を整形し、結果の文字列を返す関数です。

https://docs.python.org/ja/3.13/library/string.html#formatspec

- 具体例
```py
float_elm = 1 / 3
print(format(float_elm))
# 0.3333333333333333

# .小数点以下桁数f
print(format(float_elm, ".2f"))  # 小数点以下2桁を表示
# 0.33

# {式:書式指定}
print(f"{1 / 3:.2f}")
# 0.33

# 千の位ごとに ,を挿入
print(format(100000000000000000, ","))
# 100,000,000,000,000,000

# 千の位ごとに _を挿入
print(format(100000000000000000, "_"))
# 100_000_000_000_000_000
```

::: note info
- Pythonにおける文字揃えのデフォルト設定
    - 文字列（`str`）：左揃え
    - 数値（`int`, `float`）：右揃え
:::

#### 桁数の調整
```py
# 基本的な使い方
number = 5
print(f"{number:2d}")  # " 5" （幅2文字で右寄せ）
# : - フォーマット指定の開始
# 2 - 表示する幅（文字数）
# d - 整数（decimal）として表示

# 実際の動作を確認
numbers = [1, 5, 10, 42]
for n in numbers:
    # それぞれの数字が2文字分の幅で右寄せされる
    print(f"{n:2d}")

# その他
# 左寄せ（<）
print(f"{5:<2d}")  # "5 "

# 中央寄せ（^）
print(f"{5:^3d}")  # " 5 "

# ゼロ埋め
print(f"{5:02d}")  # "05"

# より大きな幅を指定
print(f"{5:4d}")   # "   5"

# {式:書式指定} という記述も可能
print(f"{1 / 3:.2f}") # 0.33
```

- `.小数点以下桁数f`の記法はJavaScriptで言えば[`toFixed()`メソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)にあたる
```js
function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}
console.log(financial(123.456)); // "123.46"
```

### 【<font color="red">使用は慎重に！</font>】文字列をPython式に評価する`eval`関数

::: note alert
ユーザー入力に対して使用する場合、悪意あるプログラム実行のセキュリティリスクがありますので使用は慎重に検討するとともに注意してください。
:::

JavaScriptの[`eval`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/eval)と同じです。
指定された文字列を Python 式として評価し、その式の値を返します。
例えば、ユーザーが入力した Python 式を評価して結果の値を求める、などが行えます。

```py
while True:
    # list('python') と入力すると...
    result = eval(input("="))
    if result == "q":
        break
    print(result)
    # ['p', 'y', 't', 'h', 'o', 'n']
```

### 【<font color="red">使用は慎重に！</font>】プログラムを実行する`exec`関数

::: note alert
ユーザー入力に対して使用する場合、悪意あるプログラム実行のセキュリティリスクがありますので使用は慎重に検討するとともに注意してください。
:::

指定された文字列を Python プログラムとして実行します。戻り値はなし（`None`）。
```py
exec(文字列)
```

`compile`関数を使って **Pythonプログラムをコンパイルして生成される「コードオブジェクト」** も扱えます。
```py
exec(コードオブジェクト)
```

#### 【<font color="red">使用は慎重に！</font>】プログラムをコンパイルする`compile`関数
指定された文字列やファイルの内容を Python プログラムとしてコンパイルしてコードオブジェクトを返します。
返ってきたコードオブジェクトは`exec`関数で実行可能です。

```py
compile(文字列, '<string>', 'exec')
```

### `ascii`
オブジェクトの内容を表す文字列を返す関数で、**ASCII文字（アスキー文字）以外をエスケープ処理**してくれる。
```py
ascii_no_esc = ascii("Python") # 'Python'
print(ascii_no_esc)
ascii_esc = ascii("パイソン")   # '\u30d1\u30a4\u30bd\u30f3'
print(ascii_esc)
```

## さいごに
本記事ではPythonにおける便利なメソッド・関数を紹介してきました。

次の記事では、Pythonにおける便利なライブラリなどを紹介していきたいと思います。

ここまで読んでいただき、ありがとうございました。

