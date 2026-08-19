---
title: 簡単！お手軽！WordPressをヘッドレスCMSとして使う時のプレビューページの実装方法
tags: Next.js React WordPress REST-API ヘッドレスCMS
author: benjuwan
slide: false
---
# はじめに
筆者は Next.js（v15） × WordPress（ヘッドレスCMS：REST API）で運用しているサイトを業務で扱っています。

種々の事情から、SSG × CSR（※データ取得処理に関してのみ）というハイブリッド構成になっています。
今回の話から逸脱してしまうため、関心のある方は以下の記事をご覧ください。

https://qiita.com/benjuwan/items/9f3cd4ef191b23294d73

先日、運用チームのメンバーから「記事のプレビュー機能がほしい」という要望を受けました。

WordPressをそのまま使う分にはプレビュー機能は標準で用意されています。
しかし、ヘッドレスCMSとして利用する場合はプレビュー機能を自分で用意する必要があります（※プレビュー機能だけでなくページネーションなど諸々の機能全てですが）

AIを活用して、WordPressにログイン状態で操作するセッション情報を使った方法など教えてもらいましたが中々うまくいかず、さらに調べながら試行錯誤する中で`Application Passwords`というWordPress 5.6 から導入された機能を知りました。

今回、この`Application Passwords`を使ったプレビュー機能の実装方法が簡単かつ手軽にできたので情報共有していきたいと思います。

::: note warn
※今回は開発環境から立ち上げて（＝ローカルサイトからのみ）プレビューページを見る想定です。実際にプレビューページをデプロイして本環境で閲覧できるようになる方法ではないのでご注意ください
:::

