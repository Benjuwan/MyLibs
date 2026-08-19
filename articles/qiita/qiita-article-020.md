---
title: React のサイトを Next.js（v14）にしたら個人的に学びが多かったのでまとめてみる
tags: Next.js React TypeScript deploy xserver
author: benjuwan
slide: false
---
## はじめに
以前筆者が制作した2つの`React`, `TypeScript`制サイトを今回`Next.js`, `TypeScript`に作り直したのですが、情報収集に地味に時間がかかるところもあったので今回のリプレース作業を通じて得た学びとともにまとめていきたいと思います。

ちなみに、リプレースした理由は単純に`Next.js`の経験を深めたい（`Next.js`を使って何か作りたかった）のと「`Next.js`はSEOに強い」という情報を見聞きしたためです。
こんな動機で自由にさせてくれる会社には感謝です。

- リプレース前（`React`, `TypeScript`）
![ied-20240221.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e9c60f2a-a426-3b86-c2be-df30b752d0ce.png)

- リプレース後（`Next.js`, `TypeScript`）
![ied-next.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/510e8ac3-b62d-2ee6-974a-52bb8287f9a5.png)

実際リプレースしてからSEOのスコアは向上しました。
ありがとう、`Next.js`！

## 対象読者
- `React`や`Next.js`に興味のある方
- `Next.js`初心者
- `Next.js` × 国内ホスティング先を考えている方

## 概要
サイトは2つとも`SSG`した静的サイトで、ホスティング先はXサーバーです。そのため、今回以下のような内容はあまり出てきませんので悪しからず。

- `SSR`, `ISR`を用いた内容や情報
- `MUI`,`shadcn/ui`, `Mantine UI`, `Tailwind CSS`といったUIライブラリの話
- `Vercel`, `AWS`, `Cloudflare`, `Firebase`といったデプロイ先の話

Xサーバーを選定した理由は端的に言えば「社内都合」です。筆者の所属企業が管理するサイトは大半がXサーバーにホスティングしていることもあり、中長期的な運用 + 今回は静的サイトという性質も考慮して上記に決めました。

::: note
以下より国内と海外のサービスを区別するため、国内はホスティング先という表記、海外はデプロイ先という表記で進めさせていただきます。
:::

あと、筆者の所属企業のようにXサーバーやロリポップ、さくらインターネットなど国内の有名なホスティング先を利用されているところも少なくないと思います。
そういった方々に`Next.js`で作ったサイトのデプロイ時の注意事項などを共有できれば良いなと考え、記事を書いていきます。

::: note warn
お察しの通り筆者は`Next.js`に対して深い経験があるわけではありません。間違っている部分なども散見されるかもしれませんので、そのような場合はお手数ですがコメント欄などでご指摘・ご教示いただけますと嬉しく存じます。
:::

## まずは結論
デプロイ先は極力`Vercel`など周辺環境が整っているところにしましょう。
誤解を招かないために申すと、Xサーバーなど国内ホスティング先がダメということでは一切ないです。

