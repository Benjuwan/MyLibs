---
title: フロントエンド側の人間が 1からPythonを学んでみて⑧ ～例外処理編～
tags: Python 業務効率化 初心者向け 例外処理
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

## 例外処理（`try - except`）
JavaScriptでは`try - catch`だが、Pythonでは`try - except`と記述します。
共通終了処理としては`finally`で同じです。

※Python も JavaScript 同様で、**例外を投げて（※JavaScriptでいう`throw new Error()`して）キャッチ（捕捉）されなければ領域脱出する**仕様になっています。

```py
def payment_division():
    try:
        price = int(input("価格："))
        people = int(input("人数："))
        result = price // people
        print(f"result: {result}")

    # 1. 大部分の例外の基底クラス（Exception）を指定して包括的に処理
    # except Exception:
    #     print("error.")

    # 2. 複数の例外を指定
    # except (ValueError, ZeroDivisionError):
    #     print("error.")

    # 3. 例外を単体指定
    except ValueError:
        print("ValueError： is not INT.")
        
    # 4. 例外を単体指定 - ZeroDivisionError：
    # 割る方（今回の場合は people ）が0の場合に発生するエラー
    except ZeroDivisionError:
        print("ZeroDivisionError： must be != 0.")

    # 共通終了処理
    finally:
        print("-" * 25)


payment_division()
```

::: note info
### Pythonでは、例外操作においても`else`文が使用可能
注意点として`else`は **`try`節が例外なく完了した場合に実行** されます。
`try`内に書ける処理ではあるものの、意図を明確に分離する目的として **`except`以降かつ`finally`以前に書く** のが一般的です。

```py
try: 
  # 成功処理（検証対象処理）
except 例外A:
  # 例外A
except 例外B:
  # 例外B
else:
  # 例外が発生しなかった場合のみ実行される処理
  # ※ try の内側に記述しても良いが else を使うことで明示的な記述となる
finally:
  # 共通終了処理
```
:::

### Python における例外処理で意識しておくこと
#### `except`は上から順に処理（先述優先）していく
一般的に、`except`節を記述するときは派生クラス（例：`ValueError`, `ZeroDivisionError`）を先に書き、基底クラス（例：`Exception`）を後から書いていきます。

#### 適切な例外処理が実行されるまで`finally`節以外の実行（処理）は全てパスされる
例外発生時は、その例外を処理する`except`節に出会うまで`finally`節以外の実行（処理）は全て省かれる

### `raise`（レイズ）
例外をスローします。
JavaScriptでいう`throw new Error()`です。

```py
raise 例外

# 例外の内容を表すオブジェクトを格納したうえで Exception を発生させる
raise Exception(オブジェクト)
```
- 具体例
```py
def payment_division():
    try:
        price = int(input("価格："))
        if price <= 0:
            # 例外を投げる
            raise Exception("The price must be >= 0.")
            
        people = int(input("人数："))

    # 中略...

    # 例外オブジェクトの取得（例外 as 変数）
    except Exception as e:
        print(e)

    finally:
        print("-" * 25)


payment_division()
```

例外処理のエラーハンドリングにおいて、簡単なテストやデバッグに有用な Python 独自の文や関数も合わせて紹介しておきます。

## 簡単なテストやデバッグに有用な Python 独自の文や関数
### `assert`文
「～であること」を断言（assert）する、という文脈で使用されます。
主に、デバッグやテストに用いる Python 処理系のビルトイン機能です。

例えば、「この式の値は`True`である」と断言する、といった使い方になります。
※一度に複数の式を指定することも可能。

式の値が`True`の場合は何もないが、`False`の場合は`AssertionError`という例外が発生します。
つまり、**例外が発生しなかった場合に自分の想定が正しかった（意図通りの挙動）ということを確認**できるのです。

```py
# である ことを断定
assert 式

# ではない ことを断定
assert not 式
```

- 実装例
```py
# 年が400で割り切れる場合は「うるう年」
# 年が100で割り切れず、4で割り切れる場合も「うるう年」
def leap_year(year: int):
    return year % 400 == 0 or year % 100 > 0 and year % 4 == 0

# 処理実行して何も表示されなければok
assert not leap_year(1900)
assert leap_year(2000)
assert not leap_year(2019)
assert leap_year(2020)
assert not leap_year(2024) # AssertionError 発生 （2024年はうるう年）
```

::: note info
- Pythonでのテスト
プログラムのテストを実施するには（例：`pytest`のような）本格的なテストツールやテストフレームワークを使う必要があるものの、シンプルな実装内容の場合は`assert`文で済むことも多い。
:::

### `breakpoint`関数
デバッグのために意図的にプログラムを一時停止させる`breakpoint`を設ける関数。実行すると当該箇所（行）で[`pdb`（Pythonデバッガ）](https://docs.python.org/ja/3.13/library/pdb.html)に制御が移行する。

- `l（エル）+ enter` でプログラム表示（※ブレークポイントの位置確認）
- `p 変数（式）+ enter` で式を表示
- `n + enter` で一行進む
- `c + enter` で次のブレークポイントまで移動
- `s + enter` で対象関数の中に入る
- `r + enter` で対象関数を`return`まで実行

```py
first = 123
breakpoint()  # ブレークポイント設置

second = 456
result = first + second  # 実行可能な処理に変更
third = 789
breakpoint()  # ブレークポイント設置

print(first, second, third, result)
```

## さいごに
本記事ではPythonにおける例外処理（エラーハンドリング）に触れてきました。

次の記事では、Pythonにおける便利なメソッド・関数の紹介をしていきたいと思います。

ここまで読んでいただき、ありがとうございました。

