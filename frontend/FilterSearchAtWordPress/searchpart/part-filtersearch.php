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
                    <!-- 特定分野の場合はラベル名に ▼ を前置 -->
                    <?php if(strpos($taxonomy_name, 'vocational')): ?>
                        <?php echo esc_html('▼'.$parent_term->name); ?>
                    <?php else: ?>
                        <?php echo esc_html($parent_term->name); ?>
                    <?php endif; ?>
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
                                <!-- name属性： 不要な _ を排除した文字列に変換 -->
                                <input type="checkbox" 
                                    <?php $adjust_name_attr = explode("_", $child_term->slug); ?>
                                    name="<?php echo esc_attr('get_' .$adjust_name_attr[0]. '[]'); ?>"
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
    
        <input type="hidden" name="post_type" value="hoge">
        <input type="hidden" name="post_type" value="foo">
        <p id="department_btn"><input type="submit" value="検索"></p>
    </div>
</div>
</form>
