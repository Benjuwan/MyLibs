## thePagination
`Next.js`のシンプルで汎用的なページネーションコンポーネント

- [デモサイト](https://k2webservice.xsrv.jp/r0105/the-pagination)<br>
※`next.config.ts`でデプロイ設定

- `src\providers\PagerContextFragment.tsx`<br>
「ページャ数」と「ページに表示するコンテンツデータ数（`posts_per_page`）」のグローバルステートを管理しているファイル
- `src\app\layout.tsx`<br>
上記グローバルステートを読み込んでいる箇所
  - 下層ページにて実装する場合は当該ディレクトリの`layout.tsx`で読み込ませて、かつルートパス（`src\constant\routingpass.ts`）を調整する