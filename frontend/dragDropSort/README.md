## DragDropSort
- [demo | ver - react,typescript](https://k2webservice.xsrv.jp/r0105/mylibs/dragdropsort/)
- [codepen](https://codepen.io/benjuwan/pen/xxvXGrQ)

DragDropSort（`src/components/dragdropsort`）は、リストをドラッグ&ドロップで任意の順番に並び替えられる（ソート）機能です。<br>※スマホ／タブレットでの挙動がチラついています。

### デフォルトからの変更箇所
- `tsconfig.app.json`<br>
`target`や`lib`の`ESM`のバージョンを変更。`src/hooks/useHandleInputValueSanitize.ts`カスタムフック内の`replaceAll`メソッドを使用できるようにするため。

```diff
{
  "compilerOptions": {
-   "target": "ES2020",
+   "target": "ES2021",
    "useDefineForClassFields": true,
-   "lib": ["ES2020", "DOM", "DOM.Iterable"],
+   "lib": ["ES2021", "DOM", "DOM.Iterable"],
    ...
    ..
    .
}
```

- `vite.config.ts`<br>
`base`の追加（ホスティング先の指定）

```diff
export default defineConfig({
  plugins: [react()],
+ // base: 'r0105/mylibs/'
})
```

### 技術構成
- @eslint/js@9.24.0
- @types/react-dom@18.3.6
- @types/react@18.3.20
- @types/uuid@10.0.0
- @vitejs/plugin-react@4.3.4
- eslint-plugin-react-hooks@5.2.0
- eslint-plugin-react-refresh@0.4.19
- eslint@9.24.0
- globals@15.15.0
- react-dom@18.3.1
- react@18.3.1
- typescript-eslint@8.29.1
- typescript@5.8.3
- uuid@10.0.0
- vite@6.2.5