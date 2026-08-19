---
title: "【TypeScript】ユーザー定義型ガードを使って undefined を省いた配列操作を行う"
emoji: "🛡️"
type: "tech"
topics:
  - "nextjs"
  - "react"
  - "typescript"
  - "filter"
published: true
published_at: "2024-09-05 12:40"
---

## はじめに
本記事の結論を先に書いておくと「特定のオブジェクト（配列）の`filter`操作時に`undefined`を省いた形にしたい場合は[ユーザー定義型ガード](https://typescriptbook.jp/reference/functions/type-guard-functions)を使って明示的に処理を記述（型注釈）したほうが安全」という話です。

https://typescriptbook.jp/reference/functions/type-guard-functions

ユーザー定義型ガードについては上記が詳しいので、ここでは端的に説明します。
ユーザー定義型ガードは「`引数名 is 型`という記述で、（`filter`操作など処理の）返り値が`true`の場合「引数名に指定した型」として扱う」という仕組みです。
型アサーション（型推論の上書き）の[`as`](https://typescriptbook.jp/reference/values-types-variables/type-assertion-as)や何でもありの`any`と同じく、ユーザー定義型ガードもまたユーザーが独自で型定義できるため`TypeScript`の型安全を破壊してしまうリスクのある機能です。しかし、それらの中でもまだベターな選択として挙げられるのがユーザー定義型ガードとなります。

今回、本記事を書くきっかけになったのは、実際にユーザー定義型ガードを用いたことでビルド時のコンパイルエラーを解消できた実体験によります。

## 筆者の失敗コードと改修コード
`Next.js`,`TypeScript`で制作していて、①カテゴリー名を加工した形でソートし、②加工とソートが済んだ文字列を更に加工して、③最終的に文字列型配列を返す配列操作を行っていました。

上記内容の改修コードが以下となります。コンパイルエラーをクリアした形のものです。
今回本記事で説明する対象部分はコード内の`.filter((fetchDataItem): fetchDataItem is string => fetchDataItem !== undefined)`という部分になります。

```ts
const filteredCategories: string[] = useMemo(
    () => [...contentData].sort((aheadElm, behindElm) => {
       /* 001-cat, 002-cat_hobby などカテゴリースラッグに指定した数値でのソート */
       const aheadElmNumber: number = parseInt(aheadElm.category_slug_term.split('-')[0]);
       const behindElmNumber: number = parseInt(behindElm.category_slug_term.split('-')[0]);
       return aheadElmNumber - behindElmNumber;
    }).map(fetchDataItem => {
       return [fetchDataItem.category, fetchDataItem.category_slug_term].join(','); // join で一つの文字列配列（string[]）としてこのあとに new Set の重複排除を行う
    }).filter((fetchDataItem): fetchDataItem is string => fetchDataItem !== undefined),
    [contentData]
);
```

- 失敗コード
失敗コードは以下の部分だけが異なります。
```ts
// ここまで同じ
.filter(fetchDataItem => fetchDataItem !== undefined),

// 改修コードでは以下の記述
.filter((fetchDataItem): fetchDataItem is string => fetchDataItem !== undefined)
```
**`fetchDataItem`が`undefined`でないものを返すのが条件**です。

最終的な結果となる、文字列配列の変数は`const filteredCategories: string[]`という記述にしていたのですが、失敗コードでは`const filteredCategories: (string | undefined)[]`という型（記述）でないとおかしいというコンパイルエラーが出ていました。

改修コードでは、冒頭で説明したユーザー定義型ガードの働きから、先述の条件が`true`なら`fetchDataItem`を文字列型として扱います。
こうして処理を通じて**明示的に型を指定することで先程のコンパイルエラーを無事回避**できました。

本記事で伝えたい本筋はここまです。
以降は筆者の失敗例を交えた経験談になるので興味のある方は進んでください。

## 失敗コードで発生したコンパイルエラー
ビルド時に以下の内容が出力されました。

```
Type '(string | undefined)[]' is not assignable to type 'string[]'.
Type 'string | undefined' is not assignable to type 'string'.
Type 'undefined' is not assignable to type 'string'.
```

筆者は`const filteredCategories: string[]`という記述にしていたのですが、
`const filteredCategories: (string | undefined)[]`という型でないとおかしいと指摘されています。

実は、他の制作物でも失敗コードの書き方をしていたのですが、それらでは特にコンパイルエラーが出ていなかった（今回初めて指摘された）ので少し驚きました。
`npm run lint`をして問題がなかったので、なぜビルド時にコンパイルエラーが出る？とも思ったのです。

::: message
恥ずかしながら筆者は Linter が諸々全てのチェックを行ってくれると思っていました。[設定によっては可能](https://typescriptbook.jp/tutorials/eslint#typescript-eslint%E3%82%92%E5%B0%8E%E5%85%A5%E3%81%99%E3%82%8B)なのでしょうが、筆者は`Next.js`のインストール時のデフォルトを使用していました。`ChatGPT4.0`に聞くと以下の回答を得ました。
> Linter はコードの文法や構文的な問題をチェックしますが、TypeScript の型チェックとは異なります
:::

またこちらも不思議なことで原因は未だに分かっていないのですが、コーディング中に上記部分に関する型チェックエラー（対象箇所に波線が表示されるアレ）は出なかったのです。
※もし何かご存じの方はお教えいただきますとありがたく存じます。

## 改修コードに至る経緯
ビルド時にコンパイルエラーが出てビルドできない状況（進次郎構文）だったので、まずは指摘された通り`const filteredCategories: (string | undefined)[]`という記述に変更してコード改修に乗り出しました。
結局、コードが余計に複雑になってうまくいきそうになかったので一旦`ChatGPT4.0`に聞くと、先程のユーザー定義型ガードの記述を提案されました。

ちょうどいま[ブルーベリー本](https://www.amazon.co.jp/%E3%83%97%E3%83%AD%E3%82%92%E7%9B%AE%E6%8C%87%E3%81%99%E4%BA%BA%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AETypeScript%E5%85%A5%E9%96%80-%E5%AE%89%E5%85%A8%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9%E3%81%8B%E3%82%89%E9%AB%98%E5%BA%A6%E3%81%AA%E5%9E%8B%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%E3%81%BE%E3%81%A7-Software-Design-plus/dp/4297127474/ref=sr_1_1_sspa?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=2POB14OWQDKYW&keywords=typescript&qid=1670118355&sprefix=typescript%2Caps%2C295&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExNlNOMDBUR1QyNVpXJmVuY3J5cHRlZElkPUEwMDI1NDM5MjFDMFRRRFZSTDE3TCZlbmNyeXB0ZWRBZElkPUE3OUw5OFpENDAwRE0md2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl)を読んでいて「そういえば、この`is~~`って記述、本で見たなぁ」と。

タイムリーな出来事にラッキーと感謝しつつ、やはりインプットからアウトプットすることで知識が身につく実感を得ました。
特にエラーを通じて得た実体験だとより記憶に残る印象があります。

## まとめ
ユーザーが独自の型操作を行いたい場合にユーザー定義型ガードが推奨されている理由が少し理解できました。
（`any`は一旦置いておいて）`as`のように簡潔（強引）に型を上書きするのではなく、ユーザー定義型ガードでは「条件を設けて`true`の場合に指定した型として扱う」という仕様なので、一見コードが冗長になりそうですが「処理を通じて型定義の理由や経緯を理解できるので型の安全性や保守性も高まりそう」だと感じました。

ちなみに、今回は筆者の実体験として配列操作におけるユーザー定義型ガードの話になりましたが、当然ユーザー定義型ガードは上記のようなユースケースだけではないと思います。

この記事がどなたかの参考になりますと嬉しいです。
間違いや指摘がありましたらお教えいただきますとありがたく存じます！