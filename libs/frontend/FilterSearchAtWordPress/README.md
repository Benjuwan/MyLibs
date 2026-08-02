# FilterSearchAtWordPress

### 概要
WordPressサイトで使用できる「絞り込み（複数）検索機能」を実装するためのファイルセットです。検索項目（カテゴリー）の設定は《カスタムタクソノミー》を使用（左記や以下の説明で出てくるカテゴリーはタクソノミーを指します）

- ファイルセット
```
|--- img：ダミーサムネイルの画像
    
|---searchpart
    |---css
        |--- _forsearch.scss：選択項目に関するスタイルシート
        |--- searchpart.scss：検索結果ページに関するスタイルシート（forsearchを@useで読み込んでいる）
            
    |--- js
        |--- forsearch.js：検索項目のカテゴリ別または表示中のページURL別の「項目内容の表示・非表示の切り替え」機能や「localStorageを使った検索履歴の保存」機能などを記述
            
    |--- part-filtersearch.php：検索項目用のテンプレートパーツファイル
        
|--- functions.php：中身は「必要なスクリプトやスタイルの読み込み」と「絞り込み検索機能に関する記述（DBからのデータ取得）」など
    
|--- search.php：検索結果ページ。part-filtersearch.php内で処理される配列（各検索項目の内容が格納された箱）から渡ってきた検索項目を取得し、WP_Query（とtaxQuery）を使ってコンテンツを表示させている。ページャーは the_posts_pagination を使用。
```

### 使い方・使用時の変更必要箇所
- `part-filtersearch.php`<br>
主に`generate_taxonomy_checkboxes`関数を通じて**各タクソノミー配下の子タームたちをチェックボックス**で表示するようにしています。この関数は**タクソノミースラッグ**を引数に受け取って上記の機能を提供する仕組みです。デフォルト（現状）はチェックボックスですが用途に応じてラジオ（単一選択）に変更しても良いでしょう。<br>
当ファイルにはその他に、ドロップダウンリストや独自のチェックボックスリストなど各種ユニークな設定も用意しています。
```php
// ドロップダウンリスト
<div class="selectcategoryWrapper">
<p>1：ジャンルから探す →</p>
  <?php 
    $CategoriesType = [
        'value_field' => 'slug',              //（フォームの ）option要素の'value'属性へ入れるタームのフィールド
        'taxonomy'  => 'category_cat',        //タクソノミー
        'name' => 'get_categorytype[]',
        'id' => 'categorySelect',             //初期値だと'name'に指定した内容になる
        // 'show_option_none' => ('○○を選択'),   //初期プレースホルダー
        'option_none_value' => '',            //未選択時のoption要素のvalue属性値を指定（空 = %5B%5D = []）
        'exclude' => [43, 2]                  // 'tag_id=xxxx'のタームを除外
    ]; 
  ?>
  <?php wp_dropdown_categories( $CategoriesType ); ?>
</div>

// 独自のチェックボックスリスト
<div class="areaWrapper">
  <p>2：地域から探す →</p>
  <details class="SearchMenu" id="AreaBox">
      <summary>▼地域選択</summary>
          <?php
              $term_id = 50;
              $taxonomy_name = 'search_area';
              $termchildren = get_term_children( $term_id, $taxonomy_name );
                foreach ( $termchildren as $child ) :
                  $term = get_term_by( 'id', $child, $taxonomy_name );
          ?>
            <summary><label><input type="checkbox" name="get_searcharea[]" value="<?php echo esc_attr( $term->slug ); ?>"><?php echo esc_html( $term->name) ; ?></label></summary>
          <?php endforeach; ?>
  </details>
</div>
```

- `search.php`<br>
主に`get_filtered_contents`と`get_search_terms_display`関数で検索対象データの抽出を担っています。
  - `get_filtered_contents`<br>
  フィルター検索（ユーザー選択またはキーワード入力）の**データ取得**する関数。
  - `get_search_terms_display`<br>
  フィルター検索（ユーザー選択またはキーワード入力）の**項目名またはキーワード取得**する関数。<br><br>
両関数ともに、`$taxonomy_mapping`変数にはデータを取得したい各種コンテンツの設定（連想配列で各タクソノミースラッグに対するGETパラメータのプレフィックス指定）を行う。
```php
// キー: タクソノミー名, 値: 対応するGETパラメータのプレフィックス
$taxonomy_mapping = [
  'target_categories' => 'get_categories',
  'target_area' => 'get_area',
  'target_age' => 'get_age'
];
```

