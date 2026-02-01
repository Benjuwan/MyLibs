---
title: フロントエンド側の人間が 1からPythonを学んでみて③ ～データ構造編～
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

## イテレータ
イテラブル（反復可能なオブジェクト・繰り返し可能要素）から、要素を一つずつ取得するためのオブジェクトをイテレータといいます。

これはPythonに限らず、多くの言語に備えられている機能・仕組み・概念です。

上記言葉だけでイメージしづらい人は「教室でのクラス点呼」を想像してください。
同一の処理（点呼）を各対象（生徒）に漏れなく行いますよね。
教室の全生徒への点呼が完了すればイテレーション（ループ処理・繰り返し処理）終了です。

このように「同一の処理を各対象に漏れなく行う」のは重要な仕組みなのですが、これを機能させるには「処理対象の作り方・構成・性質」などを理解していないと意図した挙動を実現できません。

つまり、目的に応じた適切なデータ構造を用いるのが大切ということです。

本記事では、イテレーションを実現する上で大事なPythonにおけるデータ構造を学んでいきます。

## リスト
リストは、最もベーシックで無難なミュータブルなデータ構造です。
JavaScript（TypeScript）でいう配列（例：`string[]`, `number[]`など）ですね。

```py
# 9までの list[int]（数値型リスト）を生成
print(list(range(10)))
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# または [] で要素を囲うことでもリストを作成可能
print([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### リストの特徴
- シーケンスなのでインデックスやスライスが扱える
- ミュータブルなので、要素の追加や削除が可能

::: note info
- **シーケンス**
文字列やリストなどインデックスで要素の位置を指定（＝指定したインデックスで要素を取得）できるオブジェクトのこと

- **ミュータブル**
再代入可能など自在に変化しうる性質を持つ── つまり「可変性」を指す。
対義語は**イミュータブル**で、こちらは再代入不可能な固定性質を持つ── つまり「不変性」を指す。
:::

#### `list()`関数に`辞書{dict}`を渡すと、デフォルトで`辞書`の`key`のイテレータを返す
```py
lang_dict = {"ja": "japanese", "en": "English", "fr": "french"}
print(list(lang_dict))
# ['ja', 'en', 'fr']
```

#### リストのコピー（シャローコピー）
JavaScriptのそれ同様、**破壊的処理によって元の配列（の中身）まで変わってしまう**ケースがあるので適宜シャローコピーを用いるのが重要です。

```py
# スライスメソッドを用いたシャローコピー
copied_lists = リスト変数[:]

# copy メソッドを用いたシャローコピー
copied_lists = リスト変数.copy()
```

::: note info
- **Pythonでのスライス**
JavaScriptの`slice(開始インデックス, 終了インデックス)`と異なり、Pythonでは`[開始インデックス:終了インデックス:ストライド]`という記述で配列のスライスを実現する。

```py
# 先頭から終了インデックスまで
# 終了インデックスに対応する要素は除外される（取り出されない）
文字列またはイテラブル[:終了インデックス]
 
# 開始インデックスから末尾まで
文字列またはイテラブル[開始インデックス:]
 
# 先頭から末尾まで
文字列またはイテラブル[:]

# （開始インデックスが負の値なので）末尾から先頭まで
# （例：最後の5つを取得）
文字列またはイテラブル[-5:] # 末尾-5から先頭まで
```
 
- **ストライドについて**
ステップとも呼ばれるオフセットのことで**要素を指定した個数ごとに取り出す**ための機能。
```py
# 1文字目から末尾まで 2ストライドごとに抽出
print("-W-E-L-C-O-M-E-"[1::2])
```

---

先ほどのコード内にコメントしましたが、**終了インデックスに対応する要素は除外される（取り出されない）** ので注意してください。

```py
text = "Hello"
numbers = [0, 1, 2, 3, 4]

# 先頭から終了インデックスまで
print(text[:3])      # "Hel" (インデックス0,1,2 → インデックス3は除外)
print(numbers[:3])   # [0, 1, 2] (インデックス3, 4の要素は除外)
```

:::

### リストでの要素の取り扱い
#### 要素の追加

```py
# append メソッド（破壊的処理）
リスト.append(値)

# 累算代入文（破壊的処理）
リスト変数 += イテラブル
# JavaScript でいうpushメソッドによる結合と近いニュアンス
# リスト.push(...イテラブル)

# extend メソッド（破壊的処理）
リスト.extend(イテラブル)

