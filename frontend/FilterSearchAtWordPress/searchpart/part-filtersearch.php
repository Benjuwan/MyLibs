<form role="search" method="get" id="searchform" class="searchform" action="<?php echo esc_url(home_url('/')); // 検索機能に記述必須 ?>">

<div class="department_wrapper">
	<div class="SearchWrapper">
		<div id="SearchMainWrapper">
			<h3>タイトル</h3>
			<div class="selectschoolWrapper">
				<p>項目タイトル</p>
				<?php
				$ConstSearchTargets = [
					// 'order' => 'DESC', // 'ASC'（昇順）, 'DESC'（降順）,【初期値】'ASC'
					'value_field' => 'slug', // （フォームの）option要素の'value'属性へ入れるタームのフィールド(現状スラッグ)
					'taxonomy'  => 'taxonomy_name', // タクソノミー名
					'name' => 'get_searches[]', // 当該検索項目を格納する配列
					'id' => 'echoIdAttr', // 要素へ付与するid属性名を記述。初期値だと'name'に指定した内容になる
					// 'show_option_none' => ('以下から選択'), // 初期プレースホルダー
					'option_none_value' => '', // 未選択時のoption要素のvalue属性値を指定（空 = %5B%5D = []）
					'exclude' => [240, 273], // 'tag_id=xxxx'のタームを除外 
				];
				?>
				<?php wp_dropdown_categories($ConstSearchTargets); // ドロップダウンメニューで変数（$ConstSearchTargets）の内容を出力 
				?>
			</div>
			<div class="areaWrapper">
				<p>対象地域・エリアを選択</p>
				<details class="SearchMenu" id="AreaBox">
					<summary>エリア</summary>
					<?php
					$term_id = 163; // tag_id=xxxx：タグID（数値）を指定
					$taxonomy_name = 'search_area'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
					$termchildren = get_term_children($term_id, $taxonomy_name);
					foreach ($termchildren as $child) :
						$term = get_term_by('id', $child, $taxonomy_name);
					?>
    				<!-- name属性：項目内容を格納する配列(name="xxxx[]")を用意（*ここで指定した配列の中身（ユーザーがチェックした選択項目）をsearch.php（検索結果ページ）で呼び出す）
                        value属性：タームスラッグを呼び出す(value="?php echo esc_attr( $term->slug ); ?
                        ターム名を表示：?php echo esc_html( $term->name) ; ?
                    -->
						<summary><label><input type="checkbox" name="get_searcharea[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
					<?php endforeach; ?>
				</details>
			</div>
			<div id="MajorBox">
				<p>ジャンルを選択</p>
				<details class="children">
					<summary>ジャンル[A]</summary>
					<details>
						<summary>ジャンル[A-1]</summary>
						<?php
						$term_id = 165; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'bunkei'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_bunkei01[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
					<details>
						<summary>ジャンル[A-2]</summary>
						<?php
						$term_id = 166; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'bunkei'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_bunkei02[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
					<details>
						<summary>ジャンル[A-3]</summary>
						<?php
						$term_id = 184; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'bunkei'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_bunkei03[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
				</details>
				<details class="children">
					<summary>ジャンル[B]</summary>
					<details>
						<summary>ジャンル[B-1]</summary>
						<?php
						$term_id = 178; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'bunri'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_bunri01[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
					<details>
						<summary>ジャンル[B-2]</summary>
						<?php
						$term_id = 194; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'bunri'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_bunri02[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
				</details>
				<details class="children">
					<summary>ジャンル[C]</summary>
					<details>
						<summary>ジャンル[C-1]</summary>
						<?php
						$term_id = 180; // tag_id=xxxx：タグID（数値）を指定
						$taxonomy_name = 'rikei'; // taxonomy=xxxx：タクソノミーSlug（文字列）を指定
						$termchildren = get_term_children($term_id, $taxonomy_name);
						foreach ($termchildren as $child) :
							$term = get_term_by('id', $child, $taxonomy_name);
						?>
							<summary><label><input type="checkbox" name="get_rikei01[]" value="<?php echo esc_attr($term->slug); ?>"><?php echo esc_html($term->name); ?></label></summary>
						<?php endforeach; ?>
					</details>
				</details>
			</div>
		</div>
		<div class="get_search">
			<label><input type="search" placeholder="フリーワードを入力" value="" name="s" id="s"></label>
		</div>
		<input type="hidden" name="post_type" value="CustomPostType_SlugName">
		<p id="department_btn"><input type="submit" value="検索"></p>
	</div>
</div>

</form>