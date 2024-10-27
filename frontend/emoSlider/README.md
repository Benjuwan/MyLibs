## emoSlider

【ネタコンポーネント】（個人的に）エモさを感じるスライダー

## Swiperについて
Swiperはv10以降、従来のようなReact Componentsとして扱えなくなってしまった。
- 参考：[Swiper v10からReact Componentsが非推奨になったのでWebコンポーネントを使う](https://zenn.dev/rsugi/articles/9d7479b7e3e27b)

- 以下の手順で`swiper@11.1.14`を利用中
  - Swiperをインストール

  - `index.html`（の`<head>`内）にCDNを記述z
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  ```

  - [公式デモページ](https://swiperjs.com/demos)から適用したいSwiperのスタイルを確認してコンポーネント（`src\libs\SwiperLibs.tsx`）に反映（※今回は`styled-components`を使用）

## 技術構成
- @eslint/js@9.13.0
- @types/react-dom@18.3.1
- @types/react@18.3.12
- @vitejs/plugin-react@4.3.3
- eslint-plugin-react-hooks@5.0.0
- eslint-plugin-react-refresh@0.4.14
- eslint@9.13.0
- globals@15.11.0
- react-dom@18.3.1
- react@18.3.1
- styled-components@6.1.13
- swiper@11.1.14
- typescript-eslint@8.11.0
- typescript@5.6.3
- vite@5.4.10

## 備忘録
- `SyntheticEvent`は各種イベントハンドラーを包含しているので `ChangeEvent`, `drag`, `mouse`など各種イベントハンドラーの型をカバーできる（＝型エラーを防げる）