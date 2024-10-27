<?php get_header(); ?>

<?php

// キーワード
$s = $_GET['s'];

/* 各項目ごとに条件（チェックされていない場合）によって明示的に状態(null)を指定してやることで WordPress の debugMode: true 時のエラー回避 */

// ドロップダウンリストの項目
if (!isset($_GET['get_searches']) || $_GET['get_searches'] === '') {
    $get_searches = null;
} else {
    $get_searches = $_GET['get_searches'];
}

// エリア
if (!isset($_GET['get_searcharea']) || $_GET['get_searcharea'] === '') {
    $get_searcharea = null;
} else {
    $get_searcharea = $_GET['get_searcharea'];
}

// ジャンル
if (!isset($_GET['get_bunkei01']) || $_GET['get_bunkei01'] === '') {
    $get_bunkei01 = null;
} else {
    $get_bunkei01 = $_GET['get_bunkei01'];
}
if (!isset($_GET['get_bunkei02']) || $_GET['get_bunkei02'] === '') {
    $get_bunkei02 = null;
} else {
    $get_bunkei02 = $_GET['get_bunkei02'];
}
if (!isset($_GET['get_bunkei03']) || $_GET['get_bunkei03'] === '') {
    $get_bunkei03 = null;
} else {
    $get_bunkei03 = $_GET['get_bunkei03'];
}
if (!isset($_GET['get_bunri01']) || $_GET['get_bunri01'] === '') {
    $get_bunri01 = null;
} else {
    $get_bunri01 = $_GET['get_bunri01'];
}
if (!isset($_GET['get_bunri02']) || $_GET['get_bunri02'] === '') {
    $get_bunri02 = null;
} else {
    $get_bunri02 = $_GET['get_bunri02'];
}
if (!isset($_GET['get_rikei01']) || $_GET['get_rikei01'] === '') {
    $get_rikei01 = null;
} else {
    $get_rikei01 = $_GET['get_rikei01'];
}

/* ジャンルで【どれか（get_bunkei01 〜 get_rikei01まで）選択されている場合のみ】$get_majorがtrueになる。この条件分岐がないと、$get_majorは常にtrueとなり、絞り込み検索時の他の条件にまで割り込んでくる */
// ジャンルをまとめた変数（get_major）
if ($get_bunkei01 || $get_bunkei02 || $get_bunkei03 || $get_bunri01 || $get_bunri02 || $get_rikei01) {
    $get_major = [ // 項目[アルファベット]の内容をまとめて管理する小分け用の配列
        $get_bunkei01,
        $get_bunkei02,
        $get_bunkei03,
        $get_bunri01,
        $get_bunri02,
        $get_rikei01
    ];
} else {
    $get_major = null;　// 明示的に状態(null)を指定してやることで WordPress の debugMode: true 時のエラー回避
}

// 検索用データ（キーワード、ドロップダウンリストの項目、エリア項目、ジャンル項目）をまとめた変数（get_cats）
$get_cats = [
    $s,
    $get_searches,
    $get_searcharea,
    $get_major
];


/* 以下は検索結果ページで各コンテンツを表示する(WP_QueryのtaxQueryで使用する)ための記述 */

// タクソノミーデータ（ドロップダウンリストの項目）
$tax_TargetTaxonomy = [
    'taxonomy' => 'taxonomy_name', // タクソノミー名
    'field' => 'slug', // スラッグでの指定を明記
    'terms' => $get_searches, // 当該タクソノミーに該当する(検索項目/タームの)変数名を指定（変数名の命名は検索項目の変数名とリンクしたようなものにしたほうが無難）
    'operator' => 'IN', // ('AND'どちらも(AND検索) / 'IN'どちらか(OR検索) / 'NOT IN'それら以外)
];

// タクソノミーデータ（エリア項目）
$tax_searcharea = [
    'taxonomy' => 'search_area',
    'field' => 'slug',
    'terms' => $get_searcharea,
    'operator' => 'IN',
];

