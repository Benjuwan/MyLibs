## DragDropSort
- [demo | ver - react,typescript](https://k2webservice.xsrv.jp/r0105/mylibs/dragdropsort/)
- [codepen](https://codepen.io/benjuwan/pen/xxvXGrQ)

DragDropSort（`src/components/dragdropsort`）は、リストをドラッグ&ドロップで任意の順番に並び替えられる（ソート）機能です。<br>※スマホ／タブレットでの挙動がチラついています。

### デフォルトからの変更箇所
- `vite.config.ts`<br>
`base`の追加（ホスティング先の指定）

```diff
export default defineConfig({
  plugins: [react()],
+ // base: 'r0105/mylibs/'
})
```

### 技術構成
- @eslint/js@9.39.5
- @types/react@19.2.18
- @types/react-dom@19.2.4
- @types/uuid@11.0.0
- @vitejs/plugin-react@6.0.5
- eslint@9.39.5
- eslint-plugin-react@7.37.5
- eslint-plugin-react-hooks@7.1.1
- eslint-plugin-react-refresh@0.4.26
- globals@17.11.0
- react@19.2.8
- react-dom@19.2.8
- typescript@5.9.3
- typescript-eslint@8.67.0
- uuid@14.0.1
- vite@8.2.1


## セキュリティに関する特記事項
本プロジェクトは、脆弱性対応のために `package.json` の `overrides` 機能を用いて、以下のライブラリのバージョンを強制的にアップデートしています。
- `brace-expansion`: `^2.0.1`
