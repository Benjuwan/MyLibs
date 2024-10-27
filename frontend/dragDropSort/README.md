## DragDropSort
- [codepen](https://codepen.io/benjuwan/pen/xxvXGrQ)<br>

DragDropSort（`src/components/dragdropsort`）は、リストをドラッグ&ドロップで任意の順番に並び替えられる（ソート）機能です。

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