今回のサイトでは環境変数の使用やデータベースとの連携といった作業はありませんでしたが、そのような要件があると`Vercel`など他のデプロイ先を利用したほうが賢明だと思います。
筆者はまだ`Vercel`でしか個人サイト（`Next.js`）をデプロイしていないので限定された意見になりますが、`Vercel`だと`GitHub`でリポジトリを作って連携しておけばビルドしただけで（簡易なチェックも交えて）デプロイしてくれます。
環境変数の設定もGUIで簡単に行えます。すごく楽ですし、`<Image>`コンポーネントを使うことで[画像最適化](https://nextjs.org/docs/app/building-your-application/optimizing/images)など`Next.js`の恩恵も受けられます。蛇足ですが、`<Image>`コンポーネントは`priority`という属性を追加しない場合、すべて`lazy`ローディングにしてくれるなどかゆいところに手が届く感じです。

それでも「**抜き差しならない事情で国内ホスティング先を使いたい**」という方に向けて、自身の備忘録も兼ねて書いていきます。

`SSG`, `SSR`, `ISR`や`Next.js`について少し復習しておきたい方は、簡易的な説明を置いておきますので必要に応じてご参照ください。今回は本記事で（`ISR`）は一切出てきませんが。

<details><summary> SSG, SSR, ISR について</summary>

- `SSG`, `SSR`, `ISR`はコンポーネント単位で使い分けられ、ビルド時に`Next.js`が記述に応じた仕様で各種ページを生成してくれる

    - `SSG`（Static Site Generators）<br />静的サイト生成。`build`時に各ページ（サイト）の`html`データを生成する。既に完成度100% の状態なので、ユーザーからのリクエストに迅速にレスポンスできる。更新頻度が低い箇所に使用する（例：コーポレートサイトのアバウトページやFAQページなど**静的アセットで済む処理**）<br /><br />

    - `SSR`（Server Side Rendering）<br />サーバー側で各ページ（サイト）を生成する。完成度50%くらいの状態で生成し、ユーザーからリクエストがあると100％の状態にしてレスポンスする。更新頻度が高い箇所に使用する（例：SNSのタイムラインやユーザープロフィールなど**動的な処理**）<br /><br />

    - `ISR`（Incremental Static Regeneration）<br />`SSG`と`SSR`のハイブリッド版のようなもの。生成した各ページ（サイト）を`CDN`（自身の最寄り倉庫のようなもの）にキャッシュしており、指定した時間（`Revalidate`）に応じて更新（`SSR`のような動き）したものをユーザーにレスポンスする。<br />※指定した時間の経過後にアクセスすると更新データが表示されるという仕組みではなく、アクセス時は一旦**更新前のものが表示**され、**その後にアクセスすると更新後のものが表示**される。<br />よりリアクティブなレスポンスにしたい場合は`SWR`を使用する<br /><br />

    - `fetch API`通じて各種生成方法（`SSG`, `SSR`, `ISR`）を利用できる

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

参照情報：https://nextjs.org/blog/next-13#data-fetching

</details>

<details><summary>Next.js のファイル構成について</summary>

- ファイル構成（`src`ディレクトリ配下）
    - `app`ディレクトリ（配下）は**原則サーバー側でレンダリング**される（サーバー側でデータ取得を行うほうがパフォーマンス的に早いため）。デフォルトでは`use server`（サーバーコンポーネントの）状態。ファイルの先頭に`use client`を記述するとクライアントコンポーネントとなる（クライアントコンポーネントでしか`State`, `Effect`などの`Hooks`が扱えない）<br /><br />
    
    - `use client`（クライアントコンポーネント）は**苗字**みたいなもので、親で宣言していればそのディレクティブ（配下の子コンポーネント）も全てクライアントコンポーネントになる（各自子コンポーネントで`use client`を宣言するとエラーになるので注意）
    参照記事：[【Next.js】RSCとクライアントコンポーネントを改めて理解する](https://zenn.dev/sc30gsw/articles/0941e76ae96260#%E5%A2%83%E7%95%8C%E5%86%85%E3%81%A7%E3%81%AFuse-client%E3%81%AF%E4%B8%80%E5%BA%A6%E3%81%AE%E5%AE%A3%E8%A8%80%E3%81%AB%E3%81%99%E3%81%B9%E3%81%97)<br /><br />

    - `app/page.tsx`<br />`Next 12`でいうところの`index.tsx`の役割。各ディレクトリごとに用意することで**ファイルシステムベースルーティング**の恩恵を得られる<br /><br />

    - `app/layout.tsx`<br />`Next 12`でいうところの`_documet.tsx`や`_app.tsx`の役割。`Next 13`で新たに設けられたファイルで、各ページ（ディレクトリごとの`page.tsx`）の**レイアウト情報（`meta`情報など）の管理**を担う。`layout.tsx`は入れ子も可能
参考記事：[Next.js 13 Template と Layout の使い分け](https://zenn.dev/cybozu_frontend/articles/8caf1decb1e82c)
</details>

### `SSG`に必要な設定・記述
先に`SSG`の方法やその他関連情報をお求めの方に向けて、`next.config.js` or `next.config.mjs`への設定・記述を箇条書きの形式で紹介していきます。

- `SSG`を行うために必要な記述
    `output: 'export'`を追記

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        output: 'export',
    };

    export default nextConfig;
    ```
https://nextjs.org/docs/app/building-your-application/deploying/static-exports

- サブページの再読み込みまたは直リンクへの対策（各種サブページディレクトリとindex.htmlを生成）
    `trailingSlash: true`を設定しない場合、`Link`の`href`属性や`router.push()`の引数に指定した **文字列の静的ファイルが生成される（例：`about.html`）** ため、サブページを再読み込みまたは直リンクしようとすると`about/index.html`は存在しないので意図した挙動になりません（ホスティング先の設定によって404リダイレクトまたはTOPページへリダイレクトされたりする）

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        trailingSlash: true,
    };

    export default nextConfig;
    ```

    `trailingSlash: true`を設定することで期待する挙動になってくれます（各種サブページディレクトリと`index.html`が生成される）

https://zenn.dev/mattak/articles/6880e5b8f02ee5

以下からは必要に応じて設定してください。
***

- 外部（ドメイン）サイトから（画像などの素材）データを引っ張ってくる場合に必要な記述

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
    
https://nextjs.org/docs/messages/next-image-unconfigured-host

- サブディレクトリの指定
    https://exapmle.com/sub/hoge ← 左記URLにおける`sub/hoge`の部分にデプロイしたいケースです。ディレクトリパスの先頭には`/`が必要で、末尾に`/`を付けるとエラーでビルドできないため指定時は注意してください

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        assetPrefix:  '/サブディレクトリ',
        basePath:  '/サブディレクトリ'
    };

    export default nextConfig;
    ```
    
https://zenn.dev/chot/articles/99ae6acca1429b

- ビルド時の出力先フォルダの設定
    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        distDir: 'dist', // 出力先を'dist'フォルダに設定
    };

    export default nextConfig;
    ```

## デプロイ時に起きたトラブル
- **静的エクスポートしたページの画像（`jpg`など）が表示されない**
`images: { unoptimized: true, }`を追記することで解決しましたが、これだと画像最適化されていないので`Next.js`を使うメリットを失うことになります。

    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
        images: {
            unoptimized: true,
        },
    };

    export default nextConfig;
    ```

https://nextjs.org/docs/app/api-reference/components/image#unoptimized

筆者の勝手な推論ですが、ホスティング先（今回はXサーバー）が`Next`の`Image`コンポーネントの画像最適化（[`Image Optimization`](https://nextjs.org/docs/app/building-your-application/optimizing/images)）の処理に対応していないので「画像パスを読み込めず表示されない？」ということなのかなぁと思っています。

- **ホスティング先によってはルーティングの設定（`.htaccess`の調整）が必要**
筆者が遭遇した現象は「存在しないパスを打っても404ページは表示されずTOPページが表示される」というものでした。
以下のように、当該ドメイン（FTPサーバールート）の`.htaccess`にリダイレクト処理を記述することで期待した挙動になりました。

    ```
    ErrorDocument 404 /subdir/hoge/404.html
    ```

    ※404リダイレクト処理の設定は必ず相対パスで指定してください。サブディレクトリの場合はサブディレクトリからのパスを指定する形です。


## `Google Analytics 4`や`OGP`の設定
一般的なwebサイトでは、`Google Analytics 4`や`OGP`を設定するのはよくあることだと思うので必要な情報を下記に貼っておきます。

- `Google Analytics 4`の設定

https://zenn.dev/socialplus/articles/922364f3752647

- `OGP`の設定

https://zenn.dev/temasaguru/articles/641a10cd5af02a

https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

***

本記事の主題となる情報まとめは一旦済んだので、以下より筆者が今回リプレースした2つのサイトについての体験録を書いていきます。関心のある方はぜひ読んでやってください。

## 毎月更新するサイトA
まずは1つ目の月次更新のサイトAから説明していきます。
冒頭でも説明した通り、静的サイトですが将来的にデータベースを用いて更新する可能性を意識して`SSR`仕様で制作しました。<font color="lightgray">……そのためビルド時には余計な調整作業（SSR関連の不要なファイルの削除）が入ってくるという生産性悪しな仕様です。</font>

技術スタックは以下になります。

- Next.js@14.1.0
- [jotai](https://jotai.org/)
- [styled-components](https://styled-components.com/)
- [json-server](https://www.npmjs.com/package/json-server)
- [swiper](https://swiperjs.com/)
- [html-react-parser](https://www.npmjs.com/package/html-react-parser)

`jotai`では状態管理を、`styled-components`で要素のスタイルを、`swiper`でスライダーを実装しています。
`json-server`は先述の`SSR`する可能性を意識してローカル環境に簡易サーバーを置くために、`html-react-parser`は定期更新する際の`json`データに記述した`html`要素の解析に利用しています。

<details><summary>「定期更新する際のjsonデータに記述したhtml要素の解析に利用」について</summary>

`React`でサイト制作した折に、毎月更新する度にファイルを弄ったり、都度ビルドしたりするのが億劫だったので「更新データを`fetch`させればいいんじゃね？」と（短絡的な思考で）実装した内容です。

``` ts
const [hogeData, setHogeData] = useState<hogeAryType[]>([]);
useEffect(() => {
      const fecthHogeData = async () => {
      // キャッシュ対策として`cache: 'no-store'`でデータを保存しないようにしています。
      const response = await fetch('https://example.com/data.json', { cache: 'no-store' });
      const resObj: hogeAryType[] = await response.json();
      setHogeData((_prevHogeData) => resObj);
    }
    fecthHogeData();
}, []);
```
jsonデータ（data.json）は以下の感じです。

```json
[
    {
        "yearMonths": "2024/2",
        "imgPath": "images/content2402",
        "title": "Lorem ipsum dolor sit amet, <br> consectetur adipiscing elit",
        "column001": "mollit anim id est laborum",
        "column002": "dolor in reprehenderit in voluptate <br> velit esse cillum dolore eu fugiat",
    },
    ...
    ..
    .
]
```

この方法に変えてから今まで10分程度かかっていた更新作業が長くて3分程度に短縮されたので個人的にはハッピーです。
</details>

では、以下より筆者が制作時に詰まったポイントを書いていきます。

### 内部データはフェッチできない
例えば、開発時に同`Next.js`プロジェクトの`public`内に`json`データを置いてフェッチしようとするとできませんでした。
`React`では普通にできていたので初めに最も戸惑ったところです。

外部の`json`データでも`CSR`仕様（`useEffect`を使用した非同期のフェッチ処理など）では`CORS`でエラーが出てフェッチできませんでしたが、`SSR`仕様（サーバーコンポーネントとして`fetch api`を使用）だとフェッチできて驚きました。
クライアント側での処理ではなくサーバー側で処理しておくからフェッチできる、という漠然とした理解？も`Next.js`を触らないと知らないままだったので良い学びになりました。

ちなみに、`CSR`仕様でもフェッチできないのは開発時のみの話でビルドして当該ドメインサイトのサーバーにデプロイすれば当然`CORS`には引っかかりませんでした。

### `styled-components`はクライアントコンポーネントでしか使えない
[公式にも書いてあります](https://nextjs.org/docs/app/building-your-application/styling/css-in-js)が、サーバーコンポーネントでは`styled-components`は使えません。
あと、こちらも同じく公式に書いていますが、`next.config.js`に所定の記述が無いとスタイルがうまく反映されませんのでご注意ください。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
};

export default nextConfig;
```