# スライス（破壊的処理）
リスト[len(リスト):] = イテラブル
```

#### 任意の箇所へ要素を追加
JavaScriptでいう[`splice`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)または[`with`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/with)メソッドに近いニュアンス

```py
# リストの途中に要素を挿入
リスト.insert(インデックス, 値)

# スライスを用いた指定箇所へのイテラブル挿入
リスト[開始インデックス:終了インデックス] = イテラブル

# 空リストを代入することで指定範囲の要素を削除可能
リスト[開始インデックス:終了インデックス] = []
```

#### リストの連結・結合
```py
# 新しい変数に代入する形
concat_lists = list_a + list_b

# JavaScript でいうスプレッド演算子での展開結合または、
# concat メソッドによる結合と近いニュアンス
# const concat_lists = [...list_a, ...list_b];
# list_a.concat(list_b)

# 既存のリストを更新する形（累算代入文）
list_a += list_b
```

#### リストの削除
```py
del リスト[インデックス]

リスト.pop(インデックス)
# JavaScript と違って引数にインデックス（数値型）を取る

リスト.remove(値)

# 指定した範囲の削除
# 終了インデックスに対応する要素は除外される（削除されない）ので注意
del リスト[開始インデックス:終了インデックス]

# 空リストを代入する方法
リスト[開始インデックス:終了インデックス] = []

# 全て削除
リスト.clear()

# .clear() は、JavaScript でいう splice(0) の挙動
# const lists: string[] = ["beer", "wine", "whisky", "water", "soda"];
# lists.splice(0);

# リストが変数に代入されている場合
# 空配列を代入することで全削除が可能
リスト変数 = []
```

::: note warn
`del リスト[開始インデックス:終了インデックス]`ですが、コードコメントにもあるように**終了インデックスに対応する要素は除外される（削除されない）ので注意**してください。
:::

## タプル
リストなど他のデータ構造と違って **「配列数が固定で、中身・要素（の型）は自由」** というイミュータブルなデータ構造です。

```py
# 9までの tuple[int, ...] を生成
tuple(range(10))

# または () で要素を囲うことでもタプルを作成可能
theTuple = ("Alice", 24, "tokyo", 23.5)

# 要素が一つの場合
# タプルと認識してもらうには末尾に , が必要
theSingleTuple = ("Alice", )
```

### タプルの特徴
- シーケンスなのでインデックスやスライスが扱える
- **イミュータブルなので要素の変更や追加、削除といった編集操作は受け付けない**

## 集合
数学の集合論をベースにした「重複のない要素のコレクション」となります。これは JavaScript でいう、値の集合である`Set`オブジェクトにあたります。

```py
# 9までの set[int] を生成
print(set(range(10)))
# {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}

# または {} で要素を囲うことでも集合を作成可能
numbers_set = {1, 2, 2, 3, 3, 4}  # {1, 2, 3, 4}
numbers = {1, 2, 2}  # {1, 2}
number = {1}  # {1}
print(numbers_set, numbers, number)

# 集合の重要な特徴として「値を取り出すときの順序が保証されない」というものがある
trafic_signal = {"green", "red", "blue"}
print(trafic_signal) # {'green', 'blue', 'red'}
```

### 集合の特徴
- ミュータブルなので、要素の追加や削除が可能
- 同じ値を重複して保存（格納）できない
- **値を取り出す時の順序が保証されない**（例：出力する度に並び順が変わる）
- **イミュータブルな値のみ格納可能**（※厳密にはハッシュが計算できる値のみ格納可能）
- 指定した値が含まれているか瞬時に判定できる

::: note info

- **`list`はミュータブルなので`{集合}`には格納不可能**
```py
# リストはミュータブル（ハッシュ法で計算できない性質）なので格納不可
theSet = {["bar", "red", "blue", "green", "piyo"]}

print(theSet)
# TypeError: unhashable type: 'list'
```

:::

### 集合での要素の取り扱い
#### `add`
※リストと異なり`append`ではなく`add`を使用する。

```py
集合.add(値)
# the_set.add("hoge")

# 累算代入文で追加
集合 |= {値, ...}
# the_set |= {"foo", "bar"}
```

#### `remove`
要素を削除する。指定した値が当該集合に含まれていない場合は`KeyError`という例外が発生する。

```py
集合.remove(値)

