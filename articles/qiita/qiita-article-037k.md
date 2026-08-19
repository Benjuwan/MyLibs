---
title: フロントエンド側の人間が 1からPythonを学んでみて⑩ ～便利なライブラリ紹介編～
tags: Python 初心者向け 業務効率化
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

## ライブラリ
Pythonのライブラリは`モジュール`と`パッケージ`という構成です。
便利なライブラリを知る前に Python におけるライブラリの基礎知識を学んでいきましょう。

### モジュール
特定機能を持ったプログラムの構成部品（`Pythonファイル名.py`）

### パッケージ
複数のモジュールをひとまとめにしたもの（モジュールの詰め合わせ）

### モジュール化（ロジックの再利用）
モジュール化は必須でないものの、これを行うことで再利用性が高まり、保守・管理もしやすくなります。
また、他のプロジェクトにも流用できることで汎用性と生産性も向上できるでしょう。

### 単独実行または他プログラムからも利用可能なモジュールの作り方
#### 1. はじめに、モジュールの主要な処理を関数にまとめる

```py
def 関数名(引数, ...):
    # 処理の記述...
```

#### 2. モジュールを単独で（Pythonコマンドで）実行したときに関数を呼び出す処理を追加

```py
if __name__ == "__main__":
    関数名(引数, ...)
```

::: note info
- **`__name__`**
モジュール名を返す特別な変数です。
  - **モジュールを単独実行するとき**
  モジュール名は`"__main__"`となる
  - **他プログラムから利用するとき**
  モジュール名は`（当該モジュール）ファイル名`となる（※`.py`拡張子は省く）

```py
if __name__ == "__main__":
```

モジュール作成において上記記述が必要な理由は **`__name__`が`"__main__"`に等しいかどうかをチェックし、「等しい場合はモジュールの主要な処理を行う関数を呼び出せる」ようにするため** であり、これにより単独でも他プログラムからでも使用できるようになるのです。
:::

### パッケージの階層構造
パッケージは、`パッケージ/サブパッケージ/サブサブパッケージ/モジュール`というような階層構造になっており、`.`記法で選択していきます。
JavaScript でいうとオブジェクトのプロパティやメソッドチェーンのようなイメージですね。

#### モジュール名の書き方（パッケージなし）
```py
モジュール名
```

#### モジュール名の書き方（パッケージあり）
```py
パッケージ.モジュール名
```

#### モジュール名の書き方（サブパッケージあり）
```py
パッケージ.サブパッケージ.〜サブサブ…〜.モジュール名
```

---

ここまでが基礎的な部分です。

以降は実際にライブラリを使用するための前準備（インポート）について説明していきます。

### ライブラリの使用方法
他の言語やライブラリ、フレームワークと同じように使用したい機能（モジュール / パッケージ）をインポートする。
```py
import モジュール名
```

::: note info
一般的には、各種モジュールやパッケージのインストールでは **相対インポート（`from . import モジュール名`）** よりも **絶対インポート（`from パッケージ名.モジュール名 import クラスまたは関数名`）** の方が、依存関係が明確になりコードの可読性と保守性が向上します。
:::

- 具体例：標準ライブラリ`random`モジュールを使用

::: note alert
Python の`random`モジュールは疑似乱数（疑似的なランダム数値）を生成する機能を持っていますが、JavaScript の`Math.random()`同様、**疑似乱数は暗号に使用可能な安全性を備えていない**ので**セキュリティ事案に使用してはいけません**。
:::

```py
import random

# random ライブラリを使用（1から6までの乱数を生成）
print(random.randint(1, 6))
```

#### モジュールに別名を付けたり、省いたりして利用する
モジュール名やインポートした機能に別名を付けたり、一部を省いて簡略化した記述で呼び出したりできます。

##### モジュール名に別名を付けて使用する
```py
# import モジュール名 as 別名
import random as r
r.randint(1, 6)
```

##### モジュール名を省いて（希望する機能を）使用する
```py
# from モジュール名 import 機能名, ...
from random import randint
randint(1, 6)
```

##### 全ての機能をモジュール名を省いて使用する
```py
# from モジュール名 import *
from random import *
```

##### インポートした機能に別名を付けて使用する
```py
# from モジュール名 import 機能名 as 別名
from random import randint as ri
ri(1, 6)
```

#### パッケージ名を省いてモジュールを使用
※例として、URL文字列を解析して各種の要素を抽出する`urllib`ライブラリを使用

