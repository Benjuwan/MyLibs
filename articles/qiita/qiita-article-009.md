title: WordPressの投稿コンテンツフィルター機能をReactで制作

tags: WordPress React TypeScript PHP 初心者

`WordPress REST API`を使ってWordPressの投稿データ（コンテンツ）を`json`形式で取得できます。今回はそれを用いて React / TypeScript でコンテンツのフィルター機能を作りました。備忘録を踏まえて記事にしていきたいと思います。
記事構成は【WordPressでの準備編】と【Reactでのフィルター機能実装編】の2部構成にしています。

【使用技術】
- WordPress
- React
- TypeScript
- Vite

# WordPressでの準備編
## WordPressの投稿データ（コンテンツ）を取得する方法
`WordPress REST API`を使ってコンテンツを取得する方法はシンプルです。`取得先のWordPressサイトドメイン/wp-json/wp/v2/`を指定するだけです。下記例では`fetch API`を使っていますが、他の方法（`axios`や`ajax`）でも行えるでしょう。
```javascript
fetch('取得先のWordPressサイトドメイン/wp-json/wp/v2/');
```

## メタ（フィールド）データの取得
メタ（フィールド）データを取得するには一工夫必要です。

::: note info
例えば、プラグイン`ACF（Advanced Custom Fields）`などを使って用意しているデータはメタ（フィールド）データです。
:::