https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components

### コンポーネントの命名の仕方
`export default コンポーネント名;`で行いましょう。あと、パスカルケースで命名しないと、`build`時にエラーが出ます。

また、以下の関数宣言の書き方でないと`ESLint`に怒られます。

```ts
type hogeType = {
    urlStr: string;
    urlPathName: string;
}

/* コンポーネントはパスカルケースで命名 */
function HogeComponent({ props }: { props: hogeType }) {
    // ...コンポーネントの中身
}
export default HogeComponent;

or 

/* コンポーネントはパスカルケースで命名 */
export default function HogeComponent({ props }: { props: hogeType }) {
    // ...コンポーネントの中身
}

/* --------------------- memo を使う場合 --------------------- */
import { memo } from "react";

type hogeType = {
    urlStr: string;
    urlPathName: string;
}

/* コンポーネントはパスカルケースで命名 */
function HogeComponent({ props }: { props: hogeType }) {
    // ...コンポーネントの中身
}
export default memo(HogeComponent);
```

https://qiita.com/acro5piano/items/1cffa8c6b52a36e6bb73

いつも`React`では以下のように書いていたので少しだけ戸惑いました。
```jsx
export const HogeComponent = memo(({ props }: { props: hogeType }) => {
    // ...コンポーネントの中身
});

or

export const HogeComponent:FC<hogeType> = memo((props) => {
    // ...コンポーネントの中身
});
```


