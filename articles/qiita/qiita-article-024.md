---
title: HTML4 × Shift_JIS のサイトをNext.js × ヘッドレスCMSに置き換えた話
tags: Next.js TypeScript React WordPress HeadlessCMS
author: benjuwan
slide: false
---
## はじめに
筆者の会社では、2000年〜2010年ごろに作られた~~技術負債~~古いサイトを数ヶ月前まで運用していました。100〜200ページ規模で`HTML4`×`Shift_JIS`というサイトだったのですが、セキュリティ的な部分はもちろん、`JavaScript`で何か（例：文字の置換など）しようとしても`Shift_JIS`なので文字化けしたりして運用や保守がしづらかったのです。

今回、そんなサイトを`Next.js`（v14：AppRouter）× ヘッドレスCMS（`WordPress`）でサイトリニューアルした話をしていきたいと思います。

まず結論としては「**別にNext.jsでなくともGatsbyでも良かったのでは？**」と少し思ったりしています。
あと、今回は当該事業部のリソース（人的資源）不足を考慮してヘッドレスCMSとしましたが、人的資源がそこまで逼迫していない会社だと無理にヘッドレスとかしないで普通に`WordPress`で作ったほうが無難な気もします。
※他のCMSや組織に適したものを選ぶのももちろんありです。

筆者的には本案件を通じた学びはとても多かったのですが、実感としては上記の所感を得たので本記事の結論として先に書いておきます。

今回リニューアルしたサイトは「`Next.js`（v14：AppRouter）のSSG（静的サイト生成）で、各詳細ページはクライアントサイドデータフェッチしているSPA（CSR）な仕様」です。
そのため以下のデメリットがあります。

- 一部CSR（クライアントサイドレンダリング）なのでSEOに弱い（最近はそうでもないそう？）
- 全コンテンツデータを一挙に読み込むため初期表示時のUXが良くない（ローディング時間が平均2〜3秒）

メリットで言えば、サイトのコンテンツ更新・管理が誰でもできるようになると共にすごく楽になって更新作業負担が激減された、という部分があります。
あとは、`Next.js`のおかげでサイトパフォーマンスの数値は高まりましたし、保守しやすくもなりました。

ちなみに、AppRouterでSSR/ISR仕様のものも作りましたが途中で路線変更となり、完成形は「セルフホスティング（国内ホスティング会社）のSSG」となっています。

ですから以下のような話はあまり出てきません。
- AWS, Azure, Google Cloudなど各種パブリッククラウド（皆無）
- Vercelなどサーバーレスな話（ちょこっと）
- Next.jsのSSR/ISRに関する話（ぼちぼち）

これらを踏まえた上で本記事の対象読者は次になります。

## 対象読者
- `Next.js` × ヘッドレスCMS（`WordPress`）で何か作ってみたい初心者から中級者
- SSG（静的サイト生成）で作りつつもコンテンツの更新や修正の度にビルドしたくない方
  - 部分的にCSRにすることでコンテンツ更新（編集）に応じて自動的にカテゴリーやタグ、コンテンツ内容などを反映します

## サイトリニューアルの背景
そもそもなぜ`Next.js`（v14：AppRouter）× ヘッドレスCMS（`WordPress`）でサイトリニューアルしようと思ったのかは以下になります。

- `HTML4`×`Shift_JIS`サイトの運用保守が辛くなってきたし、セキュリティなど色々と不安な部分も出てきた
- モバイルファーストなサイトではなかった 
- **組織体制の変更に伴って当該サイトの運用保守に積極的に関われなくなった**
  - しかも当該サイトを管理する事業部はリソース（特に人的リソース）が少なく、webに詳しい人材もいないので今後の運用面で非エンジニアでも行えるようにしておく必要が出てきた
- Jamstackをはじめ、モダンフロントエンドのキャッチアップがしたいという筆者のエゴ

（一部不純な）上記理由から筆者は`Next.js`×`WordPress`でサイトリニューアルすることにしました。

## WordPressを選んだ理由
先程の背景から、非エンジニアでも簡単に扱えてコンテンツ更新しか行わないという条件面で`WordPress`がベターだと思いました。
さらに、前任のwebエンジニアが学習兼リニューアル目的で残していた`WordPress`サイトがあったのでコンテンツデータをそのまま引き継げるメリットもあったのです。

しかし`WordPress`は高いシェアで情報が豊富な反面、脆弱性やセキュリティ面での懸念があります。これら脆弱性の多くは`WordPress`本体ではなく、使用しているプラグインやサイト本体の更新を適切に管理できていない点やテーマの品質に起因します。

実際、残っていた`WordPress`サイトのテーマは学習目的もあってかエスケープ処理漏れや一般的な実装から外れた危ういテーマになっていました。この点からもヘッドレスCMSならテーマの品質を気に掛ける必要はないので安心です（※その代わり、データフェッチするサイト側の実装で留意する必要があります）。