# 累算代入文で削除
集合 -= {値, ...}
```

#### `discard`
要素を削除する。指定した値が当該集合に含まれていない場合は何もしない。

```py
集合.discard(値)
```

#### `pop`
任意の一要素を取り出して削除する（※順序は保証されない）。

```py
集合.pop()
```

#### `clear`
全ての要素を削除

```py
集合.clear()
```

### 複数要素をまとめて編集（追加・削除）する集合に特有の演算
#### 複数の集合から新しい集合を作成
##### `集合A | 集合B`：
集合A または集合B に含まれる要素の集合（和集合）

##### `集合A & 集合B`：
集合A かつ集合B に含まれる要素の集合（積集合）

##### `集合A - 集合B`：
集合A から集合B に含まれる要素を削除した集合（差集合）

##### `集合A ^ 集合B`：
集合A または集合B の片方だけに含まれる要素の集合（対称差）

- コード実行例
```py
trafic_signal = {"red", "blue", "green"}

copied_trafic_signal_a = trafic_signal.copy() | {"bar", "piyo"}
copied_trafic_signal_b = trafic_signal.copy() | {"hoge", "foo"}

print(f"{copied_trafic_signal_a}\n{copied_trafic_signal_b}\n")
# {'bar', 'red', 'blue', 'green', 'piyo'}
# {'red', 'blue', 'foo', 'green', 'hoge'}

print(f"| {copied_trafic_signal_a | copied_trafic_signal_b}")
# | {'piyo', 'green', 'red', 'hoge', 'foo', 'blue', 'bar'}

print(f"& {copied_trafic_signal_a & copied_trafic_signal_b}")
# & {'red', 'green', 'blue'}

print(f"a-b {copied_trafic_signal_a - copied_trafic_signal_b}")
# a-b {'bar', 'piyo'}

print(f"b-a {copied_trafic_signal_b - copied_trafic_signal_a}")
# b-a {'hoge', 'foo'}

print(f"b-b {copied_trafic_signal_b - copied_trafic_signal_b}")
# b-b set()

print(f"^ {copied_trafic_signal_a ^ copied_trafic_signal_b}")
# ^ {'hoge', 'foo', 'piyo', 'bar'}
```

#### 累算代入文：集合によって左辺（集合A）の既存内容を編集
##### `集合A |= 集合B`：
集合A に集合B の要素を追加（和集合の操作）

##### `集合A &= 集合B`：
集合A に集合B との共通要素のみを残す（積集合の操作）

##### `集合A -= 集合B`：
集合A から集合B に含まれる要素を削除

##### `集合A ^= 集合B`：
集合A に集合B の要素を追加し、共通要素を削除（対称差の操作）

- コード実行例
```py
print(f"{copied_trafic_signal_a}\n{copied_trafic_signal_b}\n")
# {'bar', 'red', 'blue', 'green', 'piyo'}
# {'red', 'blue', 'foo', 'green', 'hoge'}

copied_trafic_signal_a |= copied_trafic_signal_b
print(f"|= {copied_trafic_signal_a}")
# {'foo', 'piyo', 'blue', 'red', 'green', 'hoge', 'bar'}

copied_trafic_signal_a &= copied_trafic_signal_b
print(f"&= {copied_trafic_signal_a}")
# {'blue', 'green', 'red'}

copied_trafic_signal_a -= copied_trafic_signal_b
print(f"-= {copied_trafic_signal_a}")
# {'bar', 'piyo'}

copied_trafic_signal_b -= copied_trafic_signal_a
print(f"-= {copied_trafic_signal_b}")
# {'foo', 'hoge'}

copied_trafic_signal_a ^= copied_trafic_signal_b
print(f"^= {copied_trafic_signal_a}")
# {'bar', 'foo', 'piyo', 'hoge'}
```

::: note info

**`frozenset()`関数**

ミュータブルな集合を生成する`set()`とは異なり、`frozenset()`は**イミュータブルな集合（オブジェクト）を生成**する。

用途としては「集合を（イミュータブルな値しか格納できない）集合に格納」する場合や「集合を（イミュータブルなキーしか指定できない）辞書のキーに使用」する場合など

:::

## 辞書
「キーと値のペアを格納するコレクション」となります。これは JavaScript でいう、オブジェクトに近い存在です。

```py
# {'key': 'value'} という dict[str, str] を生成
dict({"key": "value"})

for i in range(10):
    theDict: dict[str, str] = {f"key-{i}": f"value-{i}"}
    print(theDict)
  