さらに、この記述に変えると`import`の記述及び使用方法も変わるので、そこも戸惑いポイントでした。

```diff
- import { HeadingComponent } from '@/app/utils/HeadingComponent';
+ import HeadingComponent from '@/app/utils/HeadingComponent';
.
.
- <HeadingComponent title="よくあるご質問" subTitle="F & Q" />
+ <HeadingComponent props={{
+   title: "よくあるご質問",
+   subTitle: "F & Q"
+ }} />
```

型によって記述が独特になります。

```jsx
<ArticlesContentDetail props={{
    articles: { ...articles }, // 配列
    detailCheck: detailCheck, // state(bool)
    setDetailCheck: setDetailCheck, // 上記 state のセッター関数
}} />
```

### `useEffect`の依存関係で警告
`ESLint`関連で驚いたのがもう一つ、`useEffect`の依存関係で警告でした。

https://zenn.dev/mackay/articles/1e8fcce329336d

```ts
useEffect(() => {
    ScrollObserver('section h2', 'OnView', {
        rootMargin: '-300px 0px'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

このあたりも実際に`Next.js`で作成し、ビルドまでしないと知らないことだったので良かったです。

### リプレースして
![routes-next.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/3869d44a-9fb8-614c-3448-80c4a3157967.png)

`React`の時点で数値はそこまで悪くなかった（※リプレース前のを記録し忘れていて申し訳ない）のですが、リプレースしてSEOとか100になったので、これはすごくびっくりしました。

画像最適化の恩恵を無効化したのでパフォーマンスが少し落ちましたが、もし有効だったら数値はさらに向上しそうですよね。このあたりがデプロイ先に`Vercel`とかを選んだほうが賢明という部分につながってくるかと思います。

## 年に数回程度な更新のサイトB
こちらはサイトAと違って完全に`SSG`による静的サイトです。

技術スタックは以下になります。
- next@14.1.0
- styled-components
- swiper

先ほどのサイトAでは状態管理に`jotai`を用いていましたが、`React Context`での実装を試してみたかったので、こちらでは`React Context`を使って状態管理しています。

参照情報：

https://vercel.com/guides/react-context-state-management-nextjs

### `React Context`
先程の公式の参照情報にある通りなのですが以下のような記述で簡単に実装できました。

```swift:src/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* head 関連：GA4 / OGP */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"
      />
      <Script
        id="gtag-config"
        strategy="afterInteractive"
      >
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXX'); 
        `}
      </Script>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <meta property="og:image" content="<generated>" />
      <meta property="og:image:type" content="<generated>" />
      <meta property="og:image:width" content="<generated>" />
      <meta property="og:image:height" content="<generated>" />
      <meta name="twitter:image" content="<generated>" />
      <meta name="twitter:image:type" content="<generated>" />
      <meta name="twitter:image:width" content="<generated>" />
      <meta name="twitter:image:height" content="<generated>" />
      {/* head 関連：GA4 / OGP */}
      <body>
        <TopPageContextFragment>
          <NotFoundContextFragment>
            <Header />
            {children}
            <Footer />
          </NotFoundContextFragment>
        </TopPageContextFragment>
      </body>
    </html >
  );
}
```