**※メタ（フィールド）データの取得が必要のない方は以下をスキップして[「取得できるコンテンツ数の上限を解除」](#取得できるコンテンツ数の上限を解除)に進んでください。**

下記内容を`functions.php`に記述します。

::: note warn
`functions.php`はWordPressサイトで重要な役割を担っており、`functions.php`の修正・更新時にデザインや機能などに不具合が生じる可能性もありますので取り扱いには注意してください。バックアップを取ってから進めることを推奨致します。
:::

```php
add_action( 'rest_api_init', 'create_api_posts_meta_field' );

function create_api_posts_meta_field() 
{
 	register_rest_field( 
		'post', // 投稿タイプ
		'meta_field', // これは任意のキー名
		array(
 			'get_callback' => 'get_post_meta_for_api',
			'update_callback' => 'update_post_meta_for_api',
 			'schema' => null,
 		)
 	);
}

// 取得（GET）時のオブジェクトにpostのメタをすべて追加
function get_post_meta_for_api( $object ){
 	$post_id = $object['id'];
 	return get_post_meta( $post_id );
}

// 投稿（POST）時のオブジェクトからメタを更新する
function update_post_meta_for_api($value, $object, $fieldName){
	foreach($value as $key => $val){
        $rtn = update_post_meta($object->ID, $key, $val);
		if (!$rtn){
			return false;
		}
	}
	return $rtn;
}
```
- 上記内容を参照したサイト様の記事

https://note.com/suzuki_reiko/n/n757e453a1c0a

## 取得できるコンテンツ数の上限を解除
`WordPress REST API`ではコンテンツ取得数の上限が**100件**までとなっていますので上限を解除します。`functions.php`に記述していきます。

```php
add_action('rest_api_init', 'add_rest_endpoint_all_posts_from_blog');

// リクエスト先のURLを登録（get_all_posts_from_blog 関数からコンテンツ（データ）を取得し、'GET'形式でリクエスト）
function add_rest_endpoint_all_posts_from_blog() {
  register_rest_route(
    'wp/api',
    '/blog',
    array(
      'methods' => 'GET',
      'callback' => 'get_all_posts_from_blog'
    )
  );
}

// 取得したいコンテンツ（データ）の内容を指定
function get_all_posts_from_blog() {
  $args = array(
    'posts_per_page' => -1, // -1 で全件取得
    'post_type' => 'postType', // 投稿タイプを指定
    'post_status' => 'publish' // 公開済みの内容
  );
  $all_posts = get_posts($args); // 上記引数（$args）の内容をもとに投稿（コンテンツ）データを取得

  $result = array(); // この関数（get_all_posts_from_blog ）の戻り値となる配列

  // 投稿（コンテンツ）データへの繰り返し処理
  foreach($all_posts as $post) {

	// カテゴリー（ターム）A 取得
	$categoryA_terms = get_the_terms( $post->ID, 'カテゴリー（ターム）A 名' );
		foreach ( $categoryA_terms as $term ) {
			$categoryA_term = $term->name;
		}

	// カテゴリー（ターム）B 取得
	$categoryB_terms = get_the_terms( $post->ID, 'カテゴリー（ターム）B 名' );
		foreach ( $categoryB_terms as $term ) {
			$categoryB_term = $term->name;
		}
	  
	// メタ（フィールド）データ取得
	$metadata = get_post_meta( $post->ID );

    // 取得したいデータ内容を記述した配列
    $data = array(
      'ID' => $post->ID,
      'thumbnail' => get_the_post_thumbnail_url($post->ID, 'full'),
      'slug' => $post->post_name,
      'date' => $post->post_date,
      'modified' => $post->post_modified,
      'title' => $post->post_title,
      'excerpt' => $post->post_excerpt,
      'content' => $post->post_content,
	  'メタ（フィールド）データ A 名' => $categoryA_term,
	  'メタ（フィールド）データ B 名' => $categoryB_term,
	  'meta_data' => $metadata
    );
    array_push($result, $data); // 戻り値の配列（$result）に取得したいデータ内容の配列（$data）を渡す
  };
  return $result; // この関数（get_all_posts_from_blog ）の戻り値
}
```
- 上記内容を参照したサイト様の記事

https://designsupply-web.com/media/programming/6327/

記載したコードは上記サイト様の記事内容をもとに、**任意のカテゴリー（ターム）とメタ（フィールド）データを取得するための記述を追記**しています（繰り返し処理内でのカテゴリー及びメタデータ取得と、`$data`配列内の`'content' => $post->post_content,`以下の3行部分）。

::: note info
上限解除した場合のコードではリクエスト先のURLを変更しています。
```php
function add_rest_endpoint_all_posts_from_blog() {
  register_rest_route(
    'wp/api',
    '/blog',
    // ……中略
```

そのためコンテンツデータ取得時には**変更したリクエスト先のURLを指定**しなければなりません。※例として`fetch API`を使用。

```javascript
fetch('取得先のWordPressサイトドメイン/wp-json/wp/api/blog');
```
:::

<details>
<summary>※上限解除 + デフォルトの個別投稿（'post_type' => 'post'）データを取得したい場合</summary>

**カテゴリーとタグの取得を追記**しています。先述した`get_all_posts_from_blog`関数の中身が下記内容に差し変わっているだけです。

```php
function get_all_posts_from_blog() {
  $args = array(
    'posts_per_page' => -1,
    'post_type' => 'post', // デフォルト投稿タイプを指定
    'post_status' => 'publish'
  );
  $all_posts = get_posts($args);
  $result = array();
  foreach($all_posts as $post) {

	// カテゴリー
	$categories = get_the_terms( $post->ID, 'category' );
		foreach ( $categories as $category ) {
			$cat_term = $category->name;
		}
	
	// タグ
	$tags = get_the_terms( $post->ID, 'post_tag' );
	$tag_term = '';
	if($tags){
		foreach ( $tags as $tag ) {
			$tag_term = $tag->name;
		}
	}
	  
    $data = array(
      'ID' => $post->ID,
      'thumbnail' => get_the_post_thumbnail_url($post->ID, 'full'),
      'slug' => $post->post_name,
      'date' => $post->post_date,
      'modified' => $post->post_modified,
      'title' => $post->post_title,
      'excerpt' => $post->post_excerpt,
      'content' => $post->post_content,
      'category' => $cat_term,
      'tag' => $tag_term
    );
    array_push($result, $data);
  };
  return $result;
}
```
</details>

# Reactでのフィルター機能実装編
## データ取得用のカスタムフックを用意
WordPressで準備した投稿コンテンツデータの取得機能を用意します。カスタムフックにして使い勝手が良くなるようにしておきます。
- `useGetJsonData.ts`
```react
import { useCallback, useContext } from "react";

// コンテンツ反映用の配列を Context で用意
import { GetFetchDate } from "../../provider/GetFetchDataContext";

// 取得するコンテンツデータの内容に応じた型
import { WpApiAllContentsType } from "../../ts/WpApiAllContentsType";

export const useGetJsonData = () => {
    const { isGetFetchDateAry, setGetFetchDateAry } = useContext(GetFetchDate);

    const GetJsonData = useCallback((
        url: string
    ) => {
        const ViewGetFetchData = async () => {
            const newAry = [...isGetFetchDateAry];
            const responese = await fetch(url);
            const resObj: Array<WpApiAllContentsType> = await responese.json();

            if (responese.status === 200) {
                resObj.forEach((resEl, i) => {
                    newAry.push(resEl);
                    setGetFetchDateAry(newAry);
                });
            } else {
                console.log(responese.status);
            }
        }
        ViewGetFetchData();
    }, []);

    return { GetJsonData }
}
```
取得したコンテンツデータを格納しておく配列を用意します。コード内にあるように`Context`を使ってコンテンツデータを格納しておく配列（`isGetFetchDateAry`）を用意し、各コンポーネントやカスタムフックで使用できるようにしておきます。
- `GetFetchDateContext.tsx`
```react
import { createContext, FC, ReactNode, useState } from "react";
// 取得するコンテンツデータの内容に応じた型
import { WpApiAllContentsType } from "../ts/WpApiAllContentsType";

type Default = {
    isGetFetchDateAry: Array<WpApiAllContentsType>;
    setGetFetchDateAry: React.Dispatch<React.SetStateAction<WpApiAllContentsType[]>>;
}
export const GetFetchDate = createContext({} as Default);

type flagmentType = {
    children: ReactNode;
}
export const GetFetchDateContextFlagment: FC<flagmentType> = (props) => {
    // コンテンツデータを格納しておく配列
    const [isGetFetchDateAry, setGetFetchDateAry] = useState<Array<WpApiAllContentsType>>([]);
    return (
        <GetFetchDate.Provider value={{ isGetFetchDateAry, setGetFetchDateAry }}>
            {props.children}
        </GetFetchDate.Provider>
    );
}
```
先ほど用意した`Context`を用いた`main.tsx`の中身は下記コードになります。
- `main.tsx`
```react
// ...中略
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
    <GetFetchDateContextFlagment>
        <App />
    </GetFetchDateContextFlagment>
</React.StrictMode>
)
```

## 取得したコンテンツデータを描画
作ったカスタムフック（`useGetJsonData`）とコンテンツデータ配列（`isGetFetchDateAry`）を使ってコンテンツを描画します。
- `GetContents.tsx`
```react
// ...中略
// コンテンツ反映用の配列を Context で用意
const { isGetFetchDateAry } = useContext(GetFetchDate);

// カテゴリー項目クリックでのコンテンツ取得用の配列
const { isClickedCategory } = useContext(ClickedCategoryContext);

// WordPress REST API からデータを取得するメソッド
const { GetJsonData } = useGetJsonData();

// 投稿コンテンツ（データ）を取得
useEffect(() => {
    GetJsonData('サイト名/wp-json/wp/api/blog');
}, []);

return (
    <>
        {isSearch ?
            null :
            isGetFetchDateAry.map((aryEl, i) => (
                <article key={i} className="articleContents">
                    <button type="button" className="categories actionableEls" onClick={(e) =>
                    {
                        GetCategoryContents(e.currentTarget, isGetFetchDateAry);
                        <GetContentsResult getAry={isClickedCategory} />
                    }}>{aryEl.cat ?? 'aryEl.cat が null or undefined の場合に表示'}</button>
                    {/* 取得した投稿コンテンツ（データ）の内容を表示
                        {aryEl.title}, 
                        {aryEl.cat.content}, 
                        {aryEl.thumbnail} etc...
                    */}
                </article>
            ));
        }
    </>
);
```

`button`要素（カテゴリーボタン）のクリックイベントに指定されている`<GetContentsResult getAry={isClickedCategory} />`で渡されているpropsの`isClickedCategory`はカテゴリー項目クリックでのコンテンツ取得用の配列です。（クリックされた時の）カテゴリー名でフィルターをかけたコンテンツデータを扱う`Context`になります。
- `ClickedCategoryContext.tsx`
<details>
<summary>ClickedCategoryContext の内容</summary>

```react
import { createContext, FC, ReactNode, useState } from "react";
// 取得するコンテンツデータの内容に応じた型
import { WpApiAllContentsType } from "../ts/WpApiAllContentsType";

type Default = {
    isClickedCategory: Array<WpApiAllContentsType>;
    setClickedCategory: React.Dispatch<React.SetStateAction<WpApiAllContentsType[]>>;
}
export const ClickedCategoryContext = createContext({} as Default);


type flagmentType = {
    children: ReactNode;
}
export const ClickedCategoryContextFlagment: FC<flagmentType> = (props) => {
    /* カテゴリー項目クリックでのコンテンツ取得用の配列 */
    const [isClickedCategory, setClickedCategory] = useState<Array<WpApiAllContentsType>>([]);

    return (
        <ClickedCategoryContext.Provider value={{ isClickedCategory, setClickedCategory }}>
            {props.children}
        </ClickedCategoryContext.Provider>
    );
}
```
</details>

先ほど用意していた`Context`（`isGetFetchDateAry`）と同様に`main.tsx`に追記しておきます。
- `main.tsx`
<details>
<summary>追記後の main.tsx の内容</summary>

```react
// ...中略
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
    <GetFetchDateContextFlagment>
        <CategoriesContextFlagment>
            <App />
        </CategoriesContextFlagment>
    </GetFetchDateContextFlagment>
</React.StrictMode>
)
```
::: note info 
これから先のコードでいくつか他の`Context`（例：`isSearch`, `isSearchWords`, `isSearchResults`, `isSwitch` etc...）も出てきますが、このように`main.tsx`に追記している想定で読み進めてください。
:::
</details>

## カテゴリー名でのフィルター機能
カテゴリーボタンのクリックイベントに指定している`GetCategoryContents`メソッドでフィルター結果用の配列を用意して、フィルター結果を反映させるためのコンポーネント（`GetContentsResult`）にpropsとしてその配列を渡しています。

```react
<button type="button" className="categories actionableEls" onClick={(e) => {
// カテゴリー項目をクリックで当該項目コンテンツのみを表示するメソッド
GetCategoryContents(e.currentTarget, isGetFetchDateAry);
// カテゴリー項目をクリック後のフィルター結果を表示するコンポーネント。props にフィルター結果のデータを入れた配列を渡す
<GetContentsResult getAry={isClickedCategory} />
// ...中略
```

- `useGetCategoryContents.ts`
<details>
<summary>useGetCategoryContents（GetCategoryContents）の内容</summary>

```react
// ...中略
export const useGetCategoryContents = () => {
    // ...中略
    const { filterContentsCategories } = useFilterContents();

    const GetCategoryContents = useCallback((
        eCurrentCategory: HTMLElement,
        targetAry: Array<WpApiAllContentsType>
    ) => {
        // フィルターにかける文字列
        const targetStr = eCurrentCategory.textContent;
        // 対象文字列をフィルターにかけた後のコンテンツデータ
        const filterResults = filterContentsCategories(String(targetStr), targetAry);
        // フィルターにかけた後のコンテンツデータで、描画用のコンテンツデータ配列（State）を更新
        const newSearchResults = [...isClickedCategory];
        filterResults.forEach(filterEl => {
            newSearchResults.push(filterEl);
            setClickedCategory(newSearchResults);
        });

        /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
        setSearch(!isSearch);
    }, []);

    return { GetCategoryContents }
}
```
</details>

`GetCategoryContents`メソッド内で、フィルターのコア機能となる`filterContentsCategories`メソッドを用意しています。これは文字列と合致した内容（配列）を返すメソッドです。

- `useFilterContents.ts`
<details>
<summary>useFilterContents（filterContentsCategories）の内容</summary>

```react
// ...中略
export const useFilterContents = () => {

    /* キーワード検索用 */
    const filterContentsKeywords = (
        targetStr: RegExp | string,
        getFetchDateAry: Array<WpApiAllContentsType>
    ) => {
        return getFetchDateAry.filter(dateEl => {
            /* 対象文字列：[半角スペース 全角スペース 改行](各個 + で繰り返し（複数判定）含む) */
            const adjustWords = new RegExp(`${""}[ |　|\n]+${""}`, 'img');

            const AllStrTitle: string | undefined = dateEl.title.trim().split(adjustWords).join('');
            const AllStrContent: string | undefined = dateEl.content.trim().split(adjustWords).join('');

            if (
                AllStrTitle.match(targetStr) ||
                AllStrContent.match(targetStr)
            ) {
                return dateEl;
            }
        });
    }

    /* カテゴリー検索用 */
    const filterContentsCategories = (
        targetStr: RegExp | string,
        getFetchDateAry: Array<WpApiAllContentsType>
    ) => {
        return getFetchDateAry.filter(dateEl => {
            const AllStrCat: string | undefined = dateEl.cat;
            if (AllStrCat !== undefined && AllStrCat.match(targetStr)) {
                return dateEl;
            }
        });
    }

    return { filterContentsKeywords, filterContentsCategories }
}
```
</details>

紹介した`filterContentsCategories`（カテゴリー検索用）のほか、`filterContentsKeywords`（キーワード検索用）も用意していますが、処理はどちらも同じように文字列と合致した内容を返す機能になっています。キーワード検索用（`filterContentsKeywords`）ではキーワード整形するためにトリミングしたり、不要な要素（全角・半角スペースや改行）を省いたりしています。

## フィルター結果を反映させる
フィルター（検索）結果を表示するためのコンポーネントを用意します。先ほどpropsを渡すと説明していた`GetContentsResult`がそのコンポーネントです。
- `GetContentsResult.tsx`
```react
type AryType = {
    getAry: Array<WpApiAllContentsType>; // フィルター後のコンテンツデータ
    getWords?: Array<string>; // フィルターをかけた文字列
}
export const GetContentsResult: FC<AryType> = memo((props) => {
// ...中略
return (
    <div className="ContentsArea">
        {/* props で渡された配列が存在する場合は以下の処理を実施 */}
        {props.getAry.length > 0 &&
            <>
                <div className="searchResultTxts">
                    {props.getWords !== undefined &&
                        <p>検索対象：{props.getWords.join(' / ')}</p>
                    }
                </div>
                {
                    props.getAry.map((aryEl, i) => (
                        /* 「'aryEl' は 'undefined' の可能性があります」を避けるため条件指定 */
                        aryEl !== undefined &&
                        <article key={i} className="articleContents">
                            <button type="button" className="categories actionableEls" onClick={(e) =>
                            {
                                GetCategoryContents(e.currentTarget, isGetFetchDateAry);
                                <GetContentsResult getAry={isClickedCategory} />
                            }}>{aryEl.cat ?? 'aryEl.cat が null or undefined の場合に表示'}</button>
                            {/* 取得した投稿コンテンツ（データ）の内容を表示
                                {aryEl.title}, 
                                {aryEl.cat.content}, 
                                {aryEl.thumbnail} etc...
                            */}
                        </article>
                    ))
                }
            </>
        }

        {/* カテゴリー項目をクリックした場合は以下の処理を実施 */}
        {isClickedCategory.length > 0 &&
            isClickedCategory.map((aryEl, i) => (
                aryEl !== undefined &&
                <article key={i} className="articleContents">
                    <button type="button" className="categories actionableEls" onClick={(e) =>
                    {
                        GetCategoryContents(e.currentTarget, isGetFetchDateAry);
                        <GetContentsResult getAry={isClickedCategory} />
                    }}>{aryEl.cat ?? 'aryEl.cat が null or undefined の場合に表示'}</button>
                    {/* 取得した投稿コンテンツ（データ）の内容を表示
                        {aryEl.title}, 
                        {aryEl.cat.content}, 
                        {aryEl.thumbnail} etc...
                    */}
                </article>
            ))
        }

        {/* 検索結果が該当なし or カテゴリー項目をクリックしていない場合 */}
        {((props.getAry.length || isClickedCategory.length) > 0) ? null :
            <p style={{ "width": "100%", "fontSize": "16px", "lineHeight": 1.8, "textAlign": "center" }}>恐れ入りますが<br />該当する検索結果はありませんでした。</p>
        }
    </div>
);
```


## 複数カテゴリーやキーワードでのフィルター機能
- `ContentFilterCategories.tsx`（複数カテゴリー用コンポーネント）
- `ContentFilterkeyword.tsx`（キーワード用コンポーネント）
用途別にコンポーネントを作って、それぞれで用意した`form`要素の`submit`イベント及び検索用`button`要素の`click`イベントで、フィルター機能を実装しています。

### 複数カテゴリーでのフィルター機能
- `ContentFilterCategories.tsx`（複数カテゴリー用コンポーネント）
<details>
<summary>ContentFilterCategories の内容</summary>

```react
// ...中略
export const ContentFilterCategories = memo(() => {
    /* 各種Context */
    const { isGetFetchDateAry } = useContext(GetFetchDate);
    const { isSwitch } = useContext(SwitchContext);
    const { isSearch, setSearch } = useContext(SearchContext);
    const { setClickedCategory } = useContext(ClickedCategoryContext);
    const { isCategories } = useContext(CategoriesContext);

    /* 検索結果を格納する配列 */
    const [isSearchResults, setSearchResults] = useState<Array<WpApiAllContentsType>>([]);

    /* 検索結果で表示する検索項目を格納 */
    const [isSearchWords, setSearchWords] = useState<Array<string>>([]);

    /* カテゴリ名を格納する配列 */
    const catsName: Array<string> = [];

    /* カテゴリ関連の情報 */
    isGetFetchDateAry.map(resEl => {
        catsName.push(`${resEl.business_cat}`);
    });

    /* 重複したカテゴリー名を排除して描画用のカテゴリーリスト（theCategories）を生成 */
    isCategories.push([...new Set(catsName)]);
    const theCategories = isCategories[isCategories.length - 1];

    /* カテゴリー検索 */
    const theCatAct = useCallback((
        checkbox: NodeListOf<HTMLInputElement>
    ) => {
        const { filterContentsCategories } = useFilterContents();
        const checkedItems = Array.from(checkbox).filter(cbItem => {
            return cbItem.checked;
        });
        /* 複数項目指定用の配列 */
        const checkedLabels: Array<string> = [];

        if (checkedItems.length > 0) {
            checkedItems.forEach(checkedItem => {
                const labelTxt = String(checkedItem.closest('label')?.textContent);

                /* チェックされた項目のlabelテキストを複数項目指定用の配列へ格納 */
                checkedLabels.push(labelTxt);

                /* 検索結果で表示する検索項目を格納 */
                const newLabels = [...isSearchWords];
                for (let i = 0; i < checkedItems.length; i++) {
                    newLabels.push(checkedLabels[i]);
                    setSearchWords(newLabels);
                }

                /* new RegExp：正規表現オブジェクトを生成 */
                /* カテゴリー項目は OR検索 で処理を進める */
                const regResult = new RegExp(`${''}${checkedLabels.join('|')}${''}`, 'g');

                const filterResults = filterContentsCategories(regResult, isGetFetchDateAry);

                const newSearchResults = [...isSearchResults];
                filterResults.forEach(filterEl => {
                    newSearchResults.push(filterEl);
                    setSearchResults(newSearchResults);
                });
            });
        }
    }, [isSwitch]);

    useEffect(() => {
        /* カテゴリー項目(チェックボックス) */
        const catBox = document.querySelectorAll<HTMLInputElement>('#categoriesForm input[type="checkbox"]');
        /* 検索ボタン */
        const ActBtn = document.querySelector('#searchCategoryOn');

        ActBtn?.addEventListener('click', () => {
            /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
            setSearch(!isSearch);
            /* カテゴリー項目クリックでのコンテンツ取得用の配列を空に */
            setClickedCategory([]);
            theCatAct(catBox);
        });
    }, [isSwitch]);
    /* カテゴリー検索 */

    /* form の送信イベント（デフォルト処理のキャンセルと isSearch Stateの更新）*/
    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
        setSearch(!isSearch);
    }

    return (
        <>
            {isSearch ? <GetContentsResult
                getAry={isSearchResults}
                getWords={isSearchWords}
            /> :
                <FormOfCategories>
                    <form id="categoriesForm" onSubmit={handleSubmit}>
                        <div className="labelsFlagment">
                            {
                                theCategories.map((catItem, i) => {
                                    return (
                                        <label key={i} htmlFor={`catItem_00${i}`}>
                                            <input type="checkbox" name="categories" id={`catItem_00${i}`} />
                                            <span>{catItem}</span>
                                        </label>
                                    )
                                })
                            }
                        </div>
                        <button id="searchCategoryOn" type="submit">検索</button>
                    </form>
                </FormOfCategories>
            }
        </>
    );
});

```
</details>

コードが長いのでアコーディオンにしましたが、フィルター機能とイベント類だけを抜粋したものが下記になります。
```react
// ----------- フィルター機能 ----------- 
const theCatAct = useCallback((
    checkbox: NodeListOf<HTMLInputElement>
) => {
    const { filterContentsCategories } = useFilterContents();
    const checkedItems = Array.from(checkbox).filter(cbItem => {
        return cbItem.checked;
    });
    /* 複数項目指定用の配列 */
    const checkedLabels: Array<string> = [];

    if (checkedItems.length > 0) {
        checkedItems.forEach(checkedItem => {
            const labelTxt = String(checkedItem.closest('label')?.textContent);

            /* チェックされた項目のlabelテキストを複数項目指定用の配列へ格納 */
            checkedLabels.push(labelTxt);

            /* 検索結果で表示する検索項目を格納 */
            const newLabels = [...isSearchWords];
            for (let i = 0; i < checkedItems.length; i++) {
                newLabels.push(checkedLabels[i]);
                setSearchWords(newLabels);
            }

            /* new RegExp：正規表現オブジェクトを生成 */
            /* カテゴリー項目は OR検索 で処理を進める */
            const regResult = new RegExp(`${''}${checkedLabels.join('|')}${''}`, 'g');

            const filterResults = filterContentsCategories(regResult, isGetFetchDateAry);

            const newSearchResults = [...isSearchResults];
            filterResults.forEach(filterEl => {
                newSearchResults.push(filterEl);
                /* 検索結果を格納 */
                setSearchResults(newSearchResults);
            });
        });
    }
}, [isSwitch]);

// ----------- イベント ----------- 
useEffect(() => {
    // ...中略
    ActBtn?.addEventListener('click', () => {
        /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
        setSearch(!isSearch);
        /* カテゴリー項目クリックでのコンテンツ取得用の配列を空に */
        setClickedCategory([]);
        theCatAct(catBox);
    });
}, [isSwitch]);

/* form の送信イベント（デフォルト処理のキャンセルと isSearch Stateの更新）*/
const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
    setSearch(!isSearch);
}
```

### キーワードでのフィルター機能
- `ContentFilterkeyword.tsx`（キーワード用コンポーネント）
<details>
<summary>ContentFilterkeyword の内容</summary>

```react
// ...中略
export const ContentFilterkeyword = memo(() => {
    /* 各種Context */
    const { isGetFetchDateAry } = useContext(GetFetchDate);
    const { isSwitch } = useContext(SwitchContext);
    const { isSearch, setSearch } = useContext(SearchContext);
    const { setClickedCategory } = useContext(ClickedCategoryContext);

    /* 検索結果を格納する配列 */
    const [isSearchResults, setSearchResults] = useState<Array<WpApiAllContentsType>>([]);

    /* 検索結果で表示する検索キーワードを格納 */
    const [isSearchWords, setSearchWords] = useState<Array<string>>([]);

    /* キーワード検索 */
    const theKeywordAct = useCallback((
        inputTxtEl: HTMLInputElement
    ) => {
        const { filterContentsKeywords } = useFilterContents();

        /* 複数検索（検索ワードに半角または全角スペースが含まれている場合） */
        const multiTargetWords = new RegExp(`${""}[ |　]${""}`, 'mg');
        if (inputTxtEl.value.match(multiTargetWords)) {
            const multiWords: Array<string> = inputTxtEl.value.split(multiTargetWords);

            /*  検索結果で表示する検索キーワードを格納 */
            const newMultiWords = [...isSearchWords];
            multiWords.forEach(multiWord => {
                newMultiWords.push(multiWord);
                setSearchWords(newMultiWords);
            });

            /* new RegExp：正規表現オブジェクトを生成（AND検索）
            OR検索にしたい場合は「new RegExp(`${""}[対象文字列A|対象文字列B|対象文字列C]+${""}`, 'img');」に変更
            */
            const forAndstr = multiWords.map(multiWord => {
                return multiWord = `(?=.*${multiWord})`;
            });
            const regResult = new RegExp(`${'^'}${forAndstr.join('')}${'.*$'}`, 'igm');

            /* キーワードによるコンテンツの合致作業（検索キーワードでのHit機能） */
            const filterResults = filterContentsKeywords(regResult, isGetFetchDateAry);

            const newSearchResults = [...isSearchResults];
            filterResults.forEach(filterEl => {
                newSearchResults.push(filterEl);
                setSearchResults(newSearchResults);
            });
        }

        /*（1ワード）単体検索 */
        else {
            /*  検索結果で表示する検索キーワードを格納 */
            const newMultiWords = [...isSearchWords];
            newMultiWords.push(inputTxtEl.value);
            setSearchWords(newMultiWords);

            const filterResults = filterContentsKeywords(inputTxtEl.value, isGetFetchDateAry);

            const newSearchResults = [...isSearchResults];
            filterResults.forEach(filterEl => {
                newSearchResults.push(filterEl);
                setSearchResults(newSearchResults);
            });
        }
    }, [isSwitch]);

    useEffect(() => {
        /* 入力用テキストinput */
        const txtBox = document.querySelector<HTMLInputElement>('#keywordForm input[type="text"]');
        /* 検索ボタン */
        const ActBtn = document.querySelector('#searchKeywordsOn');
        ActBtn?.setAttribute('disabled', 'true');

        if (txtBox !== null) {
            txtBox.addEventListener('input', () => {
                if (txtBox.value.length > 0) {
                    ActBtn?.removeAttribute('disabled');
                    ActBtn?.addEventListener('click', () => {
                        /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
                        setSearch(!isSearch);
                        /* カテゴリー項目クリックでのコンテンツ取得用の配列を空に */
                        setClickedCategory([]);
                        theKeywordAct(txtBox);
                    });
                } else {
                    ActBtn?.setAttribute('disabled', 'true');
                }
            });
        }
    }, []);
    /* キーワード検索 */

    /* form の送信イベント（デフォルト処理のキャンセルと isSearch Stateの更新）*/
    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();
        /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
        setSearch(!isSearch);
    }

    return (
        <>
            {isSearch ? <GetContentsResult
                getAry={isSearchResults}
                getWords={isSearchWords}
            /> :
                <form id="keywordForm" onSubmit={handleSubmit}>
                    <label><small>気になるワードで記事を検索</small><input type="text" onChange={inputTxtChecker} value={isInputTxt} /></label>
                    <button id="searchKeywordsOn" type="submit">検索</button>
                </form>
            }
        </>
    );
});
```
</details>

先ほどと同様にフィルター機能とイベント類だけを下記に抜粋します。
```react
// ----------- フィルター機能 ----------- 
const theKeywordAct = useCallback((
    inputTxtEl: HTMLInputElement
) => {
    const { filterContentsKeywords } = useFilterContents();

    /* 複数検索（検索ワードに半角または全角スペースが含まれている場合） */
    const multiTargetWords = new RegExp(`${""}[ |　]${""}`, 'mg');
    if (inputTxtEl.value.match(multiTargetWords)) {
        const multiWords: Array<string> = inputTxtEl.value.split(multiTargetWords);

        /*  検索結果で表示する検索キーワードを格納 */
        const newMultiWords = [...isSearchWords];
        multiWords.forEach(multiWord => {
            newMultiWords.push(multiWord);
            setSearchWords(newMultiWords);
        });

        /* new RegExp：正規表現オブジェクトを生成（AND検索）
        OR検索にしたい場合は「new RegExp(`${""}[対象文字列A|対象文字列B|対象文字列C]+${""}`, 'img');」に変更
        */
        const forAndstr = multiWords.map(multiWord => {
            return multiWord = `(?=.*${multiWord})`;
        });
        const regResult = new RegExp(`${'^'}${forAndstr.join('')}${'.*$'}`, 'igm');

        /* キーワードによるコンテンツの合致作業（検索キーワードでのHit機能） */
        const filterResults = filterContentsKeywords(regResult, isGetFetchDateAry);

        const newSearchResults = [...isSearchResults];
        filterResults.forEach(filterEl => {
            newSearchResults.push(filterEl);
            setSearchResults(newSearchResults);
        });
    }

    /*（1ワード）単体検索 */
    else {
        /*  検索結果で表示する検索キーワードを格納 */
        const newMultiWords = [...isSearchWords];
        newMultiWords.push(inputTxtEl.value);
        setSearchWords(newMultiWords);

        const filterResults = filterContentsKeywords(inputTxtEl.value, isGetFetchDateAry);

        const newSearchResults = [...isSearchResults];
        filterResults.forEach(filterEl => {
            newSearchResults.push(filterEl);
            setSearchResults(newSearchResults);
        });
    }
}, [isSwitch]);

// ----------- イベント ----------- 
useEffect(() => {
    /* 入力用テキストinput */
    const txtBox = document.querySelector<HTMLInputElement>('#keywordForm input[type="text"]');
    /* 検索ボタン */
    const ActBtn = document.querySelector('#searchKeywordsOn');
    ActBtn?.setAttribute('disabled', 'true');

    if (txtBox !== null) {
        txtBox.addEventListener('input', () => {
            if (txtBox.value.length > 0) {
                ActBtn?.removeAttribute('disabled');
                ActBtn?.addEventListener('click', () => {
                    /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
                    setSearch(!isSearch);
                    /* カテゴリー項目クリックでのコンテンツ取得用の配列を空に */
                    setClickedCategory([]);
                    theKeywordAct(txtBox);
                });
            } else {
                ActBtn?.setAttribute('disabled', 'true');
            }
        });
    }
}, []);

/* form の送信イベント（デフォルト処理のキャンセルと isSearch Stateの更新）*/
const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    /* isSearch を true にして GetContentsResult コンポーネントを呼び出す */
    setSearch(!isSearch);
}
```

## WordPress REST API と TypeScript の相性
ここまで`TypeScript`を用いて諸々実装してきましたが以下のような情報を見ました。

> WordPress の PHP ベースのバックエンドと TypeScript（または JavaScript）を使ったフロントエンドとの間でのデータのやり取り（例えば、WordPress REST API を通じて）は、型安全性が保証されないため、TypeScript の型システムをフルに活用することは難しいです。

参照元サイト様

https://commte.net/wordpress-risk

書いてあるように「WordPress REST API を通じては型安全性が保証されない」ようです。
JAMstack開発がしたい！とかで、ヘッドレスCMSとして使用するならば`microCMS`とか他のものを使った方が良いのでしょうかね。

とはいえ、WordPressのシェアは依然として高いですし、今後さらに発展していって`WordPress REST API`と`TypeScript`の問題？が修正されていくかもですね！

## 最後に
正直、冗長なコードで、可読性も悪く、再レンダリングへの配慮も足りないコードだと自覚しています。
例えば、フィルター検索用のボタンクリックイベントを`useEffect`フックを使って手続き的な処理にしていますが、`onClick`イベントにした方が`React`らしい宣言的な処理になるのだろうか、とか。

とはいえ、自分のやりたいことを実現できた時は達成感がありましたし、ここで紹介したコードがどこかの誰かの役に少しでも立てば嬉しく思います。
ここまで読んでいただきまして誠にありがとうございました。

## 情報参照元サイト様
https://note.com/suzuki_reiko/n/n757e453a1c0a

https://designsupply-web.com/media/programming/6327/

https://commte.net/wordpress-risk