あと現実として、残念ながら当該サイトを運営する事業部では適切に保守管理するほどの予算や余裕、知見はありませんでした。
そこで、極力管理せずとも良い方法を考えた結果「別の場所に`WordPress`サイトを置いてコンテンツ管理にのみ特化させる」という方法が良いと思いました。

まずは、以前からあった`WordPress`サイトの各種コンテンツデータを抽出し、別の場所に立てた`WordPress`サイトへ移行しました。

::: note info
データの移行は、標準のエクスポート機能（ダッシュボード：ツール - エクスポート）とプラグイン[`WordPress Importer`](https://ja.wordpress.org/plugins/wordpress-importer/)で簡単に行えます。
サイト全部をひっくるめて、というケースではプラグイン[`All-in-One WP Migration and Backup`](https://ja.wordpress.org/plugins/all-in-one-wp-migration/)がポピュラーだと思います。
:::

「ヘッドレスCMSとして使う＝プラグインは使用不可」なのでプラグインに関する懸念点も多少はクリアできますし、別の場所に置けばログインページ（wp-login/wp-admin）が露見する心配も減ります（※1）。

:::note warn
※1
- プラグインについて
サイトのUI部分に関するプラグイン（例：パンくずリストやページネーションなど）が使えないだけで、カスタム投稿タイプやカスタムフィールドの設定、記事管理に関するものなど一部のプラグインは使えます。
- ログインページ（wp-login/wp-admin）の露見について
今回最終的にSSG/CSRとなったので「画像パスからWordPressサイトのURLが分かる状態」です。しっかり隠したいならやはりフェッチ元パスは環境変数に設定してSSR/ISRするとかが良いかと思います。そうなるとそれらに対応したホスティング先を検討・選定する必要が出てきますが……。
また、セキュリティ関連のプラグインを使ってログインアドレスを変更できますが極力プラグインを増やしたくなかったのと、ロジック部分（`WordPress`）とデザイン（`Next.js`）部分の棲み分けをしたかったこともあって今回の方法を採りました。
:::

こういった事情と先の非エンジニア対応もあって`WordPress`がベターだと思いました。

## Next.jsでWordPressをヘッドレスCMSとして使う準備

一方、`React`や`Next.js`に関しては個人開発などで触れていたこと（や筆者のエゴ）もあって今回採用しました。
（あと恥ずかしながら当時は`Gatsby`を知りませんでした）

データフェッチに関しては`fetch API`を使用し、データ取得方法は`WordPress REST API`で行うことにしました。

調べると`WordPress`をヘッドレスCMSとして使うには`REST API`か`GraphQL`をプラグインを通じて利用する方法があるようです。

しかし調べていくうちに`GraphQL`は現状安定していなさそうと感じ、今回は`WordPress REST API`を使うことにしました。

https://www.webcreatorbox.com/tech/wordpress-headless-cms-nextjs

> RSCにGraphQLを組み合わせることはメリットよりデメリットの方が多くなる可能性があります。
> GraphQLはその特性上、前述のようなパフォーマンスと設計のトレードオフが発生しませんが、RSCも同様にこの問題を解消するため、これをメリットとして享受できません。それどころか、RSCとGraphQLを協調させるための知見やライブラリが一般に不足してるため、実装コストが高くバンドルサイズも増加するなど、デメリットが多々含まれます。
参考：[Next.jsの考え方 | データフェッチ on Server Components](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/part_1_server_components)

`RSC`：リアクトサーバーコンポーネント ※筆者注

ただ、**`WordPress REST API`はデフォルトで100件までしかデータを取得できません**。
そのため上限を超えてデータを取得したい場合は`functions.php`で独自エンドポイントを設定する必要があります。

<details><summary>筆者が設定した functions.php の内容</summary>

一覧や詳細、カテゴリー、タグの各種エンドポイントを設け、`register_rest_route`のコールバックに`get_contents`または`get_category_tag_content`を指定してデータの取得内容を各自切り分けています。
`get_contents`と`get_category_tag_content`の処理はほぼ同じで、返すデータの中身が異なるくらいです。

```php:functions.php
function add_rest_endpoints() {
  // 一覧  
  register_rest_route(
      'namespace', // namespace（例：wordpress/myapiroute）：コアプレフィックスの後の最初の URL セグメント。パッケージ/プラグインごとに一意である必要があります。
      '/route/(?P<post_type>\w+)', // route（例：/uniqueep/）：追加するルートのベースURL。
      array(
          'methods' => 'GET',
          'callback' => 'get_contents'
      )
  );

  // 詳細（個別ページ）
  register_rest_route(
      'namespace',
      '/route/(?P<post_type>\w+)/(?P<id>\d+)',
      array(
          'methods' => 'GET',
          'callback' => 'get_contents'
      )
  );

  // カテゴリー指定
  register_rest_route(
    'namespace',
    '/route/(?P<post_type>\w+)/category/[-\w\p{L}]+',
    array(
        'methods' => 'GET',
        'callback' => 'get_category_tag_content'
    )
  );

  // タグ指定
  register_rest_route(
    'namespace',
    '/route/(?P<post_type>\w+)/tag/(?P<id>\d+)',
    array(
        'methods' => 'GET',
        'callback' => 'get_category_tag_content'
    )
  );
}

/* -------- 一覧・詳細用 -------- */
function get_contents($data) {
  if ($data['post_type'] === 'magazinedata' || $data['post_type'] === 'カスタム投稿タイプAのスラッグ') {
    $post_type = 'カスタム投稿タイプAのスラッグ';
  } elseif ($data['post_type'] === 'カスタム投稿タイプBのスラッグ') {
    $post_type = 'カスタム投稿タイプBのスラッグ';
  } else {
    $post_type = 'post'; // デフォルトの投稿タイプ
  }
  $args = array(
      'posts_per_page' => -1, // 全件取得
      'post_type' => $post_type, // 投稿タイプに限定
      'post_status' => 'publish' // 公開済みのものを取得
  );

  if (isset($data['id'])) {
      $post_id = $data['id'];
      $posts = get_post($post_id);
      if (!$posts) {
          return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
      }
      $posts = array($posts);
  } else {
      $posts = get_posts($args);
  }

  $result = array();
  foreach ($posts as $post) {
      // カテゴリー
      $category_terms = get_the_terms($post->ID, 'category');
      $category_id_term = array();
      $category_slug_term = array();
      if($category_terms || $category_id_term) {
        foreach ($category_terms as $term) {
            $category_term = $term->name;
            $category_id_term = $term->term_taxonomy_id; // タクソノミーID を取得
            $category_slug = $term->slug; // タクソノミースラッグ を取得
        }
      }

      // タクソノミー
      $cat_com_terms = get_the_terms($post->ID, 'cat_com');
      if($cat_com_terms) {
        foreach ($cat_com_terms as $term) {
            $cat_com_term = $term->name;
        }
      }

      // タグ
      $tags = wp_get_post_tags($post->ID);
      $tag_terms = array();
      $tag_id_terms = array();
      if($tags || $tag_terms) {
        foreach ( $tags as $tag ) {
            $tag_terms[] = $tag->name;
            $tag_id_terms[] = $tag->term_taxonomy_id;
        }
      }

      // メタデータ（カスタムフィールド） 
      $metadata = array();
      /* 当該 meta データに紐づく画像IDを取得（抽出）*/
      foreach(get_post_meta($post->ID) as $key => $value) {
          $metadata[$key] = maybe_unserialize($value[0]); // maybe_unserialize()：メタデータの値がシリアライズされている場合に適切な形式に変換
      }

      /* 上記処理で取得した画像IDから画像パスを取得 */
      foreach($metadata as $key => $value) {
          if(wp_attachment_is_image($value)) {
              $metadata[$key] = wp_get_attachment_image_src($value, 'full')[0];
          }
      }
      
      /* 返すデータの中身 */
      $data = array(
          'ID' => $post->ID,
          'thumbnail' => get_the_post_thumbnail_url($post->ID, 'full'),
          'slug' => $post->post_name,
          'date' => $post->post_date,
          'modified' => $post->post_modified,
          'title' => $post->post_title,
          'excerpt' => $post->post_excerpt,
          'content' => $post->post_content,
          'category' => $category_term,
          'category_id' => $category_id_term,
          'category_slug_term' => $category_slug,
          'tag_term' => $tag_terms,
          'tag_id' => $tag_id_terms,
          'cat_com' => $cat_com_term,
          'meta_data' => $metadata
      );
      array_push($result, $data);
  }

  return $result;
}

/* -------- カテゴリー・タグ用 -------- */
function get_category_tag_content($data) {
    if ($data['post_type'] === 'magazinedata' || $data['post_type'] === 'カスタム投稿タイプAのスラッグ') {
        $post_type = 'カスタム投稿タイプAのスラッグ';
    } elseif ($data['post_type'] === 'カスタム投稿タイプBのスラッグ') {
        $post_type = 'カスタム投稿タイプBのスラッグ';
    } else {
        $post_type = 'post'; // デフォルトの投稿タイプ
    }
    $args = array(
        'posts_per_page' => -1,
        'post_type' => $post_type,
        'post_status' => 'publish'
    );
    $posts = get_posts($args);

    $result = array();
    foreach ($posts as $post) {
        // カテゴリー
        $category_terms = get_the_terms($post->ID, 'category');
        $category_id_term = array();
        $category_slug_term = array();
        if($category_terms || $category_id_term) {
          foreach ($category_terms as $term) {
              $category_term = $term->name;
              $category_id_term = $term->term_taxonomy_id; // タクソノミーID を取得
              $category_slug = $term->slug; // タクソノミースラッグ を取得
          }
        }
  
        // タクソノミー
        $cat_com_terms = get_the_terms($post->ID, 'cat_com');
        if($cat_com_terms) {
          foreach ($cat_com_terms as $term) {
              $cat_com_term = $term->name;
          }
        }
  
        // タグ
        $tags = wp_get_post_tags($post->ID);
        $tag_terms = array();
        $tag_id_terms = array();
        if($tags || $tag_terms) {
          foreach ( $tags as $tag ) {
              $tag_terms[] = $tag->name;
              $tag_id_terms[] = $tag->term_taxonomy_id;
          }
        }

        // メタデータ（カスタムフィールド） 
        $metadata = array();
        /* 当該 meta データに紐づく画像IDを取得（抽出）*/
        foreach(get_post_meta($post->ID) as $key => $value) {
            $metadata[$key] = maybe_unserialize($value[0]); // maybe_unserialize()：メタデータの値がシリアライズされている場合に適切な形式に変換
        }

        /* 上記処理で取得した画像IDから画像パスを取得 */
        foreach($metadata as $key => $value) {
            if(wp_attachment_is_image($value)) {
                $metadata[$key] = wp_get_attachment_image_src($value, 'full')[0];
            }
        }
  
        /* 返すデータの中身 */
        $data = array(
            'ID' => $post->ID,
            'thumbnail' => get_the_post_thumbnail_url($post->ID, 'full'),
            'title' => $post->post_title,
            'content' => $post->post_content,
            'category' => $category_term,
            'category_id' => $category_id_term,
            'category_slug_term' => $category_slug,
            'tag_term' => $tag_terms,
            'tag_id' => $tag_id_terms,
            'cat_com' => $cat_com_term,
            'meta_data' => $metadata
        );
        array_push($result, $data);
    }
  
  return $result;
}
add_action('rest_api_init', 'add_rest_endpoints');

/* デフォルトの REST API（の投稿タイプ：'カスタム投稿タイプA'）にサムネイル取得を追加 */
function add_thumbnails_to_post() {
    register_rest_field( 'カスタム投稿タイプAのスラッグ',
        'thumbnail',
        array(
            'get_callback'    => 'get_thumbnails_for_post',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
add_action( 'rest_api_init', 'add_thumbnails_to_post' );

// サムネイルを取得するコールバック関数
function get_thumbnails_for_post( $object ) {
  $thumbnail = get_the_post_thumbnail_url( $object['id'] );
  if ( empty( $thumbnail ) ) return ''; // サムネイルが設定されていない場合は空文字を返す
  return $thumbnail;
}
```

</details>

## 当初はSSR/ISRの仕様で開発を進めるも頓挫

`Next.js`では`SSR`,`ISR`,`SSG`など様々なレンダリング方法があります。
以下の記事が詳しいです。

https://depart-inc.com/blog/nextjs-rendering-usage/

筆者は当初AppRouterということもあって基本的にSSRで、詳細ページはISRという仕様で進めていました。

例えば、カテゴリーリンク一覧を生成するコンポーネント（サーバーコンポーネント）は以下になります（※必要部分のみ掲載）。
```tsx
/* データフェッチ */
const res: Response = await fetch(`${process.env.FETCH_URL}/magazinedata`, 
  {cache: 'no-store'} // SSR
);
const resData: contentPostMagazineType[] = await res.json();

/* カテゴリー郡の生成 */
const filterdCategories: string[] = [...resData].sort((aheadElm, behindElm) => {
    /* 001-hoge, 002-foo などカテゴリースラッグに指定した数値でのソート */
    const aheadElmNumber: number = parseInt(aheadElm.category_slug_term.split('-')[0]);
    const behindElmNumber: number = parseInt(behindElm.category_slug_term.split('-')[0]);
    return aheadElmNumber - behindElmNumber;
}).map(fetchDataItem => {
    // join で一つの文字列配列（string[]）とすることで new Set の重複処理を可能とする
    return [fetchDataItem.category, fetchDataItem.category_slug_term].join(',');
});

// 重複排除したカテゴリー郡
const exceptTheSameCategory: string[] = Array.from(new Set([...filterdCategories]));

return (
    <nav className={`${sidebarStyles.sidebarNav} isDesktop`}>
        <Archive props={{
            resData: resData,
            categoriesList: exceptTheSameCategory
        }} />
    </nav>
);
```

詳細ページは以下です（`magazinedata/[id]/page.tsx`）
```tsx
export default async function MagazinePage({ params }: { params: { id: string } }) {
    const magazinesFetchData: Response = 
    await fetch(`${process.env.FETCH_URL}/magazinedata/${params.id}`, 
        { next: { revalidate: 60 } // ISR
    });

    try {
        if (!magazinesFetchData.ok) throw new Error("src/app/magazinedata/[id]/page.tsx - MagazinePage");
    } catch (error) {
        console.error("An error occurred:", error);
    }

    if (magazinesFetchData.status === 404 || magazinesFetchData.status === 500) notFound();
    const magazinesData: contentPostMagazineType[] = await magazinesFetchData.json();

    return <MagazineSingle props={{
        contentData: magazinesData,
        targetContent: "magazines"
    }} />
}
```

蛇足ですが、データフェッチは`Server Components`で行うことがベストプラクティスとされているそうですね。

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#fetching-data-on-the-server

### 独自関数や一部のプラグインは使えず
当たり前ながら`WordPress`をヘッドレスCMSで使っているので、ページ送りやコンテンツ表示に関する従来の独自関数、パンくずリストのプラグインなど諸々使えず、それらを全て自分で実装していくことになりました。

`WordPress`が自動で生成する独自のタグ（ブロック）を排除してコンテンツ内容を表示する際には[html-react-parser](https://www.npmjs.com/package/html-react-parser)に助けていただきました。

ただ、YouTube動画を埋め込み仕様にしたり、動画や画像のキャプションをうまく表示したりする調整は自前で実装する部分もあり、`JavaScript`で何とかする場面も多かったです。

特に苦労したのがページネーション（ページ送り機能）でした。
SPAとしてただ単にページネーションさせる（一覧表示のコンテンツ内容の差替）だけなら簡単だったのですが、ページ遷移（ブラウザバックなどリンク変更）を伴ったページ送りの実装は複雑になってしまったと思います。

<details><summary>ページネーション関連のコンポーネント</summary>

- `PaginationComponent`：ページネーションのラッパーコンポーネント
一覧表示のコンテンツ内容（`PaginationTargetContents`）とページャーボタン（`PaginationElm`）を内包しています。
現URLパスのコンテンツ群が属するカテゴリーまたはタグ名を見出し表示する処理や、現URLパスを加工してページネーション処理に活用するための下準備をしている場所です。
```tsx:PaginationComponent.tsx
"use client"

type paginationComponentType = {
    archivePathName: string;
    archiveTaxonomyPathName?: string;
    theContentData: contentPostMagazineType[];
}

type paginationArchivePathDataType = {
    targetContents_archivePathName: string;
    elm_archivePathName: string;
}

function PaginationComponent({ props }: { props: paginationComponentType }) {
    const { archivePathName, archiveTaxonomyPathName, theContentData } = props;

    const searchParams: ReadonlyURLSearchParams = useSearchParams();
    const pathname: string = usePathname();
    const pages: string | null = searchParams.get('pages');

    const pagerLimitMaxNum: number = useMemo(() => theContentData.length, [theContentData]);

    const headingTitle: string | undefined = useMemo(() => {
        if (pathname.includes('category')) {
            return theContentData[0].category
        }

        if (pathname.includes('tag')) {
            const targetTagId: number = parseInt(pathname.split('/').at(-1) as string); // URLパスの末尾からタグIDを取得
            const tagName: string[] = [];
            theContentData.forEach(data => {
                if (data.tag_id.includes(targetTagId)) {
                    // 当該タグID（のインデックスを調べてそれ）に合致するタグ名を取得
                    tagName.push(data.tag_term[data.tag_id.indexOf(targetTagId)]);
                }
            });
            return tagName[0];
        }

        if (
            (
                !pathname.includes('category') ||
                !pathname.includes('tag')
            ) &&
            (
                pathname.includes('magazines') ||
                pathname.includes('posts') ||
                pathname.includes('others')
            )
        ) {
            return undefined;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theContentData]);

    /* Pagination 関連のコンポーネントへ渡す archivePathName（URLパス）管理用の State */
    const defaultArchivePathData: paginationArchivePathDataType = {
        targetContents_archivePathName: archivePathName.split('?')[0],
        elm_archivePathName: archivePathName
    }
    const [archivePathData, setArchivePathData] = useState<paginationArchivePathDataType>(defaultArchivePathData);

    const { defaultBack } = useDefaultBack();

    useEffect(() => {
        if (pages === null) defaultBack();
        if (archivePathName.startsWith('/')) {
            const newArchivePathData: paginationArchivePathDataType = {
                targetContents_archivePathName: archivePathName.split('/')[1],
                elm_archivePathName: archivePathName.replace('/', '') // 先頭の'/'を削除
            }
            setArchivePathData((_prevArchivePathData) => newArchivePathData);
        }
        document.body.scrollTo(0, 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {headingTitle !== undefined && <h2 className={baseStyles.sectionHeading_2}>{headingTitle}</h2>}
            <PaginationTargetContents props={{
                archivePathName: archivePathData.targetContents_archivePathName,
                theContentData: theContentData,
                pagerOffsetBegin: pages ? parseInt(pages.split('-')[1]) : undefined
            }} />
            <PaginationElm props={{
                archivePathName: archivePathData.elm_archivePathName,
                pagerLimitMaxNum: pagerLimitMaxNum,
                pagerNum: pages ? parseInt(pages.split('-')[0]) : undefined,
                archiveTaxonomyPathName: archiveTaxonomyPathName,
            }} />
        </>
    );
}

export default memo(PaginationComponent);
```

- `PaginationTargetContents`：ページネーションで切り替わるコンテンツ一覧
主な特徴としては`splice`メソッドを使って表示するコンテンツ内容を配列操作しています。
```tsx:PaginationTargetContents.tsx
type PaginationTargetContentsType = {
    archivePathName: string;
    theContentData: contentPostMagazineType[];
    pagerOffsetBegin?: number;
}

function PaginationTargetContents({ props }: { props: PaginationTargetContentsType }) {
    const { archivePathName, theContentData, pagerOffsetBegin } = props;

    const [isPagers] = useAtom(isPagerArom);
    const [isOffSet] = useAtom(isOffSetAtom);
    const [, setContentExist] = useAtom(contentExistAtom);

    const pagerLimitMaxNum: number = useMemo(() => theContentData.length, [theContentData]);

    /* 最終ページの判定用 State（PokeContent の flexBox の調整で使用） */
    const [isFinalPage, setFinalPage] = useState<boolean>(false);

    /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための配列 State */
    const [pagerContents, setPagerContents] = useState<contentPostMagazineType[]>([]);

    const setPagerContentsFrag: (fragStart: number, fragFinish: number) => void = (
        fragStart: number,
        fragFinish: number
    ) => {
        const fragStartVal: number = pagerOffsetBegin ? pagerOffsetBegin : fragStart; // URLパスにページャーオフセット数がある場合はその数値をセットする
        const splicedContents: contentPostMagazineType[] = [...theContentData].splice(fragStartVal, fragFinish);
        setPagerContents((_prevPagerContents) => splicedContents);

        /* splicedContents（表示用コンテンツ）が無い場合は contentExistAtom（コンテンツがあるかどうかの論理値）を true に（PaginationElm.tsx にて使用）*/
        if (splicedContents.length === 0) setContentExist(true);
        else setContentExist(false);
    }

    /* ページャー処理 */
    useEffect(() => {
        /* 最終ページの判定による State の切替 */
        if (pagerLimitMaxNum - isPagers <= isOffSet) setFinalPage(!isFinalPage);
        else setFinalPage(false);

        /* オフセット数（isOffSet）区切りのコンテンツデータに加工するための処理 */
        const limitBorderLine: number = pagerLimitMaxNum - isOffSet;
        // console.log(pagerLimitMaxNum, limitBorderLine);
        if (isPagers >= limitBorderLine) {
            const remandNum: number = pagerLimitMaxNum - isPagers;
            setPagerContentsFrag(isPagers, remandNum); // remandNum：残りのコンテンツ数を全表示
        } else {
            setPagerContentsFrag(isPagers, isOffSet);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPagers]);

    return (
        <>
            {
                pagerContents.length > 0 ?
                    pagerContents.map(pagerContent => (
                        <Fragment key={pagerContent.ID}>
                            {/*【お知らせ（posts）】コンテンツの場合は ContentLinker を使用 */}
                            {archivePathName === 'posts' ?
                                <ContentLinker props={{
                                    item: pagerContent,
                                    anchorPathName: archivePathName,
                                    date: pagerContent.date
                                }} /> :
                                <MagazineContentItem props={{
                                    item: pagerContent,
                                    anchorPathName: archivePathName
                                }} />
                            }
                        </Fragment>
                    )) :
                    <p style={{ 'textAlign': 'center', 'display': 'grid', 'placeContent': 'center', 'height': 'calc(100vh/2)' }}>このページには現在コンテンツ（情報）は存在しません。</p>
            }
        </>
    );
}

export default memo(PaginationTargetContents);
```

- `PaginationElm.tsx`：ページネーションボタン
表示する一覧コンテンツ数を最大値に指定して、ページ送り値（15）を基準にページャーボタンを生成する処理を行っています。`Next.js`のプリレンダリングの恩恵を得るには`<Link>`を使うべきなので、現状の`router.push`から調整したい場所だと思っています（行けたら行く、くらいの気持ち）。
```tsx:PaginationElm.tsx
type paginationElmType = {
    archivePathName: string;
    pagerLimitMaxNum: number;
    pagerNum?: number;
    archiveTaxonomyPathName?: string;
}

function PaginationElm({ props }: { props: paginationElmType }) {
    const { archivePathName, pagerLimitMaxNum, pagerNum, archiveTaxonomyPathName } = props;

    const router = useRouter();

    const [, setPagers] = useAtom(isPagerArom);
    const [isCurrPage, setCurrPage] = useAtom(isCurrPageAtom);
    const [isOffSet] = useAtom(isOffSetAtom);
    const [contentExist] = useAtom(contentExistAtom);

    const delayScrollTop: () => void = () => {
        setTimeout(() => window.scrollTo(0, 0));
    }

    /* ページ数：コンテンツデータ数をオフセットで分割した数 */
    const [isPagination, setPagination] = useState<number[]>([]);

    /* ページャー数 */
    const [isPagerNum, setPagerNum] = useState<number[]>([]);

    /* 現在ページのシグナル移行処理を行う。※「前のページ」「次のページ」クリック時にもシグナル移行を実現するための専用メソッド */
    const { CheckCurrPager } = useCurrPagerSelect();

    /* 各ページャー項目の data-pager の値に準じたページを表示及びページ番号を変更 */
    const setPaginationNum: (btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>, pagerEl: number) => void = (
        btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerEl: number
    ) => {
        const dataPager: string | null = btnEl.currentTarget.getAttribute('data-pager');
        setPagers((_prevPagerNum) => Number(dataPager));
        setCurrPage((_prevCurrPage) => pagerEl); // 表示中のページ番号を変更
    }

    /* オフセット数に基づいた計算を通してページネーション用の各ページャー項目のページを設定する */
    const basedonOffsetNum_setPagerNum: () => void = () => {
        const srcAry: number[] = [];
        let srcNum: number = pagerLimitMaxNum;

        /* 各ページャー項目の data-pager の値を生成（引算用途の上限数値：srcNum が 0 を切るまでオフセット数を倍数していくループ処理）*/
        let Accumuration = 0;
        while (srcNum >= 0) {
            srcAry.push(isOffSet * Accumuration);
            Accumuration++;
            srcNum = srcNum - isOffSet;
        }
        setPagerNum((_prevPagerNum) => srcAry); // ページャー数をセット

        const paginationAry: number[] = [];
        for (let i = 1; i <= srcAry.length; i++) {
            paginationAry.push(i);
        }
        setPagination((_prevPagination) => paginationAry); // ページ数をセット
    }

    useEffect(() => {
        CheckCurrPager(isCurrPage);
        basedonOffsetNum_setPagerNum();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCurrPage]);

    return (
        <>
            {/* contentExistAtom（コンテンツがあるかどうかの論理値）が false（コンテンツがある）の場合はページネーション機能を表示 */}
            {contentExist ||
                <div className={paginationStyles.paginations}>
                    <p className={paginationStyles.currPage}>現在表示しているのは「{pagerNum ? pagerNum : isCurrPage}」ページ目です。</p>
                    {isPagination.map((pagerEl, i) =>
                        /* data-pager：ページャー数がセットされたカスタムデータ */
                        <button key={i}
                            className={paginationStyles.pagerLists}
                            data-current={pagerNum ?
                                pagerNum === i + 1 :
                                isCurrPage === i + 1
                            }
                            data-pager={isPagerNum[i]}
                            onClick={(btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                delayScrollTop();
                                setPaginationNum(btnEl, pagerEl);
                                {
                                    archiveTaxonomyPathName ?
                                        router.push(`/${archivePathName}${[pagerEl, isPagerNum[i]].join('-')}${archiveTaxonomyPathName}`) :
                                        router.push(`/${archivePathName}${[pagerEl, isPagerNum[i]].join('-')}`);
                                }
                            }}>{pagerEl}
                        </button>
                    )}
                </div>
            }
        </>
    );
}

export default memo(PaginationElm);
```

</details>

こうして開発を進めていたものの、会社・事業部のリソース的にパブリッククラウドなどを検討する余地もなく、ある程度作り進めた段階で路線変更せざるを得なくなりました。
とはいえ今振り返ればSSR/ISRでの開発経験を得られたので学びはあったと思います。

路線変更に伴って国内ホスティング会社へのセルフホスティングという方向になったのでレンダリング方法はSSG一択になりました。

::: note info
SSR/ISRで作ってきたサイトのデプロイ先は`vercel`にしていたのですが、デプロイした際にデータフェッチできないなどいくつかトラブルもありました。余談として以下に書き残しておくので関心のある方はご覧ください。
:::

<details><summary>余談：vercel にデプロイした際に詰まったところ</summary>

デプロイした際にデータフェッチできなかった原因は国内ホスティング会社のサーバー設定だったのでした。
以下は当時筆者が投稿した質問です（※解決したのでクローズしています）

[【Next.js / vercel】開発環境では問題が無く、ビルド時にエラーも出ないが、デプロイ（本環境）でのデータフェッチが失敗する](https://qiita.com/benjuwan/questions/1734a9d05b6f6b177b38)

その他、`504（FUNCTION_INVOCATION_TIMEOUT）`タイムアウトが発生してページが一部表示できなかったりしたのですが、これは`vercel`で当該サイトのダッシュボード[Project Settings]から[Functions]を選んで`Function Region`をデフォルトのワシントンDCから東京に変更したところ解消されました。
エッジサーバーが物理的に近くなったためだと思っています。

[Vercel で 504 （FUNCTION_INVOCATION_TIMEOUT）タイムアウトが発生した時はリージョンの設定を変えてみる](https://zenn.dev/benjuwan/articles/7635f7f53cbfb3)

</details>

## SSG/CSRで作り直し
ディレクトリ構成に手を加える部分もあったので当初は大変だと思っていたのですが、やってみるとコンポーネントやフックは使い回せるものが多かったし、各種Stateも微調整で済むなど意外と肩透かしって感じでした。
こういったところも`React`のコンポーネント指向の恩恵なのかもしれません。

ただし、ページネーションやパンくずリスト、各種データフェッチの方法などそれなりの調整・修正が必要なものもあったので楽とは言えなかったですが。

例えば、データフェッチはCSRで行うSPA仕様になったので一般的な`useEffect`を使った記述に変わっています。
```ts
useEffect(() => {
    // AbortController ：非同期処理を中止するためのインターフェースを提供する Web API
    const controller = new AbortController();

    /* コンテンツデータのフェッチ */
    if (magazinesData.length <= 0) {
        // controller.signal：controller から AbortSignal のインスタンスを取得して変数に代入
        const fetchMagazineData: Promise<contentPostMagazineType[] | undefined> = 
        fetchContentsData(`${fetchEndpoint}/magazinedata`, controller.signal);
        fetchMagazineData.then((data) => {
            if (data !== undefined) {
                setMagazinesData((_prevMagazinesData) => data);
            }
        });
    }

    /* Q&Aデータのフェッチ */
    if (faqItems.length <= 0) {
        const fetchFaqlistData: Promise<faqItemsType[] | undefined> = 
        fetchFaqData(`${fetchEndpoint}/faqdata/tag/0`, controller.signal);
        fetchFaqlistData.then((data) => {
            if (data !== undefined) {
                setFaqItems((_prevFaqData) => data);
            }
        });
    }

    /* useEffect のクリーンアップ処理 */
    return () => {
        // AbortSignal に abort イベントが発生し、
        // fetch 系のカスタムフックに渡した signal がこのイベントを検知して非同期処理をキャンセル（中止）
        controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

また路線変更して開発を進める中で上記のようなデータフェッチに関する改修をはじめ、以下の機能を追加していきました。
- コンテンツの表示形式切り替え（カード・レイアウト ⇔ リスト・レイアウト）
- 各種SNSシェアボタン
- 混在コンテンツ（`http`と`https`のパスがページ内で混在した場合）や移転前WPサイトのパスを参照している画像パスの調整機能
- `WordPress`が自動生成するclass属性やid属性を持った各種HTMLタグを調整（置換）する機能
- エディター投稿からの「YouTubeの埋め込み + 動画キャプション」と「画像（単体・カラム）+ 画像キャプション」の表示調整機能
- 各種入力フォームに関するサニタイズ処理
- ライトボックス機能
- 中黒点有無チェックなど含むあいまい検索や、スペース区切りでのAND検索機能
- コンテンツにカテゴリーを付与し忘れた際のエラーハンドリング処理

しかしSSG/CSRへ変更する中で特に大変だったのがページネーション機能でした。
SSR/ISRと比べて機能面でいくつかブラッシュアップしたことも関係ありますが、ページネーション関連だけでカスタムフックが8つにも及びました。ちなみに、SSR/ISRではカスタムフックは2つです。

ルーティング機能の調整をはじめ、表示中ページの`title`や`description`といった`meta`関連の情報反映に特に手こずりました。
SSR/ISRでは基本サーバーコンポーネントなので気にせず[`Metadata`](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)で処理を進められましたが、SSGに際して概ねクライアントコンポーネントにしていたので恩恵に預かれなかったのです。
加えてブラウザバックとかが絡んだ挙動不具合もあったりして、今はそれら全て解決していますが応急処理感の否めない処理になっているような気もします。

今後は不定期での保守・更新として関わることになるので随時調整していきたいと思います。

## さいごに
ここまで述べてきたことに関しては正直筆者のスキル不足も否めませんので、参考程度に留めていただたほうが無難かもしれません。

`Next.js`× ヘッドレスCMS（`WordPress`）の開発を通じて感じたのは、自力実装で手こずったり（地力不足）、フレームワークやデプロイ先の独自ルールや概念を理解する学習コストをかけたりなど、真新しいものを使うには相応の大変さが伴うということです。

途中で話した`WordPress`をヘッドレスCMSとして使用する際のデータ取得方法に関しても、`WordPress`に慣れている方の中には「プラグインあるならそっちでサクッと〜」と流れる場合も考えられますが、本記事で述べたようにその道は（現状）不安定です。

筆者が冒頭で書いた結論は「このような諸々のコストを呑んでまでモダンフロントエンドを使う必要があるかな？」という部分にあります。
もちろんケース・バイ・ケースであり、今回の筆者の案件（用途）が即していないだけだと思いますが「いつもより豪華なちょっとした料理を作るのに業務用の寸胴や牛刀なんて使わなくても良くない？」といった感じです。

顧客が望んでいるのはモダンな開発や技術ではなくて自分たちの要望を満たしてくれるモノだと思いますので。

とか偉そうに言いつつも、本案件ではエゴ全開で突き進みましたから今後は留意したいと反省しています。
しかし、こういった学びを実体験として得られたのも、裁量大きく自由に技術を実践させてくれる寛容な社風にあると思いますので所属企業には感謝しております。

本記事のまとめとしては以下になります。

- 別に`Next.js`でなくとも`Gatsby`でも良いかも
- 普通に`WordPress`で作っても良いかも（※他のCMSや組織に適したものを選ぶのももちろんあり）
- 真新しいものを使うには相応の大変さが伴う
- 技術はケース・バイ・ケース、適材適所に

最後のはなんだか永遠のテーマくらいになりそうな感覚です。
ここまで読んでいただき、ありがとうございました。

