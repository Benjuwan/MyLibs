---
title: "styled-components から Tailwind CSS への移行作業を終えて"
emoji: "💅"
type: "tech"
topics:
  - "css"
  - "react"
  - "tailwind"
  - "styledcomponents"
published: true
published_at: "2025-04-11 15:01"
---

## はじめに
以下の記事、または他の方々も発信されているように、先月3月に`styled-components`がメンテナンスモードとなる発表がありました。

https://opencollective.com/styled-components/updates/thank-you

> As I write this in 2025, styled-components as a project is in "maintenance mode". There are a number of reasons for this:

個人的に、React を学び始めた時からお世話になっていて、Reactのコンポーネント指向を`CSS in JS`というものを通じて感覚的に理解するのにすごく助けてもらいました。

実務案件をはじめ個人開発でもすべて`styled-components`で実装していたので、この情報を受けてショックとともに「CSSどうしよ」と🙄。

先の記事ではCSSエコシステムにおいても言及されていて、筆者的には`Tailwind`という一つの指針を示してくれているように感じました。

`Tailwind CSS`に関しては、「`styled-components`があるし、別に`Tailwind`はいいや」と思っていた筆者ですが、今回の件で心境が変化した次第です。

そこで今回、10〜20ほどある実務・個人開発のほぼほぼ全てを`styled-components`から`Tailwind CSS`に移行したので、感想及び備忘録的な内容で記事にしていきたいと思います。

移行作業はリファクタリング含めて、大体2週間くらいで済みました。

### 対象読者
- `styled-components`のメンテナンスモードにショックを受けている方
- html, css に関してある程度の知識や経験を持っている方
  ※htmlタグの概要、CSSのセレクタやプロパティとか知っているレベル
- スタイリングでよく使うような部分に絞った`Tailwind CSS`の情報が欲しい方
  ※筆者の独断と偏見に依存
- React のCSSについて悩んでいる方
  ※ここに関しては記事の投稿者が述べていますが`CSS in JS`（`styled-components`や`Emotion`）は選択肢から外したほうが良さそうです。詳しくはまた後述します。

> For new projects, I would not recommend adopting styled-components or most other css-in-js solutions.

:::message
本記事では、React そのものをはじめ、`styled-components`や`Tailwind CSS`の概要・特徴などに関する情報は割愛します。
:::

## 移行作業って大変？
結論から言うと**CSSの知識が一定以上あればそこまで苦では無い**と思います。
ここでいう一定以上とは、`@keyframes`を使った簡易なアニメーション処理をはじめ、バニラなCSSで特に不自由なく汎用的・一般的なスタイリングができるくらいのイメージです。

あと、最近は生成AIもありますからね。
筆者は今回`Claude`（無料プラン）を使って進めましたが、いくつか重複した記述になっていたり、冗長な書き方になっていたりする部分もあって**完全に手放しというわけにはいきません**でした。
~~まぁ、もともとのCSSが悪かった可能性も……~~

とはいえ、`Claude`のおかげで`Tailwind CSS`の記法について勉強になる部分も多かったですし、キャッチアップ効率という観点でとても良かったと感じています。

次に、今回の移行作業を通じて得た「筆者の独断と偏見による`Tailwind CSS`で頻繁に使った部分」を紹介していきます。

## `Tailwind CSS`で頻繁に使った部分
まずは初め方です。
筆者は全て`vite`だったので以下を参照しました。

https://tailwindcss.com/docs/installation/using-vite

Framework Guides に Next, Nuxt などあったので網羅的に対応できそうなドキュメントです。

:::details vite でのセットアップ詳細

1. 当該プロジェクトへ`Tailwind CSS`をインストール
```bash
npm install tailwindcss @tailwindcss/vite
```

2. `vite.config.ts`に設定を追加
```diff
import { defineConfig } from 'vite'
+ import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
+    tailwindcss(),
  ],
})
```

3. 使用する`CSS`ファイル（`src/index.css`）に`Tailwind CSS`をインポート
```css
@import "tailwindcss";
```

:::

