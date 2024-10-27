# Udemy-NextBlog
 [【Next.js13】最新バージョンのNext.js13をマイクロブログ構築しながら基礎と本質を学ぶ講座](https://www.udemy.com/course/nextjs13_learning_with_microblog/)<br />

※本`README`に記載されている一部はカリキュラム終了後に筆者が制作した`Next`プロジェクトを通じて得た情報も含まれています。


## 目次
[Next.js](#nextjs)<br />
[next.config](#nextconfig)<br />
[ESLint](#eslint)<br />
[SupaBase](#supabase)<br />
[メモ](#メモ)<br />


### Next.js
- `Next.js`最新情報<br />[The latest Next.js news](https://nextjs.org/blog)

- Get Start<br />
[Installation](https://nextjs.org/docs/getting-started/installation)

```
npx create-next-app@latest
```

- サーバーコンポーネントでは[`styled-components`](https://styled-components.com/)は使用できない（**クライアントコンポーネントでしか使用不可**）
    - `styled-components`は`next.config.js`に所定の記述が必要（無いと`CSS`がうまくあたらない）<br />

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        compiler: {
            styledComponents: true,
        },
    };

    export default nextConfig;
    ```

    [公式の参照情報](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components)

    - [`Next.js`におけるスタイリングについて](https://nextjs.org/docs/app/building-your-application/styling)
        - [CSS-in-JS](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)
        > Warning: CSS-in-JS libraries which require runtime JavaScript are not currently supported in Server Components.

- ファイル構成（`src`ディレクトリ配下）
    - `app`ディレクトリ（配下）は**原則サーバー側でレンダリング**される（サーバー側でデータ取得を行うほうがパフォーマンス的に早いため）。デフォルトでは`use server`（サーバーコンポーネントの）状態。<br />
    ファイルの先頭に`use client`を記述するとクライアントコンポーネントとなる（クライアントコンポーネントでしか`State`, `Effect`などの`Hooks`が扱えない）。
    
    - `use client`（クライアントコンポーネント）は**苗字**みたいなもので、親で宣言していればそのディレクティブ（配下の子コンポーネント）も全てクライアントコンポーネントになる（各自子コンポーネントで`use client`を宣言するとエラーになるので注意）<br />
    参照記事：[【Next.js】RSCとクライアントコンポーネントを改めて理解する](https://zenn.dev/sc30gsw/articles/0941e76ae96260#%E5%A2%83%E7%95%8C%E5%86%85%E3%81%A7%E3%81%AFuse-client%E3%81%AF%E4%B8%80%E5%BA%A6%E3%81%AE%E5%AE%A3%E8%A8%80%E3%81%AB%E3%81%99%E3%81%B9%E3%81%97)

    - `app/page.tsx`<br />`Next 12`でいうところの`index.tsx`の役割。各ディレクトリごとに用意することで**ファイルシステムベースルーティング**の恩恵を得られる。

    - `app/layout.tsx`<br />`Next 12`でいうところの`_documet.tsx`や`_app.tsx`の役割。`Next 13`で新たに設けられたファイルで、各ページ（ディレクトリごとの`page.tsx`）の**レイアウト情報（`meta`情報など）の管理**を担う。`layout.tsx`は入れ子も可能。
        - `meta`情報の設定例（`src/app/layout.tsx`）

        ```ts
        export const metadata: Metadata = {
            title: 'Udemy Next 13 Blog',
            description: 'Udemy Next 13 Blog Course',
            robots: {
                index: false, // noindex
                follow: false // nofollow
            },
        }
        ```

    参考記事：[Next.js 13 Template と Layout の使い分け](https://zenn.dev/cybozu_frontend/articles/8caf1decb1e82c)

- `app/page.tsx`と`use client`クライアントコンポーネントの`export`について<br />
`export default コンポーネント名;`で行う。<br />※ `app/page.tsx`についてはデフォルト（ファイル制作時）のままにしておくのが無難。<br />
各種コンポーネント名においても**build 時にエラーが出るので命名規則はパスカルケースを守る**こと。

```jsx
/* 任意のコンポーネント名を付けてもok（しかし build 時にエラーが出るので命名規則はパスカルケースを守ること）*/
const HogePage = () => {
    return (
        <> // 何らかの処理 </>
    );
}

export default HogePage; // パスカルケース
```

`export default コンポーネント名;`で行わないとエラーとなる（`Next.js`に怒られる）

- `SSG`, `SSR`, `ISR`はページ・コンポーネント単位で使い分けられる。

    - `SSG`（Static Site Generators）<br />静的サイト生成。`build`時に各ページ（サイト）の`html`データを生成する。既に完成度100% の状態なので、ユーザーからのリクエストに迅速にレスポンスできる。更新頻度が低い箇所に使用する（例：コーポレートサイトのアバウトページやFAQページなど**静的アセットで済む処理**）。

    - `SSR`（Server Side Rendering）<br />サーバー側で各ページ（サイト）を生成する。完成度50% くらいの状態で生成し（プリレンダリング：事前レンダリング）、ユーザーからリクエストがあると100％ の状態にしてレスポンスする。更新頻度が高い箇所に使用する（例：SNSのタイムラインやユーザープロフィールなど**動的な処理**）。

    - `ISR`（Incremental Static Regeneration）<br />`SSG`と`SSR`のハイブリッド版のようなもの。生成した各ページ（サイト）を`CDN`（自身の最寄り倉庫のようなもの）にキャッシュしており、指定した時間（`Revalidate`）に応じて更新（`SSR`のような動き）したものをユーザーにレスポンスする。<br />※指定した時間の経過後にアクセスすると更新データが表示されるという仕組みではなく、アクセス時は一旦**更新前のものが表示**され、**その後にアクセスすると更新後のものが表示**される。<br />よりリアクティブなレスポンスにしたい場合は`SWR`を使用する。

    - `fetch API`通じて各種生成方法（`SSG`, `SSR`, `ISR`）を利用できる。

    ```js
    /* SSG */
    // This request should be cached until manually invalidated.
    // Similar to `getStaticProps` --- to Next 12.
    // `force-cache` is the default and can be omitted.
    fetch(URL, { cache: 'force-cache' }); // --- from Next 13 against SSG
    
    /* SSR */
    // This request should be refetched on every request.
    // Similar to `getServerSideProps` --- to Next 12.
    fetch(URL, { cache: 'no-store' }); // --- from Next 13 against SSR
    
    /* ISR */
    // This request should be cached with a lifetime of 10 seconds.
    // Similar to `getStaticProps` with the `revalidate` option --- to Next 12.
    fetch(URL, { next: { revalidate: 10 } }); // --- from Next 13 against ISR
    ```

- `Next.js`では`public`ディレクトリ（フォルダ）で **すべての静的データを管理する** 形のため、CSSの値でURLにパス指定する再は`public`直下からの指定となる<br />

``` css
.something_elements {
    /* (public)/img/something.jpg */
    background: url('/img/something.jpg') no-repeat center/cover;
}
```

参考情報：[【Next.js】background-imageが表示されない](https://zenn.dev/milkandhoney995/articles/1fda5d82b44306)

- `pdf`ファイルなどは`Link`の`href`に直接（`public`直下から）指定する<br />

``` jsx
/* (public)/pdf/documents/abouthogefoo.pdf */
<Link href="/pdf/documents/abouthogefoo.pdf" target="_blank">hogefooに関するpdfドキュメント</Link>
```

- エラーページ（※ファイル名は`error.tsx`で固定）<br />
[Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

- `not-found.tsx` / `loading.tsx`（※ファイル名固定）<br />
[not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)<br />
[loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)<br />
[Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

- `Next`の方針に沿って**極力サーバーコンポーネントで扱いたい**<br />
処理（`click`, `submit`など各種イベントハンドラーの使用はクライアントコンポーネントでしか不可能）によってクライアントコンポーネントにしなくてはならない場合はコンポーネントを別途作成する（親：サーバーコンポーネント、子：クライアントコンポーネント）<br />
ただし、行いたい処理によっては`サーバー側`の処理と`クライアント側`の処理が競合して無限ループ的なエラーが生じる可能性もあるので、そういったケースを考慮する意味でもコンポーネント分けは大切。

- ファイルシステムベースルーティング<br />
`archives/[id]`（一覧dir / 個別詳細dir）という形になり、個別詳細dir内に設けた`page.tsx`でコンポーネントの引数に`props`としてデータを受けることで各種URLを取得できる。

```ts
const ArticleDetails = ({ params }: { params: { id: string } }) => {
    return (
        <>
        ...JSX
        </>
    )
}

export default ArticleDetails;
```

`{ params }: { params: { id: string } }`<br />
DB内の各種データ（オブジェクト）のidプロパティから各個別ページのURLを取得

- サイトマップの作成<br />
`Next.js`では所定のファイル（`sitemap.(js|ts)`）を設けることでサイトマップを生成してくれる。<br />
[Generating a sitemap using code (.js, .ts)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts)

- **Next12 までの（Next13 以降でも使える）** APIの作成方法（`pages/api`）<br />
`pages/api`に`index.ts`を用意して`API`作成を行う。

- **Next13 以降の** APIの作成方法（`app/api`）<br />
`app/api`に`route.ts`を用意して`API`作成を行う（※`Next13`では以前までの`index.ts`ではなく`route.ts`に変更されたので注意）。<br />
任意のエンドポイント名を挟みたい場合は`api/[任意のエンドポイント名]`に`route.ts`を用意する。


- `.next ディレクトリ`（Macの場合は不可視ファイルとして扱われる）<br />
    - `Chat-GPT`の回答<br />
    > `.next ディレクトリ`は、`Next.js`でビルドされたアプリケーションの成果物が格納される場所です。このディレクトリ内には多くのフォルダやファイルがありますが、すべてがデプロイに必要なものではありません。一部のファイルやフォルダについて説明します。

    > `cache` フォルダ：このフォルダにはビルドプロセスのキャッシュが含まれています。これにより、再ビルド時に前回のビルド結果を再利用して高速なビルドが可能となります。デプロイには必要ありませんが、開発中のビルドパフォーマンスに影響を与えます。

    > `server` フォルダ：サーバーサイドのコード（APIルートなど）がここに格納されます。デプロイ先がサーバーサイドレンダリングをサポートしている場合に必要です。

    > `static` フォルダ：このフォルダには静的ファイルが格納されます。この中のファイルは、サーバーサイドで処理されず、そのままクライアントに提供されます。デプロイ時にはこれらの静的ファイルが含まれることがあります。

    > `pages` フォルダ：`Next.js`では、`pages`フォルダに配置されたファイルが自動的にルーティングされます。ビルド後には、このディレクトリ内の各ファイルに対応するルートが生成されます。

    > `chunks` フォルダ：コード分割（Code Splitting）によって生成された JavaScript チャンクが格納されます。これにより、ページのロード時に必要なコードのみをダウンロードできます。

    > ... その他：その他にも多くのファイルやフォルダが存在しますが、これらは主にビルドプロセスや特定の機能（モジュール、画像、CSSなど）に関連しています。デプロイ先が提供するサービスやプラットフォームによって、必要なファイルや構成が異なります。

    > デプロイする際には、通常は `.next ディレクトリ`全体をアップロードすることはせず、必要なファイルやディレクトリだけを選択してデプロイします。各デプロイ先のドキュメントを確認し、必要なものだけをデプロイするようにしましょう。

- デプロイについて<br />
- [Deploying](https://nextjs.org/docs/app/building-your-application/deploying)

- [static-html-export](https://nextjs.org/docs/app/building-your-application/deploying#static-html-export)

    - [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

- [Vercelにデプロイしてみよう | サバイバルTypeScript](https://typescriptbook.jp/tutorials/vercel-deploy)

- [【Next.js】デプロイから考えるCSR,SSG,SSR](https://qiita.com/hinako_n/items/78abf815c73e834fb925)

- [環境変数を使ったサイトの Next / Vercel デプロイ](https://yoheiko.com/blog/vercel%E3%81%ABnext-js%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95/)


### next.config
`SSG`やサブディレクトリへのデプロイなどに必要な記述の備忘録。
- `SSG`に際して必要な記述<br />
    `output: 'export'`を追記

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        output: 'export',
    };

    export default nextConfig;
    ```

    [公式の参照情報](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

- 外部（ドメイン）サイトから（画像などの素材）データを引っ張ってくる場合に必要な記述<br />

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        images: {
            remotePatterns: [
            {
                protocol: 'https',
                hostname: 'domain.co.jp' // ドメイン
            },
            ],
        },
    };

    export default nextConfig;
    ```

    [公式の参照情報](https://nextjs.org/docs/messages/next-image-unconfigured-host)

- サブディレクトリの指定<br />
    ディレクトリパスの先頭には`/`が必要で、末尾に`/`を付けるとエラーでビルドできないため指定時は注意。

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        assetPrefix:  '/サブディレクトリ', // ディレクトリパスの先頭には / が必要で末尾に / を付けるとエラーでビルドできないため指定時は注意
        basePath:  '/サブディレクトリ', // 同上
        reactStrictMode: true, // Since Next.js 13.4, Strict Mode is true by default with app router, so the above configuration is only necessary for pages router
    };

    export default nextConfig;
    ```

    [Next.jsで静的サイトをサブディレクトリにデプロイしたいときの設定](https://qiita.com/hiropy0123/items/02ab91f69dbfa4e2797f)

    [Next.jsで静的ビルドしたソースコードをサブディレクトリパスにデプロイする方法](https://zenn.dev/chot/articles/99ae6acca1429b)

- ビルド時の出力先フォルダの設定<br />
    ※静的エクスポートしない場合のデフォルトは`.next`フォルダに出力される。

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        distDir: 'out', // 出力先を'out'フォルダに設定
    };

    export default nextConfig;
    ```

- 静的エクスポート時のサブページの直リンク対策<br />
    ※`trailingSlash: true`を設定しない場合、`Link`の`href`属性や`router.push()`の引数に指定した **文字列の静的ファイルが生成される（例：`about.html`）** ため、サブページを再読み込みまたは直リンクしようとすると`about/index.html`は存在しないので意図した挙動にならない（ホスティング先の設定によって404リダイレクトまたはTOPページへリダイレクトされたりする）

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        trailingSlash: true,
    };

    export default nextConfig;
    ```

    `trailingSlash: true`を設定することで期待する挙動になる（各種サブページディレクトリと`index.html`が生成される）<br />

    [Next.jsのSSGのルーティングでリロードすると404](https://zenn.dev/mattak/articles/6880e5b8f02ee5)

- 静的エクスポートしたページの画像（`jpg`など）が表示されない<br />
    ※ `images: { unoptimized: true, }`することで解決。

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        images: {
            unoptimized: true,
        },
    };

    export default nextConfig;
    ```

    [unoptimized](https://nextjs.org/docs/app/api-reference/components/image#unoptimized)

    - ※ おそらくホスティング先（例：Xサーバー）が`Next`の`Image`コンポーネントの画像最適化（[`Image Optimization`](https://nextjs.org/docs/app/building-your-application/optimizing/images)）の処理に対応していないので「画像パスを読み込めず表示されない？」といったことがある？


### ESLint
- `useEffect`の依存関係で警告<br />
[useEffect has a missing dependencyのwarningを解消する](https://zenn.dev/mackay/articles/1e8fcce329336d )

```ts
useEffect(() => {
    /* intersectionobserver */
    ScrollObserver('section h2', 'OnView', {
        rootMargin: '-300px 0px'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

- コンポーネントの命名記述方法<br />
以下の関数宣言の書き方でないと`ESLint`に怒られる（`Error: Component definition is missing display name  react/display-name`）<br />
[ESLint で Component definition is missing display name が出たら、コンポーネントに名前を付ける](https://qiita.com/acro5piano/items/1cffa8c6b52a36e6bb73)

```ts
type hogeType = {
    urlStr: string;
    urlPathName: string;
}

/* コンポーネントの命名記述 */
export default function HogeComponent({ props }: { props: hogeType }) {
    // ...コンポーネントの中身
}

/* --------------------- memo を使う場合 --------------------- */
import { memo } from "react";

type hogeType = {
    urlStr: string;
    urlPathName: string;
}

/* コンポーネントの命名記述 */
function HogeComponent({ props }: { props: hogeType }) {
    // ...コンポーネントの中身
}
export default memo(HogeComponent);
```

この記述に変えると読み込み・呼び出し元のコンポーネントでの`import`の記述及び使用方法も変わるので注意

```diff
- import { HeadingComponent } from '@/app/utils/HeadingComponent';
+ import HeadingComponent from '@/app/utils/HeadingComponent';
.
.
.
- <HeadingComponent title="よくあるご質問" subTitle="F & Q" />
+ <HeadingComponent props={{
+   title: "よくあるご質問",
+   subTitle: "F & Q"
+ }} />
```

型によって記述が独特になる（以下は当ファイルに存在しない架空の記述）

```js
<ArticlesContentDetail props={{
    articles: { ...articles }, // 配列
    detailCheck: detailCheck, // state(bool)
    setDetailCheck: setDetailCheck, // 上記 state のセッター関数
}} />
```


### SupaBase
[そもそも`supabase`ってなんぞや？](https://qiita.com/kaho_eng/items/8a7faf77222a599fb31c#%E3%81%9D%E3%82%82%E3%81%9D%E3%82%82supabase%E3%81%A3%E3%81%A6%E3%81%AA%E3%82%93%E3%81%9E%E3%82%84)

- `JavaScript`で使う場合<br />
    `npm install @supabase/supabase-js`で`SupaBase`をインストールしておく。

    - `SupaBase`のアクセスに必要な情報は`.env.local`及び`.env`ファイルに記載

    - `SupaBase`で作成したテーブルデータの取得（フェッチ）方法は、`SupaBase`のダッシュボードにある「テーブル」-「（右上にある）`API Docs`」から確認可能

- `RLS`（Row Level Security）について<br />
[そもそも`RLS`とはなんぞや？](https://qiita.com/kaho_eng/items/6f9ac01d77ab198881f4#%E3%81%9D%E3%82%82%E3%81%9D%E3%82%82rls%E3%81%A8%E3%81%AF%E3%81%AA%E3%82%93%E3%81%9E%E3%82%84)

- `POST`,`PUT`などデータを取り扱う際のデータ名に注意<br />
テーブルデータ名（`body: JSON.stringify(...`）と（リクエストボディに渡す値の名前）`State`名は **【全く同じ】** にしないと機能しない。

```ts
const [id, setId] = useState<string>(''); // url
const [title, setTitle] = useState<string>(''); // タイトル
const [content, setContent] = useState<string>(''); // 本文
...
..
.
const API_URL = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
fetch(`${API_URL}/api/create`, {
    method: "POST", // create なので POST
    headers: {
        "Content-Type": "application/json", // json 形式で扱うことを明記
    },
    body: JSON.stringify({ id, title, content }) // テーブルデータ名と（リクエストボディに渡す値の名前）State名は【全く同じ】にしないと機能しない
});
```

- 動的関数ファイル（[id].ts）で`Atom`（というかライブラリ？）は使えない<br />
使用しようとすると`PUT`や`DELETE`処理でサーバー接続エラー（500）が発生してしまう。


### メモ
- 内部データはフェッチできない（外部データ：API しかフェッチできない）。外部データでも`CSR`仕様（`useEffect`を使用した非同期のフェッチ処理など）では`CORS`でフェッチできないが、`SSR`（サーバーコンポーネントとして`fetch api`を使用）だとフェッチできる。

    - APIを介さないリクエストにおいては`fetch`は使用不可<br />
    > Next.jsアプリケーションから直接DBにリクエストする、つまりAPIを介さないリクエストにおいては、fetchを使用することができません。

    参照記事：[Next.js App Router キャッシュの今](https://zenn.dev/frontendflat/articles/nextjs-cache-2024#unstable_cache)

- `npm run`について<br />
    > `npm run`とは、`npm scripts`と呼ばれるタスク実行機能を呼び出すコマンドです。機能は一つしかありません。
    > `package.json`内に書かれたシェルスクリプトを実行するだけ。これだけです。

    参照情報：[フロントエンド開発の３ステップ（npmことはじめ）](https://qiita.com/hashrock/items/15f4a4961183cfbb2658#%E3%83%93%E3%83%AB%E3%83%89%E3%81%AF-npm-run)

    - `./package.json`の中身

    ```json
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    },
    ```

    `npm run dev = next dev`, `npm run build = next build`,...

- `CssModule`使用時の`querySelector`への要素指定方法<br />

    ```ts
    import headerStyle from "../../styles/header/header.module.css";

    export const useNavView = () => {
        const headerBtnAct: () => void = () => {
            const headerNav = document.querySelector(`.${headerStyle.headerNavArea} nav`);
            const headerBtn = document.querySelector(`.${headerStyle.headerBtn}`);
            headerBtn?.classList.toggle(headerStyle.ViewOn);
            headerNav?.classList.toggle(headerStyle.ViewOn);
        }

        const removeAct: () => void = () => {
            const headerNav = document.querySelector(`.${headerStyle.headerNavArea} nav`);
            const headerBtn = document.querySelector(`.${headerStyle.headerBtn}`);
            if (headerNav?.classList.contains(headerStyle.ViewOn)) {
                headerNav?.classList.remove(headerStyle.ViewOn);
                headerBtn?.classList.remove(headerStyle.ViewOn);
            }
        }

        return { headerBtnAct, removeAct }
    }
    ```

    - document.querySelector(`.${headerStyle.headerNavArea} nav`)<br />
    `.classNameElm DOM`という形で絞り込み指定ができる。

    - document.querySelector(`.${headerStyle.headerBtn}`)<br />
    単数指定は上記の形。

    - `className`の指定方法

    ```ts
    if (headerNav?.classList.contains(headerStyle.ViewOn)) {
        headerNav?.classList.remove(headerStyle.ViewOn); // headerNav の .ViewOn を削除
        headerBtn?.classList.remove(headerStyle.ViewOn); // headerBtn の .ViewOn を削除
    }
    ```

- `Google Analytics 4`の設置<br />
[Next.js で作るWebアプリケーションを Google Analytics 4 で解析する（2024年2月）](https://zenn.dev/socialplus/articles/922364f3752647)

- OGP設定<br />
[App RouterのOGP設定方法まとめ [Next.js]](https://zenn.dev/temasaguru/articles/641a10cd5af02a)<br />
[opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

- `Image`タグ使用時の`Image with src "画像パス" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold.`という警告<br />
画像サイズの大きさで注意を受けているので記載通り、当該`Image`に`priority`を付与する。<br />
**`priority`を追加しない場合、すべて`lazy`ローディングになる**


```ts
<Image src={targetImg} alt="altTxt" priority />
```

- `useRouter`<br />
`useRouter`で1度閲覧したページへ遷移する際は`push`した後に`refresh`しないとキャッシュが効いた状態になる場合があるので注意

- `React`でのカスタムデータ属性の指定は`low-case`で<br />
`low-case`で指定しないとエラーが出る（`React`に怒られる）

```jsx
<li key={i} data-daydate={day.dayDateNum} ...
```

- **ホスティング先によってはルーティングの設定（`.htaccess`の調整）が必要**<br />
    例えば、以下のXサーバーの場合は当該ドメイン（FTPサーバールート）の`.htaccess`にリダイレクト処理を記述しないと存在しないページ（パス）でも通ってしまう（※`index.html` = TOPページへリダイレクトさせられる）ので、別途404リダイレクト処理の設定を追記する必要がある。

    ```
    # 全てのリクエストに対して、Ngx_Cache_NoCacheModeをoffに設定し、Ngx_Cache_StaticModeを設定します。
    SetEnvIf Request_URI ".*" Ngx_Cache_NoCacheMode=off
    SetEnvIf Request_URI ".*" Ngx_Cache_StaticMode

    # HTTPSがオフの場合、全てのリクエストをHTTPSにリダイレクトします。
    RewriteEngine on
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

    # ファイルが存在しない場合、またはディレクトリでない場合、すべてのリクエストをindex.htmlにリライトします。
    # RewriteEngine On
    # RewriteCond %{REQUEST_FILENAME} !-f
    # RewriteCond %{REQUEST_FILENAME} !-d
    # RewriteRule ^ index.html [QSA,L]

    # 404リダイレクト処理を設定（必ず相対パスで指定。サブディレクトリの場合はサブディレクトリからのパスを指定する）
    ErrorDocument 404 /subdir/hoge/404.html
    ```

    - （`Netlify`や各種ホスティング先で）開発モードでは機能するのにビルド・デプロイ後にはルーティングがうまく機能しない理由<br />
    参考情報：[Reactで作成したSPAをNetlifyでホストする際のコツ](https://zenn.dev/sikkim/articles/bf64efa6a5ca68#netlify%E7%94%A8%E3%81%AE%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88%E8%A8%AD%E5%AE%9A%E3%82%92%E8%BF%BD%E5%8A%A0)<br /><br />

    > （...中略）ルートにアクセスしたり、リンクをクリックして画面遷移する分には良いのですが、URLを指定してルート以外にアクセスすると404エラーになってしまいます。`dist`にはルートにしか`index.html`が存在しないので、考えてみたら当たり前ですね。ではなぜ`npm run dev`で動かしていたときはURLを直接指定しても正常に表示されていたかというと、ルート以外へのアクセスをテストサーバーがルートにリダイレクトしてくれていたからです。したがって`dist`のテストをするときは、すべてのアクセスをルートにリダイレクトしてやれば開発時の動きを再現できます。

    > 上記の問題は`Netlify`にデプロイしたときも発生します。`Netlify`ですべてのアクセスをルートの`index.html`にリダイレクトするのは簡単で、以下の内容の`netlify.toml`をReactプロジェクトのルートに配置しておくだけです。

    ```
    [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
    ```

- サーバーコンポーネントでの`console.log('ログ出力')`は**ターミナルに表示**される

- 日時の表示調整<br />
    - new Date(日時に関する変数または処理結果).toLocaleString(); // yyyy/mm/dd hh:mm:ss
    - new Date(日時に関する変数または処理結果).toLocaleDateString(); // yyyy/mm/dd

- `npm`と`npx`の ver 確認<br />
`node`をインストールしていれば下記コマンドで ver 確認できる。

```
npm -v // npm の ver 確認

npx -v // npx の ver 確認

npm install -g yarn // おまけ：yarn のインストール方法
yarn -v
```

- `json-server`<br />
`Firebase`や`Supabase`, `PostgreSQL`などのDB、各種サービスを用いた永続的なデータ保存・管理を行うよりも、まずは手軽にデータ保存・管理を行いたい場合に活用できる`npm`ライブラリが[`json-server`](https://www.npmjs.com/package/json-server)。

> json-server は、簡単に REST API を構築できるツールです。ローカルマシン上に JSON ファイルを置くだけで、RESTful な API を作成し、GET、POST、PUT、DELETE などの HTTP リクエストを使用してデータの取得、作成、更新、削除を行うことができます。
> json-server を使用すると、サーバーサイドのプログラミング言語やデータベースを必要とせず、フロントエンドの開発者が API の動作をテストしたり、簡単なデモアプリケーションを作成するのに便利です
> また、json-server は簡単に拡張することができ、ルーティングの設定やフック機能を利用することで、より高度な API を作成することもできます。

参考記事：[json-serverの使い方まとめ【解説】](https://qiita.com/ryome/items/36da51f0f5973eab8720)

- `json-server`の起動
    - デフォルト

    ```
    npx json-server [filePath/fileName].json --port [portNumber: ex...3001]
    ```

    - `package.json`に追記して`npm`コマンドで使用
    
```diff
.
..
"scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
+ "json-server": "json-server [filePath/fileName].json --port [portNumber: ex...3001]"
},
..
.
```

    追記後に`json-server`を立ち上げる

    ```
    npm run json-server
    ```

- lorem{数字}<br />
`Next.js` / `React`ではコンポーネント内で`lorem30`と記述し`Tab`キーを押すと、指定した数値分のワード数（先ほどの例では30単語・ワード）でダミーテキストを生成してくれる。

- シリアライズ：文字列化すること

- ユーティリティファースト：予め用意された`CSS`クラスを`HTML`に当てるだけでスタイルを適用させていく手法

- `git`操作中に**特定のターミナル画面から移動できなくなった場合**の対応<br />
    - `esc`キーを押した後に`:q!` or `:wq`を入力して`Enter`キーを押すと抜け出せる。
        - 今まで記述した内容（変更）を**保存しない**場合は`:q!`
        - 今まで記述した内容（変更）を**保存したい**場合は`:wq`

    参照情報：[gitのある画面から抜け出せません](https://terakoya.sejuku.net/question/detail/16555)