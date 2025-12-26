---
title: フロントエンド側の人間が 1からPythonを学んでみて④ ～オブジェクト（class）編～
tags: Python 業務効率化 初心者向け オブジェクト class
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

## オブジェクト（class）
Pythonでいうオブジェクトとは、**特定の機能や挙動（振る舞い）を実現するためのデータや処理（操作）をひとまとめにしたデータ構造体**を指します。

それら **オブジェクトを組み合わせてプログラムを構築・開発していくのをオブジェクト指向プログラミング（`Object Oriented Programming`）** といいます。

各オブジェクトがどのようなデータ構造を持っているのかは**クラスを通じて定義**します。

先述した「特定の機能や挙動（振る舞い）を実現する」ための**データをデータ属性**と呼び、**処理（に該当する属性）をメソッド**と呼びます。

これは他の言語にも汎用できる考え方ですが、**クラスは「設計図」で、「その設計図から生成される実体・実物」をインスタンス**といいます。
一般的にオブジェクトとはこのインスタンスオブジェクトを指します。

::: note info
**Python では JavaScript のように`new`を前置する必要はなし**

クラスの作成は JavaScript と似たような記述なのですが、Python では`new`を接頭辞として前置する必要はありません。

- `TypeScript（JavaScript）`
```js
class Person {
  // コンストラクタ関数： インスタンスのプロパティ初期化
  constructor(
      // private 修飾子により、クラス外から直接アクセスできないプロパティとして宣言
      private name: string, 
      private age: number
  ) {}

  // メソッドを定義
  greet(): string {
    // this は「それ自身・（オブジェクトの）自分自身」というニュアンス
    return `Hello, I'm ${this.name}`;
  }
}
```

- Python
```py
class Food:
    # クラス属性（クラス共通のデータや処理）
    counter = 0

    # __init__ は、JavaScript でいうコンストラクタ関数のようなもの
    def __init__(self, name, price):
        # self は JavaScript でいう this のようなもの
        self.name = name
        self.price = price
        Food.counter += 1 # クラス属性

    # （インスタンス）メソッドの作成
    def show(self):
        print(f"No.{Food.counter} / {self.name}: {self.price}")

# 生成時は self に該当する部分（`__init__(self, name, price)`の第一引数）は省略
x = Food("milk", 150)
```

:::

### Pythonでのクラスの命名規則
クラス名はパスカルケース（例：`HelloWorld`）で命名します。
ただし、クラス内のデータ属性名やメソッド名については変数名や関数名の命名規則（スネークケース：`hoge_foo_bar`）に準ずるので注意。

### Pythonにおけるプライベートメソッド
Pythonでは仕様としてのプライベートメソッドはありません（＝すべてパブリックとして扱われる）。
そこで、`_`を前置したり、マングリングを行ったりして明示的にそれを表現します。

```py
def __init__(self, name, price):
    # _を前置しているだけで、外から呼び出せるので注意
    self._name = name
    self._price = price

def show(self):
    print(f"{self._name}: {self._price}")
```

::: note info

**マングリング（`mangling`：分からなくすること）**

念入りに属性への操作を制限したい場合、**属性名の先頭に2個のアンダースコア`__`を付ける**ことで、自動的に`_クラス名__属性名`というような属性名に変換されます。

しかし、結局はマングリングも**明示的な表現という範疇を超えない**ので注意が必要です。

※また、`__init__`のような前後に2個のアンダースコア`__`が付いたものはマングリングの対象となりません。

:::

### 基底クラス（スーパークラス）と派生クラス（サブクラス）
JavaScript のクラスでいう `extends` のようにPythonにも**継承**があります。
ニュアンスは JavaScript のそれと同じく**親クラスのデータや処理・操作を受け継ぐ**というものです。

:::note info
Python では「派生の関係を指し示す」際に「汎化」という言葉で関係性を表現します。
:::

#### Python は単一継承、多重継承の両方とも対応
```py
class SubClass(SuperClass01, SuperClass02, ...):
    # 処理

    # オーバーライド（上書き）を実現するには、
    # 基底クラスのものと同名（今回の場合は view_els ）にしなければならない
    def view_els(args, ...):
      # メソッドの処理
```

#### 基底クラス（スーパークラス）
```py
# 基底クラス Item
class Item:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def show(self):
        print(f"{self.name}: {self.price}")
```

#### 派生クラス（サブクラス）
JavaScript のように`派生クラス extends 基底クラス`という指定方法ではなく、Python では`派生クラス(基底クラス)`という形で継承を実現します。

```py
# 基底クラス Item の派生クラス Food
class Food(Item):
    # 基底クラスの __init__ 引数も指定する（今回は name, price）
    def __init__(self, name, price, used_limit):
        # JavaScript と同様に super() 関数で
        # 基底クラスの該当内容を継承（今回は コンストラクタ部分）
        super().__init__(name, price)
        
        # 派生クラスの独自部分
        self.used_limit = used_limit

    def show(self):
        # JavaScript と同様に super() 関数で
        # 基底クラスの該当内容を継承（showメソッド）
        super().show()
        
        # 派生クラスの独自部分
        print(f"{self.name}: {self.price}: {self.used_limit}")
