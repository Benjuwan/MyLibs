---
title: フロントエンド側の人間が 1からPythonを学んでみて⑦ ～関数定義・引数指定編～
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

本記事では関数定義や関数を構成する引数の指定方法について書いていきます。
大雑把に説明すると、そもそも関数とは「特定の処理（挙動・振る舞い）をひとまとまりにし、再利用可能にした仕組み」で、引数とは「関数の挙動を外側からコントロールするために必要となるデータ要素」となります。

関数を自由に作れるようになると再利用可能なコードブロックが作成でき、ロジックを他のプロジェクトで使い回せるなど生産性と統一性が高まります。

関数は Python 以外の言語でも流用できる概念・仕組みなのでしっかり理解しておきたい部分です。

## 関数定義
Python でも他の言語同様`関数名(引数, ...)`という形で関数定義し、関数の呼び出し方法（使い方）も同じです。

ただし、JavaScriptでいう`function`宣言子が`def`という宣言子だったり（※JSのアロー関数に似た書き方は存在しない）、`関数名(引数, ...):`というようにパラメータ後に`:`を置いたりなど Python 独自の部分もあります。

こちらも JavaScript 同様、**引数にはデフォルト値を設けることも可能**です。

::: note info
Python での関数の命名規則は変数同様に**スネークケース**（区切り部分はアンダースコア`_`を用いるの）が一般的
:::

### 関数・メソッドの切り分けについて
個人的に React で普段カスタムフックとして処理を切り分けたりすることが多いので Python を使っていてもヘルパー関数を作る機会が多かったです。

::: note info
- ヘルパー関数
共通処理や補助的な処理をまとめるための関数。既存処理をラップ・拡張するケースも多い。
:::

ただし、Python では切り分けることで「モジュールインポートにおける循環エラー」が発生したり詰まる部分も多くありました。個人的な意見ですが、このような依存関係の解決はフロントエンドの方が楽だと感じた次第（※）です。

※おそらく Vite などバンドルツールが良しなに働いてくれているだけです。
バニラJSの場合は分離した複数ファイルの読込順（配置順）を意識する必要があるので、フロントエンドだから楽というわけではないと思います。

### 引数のデフォルト値について
引数にデフォルト値を設定する場合、`仮引数（param）=デフォルト値`という記述方法になります。

デフォルト値を持つ引数は、呼び出し時に`位置引数`または`キーワード引数`としても使用できます。ただし、あくまで **実際の使用時に指定する`実引数（args）`の在り方（キーワード引数か位置引数か）** で判定しています。

::: note info
- **キーワード引数**
`args_keyword=引数`というように引数名に指定さえすれば引数の記述位置は気にしなくても良い指定方法。対照的に「位置引数」では該当する引数位置に指定することが必須となります。

- **位置引数**
その位置に指定することが必須な引数。対照的に「キーワード引数」では`args_keyword=引数`というように引数名に指定さえすれば引数の記述位置は気にしなくても問題ありません。
:::

```py
def f(start: int | None = None, end: int = 10):
    print(f"start: {start}, end: {end}")


f(100)                # 位置引数として使用
f(start=100, end=20)  # キーワード引数として使用
```

::: note warn
リストや辞書などの**変更可能なオブジェクト（mutable）をデフォルト引数にすると、予期しない動作の原因**となるリスクがあるのでやめましょう。

:::

- 例示コード： 渡された引数が数値型に変換可能かをチェックする関数
```py
def convert_to_number(arg: str | int | float) -> int | float | None:
    """
    渡された引数`arg`が数値型に変換可能かをチェックする関数
    [convert_to_number 関数の概要]
    Args:
        # 文字列 | 整数 | 浮動小数点数 を引数として受け取る
        arg: str | int | float

    Returns:
        # 整数 | 浮動小数点数 | 何もなし を返す
        int | float | None      
    """
    try:
        # 整数（型）変換に試みる
        return int(arg)
    except ValueError:
        try:
            # 整数変換に失敗した場合は浮動小数点（型）への変換を試みる
            return float(arg)
        except ValueError:
            # ここまで全て失敗した場合は None を返す
            return None
```

::: note info
例示コード内にある`"""`は`三重クオート`といい、Pythonにおけるコメント記法（`docstring`）になります。
`三重クオート`内に書いた文章は改行やインデントなどがそのまま反映されます。

これを関数宣言（名）の直後に記述することで「関数の概要や挙動の説明文（コメント）」となります。
JavaScript でいうと`JSDoc`のようなものですね。

