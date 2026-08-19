---
title: "【Python】webページ内の全画像 alt漏れをチェックして AIが適切な alt文を生成してくれる機能"
emoji: "🐍"
type: "tech"
topics:
  - "seo"
  - "フロントエンド"
  - "pyhton"
  - "gemini"
published: true
published_at: "2025-06-07 16:33"
---

## はじめに
アクセシビリティやSEOに関わってくる重要な要素の一つに画像の`alt`属性があります。

alt属性についてご存知の方も多いかもですが以下に簡潔な概要を載せておきます
- 画像の読込失敗や視覚情報を得られない方などを考慮して**原則記述することが推奨**されている
- 装飾系やパターン、テクスチャなど**コンテンツ情報に影響がない画像の`alt`には空文字を指定**する（※不要だからと`alt`自体を指定しないのはNG）
- ぐだぐだと長い文章を記述するのではなく、端的に意味のある**適切な`alt`文を記述**するのが望ましい

こんな`alt`属性ですが、最後の**適切な`alt`文を記述**するという部分が中々難しいものです。
それに制作中は取り急ぎアタリのダミー画像を入れておいて後から差し替える場合に記述漏れするケースも少なくないと思います。

（`ESLint`の設定とかで防げると思うのですが）今回、そういった問題をクリアするプログラムをPythonで作ってみました。

筆者は普段、静的HTMLやWordPressをはじめ、React、Next.jsなどフロントエンドを軸にしており、今年に入ってからPythonを学び出した初心者です。
記述内容に誤りなどあるかもしれませんので、何かお気づきの点がございましたらコメント等でお教えいただけますとありがたいです。

## 対象読者
- Python初心者
- Pythonに関心のあるフロントエンドエンジニア
- webデザイナーやコーダー、ディレクター
- SEO担当者

## つくったもの
タイトル通り、指定したwebページ内の全画像 alt漏れをチェックして AIに適切な alt文を生成してもらう機能です。

:::message alert
本機能はwebスクレイピングします。
試用される場合は**必ず自身が管理するサイトや関係するサイトでのみ**行ってください。
:::