***

以下は制作時に詰まったポイントです。

### CSS の 背景画像の設定
`Next.js`では`public`ディレクトリ（フォルダ）で **すべての静的データを管理する** 形のため、CSSの値でURLにパス指定する再は`public`直下からの指定となるようです。

``` css
.something_elements {
    /* (public)/img/something.jpg */
    background: url('/img/something.jpg') no-repeat center/cover;
}
```

https://zenn.dev/milkandhoney995/articles/1fda5d82b44306

### pdf の別タブ表示
`pdf`ファイルなどは`Link`の`href`に直接（`public`直下から）指定することで表示できます。

``` jsx
/* (public)/pdf/documents/abouthogefoo.pdf */
<Link href="/pdf/documents/abouthogefoo.pdf" target="_blank">hogefooに関するpdfドキュメント</Link>
```

ただ、この書き方だと`Next.js`のプリレンダリングの影響？でコンソールに404の警告が出るのです（クリックすると`pdf`ファイルはしっかり表示できます）。`<a>`タグを使っても同じだったので何かご存じの方は教えていただけますと嬉しいです。

詰まったのはここらあたりで、（サイトAでの経験を経ていたこともあり）概ね滞ったような部分は少なく、シンプルな作りであったこともあって3日ほどでリプレースは済みました。

