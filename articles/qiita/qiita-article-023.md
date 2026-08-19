---
title: 【WordPress】Local（by flywheel）のライブリンクで画像が表示されない時の応急処置
tags: WordPress LocalbyFlyWheel 魔改造 debug
author: benjuwan
slide: false
---
## はじめに
WordPress開発・制作ツールで有名な[`Local`](https://localwp.com/)にはライブリンクという共有リンクを生成してくれる機能があります。
通常WordPressサイトを閲覧するにはサーバーを用意して、そこにWordPressを構築して〜ということが必要になりますが、`Local`ではありがたいことに開発〜共有リンクでの閲覧まで一貫してWordPressサイト環境を提供してくれています（＝開発段階ではサーバーはもちろんドメインも用意する必要がない）。

実は最近、弊社の非エンジニアたちによるWordPress制作チームが立ち上がり、にわかにwebへの関心が高まっている社内事情です。どうやらすでに（社内向け？の）案件があるそうで、チームの方々には`Local`を各自導入して触ってもらっています。
（ちなみに筆者は別チームなので積極的に携わる状況にありません）

各々がWordPressをキャッチアップしながら作っているのですが、先日 **「ライブリンクで用意したサイトの画像が表示されない」** という相談を受けました。

今回は本記事の表題のあるように、共有リンク（ライブリンク）のサイトで画像が表示されないという現象が起きた原因と対処法を情報共有しようと思います。

ちなみに、筆者が確認した限り**表示されない画像というのはエディターの投稿機能[画像]で用意したものに限定**されます。テンプレートファイルにて`get_template_directory_uri()`などで読み込んだ画像は表示されていました。
※試してないですが、[ギャラリー][カラム]など画像系統の投稿機能で用意するものもライブリンクでは表示されないかもしれません。

## 対象読者と環境
- 対象読者
    - 非エンジニア
    - WordPressに関心のある方（エンジニア・非エンジニア問わず）
    - `Local`関連の情報を探している方

環境はざっくり以下になります。`local`のインストール時は色々と面倒があったのですが、今回の話では環境はあまり関係がないと思います。
- 環境
    - intel Mac（非エンジニア）
    - M1 Mac（筆者）
    - テーマ：lightning
    - Web server：nginx
    - PHP：8.1.29
    - DB：MySQL 8.0.16
    - WordPress Ver：6.6.2

## 結論
- ライブリンクで画像が表示されない原因
開発時はSSLされていないがライブリンクではSSLされているため混在コンテンツが発生したため。

::: note
- 混在コンテンツとは
> HTTPS ページでは Mixed Contents と呼ばれる問題がよく発生します。これは、ページのサブリソースが安全ではない http:// で読み込まれることを指します。ブラウザはデフォルトで、スクリプトや iframe などのさまざまなタイプの Mixed Contents をブロックします。しかし、イメージ、オーディオ、動画は依然として読み込みが許可されており、それがユーザーのプライバシーとセキュリティを脅かしています。（...中略）
Mixed Contents を読み込むと、ページが安全とも安全でないとも言えない中間状態となるので、ブラウザのセキュリティ UX にも混乱が起こります。
Chrome 79 から開始される一連の手順を通して、 デフォルトですべての Mixed Contents がブロックされるように徐々に移行されます。

参照：[HTTPS の Mixed Contents と決別する](https://developers-jp.googleblog.com/2019/11/https.html)
:::

つまり今回の問題は開発時もSSLしておけば問題がないと思われます（申し訳ないのですが未検証なので確証はありません）。

`Local`の各種サイト管理画面で[SSL]欄に以下のような表示があればSSLされていません。

![スクリーンショット 2024-10-05 13.18.23.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/9116cdae-2cc0-1ff3-7b2b-0fd0a5491936.png)


以下のページがSSLへの対応法を詳しく解説して下さっています。他にも探せば情報はたくさんあると思います。今は生成AIもあるのでそちらを頼っても良さそうですね！

https://pc-walk.com/cant-configure-ssl/

しかし、上記のような設定を行う暇もない状況の方に以下の応急処置を提供します。
（実際、筆者が今回の応急処置を採ったのは相談者から「あと数時間で役員にプレゼンするのに画像が表示されないのは困る」という切迫した状況からでした）。

- ライブリンクで画像が表示されない時の応急処置
`img`タグの不要（になってしまっている）属性をプログラム（本記事では`JavaScript`）で強制的に排除する

以下2つが応急処置コードです。
```js
/* ファイル名：adjustLiveLinkUrl.js */
document.addEventListener("DOMContentLoaded", () => {
    const figureImgs = document.querySelectorAll('img');
    figureImgs.forEach(figureImg => {
        if (figureImg.srcset.length > 1) {
            figureImg.removeAttribute('srcset'); // 邪魔な srcset 属性を排除
        }
    })
});
```

上記`js`ファイルを読み込むための記述です。`functions.php`に書きます。
（記載場所はどこでも良いですがファイルの一番下の方にでも記載するといいと思います）
```php
function theme_enqueue_styles_scripts() {
    wp_enqueue_script('adjustLiveLinkUrl', get_option('site_url').'/wp-content/themes/lightning/adjustLiveLinkUrl.js');
  }
add_action('wp_enqueue_scripts', 'theme_enqueue_styles_scripts');
```

## 応急処置までの経緯
ここからはキャプチャ画像を使って説明していきます。

### 理想とする表示
まずはじめに開発時の状況です。つまり理想とする表示になります。

![スクリーンショット 2024-10-05 13.09.09.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/710d5ce5-1a95-f5b7-01e7-0e8a5d234a64.png)

当然ですが、開発環境（非SSL環境）ではこのようにきちんと画像が表示されています。

### 困った表示
次にライブリンクサイト（SSL環境）の状況です。

![スクリーンショット 2024-10-05 13.11.45.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/6aca4412-1f1b-8bb5-f50e-e7b633088812.png)

ログに混在コンテンツのエラーが記載されていますね。
当たり前ですが本来はしっかり混在コンテンツのエラーを対処する必要があります。

今回は応急処置なので先に述べた力技を使って以下の形にしました。

### （力技による非推奨な）理想とする表示

![スクリーンショット 2024-10-05 13.16.00.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/8e00a82a-0346-4966-5b89-8bbd51073a0c.png)

## 力技（応急処置方法）の再掲
- `img`タグを整形する`JavaScript`コード
```js
/* ファイル名：adjustLiveLinkUrl.js */
document.addEventListener("DOMContentLoaded", () => {
    const figureImgs = document.querySelectorAll('img');
    figureImgs.forEach(figureImg => {
        if (figureImg.srcset.length > 1) {
            figureImg.removeAttribute('srcset'); // 邪魔な srcset 属性を排除
        }
    })
});
```

- `functions.php`（上記`JavaScript`を読み込む）
```php
function theme_enqueue_styles_scripts() {
    wp_enqueue_script('adjustLiveLinkUrl', get_option('site_url').'/wp-content/themes/lightning/adjustLiveLinkUrl.js');
  }
add_action('wp_enqueue_scripts', 'theme_enqueue_styles_scripts');
```
## さいごに

::: note
これはあくまで応急処置なので用が済んだら闇に葬ってください。そして、もし混在コンテンツが発生すればその時は正しく対応してください。
この応急処置（力技）はどうしても時間がない方のための魔改造です。
:::

一応、修正方法を貼っておきます。

![スクリーンショット 2024-10-05 14.23.40.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/6efbf101-e819-c0fa-12e8-49b401b3cd75.png)

<font color='lightgray'>（……変なことするよりも最初からプラグイン使っていれば良かったのでは？）</font>

状況に応じて上記キャプチャ元の以下ページを参照ください

https://digitalidentity.co.jp/blog/seo/seo-tech/mixed-contents.html

ここまで読んでいただき、ありがとうございました。
どなたかのお役に少しでも立てれば幸いです。

## 参考

https://developers-jp.googleblog.com/2019/11/https.html

https://pc-walk.com/cant-configure-ssl/

https://digitalidentity.co.jp/blog/seo/seo-tech/mixed-contents.html