```py
# from パッケージ名 import モジュール名
from urllib import parse

url_parse_result = parse.urlparse("https://example.com/hoge/foo")
print(url_parse_result)
```

#### パッケージ名とモジュール名を省いて機能を使用
※例として、URL文字列を解析して各種の要素を抽出する`urllib`ライブラリを使用

```py
# from パッケージ名.モジュール名 import 機能名
from urllib.parse import urlparse

url_parse_result = urlparse("https://example.com/hoge/foo")
print(url_parse_result)
```

::: note info
先ほどの`urllib`ライブラリを使用したコード例で、パッケージとモジュールをそれぞれインポートする記述例

```py
# パッケージとモジュールをそれぞれインポート
import urllib
import urllib.parse

url_parse_result = urllib.parse.urlparse("https://example.com/hoge/foo")
print(url_parse_result)
# ParseResult(scheme='https', netloc='example.com', path='/hoge/foo', params='', query='', fragment='')
```

:::

#### 補足： ロジックを切り分けた自作モジュールやパッケージの格納ディレクトリには`__init__.py`を置いておく

`__init__.py`とは、ディレクトリをPythonパッケージとして認識させるためのファイルです。

```
specific_feature/
├── __init__.py  # 中身は空ファイルでもok
└── feature.py
```

Python 3.3 以降では必須ではありません（※`Namespace Package`として扱われるため）が、配置することで**明示的にパッケージとして管理**できます。中身は空ファイルでも問題ありませんが、パッケージの初期化コードや`__all__`によるエクスポート制御を記述できます。

- `__init__.py`： パッケージ初期化コード例
```py
# パッケージのバージョン情報を定義
__version__ = '1.0.0'

# 必要に応じて初期化処理を実施
# 先ほども記載したが`__init__.py`は中身が空でも良い
```

- `__init__.py`： `__all__`によるエクスポート制御の例
```py
from .module_a import UserLogic
from .module_b import calc_price

# "from package import *" で公開する対象を制限する
__all__ = ['UserLogic', 'calc_price']
```

::: note info
`__init__.py`については以下記事がより詳しいです。
:::

https://nikkie-ftnext.hatenablog.com/entry/lets-touch-dunder-init-py-mark-directory-as-regular-package-202601

#### 補足： 循環インポートエラー
循環インポートエラーとは、2つ以上のモジュールが互いにインポートし合うことで発生するエラーです。

React を例にすると、関心ごとや責務分離の観点からコンポーネントやカスタムフックなどに切り分けて適宜必要箇所で読み込む（インポートする）ケースは多いと思います。
これはモジュールバンドラー（Webpack や Vite など）が依存関係を適切に解決してくれているためスムーズにインポートできます。

一方、バニラの JavaScript（モジュールバンドラーを使わず script タグで直接読み込む場合や CommonJS など一部の環境）では開発者自らが各ファイルの依存関係を管理・解決しなければなりません。

Pythonでもこれと同様の事態が生じます。
つまり、うまく順序立ててインポートしないとロジックが機能しなくなるのです。特に、Python は import 時に即実行されるため、よりエラーとして顕在化しやすい傾向があります。

具体的には、モジュールA がモジュールB をインポートし、モジュールB もモジュールA をインポートしている場合、Pythonが「片方のモジュールがまだ完全に初期化されていない状態で参照される」ため **属性が存在せずエラー（`AttributeError`, `ImportError`）** となってしまいます。

```py
module_a.py がfrom module_b import something
module_b.py がfrom module_a import something
```

循環インポートエラーの対策としては以下が挙げられます。

- モジュール間の依存関係を一方向にする
- 必要に応じて関数内でインポートする
- 共通の依存を別モジュールに分離する

#### 補足： ライブラリのアップデート情報確認とアップデート方法、`requirements.txt`の更新方法

- `requirements.txt`：仮想環境にインストールしたものを管理するためのファイル

::: note info
以下工程は仮想環境をアクティベートした状態で実施してください。
さもないと**グローバル環境に各種ライブラリがインストールされてしまい**ます。
:::

##### 1. `pip list --outdated`でpipでインストールされているライブラリのうち、アップデート可能なものを確認
`pip list --outdated`は、`npm`でいう`npm outdated`に相当します。

##### 2. ライブラリのアップデートを実施
###### サードパーティツールの`pip-review`を実施
※インストールが済んでいない場合は`pip install pip-review`でインストール

