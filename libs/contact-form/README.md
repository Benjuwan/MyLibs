# 確認画面付きの問い合わせフォーム
- [デモページ](https://k2webservice.xsrv.jp/r0105/contact-form/)

## ファイル構成
```
- js
- styles
- index.html    // フォームのHTML
- mail.php      // フォーム送信、確認及び完了画面表示機能
```

## 備忘録
- `HTML`における複数選択肢の項目に関する仕様について
チェックボックスの`name`属性に`[]`（ブラケット）を付けると複数のチェックボックスの値を配列としてサーバーに送信できる。`HTML`フォームにおいて複数選択可能な入力を示すための標準的な方法である。
```html
<input type="checkbox" name="SNS_チャットサービス[]" value="Facebook" />
```
※ただし、`name`属性値に**スペースは指定できない（＝`一意の文字列[]`という指定方法な）ので注意**する。<br>スペースを指定するとメールフォーム機能のバリデーションに引っかかって機能しなくなる。

## 設定必要または推奨箇所
### `mail.php`
- 必須設定（row:30）
```php
//---------------------------　必須設定　必ず設定してください　-----------------------

//サイトのトップページのURL　※デフォルトでは送信完了後に「トップページへ戻る」ボタンが表示されますので
$site_top = "https://example.com";

//管理者のメールアドレス ※メールを受け取るメールアドレス(複数指定する場合は「,」で区切ってください 例 $to = "aa@aa.aa,bb@bb.bb";)
$to = "hoge@example.com";

//自動返信メールの送信元メールアドレス
//必ず実在するメールアドレスでかつ出来る限り設置先サイトのドメインと同じドメインのメールアドレスとすることを強く推奨します
$from = "hoge@example.com";

//フォームのメールアドレス入力箇所のname属性の値（name="○○"　の○○部分）
$Email = "フォームのメールアドレス入力箇所のname属性の値（name="○○"　の○○部分）";
//---------------------------　必須設定　ここまで　------------------------------------
```

- スパム防止のためのリファラチェック
```php
//スパム防止のためのリファラチェック（フォーム側とこのファイルが同一ドメインであるかどうかのチェック）(する=1, しない=0)
//※有効にするにはこのファイルとフォームのページが同一ドメイン内にある必要があります
$Referer_check = 1;

//リファラチェックを「する」場合のドメイン ※設置するサイトのドメインを指定して下さい。
//もしこの設定が間違っている場合は送信テストですぐに気付けます。
$Referer_check_domain = "example.com/";
```

- 任意設定
    - row: 89
    `$require`に指定する値はHTMLファイルのフォームで`require`属性を指定した各項目ごとに準拠させる必要があるので注意
    ```php
    //---------------------- 任意設定　以下は必要に応じて設定してください ------------------------

    // 管理者宛のメールで差出人を送信者のメールアドレスにする(する=1, しない=0)
    // する場合は、メール入力欄のname属性の値を「$Email」で指定した値にしてください。
    //メーラーなどで返信する場合に便利なので「する」がおすすめです。
    $userMail = 1;

    // Bccで送るメールアドレス(複数指定する場合は「,」で区切ってください 例 $BccMail = "aa@aa.aa,bb@bb.bb";)
    $BccMail = "";

    // 管理者宛に送信されるメールのタイトル（件名）
    $subject = "〇〇WEBサイト｜問い合わせフォームより";

    // 送信確認画面の表示(する=1, しない=0)
    $confirmDsp = 1;

    // 送信完了後に自動的に指定のページ(サンクスページなど)に移動する(する=1, しない=0)
    // CV率を解析したい場合などはサンクスページを別途用意し、URLをこの下の項目で指定してください。
    // 0にすると、デフォルトの送信完了画面が表示されます。
    $jumpPage = 0;

    // 送信完了後に表示するページURL（上記で1を設定した場合のみ）※httpから始まるURLで指定ください。（相対パスでも基本的には問題ないです）
    // $thanksPage = "http://xxx.xxxxxxxxx/thanks.html";

    // 必須入力項目を設定する(する=1, しない=0)
    $requireCheck = 1;

    /* 必須入力項目(入力フォームで指定したname属性の値を指定してください。（上記で1を設定した場合のみ）
    値はシングルクォーテーションで囲み、複数の場合はカンマで区切ってください。フォーム側と順番を合わせると良いです。 
    配列の形「name="○○[]"」の場合には必ず後ろの[]を取ったものを指定して下さい。*/
    $require = array('お名前','性別','メールアドレス','電話番号','お問い合わせの詳細','プライバシーポリシー');
    ```
    `$require`に指定する（`name`属性に指定する）値は、 **問い合わせ確認ページの各項目名として反映される**ので日本語での指定を推奨。

    - row: 123
    ```php
    //----------------------------------------------------------------------
    //  自動返信メール設定(START)
    //----------------------------------------------------------------------

    // 差出人に送信内容確認メール（自動返信メール）を送る(送る=1, 送らない=0)
    // 送る場合は、フォーム側のメール入力欄のname属性の値が上記「$Email」で指定した値と同じである必要があります
    $remail = 1;

    //自動返信メールの送信者欄に表示される名前　※あなたの名前や会社名など（もし自動返信メールの送信者名が文字化けする場合ここは空にしてください）
    $refrom_name = "株式会社〇〇";

    // 差出人に送信確認メールを送る場合のメールのタイトル（上記で1を設定した場合のみ）
    $re_subject = "【株式会社〇〇】お問い合わせありがとうございました";

    //フォーム側の「名前」箇所のname属性の値　※自動返信メールの「○○様」の表示で使用します。
    //指定しない、または存在しない場合は、○○様と表示されないだけです。あえて無効にしてもOK
    $dsp_name = 'お名前';

    //自動返信メールの冒頭の文言 ※日本語部分のみ変更可
    $remail_text = <<< TEXT

    この度はお問い合わせいただき誠にありがとうございました。

    改めて担当者よりご連絡をさせていただきますので
    今しばらくお待ちくださいませ。

    ─お問い合わせ内容の確認─────────────────
    TEXT;


    //自動返信メールに署名（フッター）を表示(する=1, しない=0)※管理者宛にも表示されます。
    $mailFooterDsp = 1;

    //上記で「1」を選択時に表示する署名（フッター）（FOOTER～FOOTER;の間に記述してください）
    $mailSignature = <<< FOOTER

    ━━━━━━━━━━━━━━━━━━━━━━━━━━
    株式会社〇〇
    〒123-4567 大阪府新渋谷区1-7-89 マンハッタンビル 108F
    TEL：01-2345-6789　FAX:01-9876-5432
    WEB：http://example.com/
    ━━━━━━━━━━━━━━━━━━━━━━━━━━

    FOOTER;


    //----------------------------------------------------------------------
    //  自動返信メール設定(END)
    //----------------------------------------------------------------------
    ```

    ```php
    //全角英数字→半角変換を行う項目のname属性の値（name="○○"の「○○」部分）
    //※複数の場合にはカンマで区切って下さい。（上記で「1」を指定した場合のみ有効）
    //配列の形「name="○○[]"」の場合には必ず後ろの[]を取ったものを指定して下さい。
    $hankaku_array = array('電話番号','メールアドレス');
    ```

- 送信確認・完了ページのデザインや設定
    - 送信内容確認
    ```html
    /*　▼▼▼送信確認画面のレイアウト※編集可　オリジナルのデザインも適用可能▼▼▼　*/
    ?>
    <!doctype html>
    <html lang="ja">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="Description" content="問い合わせフォーム | 〇〇WEBサイト ページです" />
    <title>問い合わせフォーム | 〇〇WEBサイト</title>
    <link rel="stylesheet" href="./styles/default.css">
    <script type="module" src="./js/default.js"></script>
    </head>

    <body>
    <div class="com-hd">
        <div class="hd-com-inner"><h1><span class="title-sub">Contact Page</span><br>お問い合わせ</h1></div>
        <div class="bd-list"><div class="bd-list-inner">■<a href="./index.html">TOP</a> ＞ お問い合わせ</div></div>
    </div>
    <!-- ▲ Headerやその他コンテンツなど　※自由に編集可 ▲-->

    <!-- ▼************ 送信内容表示部　※編集は自己責任で ************ ▼-->
    <div id="formWrap">
    <?php if($empty_flag == 1){ ?>
    <div style="text-align: center;">
    <h4>入力にエラーがあります。下記をご確認の上「戻る」ボタンにて修正をお願い致します。</h4>
    <?php echo $errm; ?><br /><br /><input type="button" class="resetBtn" value=" 前画面に戻る " onClick="history.back()">
    </div>
    <?php }else{ ?>
    <h3>確認画面</h3>
    <p style="text-align: center;">以下の内容で間違いがなければ、「送信する」ボタンを押してください。</p>
    <form action="<?php echo h($_SERVER['SCRIPT_NAME']); ?>" method="POST">
    <table class="formTable">
    <?php echo confirmOutput($_POST);//入力内容を表示?>
    </table>
    <p style="text-align: center; padding: 5em 0;"><input type="hidden" name="mail_set" value="confirm_submit">
    <input type="hidden" name="httpReferer" value="<?php echo h($_SERVER['HTTP_REFERER']);?>">
    <input type="submit" class="submitBtn" value="　送信する　">
    <input type="button" class="resetBtn" value="前画面に戻る" onClick="history.back()"></p>
    </form>
    <?php } ?>
    </div></div><!-- /formWrap -->
    <!-- ▲ *********** 送信内容確認部　※編集は自己責任で ************ ▲-->

    <!-- ▼ Footerその他コンテンツなど　※編集可 ▼-->
    </body>
    </html>
    <?php
    /* ▲▲▲送信確認画面のレイアウト　※オリジナルのデザインも適用可能▲▲▲　*/
    }
    ```

    - 送信完了
    ```html
    /* ▼▼▼送信完了画面のレイアウト　編集可 ※送信完了後に指定のページに移動しない場合のみ表示▼▼▼　*/
    ?>
    <!doctype html>
    <html lang="ja">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="Description" content="お問い合わせ完了 | 〇〇WEBサイト ページです" />
    <title>お問い合わせ完了 | 〇〇WEBサイト</title>
    <link rel="stylesheet" href="./styles/default.css">
    <script type="module" src="./js/default.js"></script>
    </head>

    <body>
    <div class="com-hd">
        <div class="hd-com-inner"><h1><span class="title-sub">Contact Page</span><br>お問い合わせ完了</h1></div>
        <div class="bd-list"><div class="bd-list-inner">■<a href="./index.html">TOP</a> ＞ お問い合わせ完了</div></div>
    </div>

    <div class="com-inner">
    <?php if($empty_flag == 1){ ?>
    <h4>入力にエラーがあります。下記をご確認の上「戻る」ボタンにて修正をお願い致します。</h4>
    <div style="color:red"><?php echo $errm; ?></div>
    <br /><br /><input type="button" class="resetBtn" value=" 前画面に戻る " onClick="history.back()">
    </div>

    </body>
    </html>
    <?php }else{ ?>
    この度はお問い合わせいただき誠にありがとうございました。<br />
    <br />
    改めて担当者よりご連絡をさせていただきますので<br />
    今しばらくお待ちくださいませ。<br />
    <br>

    <div class="al-r"><a href="<?php echo $site_top ;?>" >トップページへ戻る&raquo;</a></div></div>
    <!--  CV率を計測する場合ここにAnalyticsコードを貼り付け -->

    </body>
    </html>
    <?php 
    /* ▲▲▲送信完了画面のレイアウト 編集可 ※送信完了後に指定のページに移動しない場合のみ表示▲▲▲　*/
    ```

## ソース元
- [- PHP工房 -](http://www.php-factory.net/)