# {'key-0': 'value-0'}
# {'key-1': 'value-1'}
# {'key-2': 'value-2'}
# {'key-3': 'value-3'}
# {'key-4': 'value-4'}
# {'key-5': 'value-5'}
# {'key-6': 'value-6'}
# {'key-7': 'value-7'}
# {'key-8': 'value-8'}
# {'key-9': 'value-9'}
```

### 辞書の特徴
- ミュータブルなので、要素の追加や削除が可能
- 同じキーを重複して格納できない（※値は重複してもよい）
    - 指定したキーが既にある場合は、**そのキーに対応する値が書き換え**られる。指定したキーが含まれていない場合は、**キーと値の組が新たに追加**される
- **イミュータブルなキーのみ**格納できる（※値はミュータブルでもよい）
- キーを取り出す時の順序はキーの格納順となる

### 辞書の生成と各種データ構造からの変換
```py
# 辞書の生成
lang_dict = {"ja": "japanese", "en": "English", "fr": "french"}

# または以下で辞書を作成
# lang_dict = dict(ja="japanese", en="English", fr="french")
```

#### リスト -> 辞書
```py
created_dict_target_List = [("green", "hoge"), ("red", "foo")]
created_dict_List = dict(created_dict_target_List)
print(created_dict_List)
# {'green': 'hoge', 'red': 'foo'}
```

#### タプル -> 辞書
```py
created_dict_target_Tuple = (["green", "hoge"], ["red", "foo"])
created_dict_Tuple = dict(created_dict_target_Tuple)
print(created_dict_Tuple)
# {'green': 'hoge', 'red': 'foo'}
```

#### 集合 -> 辞書
```py
created_dict_target_Set = {("green", "hoge"), ("red", "foo")}
created_dict_Set = dict(created_dict_target_Set)
print(created_dict_Set)
# {'red': 'foo', 'green': 'hoge'} # 集合は取り出す順序がランダム
```

### 辞書での要素の取り扱い
#### `get`
指定したキーに対応する値を取得する。
当該辞書に含まれないキーを指定かつデフォルト値も指定されていない場合は`None`が返ってくる（デフォルト値が指定されている場合はデフォルト値を返す）。

```py
# 指定した
辞書.get(キー)
辞書.get(キー, デフォルト値)
```

#### 要素の追加または更新
- `辞書[キー] = 要素`
辞書に要素を追加する。
※指定したキーが当該辞書に含まれていない場合は、**キーと値の組が新たに追加**され、含まれている場合は、**そのキーに対応する値が書き換え**られる。

#### 異なる辞書同士の結合
```py
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}

# 新しい辞書を作成
merged = dict1 | dict2
# merged = {'a': 1, 'b': 3, 'c': 4}

# 既存の辞書を更新
dict1 |= dict2
# dict1 = {'a': 1, 'b': 3, 'c': 4}
```

::: note warn
※キーが重複する場合は**常に後の辞書（右側の辞書）の値が優先**されるので注意
:::

#### `del`
指定したキー（要素＝キーと値の組）を削除する。
当該辞書に含まれていない場合は例外（`KeyError`）が発生する。

```py
del 辞書[キー]
```

#### `pop`
指定したキー（要素＝キーと値の組）を削除し、対応する値を返す。
当該辞書に含まれないキーを指定かつデフォルト値も指定されていない場合は例外（`KeyError`）が発生する（デフォルト値が指定されている場合はデフォルト値を返す）。

```py
辞書.pop(キー)
辞書.pop(キー, デフォルト値)
```
  
#### `clear`
辞書の全ての要素を削除
```py
辞書.clear()
```

### 辞書自体または辞書の`key`や`value`の取り回し
```py
lang_dict = {"ja": "japanese", "en": "English", "fr": "french"}

# キーの繰り返し
for key in lang_dict.keys():
    print(key)
# ja
# en
# fr

# 値の繰り返し
for value in lang_dict.values():
    print(value)
# japanese
# English
# french

# キーと値のペアの繰り返し
for key, value in lang_dict.items():
    print(f"{key}: {value}")
# ja: japanese
# en: English
# fr: french
```

## さいごに
本記事ではPythonにおけるデータ構造（各種イテラブルの紹介）に触れてきました。

次の記事では、Pythonにおけるオブジェクト（クラス）生成を紹介していきたいと思います。

ここまで読んでいただき、ありがとうございました。

