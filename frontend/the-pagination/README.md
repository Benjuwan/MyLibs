## thePagination
`Next.js`のシンプルで汎用的なページネーションコンポーネント

- [デモサイト](https://k2webservice.xsrv.jp/r0105/the-pagination)<br>
※`next.config.ts`でデプロイ設定

- `src\providers\PagerContextFragment.tsx`<br>
「ページャ数」と「ページに表示するコンテンツデータ数（`posts_per_page`）」のグローバルステートを管理しているファイル
- `src\app\layout.tsx`<br>
上記グローバルステートを読み込んでいる箇所
  - 下層ページにて実装する場合は当該ディレクトリの`layout.tsx`で読み込ませて、かつルートパス（`src\constant\routingpass.ts`）を調整する

## 技術構成
- @eslint/eslintrc@3.3.3
- @tailwindcss/postcss@4.1.18
- @types/node@25.0.2
- @types/react-dom@19.2.3
- @types/react@19.2.7
- eslint-config-next@16.0.10
- eslint@9.39.2
- next@16.0.10
- react-dom@19.2.3
- react@19.2.3
- tailwindcss@4.1.18
