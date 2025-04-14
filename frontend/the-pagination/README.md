## thePagination
`Next.js`のシンプルで汎用的なページネーションコンポーネント

- `src\providers\PagerContextFragment.tsx`<br>
「ページャ数」と「ページに表示するコンテンツデータ数（`posts_per_page`）」のグローバルステートを管理しているファイル
- `src\app\layout.tsx`<br>
上記グローバルステートを読み込んでいる箇所
  - 下層ページにて実装する場合は当該ディレクトリの`layout.tsx`で読み込ませて、かつルートパス（`src\constant\routingpass.ts`）を調整する

## 技術構成
- @eslint/eslintrc@3.3.1
- @tailwindcss/postcss@4.1.3
- @types/node@20.17.30
- @types/react-dom@19.1.2
- @types/react@19.1.1
- eslint-config-next@15.3.0
- eslint@9.24.0
- next@15.3.0
- react-dom@19.1.0
- react@19.1.0
- tailwindcss@4.1.3
- typescript@5.8.3