また、`try`, `except`ですが、これは`例外処理`（エラーハンドリング）で JavaScript でいう`try`, `catch`にあたります。

※[`例外処理`はまた別の記事](https://qiita.com/benjuwan/private/1361d9416a8368c9886b)にします。
:::

- `"""`（`三重クオート`）のコード事例
※コード例にある f"文章" は`f文字列`といいます。
これは JavaScript でいうテンプレートリテラル（バックティック）の記法と似たものです。
`{}`の中に変数や式、処理をそのまま記述して（その結果を反映した）文字列を表現できます。
```py
add_text = "/// python learning ///\n"  # \n - 改行
exercitation = "--- exercitation ---"
print(f"""
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      
Ut enim ad minim veniam, quis nostrud {exercitation} ullamco laboris nisi ut aliquip ex ea commodo consequat.
{add_text}
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
""")

# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
#       
# Ut enim ad minim veniam, quis nostrud --- exercitation --- ullamco laboris nisi ut aliquip ex ea commodo consequat.
# /// python learning ///
# 
# Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
# Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

### Pythonにおいて、引数の指定方法はいくつかの種類がある
#### イテラブルアンパッキング（`*イテラブル`）
引数に指定したイテラブルを展開して、関数の引数に渡すことができる`位置引数`です。

JavaScript でいうスプレッド演算子（配列中身の展開）と「細かい部分では異なります（※）」が、それに近いような働きをします。

※ Python は`位置引数`と`キーワード引数`を明確に区別しますが、 JavaScript には`位置引数`や`キーワード引数`といった概念がありません。

例えば、以下のコード例で言うと JavaScript でも実行は可能です。
しかし、JavaScript では一つにまとめたオブジェクトまたは文字列配列を引数にしておくのが一般的です。

```py
def f(arg1, arg2, arg3, arg4):
    print(f"Good {arg1}.")
    print(f"Good {arg2}.")
    print(f"Good {arg3}.")
    print(f"Good {arg4}.")


greeting = ["Morning", "Afternoon", "Evening", "Night"]
f(*greeting)
```

- 上記コード例の JavaScript ver
```js
function f(arg1, arg2, arg3, arg4) {
    console.log(`Good ${arg1}.`);
    console.log(`Good ${arg2}.`);
    console.log(`Good ${arg3}.`);
    console.log(`Good ${arg4}.`);
}

const greeting = ["Morning", "Afternoon", "Evening", "Night"];
f(...greeting);
```

#### 辞書アンパッキング（`**dict`）
 `dict`から`key`と`value`を取り出し **「`key`=`"value"`」というキーワード引数** として関数に渡すことができる。
```py
dessert = {"main": "puding", "side": "cookie", "drink": "tea"}
# 各キーワード引数： main="puding", side="cookie", drink="tea"
order_meals(**dessert)
```

#### コマンドライン引数
コマンドプロンプトやターミナルでコマンド入力する際に**コマンドに対して与える引数**を指します。
これにより、**コマンドラインから特定処理の実行（計算やファイル編集、操作など）が可能**となります。

```bash
コマンド 引数
```

##### Pythonファイルに対するコマンドライン引数の実行
```bash
python sample-task.py 引数
```

**コマンドライン引数を受け取るには、標準ライブラリ`sys`モジュールを使用**します。
`sys`モジュールの`argv`属性がプログラム名とコマンドライン引数のリストとなります。

```py
import sys

# プログラム名と引数のリストを取得
# 取得したリスト[0]にはプログラム名が入り、以降のインデックスには引数が続く
# ※注意：`sys.argv`で取得される引数は「すべて文字列型」なので、
#       数値として使用する場合は`int()`や`float()`で型変換が必要
sys.argv # 属性なので()は無し

# 指定した位置（インデックス）の値を取得
sys.argv[0] # プログラム名
sys.argv[1] # 第一引数
sys.argv[2] # 第二引数

# プログラム名と引数の個数を取得
len(sys.argv)
```

##### コマンドライン引数の具体例
`python my-special-task.py 1 2 3`と入力したとします。
```py
print(sys.argv)
# 結果：['my-special-task.py', '1', '2', '3']

print(len(sys.argv))    # 4
print(sys.argv[0])      # my-special-task.py
print(sys.argv[-1])     # 3
```

### その他 / 具体例
#### 可変長引数（例：`print`関数のように任意個の引数を受け取る関数）
関数定義の際、パラメータに`(*引数)`または`(**引数)`と記述します。

- `(*引数)`と記述（位置引数として振る舞う）
任意個の**位置引数をタプル**として受け取る
```py
def mutable_args_tuple_f(*args):
    for i, t in enumerate(args):
        print(f"{i + 1}番目のイテラブル要素「Good {t}」")
        # 1番目のイテラブル要素「Good Morning」
        # 2番目のイテラブル要素「Good Afternoon」
        # 3番目のイテラブル要素「Good Evening」
        # 4番目のイテラブル要素「Good Night」


# タプル（形式）の位置引数として渡す
mutable_args_tuple_f("Morning", "Afternoon", "Evening", "Night")
```

- `(**引数)`と記述（キーワード引数として振る舞う）
任意個の**キーワード引数を辞書**として受け取る
```py
def mutable_args_dict_f(**args):
    for k, v in args.items():
        print(f"{k}： Good {v}")
        # Gozen： Good Morning
        # Gogo： Good Afternoon
        # Yugata： Good Evening
        # Yoru： Good Night


# キーワード引数として渡す
mutable_args_dict_f(Gozen="Morning", Gogo="Afternoon", Yugata="Evening", Yoru="Night")
```
  
- `(*引数)`と`(**引数)`の組み合わせ
```py
def view_ordered_menus(*meal_tuple, **meal_dict):
    for i, elm in enumerate(meal_tuple):
        print(f"[ {i + 1} ] {elm}")
        # [ 1 ] hotcake
        # [ 2 ] pizza
        
        # enumerate の第二引数に開始値（今回は meal_tuple の配列数）を指定
        # for 文の変数について、対象辞書の key と value をグループにしないとランタイムエラー（ValueError: not enough values to unpack）が発生する
    for i, (k, v) in enumerate(meal_dict.items(), len(meal_tuple)):
        print(f"[ {i + 1} ] {k} : {v}")
        # [ 3 ] snack : parfait
        # [ 4 ] dinner : steak


view_ordered_menus("hotcake", "pizza", snack="parfait", dinner="steak")
```

- `(*引数)`と`デフォルト値を持ったキーワード引数`、`(**引数)`の組み合わせ
```py
# **引数（辞書アンパッキング）のあとにはいかなる引数も指定できないので、
# デフォルト値を持ったキーワード引数（optional_start）は、
# *引数（位置引数）と**引数（キーワード引数）の間に指定する
def view_ordered_menus_xai(*meal_tuple, optional_start: int | None = None, **meal_dict):
    start = optional_start - 1 if type(optional_start) is int else 0
    
    for i, elm in enumerate(meal_tuple, start):
        print(f"[ {i + 1} ] {elm}")
        
        for i, (k, v) in enumerate(meal_dict.items(), (len(meal_tuple) + start)):
            print(f"[ {i + 1} ] {k} : {v}")


# オプショナルな引数を指定
view_ordered_menus_xai(
    "hotcake",
    "pizza",
    optional_start=55,
    snack="parfait",
    lunch="curry",
    dinner="steak",
)
# [ 55 ] hotcake
# [ 57 ] snack : parfait
# [ 58 ] lunch : curry
# [ 59 ] dinner : steak
# [ 56 ] pizza
# [ 57 ] snack : parfait
# [ 58 ] lunch : curry
# [ 59 ] dinner : steak

print()  # 改行用

# オプショナルな引数を省略（指定せず）
view_ordered_menus_xai(
    "hotcake", "pizza", snack="parfait", lunch="curry", dinner="steak"
)
# [ 1 ] hotcake
# [ 3 ] snack : parfait
# [ 4 ] lunch : curry
# [ 5 ] dinner : steak
# [ 2 ] pizza
# [ 3 ] snack : parfait
# [ 4 ] lunch : curry
# [ 5 ] dinner : steak
```

コード内のコメント通り、`**引数`（辞書アンパッキング）のあとにはいかなる引数も指定できないので、`デフォルト値を持ったキーワード引数`（`optional_start`）は、`*引数`（位置引数）と`**引数`（キーワード引数）の間に指定します。

::: note warn
#### 位置引数またはイテラブルアンパッキングは左側、キーワード引数または辞書アンパッキングは右側

構文エラー回避のためにも「**位置引数またはイテラブルアンパッキングは左側**に、**キーワード引数または辞書アンパッキングは右側に配置**」と覚えておく
:::

## さいごに
本記事ではPythonにおける関数定義・引数指定に触れてきました。

次の記事では、Pythonにおける例外処理（エラーハンドリング）について書いていきたいと思います。

ここまで読んでいただき、ありがとうございました。