「とりあえず使ってみるか」という方は[使い方](#使い方)へ飛んでください。

1. コマンドライン引数で指定したwebページをスクレイピング
2. `alt`指定漏れの画像を`pillow`ライブラリで生成
3. それらをLLM（`Gemini`）に読み込ませて適切な`alt`文を自動生成
4. 最終結果として「DOM要素（`img`）」と「AIが生成した`alt`文」をまとめたエクセルファイルを出力

![](https://storage.googleapis.com/zenn-user-upload/6ccb7e5d5937-20250607.jpg)

上記キャプチャ画像は実行サンプル例です。
右側が対象となったwebページ一部で、左側が処理結果のエクセルファイルの内容となります。

:::message
筆者は基本的に**極力無料主義者**なので、今回無料の`Gemini`API（`1.5`）で行っています。
`2.5`とか新しい`ver`だと精度は大きく変わってくると思います。

- [`Gemini`各モデルについて](https://ai.google.dev/gemini-api/docs/models?hl=ja&_gl=1*cf3ayb*_up*MQ..*_ga*MTAzMDk0MDk5OC4xNzQ5NTEyODU2*_ga_P1DBVKWT6V*czE3NDk1MTI4NTUkbzEkZzAkdDE3NDk1MTI5NTYkajYwJGwwJGg3MDY1NjM3MTE.)

- [レート制限について](https://ai.google.dev/gemini-api/docs/rate-limits?hl=ja&_gl=1*139atk2*_up*MQ..*_ga*MTAzMDk0MDk5OC4xNzQ5NTEyODU2*_ga_P1DBVKWT6V*czE3NDk1MTI4NTUkbzEkZzAkdDE3NDk1MTI4NTUkajYwJGwwJGg3MDY1NjM3MTE.#free-tier)

:::

- 全画像の alt属性にしっかり記述されている場合は何もしません（以下のようにログ出力して処理終了）
![](https://storage.googleapis.com/zenn-user-upload/b0f4506d5090-20250607.jpg)

### コマンドライン引数で対象webページを指定
Pythonにはコマンドライン引数というものがあって、これを使うことでファイル実行時に処理対象を柔軟に指定できます。
```bash
python sample-py.py <コマンドライン引数>
```
実行後のコマンドライン引数配列（`sys.argv`）の先頭（`[0]`）はファイル名（上記事例だと`sample-py.py`）となり、以降のインデックスにファイル実行時に記述した内容が格納されていきます。

今回、筆者は`check_sys_args`というモジュールでコマンドライン引数関連の処理を実装しています。

- コマンドライン引数に関するコード（モジュール名：`check_sys_args`）
```py
import sys  # コマンドライン引数を扱う


# URLパスをチェックするプライベートメソッド
def _check_url_path(target_url):
    # print(target_url[0])
    has_http = "http" in target_url[0]
    has_https = "https" in target_url[0]
    has_slash = "/" in target_url[0]
    if has_http or has_https or has_slash:
        return target_url[0]

    sys.exit("URLを指定してください")


def check_sys_args():
    if len(sys.argv) != 2:
        # （コマンドライン引数が1つでない場合は）引数に指定した文字列を表示して処理終了
        this_filename = sys.argv[0]  # 先頭（1つ目）はファイル名
        sys.exit(
            f"'{this_filename}'に必要な引数は「1つ」ですが、指定された引数は「{len(sys.argv) - 1 if len(sys.argv) == 1 else len(sys.argv)}つ」です"
        )

    # コマンドライン引数が1つの場合（正常処理パターン）
    except_filename_args = sys.argv[1:]  # 先頭以外の全ての引数

    target_site = _check_url_path(except_filename_args)

    return target_site


if __name__ == "__main__":
    check_sys_args()
```

### webスクレイピング ＆ 画像生成準備
`requests`と`BeautifulSoup`という非標準ライブラリを使っています。

前者はwebページの情報（コンテンツ）取得に使っていて、後者はページ内のDOM要素を扱うために使っています。

プログラムの流れとしては以下です
1. `requests`で、webページの情報（コンテンツ）取得
2. `BeautifulSoup`で、webページ内の全`img`の`alt`属性をチェックして対象画像を抽出
3. 抽出した画像（パスデータ）たちを、次の処理を担うAI（`Gemini`）に渡す

- webスクレイピングして画像データを解析するコード
このソースコードファイルが本機能のコア部分なので、先のコマンドライン引数関連のものをはじめに各種モジュールを読み込んでいます。

```py
import requests  # 指定したWebページからコンテンツ（情報）を取得
from bs4 import BeautifulSoup  # 取得したwebページの各コンテンツをHTML解析

# 独自モジュール（コマンドライン引数をチェック）
from check_sys_args import check_sys_args

# 独自モジュール（Gemini による画像チェック及び altテキストの生成）
from create_alt_txt_byGemini import create_alt_txt_byGemini

# 独自モジュール（画像パスと、Gemini が生成した altテキストをエクセルファイルに保存）
from create_xlsx_file import create_xlsx_file

target_site = check_sys_args()

# 指定したWebページからコンテンツ（情報）を取得
res = requests.get(target_site)
res.encoding = res.apparent_encoding

# 取得したwebページの各コンテンツをHTML解析
soup = BeautifulSoup(res.text, "html.parser")


# check_img_alt： 指定したWebページ内における alt属性が指定されていない画像に適切な altテキストを生成する関数
def check_img_alt():
    images = []

    for imgs in soup.find_all("img"):
        # 指定したwebページ内の img 要素の alt属性をチェック
        # .get()：引数に指定した属性名の有無を取得（無い場合はNone）
        img_alt = imgs.get("alt")

        # 対象画像が alt属性を持っていて、1文字以上指定されている場合は処理スキップ
        if img_alt is not None and len(img_alt) > 0:
            continue

        images.append(imgs)

    if len(images) > 0:
        results = create_alt_txt_byGemini(images, target_site)
        create_xlsx_file(results=results)
        print("すべての処理が完了しました")

    else:
        print(f"{target_site}内の画像データの alt属性は全て記入されています")


check_img_alt()
```

### 画像生成 & AIへの処理要求
`pillow`と`io`という非標準ライブラリで（`alt`漏れの）画像を生成し、`Gemini`に画像チェック及び適切な`alt`文を用意してもらいます。

- alt漏れの画像生成及びAI（`Gemini`）へ処理要求するコード（モジュール名：`create_alt_txt_byGemini`）
```py
import google.generativeai as genai  # Google Gemini API用ライブラリ
from urllib.parse import urljoin  # URLの結合・正規化
import requests  # Webページからコンテンツ（情報）を取得
from PIL import Image  # 画像処理用ライブラリ（Pillow）
from io import BytesIO  # バイナリデータをファイルのように扱う
from dotenv import load_dotenv  # .envファイルから環境変数を読み込む
import os  # OSの環境変数操作用


# Gemini APIの設定
load_dotenv()  # ローカルの .env ファイルから環境変数（秘匿情報など）を読み込んで、os.environ で参照できるようにする関数
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
# model = genai.GenerativeModel("gemini-1.5-pro")  # より詳細な画像認識を重視する場合
model = genai.GenerativeModel("gemini-1.5-flash")  # 処理速度を重視する場合


# Gemini への処理要求
def _request_Gemini(img: str, img_url: str, results: list):
    response = requests.get(img_url)

    if response.status_code != 200:
        print(f"レスポンスエラー：status-[{response.status_code}]\n{img}")
        return

    # レスポンス内容をバイナリデータ化して画像データとして出力（開く）
    image = Image.open(BytesIO(response.content))

    # Geminiに画像を解析してもらう
    response = model.generate_content(
        [
            """
            ## タスク
            あなたはSEOの知見が豊富なエージェントです。この画像の内容を alt属性として最適な文章となるよう日本語で生成してください

            ## 条件
            装飾系やパターン、テクスチャなどデザイン要素としての画像である場合は空文字（""）を返してください
            """,
            image,
        ]
    )

    suggested_alt = response.text
    # dict 形式でリストに格納
    results.append({"original_img": img, "suggested_alt": suggested_alt})


# 実引数は呼び出し元で指定するので、仮引数としてオプショナルな指定（None）に留めておく
def create_alt_txt_byGemini(
    img_list: list | None = None, target_site: str | None = None
):
    results: list[str] = []

    if img_list is None or target_site is None:
        return

    for img in img_list:
        try:
            # 画像URLを取得して正規化
            img_url: str = img.get("src")

            if img_url is None:
                return

            # 相対パス判定フラグ
            is_not_absolute_pass = img_url.count("../") > 0
            # 文字列が"/"開始かどうかの判定フラグ
            is_not_startWith_scheme = img_url.startswith("/") is False

            if is_not_absolute_pass or is_not_startWith_scheme:
                # urljoinを使用して相対パス（'../'）を解決
                img_url = urljoin(target_site, img_url)

            # Gemini への処理要求
            _request_Gemini(img, img_url, results)

        # Exception：大部分の例外の基底クラス
        except Exception as e:
            print(f"エラーが発生しました | create_alt_txt_byGemini.py : {e}")
            continue

    return results


if __name__ == "__main__":
    create_alt_txt_byGemini()
```

#### AI（`Gemini`）への処理要求に関するコード
今後の取り回しが楽になるよう、AI（`Gemini`）への処理要求に関するコード（`_request_Gemini`）は以下のように分離しています。

今回`Gemini`を使っていますが、この部分を各生成AI（`ChatGPT`, `Claude`, etc...）に適したコードに差し替えれば他のものでも機能すると思います。
（※筆者未検証です。すみません）

```py
# Gemini への処理要求
def _request_Gemini(img: str, img_url: str, results: list):
    response = requests.get(img_url)

    if response.status_code != 200:
        print(f"レスポンスエラー：status-[{response.status_code}]\n{img}")
        return

    # レスポンス内容をバイナリデータ化して画像データとして出力（開く）
    image = Image.open(BytesIO(response.content))

    # Geminiに画像を解析してもらう
    response = model.generate_content(
        [
            """
            ## タスク
            あなたはSEOの知見が豊富なエージェントです。この画像の内容を alt属性として最適な文章となるよう日本語で生成してください

            ## 条件
            装飾系やパターン、テクスチャなどデザイン要素としての画像である場合は空文字（""）を返してください
            """,
            image,
        ]
    )

    suggested_alt = response.text
    # dict 形式でリストに格納
    results.append({"original_img": img, "suggested_alt": suggested_alt})
```

APIキーは`.env`ファイルで管理していて`python-dotenv`という非標準ライブラリと`os`という標準ライブラリで実装しています。

フロントエンド（React, Next.js）と違って、Pythonでは`.env`ファイルを扱うためにライブラリが必要なのが少し意外でした。

```py
# Gemini APIの設定
load_dotenv()  # ローカルの .env ファイルから環境変数（秘匿情報など）を読み込んで、os.environ で参照できるようにする関数
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
```

このモジュールで工夫した部分は、対象webページ内における画像パスの指定方法に応じた処理分岐です。
```py
# 相対パス判定フラグ
is_not_absolute_pass = img_url.count("../") > 0
# 文字列が"/"開始かどうかの判定フラグ
is_not_startWith_scheme = img_url.startswith("/") is False

if is_not_absolute_pass or is_not_startWith_scheme:
    # urljoinを使用して相対パス（'../'）を解決
    img_url = urljoin(target_site, img_url)
```
ページによって画像パスの指定はバラバラなので、相対パス（`../`）または`img/画像ファイル名`という指定などをチェックして適切な画像パスとなるよう工夫しています。
これがないと、以降の処理（`_request_Gemini`：AIへの処理要求）でケースによっては解析エラーが出て機能しません。

### 最終結果としてエクセルファイルを出力
最終結果として「DOM要素（`alt`漏れの`img`）」と「AIが生成した`alt`文」をまとめたエクセルファイルを出力します。

- エクセルファイルを出力するコード（モジュール名：`create_xlsx_file`）
```py
import os
import openpyxl

# Excelのセルの配置やテキストの表示方法を制御するために使用する Alignment クラスをインポート
from openpyxl.styles import Alignment


def create_xlsx_file(results=None):
    # 保存先ディレクトリとファイルパス
    save_dir = "../dist"
    save_path = os.path.join(save_dir, "img_lists.xlsx")

    # 当該ディレクトリがなければ作成
    # exist_ok=True とすると既に存在しているディレクトリを指定してもエラーにならない
    os.makedirs(save_dir, exist_ok=True)

    # ワークブックはExcelのブックに相当し、自動的にシートも生成される。
    img_lists_workbook = openpyxl.Workbook()

    # 操作対象ブック（オブジェクト）をアクティブにすることでセルの編集が行える
    img_lists_worksheet = img_lists_workbook.active

    if img_lists_worksheet is None:
        return

    # 読み込み：ワークシート[セル位置].value
    img_lists_worksheet["A1"] = "画像要素（img タグ）"
    img_lists_worksheet["B1"] = "Gemini が生成した alt文"

    # 幅を調整（列名での指定）
    img_lists_worksheet.column_dimensions["A"].width = 75
    img_lists_worksheet.column_dimensions["B"].width = 100

    if results is not None:
        for i, result in enumerate(results, 2):
            # 行の高さ設定（行単位での指定）
            # 15が標準の1行分（デフォルト）なので 30は約2行分
            img_lists_worksheet.row_dimensions[i].height = 30

            # 折り返しの設定
            img_lists_worksheet[f"A{i}"].alignment = Alignment(wrap_text=True)
            img_lists_worksheet[f"B{i}"].alignment = Alignment(wrap_text=True)

            # 書き込み：ワークシート[セル位置] = 値
            img_lists_worksheet[f"A{i}"] = str(result["original_img"])
            img_lists_worksheet[f"B{i}"] = str(result["suggested_alt"])

        # 同名ファイルが存在する場合は上書き保存され、無い場合は新規作成となる。
        img_lists_workbook.save(save_path)

    else:
        print("エラー：引数 results が渡ってきていません")
        return


if __name__ == "__main__":
    create_xlsx_file()
```

処理が完了すると、ルートに`dist`フォルダが作られて、そこに`img_lists.xlsx`というエクセルファイルが作成されます。

これが冒頭で掲載したサンプルキャプチャ画像の左側部分になります。

![](https://storage.googleapis.com/zenn-user-upload/6ccb7e5d5937-20250607.jpg)

## 使い方
1. ルートに`.env`ファイルを用意
2. 仮想環境を構築（初回のみ）または仮想環境を立ち上げる（初回以降）
    - 仮想環境をアクティベートすると以下のようなコマンド画面になります
```bash
# WindowsOS の場合
(仮想環境名) C:\~~~~\img-alt-generator-py\仮想環境ディレクトリ名>

# MacOS の場合
(仮想環境名) user-PC-name 仮想環境ディレクトリ名
```
3. `utils`ディレクトリへ移動して`check_img_alt.py`を実行

###  `JavaScript`での`alt`漏れチェックコード
実際に使う前に、とりあえずフロントエンドで`alt`漏れがあるページかどうかチェックしたい方は以下コードを、開発者ツールの`Console`画面に張り付けてチェックしてみてください

```js
const allImg = document.querySelectorAll('img');
for(const img of allImg){
    if(!img.getAttribute('alt') && img.getAttribute('alt').length === 0){
        console.log(img);
    }
}
```

- `img`（DOM要素）の各種プロパティまでも把握したい場合は以下
```js
const allImg = document.querySelectorAll('img');
noAltImgs = Array.from(allImg).filter(img => img.alt.length === 0);
console.log(noAltImgs);
```

### ルートに`.env`ファイルを用意
- `.env`
```bash
GOOGLE_API_KEY="発行した Geminiの APIキーを記述"
```

### 仮想環境を構築（初回のみ）
ターミナル／コマンドプロンプトを開いてルート（ファイルの最上階層）にいる状態で以下フローを実行
```bash
mkdir venv # venv ディレクトリ（仮想環境ディレクトリ）を作成
cd venv    # 作成した仮想環境ディレクトリ（`venv`）へ移動

# 新しい仮想環境を作成してアクティベート
# WindowsOS の場合: python -m venv env
python3 -m venv env # env{は仮想環境名}

# WindowsOS の場合: env\Scripts\activate
source env/bin/activate

# 3. 仮想環境をアクティベートした状態で、パス指定して`requirements.txt`から各種ライブラリをインストール
pip install -r ../requirements.txt # `../requirements.txt`なのは`requirements.txt`がルート直下にあるため
```

### 仮想環境を立ち上げる（初回以降）
```bash
# 1. 仮想環境を格納しているディレクトリへ移動（存在しない場合は上記を参照に新規作成）
cd venv

# 2. 仮想環境をアクティベート
# WindowsOS の場合: env\Scripts\activate
source env/bin/activate
```

### `utils`ディレクトリへ移動して`check_img_alt.py`を実行
必ず**仮想環境をアクティベートした状態**で以下フローを実行
```bash
# ※必要に応じて以下コマンドを実行
# 仮想環境をアクティベートした直後だと`venv`ディレクトリへいるためルートに移動する
# cd ../

# `utils`ディレクトリへ移動
cd utils

# 解析したいWebページURLを`コマンドライン引数`に指定してファイルを実行
# WindowsOS の場合:
# python check_img_alt.py https://example.com/archive/items/index.html

python3 check_img_alt.py https://example.com/archive/items/index.html
```

## さいごに
今回のPythonプログラムは以下のGitHubにありますので、関心のある方はご自由にしてください。

https://github.com/Benjuwan/img-alt-generator-py