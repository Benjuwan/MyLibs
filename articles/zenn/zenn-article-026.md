---
title: "ハイドレーションエラーの原因は（デプロイ先の）タイムゾーンかも？new Dateなど日付データを扱う際の注意"
emoji: "⏲️"
type: "tech"
topics:
  - "nextjs"
  - "react"
  - "error"
  - "debug"
  - "date"
published: true
published_at: "2025-10-28 12:49"
---

## はじめに
これは筆者が Next.js 16 で開発した社内向け会議室予約システムで実際に発生したトラブルの話です。
以下のような技術構成になっています。

```
@eslint/eslintrc@3.3.1
@prisma/client@6.18.0
@types/node@24.9.1
@types/react-dom@19.2.2
@types/react@19.2.2
@types/uuid@10.0.0
eslint-config-next@16.0.0
eslint@9.38.0
jotai@2.15.0
next@16.0.0
prisma@6.18.0
react-dom@19.2.0
react@19.2.0
typescript@5.9.3
uuid@13.0.0
```

デプロイ先は vercel です。

`date-fns`や`dayjs`, `date-fns-tz`, `luxon`など有名どころを使っておらず**日付データ関連の扱いは自作**しています。

**本記事の結論としては「餅は餅屋に」というような意見になる**のですが、
自作することで遭遇する壁もまたあり、その壁を登ってこそ見える景色（知れる知識）があるのでそういったことを書いていこうと思います。

なんかカッコつけていますが、生産性やコストなどを加味すると間違いなく「餅は餅屋に」の方が最適解です。

## 本環境で発生したハイドレーションエラー
::: message
- ハイドレーションエラーについて
簡潔に説明すると、「Next.jsやReactによるレンダリングにおいて、サーバサイドである程度生成したページ内容（SSR）と、それを受け取ってクライアントサイドで完成系ページ（CSR）にする過程で、**SSRの内容とCSRの内容とで齟齬が発生している**」ことへの指摘となります。
:::

~~そもそも、このハイドレーションエラーどこで発生しているのか探すの大変なんですけどね~~

今回、このハイドレーションエラーが発生しているのは以下キャプチャの日付取得及び表示部分でした。
しかも**0時から9時ごろまでしか発生しない**という、人にやさしくない時間帯限定のハイドレーションエラーだったのです。

![](https://storage.googleapis.com/zenn-user-upload/4ad1fad146ae-20251028.png)

この部分はもともと、クライアントコンポーネントにて`useEffect`と`useState`を用いてデータ取得からレンダリングを行うようにしていました。
しかしNext.js16へのアップグレードに伴うESLintの調整によって「不要なEffect処理である」というLintの警告が出たのでリファクタリングすることにしました。

実は、以前にも今回発生したハイドレーションエラーが起きていて、その時に上記の実装を行って対処していたのです。

今回、Lintの警告で根本的解決に臨もうとリファクタリングを進める中で本記事の主題である「日付データを扱う際は（デプロイ先の）タイムゾーンに注意」を学びました。

### 原因
そもそもは筆者の`new Date`に対する理解不足です。

[Date() コンストラクター](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date)ページの以下キャプチャにあるように、時間の扱いに関してローカルのタイムゾーンに依存します。

![](https://storage.googleapis.com/zenn-user-upload/ad95aff2336b-20251028.png)

筆者の **「開発環境では問題なく、本環境でのみ発生する」というのは「開発環境＝日本、本環境（アメリカ）」** だったためです。

### 対応方法
#### サーバーコンポーネントで日付データを取得して子（クライアントコンポーネント）に渡す
- `app/page.tsx`
```ts
// デプロイ先のタイムゾーン（例：UTC）に依存せず、明示的に「日本時間(Asia/Tokyo)の現在時刻」を取得する
const jst: Date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
const theToday: number = jst.getDate();

...
..
.
<Rooms theToday={theToday} />
```

- `Rooms.tsx`
```ts
// タイムテーブルの表示制御に利用するための「今日・本日」の可変値
const [ctrlMultiTimeTable, setCtrlMultiTimeTable] = useState<number>(theToday);
```

つまり、SSR時とCSR時で`new Date()`が異なるタイムゾーンを基準にしていたため、同じ日付のはずが数時間のズレ（例：JSTで10/28だがUTCでは10/27）が発生し、レンダリング内容が一致しなかったのがエラーの発生原因となります。

今回試していないですが「タイムゾーン設定した日付データをクライアントコンポーネントで生成・取り扱う」でもいけるかもしれません。
```tsx
// Rooms.tsx

const jst: Date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
const theToday: number = jst.getDate();

// タイムテーブルの表示制御に利用するための「今日・本日」の可変値
const [ctrlMultiTimeTable, setCtrlMultiTimeTable] = useState<number>(theToday);
```

ただし、結局クライアントコンポーネントで取得しているので場合によってはSSR内容との差分が生まれてしまうかもしれません。

## まとめ
既に書きましたが、今回のハイドレーションエラーの原因は「筆者の`new Date`に対する理解不足」と「ベストプラクティスなライブラリを使っていない（餅は餅屋）」ということに尽きます。

しかし、自作することで技術や言語、仕組みに関する理解も深まるので「遠まわりなように見えて実は」という考え方もできるかもしれません。

Next.jsのようにSSRを行う環境では、開発マシンとデプロイ先のタイムゾーン差が思わぬハイドレーションエラーを引き起こすことがありますので、「環境をまたぐ日時処理」には注意したいところです。

ここまで読んでいただき、ありがとうございました。

### おまけ： `useState`の遅延初期化関数を知った話
今回の対応では使用せずに済みましたが、対応方法を調べる中で`useState`の遅延初期化関数を初めて知りました。

https://qiita.com/Taira0222/items/25ad40b82f178963e37b

```
// ❌ NG：毎回レンダーのたびに関数が呼ばれる
const [count, setCount] = useState(expensiveComputation());

// ✅ OK：Reactが初回のみ関数を呼ぶ
const [count, setCount] = useState(() => expensiveComputation());
```

この機能は、初期化にコストがかかる場合に関数を引数に渡すことで、その関数の実行を初回レンダリング時に1度だけ実施する機能です。
これにより、コンポーネントが再レンダリングされるたびに高コストな計算が実行されるのを防ぎ、パフォーマンスを改善できます。

今回のケースで言えば「今日・本日の日付データ取得は初回レンダリング時のみで良い」というものです。