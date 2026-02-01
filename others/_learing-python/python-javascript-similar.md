---
title: Python と JavaScript（TypeScript）間で似たような働きを持つモノたち 〜他言語学習を通じてAIフレンドリーな人材を目指す〜
tags: Python JavaScript Tyepescript AI LLM
author: benjuwan
slide: false
---
これは、筆者の「2025振り返り用ひとりアドカレ」記事の一つです。

## はじめに
筆者は普段 React, Next.js をはじめ、WordPress などフロントエンドを本領として業務にあたっています。
本年（2025年）業務効率化を目的に、初めてバックエンド側の言語として Python 学習を始めました。
Python 学習を進める中で Python と JavaScript（TypeScript）の共通性や似た仕組み、働き、メソッドなどの存在に気づいたのでまとめていこうと思います。

ただし、例外処理やループ処理（イテレーション）、オブジェクト（class）の作成や継承、`if`文など多くの言語設定としてよくある共通部分は取り上げていきません。

本記事では、**あくまで似たような**挙動や仕組み、性質を持ったモノを取り上げていきます。
例：`f文字列`と`テンプレートリテラル（バックティック）`など。

フロントエンド側の人には Python への理解を、普段 Python を使う人にとってはフロントエンド側の処理や雰囲気への理解を、といった相互理解の促進につながるような参考となれば幸いです。

::: note warn
筆者の知識や経験不足から誤解・間違いなどがあったり、網羅しきれていなかったりするかもしれません。
何かお気づきの方はご指摘・ご教示いただけますとありがたく存じます。
:::

## 汎用的なモノ
### `f文字列`
JavaScript（TypeScript）でいうテンプレートリテラル（バックティック）にあたります。

Pythonの`f文字列`は、JavaScriptでいうテンプレートリテラル（バックティック）の記法と似ていて、`{}`の中に変数や式、処理をそのまま記述して（その結果を反映した）文字列を表現できます。

ただし、JavaScript のテンプレートリテラルのように`${}`ではなく、`f文字列`は`{}`と記述します。

- **TypeScript（JavaScript）**
```ts
const name: string = "John";
const age: number = 30;
console.log(`My name is ${name} and I am ${age} years old.`);
```
 
- **Python**
```py
name = "John"
age = 30
print(f"My name is {name} and I am {age} years old.")
```

また、Python では`f"""変数や式、処理のほか、改行も含んだ複数行"""`というように`"""`（三重クォート）を用いることで**変数や式、処理のほか、改行も含んだ複数行**を表現できます。

※JavaScript のテンプレートリテラルでは元から`"""`（三重クォート）のような働きを持っています。

### 分割代入
JavaScript の分割代入と「見た目が似ている」というよりは「意味が近い」という感じです。

- **TypeScript（JavaScript）**
```ts
const [first, second] = [1, 2];
const {name, age} = {name: "John", age: 30};
```

- **Python**
```py
first, second = [1, 2]

person = {"name": "John", "age": 30}
name, age = person["name"], person["age"]
# または以下
# name = person["name"]
# age = person["age"]
```

### 引数のデフォルト値を設定
これは双方とも全く同じ記述です。

- **TypeScript（JavaScript）**
```ts
function greet(name: string = "Guest"): string {
    return `Hello, ${name}!`;
}
```

- **Python**
```py
def greet(name="Guest"):
    return f"Hello, {name}!"
```

## 条件分岐に関わるモノ
### `三項演算子（条件式）`
個人的には未だに少し切り替えが上手く行かない部分です。

Python は先に True の値を書いてから条件式に進んでいく記述アプローチで、JavaScript では逆に条件式を書いてから true, false を `:`で区切るという記述アプローチです。

- **TypeScript（JavaScript）**
```ts
const score: number = 85;
// 条件 ? trueの値 : falseの値
const result: string = score >= 60 ? "passed" : "failed";
console.log(`You ${result} the test.`);
```
 
- **Python**
```py
score = 85
# <Trueの値> if <条件> else <Falseの値>
result = "passed" if score >= 60 else "failed"
print(f"You {result} the test.")
```

