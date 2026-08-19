title: カスタム投稿タイプとタクソノミーを使った絞り込み検索機能を作りたい

tags: WordPress PHP カスタム投稿タイプ 検索機能

https://qiita.com/advent-calendar/2023/cms

この記事は[CMS(WordPressやヘッドレスCMS) Advent Calendar 2023](https://qiita.com/advent-calendar/2023/cms)の15日目の記事です。
空きがあったので参加させていただきました。

## はじめに
あまたある`WordPress`のプラグインの中でも`Custom Post Type UI`は超有名ですよね。最近`WordPress`については運用・保守作業ばかりで、サイト制作は全然なのですが制作時はよくお世話になりました。

数年前の話になりますが、新規`WordPress`サイトの制作でクライアント（社内グループ各社）の要望に検索機能がありました。しかし予算の都合上、有料プラグインは使用できなそうだったので自作することになったのです。

今回、その時に制作した「カスタム投稿タイプとタクソノミー、ターム」を用いた検索機能について書いていこうと思います。

なお、自作せずにプラグインを用いる場合、関連情報については以下の記事ほか調べるといくらでも出てくると思います！

https://webrent.xsrv.jp/wordpress-search-filter-plugins/

## ファイル構成（テーマ内での使用想定）
```
|---searchpart
    |--- part-filtersearch.php

|--- search.php
|--- functions.php
```

- `searchpart/part-filtersearch.php`
検索項目用のテンプレートパーツファイル

- `search.php`
検索結果ページ。`part-filtersearch.php`内で処理される配列（各検索項目の内容が格納された箱）から渡ってきた検索項目を取得し、`WP_Query`（と`taxQuery`）を使ってコンテンツを表示。ページャーは`the_posts_pagination`を使用。

- `functions.php`
絞り込み検索機能に関する記述（DBからのデータ取得）など


### 検索項目用のテンプレートパーツファイル
`part-filtersearch.php`では検索項目を整えて、検索結果ページ`search.php`に渡すためのデータセットを用意します。

```php
<?php
    function generate_taxonomy_checkboxes($taxonomy_name) {
        // 親タームの取得
        $parent_terms = get_terms([
            'taxonomy' => $taxonomy_name,   // 取得元タクソノミースラッグ
            'parent' => 0,                  // 親タームのIDを指定（0は最上位の親ターム）
            'hide_empty' => false           // false を指定することで投稿が紐付いていない（空の）タームも取得
        ]);

        // エラーチェック
        if (is_wp_error($parent_terms)) {
            return '';
        }

        // バッファリング： ob_start() を使用すると、echo などで出力される内容を一時的にバッファ（メモリ）に蓄積し、関数の返り値として取得できる。これにより、関数内でHTMLを出力しつつ、最終的にその内容を文字列として返すことが可能になる
        ob_start();

        // 各親タームに対してdetailsブロックを生成
        foreach ($parent_terms as $parent_term) {
            ?>
            <details>
                <summary>
                    <?php echo esc_html($parent_term->name); ?>
                </summary>

                <?php
                // 子タームを取得
                $child_terms = get_terms([
                    'taxonomy' => $taxonomy_name,
                    'parent' => $parent_term->term_id,
                    'hide_empty' => false
                ]);
                
                // 各子タームに対してチェックボックスを生成
                if (!is_wp_error($child_terms)) {
                    foreach ($child_terms as $child_term) {
                        ?>
                        <div class="taxonomy-checkbox-item">
                            <label>
                                <input type="checkbox" 
                                    name="<?php echo esc_attr($child_term->slug); ?>"
                                    value="<?php echo esc_attr($child_term->slug); ?>">
                                <?php echo esc_html($child_term->name); ?>
                            </label>
                        </div>
                        <?php
                    }
                }
                ?>
            </details>
            <?php
        }
        // バッファリングのクリーンアップ処理： バッファリングされた内容を取得し、出力をクリアして返す。ob_get_clean() は ob_get_contents() + ob_end_clean() の処理をまとめたもので、出力内容を取得しつつ、バッファを終了する
        return ob_get_clean();
    }
?>

<form role="search" method="get" id="searchform" class="searchform" action="<?php echo esc_url(home_url('/')); ?>">
<div class="department_wrapper">
    <div class="SearchWrapper">
        <div id="SearchMainWrapper">
        <h3>フィルター検索</h3>
            <div class="selectcategoryWrapper">
                <p>1：ジャンルから探す →</p>
                <?php 
                $CategoriesType = [
                    'value_field' => 'slug', 			//（フォームの ）option要素の'value'属性へ入れるタームのフィールド
                    'taxonomy'  => 'category_cat', 		//タクソノミー
                    'name' => 'get_categorytype[]',
                    'id' => 'categorySelect', 			//初期値だと'name'に指定した内容になる
                    // 'show_option_none' => ('○○を選択'),	//初期プレースホルダー
                    'option_none_value' => '', 			//未選択時のoption要素のvalue属性値を指定（空 = %5B%5D = []）
                    'exclude' => [43, 2]                // 'tag_id=xxxx'のタームを除外
                ]; 
                ?>
                <?php wp_dropdown_categories( $CategoriesType ); ?>
            </div>
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
            <div id="MajorBox">
                <div id="uniBox" class="inview">
                    <p>3：分野から探す ↓</p>
                    <details class="UniChildren">
                        <summary>▼ジャンル-A</summary>
                        <?php echo generate_taxonomy_checkboxes('bunkei'); ?>
                    </details>
                    <details class="UniChildren">
                        <summary>▼ジャンル-B</summary>
                        <?php echo generate_taxonomy_checkboxes('bunri'); ?>
                    </details>
                    <details class="UniChildren">
                        <summary>▼ジャンル-C</summary>
                        <?php echo generate_taxonomy_checkboxes('rikei'); ?>
                    </details>
                </div>
                <div id="VocBox">
                    <p>3：分野から探す ↓</p>
                    <div class="VocChilderen" class="UniChildren">
                        <?php echo generate_taxonomy_checkboxes('search_vocational'); ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="get_search">
            <label><input type="search" placeholder="フリーワードを入力" value="" name="s" id="s"></label>
		</div>

        <!-- type="hidden"は記述が必要なので忘れないように注意してください -->
        <input type="hidden" name="post_type" value="hoge">
        <input type="hidden" name="post_type" value="foo">
        <p id="department_btn"><input type="submit" value="検索"></p>
    </div>
</div>
</form>
```

上記コードで重要なのは以下`generate_taxonomy_checkboxes`関数です。
```php
<?php
    function generate_taxonomy_checkboxes($taxonomy_name) {
        // 親タームの取得
        $parent_terms = get_terms([
            'taxonomy' => $taxonomy_name,   // 取得元タクソノミースラッグ
            'parent' => 0,                  // 親タームのIDを指定（0は最上位の親ターム）
            'hide_empty' => false           // false を指定することで投稿が紐付いていない（空の）タームも取得
        ]);

        // エラーチェック
        if (is_wp_error($parent_terms)) {
            return '';
        }

        // バッファリング： ob_start() を使用すると、echo などで出力される内容を一時的にバッファ（メモリ）に蓄積し、関数の返り値として取得できる。これにより、関数内でHTMLを出力しつつ、最終的にその内容を文字列として返すことが可能になる
        ob_start();

        // 各親タームに対してdetailsブロックを生成
        foreach ($parent_terms as $parent_term) {
            ?>
            <details>
                <summary>
                    <?php echo esc_html($parent_term->name); ?>
                </summary>

                <?php
                // 子タームを取得
                $child_terms = get_terms([
                    'taxonomy' => $taxonomy_name,
                    'parent' => $parent_term->term_id,
                    'hide_empty' => false
                ]);
                
                // 各子タームに対してチェックボックスを生成
                if (!is_wp_error($child_terms)) {
                    foreach ($child_terms as $child_term) {
                        ?>
                        <div class="taxonomy-checkbox-item">
                            <label>
                                <input type="checkbox" 
                                    name="<?php echo esc_attr($child_term->slug); ?>"
                                    value="<?php echo esc_attr($child_term->slug); ?>">
                                <?php echo esc_html($child_term->name); ?>
                            </label>
                        </div>
                        <?php
                    }
                }
                ?>
            </details>
            <?php
        }
        // バッファリングのクリーンアップ処理： バッファリングされた内容を取得し、出力をクリアして返す。ob_get_clean() は ob_get_contents() + ob_end_clean() の処理をまとめたもので、出力内容を取得しつつ、バッファを終了する
        return ob_get_clean();
    }
?>
```

`generate_taxonomy_checkboxes`関数を呼び出すことで各タクソノミー以下のタームごとの選択肢（チェックボックス）を生成しています。
```php
...
..
.
<p>3：分野から探す ↓</p>
<details class="UniChildren">
  <summary>▼ジャンル-A</summary>
  <!-- bunkei（タクソノミー）のターム別チェックボックスを生成 -->
  <?php echo generate_taxonomy_checkboxes('bunkei'); ?>
...
..
.
```

ちなみに、`WordPress`で検索機能を実装する際`form`要素の`action`属性に以下の記述が必要なので注意してください。

```php
action="<?php echo esc_url(home_url('/'))"
```

こちらは蛇足ですが、キーワード検索の場合は **`input`要素の`name`属性と`id`属性に`s`という記述が必要**です。

あと、検索結果ページ（`search.php`）で **検索キーワードをプレースホルダーに表示したい場合は、`value`に`<?php echo get_search_query(); ?>`を記述してキーワード取得及び反映できる** ようにしておいてください。

```php
<input type="text" value="<?php echo get_search_query(); ?>" name="s" id="s">
```

データ取得対象のカスタム投稿タイプが複数ある場合は、
`<input type="hidden" name="投稿タイプ" value="カスタム投稿タイプ（のスラッグ）名">`
上記の形で取得する数を用意してください。以下に例を置いておきます。

```html
<input type="hidden" name="post_type" value="hoge">
<input type="hidden" name="post_type" value="foo">
```

::: note warn
`type="hidden"`は記述が必要なので忘れないように注意してください
:::

### 検索結果ページ
`search.php`では、`part-filtersearch.php`から渡ってきた「検索項目データ（連想配列や`name`属性の値で指定していた配列データ）」を取得し、`WP_Query`（と`taxQuery`）を使ってコンテンツを表示しています。

```php
<!-- フィルター検索（ユーザー選択またはキーワード入力）のデータ取得 -->
<?php 
    function get_filtered_contents() {
        // タクソノミーとGETパラメータのプレフィックスのマッピング
        // キー: タクソノミー名, 値: 対応するGETパラメータのプレフィックス
        $taxonomy_mapping = [
            'category_cat' => 'get_categorytype',
            'search_area' => 'get_searcharea',
            'bunkei' => 'get_bunkei',
            'bunri' => 'get_bunri',
            'rikei' => 'get_rikei',
            'search_vocational' => 'get_voc'
        ];

        // クエリの基本設定
        $query_args = [
            'post_type' => ['hoge', 'foo'],         // コンテンツデータを取得したい投稿タイプのスラッグ名（複数指定は配列形式）
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 1),   // 現在のページ番号（デフォルト: 1）
            's' => get_search_query(),              // 検索キーワード
            'tax_query' => ['relation' => 'AND']
        ];

        // 各タクソノミーごとのサブクエリを準備
        // $taxonomy_mapping をループして $taxonomy にタクソノミー名（例:'bunkei'）を代入し、$param_prefix に対応するプレフィックス（例:'get_bunkei'）を代入する。
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = []; // 検索条件となるタームIDを格納する配列
            
            // $_GET のクエリパラメータをループして、$key にパラメータ名（例:'get_bunkei01'）を、$value にその値（例:'bunkei01_a'）を代入する。
            foreach ($_GET as $key => $value) {
                // $key が $param_prefix で始まるか確認（例:'get_bunkei01'が'get_bunkei'で始まる）
                if (strpos($key, $param_prefix) === 0 && !empty($value)) {
                    // 配列の場合は展開、そうでない場合はそのまま追加
                    if (is_array($value)) {
                        $terms = array_merge($terms, $value);
                    } else {
                        $terms[] = $value;
                    }
                }
            }

            // 該当するタームが見つかった場合のみクエリに追加
            if (!empty($terms)) {
                // 同じタクソノミー内での検索は OR 条件
                $query_args['tax_query'][] = [
                    'taxonomy' => $taxonomy,
                    'field' => 'slug',
                    'terms' => array_unique($terms), // 重複を除去
                    'operator' => 'IN'               // OR 条件
                ];
            }
        }

        // サブループ・サブクエリを返す
        return new WP_Query($query_args);
    }
?>
<?php $my_query = get_filtered_contents(); ?>

<!-- フィルター検索（ユーザー選択またはキーワード入力）の項目名またはキーワード取得 -->
<?php
    function get_search_terms_display() {
        $display_terms = [];
        
        // フリーワード検索の取得
        if (get_search_query()) {
            $display_terms[] = sprintf('フリーワード：%s', esc_html(get_search_query()));
        }
        
        // タクソノミーとGETパラメータのプレフィックスのマッピング
        // キー: タクソノミー名, 値: 対応するGETパラメータのプレフィックス
        $taxonomy_mapping = [
            'category_cat' => 'get_categorytype',
            'search_area' => 'get_searcharea',
            'bunkei' => 'get_bunkei',
            'bunri' => 'get_bunri',
            'rikei' => 'get_rikei',
            'search_vocational' => 'get_voc'
        ];
        
        // 各タクソノミーの選択値を取得
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = [];
            
            // GETパラメータを走査して、指定のprefixで始まるものを全て取得
            foreach ($_GET as $key => $value) {
                if (strpos($key, $param_prefix) === 0 && !empty($value)) {
                    if (is_array($value)) {
                        foreach ($value as $term_slug) {
                            $term = get_term_by('slug', $term_slug, $taxonomy);
                            if ($term) {
                                $terms[] = $term->name;
                            }
                        }
                    } else {
                        $term = get_term_by('slug', $value, $taxonomy);
                        if ($term) {
                            $terms[] = $term->name;
                        }
                    }
                }
            }
            
            if (!empty($terms)) {
                $display_terms[] = sprintf(implode('、', array_unique($terms)));
            }
        }
        
        return $display_terms;
    }
?>
<?php $search_terms = get_search_terms_display(); ?>
    
<!-- ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| -->

<?php get_header(); ?>

    <h2 class="search_h2">
        <p class="search_infotxt">該当件数：<strong><?php echo esc_html($my_query->found_posts); ?></strong>件</p>
        <p>
            <span>検索語句</span>
            <?php foreach ($search_terms as $term): ?>
                <small><?php echo esc_html($term); ?></small>
            <?php endforeach; ?>
        </p>
    </h2>

    <main>
        <?php if($my_query->have_posts()): ?>
            <ul>
                <?php while( $my_query->have_posts()): 
                    $my_query->the_post(); 
                ?>
                    <li>
                        <!-- ループ処理で表示したいコンテンツデータの中身 -->
                    </li>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>

                <?php else: ?>
                <li id="no_search_txt" style="width:100%;border:none;background:transparent;margin:40px auto;"><h3>該当する項目・キーワードはございませんでした</h3></li>
            </ul>
        <?php endif; ?>
        
        <div class="pagination">
            <?php the_posts_pagination( [
                'prev_text' => '&larr;',
                'next_text' => '&rarr;',
                'total' => htmlspecialchars($my_query->max_num_pages, ENT_QUOTES) // $my_query （ get_filtered_contents を代入した変数名）
            ] ); ?>
        </div>
    </main>

<?php get_footer(); ?>
```

こちらでも以下2つの関数（`get_filtered_contents`, `get_search_terms_display`）が重要になってきます。

- `get_filtered_contents`
フィルター検索（ユーザー選択またはキーワード入力）のデータ取得

```php
<?php 
    function get_filtered_contents() {
        // タクソノミーとGETパラメータのプレフィックスのマッピング
        // キー: タクソノミー名, 値: 対応するGETパラメータのプレフィックス
        $taxonomy_mapping = [
            'category_cat' => 'get_categorytype',
            'search_area' => 'get_searcharea',
            'bunkei' => 'get_bunkei',
            'bunri' => 'get_bunri',
            'rikei' => 'get_rikei',
            'search_vocational' => 'get_voc'
        ];

        // クエリの基本設定
        $query_args = [
            'post_type' => ['hoge', 'foo'],         // コンテンツデータを取得したい投稿タイプのスラッグ名（複数指定は配列形式）
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 1),   // 現在のページ番号（デフォルト: 1）
            's' => get_search_query(),              // 検索キーワード
            'tax_query' => ['relation' => 'AND']
        ];

        // 各タクソノミーごとのサブクエリを準備
        // $taxonomy_mapping をループして $taxonomy にタクソノミー名（例:'bunkei'）を代入し、$param_prefix に対応するプレフィックス（例:'get_bunkei'）を代入する。
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = []; // 検索条件となるタームIDを格納する配列
            
            // $_GET のクエリパラメータをループして、$key にパラメータ名（例:'get_bunkei01'）を、$value にその値（例:'bunkei01_a'）を代入する。
            foreach ($_GET as $key => $value) {
                // $key が $param_prefix で始まるか確認（例:'get_bunkei01'が'get_bunkei'で始まる）
                if (strpos($key, $param_prefix) === 0 && !empty($value)) {
                    // 配列の場合は展開、そうでない場合はそのまま追加
                    if (is_array($value)) {
                        $terms = array_merge($terms, $value);
                    } else {
                        $terms[] = $value;
                    }
                }
            }

            // 該当するタームが見つかった場合のみクエリに追加
            if (!empty($terms)) {
                // 同じタクソノミー内での検索は OR 条件
                $query_args['tax_query'][] = [
                    'taxonomy' => $taxonomy,
                    'field' => 'slug',
                    'terms' => array_unique($terms), // 重複を除去
                    'operator' => 'IN'               // OR 条件
                ];
            }
        }

        // サブループ・サブクエリを返す
        return new WP_Query($query_args);
    }
?>
<?php $my_query = get_filtered_contents(); ?>
```

- `get_search_terms_display`
フィルター検索（ユーザー選択またはキーワード入力）の項目名またはキーワード取得
```php
<?php
    function get_search_terms_display() {
        $display_terms = [];
        
        // フリーワード検索の取得
        if (get_search_query()) {
            $display_terms[] = sprintf('フリーワード：%s', esc_html(get_search_query()));
        }
        
        // タクソノミーとGETパラメータのプレフィックスのマッピング
        // キー: タクソノミー名, 値: 対応するGETパラメータのプレフィックス
        $taxonomy_mapping = [
            'category_cat' => 'get_categorytype',
            'search_area' => 'get_searcharea',
            'bunkei' => 'get_bunkei',
            'bunri' => 'get_bunri',
            'rikei' => 'get_rikei',
            'search_vocational' => 'get_voc'
        ];
        
        // 各タクソノミーの選択値を取得
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = [];
            
            // GETパラメータを走査して、指定のprefixで始まるものを全て取得
            foreach ($_GET as $key => $value) {
                if (strpos($key, $param_prefix) === 0 && !empty($value)) {
                    if (is_array($value)) {
                        foreach ($value as $term_slug) {
                            $term = get_term_by('slug', $term_slug, $taxonomy);
                            if ($term) {
                                $terms[] = $term->name;
                            }
                        }
                    } else {
                        $term = get_term_by('slug', $value, $taxonomy);
                        if ($term) {
                            $terms[] = $term->name;
                        }
                    }
                }
            }
            
            if (!empty($terms)) {
                $display_terms[] = sprintf(implode('、', array_unique($terms)));
            }
        }
        
        return $display_terms;
    }
?>
<?php $search_terms = get_search_terms_display(); ?>
```


- コンテンツデータを取得及び表示

```php
<h2 class="search_h2">
  <p class="search_infotxt">該当件数：
    <strong><?php echo esc_html($my_query->found_posts); ?></strong>件
  </p>
  <p>
    <span>検索語句</span>
    <?php foreach ($search_terms as $term): ?>
        <small><?php echo esc_html($term); ?></small>
    <?php endforeach; ?>
  </p>
</h2>

...

<?php if($my_query->have_posts()): ?>
  <ul>
    <?php while( $my_query->have_posts()): 
      $my_query->the_post(); 
    ?>
    
      <li>
        <!-- ループ処理で表示したいコンテンツデータの中身 -->
      </li>
      
    <?php endwhile; ?>
    <?php wp_reset_postdata(); ?>
    
    <?php else: ?>
      <li id="no_search_txt" style="width:100%;border:none;background:transparent;margin:40px auto;"><h3>該当する項目・キーワードはございませんでした</h3></li>
   </ul>
<?php endif; ?>
```

- ページ送り機能の実装
ページャーは`the_posts_pagination`を使っています。

```php
<div class="pagination">
  <?php the_posts_pagination( [
    'prev_text' => '&larr;',
    'next_text' => '&rarr;',
    'total' => htmlspecialchars($my_query->max_num_pages, ENT_QUOTES) // $my_query （ get_filtered_contents を代入した変数名）
  ] ); ?>
</div>
```

連想配列の`total`にコンテンツデータを代入した変数（`my_query`）を使用しています。ページ上限値を取得している箇所ですね。

```php
'total' => htmlspecialchars($my_query->max_num_pages, ENT_QUOTES)
```


### funcitons.php の設定

:::note warn
釈迦に説法かもですが、`funcitons.php`は記述を誤るとサイトの機能・表示に支障をきたしますので、編集時はバックアップを取って慎重に進めることをお勧めいたします。
:::

```php
<?php

// 全角スペースで検索語句を区切る
if (isset($_GET['s'])) $_GET['s'] = mb_convert_kana($_GET['s'], 's', 'UTF-8');

// 検索対象にカスタム投稿タイプを含む
function include_cpt_search($query)
{
    if (is_admin() || !$query->is_main_query()) {
        return;
    }
    if ($query->is_search) {
        $query->set('post_type', '-----「カスタム投稿タイプ名」を記述-----');
        // $query->set( 'post_type', [ 'hoge', 'foo' ] ); // CPTが複数ある場合は配列で指定 
    }
}
add_filter('pre_get_posts', 'include_cpt_search');


// カスタムタクソノミー・カスタムフィールド関連
function custom_search($search, $wp_query)
{
    global $wpdb;

    if (!$wp_query->is_search)
        return $search;

    if (!isset($wp_query->query_vars))
        return $search;

    $search_words = explode(' ', isset($wp_query->query_vars['s']) ? $wp_query->query_vars['s'] : ''); // 検索データが存在する場合（三項演算子：条件? true: false）は、取得した検索データを半角スペース区切りで配列へ変換
    if (count($search_words) > 0) { // 配列の中身が存在すれば下記の処理へ移行
        $search = ''; // 関数の返却値（returnで指定）
        foreach ($search_words as $word) {
            if (!empty($word)) { // $wordが 空 || null の状態でない（falseの場合）なら下記の処理へ移行
                $search_word = $wpdb->prepare("%%{$word}%%"); // プレースホルダーが使用できるprepare関数：'SQL 文字定数の中で%を使う場合、LIKE のワイルドカードも含めて %% のように二重の % を書いてエスケープ'

                // .=（値を結合した形で変数に格納）
                $search .= " AND (
                   {$wpdb->posts}.post_title LIKE '{$search_word}'
                   OR {$wpdb->posts}.post_content LIKE '{$search_word}'
           
                   OR {$wpdb->posts}.ID IN (
                     SELECT distinct r.object_id
                     FROM {$wpdb->term_relationships} AS r
                     INNER JOIN {$wpdb->term_taxonomy} AS tt ON r.term_taxonomy_id = tt.term_taxonomy_id
                     INNER JOIN {$wpdb->terms} AS t ON tt.term_id = t.term_id
                     WHERE t.name LIKE '{$search_word}'
                   OR t.slug LIKE '{$search_word}'
                   OR tt.description LIKE '{$search_word}'
                   )
           
                   OR {$wpdb->posts}.ID IN (
                     SELECT distinct post_id
                     FROM {$wpdb->postmeta}
                     WHERE {$wpdb->postmeta}.meta_key IN ('-----「メタ：フィールド名」を記述-----','-----「メタ：フィールド名」を記述-----','-----「メタ：フィールド名」を記述-----') AND meta_value LIKE '{$search_word}'
        			)
               ) ";
            }
        }
    }

    return $search;
}
add_filter('posts_search', 'custom_search', 10, 2);
```

コメントアウトで明記していますが、
- `include_cpt_search`関数
検索対象にカスタム投稿タイプを含む処理

- `custom_search`関数
DBからカスタムタクソノミー・カスタム（メタ）フィールドを取得する処理
カスタム（メタ）フィールドが不要の場合は以下の部分を削除する。

```sql
OR {$wpdb->posts}.ID IN (
    SELECT distinct post_id
    FROM {$wpdb->postmeta}
    WHERE {$wpdb->postmeta}.meta_key IN ('-----「メタ：フィールド名」を記述-----','-----「メタ：フィールド名」を記述-----','-----「メタ：フィールド名」を記述-----') AND meta_value LIKE '{$search_word}'
)
```

使用時には上記関数の所定箇所の変更が必要になります。

::: note
ここまで設定して、もし機能しない場合は`WordPress`のダッシュボードから[表示設定]または[パーマリンク設定]を**何も変更せず保存**してみてください（※保存ボタンはページ下部にあります）
`WordPress`サイトでのページ遷移関連の不具合は上記を行うことで解決することがままあります。
:::

`functions.php`内の sql 文は筆者の知識不足から古かったり、非推奨な記述になっている可能性もあります。
他にも spl 文のみならず、記述が間違っていたり、おかしかったりする部分がありますと、恐れ入りますがコメントなどでご指摘いただきますとありがたく存じます。

今回ご紹介したものは筆者の`GitHub`にありますので、興味を持って下さった方は是非ご覧ください。
`localstorage`を使った機能やスタイリングシートの用意など拡張版という形になっています。

https://github.com/Benjuwan/MyLibs/tree/main/frontend/FilterSearchAtWordPress

## さいごに

筆者がこれを自作した当時は（納期に迫られていることもあって）情報取集に苦労しました。

~~今では`GPT`や`copilot`など生成AIがあり、より早くスマートな実装を教えてくれるでしょう。ただ筆者の実体験としては、自分で集めて、触って、改善して……というサイクルを通じたからこそ応用力が身に付いた気がします。とはいえ、当時`GPT`があればバリバリ活用していたと思います。~~

2025.02.13 に生成AI（`claude`, `Gemini`, `ChatGPT`：すべて無料版）を用いて大幅なリファクタリングを行いました。
具体的には従来コードでは条件分岐やコンテンツデータ表示において冗長かつ保守性のかなり低い質だったのですが、リファクタリングによってタクソノミーやタームの各種データを自動的に取得及び反映するようになっています。
すごくありがたい時代になったものです(・ω・)

この記事が昔の筆者のような方をお手伝いできる記事になっていたら嬉しく思います。

ここまで長々と拙文を読んでいただき、ありがとうございました。
