<?php
    function get_filtered_contens() {
        // GETパラメータから動的にタクソノミー検索条件を構築
        $taxonomy_mapping = [
            'tax_recruit' => 'get_recruit',
            'tax_recruit_cat' => 'get_recruit_cat',
            'tax_sex' => 'get_sex',
            'tax_nationality' => 'get_nationality',
            'tax_age' => 'get_age',
            'jlpt_lank' => 'get_jlpt_lank',
            'tax_current_job' => 'get_current_job',
            'tax_kaigo_career' => 'get_kaigo_career'
        ];

        // クエリの基本設定
        $query_args = [
            'post_type' => ['international', 'national'],
            'paged' => get_query_var('paged', 0),
            'posts_per_page' => 5
        ];

        // taxonomy_mappingをベースにしてGETパラメータを確認
        foreach ($taxonomy_mapping as $taxonomy => $get_param) {
            if (isset($_GET[$get_param])) {
                $value = $_GET[$get_param];
                $terms = is_array($value) ? $value : [$value];
                
                if (!empty($terms)) {
                    $tax_query[] = [
                        'taxonomy' => $taxonomy,
                        'field'    => 'slug',
                        'terms'    => $terms,
                        'operator' => 'IN',
                    ];
                }
            }
        }
        
        if (!empty($tax_query)) {
            if (!empty($tax_query)) {
                $query_args['tax_query'] = [
                    'relation' => 'AND', // relation は先頭に配置
                    ...$tax_query
                ];
            }
        } else {
            unset($query_args['tax_query']);
        }

        // var_dump($query_args);
        return new WP_Query($query_args);
    }
?>
<?php $my_query = get_filtered_contens(); ?>

<!-- フィルター検索（ユーザー選択またはキーワード入力）の項目名またはキーワード取得 -->
<?php
    function get_search_terms_display() {
        $display_terms = [];
        
        // GETパラメータから動的にタクソノミー検索条件を構築
        $taxonomy_mapping = [
            'tax_recruit' => 'get_recruit',
            'tax_recruit_cat' => 'get_recruit_cat',
            'tax_sex' => 'get_sex',
            'tax_nationality' => 'get_nationality',
            'tax_age' => 'get_age',
            'jlpt_lank' => 'get_jlpt_lank',
            'tax_current_job' => 'get_current_job',
            'tax_kaigo_career' => 'get_kaigo_career'
        ];
        
        // $taxonomy_mapping をループして $taxonomy にタクソノミー名（例: 'tax_recruit'）を代入し、
        // $param_prefix に対応するプレフィックス（例: 'get_recruit'）を代入する。
        foreach ($taxonomy_mapping as $taxonomy => $param_prefix) {
            $terms = [];
            
            // $_GET のクエリパラメータをループして、$key にパラメータ名（例: 'get_recruit'）を、$value にその値（例: 'Engineer'）を代入する。
            foreach ($_GET as $key => $value) {
                // もし $key が $param_prefix（例: 'get_recruit'）で始まり、かつ $value が空でなければ処理を行う。
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

<?php if( !is_user_logged_in() ): // ログインページ（固定ページのスラッグ-login）へリダイレクト。使用時は必ず[get_header]より前に記述すること。ログインしたらリダイレクトは無し（TOPページが表示される） ?>
    <?php wp_redirect( esc_url(home_url('login')) ); exit; ?>
<?php endif; ?>
    
<?php get_header(); ?>

<main id="archive_main">
    <section>
        <h2 class="search_h2">
            <p class="search_infotxt">該当件数：<strong><?php echo esc_html($my_query->found_posts); ?></strong>件</p>
            <p id="array_word">
                <span>検索語句</span>
                <?php foreach ($search_terms as $term): ?>
                    <small><?php echo esc_html($term); ?></small>
                <?php endforeach; ?>
            </p>
        </h2>

        <div class="parent_wrapper">
            <div class="child_wrapper">
            <?php if($my_query->have_posts() ) : ?>
                <?php while( $my_query->have_posts()): 
                    $my_query->the_post(); 
                ?>
                <div class="content">
                <?php if( get_post_type() == 'international' ): ?>
                    <div class="nat_cat nc_inter"><?php echo wp_kses_post(get_the_term_list($post->ID, 'tax_recruit') ); ?></div>
                <?php elseif( get_post_type() == 'national' ): ?>
                    <div class="nat_cat nc_nat"><?php echo wp_kses_post(get_the_term_list($post->ID, 'tax_recruit') ); ?></div>
                <?php endif; ?>
                    <a href="<?php the_permalink(); ?>" target="_blank">
                        <div class="a_content">
                            <?php if( has_post_thumbnail() ): ?>
                                <p class="thumbnail_box"><?php the_post_thumbnail(); ?></p>
                            <?php endif; ?>
                            <div class="main_info">
                                <p><span>名前：</span><?php the_title(); ?></p>
                                <p><span>国籍：</span><?php the_field('nationality'); ?></p>
                                <p><span>居住地：</span><?php the_field('livingarea'); ?></p>
                                <p><span>年齢：</span><?php the_field('age'); ?></p>
                            </div>
                        </div>
                    </a>
                </div>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>

            <?php else: ?>
                <div id="no_search_txt">
                    <h3>該当する項目・キーワードはございませんでした</h3>
                </div>
            <?php endif; ?>
            </div>
        </div>
    </section>

    <div class="pn_link">
        <?php the_posts_pagination( [
            'prev_text' => '&larr;',
            'next_text' => '&rarr;',
	        'total' => $my_query->max_num_pages // $my_query（指定した配列名を記入）
        ] ); ?>
    </div>

    <?php get_template_part('time','stamp'); //更新日 ?>
    <div class="offer_box">
        <a id="archive_offer" class="offer_link" href="javascript:void(0);" onclick="openWin()">-&nbsp;オファー画面を表示&nbsp;-</a>
        <span>!</span>
    </div>
</main>

<?php get_footer(); ?>
