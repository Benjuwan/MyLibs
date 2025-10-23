## theCalendar
- [デモサイト](https://k2webservice.xsrv.jp/r0105/mylibs/calendar/)
- カレンダー（簡易なスケジュール管理）<br />
各日付にある`［+アイコン］`を押して表示される登録フォームから当該日のスケジュール（予定内容と開始・終了時間）を設定できます。

> [!NOTE]
> `src/index.css`で一部の特定クラスの処理やスタイリングを記述しています。

## 技術構成
- @eslint/js@9.38.0
- @tailwindcss/vite@4.1.15
- @types/react-dom@19.2.2
- @types/react@19.2.2
- @vitejs/plugin-react@4.7.0
- eslint-plugin-react-hooks@5.2.0
- eslint-plugin-react-refresh@0.4.24
- eslint@9.38.0
- globals@15.15.0
- jotai@2.15.0
- react-dom@19.2.0
- react@19.2.0
- tailwindcss@4.1.15
- typescript-eslint@8.46.2
- typescript@5.7.3
- uuid@11.1.0
- vite@6.4.1

## build する時に必要な調整
- `vite.config.ts`
```diff
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
+ base: 'r0105/mylibs/calendar'
})
```