- `pip-review --interactive`：一つずつ `[Y]es / [N]o / [A]ll` で選択して更新
- `pip-review --auto`：全自動更新

###### `pip`コマンドを直接使用（標準的な方法）
```bash
# 個別アップデート
pip install --upgrade パッケージ名

# 複数同時アップデート
pip install --upgrade パッケージ1 パッケージ2
```

##### 3. `requirements.txt`を最新の状態に更新
```bash
python -m pip freeze > ファイルパス/requirements.txt
```

## Python標準ライブラリをいくつか紹介
筆者の独断と偏見で選んだパッケージであり、関連モジュールも全てを網羅してはいません。**これを知っておくと便利**という観点で選抜しています。

### `random`
文字列や数値を対象に、様々なランダム処理を持ったライブラリ。

- `choice`関数
第一引数に渡したシーケンス（※リストなどインデックス番号で要素を指定できるデータ構造）内の要素をランダムで取得（抽出）
```py
import random

target_list = ["Morning", "Afternoon", "Evening", "Night"]
random.choice(target_list)
```

- `shuffle`関数
第一引数に渡したシーケンス内の要素順序を（ランダム）シャッフルする
```py
import random

target_list = ["Morning", "Afternoon", "Evening", "Night"]
random.shuffle(target_list)
```

### `time`
時刻の取得や変換を行うモジュール。現在時刻（エポックからの経過秒数）を`float`（浮動小数点数）で返す。
※エポック（UNIXエポック）とは大抵のシステムにおいて「1970年 1月 1日 0時 0分 0秒」を指す。

- `time`関数
現在時刻（エポックからの経過秒数）を返す
```py
import time
print(time.time())
```

- `gmtime`関数
UTCにおける現在時刻を取得できる
```py
import time
print(time.gmtime())
```

- `localtime`関数
使用している環境（地域）の設定に基づいた現在時刻を取得できる
```py
import time

local_time = time.localtime()
print(local_time)
print(f"{local_time.tm_year}年{local_time.tm_mon}月{local_time.tm_mday}日 {local_time.tm_hour}時{local_time.tm_min}分{local_time.tm_sec}秒")
```

- `sleep`関数
指定した秒数だけプログラム実行を停止する
```py
import time

# 3秒後にこれ以降に続く処理を実行
time.sleep(3)
```

### [`urllib`](https://docs.python.org/ja/3.13/library/urllib.html)
webページを取得できる標準ライブラリ。

```py
from urllib.request import urlopen

# with 文を使用することで対象要素の「開く」と「閉じる」を自動的に処理し、
# 対象要素の「閉じ忘れ」を防止
with urlopen("https://example.co.jp/") as sitedate:
    for content in sitedate:
        # このままではバイト列で表示される
        # print(content)

        # str でバイト列を utf-8 文字列に変換
        print(str(content, encoding="utf-8"), end="")
```

---

<details>
<summary>Python ではデータベースをわざわざ用意しなくても SQLite が使える</summary>

### `sqlite3`
データベースをわざわざ用意する必要なく、RDBMS（リレーショナルデータベース・マネジメント・システム）の一種である`SQLite`を利用できる標準ライブラリ。

::: note info
処理を実行する上では`SQL`文の知識が必要です
:::

- `connect()`関数
データベースに接続し、接続を意味する`connection`オブジェクトを返す
```py
connection = sqlite3.connect("データベース名.db")
```

- `cursor()`メソッド
`connection`オブジェクトを通じて、データベース操作関連の機能を提供するカーソルオブジェクト（イテラブル）を取得する。
```py
cursor_obj = connection.cursor()
```

- `execute()`メソッド
RDBMS（本事例では`SQLite`）に対して`SQL`文を適用（発行・実行）する。`SQL`文の中でシングルクォートを使う場合があるので、引数に指定する文字列はダブルクォートで記述するのが無難。
```py
cursor.execute("SQL文")
```

- `executemany`メソッド
イテラブルに対して`SQL`文を繰り返し適用（発行・実行）する。
```py
cursor_obj.executemany("SQL文", イテラブル)
```

::: note info
- SQL文の`?`
`execute()`や`executemany`メソッドにおいて、`SQL`文の中に`?`を書いておくと、その位置に値を埋め込むことができる。
```py
# テーブルに行（値?, 値?）を追加
cursor_obj.executemany("INSERT INTO テーブル VALUES (?, ?)", イテラブル)
```
:::

