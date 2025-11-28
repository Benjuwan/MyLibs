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
- @eslint/js@9.39.1
- @types/react-dom@19.2.3
- @types/react@19.2.7
- @types/uuid@10.0.0
- @vitejs/plugin-react@5.1.1
- eslint-plugin-react-hooks@7.0.1
- eslint-plugin-react-refresh@0.4.24
- eslint-plugin-react@7.37.5
- eslint@9.39.1
- globals@16.5.0
- react-dom@19.2.0
- react@19.2.0
- typescript-eslint@8.48.0
- typescript@5.9.3
- uuid@13.0.0
- vite@7.2.4