### リセットCSSについて
`Tailwind`には[`Preflight`](https://tailwindcss.com/docs/preflight)というデフォルトの CSS リセットが組み込まれているので追加でリセット CSS を用意する必要はないようです。

### デフォルト： `1単位 0.25rem（4px）`
`Tailwind CSS`ではデフォルトで`1単位が 0.25rem（4px）`に相当（＝`1rem は 16px`）します。

### その他の補足情報
- em値を再現したい場合は、カスタム値`mt-[5em]`を使用するのがベター
- カスタム値`[]`について
角括弧`[]`内に任意の値を指定することで`Tailwind CSS`のユーティリティクラスで対応していない値を使用できます。（例：`w-[32%]`, `text-[#f5a623]`, `mt-[1rem]`）

- `input type="file"`のようなフォーム要素に関するもの（[`::file`](https://tailwindcss.com/docs/hover-focus-and-other-states#file)）
`file:`プレフィックスを付与してスタイリングします。
```html
<input
  type="file"
  class="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500 ..."
/>
```

#### `Tailwind`の標準クラス（一部）
`Tailwind CSS`の標準クラス（ユーティリティクラス）は公式ドキュメントに詳しく載っていますが、大まかに分けると以下のようなカテゴリがあります。

::: message
※各種プロパティの**値におけるスペースの取り扱い**について
- 各値の**間は詰めないと働かない**ので注意
  `clamp`の例：`w-[clamp(80px,calc(100vw/2),320px)]`
- または **`_`（アンダースコア）を用いる**
  [`box-shadow`](https://tailwindcss.com/docs/box-shadow)の例：`shadow-[0_0_4px_rgba(0,0,0,.45)_inset]`
:::

##### レイアウト関連
- [`display`](https://tailwindcss.com/docs/display)
  `block` / `inline-block` / `flex` / `grid` / `hidden`
- [`width`](https://tailwindcss.com/docs/width)
  `w-`（幅: w-1/2, w-full など）
  ※`full`=100%
- [`height`](https://tailwindcss.com/docs/height)
  `h-`（高さ: h-16, h-screen など）
  ※`screen`=viewport（`h-screen`の場合は`100vh`）
- `min-width/height`, `max-width/height`（最小・最大サイズ）
  `min-w-`, `min-h-`, `max-w-`, `max-h-`

##### タイポグラフィ
- `text-`（テキストサイズ: `text-sm`=14px, `text-xl`=20px など）
- `font-`（フォントウェイト/ファミリー: `font-bold`, `font-serif` など）
- `leading-`（行間=[`line-height`](https://tailwindcss.com/docs/line-height): `leading-tight`, `leading-relaxed`）  
- `tracking-`（文字間隔=[`letter-spacing`](https://tailwindcss.com/docs/letter-spacing): `tracking-wide`, `tracking-tighter`）
- `text-`（色: `text-red-500`, `text-gray-700` など）
  - `no-underline`（`text-decoration: none`）

::: message
[`font-size`早見表](https://tailwindcss.com/docs/font-size)
※ 12 〜 20px までは 2px ずつステップアップ
:::

##### スペーシング
- `m-`（[`margin`](https://tailwindcss.com/docs/margin): `m-4`, `mt-2`, `mx-auto` など）
- `p-`（[`padding`](https://tailwindcss.com/docs/padding): `p-4`, `py-2`, `px-6` など）

##### ボーダー
- `border-`（ボーダー: `border`, `border-gray-300`, `border-t`, `border-b-[4px]`, `border-b-1`, `border-dotted` など）
- `rounded-`（角丸=[`border-radius`](https://tailwindcss.com/docs/border-radius): `rounded-lg`, `rounded-full` など）

##### Flexbox / Grid
- `flex`, [`flex-row`](https://tailwindcss.com/docs/flex-direction), [`flex-col`](https://tailwindcss.com/docs/flex-direction)
- [`items-center`](https://tailwindcss.com/docs/place-items), [`justify-between`](https://tailwindcss.com/docs/justify-content), `gap-4`
- [`grid-cols-`](https://tailwindcss.com/docs/grid-template-columns)（=`grid-template-columns`）, [`grid-rows-`](https://tailwindcss.com/docs/grid-row)（=`grid-row`）

##### 背景（`background`）
- [`background-color`](https://tailwindcss.com/docs/background-color)
```html
<!-- bg-blue-500 → background-color: #3b82f6; -->
<div class="bg-blue-500 text-white p-4">背景色：青</div>
```

- [`linear-gradient`](https://tailwindcss.com/docs/background-image#adding-a-linear-gradient)
```html
<!-- bg-gradient-to-r → 右方向のグラデーション -->
<!-- from-green-400   → 開始色 -->
<!-- to-blue-500      → 終了色 -->
<div class="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
  緑から青へのグラデーション
</div>

<!-- 中間色を追加 -->
<div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 text-white">
  3色グラデーション
</div>

<!-- カスタム値 -->
<div class="bg-[linear-gradient(to_bottom,rgba(255,225,225,0)_70%,gold_30%)]">
  <!-- background-image: linear-gradient(#ffe1e100 70%, gold 30%); と出力される -->
  疑似的な下半分の黄色マーカースタイル
</div>
```

- 背景画像（`bg-`ショートハンド）
```html
<!-- bg-[url('/path/to/image.jpg')] → 背景画像を適用 -->
<!-- bg-no-repeat                   → 繰り返しなし -->
<!-- bg-center                      → background-position: center; -->
<!-- bg-cover                       → background-size: cover; -->
<div class="bg-[url('/path/to/image.jpg')] bg-no-repeat bg-center bg-cover">
  背景画像
</div>
```

- 背景の固定（[`background-attachment`](https://tailwindcss.com/docs/background-attachment)）
```html
<!-- bg-fixed   → 背景画像を固定 -->
<!-- bg-scroll  → スクロールと共に背景も動く -->
<div class="bg-fixed bg-[url('/mountain.jpg')] h-screen"></div>
<div class="bg-scroll bg-[url('/ocean.jpg')] h-screen"></div>
```

##### 遷移アニメーション（`transition`）
- `transition`：デフォルトでは`all 150ms ease-out`
```html
<button class="bg-blue-500 text-white px-4 py-2 rounded transition hover:bg-blue-700">
  ホバーで色が変わる
</button>

<!-- transition-colors  → 色だけをスムーズに変更 -->
<!-- duration-500       → 遷移時間を 500ms に -->
<!-- ease-in-out        → ゆっくり開始＆終了 -->
<button class="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-500 ease-in-out hover:bg-red-500">
  0.5秒かけて色を変える
</button>

<!-- transition-transform → transform のみアニメーション適用 -->
<!-- hover:scale-125      → ホバー時に 1.25 倍拡大 -->
<div class="w-20 h-20 bg-green-500 transition-transform duration-300 hover:scale-125">
  ホバーで拡大
</div>

<!-- hover:rotate-45 → ホバー時に 45 度回転 -->
<div class="w-20 h-20 bg-yellow-500 transition-transform duration-500 hover:rotate-45">
  ホバーで45度回転
</div>

<!-- hover:translate-x-10 → ホバー時に右へ 10（約 40px）移動 -->
<div class="w-20 h-20 bg-purple-500 transition-transform duration-300 hover:translate-x-10">
  ホバーで右に移動
</div>
```

- `transition` + `transform`
```html
<!-- transition-all       → すべての変更をアニメーション -->
<!-- hover:rotate-45      → 45度回転 -->
<!-- hover:scale-110      → 1.1倍に拡大 -->
<!-- hover:translate-x-5  → 右へ 5（約 20px）移動 -->
<div class="w-20 h-20 bg-red-500 transition-all duration-500 hover:rotate-45 hover:scale-110 hover:translate-x-5">
  ホバーで変形
</div>
```

--- 

- その他：[`backdrop-filter`](https://tailwindcss.com/docs/backdrop-filter)
- その他：[`aspect-ratio`](https://tailwindcss.com/docs/aspect-ratio)

---

##### アニメーション（`@keyframes`） | [`animation`](https://tailwindcss.com/docs/animation)
- `@layer`
カスタムの`@keyframes`を定義するには`@layer {任意の名前}`を使用する
```css
@layer utilities {
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 1s ease-in-out;
  }
}
```

※その他、`JavaScript`と連動して特定クラスの付与解除を行いたい場合にも重宝する。
```css
@layer common {
  .modalElm {
    opacity: 0;
    visibility: hidden;

    &.onView {
      opacity: 1;
      visibility: visible;
    }
  }
}
```

- `@layer`に関するより詳細な参照記事：
  [CSS のカスケードレイヤー `@layer` を使ってスタイルを階層化して管理する](https://azukiazusa.dev/blog/manage-styles-structurally-with-css-cascade-layer/)

---

- `tailwind.config.js`で設定
```js
module.exports = {
  theme: {
    // 以下 extend 内に設定を記述していく
    extend: {
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

- コンポーネントで設定した`animation`を適用
```html
<!-- 設定した animate-slide-in -->
<div class="animate-slide-in bg-blue-500 text-white p-4">
  スライドインする要素
</div>
```

- `animation-delay`を適用 
`[]`内にカスタムCSSを直接書くことで適用させる
```html
<!-- [animation-delay:0.5s] → 0.5秒後にフェードイン -->
<div class="animate-fade-in [animation-delay:0.5s]">
  0.5秒後にフェードイン
</div>
```

##### [ブレイクポイント](https://tailwindcss.com/docs/responsive-design#overview)（メディアクエリの指定方法）
- `Tailwind CSS`のデフォルトブレイクポイントは以下で、`カスタムメディアクエリ`（`min-[カスタム値]:`, `max-[カスタム値]:`）を使用する方法もあります。
```
- sm:  640  px以上の画面
- md:  768  px以上の画面
- lg:  1024 px以上の画面
- xl:  1280 px以上の画面
- 2xl: 1536 px以上の画面
```

```html
<!-- 通常の画面ではテキストが小さく、lgサイズ（1024px）以上では大きく表示 -->
<div class="text-sm lg:text-lg">テキスト</div>

<!-- スマホでは列、PCでは行に並べる -->
<div class="flex flex-col md:flex-row">...</div>

<!-- カスタムメディアクエリを使用する方法 -->
<div class="min-[1025px]:text-[32px]">カスタムブレイクポイント</div>
<div class="max-[767px]:hidden">モバイルでは非表示</div>
```

### 擬似クラス・擬似要素・その他セレクタの指定方法
#### 擬似クラス
`checked:`,`disabled:`など、ほとんどの擬似クラスは`擬似クラス名:`プレフィックスで対応します。
```html
<button class="hover:bg-blue-700 focus:ring-2 active:bg-blue-800">ボタン</button>
<div class="first:pt-0 last:pb-0">リスト項目</div>
<li class="odd:bg-gray-100 even:bg-white">アイテム</li>
```

::: message
`Tailwind CSS`では、バニラなCSSと違って`hover`処理の適用対象に（スマホなどの）タッチデバイスは含まれません。
`active:`を使うことでタッチデバイス向けのインタラクティブを実装できます。
:::

#### 擬似要素
擬似要素は`before:`と`after:`プレフィックスで対応します。
**※対象ユーティリティクラスそれぞれに前置する必要**があります。
```html
<div class="before:content-['*'] before:text-red-500 before:mr-1 relative after:absolute after:content-[''] after:w-full after:h-[2px] after:bg-blue-500 after:bottom-0 after:left-0">
  疑似要素のテキスト
</div>
```

#### [`nth-child`](https://tailwindcss.com/docs/hover-focus-and-other-states#nth-child), [`nth-of-type`](https://tailwindcss.com/docs/hover-focus-and-other-states#nth-of-type)
```html
<ul>
  <!-- 2番目の項目だけ青色背景 -->
  <li class="nth-[2]:bg-blue-200">リスト項目</li> 
  <!-- 3の倍数の項目だけ緑色背景 -->
  <li class="nth-[3n]:bg-green-200">リスト項目</li>
  <!-- [Xn+1]（例：3n+1 の場合 1,4,7,10,…）の項目だけ緑色背景 -->
  <li class="nth-[3n+1]:bg-green-200">リスト項目</li>
  <!-- nth-of-type を使った指定方法 -->
  <li class="nth-of-type-3:bg-green-400 nth-of-type-[3n+1]:bg-green-200">リスト項目</li>
</ul>
```

※あまり複雑なスタイル指定になるようでしたら`@layer`にバニラなCSSとして記述したほうが楽だと思います。

#### [`not()`](https://tailwindcss.com/docs/hover-focus-and-other-states#not)
`not-:`プレフィックスを使用
```html
<!-- 一番先頭の要素以外 -->
<div class="not-first:mt-4">スタイルはあたらない</div>
<div class="not-first:mt-4">スタイル指定対象</div>
<div class="not-first:mt-4">スタイル指定対象</div>
<div class="not-first:mt-4">スタイル指定対象</div>
```

※あまり複雑なスタイル指定になるようでしたら`@layer`にバニラなCSSとして記述したほうが楽だと思います。

または、`カスタム CSS と @apply ディレクティブ`を用いる。
- `@apply`
CSSファイル（`.css`）に`Tailwind CSS`の記法（例：`bg-gray-100`）でスタイルを指定できる機能

```css
/* src/css/app.css */
.not-third:not(:nth-child(3n)) {
  @apply bg-gray-100; /* 例：3番目以外の要素の背景色をグレーにする */
}
```

上記スタイルの適用例
```html
<div class="not-third">要素 1</div>
<div class="not-third">要素 2</div>
<div class="not-third">要素 3</div>
<div class="not-third">要素 4</div>
<div class="not-third">要素 5</div>
```

#### [`:has()`](https://tailwindcss.com/docs/hover-focus-and-other-states#has)
```html
<label
  class="has-checked:bg-indigo-50 has-checked:text-indigo-900 has-checked:ring-indigo-200"
>...
```

上記例には記載ないですが`has-[img]`, `has-[a]`というように要素を指定して使用できます。


#### データ属性と属性セレクタ
属性セレクタは`[]`（角括弧）で表現する。
```html
<details>
  <summary class="cursor-pointer">[open]を持つときのスタイル</summary>
  <div class="group-[[open]]:block hidden">詳細テキスト</div>
</details>

<!-- カスタムデータ属性 -->
<!-- data-[属性名=値]:クラス名 の形式でスタイルを適用 -->
<button data-state="active" class="data-[state=active]:bg-blue-500">アクティブボタン</button>
```

- [カスタムデータ属性（`data-*`）](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes)<br>
```html
<!-- Will apply -->
<div data-active class="border border-gray-300 data-active:border-purple-500">
  <!-- ... -->
</div>
<!-- Will not apply -->
<div class="border border-gray-300 data-active:border-purple-500">
  <!-- ... -->
</div>
```

#### 親子の関係性を構築できる`group`
- `group`
親要素に指定するクラス。これにより、子要素で`group-hover:`が使用可能となる

- `group-hover:`
親要素（`group`クラスを持つ要素）にホバーした時の子要素のスタイルを指定
```html
<div class="flex items-center justify-between group p-3 mb-2 rounded-lg border border-[#eaeaea] shadow-sm cursor-move" >
    <!-- group-hover:opacity-100: 通常は非表示（透明度0）で、親要素にホバーすると表示（透明度100）される -->
    <button class="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">btn</button>
</div>
```

https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-the-descendants-of-a-group

上記ページにおいて **`group`でページ内検索** すると色々な記述方法を知れます。

## `CSS in JS`は避けるべき？
> For new projects, I would not recommend adopting styled-components or most other css-in-js solutions.

記事冒頭にも転記した「新規プロジェクトにおいて`CSS in JS`は推奨されない」という部分ですが、記事内ではRSC（React Server Component）に少し触れていました。

実は、筆者は Next.js（v14, v15）の実務案件（※レンダリングモデルは`SSG`）で`styled-components`を使っていたのですが、サイトの初期表示時の**一瞬だけ**大きくレイアウトが崩れていました。

今回の件で、それら`styled-components`を使っていたものは全て`CSS Modules`へ移行したのですが、移行後は先のような一瞬のレイアウト崩れもなく良好です。

ちなみに、`CSS Modules`を選んだ理由は以下のように公式推奨で一番初めに記載されているためです。

https://nextjs.org/docs/app/building-your-application/styling/css-in-js

> If you want to style Server Components, we recommend using CSS Modules or other solutions that output CSS files, like PostCSS or Tailwind CSS.

https://nextjs.org/docs/app/building-your-application/styling

以下キャプチャは上記ページのものですが、ここでも先頭は`CSS Modules`ですね。
そして、一番最後に`CSS-in-JS`が記載されています……。

![](https://storage.googleapis.com/zenn-user-upload/1ce01ccfa806-20250411.png)

## ありがとう styled-components, よろしく Tailwind CSS
[先の1フレームワークの情報だけを取り上げる](https://nextjs.org/docs/app/building-your-application/styling)のもですが、昨今の React のサーバー側への関心をはじめ、現状ではクライアントサイドで働く`CSS-in-JS`には厳しいものがあるのかもしれません。

React 制作の苦楽を教えてくれて、常に支えてくれた`styled-components`には感謝しかありません。

そして、面倒だと思っていた移行作業も比較的軽く済んだ上に、学習コストもそこまでかからなかった`Tailwind CSS`。
これからよろしくおねがいします！

ここまで読んでいただき、ありがとうございました。

当記事が`styled-components`から`Tailwind CSS`への移行を検討または実施されている方々のお役に立てれば幸いです。