// タクソノミーデータ（ジャンルの項目に内包される各タクソノミー）
$tax_bnk01 = [
    'taxonomy' => 'bunkei',
    'field' => 'slug',
    'terms' => $get_bunkei01,
    'operator' => 'IN',
];
$tax_bnk02 = [
    'taxonomy' => 'bunkei',
    'field' => 'slug',
    'terms' => $get_bunkei02,
    'operator' => 'IN',
];
$tax_bnk03 = [
    'taxonomy' => 'bunkei',
    'field' => 'slug',
    'terms' => $get_bunkei03,
    'operator' => 'IN',
];
$tax_bunri01 = [
    'taxonomy' => 'bunri',
    'field' => 'slug',
    'terms' => $get_bunri01,
    'operator' => 'IN',
];
$tax_bunri02 = [
    'taxonomy' => 'bunri',
    'field' => 'slug',
    'terms' => $get_bunri02,
    'operator' => 'IN',
];
$tax_rk01 = [
    'taxonomy' => 'rikei',
    'field' => 'slug',
    'terms' => $get_rikei01,
    'operator' => 'IN',
];
?>

<?php if (
    is_post_type_archive('CustomPostType_SlugName') &&
    $get_cats = isset($s) || isset($get_searches) || isset($get_searcharea) || isset($get_major)
) :
?>

    <h2 class="search_h2">
        <?php if (get_search_query() && $get_cats = !isset($get_searcharea) && !isset($get_major) && isset($get_searches)) : // キーワード + ドロップダウンリストの項目（エリア項目とジャンル項目は無し） 
        ?>

            <?php
            foreach ($get_searches as $val) {
                $TaxonomyTypeSlug = get_term_by('slug', $val, 'taxonomy_name');
            }
            printf(__('検索結果 %s', 'altitude'), '<span id="SerachKeywords">' . htmlspecialchars($TaxonomyTypeSlug->name, ENT_QUOTES) . 'で、フリーワード：' . esc_html(get_search_query()) . '</span>'); ?>
            <?php $allsearch = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    'relation' => 'AND',
                    [
                        $tax_TargetTaxonomy,
                    ],
                ],
                's' => $s,
            ]);
            $key = esc_html($s, 1);
            $count = $allsearch->post_count;
            if ($count != 0 && !$get_cats) {
                echo wp_kses_post('<p class="search_infotxt">"<strong>' . $key . '</strong>"で検索した結果、<strong>' . $count . '</strong>件ヒットしました。</p>');
            }
            wp_reset_postdata();
            ?>

        <?php elseif ($get_cats = isset($get_searches) && isset($get_searcharea) && isset($get_major)) : // ドロップダウンリストの項目とエリア項目とジャンル項目（キーワードは無し）
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    'relation' => 'AND',
                    [
                        $tax_TargetTaxonomy,
                    ],
                    [
                        $tax_searcharea,
                    ],
                    [
                        'relation' => 'OR',
                        $tax_bnk01,
                        $tax_bnk02,
                        $tax_bnk03,
                        $tax_bunri01,
                        $tax_bunri02,
                        $tax_rk01
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php elseif ($get_cats = isset($get_searches) && !isset($get_searcharea) && isset($get_major)) : // ドロップダウンリストの項目とジャンル項目（エリア項目は無し）
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    'relation' => 'AND',
                    [
                        $tax_TargetTaxonomy,
                    ],
                    [
                        'relation' => 'OR',
                        $tax_bnk01,
                        $tax_bnk02,
                        $tax_bnk03,
                        $tax_bunri01,
                        $tax_bunri02,
                        $tax_rk01
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php elseif ($get_cats = isset($get_searches) && isset($get_searcharea) && !isset($get_major)) : // ドロップダウンリストの項目とエリア項目（ジャンル項目は無し）
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    'relation' => 'AND',
                    [
                        $tax_TargetTaxonomy,
                    ],
                    [
                        $tax_searcharea,
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php elseif ($get_cats = !isset($get_searches) && !isset($get_searcharea) && isset($get_major)) : // ジャンル項目のみ
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    [
                        'relation' => 'OR',
                        $tax_bnk01,
                        $tax_bnk02,
                        $tax_bnk03,
                        $tax_bunri01,
                        $tax_bunri02,
                        $tax_rk01
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php elseif ($get_cats = !isset($get_searches) && !isset($get_major) && isset($get_searcharea)) : // エリア項目のみ
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    [
                        'relation' => 'OR',
                        $tax_searcharea
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php elseif ($get_cats = isset($get_searches) && !isset($get_major) && !isset($get_searcharea)) : // ドロップダウンリストの項目のみ 
        ?>

            <?php $all_search = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    [
                        'relation' => 'OR',
                        $tax_TargetTaxonomy
                    ],
                ],
                's' => $s,
            ]);
            $count = $all_search->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt">該当件数：<strong>' . $count . '</strong>件</p>');
            }
            wp_reset_postdata();
            ?>


        <?php endif; ?>

        <?php if (get_search_query() && $get_cats = !isset($get_searcharea) && !isset($get_major) && isset($get_searches)) : // キーワードが（1文字でも）存在する場合の件数表示用の条件分岐 
        ?>
            <?php $KeywordsAndTargetTaxNameType = new WP_Query([
                'posts_per_page' => -1,
                'post_type' => 'Target_PostTypeName',
                'tax_query' => [
                    'relation' => 'AND',
                    [
                        $tax_TargetTaxonomy,
                    ],
                ],
                's' => $s,
            ]);
            $count = $KeywordsAndTargetTaxNameType->post_count;
            if ($count != 0) {
                echo wp_kses_post('<p class="search_infotxt"><strong>' . $count . '</strong>件ヒットしました。</p>');
            }
            wp_reset_postdata();
            ?>


        <?php else : ?>
            <?php echo '<p id="array_word"><span>検索語句</span>';
            if ($s) {
                $key = esc_html($s, 1);
                echo wp_kses_post('<small>フリーワード：' . $key . '</small>');
            }
            if ($get_searches) {
                foreach ($get_searches as $val) {
                    $search_targetTaxType_term = get_term_by('slug', $val, 'taxonomy_name');
                    echo wp_kses_post('<small>' . $search_targetTaxType_term->name . '</small>');
                }
            }
            if ($get_searcharea) {
                foreach ($get_searcharea as $val) {
                    $search_area_term = get_term_by('slug', $val, 'search_area');
                    echo wp_kses_post('<small>' . $search_area_term->name . '</small>');
                }
            }
            if ($get_bunkei01) {
                foreach ($get_bunkei01 as $val) {
                    $args01_term = get_term_by('slug', $val, 'bunkei');
                    echo wp_kses_post('<small>' . $args01_term->name . '</small>');
                }
            }
            if ($get_bunkei02) {
                foreach ($get_bunkei02 as $val) {
                    $args02_term = get_term_by('slug', $val, 'bunkei');
                    echo wp_kses_post('<small>' . $args02_term->name . '</small>');
                }
            }
            if ($get_bunkei03) {
                foreach ($get_bunkei03 as $val) {
                    $args03_term = get_term_by('slug', $val, 'bunkei');
                    echo wp_kses_post('<small>' . $args03_term->name . '</small>');
                }
            }
            if ($get_bunri01) {
                foreach ($get_bunri01 as $val) {
                    $args04_term = get_term_by('slug', $val, 'bunri');
                    echo wp_kses_post('<small>' . $args04_term->name . '</small>');
                }
            }
            if ($get_bunri02) {
                foreach ($get_bunri02 as $val) {
                    $args05_term = get_term_by('slug', $val, 'bunri');
                    echo wp_kses_post('<small>' . $args05_term->name . '</small>');
                }
            }
            if ($get_rikei01) {
                foreach ($get_rikei01 as $val) {
                    $args06_term = get_term_by('slug', $val, 'rikei');
                    echo wp_kses_post('<small>' . $args06_term->name . '</small>');
                }
            }
            echo '</p>'; ?>
        <?php endif; ?>
    </h2>


    <?php if (get_search_query() && $get_cats = !isset($get_searcharea) && !isset($get_major) && isset($get_searches)) : // キーワード + ドロップダウンリストの項目（エリア項目とジャンル項目は無し） 
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'AND',
                [
                    $tax_TargetTaxonomy,
                ],
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = isset($get_searches) && isset($get_searcharea) && isset($get_major)) : // ドロップダウンリストの項目とエリア項目とジャンル項目（キーワードは無し）
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'AND',
                [
                    $tax_TargetTaxonomy
                ],
                [
                    $tax_searcharea
                ],
                [
                    'relation' => 'OR',
                    $tax_bnk01,
                    $tax_bnk02,
                    $tax_bnk03,
                    $tax_bunri01,
                    $tax_bunri02,
                    $tax_rk01
                ],
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = isset($get_searches) && !isset($get_searcharea) && isset($get_major)) : // ドロップダウンリストの項目とジャンル項目（エリア項目は無し）
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'AND',
                [
                    $tax_TargetTaxonomy
                ],
                [
                    'relation' => 'OR',
                    $tax_bnk01,
                    $tax_bnk02,
                    $tax_bnk03,
                    $tax_bunri01,
                    $tax_bunri02,
                    $tax_rk01
                ],
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = isset($get_searches) && isset($get_searcharea) && !isset($get_major)) : // ドロップダウンリストの項目とエリア項目（ジャンル項目は無し）
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'AND',
                [
                    $tax_TargetTaxonomy
                ],
                [
                    $tax_searcharea
                ]
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = !isset($get_searches) && !isset($get_searcharea) && isset($get_major)) : // ジャンル項目のみ
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'OR',
                $tax_bnk01,
                $tax_bnk02,
                $tax_bnk03,
                $tax_bunri01,
                $tax_bunri02,
                $tax_rk01
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = !isset($get_searches) && !isset($get_major) && isset($get_searcharea)) : // エリア項目のみ
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'OR',
                $tax_searcharea
            ],
            's' => $s,
        ]); ?>


    <?php elseif ($get_cats = isset($get_searches) && !isset($get_major) && !isset($get_searcharea)) : // ドロップダウンリストの項目のみ
    ?>

        <?php
        $paged = (get_query_var('paged')) ? absint(get_query_var('paged')) : 1; //ページ送りの機能に必須
        $my_query = new WP_Query([
            'posts_per_page' => 6,
            'paged' => get_query_var('paged', 0),
            'post_type' => 'Target_PostTypeName',
            'tax_query' => [
                'relation' => 'OR',
                $tax_TargetTaxonomy
            ],
            's' => $s,
        ]); ?>

    <?php endif; ?>


    <main id="search_main">
        <?php if ($my_query->have_posts()) : ?>
            <ul class="contents_list">
                <?php while ($my_query->have_posts()) : $my_query->the_post(); ?>
                    <li><!-- コンテンツの中身 --></li>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>

            <?php else : ?>
                <li id="no_search_txt">
                    <h3>該当する項目・キーワードはございませんでした</h3>
                </li>
            </ul>
        <?php endif; ?>

        <?php if ($get_cats) : ?>
            <div class="pn_link">
                <?php the_posts_pagination([
                    'prev_text' => '&larr;',
                    'next_text' => '&rarr;',
                    'total' => htmlspecialchars($my_query->max_num_pages, ENT_QUOTES) // $my_query（指定した変数を記入）
                ]); ?>
            </div>
        <?php endif; ?>

    </main>
<?php endif; ?>

<?php get_footer(); ?>