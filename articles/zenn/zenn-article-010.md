---
title: "useDeferredValue を使ってUXを向上"
emoji: "☕"
type: "tech"
topics:
  - "nextjs"
  - "react"
  - "typescript"
  - "ux"
published: true
published_at: "2024-07-09 13:49"
---

## はじめに
今回、`Next.js`（v14 AppRouter）でのフォーム制作の話になりますが`React`での制作にも適用できると思います。

フォーム入力に応じてリストにフィルターをかける実装をした時に、入力文字の削除にタイムラグを感じる場面がありました。
具体的には、入力した文字列を一字ずつ削除していった際に**入力フォーム欄の文字列が微妙に遅れて削除（または2文字一挙に削除）される**といった状況です。

近似体験としては、ネット環境が悪い状況で重たいアプリ（例：Adobe Illustrator, Photoshop, Indesign など）を開いて、文字入力・削除した際のラグってる感じでしょうか。

正直UXが良くないので解消するために今回`useDeferredValue`を使用しました。
実装もシンプルで簡単でしたし、このフックを使うと無事に解消できたので情報共有したいと思います。

::: message
`useDeferredValue`とは、あらかじめ任意の`state`更新における緊急性をマークしておくことで、緊急性の低い更新を必要に応じて遅らせることができる機能です。
使用時は適用するコンポーネントをメモ化して依存配列に遅延する値を入れる必要があります。

大雑把に咀嚼すると**特定の挙動をあえて遅らせたい**場合に使用するフックです。
:::

## フォーム入力に応じてリストをフィルター
今回解消したかった当該コード（フォーム入力に応じてリストにフィルターをかける実装）は以下になります。

```ts
"use client"

import { ChangeEvent, memo, useEffect, useState } from "react";
import { useAtom } from "jotai";

function ViewLists() {
    const [listsItems, setListsItems] = useAtom(listsItemsAtom);
    const [keyword, setKeyword] = useState<string>(keyword ?? '');
    const [lists, setLists] = useState<listsItemsType[]>([]);

    return (
        <>
            <label>
                <span>キーワードを入力してください。</span>
                <input type="text" value={keyword}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                        filterData(
                                e.target.value,
                                listsItems,
                                setKeyword,
                                setLists
                        )} />
                </label>
                <FilterLists props={{
                    keyword: keyword,
                    lists: lists,
                    listsItems: listsItems
                }} />
        </>
    );
}

export default memo(ViewLists);
```

`input`の`onInput`イベントハンドラーで`filterData`を実行し、入力文字に基づいたリストを生成（フィルター）しています。
そしてフィルターされた`lists`の中身は`FilterLists`コンポーネントにて表示される実装です。

この実装だと挙動は問題ないのですが冒頭で説明した通り、入力時（削除時）に入力欄の文字（`input`の`value`）更新にタイムラグが生じました。

## `useDeferredValue`を使用した改良コード

```diff
- import { ChangeEvent, memo, useEffect, useState } from "react";
+ import { ChangeEvent, memo, useDeferredValue, useEffect, useMemo, useState } from "react";

function ViewLists() {
    const [listsItems, setListsItems] = useAtom(listsItemsAtom);
    const [keyword, setKeyword] = useState<string>(keyword ?? '');
    const [lists, setLists] = useState<listsItemsType[]>([]);

+   const deferedLists: listsItemsType[] = useDeferredValue(lists);

+   const deferedFilterLists = useMemo(
+ 　　　() => <FilterLists props={{
+ 　　　  keyword: keyword,
+ 　　　  lists: deferedLists,
+ 　　　  listsItems: listsItems
+ 　　　}} />,
+ 　　　// eslint-disable-next-line react-hooks/exhaustive-deps
+ 　　　[deferedLists, keyword]
+   );

    return (
        <>
            <label>
                <span>キーワードを入力してください。</span>
                // 入力欄部分は省略
                </label>
-               <FilterLists props={{
-　　　　　　　　　keyword: keyword,
-　　　　　　　　　lists: lists,
-　　　　　　　　　listsItems: listsItems
-              }} />
+              {deferedFilterLists}
        </>
    );
}

export default memo(ViewLists);
```

あらかじめ任意の`state`更新における緊急性をマークし、緊急性の低い更新を必要に応じて遅らせることができるのが`useDeferredValue`でしたね。

今回、緊急性の低い更新に該当する`state`は`lists`です。
以下のように`useDeferredValue`に`lists`を指定します。

```ts
const deferedLists: listsItemsType[] = useDeferredValue(lists);
```

`deferedLists`を使用するには適用するコンポーネントをメモ化して依存配列に遅延する値を入れる必要があります。
今回、適用するコンポーネントは`FilterLists`で、それをメモ化して依存配列に遅延する値は`deferedLists`です。
※入力に応じた処理のため`keyword`も依存配列に指定しています。

```ts
const deferedFilterLists = useMemo(
    () => <FilterLists props={{
        keyword: keyword,
        lists: deferedLists,
        listsItems: listsItems
    }} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deferedLists, keyword]
);
```

この実装によって、入力欄の文字（`input`の`value`）を更新するためのレンダリングが優先されてリスト情報（`lists`）の更新のレンダリングが遅延されるようになりました。

最後に`JSX`内に`deferedFilterLists`を記述して反映させれば完了です。
```diff
- <FilterLists props={{
- 　　　　keyword: keyword,
- 　　　　lists: lists,
- 　　　　listsItems: listsItems
- }} />
+ {deferedFilterLists}
```

これで入力の度に発生していた微妙なタイムラグは無事に解消されました！

## まとめ
フォーム入力による操作でタイムラグを感じるときは`useDeferredValue`を検討してみてください。

何か間違いや他の良い方法をご存知の方は、お手数ですがコメント欄などで指摘いただけますと幸いです。
ここまで読んでいただき、ありがとうございました。

## 参考情報
https://booth.pm/ja/items/2367992