※完全に個人的意見ですが筆者は「先に条件式を書いておく JavaScript の記述アプローチ」の方が分かりやすいです。

## イテラブル（配列など反復可能要素）に関わるモノ
### 配列 / リストの操作
- **TypeScript（JavaScript）**
```ts
const numbers: number[] = [1, 2, 3, 4, 5];

// 各値を2倍：[2, 4, 6, 8, 10]
const map_map = numbers.map(n => n * 2);

// 2で割り切れる要素：[2, 4]
const filter_filter = numbers.filter(n => n % 2 === 0);

// すべて 3以上か判定： false
const all_every = numbers.every(n => n > 3);

// どれか一つでも 3以上か判定： true
const any_some = numbers.some(n => n > 3);

// 各値の合算：15
const sum_reduce = numbers.reduce((accu, curr) => accu + curr, 0);
```

- **Python**
※JavaScript の`map`関数や`filter`関数は処理結果として配列（`Array`）を返します。一方、Python ではそれら関数はイテレータを返すため結果をリストとして扱いたい（JavaScript のような挙動にしたい）場合は`list()`で明示的に変換する必要があります。

```py
numbers = [1, 2, 3, 4, 5]

# 各値を2倍：[2, 4, 6, 8, 10]
map_map = list(map(lambda n: n * 2, numbers))
print(map_map)

# 2で割り切れる要素：[2, 4]
filter_filter = list(filter(lambda n: n % 2 == 0, numbers))
print(filter_filter)

# すべて 3以上か判定：False
all_every = all(n > 3 for n in numbers)
print(all_every)

# どれか一つでも 3以上か判定：True
any_some = any(n > 3 for n in numbers)
print(any_some)

# 各値の合算：15
sum_reduce = sum(numbers)
print(sum_reduce)
```

::: note info
Pythonには**内包表記**という独自の構文があって、`map`や`filter`の処理をそちらで書くのも一般的です。

```py
# 内包表記（リスト例）
[式 for 変数 in イテラブル]

# 各値を2倍：
[n * 2 for n in numbers]

# 2で割り切れる要素：
[n for n in numbers if n % 2 == 0]
# 内包表記で条件フィルタリングをする場合は if 条件を後ろに付ける
```

---

- `lambda`について
`lambda 引数: 式`という構文から成る`lambda`関数といって、こちらも Python 独自の機能です。
Python においてはラムダ式を用いることで簡単な関数定義において通常の関数定義よりも短く記述できるようになります。

内包表記や`lambda`関数は Python の独自機能であり、本記事の論旨とズレるので詳細は割愛します。
関心のある方は以下記事をご確認ください。
:::

https://qiita.com/benjuwan/private/6afa73ebd051a079eb0e#%E5%86%85%E5%8C%85%E8%A1%A8%E8%A8%98comprehension%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6

---

コード例に、`map`, `filter`, `sum`など各種関数が出てきています。
**関数やメソッドはそれだけでかなりの文量になったので別記事として切り分ける**ことにしました。
関心のある方は以下記事をご確認ください。

https://qiita.com/benjuwan/private/74f765c93538945ad5eb

### 辞書（Python）とオブジェクト（JavaScript）における操作
- **TypeScript（JavaScript）**
```ts
const lang_dict = {
    "ja": "japanese", 
    "en": "English", "fr": "french"
}

// オブジェクトのキー（プロパティ）に対するイテレーション
console.log(Object.keys(lang_dict))   // Python だと {dict}.keys()

// オブジェクトの値に対するイテレーション
console.log(Object.values(lang_dict)) // Python だと {dict}.values()

// オブジェクトのキー（プロパティ）と値に対するイテレーション
console.log(Object.entries(lang_dict)) // Python だと {dict}.items()
```

