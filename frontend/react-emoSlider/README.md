## emoSlider
- [demo | ver - react,typescript](https://k2webservice.xsrv.jp/r0105/mylibs/emoslider/)<br>
【ネタコンポーネント】（個人的に）エモさを感じるスライダー

## Swiperについて
Swiperはv10以降、従来のようなReact Componentsとして扱えなくなってしまった。
- 参考：[Swiper v10からReact Componentsが非推奨になったのでWebコンポーネントを使う](https://zenn.dev/rsugi/articles/9d7479b7e3e27b)

- 以下の手順で`swiper@11.1.14`を利用中
  - Swiperをインストール

  - `index.html`（の`<head>`内）にCDNを記述
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  ```

  - [公式デモページ](https://swiperjs.com/demos)から適用したいSwiperのスタイルを確認してコンポーネント（`src\libs\SwiperLibs.tsx`）に反映

- 注意事項
スライダーの枚数がPC（Mac）では8枚まで、スマホやPC（Win）では5枚まででないとうまく挙動しなくなる。

## デフォルト設定からの変更箇所
- `vite.config.ts`<br>
`base`の追加（ホスティング先の指定）

```diff
export default defineConfig({
  plugins: [react()],
+ // base: 'r0105/mylibs/emoslider'
})
```

## 技術構成
- @eslint/js@9.39.5
- @tailwindcss/vite@4.3.3
- @types/react@19.2.18
- @types/react-dom@19.2.4
- @vitejs/plugin-react@6.0.5
- eslint@9.39.5
- eslint-plugin-react-hooks@5.2.0
- eslint-plugin-react-refresh@0.4.26
- globals@17.11.0
- react@19.2.8
- react-dom@19.2.8
- swiper@14.1.0
- tailwindcss@4.3.3
- typescript@5.6.3
- typescript-eslint@8.67.0
- vite@8.2.1

## 備忘録
- `SyntheticEvent`は各種イベントハンドラーを包含しているので `ChangeEvent`, `drag`, `mouse`など各種イベントハンドラーの型をカバーできる（＝型エラーを防げる）
