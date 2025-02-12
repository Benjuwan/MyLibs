<!-- フィルター検索（ユーザー選択またはキーワード入力）のデータ取得 -->
<?php 
    function get_filtered_contents() {
        // GETパラメータから動的にタクソノミー検索条件を構築
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
            'post_type' => ['info', 'news'], // コンテンツデータを取得したい投稿タイプのスラッグ名（複数指定は配列形式）
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 1),
            's' => get_search_query(),
            'tax_query' => ['relation' => 'AND']
        ];

        // 各タクソノミーごとのサブクエリを準備
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = [];
            
            // GETパラメータを走査して、指定のprefixで始まるものを全て取得
            foreach ($_GET as $key => $value) {
                // strpos('get_bunkei01', 'get_bunkei') === 0 ← get_bunkei という文字列が get_bunkei01 という文字列内に含まれていて、どの部分が一致しているかどうかをチェックし、0文字目が一致しているので === 0 が成立すると true.
                // $param_prefix が $key に「含まれていて先頭一致」している かつ $value が空でない場合
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
        
        // GETパラメータから動的にタクソノミー検索条件を構築
        $taxonomy_mapping = [
            'school_cat' => 'get_schooltype',
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