- **Python**
```py
lang_dict = {"ja": "japanese", "en": "English", "fr": "french"}

# オブジェクトのキー（プロパティ）に対するイテレーション
lang_dict_keys = lang_dict.keys()
print(lang_dict_keys) # JavaScript だと Object.keys(object)

# オブジェクトの値に対するイテレーション
lang_dict_values = lang_dict.values()
print(lang_dict_values) # JavaScript だと Object.values(object)

# オブジェクトのキー（プロパティ）と値に対するイテレーション
lang_dict_items = lang_dict.items()
print(lang_dict_items) # JavaScript だと Object.entries(object)
```

キー（プロパティ）`keys`と値`values`までは同じで、両方のイテレーションの時だけ名称が異なる感じですね。

- Python：`items`
- JavaScript：`entries`

### イテラブル要素の展開
#### Python：イテラブルアンパッキング（`*`イテラブル）
引数に指定したイテラブルを展開して関数の引数に渡すことができる`位置引数`です。

::: note info
- **位置引数**
その位置に指定することが必須な引数。
対照的に`キーワード引数`では`args_keyword=引数`というように引数名に指定さえすれば引数の記述位置は気にしなくても問題ありません。
:::

```py
def f(arg1, arg2, arg3, arg4):
    print(f"Good {arg1}.")
    print(f"Good {arg2}.")
    print(f"Good {arg3}.")
    print(f"Good {arg4}.")


greeting = ["Morning", "Afternoon", "Evening", "Night"]
f(*greeting)
```

#### JavaScript（TypeScript）：スプレッド演算子
配列の中身を展開する。

ただし注意点として、Python は位置引数とキーワード引数を明確に区別しますが、 JavaScript にはそういった概念がありません。

例えば、以下のコード例では関数にタプルとして引数を型定義およびその値を渡していますが、JavaScript（TypeScript）では一つにまとめたオブジェクトまたは文字列配列を引数にしておくのが一般的です。

```ts
function f (arg1: string, arg2: string, arg3: string, arg4: string): void {
    console.log(`Good ${arg1}.`);
    console.log(`Good ${arg2}.`);
    console.log(`Good ${arg3}.`);
    console.log(`Good ${arg4}.`);
}

// 4つの文字列を持ったタプル（中身は様々な型の要素を格納できるが要素数が固定となるイテラブル）として型定義
const greeting:  [string, string, string, string] = ["Morning", "Afternoon", "Evening", "Night"];
f(...greeting);
```

- 一つにまとめたオブジェクトまたは文字列配列を引数にしておく一般的なアプローチ
```ts
function f(greetings: string[]): void {
    for (const greeting of greetings) {
        console.log(`Good ${greeting}.`);
    }
}

const greeting = ["Morning", "Afternoon", "Evening", "Night"];
f(greeting);
```

## さいごに
初めてプログラミング言語に触れる方や、一つの言語を突き詰めている方にとって、他言語学習はあまり意識に上らないかもしれません。

しかし昨今、AI（LLM）を使ったプログラミングが主流になる中で、**複数の言語を知っていることは、より効果的・効率的なプロンプト作成につながる**のではないかと筆者は考えています。

例えば、「フロントエンドの〇〇のような機能をバックエンドでも実現したい」といった要望をAIに伝える際、両方の言語を知っていれば、必要な前提や背景を省略したより具体的で的確な指示を出すことができます。

その結果、**人間とAIの認識ズレを最小限に抑えたまま設計・実装を進められる**ため、同じワークフローでも成果物の品質に差が出てくるでしょう。

経験豊富なエンジニアは基礎知識をはじめ、これまでに培った暗黙知や課題把握力をそのままプロンプトに落とし込めるため、AIとの協業をより高度なレベルで成立させているのではないでしょうか？

こういった点からも（言語以外にも大事なモノは多くありますが一旦割愛して）他言語を学んでおくことで、少しでもAIフレンドリーな人材になれるのではと筆者は考えています。

他言語学習には時間がかかり、基礎的な内容が中心になるため挫折しやすい面もあります。
しかし、それを乗り越えることでAI時代における自身の守備範囲を広げて、少しでもAIフレンドリーな人材になれるのでは？と筆者は思っています。

ここまで読んでいただきありがとうございました。