[`Application Passwords`自体について知りたい方はこちら](#application-passwordsとは)に飛んでください

## 対象読者と前提条件
### 対象読者
- WordPress REST API を使ったヘッドレスCMSに興味のある方
- Next.jsをはじめ、Next.js × ヘッドレスCMSの実装に関心のある方
- 実際にNext.js × WordPress REST APIのサービスを運用していてプレビュー機能の簡単な実装方法を知りたい方

### 前提条件
- WordPress REST API を使ったヘッドレスCMSであること
- `functions.php`でREST APIの設定が済んでいること
  - REST APIの設定まで話に入れると長くなって脱線が過ぎるので、[設定や詳細情報について関心のある方はこちら](https://qiita.com/benjuwan/items/3577270e5bcb512538bd#wordpress%E3%81%AE%E6%8A%95%E7%A8%BF%E3%83%87%E3%83%BC%E3%82%BF%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95)をご覧ください（※今はAIがあるのでそちらに設定方法などを聞いても良いかも）

<details><summary>※上記リンク記事内の（functions.phpに記述する）WordPress REST API 設定部分のみ抜粋</summary>

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

上記コード内の下記部分を変更すると下書き・非公開記事を取得できるようになります。

```diff
// 取得したいコンテンツ（データ）の内容を指定
function get_all_posts_from_blog() {
  $args = array(
    'posts_per_page' => -1, // -1 で全件取得
    'post_type' => 'postType', // 投稿タイプを指定
-    'post_status' => 'publish' // 公開済みの内容
+    'post_status' => ['draft', 'private'], // 投稿ステータス（下書き・非公開）
  );
  ...
  ..
  .
```

</details>


## WordPressをヘッドレスCMSとして使う時のプレビューページの実装方法
まず、WordPress側と開発側（フレームワーク）2つの下準備が必要です。

### WordPress側
1. 管理者アカウントで WordPress にログイン
2. メニューから `ユーザー` > `プロフィール` へ移動
3. アプリケーションパスワード セクションで`新しいアプリケーションパスワード名`を入力し、その下にある`アプリケーションパスワードを追加`を押下

![スクリーンショット 2025-09-11 094055.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/98d3828f-457b-484c-b505-d46601b4cb02.png)

- 発行される 24桁のアプリケーションパスワード をコピーして保存

::: note warn
24桁のアプリケーションパスワードは**一度しか表示されない**ので注意してください。
:::

### 開発側（フレームワーク）
#### 1. プロジェクトのルート階層に`.env.local`ファイルを作成して以下記述を行う
```bash
# WP_USER： WordPress サイトのログインID
WP_USER='WPサイトのログインID'

# WP_APP_PASSWORD： 発行された24桁のアプリケーションパスワード（スペースは削除して入力）
WP_APP_PASSWORD='24桁の文字列（スペース削除済み）'
```

#### 2. プレビューページを用意
例：`/src/app/preview/page.tsx`
```tsx
// 下書き・非公開記事を取得するための非同期処理関数
const fetchPreviewData: () => Promise<theContentType[]> = async () => {
    const apiUrl = fetchBaseEndpoint;
    const username = process.env.WP_USER!;
    const appPassword = process.env.WP_APP_PASSWORD!;

    // Basic 認証ヘッダーを作成
    const authHeader =
        "Basic " + Buffer.from(`${username}:${appPassword}`).toString("base64");

    // `${apiUrl}/preview_mode`：プレビューAPIのエンドポイントURL
    const res = await fetch(`${apiUrl}/preview_mode`, {
        headers: {
            "Authorization": authHeader, // 認証情報を送信
        },
        cache: "no-store", // draft / private を常に最新で取得
    });

    if (!res.ok) {
        throw new Error(`プレビュー記事の取得に失敗しました (${res.status})`);
    }

    return res.json();
};

export default function PreviewPage() {
    return (
        <>
            <h2>下書き・非公開記事一覧</h2>
            <p style={{ 'fontSize': '12px', 'lineHeight': '2', 'marginBottom': '1em' }}>
            （※プレビュー機能は、管理者専用の内部プレビュー用であり、外部公開や一般ユーザー向け利用は想定していません）
            </p>
            {/* 子コンポーネントにプレビュー記事データ（Promise）を渡す */}
            <PreviewContent fetchdataPromise={fetchPreviewData()} />
        </>
    );
}
```

- `/src/app/preview/PreviewContent.tsx`
子コンポーネント（`PreviewContent`）では React v19 から安定版となった`use API`を使って、受け取った`Promise`（プレビュー記事データ）を描画するようにしています。
```tsx
"use client"

import { use } from "react";

function PreviewContent({ fetchdataPromise }: { fetchdataPromise: Promise<theContentType[]> }) {
    // use()でPromiseの中身を取得（Promiseが未完了ならこのコンポーネントはサスペンドする）
    const getData: theContentType[] = use(fetchdataPromise);
    ...
    ..
    .
    return(
        <>
            {getData.map((data, i)=>(
                // 各プレビュー記事を描画
            )}
        </>
    );
```

::: note
もしプレビュー記事が表示されない場合は、設定した（WordPress REST APIの）エンドポイントで`post_status`に「下書きと非公開」が設定されているか確認してみてください
```php
'post_status' => ['draft', 'private'], // 投稿ステータス（下書き・非公開）
```
:::

---

以上がWordPressをヘッドレスCMSとして使う時のプレビューページの実装方法となります。
`Application Passwords`を使用することで簡単、お手軽にプレビューページを用意できました。

最後に`Application Passwords`について触れていきたいと思います。

## `Application Passwords`とは
（**※以下はAIが生成した文章です**）

WordPress 5.6 から導入された Application Passwords（アプリケーションパスワード） は、外部アプリケーションやサービスが WordPress の REST API にアクセスする際、安全に認証を行うための仕組みです。

これまでは API アクセス時に「ユーザー名 + パスワード」や「Cookie + Nonce」といった方法が一般的でしたが、セキュリティや利便性に課題がありました。Application Passwords はそれを解消するために追加された機能です。

### 主な特徴
- ユーザー単位で発行
各 WordPress ユーザーが、自分専用のアプリケーションパスワードを複数作成できます。
- 安全な認証
発行されたパスワードは、通常のログインパスワードとは独立しており、漏洩リスクを分離できます。
- アクセス制御が容易
不要になったアプリケーションパスワードは管理画面から即時取り消し可能です。
- REST API の基本認証に対応
API リクエスト時、HTTP Basic 認証で username:application-password を送信します。

### メリット
- 通常のユーザーパスワードを晒さずに済む
- アクセスごとに個別の鍵を発行できる
- 権限はユーザーのロールに基づくため、細かい制御が可能
    - プロフィール画面から対象のパスワードを削除すれば、そのアプリからのアクセスは即座に無効化
- 二要素認証と併用可能 

## さいごに
`Application Passwords`を使用することで簡単、お手軽にプレビューページを用意できました。
この記事が、Next.js × WordPress REST APIという組み合わせ時のプレビュー機能実装方法を知りたい方のお役に立てれば幸いです。

ここまで読んでいただき、ありがとうございました。

### おまけ

話が逸れますが、今回のプレビュー機能実装と共に、大規模なリファクタリングを行いました。

きっかけは海外ユーザーから「サイトが一向に表示されない」という意見をXで受けたことです。
[海外アクセス状況を調査](https://www.webpagetest.org/)したところコンテンツ描画に必要なデータフェッチ処理（APIを叩いた結果）で403エラーが発生していたのです。

リファクタリング前は、各種コンテンツデータを初期表示時に一挙取得する実装となっていてサイト表示までに2～3秒ほどかかっていました。

筆者はここがネックだと踏んでリファクタリングを決めました。
（※実際は**ホスティング先のサーバ設定でREST APIへの国外アクセスが禁止になっていただけ**）

具体的には、求めるコンテンツ数を決め打ちしてデータ取得する一般的な方法です。

そのためのAPIを新規発行・追加したり、関連ファイルやコンポーネントの調整作業を行ったり、今回のプレビュー機能をはじめ諸々の追加要望を反映したりして、2週間近く費やしたと思います。

しかし実際の原因は、先に触れましたが**ホスティング先のサーバ設定でREST APIへの国外アクセスが禁止になっていただけ**でした。

解決に2秒もかからない原因だったことに自身の愚かさを呪いつつ、今回のリファクタリングによってサイトの表示速度が劇的に改善されたり、改めて学ぶ点も多くあったので個人的は良い経験だったと~~割り切りたいと~~思います。

今回のリファクタリングを経た振り返りは以下になります。

#### 今回のリファクタリングを経た振り返り
##### React準拠の宣言的なアプローチを意識
ページネーションのロジックなどに関して、子コンポーネントで手続き的（カスタムフックに切り分けて）処理していたが、そもそも開発環境ではSSRになっており、SSGでのビルド時とモデリングが違ってしまっていた。結果、デプロイ後のサイトでページネーションが効かないという不具合が発生。
そこで、各種コンテンツのルートページをクライアントコンポーネント（`use client`）にし、パスからページャー文字列（例：`?page=3`）を取ってグローバルステート（例：`pagerAtom`）を更新することで解決。

##### `useSWR`などベストプラクティスなデータフェッチ処理を行う
データフェッチ実施有無については三項演算子を用いるなどライブラリ推奨の記述を行う。
```js
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)
```
例えば、if文を使った条件分岐など（例：型ガードによる早期リターン）を行おうとすると、react hooksのレンダリング規約に違反するためlintエラーが発生する
```ts
// この記述はダメ
if(typeof shouldFetch !== 'undefined') {
  useSWR('/api/data', fetcher)
}
```

##### コンポーネントで早期リターンする場合は、各種データを読み込んだ後の適切な位置（レンダー箇所の先頭）で行う
各種`props`, `state`, `hooks`などは必ずトップレベルで呼び出す必要がある。
これら全てのデータを読み込んだ後のレンダリング位置に、早期リターンを記述しないとレンダリング規約に違反するため、lintエラーまたはレンダリングエラーが発生する。

※ただし、後続の処理で必要なデータ有無（例：型ガードなどによるデータ有無）を判定する場合などはこの限りではない。

```ts
if (typeof theFetchedContentData === 'undefined') {
    return;
}

const createPagers: () => number[] = () => {
    // 上の早期リターンがないと、以下の部分で型エラーが表示される
    // `theFetchedContentData?.pagination`とオプショナルにすれば回避できるが可読性を加味して早期リターンしておく
    let srcNum: number = typeof theFetchedContentData.pagination !== 'undefined' ? theFetchedContentData.pagination.total_posts : 0;
    ...
    ..
    .
}
const thePagers: number[] = createPagers();
```

---

結構基礎的なところでした。やはり手を動かすことで思い出したり、改めて学んだりすることは多いのでアウトプット重視のキャッチアップを今後も続けていきたいと思います。