> [!NOTE]
> タクソノミー単体ではなく、その配下の子タームを取り扱いたい場合は**タクソノミースラッグ及びタームスラッグの指定**方法に注意してください。<br>
> `search.php`の`$taxonomy_mapping`変数に適宜「当該タクソノミー」を追加していっても良いのですが**関連情報としてまとめた方が楽**なので以下キャプチャ画像のように設定することを推奨します。<br>
> 
> ![Image](https://github.com/user-attachments/assets/bc65e902-2069-4a05-abed-afb2936a8d0c)
> 
> 上記内容を反映すると`$taxonomy_mapping`変数は以下のような形になります。<br>
> ```php
> $taxonomy_mapping = [
>   'target_categories' => 'get_categories',
>   'target_area' => 'get_area',
>   'target_age' => 'get_age',
>   'hobbies' => 'get_hobbies' // 新規追加
> ];
> ```
    
- `functions.php`
```
|--- include_cpt_search：当該関数の第二引数に「-----「検索でヒットさせたいカスタム投稿タイプ名」を必要な分だけ記述----- 」

|--- custom_search：当該関数の WHERE {$wpdb->postmeta} にある IN へ「-----「検索でヒットさせたいメタ：フィールド名」を必要な分だけ記述-----」
```

- `forsearch.js`<br>
※以下は必要に応じて修正してください
```
検索結果ページでの検索ボックスの表示ボタン関連
|--- そもそも不要ならコメントアウトで機能停止か削除してもよい

表示中のページURLにsearchs-slug001（カテゴリ別スラッグ）が含まれている場合
|--- 'searchs-slug001'や'searchs-slug002'と記述している箇所を「任意のslug名」に変更。そもそも不要なら〜以下同上。

セレクトボックスを選択して表示の切り替え（ selectと'change'イベント ）
|--- 同上

検索項目をlocalStorageに残して検索結果に反映（ここから）〜（ここまで）
|--- 同上
```


### 注意点
検索履歴の保存機能に関して：「localStorage」はJavaScriptから自由にアクセスできる性質のため「メールアドレス・住所・氏名など個人情報」に関する内容がある場合はセキュリティ面で大きな懸念がある。**デリケートな内容・項目がある場合は使用しない**こと（＝コメントアウトで機能停止させておく）

【wpdb::prepare() のクエリー引数にはプレースホルダーが必要（`functions.php`）】
```
（functions.php）
|--- $wpdb->prepare("%%{$word}%%"); 
```

 **prepare(第一引数：実行するsql, 第二引数：プレースホルダー)** を使うには、第一引数と第二引数ともに記述必須だが、以下の内容では「`wpdb::prepare()`のクエリー引数にはプレースホルダーが必要」というエラー(notice)が表示されてしまう。

```php
$search_words = explode(' ', isset($wp_query->query_vars['s']) ? $wp_query->query_vars['s'] : ''); // 検索データが存在する場合（三項演算子：条件? true: false）は、取得した検索データを半角スペース区切りで配列へ変換
 if ( count($search_words) > 0 ) { // 配列の中身が存在すれば下記の処理へ移行
   $search = ''; // プレースホルダー用の変数
   foreach ( $search_words as $word ) { // 配列（$search_words）の中身をそれぞれ $word に
if ( !empty($word) ) { // $wordが 空 || null の状態でない（falseの場合）なら下記の処理へ移行

      $sql_act = " AND (
          {$wpdb->posts}.post_title LIKE '{$word}'
          OR {$wpdb->posts}.post_content LIKE '{$word}'
          
          OR {$wpdb->posts}.ID IN (
            SELECT distinct r.object_id
            FROM {$wpdb->term_relationships} AS r
            INNER JOIN {$wpdb->term_taxonomy} AS tt ON r.term_taxonomy_id = tt.term_taxonomy_id
            INNER JOIN {$wpdb->terms} AS t ON tt.term_id = t.term_id
            WHERE t.name LIKE '{$word}'
          OR t.slug LIKE '{$word}'
          OR tt.description LIKE '{$word}'
          )
          
          OR {$wpdb->posts}.ID IN (
            SELECT distinct post_id
            FROM {$wpdb->postmeta}
            WHERE {$wpdb->postmeta}.meta_key IN ('meta-field-slug','meta-field-slug','meta-field-slug','meta-field-slug','meta-field-slug','meta-field-slug') AND meta_value LIKE '{$word}'
          )
      ) ";

     $result .= $wpdb->prepare($sql_act, $search); // 値を結合した形で変数（返却値）に格納

     } // if ( !empty($word) )
    } // foreach
 } // if ( count($search_words) > 0 )
 
 return $result;
```