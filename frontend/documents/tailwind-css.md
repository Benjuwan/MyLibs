# `Tailwind CSS`
- [Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)

## 初め方（`vite`の場合）
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

## リセットCSSについて
`Tailwind`には[`Preflight`](https://tailwindcss.com/docs/preflight)というデフォルトの CSS リセットが組み込まれているので追加でリセット CSS を用意する必要はない。そのため、従来は独自の記述を行っていた`src/index.css`は以下の記述（1行）に変更。
```css
@import "tailwindcss";
```

## デフォルト： `1単位 0.25rem（4px）`
`Tailwind CSS`ではデフォルトで`1単位が 0.25rem（4px）`に相当（＝`1rem は 16px`）

## その他の補足情報
- em値を再現したい場合は、カスタム値`mt-[5em]`を使用するのがよい
  - カスタム値`[]`について<br>
  角括弧`[]`内に任意の値を指定することで`Tailwind CSS`のユーティリティクラスで対応していない値を使用できる。（例：`w-[32%]`, `text-[#f5a623]`, `mt-[16px]`）

### `Tailwind`の標準クラス（一部）
`Tailwind CSS`の標準クラス（ユーティリティクラス）は公式ドキュメントに詳しく載っていますが、大まかに分けると以下のようなカテゴリがあります

> [!NOTE]
> #### プロパティの**値におけるスペースの取り扱い**について
> - 各値の**間は詰めないと働かない**ので注意<br>（`clamp`の例：`w-[clamp(80px,calc(100vw/2),320px)]`）
> - または **`_`（アンダースコア）を用いる** <br>（`box-shadow`の例：`shadow-[0_0_4px_rgba(0,0,0,.45)_inset]`）

#### レイアウト関連
- `container`（コンテナ）
- `block` / `inline-block` / `flex` / `grid` / `hidden`（※`display`プロパティ）
- `w-`（幅: w-1/2, w-full など）
- `h-`（高さ: h-16, h-screen など）
- `min-w-`, `min-h-`, `max-w-`, `max-h-`（最小・最大サイズ）

#### タイポグラフィ
- `text-`（テキストサイズ: `text-sm`, `text-xl` など）
- `font-`（フォント: `font-bold`, `font-serif` など）
- `leading-`（行間{`line-height`}: `leading-tight`, `leading-relaxed`）  
- `tracking-`（文字間隔{`letter-spacing`}: `tracking-wide`, `tracking-tighter`）
- `text-`（色: `text-red-500`, `text-gray-700` など）
  - `no-underline`（`text-decoration: none`）

#### スペーシング
- `m-`（マージン: `m-4`, `mt-2`, `mx-auto` など）
- `p-`（パディング: `p-4`, `py-2`, `px-6` など）

#### ボーダー
- `border-`（ボーダー: `border`, `border-gray-300`, `border-t`, `border-b-[4px]` など）
- `rounded-`（角丸: `rounded-lg`, `rounded-full` など）

#### Flexbox / Grid
- `flex`, `flex-row`, `flex-col`
- `items-center,` `justify-between`, `gap-4`
- `grid-cols-`, `grid-rows-`

#### 背景（`background`）
- `background-color`
```html
<!-- bg-blue-500 → background-color: #3b82f6; -->
<div class="bg-blue-500 text-white p-4">背景色：青</div>
```

- `linear-gradient`
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

- 背景の固定（`background-attachment`）
```html
<!-- bg-fixed   → 背景画像を固定 -->
<!-- bg-scroll  → スクロールと共に背景も動く -->
<div class="bg-fixed bg-[url('/mountain.jpg')] h-screen"></div>
<div class="bg-scroll bg-[url('/ocean.jpg')] h-screen"></div>
```

#### 遷移アニメーション（`transition`）
- `transition`：デフォルトでは`all 150ms ease-out`を適用
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

#### アニメーション（`@keyframes`） | [`animation`](https://tailwindcss.com/docs/animation)
- `@layer utilities`<br>
カスタムの`@keyframes`を定義するには`@layer utilities`を使用する
```css
@layer utilities（など任意の名前を付ける） {
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

- `tailwind.config.js`で設定<br>
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

##### `animation-delay`を適用 
`[]`内にカスタムCSSを直接書くことで適用させる
```html
<!-- [animation-delay:0.5s] → 0.5秒後にフェードイン -->
<div class="animate-fade-in [animation-delay:0.5s]">
  0.5秒後にフェードイン
</div>
```

#### ブレイクポイント（メディアクエリの指定方法）
- `Tailwind CSS`のデフォルトブレイクポイントは以下で、`カスタムメディアクエリ`（`min-[カスタム値]:`, `max-[カスタム値]:`）を使用する方法もある。
  - sm:  640  px以上の画面
  - md:  768  px以上の画面
  - lg:  1024 px以上の画面
  - xl:  1280 px以上の画面
  - 2xl: 1536 px以上の画面

```html
<!-- 通常の画面ではテキストが小さく、lgサイズ（1024px）以上では大きく表示 -->
<div class="text-sm lg:text-lg">テキスト</div>

<!-- スマホでは列、PCでは行に並べる -->
<div class="flex flex-col md:flex-row">...</div>

<!-- カスタムメディアクエリを使用する方法 -->
<div class="min-[1025px]:text-[32px]">カスタムブレイクポイント</div>
<div class="max-[767px]:hidden">モバイルでは非表示</div>
```

#### 擬似クラス・擬似要素・その他セレクタの指定方法
### 擬似クラス
`checked:`,`disabled:`など、ほとんどの擬似クラスは`擬似クラス名:`プレフィックスで対応
```html
<button class="hover:bg-blue-700 focus:ring-2 active:bg-blue-800">ボタン</button>
<div class="first:pt-0 last:pb-0">リスト項目</div>
<li class="odd:bg-gray-100 even:bg-white">アイテム</li>
```

### 擬似要素
擬似要素は`before:`と`after:`プレフィックスで対応（※対象ユーティリティクラスそれぞれに前置する必要あり）
```html
<div class="before:content-['*'] before:text-red-500 before:mr-1 relative after:absolute after:content-[''] after:w-full after:h-[2px] after:bg-blue-500 after:bottom-0 after:left-0">
  疑似要素のテキスト
</div>
```

### `nth-child`, `nth-of-type`
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

### `not()`
`not-{}:`プレフィックスを使用
```html
<!-- 一番先頭の要素以外 -->
<div class="not-first:mt-4">スタイルはあたらない</div>
<div class="not-first:mt-4">スタイル指定対象</div>
<div class="not-first:mt-4">スタイル指定対象</div>
<div class="not-first:mt-4">スタイル指定対象</div>
```

- `:not(:nth-child(3n))`（3番目以外の要素に対して〜）など、複雑な指定は`カスタム CSS と @apply ディレクティブ`を用いる必要がある
```css
/* src/css/app.css */
.not-third:not(:nth-child(3n)) {
  @apply bg-gray-100; /* 例：3番目以外の要素の背景色をグレーにする */
}
```

- 上記スタイルの適用例
```html
<div class="not-third">要素 1</div>
<div class="not-third">要素 2</div>
<div class="not-third">要素 3</div>
<div class="not-third">要素 4</div>
<div class="not-third">要素 5</div>
```

### データ属性と属性セレクタ
属性セレクタは`[]`（角括弧）で表現
```html
<details>
  <summary class="cursor-pointer">[open]を持つときのスタイル</summary>
  <div class="group-[[open]]:block hidden">詳細テキスト</div>
</details>

<!-- カスタムデータ属性 -->
<!-- data-[属性名=値]:クラス名 の形式でスタイルを適用 -->
<button data-state="active" class="data-[state=active]:bg-blue-500">アクティブボタン</button>
```