実は、サイトBは納期2週間で制作という状況（要望）だったことから当時は「とりあえず形に（焦）」的な部分を重視したスピード制作でした。そのため、いつか手を加えたいと思っていたのです。

`Next.js`のファイルシステムベースルーティングが便利だったので、おかげさまでサイトのページを拡充したり、それに伴ったTOPページの大幅なデザイン修正を行ったりできました。TOPページの情報整理をはじめ、提供サービスの明確な住み分けの実現、ページ拡充によるサイト流入経路への期待などサイト改善ができたので良かったと感じています。

あと、TOPページの情報整理をする上で各種提供サービスのリード文を`Chat-GPT`にまとめてもらいました。以前は提供サービス内の細目ごとの紹介文を掲載していたのですが、それら紹介文を`Chat-GPT`に投げて150〜300文字程度のリード文に編集してもらったのです。社内のライターに依頼したり、やり取りしたりなどの労力もなく、ものの数分で生成してもらって超時短になりました。ありがとう、`Chat-GPT`！

### リプレースして

- リプレース前
![ied-20240221.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e9c60f2a-a426-3b86-c2be-df30b752d0ce.png)

- リプレース後
![ied-next.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/510e8ac3-b62d-2ee6-974a-52bb8287f9a5.png)

こちらもサイトA同様、もともとそこまで悪くありませんでしたが、`Next.js`にしてからSEOのスコアは向上しました。
ありがとう、`Next.js`！

## 筆者が`React`と`Next.js`双方での制作を通じて得た所感
- ルーティング
圧倒的に`Next.js`が楽です。`React`だと`React Router`で実装していましたが色々記述が必要です。これは正直、`React Router`が不便とかいう話では全くなくて（実際使いやすいですし）、ファイルシステムベースルーティングが便利すぎる。という筆者の感想です。<br><br>

- ビルド後のデプロイ
個人的にビルドして`dist`一つを出してくれる`React`のほうが分かりやすいです。

    `Next.js`では`SSG`するのに記述が必要だったり、記述せずビルドすると`.next`に大量のファイルが出力されたりして、特にmacだと不可視ファイルだったので当初『`React`でいう`dist`はどこだ？』となりました。
    しかも出力された`.next`の中にはすごい量のファイルが入っていて『これどうやって使うの？』とか混乱した記憶があります。
    
    今でも`.next`の中にあるファイルたちの具体的な役割を理解していませんが、『おそらくこの中のファイルたちは、例えば`Vercel`など`Next.js`がフルパワーを発揮できるようなデプロイ先だけが扱えて、それらファイルをもとに良い感じの仕様でデプロイまでしてくれるのに必要なものなのだろう』と**漠然と理解したつもり**になっています。<br><br>

- 名もなき家事
`<Image>`コンポーネントの`priority`という属性の話を冒頭にしましたが、その他の404ページやローディング、エラーページ、サイトマップの作成などサイト制作に必要とされる多様な部分への気配りが`Next.js`にはあると感じました。

    - エラーページ（※ファイル名は`error.tsx`で固定です）
    `app`直下に`error.tsx`というファイルを置くだけで利用できます。
    参照情報：[Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)<br><br>
    
    - `not-found.tsx`,`loading.tsx`（※ファイル名固定）
    `error.tsx`同様、これらのファイルを用意するだけで404ページやローディングが利用できます。
    参照情報：[not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
    参照情報：[loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
    参照情報：[Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)<br><br>

    - サイトマップ
    参照情報：[Generating a sitemap using code (.js, .ts)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts)

あと`Next.js`はドキュメントが充実していて良いなと感じました。


## さいごに
ここまで読んでいただきありがとうございました。
基礎的な内容も多いでしょうし、『そもそも`Next.js`使う必要ある？』と思われた方も少なくないと思います。
しかし冒頭にあるように試してみたかった好奇心を抑えられず突っ走った感じです。
改めて会社には感謝したいと思います。

そして、筆者が実体験を通じて学んだのは「やはりアウトプットすることで知識は身に付く」という感覚と「`Next.js`を使用するだけでなく活用したいのならばデプロイ先は大切」という印象でした。
とはいえ、それでもスコアが高いので`Next.js`は素晴らしいと感じます。

この記事がどなたかの役に少しでも立てれば幸いです。

