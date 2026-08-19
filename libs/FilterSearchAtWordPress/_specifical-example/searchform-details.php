<?php
    function generate_taxonomy_radio_or_checkbox($taxonomy_name, $orderby, $radio) {
        ?>
        <li>
            <?php $args = [
                'orderby' => $orderby,
                'order' => 'ASC',
                'hide_empty' => 0,
            ];
            $taxonomies = get_terms($taxonomy_name, $args);

            foreach ($taxonomies as $taxonomy) {
                // $taxonomy_name が 'tax'文字列を含んでいる場合は文字列加工
                if (strpos($taxonomy_name, 'tax') !== false) {
                    $term_name_ = explode('tax_', $taxonomy_name);
                    $term_name = $term_name_[1];
                } else {
                    $term_name = $taxonomy_name;
                }
            ?>

            <label>
                <!-- ラジオボタンの場合 -->
                <?php if($radio): ?>
                    <input type="radio" name="<?php echo esc_attr('get_' . $term_name); ?>" value="<?php echo esc_attr( $taxonomy->slug ); ?>"><?php echo esc_html( $taxonomy -> name); ?>
                <!-- チェックボックスの場合 -->
                <?php else: ?>
                    <input type="checkbox" name="<?php echo esc_attr('get_' . $term_name . '[]'); ?>" value="<?php echo esc_attr( $taxonomy->slug ); ?>"><?php echo esc_html( $taxonomy -> name); ?>
                <?php endif; ?>
            </label>

            <?php
                }
            ?>
        </li>
        <?php
    }
?>

<form role="search" method="get" id="searchform" action="<?php echo esc_url(home_url('/')); ?>">
    <h3>各項目を選択/調整の上、検索してください</h3>
    <div class="department_wrapper">
        <div class="department_child_wrapper">
            <div class="area_wrapper">
                <ul>
                    <li><h5>求職者の区分：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_recruit', 'name', true); ?>
                </ul>
                <ul>
                    <li><h5>詳細区分：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_recruit_cat', 'slug', false); ?>
                </ul>
                <ul>
                    <li><h5>性別：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_sex', 'slug', true); ?>
                </ul>
                <ul>
                    <li><h5>国籍：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_nationality', 'slug', false); ?>
                </ul>
                <ul>
                    <li><h5>年齢：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_age', 'slug', false); ?>
                </ul>
                <ul>
                    <li><h5>日本語能力：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('jlpt_lank', 'name', false); ?>
                </ul>
                <ul>
                    <li><h5>現在の職業：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_current_job', 'slug', false); ?>
                </ul>
                <ul>
                    <li><h5>介護職従事経験：</h5></li>
                    <?php echo generate_taxonomy_radio_or_checkbox('tax_kaigo_career', 'name', false); ?>
                </ul>
            </div>
        </div>
        <div>
            <input type="hidden" name="post_type[]" value="international">
            <input type="hidden" name="post_type[]" value="national">
            <input type="hidden" name="s" id="s" value="<?php echo get_search_query(); ?>">
            <p id="department_btn"><input type="submit" value="検索する"></p>
        </div>
    </div>
</form>