- `commit()`メソッド
（データベースを変更する`SQL`文を実行した際などに）`connection`オブジェクトを通じて、データベースの更新処理を行う。
```py
connection.commit()
```

- `close()`メソッド
（`connection`オブジェクトを通じて）データベースへの接続を閉じる（終了する）ためのメソッド。
```py
connection.close()
```

</details>

---

## Python非標準ライブラリをいくつか紹介
フロントエンドで親しみ深い`npm`と同じ要領でライブラリをインストールして使用します。
`Python`で`npm`にあたるコマンドは`pip`（Windows） / `pip3`（Mac | Linux）です。

※一般的にはバージョン管理ツールや仮想環境下でインストールしていきます。

::: note info
Pythonでは「**仮想環境を使わない場合、`pip install パッケージ / モジュール名`はグローバル環境にインストールするという仕様**」です。

フロントエンド開発でもそうですが、何でもかんでも`npm`などをグローバルインストールしていたらverの競合が起きたり、PCのパフォーマンスに影響が出たりします。

そのため、特定のプロジェクトでは**専用または特化した仮想環境を用意する**のが一般的です。
:::

---

※実際に使ってみて便利だったもの、汎用性の高いものには<font color="red">★</font>マークを付けています（もちろん筆者の独断と偏見です）

### `NumPy`（ナムパイ）
**数値計算**でよく使われるライブラリ。

主要な機能は、数値を格納するための配列と、配列に対する各種の演算です。
この配列はベクトルや行列として使用したり、CSVファイルから読み込んだ数値を格納したり、各種の統計量を求めたりもできる。他のライブラリ（`Pandas`や`Matplotlib`など）でも使用されています。

```bash
pip install numpy
```

### `Pandas`（パンダス）
**データ処理**でよく使われるライブラリ。

データの読込、指定したデータの取得、統計量の計算などを簡単なプログラムで実現できます。

```bash
pip install pandas
```

::: note info
`Pandas`にはデータフレームという独自のオブジェクトがあるので、分かりやすくデータを表示したり、扱ったりしたい場合は`NumPy`より`Pandas`のほうが良いです。
:::

### `Matplotlib`（マットプロットリブ）
**インフォグラフィック（可視化）** ライブラリ。

`NumPy`の配列や`Pandas`のデータフレームなどから色々な種類の図を作成できます。

データの分析やクラスタリングなどのAIの手法を適用する際に相乗効果を発揮する可視化処理を行ってくれます。

::: note info
- クラスタリング
入力データをいくつかのクラスターに分類すること
:::

インフォグラフィックの利点としては数値（データ）が視覚化されることで、より適切な仮説出しができたり、施策の効果検証を行ったりしやすくなるところです。  

```bash
pip install matplotlib
```

::: note info
個人的に **データからのインフォグラフィック生成は、AIに処理対象データを渡して自然言語で実施させたほうが速くて楽** だと思います。

※ただし、使用するAIによって（※特に無料プランの場合）は**機密情報を渡さないよう注意が必要**です。
:::

### `scikit-learn`（サイキットラーン）
機械学習ライブラリ。

データに対して、分類、回帰、クラスタリング、次元削減といった機械学習に関する色々な手法を適用することができます。

```bash
pip install scikit-learn
```

### <font color="red">★</font> `Pillow`（ピロー）
画像ファイルの入出力や編集でよく使われるライブラリ。

筆者が使用した場面では、AIと組み合わせて画像からテキスト抽出または読み込み、別ライブラリ（`pdf2image`, `pypdf`など）と組み合わせてPDFからの画像生成など汎用性が高かったです。

例えば、矩形（くけい）や円といった図形をはじめ、画像の色数やサイズの変更も行えます。

```bash
pip install Pillow
# ライブラリ名は`Pillow`だがインストール後のパッケージ名は`PIL`となる
```

### `pypdf`
PDFファイルを扱う時に利用するライブラリ。

https://qiita.com/ryutarom128/items/6e5d36efb136f9595f07

```bash
pip install pypdf
```

<details><summary>PDFファイルを画像（JPG）に変換したい場合</summary>

### `Poppler`（PDF -> 画像変換）
PDFファイルを画像（JPG）へ変換するために`pdf2image`という非標準ライブラリと、それと併用する`Poppler`というC++製の外部ツールがあります。
`Poppler`のインストールが必要なので、利用OS別に以下の手順で`Poppler`をインストールしてください。

