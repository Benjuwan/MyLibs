title: Google Forms で任意の差出人を指定したい

tags: GoogleForms mail GAS 初心者

## Google Forms
説明不要かもしれませんが、[`Google Forms`](https://www.google.com/intl/ja_jp/forms/about/)とは『Google』が無料で提供してくれているメールフォームサービスです。
> オンライン フォームやアンケートを簡単に作成して共有し、回答をリアルタイムで分析できます。

公式サイトのファーストビューに記載している通り、イベントの告知や募集、アンケート調査など幅広く活用できます。

Google アカウントがあれば手軽に利用できるので、昨今のローコード・ノーコードの流れもあって非エンジニアの方々も使われている印象です（何より操作が直感的で簡単ですしね）。

今までだと独自のメールフォームを都度用意・設定しなくてはならなかったところが手軽に実装できるので、筆者も実務で何度か使用しています。

今回は、筆者が実務の中で少し手間取った**差出人名と送信元メールアドレスの調整**を Tips（自身の備忘録）として皆様と共有できればと記事を書いていこうと思います！

## 自身のＧアカウントを使うと差出人は自分になる
「何を当たり前のことを……」という話なのですが、筆者が実務で利用する際は自身の（ビジネス用）アカウントで行いました。
本来は会社・事業所からの情報発信などを担う部分は、その会社・事業所で用意した企業アカウントを用意・利用すべきです。釈迦に説法ですね。

しかし筆者の所属する会社では「なる早で、いい感じにやっといて！」というスタイルが多く……、それでも本来はしっかり説得や説明なりをして企業アカウントを作って進めるべきなのですが、納期が厳しかったりして自身のアカウントで行うことに（良い子はマネしないで！）。

そこでフォームを用意して`GAS`で自動返信機能も実装し、いざ送信テストを行った際に……
「差出人が自分じゃん！！」と（当たり前のことに）驚きました。

下記の「`sendername`には事業所名、`senderadress`には当該メールアドレスを記入しているのに何故だ？」と、恥ずかしながら原因が**自身のアカウントを使っているから**ということに中々気づけませんでした。
```javascript
.
.
var sendername = "差出人名";
var senderadress = "example.mail@gmail.com";
.
.
```

## Gmailにおける設定で当該メールアドレスをエイリアスに追加する
[Gmail のヘルプ](https://support.google.com/mail/answer/22370#zippy=%2C%E5%8F%97%E4%BF%A1%E8%80%85%E3%81%AB-gmail-%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%82%8B%E5%A0%B4%E5%90%88)に書いてあるように、別のメールアドレスを所有している場合は、そのアドレスを使用してメールを送信できます。Gmail以外も可能です。

![スクリーンショット 2023-12-03 161847.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e45e1be0-8d0c-f63c-1ba1-cd53dd157e69.png)

https://support.google.com/mail/answer/22370#zippy=%2C%E5%8F%97%E4%BF%A1%E8%80%85%E3%81%AB-gmail-%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%82%8B%E5%A0%B4%E5%90%88

手順まで書いてくれていて丁寧ですね。

とはいえ、文字ではなくスクリーンショットなど参照付きで設定を進めたい場合もあるかと思います。
その場合は、[下記のサイト様](https://rtomura-taxacc.com/gas_specify-sender-address-and-sender-name/)がすごくわかりやすかったです。

https://rtomura-taxacc.com/gas_specify-sender-address-and-sender-name/

これで無事に希望する差出人名と当該メールアドレスが自動返信メールに記載されていました！

筆者が利用した`GAS`の記述（自動返信機能を含む）を念のため書き残しておきます。
[下記サイト様の記事](https://liapoc.com/new-google-form.html)を参考にさせていただきました。

https://liapoc.com/new-google-form.html

:::note info
下記`GAS`使用時、`Google Forms`の設定（スクリプトエディタのスクリプトの発動タイミング）において**トリガーの設定で「フォーム送信時」を指定**してください。
:::


```javascript
function sendMailGoogleForm() {
    Logger.log('sendMailGoogleForm() debug start');

    /**
     * 設定エリアここから
    */

    var subject = "[お問い合わせありがとうございます]" // 件名
    var body = "ここからメール本文を記載。【\n】は改行コード。\n\n"
        + "--------------------------------------------------------------------------------\n";
    var footer = "---------------------------------------------------------------------------------\n\n"
        + "XXXXX\n(株式会社 XXXXX xxxx部)\n〒123-4567 XX県YY市ZZ町99-9-9\nTEL 0120-12-1234/FAX 0120-34-5678\nEmail:info@hoge.net\nURL:http://example.com"; // フッター（署名）

    // 入力カラムの指定（※ 制作した Google Form の該当項目名と【全く同じ記述】にしないと機能しないので注意）
    var NAME_COL_NAME = '名前'; // Google Form の該当項目名を「名前」にする。
    var MAIL_COL_NAME = 'メールアドレス'; // Google Form の該当項目名を「メールアドレス」にする。

    // メールの送信先
    var admin = "info@hoge.net, personal.foo@piyo.co.jp"; // 管理者（必須）、複数指定も可
    var sendername = "株式会社 XXXXX xxxx部からのお知らせです（担当：XXX YYY）"; // 送信者名（必須）
    var senderadress = "info@hoge.net"; // 送信者アドレス（*1）
    var cc = ""; // cc
    var bcc = admin; // bcc
    var reply = admin; // Reply-To： デフォルトはvar bcc = admin;
    var to = ""; // To: （入力者のアドレスが自動的に反映される）

    /**
     * 設定エリアここまで
    */

    try {
        // スプレッドシート関連
        var sheet = SpreadsheetApp.getActiveSheet();
        var rows = sheet.getLastRow();
        var cols = sheet.getLastColumn();
        var rg = sheet.getDataRange();
        Logger.log("rows=" + rows + " cols=" + cols);

        // メール件名・本文の作成と、送信先メールアドレスの取得
        for (var i = 1; i <= cols; i++) {
            var col_name = rg.getCell(1, i).getValue(); // カラム名
            var col_value = rg.getCell(rows, i).getValue(); // 入力値
            if (col_name === "タイムスタンプ") {
                continue; // カラム名が"タイムスタンプ"の時は処理を飛ばす
            }
            body += "[" + col_name + "] \n";
            body += col_value + "\n\n";
            if (col_name === NAME_COL_NAME) {
                body = col_value + " 様\n\n" + body;
            }
            if (col_name === MAIL_COL_NAME) {
                to = col_value;
            }
        }
        body += footer;

        // 送信先オプション
        var options = { name: sendername, from: senderadress }; // *1：オブジェクトとして指定（別アドレスを使用する場合は前提としてエイリアスの登録・承認作業が必要）
        if (cc) options.cc = cc;
        if (bcc) options.bcc = bcc;
        if (reply) options.replyTo = reply;

        // メール送信関連 
        if (to) {
            GmailApp.sendEmail(to, subject, body, options);
        } else {
            GmailApp.sendEmail(admin, "【失敗】 Googleフォームにメールアドレスが、指定されていません", body);
        }
    } catch (e) {
        GmailApp.sendEmail(admin, "【失敗】 Googleフォームからメール送信中にエラーが発生", e.message);
    }
}
```

## さいごに
Gmail しかり、`Google Forms`はもはや web 界隈に限らず、個人で活躍される幅広い方々（ハンドメイド作家やイラストレーター、コンサルタントなど）にも利用されていると思います。
筆者が多くのネット記事に助けられているように、この記事がどなたかのお役に立てれば嬉しい限りです。
ここまで読んでいただき、ありがとうございました。

## 参考情報

https://support.google.com/mail/answer/22370#zippy=%2C%E5%8F%97%E4%BF%A1%E8%80%85%E3%81%AB-gmail-%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%95%E3%82%8C%E3%82%8B%E5%A0%B4%E5%90%88

https://rtomura-taxacc.com/gas_specify-sender-address-and-sender-name/

https://liapoc.com/new-google-form.html

https://web-breeze.net/form-autoclose/