```

::: note info
「親クラスのメソッドを呼び出したい場合、単に`self.show()`と書くと自分自身（子クラスの`show`）を呼び出し続けてしまい、再帰エラー（関数やメソッドが自分自身を呼び出してしまうエラー）になります。必ず`super().show()`を使いましょう。

※ Python ではメモリ負荷の観点から再帰回数に上限（デフォルト1000回）が設けられています。
:::

<details><summary>クラスの継承に関する実践例コード</summary>

```py
import time

class HelloPresident:
    def __init__(self, name, familyname):
        self.name = name
        self.familyname = familyname

    def console_log(self):
        print(f"hello {self.name} {self.familyname} .")

HelloPresident("Donald", "Trump").console_log()
HelloPresident("Joe", "Biden").console_log()


# 継承
class HelloPresidentAge(HelloPresident):
    def __init__(self, name, familyname, birth):
        super().__init__(name, familyname)
        self.birth = birth

    def console_log(self):
        year = int(self.birth[0:4])
        month = int(self.birth[4:6])
        day = int(self.birth[6:8])

        tm = time.localtime()
        # 誕生月がまだ来ていない or (誕生月だが、日がまだ来ていない)
        is_yet_future = (month > tm.tm_mon) or (
            (month == tm.tm_mon) and (day > tm.tm_mday)
        )

        age = tm.tm_year - year
        if is_yet_future:
            age -= 1

        print(
            f"hello {self.name} {self.familyname} . your {age} age now."
        )


HelloPresidentAge("Donald", "Trump", "19460614").console_log()
HelloPresidentAge("Joe", "Biden", "19421120").console_log()
```

</details>

## オブジェクトの属性に関する操作
### 属性に値を設定
```py
setattr(オブジェクト, 属性名, 値)

# 以下でも可能
オブジェクト.属性名 = 値
```

### 属性の値を取得
```py
getattr(オブジェクト, 属性名)

# 以下でも可能
オブジェクト.属性名
```

### 属性の有無を調べる
存在する場合は`True`、しない場合は`False`が返ってくる。

```py
hasattr(オブジェクト, 属性名)
```

### 属性を削除
```py
delattr(オブジェクト, 属性名)

# 以下でも可能
del オブジェクト.属性名
```

### 属性一覧を取得
```py 
# オブジェクトとクラス（基底クラス含む）が持つ「属性名」の一覧を取得
dir(オブジェクト)

# オブジェクトが持つ「属性名と値」の一覧を取得
vars(オブジェクト)
```

## ダックタイピング
「オブジェクトがどのような型に属するかではなく、**どのようなメソッドや属性を持っているかで判断**する」という考え方です。
「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルだ」という哲学から名付けられています。

例えば、TypeScriptでいう「期待するプロパティを持っていれば、他のプロパティを持っていても（指定した）型とみなされる**構造的部分型**」に近い考えです。

ただし「**コンパイル時**（型チェック時）にダックタイピングの安全性をチェック」するTypeScriptに対して、Pythonは**動的型付け言語**なので「**実行（ランタイム）時**にダックタイピングを行う」という違いがあります。

## クラス（オブジェクト）のアクセス制御
少し話が逸れますが、プログラミングにおけるクラス（オブジェクト）の生成において、用意するメソッドやデータなどに対して **「外部からも利用可能」、「内部からのみ利用可能」といった制限・制約を設けたい** 場合もあります。
そのようなケースでは以下のような概念が登場します。

::: note warn
※ Python には 言語仕様として以下のような「アクセス制御」は存在しませんので注意してください
:::

#### パブリック（`public`）：全体公開
クラス内外から呼び出せる（どこからでも使用できる）。

- 例：公園のように誰でも利用可能

#### プライベート（`private`）：当該クラス専用
当該クラス内でしか呼び出せない（使用できない）。

- 例：自室の鍵付きの引き出しのように、自分しか開けられない

#### プロテクティッド（`protected`）：当該クラス及び子孫クラス専用
当該クラスと、その子クラスからしか呼び出せない（使用できない）。

- 例：家族共用のリビングのように、家族（子クラス含む）なら使えるが、外部の人は入れない

## さいごに
本記事ではPythonにおけるオブジェクト（class）に触れてきました。

次の記事では、Pythonにおけるループ処理・条件分岐について書いていきたいと思います。

ここまで読んでいただき、ありがとうございました。