::: note warn
- **注意**
`Poppler`がインストールされていない場合、PDFから画像への変換処理が正常に動作しません。必ず事前にインストールしてください
:::

#### macOSの場合
```bash
brew install poppler
```

#### Windowsの場合
1. [Poppler for Windows (GitHub Releases)](https://github.com/oschwartz10612/poppler-windows/releases) からPopplerの最新zipファイルをダウンロードします。
    - `Release-xx.xx.x-x.zip` など最新のzipファイルを選択してください。
2. ダウンロードしたzipを解凍し、`bin`フォルダのパスを環境変数`PATH`に追加してください。

##### Windowsで「binフォルダのパスを環境変数PATHに追加」する手順
1. `スタート`メニューを右クリックし、`システム`を選択します。
2. `システムの詳細設定`をクリックします。
3. `環境変数`ボタンをクリックします。
4. `システム環境変数`の`Path`を選択し、`編集`をクリックします。
5. `新規`をクリックし、`C:\path\to\poppler\bin`（実際のパスに置き換えてください | 例: `C:\poppler-24.08.0\Library\bin`）を追加します。
6. `OK`をクリックして全てのダイアログを閉じます。

#### Linuxの場合（Ubuntu系）
```bash
sudo apt-get install poppler-utils
```

::: note info
#### 「PDF → 画像, 画像 → PDF」という両方向の処理フローの違いについて
PDFの読み込み・解析には専用のツール（`Poppler`）が必要となるものの、PDFの生成自体は既存の Python ライブラリだけで十分です。
というのも、**PDF形式は造りが複雑なのでPDFを読み取るには高度な解析が必要**となりますが、作成する分には比較的シンプルに行えるのです。

- PDF → 画像: `pdf2image` + `Poppler`が必要（外部ツールのインストールが必要）
- 画像 → PDF: `Pillow`などの画像ライブラリで対応可能（追加の外部ツールは不要）
:::

</details>


### <font color="red">★</font> `openpyxl`（オープンパイエックスエル）
Excelファイルを扱う時に利用するライブラリの一つ。

```bash
pip install openpyxl
```


::: note info
個人的に`matplotlib`（インフォグラフィック生成ライブラリ）同様、 **エクセルやスプレッドシートの生成・加工などは、AIに自然言語で実施させたほうが速くて楽** だと思います。

ただし、処理を微調整したい際になど当該ライブラリの知識を持っておくと適切なプロンプトを作れる確率が高まると思います。
:::

### <font color="red">★</font> `Requests`（リクエスツ）
webスクレイピング（webアクセス）用のライブラリ。

標準ライブラリ[`urllib`](#urllib)よりも簡潔なプログラミングで手軽にWebを扱えます。

```bash
pip install requests
```

::: note alert
- **webスクレイピングについて**
webスクレイピングは、受けるサイトの負荷が大きく（程度によっては）犯罪にもなり得る危険な行為なので、第三者のサイトや自身と関係のサイトへ行うのは控えるべき。
:::

### <font color="red">★</font> [`BeautifulSoup`](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
HTMLファイル構造を解析して必要なデータを抽出するためのライブラリ。

要素の階層構造に基づいた処理が可能なので文字列のパターンマッチ（正規表現）よりも確実かつ容易にデータを取り出せる（可能性がある）

```bash
pip install beautifulsoup4
```

```py
soup = BeautifulSoup(HTMLの文字列, 'html.parser')
```

<details>
<summary>Requests と BeautifulSoup を使った事例</summary>

```py
res = requests.get("取得したいサイトURL文字列")

# サイトの文字コードを自動推定して設定
# 日本語サイトの文字化けを防ぐエンコーディング処理
res.encoding = res.apparent_encoding

# BeautifulSoup で、取得したwebページの各コンテンツ（res.text）をHTML解析
soup = BeautifulSoup(res.text, "html.parser")
```

- 実装例
```py
# find メソッド： 該当する最初の要素を返す（存在しなければ None）
soup.find(要素名)
# soup.find("a")

soup.find(要素名, 属性名=値, ...) # 属性名はオプショナル
# class 属性を指定する場合は Python の class と競合するため class_ と記述（指定）する
# soup.find("span", class_="release-number")

# find_all メソッド： 該当する全ての要素を返す（存在しなければ None）
# 返り値はイテラブルなのでループ処理可能
soup.find_all(要素名)
# soup.find_all("li")

soup.find_all(要素名, 属性名=値, ...) # 属性名はオプショナル
```

上記`html.parser`とは、 Python 標準の HTML用パーサー（構文解析器）のことで、サードパーティ制のHTMLパーサーを利用（指定）することも可能です。
使用するパーサーによって、HTMLの記述に対する柔軟性や処理の速度が異なります。

</details>

### `schedule`
あらかじめ設定したスケジュールに基づいて、指定した処理（関数）を定期的に実行する非標準ライブラリ。

```bash
pip install schedule
```

<details>
<summary>schedule 実装例一覧表</summary>

`hours`や`minutes`といった複数形の部分は`hour`,`minute`など単数形でも問題ありません。

#### 基本的な間隔設定
- `.seconds`: `schedule.every(10).seconds.do(関数)` ……… 10秒ごとに実行
- `.minutes`: `schedule.every(30).minutes.do(関数)` ……… 30分ごとに実行
- `.hours`: `schedule.every(2).hours.do(関数)` ……… 2時間ごとに実行
- `.days`: `schedule.every(3).days.do(関数)` ……… 3日ごとに実行
- `.weeks`: `schedule.every(2).weeks.do(関数)` ……… 2週間ごとに実行

#### 特定時刻の設定
- `.at()`: `schedule.every().day.at("10:30").do(関数)` ……… 毎日10:30に実行
- `.hour.at()`: `schedule.every().hour.at(":00").do(関数)` ……… 毎時00分に実行

#### 曜日指定
- `.monday`: `schedule.every().monday.do(関数)` ……… 毎週月曜に実行
- `.tuesday`: `schedule.every().tuesday.do(関数)` ……… 毎週火曜に実行
- `.wednesday`: `schedule.every().wednesday.at("13:15").do(関数)` ……… 毎週水曜13:15に実行
- `.thursday`: `schedule.every().thursday.do(関数)` ……… 毎週木曜に実行
- `.friday`: `schedule.every().friday.do(関数)` ……… 毎週金曜に実行
- `.saturday`: `schedule.every().saturday.do(関数)` ……… 毎週土曜に実行
- `.sunday`: `schedule.every().sunday.do(関数)` ……… 毎週日曜に実行

#### タグ付け管理
- `.tag()`: `schedule.every().day.do(関数).tag('daily')` ……… タグ付けしてジョブを管理
- `.clear()`: `schedule.clear('daily')` ……… 特定タグのジョブをキャンセル

#### 引数付き関数
- `.do()`: `schedule.every().day.do(greet, name="Alice")` ……… 関数に引数を渡して実行

#### 条件付き実行
- `CancelJob`: `return schedule.CancelJob` ……… 条件に応じて実行を停止

</details>

#### `run_pending`関数
所定のタイミングになったスケジュール（に登録した）関数を実行する
```py
# 1行ごとにスケジュールを（延々と）実行
while True:                 # 無限ループ
    schedule.run_pending()  # スケジュール（指定した定期的な処理）を実行
    time.sleep(1)           # 1秒後に処理実行
```

## さいごに
本記事ではPythonにおける便利なライブラリを紹介してきました。
そして本記事が「フロントエンド側の人間が 1からPythonを学んでみて」というテーマで書いていくシリーズ記事の最後です。

本年（2025年）筆者が Python を学んだのは冒頭にも書いた通り「**業務効率化を絶対目標**」としたためです。
実際、Python を体系的に学んできたお陰でAIを活用する上でもスムーズなプロンプトを生成できて作業効率が向上しました。

::: note info
※あまり慣れていない言語やライブラリ、フレームワークをAIを使って実装していく場合は、こちらも**AIを活用して振り返りすることを推奨**します。これによって**より身につきやすく**なったと筆者は実感しています
:::

本年は Python による業務効率化（一部自動化）ツールを作成したお陰で、筆者が求めていた**イレギュラー対応を加味したバッファ駆動なスケジュール進行**──つまり、**余剰時間・余裕（バッファ）を作ることを目的にした働き方**が少しは実現できました！

昨今、ノーコードでも作業ツールを簡単に作れますが、**その反面として特化した処理の実装はどうしても難しい**印象があります。
そこで柔軟性を求めてAIを活用しても、**基礎知識がないと何が正しくて、何が間違っていて、どう指示すれば良いのかすら判断できない**でしょう。

基礎的な言語学習は面白くないし、面倒くさい部分もありますが、結局**地道に基礎力を高めていく**のが一番の近道なのだと思います。

ここまで読んでいただき、ありがとうございました。

