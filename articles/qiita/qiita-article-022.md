---
title: Next.js サーバーアクションを使ってみる【国交省 不動産情報ライブラリ】
tags: Next.js ServerActions React Vercel API
author: benjuwan
slide: false
---
## はじめに
今回、`Next.js`のサーバーアクションを使ったサイトを制作しました。筆者は実際に使用するまで「クライアント側からサーバー側の関数を呼び出して実行できる」ということに「……ん？？？」といった感じで中々イメージできませんでした。
今回の記事を通して、筆者と似たような感覚の方々へのサーバーアクション理解の一助となれれば幸いです。

今回作ったものは「全国各地の不動産情報のデータを取得・閲覧できるサイト」になります。

https://next-realestate-api.vercel.app/

- 技術スタック（一部）
    - types/node@20.12.7
    - @types/react@18.2.79
    - next@14.2.3
    - react-dom@18.2.0
    - react@18.2.0
    - recharts@2.12.6
    - styled-components@6.1.8
    - typescript@5.4.5

タイトルにあるように『国土交通省』の[【不動産情報ライブラリ】](https://www.reinfolib.mlit.go.jp/)というwebサイトからAPIを発行してもらって全国各地の不動産情報のデータを取得しています。

実は以前`React`で同機能のサイトを作って記事にしていました。

https://qiita.com/benjuwan/items/4a3207fb9fc5fddba9d4

ですので今回制作したものは、その時に作った`React`→`Next.js`へのリプレースとなります。

## `Next.js`サーバーアクションについて

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

> Client Components can only import actions that use the module-level "use server" directive.
To call a Server Action in a Client Component, create a new file and add the "use server" directive at the top of it. All functions within the file will be marked as **Server Actions that can be reused in both Client and Server Components**:
> クライアントコンポーネントは、モジュールレベルの 「use server」 ディレクティブを使用するアクションのみをインポートできます。
クライアントコンポーネントでサーバーアクションを呼び出すには、新規ファイルを作成し、先頭に 「use server」 ディレクティブを追加します。ファイル内のすべての関数は、**クライアントコンポーネントとサーバーコンポーネントの両方で再利用できるサーバーアクション**としてマークされます：

冒頭で軽く触れましたが「クライアント側からサーバー側の関数を呼び出して実行する」ことができます。もちろん、それだけではありませんが本記事では上記の部分を中心に話を進めていきます。

関心のある方は先ほどの公式ドキュメントをはじめ、こちらの記事に分かりやすく詳細が書かれていたのでどうぞ。

https://zenn.dev/rgbkids/articles/c983df12cfa87d

## 追記情報
- 2024/05/16

> 勘違いされやすいのがServer Actionsはサーバー側でActionを実行する機能のため、RSC内部ではもちろん、クライアント側のコンポーネントからもServer Actionsを実行することができます。
> Sever Actionsで定義された処理は内部的に、$ACTION_ID_が付与された上でアクションリストに登録されて実行可能になるようになっています。そのためRSCからもCC（クライアントコンポーネント）からもServer Actionで定義された処理は一律にサーバー側の実行可能処理として扱われ、クライアント側からServerActionの実態は参照できない形になっています。

https://zenn.dev/mybest_dev/articles/f90fe006aaf24d

クライアント側からサーバーアクションの実態は参照できないそうなので環境変数とか使って値を秘匿する必要もないかもですね（間違っていたらすみません）

## `React`→`Next.js`の経緯
そもそも何故`React`→`Next.js`にリプレースしたのか説明すると、[以前使っていたAPI（土地総合情報システム）](https://www.land.mlit.go.jp/webland/api.html)が廃止（正確には【不動産情報ライブラリ】に統合）されて使えなくなったことがきっかけです。

当初、筆者は「ほなら新しいサイトのAPIの書き方に変えたらええだけか」程度に思っていたのですが、当該サイトの【不動産情報ライブラリ】では**APIの申請が必要**でした。
ちなみに、申請には理由が必要です。筆者は普通に「全国各地の不動産情報を閲覧できるサイト制作のため」としました。

::: note info
今はどうか分かりませんが筆者が申請した時は混みあっていたようで3～5日かかるとされていました。実際は2日程度で取得できたと記憶しています。
:::

とりあえず指示通りAPIの申請を行い無事に取得。

この時はリプレースなんて全く考えておらず、先に触れたようにAPIの書き換え程度で済むと思っていました。

実際に作業に取り掛かっていきまして、まずは【不動産情報ライブラリ】の[「API操作説明」](https://www.reinfolib.mlit.go.jp/help/apiManual/#titleApi3)の記述に則って`headers`を設けた以下のようなデータフェッチに書き換えました。

```ts
useEffect(()=>{
    const fetchRealEstateData = async () => {
        const response = await fetch(`https://www.reinfolib.mlit.go.jp/ex-api/external/XIT002?area=${prefCode}`, {
            headers: {
                "Ocp-Apim-Subscription-Key": API_KEY,
            },
        });
        const resObj: FetchApiData = await response.json();
        setRealEstateData((_prevRealEstateData) => resObj);
    }
    fetchRealEstateData();
}, []);
```

そして画面を確認すると何も反映されておらず、ログを見ると`CORS`のエラーが出ていました。
「不動産情報ライブラリのあるサーバーで実行しているわけではないからかなぁ～」とか思いつつも、「自分の記述がどこか間違えているのかもしれない」と色々試したのですが（問題は当然そんなことではないので）`CORS`のエラーが出続け、生成AIに尋ねてみることに。

すると以下の回答を得ました。
> サーバーサイドでのデータフェッチ: クライアント側で直接外部APIを呼び出すと、CORSの制約などに遭遇することがありますが、Next.jsのAPIルートを使用することで、サーバーサイドで外部APIを呼び出し、その結果をクライアントに返すことができます。

ここで（愚かにも）ようやく`CORS`を意識し、「え？`Next.js`に作り替えなあかんの？~~めんどくさ~~」と思いながらも、せっかくAPIも申請したし勉強がてら作り替えようと思った次第です。

以下から具体的な制作の話に入っていきます。

## クライアントコンポーネントではやはり`CORS`
「`Next.js`ならもしかして」という謎の淡い期待から一先ずクライアントコンポーネントでデータフェッチしてみることにしました。

![スクリーンショット 2024-05-11 101634.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e2acdb51-9574-cda4-d01a-630f51318cac.png)

当たり前ですが、当たり前の結果になりましたね。
潔くサーバーサイドでごにょごにょするようにします。

なお、本記事で紹介したサイトでは【不動産情報ライブラリ】から取得した不動産情報を以下の方法で表示・閲覧できるようにしています。

- ページ送りで一覧表示・閲覧
- 地区や不動産種別のフィルター、取引価格でのソートによる一覧表示・閲覧
- 指定した市区町村と年、期間に準拠した取引価格のリスト及びグラフ表示・閲覧

`React`verの時は上記機能の切り分けを基本的には、各種コンポーネントとデータフェッチ用の各種カスタムフックを用意して行っていました。
今回の`Next.js`ではファイルシステムベースルーティングなので素直に`pager`,`filter`,`compare`でディレクトリを分けて各ページを設けました。

## `on***`イベントハンドラや`effect hook`でサーバーアクションを実行
`onSubmit`や`onChange`、`onInput`といったイベントハンドラ関数はクライアントサイドでしか実行できません。
当初、筆者は公式ドキュメントの以下の部分を見て不適切な書き方をしていました。

```js
// Server Component
export default function Page() {
  // Server Action
  async function create() {
    'use server'
 
    // ここにデータフェッチの記述を書いて
  }
 
  return (
    // select の onChange イベントで上記 Server Action を実行する
  )
}
```

しかし筆者が試したこの不適切な方法では`onChange`イベントを機能させるために`use client`の記述が必要となり、クライアントコンポーネントにすると同ファイルに書いたサーバーアクションを実行できない状況になりました。

::: note warn
筆者の知識不足や書き方がおかしかっただけで、もしかすると実行可能なのかもしれません。何かお気づきの方はコメント欄などでご指摘いただけますと嬉しいです。
:::

そこでサーバーアクションをエクスポートする方法を採りました。

- `getSelectElValueCityCode.ts`
    選択した都道府県の市区町村リストを取得
    ![スクリーンショット 2024-05-12 100934.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/92d4ccc8-1bb4-ff9c-4bc5-8c1ee7054649.png)
```ts
// getSelectElValueCityCode.ts
"use server";

import { CityAry, FetchCityData } from "../ts/cityDataAryEls";

export async function get_SelectElValue_CityCode(prefCode: string): Promise<CityAry[] | undefined> {
    const API_KEY: string = process.env.REINFOLIB_API_KEY!;

    const response = await fetch(`https://www.reinfolib.mlit.go.jp/ex-api/external/XIT002?area=${prefCode}`, {
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY,
        },
    });

    const resObj: FetchCityData = await response.json();

    try {
        if (resObj.message) {
            throw new Error(`fetch failed or no Results：${resObj.message}`);
        }

        return resObj.data;
    } catch (error) {
        console.error('error occurred - get_SelectElValue_CityCode.ts', error);
    }
}
```

- `SelectPrefCities.tsx`
    `getSelectElValueCityCode.ts`を実行するクライアントコンポーネント
```ts
/* SelectPrefCities.tsx はクライアントコンポーネントですが、親コンポーネントで "use client" を記述しているのでここでは明記しません */

import selectElsStyles from "../../styles/selectEls.module.css";
import { GetFetchEachCode } from "@/app/providers/filter/GetFetchEachCode";
import React, { useContext, useEffect, useState, ChangeEvent, memo } from 'react';
import { CityAry } from "@/app/ts/cityDataAryEls";
import { prefcodeData } from "@/app/components/layout/prefcodeData";

/* サーバーアクション */
import { get_SelectElValue_CityCode } from "../../server-action/getSelectElValueCityCode";

function SelectPrefCities() {
    const { isGetFetchPrefCode, setGetFetchPrefCode, setGetFetchCityCode } = useContext(GetFetchEachCode);

    const [cities, setCities] = useState<CityAry[]>([]);

    useEffect(() => {
        if (isGetFetchPrefCode) {
            const fetchCityCode = async () => {
                /* サーバーアクションの実行 */
                const resObjDataAry: CityAry[] | undefined = await get_SelectElValue_CityCode(isGetFetchPrefCode);
                if (typeof resObjDataAry !== "undefined") {
                    setGetFetchCityCode((_prevGetFetchCityCode) => resObjDataAry[0].id);
                    setCities((_prevCities) => resObjDataAry);
                }
            }
            fetchCityCode();
        }
    }, [isGetFetchPrefCode]);

    return (
        <div className={selectElsStyles.termEls}>
            <div id="prefListsWrapper">
                <select name="" id="prefLists" onChange={async (e: ChangeEvent<HTMLSelectElement>) => {
                    /* サーバーアクションの実行 */
                    const resObjDataAry: CityAry[] | undefined = await get_SelectElValue_CityCode(e.target.value);
                    setGetFetchPrefCode((_prevGetFetchPrefCode) => e.target.value);
                    if (typeof resObjDataAry !== "undefined") {
                        setCities((_prevCities) => resObjDataAry);
                    }
                }}>
                    {prefcodeData.map((data) => (
                        <option value={data.prefcode} key={data.prefcode}>{data.prefJaName}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default memo(SelectPrefCities);
```

このように記述することで無事にデータを取得・反映できるようになりました！

ここで一つ面倒だったのが都道府県リストの用意だったのですが、本筋から少し逸れるのでアコーディオンで省略しておきます。気になる方は是非開いてご覧ください。
<details><summary>都道府県の配列ファイルを ChatGPT に作ってもらう</summary>

サーバーアクションを実行する`select#prefLists`では、別途`ts`ファイルとして用意した都道府県の配列を使って都道府県リストを生成しています。

```ts
import { prefcodeData } from "@/app/components/layout/prefcodeData";
..
.
.
{prefcodeData.map((data) => (
    <option value={data.prefcode} key={data.prefcode}>{data.prefJaName}</option>
))}
```

```swift:prefcodeData.ts
import { PrefCodeType } from "../../ts/prefcode";

export const prefcodeData: PrefCodeType[] = [
    {
        "prefcode": "01",
        "prefJaName": "北海道",
        "prefRomenName": "Hokkaido"
    },
    {
        "prefcode": "02",
        "prefJaName": "青森県",
        "prefRomenName": "Aomori Prefecture"
    },
    ...
    ..
    .
```

![スクリーンショット 2024-05-12 100934.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/92d4ccc8-1bb4-ff9c-4bc5-8c1ee7054649.png)

と言うのも、上のキャプチャ画像の通り、都道府県リストがないと市区町村リストも生成できないので用意は必須だったのです。
（`getSelectElValueCityCode.ts`：選択した都道府県の市区町村リストを取得するサーバーアクションが実行できないため）

以前の`React`verでは自身で都道府県の配列を用意し、ループ処理を通して都道府県リストを生成していたのですが、先の[「API操作説明」](https://www.reinfolib.mlit.go.jp/help/apiManual/#titleApi5)で都道府県コードが用意されていたので改めてそちらに準拠することにしました。

いちいち手動で都道府県コードのファイルを作るのは手間だったので`chatGPT`に頼んで作ってもらいました。本当に助かりました。

![スクリーンショット 2024-05-12 102848.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/d2c416cf-1eff-97c0-7370-2a16282c9d42.png)

</details>

イベントハンドラの記述時の注意点や`useEffect`での実行方法も公式ドキュメントを参考にしました。

- `Event Handlers`

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#event-handlers

- `useEffect`

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#useeffect

::: note info
余談ですが、筆者は恥ずかしながら当初サーバーアクションを **[公式ドキュメント通り](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#client-components)の書き方にしておらず、うまく機能しません** でした。公式ドキュメント通りに書くと無事に機能しましたのでやはりドキュメントをしっかり読むのは大切ですね。

```js
'use server'

// 機能しなかった筆者の書き方「その1」
export const create = async () => {
  // ...
}

// 機能しなかった筆者の書き方「その2」
async function create () {
  // ...
}
export default create;

// 公式ドキュメントの書き方
export async function create() {
  // ...
}
```
:::

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#client-components

ちなみに、サーバーアクション（`getSelectElValueCityCode.ts`）で投げた例外はサーバーサイドで受け取るためエラーはターミナルに表示されます。ここらへんは`Next.js`のサーバーコンポーネントと同じ振る舞いですね。

先のサーバーアクションをエクスポートする方法で他のデータ取得機能（合計3つ）も実装していきました。

今回作成したサーバーアクションの書き方はほぼ同じなのですが、以下の「各年ごとの不動産の平均価格を取得」する`getPrefCompareYearData.ts`だけ少し調整しました。

- `getPrefCompareYearData.ts`
    各年ごとの不動産の平均価格を取得
    ![スクリーンショット 2024-05-12 104224.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/8d552d42-1cbd-8a0e-f202-c821857a21a9.png)
    ※グラフ表示は[Recharts](https://recharts.org/en-US/)を使用しています。

```ts
// getPrefCompareYearData.ts
"use server";

import { EstateInfoJsonData } from "../ts/estateInfoJsonData";

export async function get_Pref_CompareYearData(
    year: string,
    prefCode: string,
    cityCode: string
): Promise<string[] | undefined> {
    const API_KEY: string = process.env.REINFOLIB_API_KEY!;

    const response = await fetch(`https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001?year=${year}&area=${prefCode}&city=${cityCode}`, {
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY,
        },
    });

    const resObj: EstateInfoJsonData = await response.json();
    // この辺りまでは他のサーバーアクションとほぼ同じ記述

    try {
        if (resObj.message) {
            throw new Error(`fetch failed or no Results：${resObj.message}`);
        }

        /* 不動産取引価格のみ抽出（サーバーアクション内でフェッチしたデータを加工して返却）*/
        const tradePrice: string[] = resObj.data.map(resElm => resElm.TradePrice);
        return tradePrice;
    } catch (error) {
        console.error('error occurred - get_Pref_CompareYearData.ts', error);
    }
}
```

サーバーアクションを使ってみて好感を持てたのは、上記のように**サーバーアクション内でフェッチしたデータをそこで調整してクライアント側に返せる**ところです。
わざわざクライアント側で受け取ったデータを加工する必要がない（＝受け取るだけで済む）のは便利だなと感じます。

以下はデータフェッチの実行と、それを受け取るクライアントコンポーネント（`AppStartBtn.tsx`）になります。

- `AppStartBtn.tsx`
    `getPrefCompareYearData.ts`を実行するクライアントコンポーネント
```ts
/* 祖先コンポーネントでクライアントコンポーネントの宣言済みなので "use client" は明記していません */

import { memo, useContext } from "react";
import { CompareSortGraphAction } from "@/app/providers/compare/CompareSortGraphAction";
import { GetFetchEachCode } from "@/app/providers/filter/GetFetchEachCode";
import { useCalcAverageFee } from "@/app/hooks/useCalcAverageFee";
import { get_Pref_CompareYearData } from "@/app/server-action/getPrefCompareYearData";

type AppStartBtnType = {
    isAppStartBtn: boolean;
    termLists_from: number;
    termLists_to: number;
    isViewChart: boolean;
    setViewChart: React.Dispatch<React.SetStateAction<boolean>>;
}

function AppStartBtn({ props }: { props: AppStartBtnType }) {
    const { isAppStartBtn, termLists_from, termLists_to, isViewChart, setViewChart } = props;
    // ...中略

    /* サーバーアクション */
    const async_serverAction_getPrefCompareYearData: () => Promise<void> = async () => {
        let yearCountUp_untill_termLists_to: number = termLists_from;
        while (yearCountUp_untill_termLists_to <= termLists_to) {
            const tradePrice: string[] | undefined = await get_Pref_CompareYearData(yearCountUp_untill_termLists_to.toString(), isGetFetchPrefCode, isGetFetchCityCode);
            if (typeof tradePrice !== "undefined") {
                // フェッチしたデータをグラフ表示
                _viewGetFetchData(tradePrice, yearCountUp_untill_termLists_to);
            } else {
                alert('今回選択した項目・条件のデータは存在しません');
                location.reload();
                break;
            }
            yearCountUp_untill_termLists_to++;
        }
    }

    // ...中略

    return (
        <button type="button" className="appStartBtn" disabled={isAppStartBtn} onClick={async () => {
            /* サーバーアクションの実行 */
            async_serverAction_getPrefCompareYearData();
            appStart();
        }}>計測スタート</button>
    );
}

export default memo(AppStartBtn);
```

残りの一つは、表示用の不動産情報データを取得するサーバーアクションです。
- `getPrefCityYearTermTargetValueData.ts`
    選択した年・期間（4半期別）に紐づいた市区町村の不動産情報データを取得
    ![スクリーンショット 2024-05-12 104630.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/dfadc22d-efee-4aac-4df5-e0a67ae05d05.png)

    ![スクリーンショット 2024-05-12 104748.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/7d2f0100-5e01-16d7-2e9c-e7c390d5431a.png)

    
```ts
// getPrefCityYearTermTargetValueData.ts
"use server";

import { EstateInfoJsonData, EstateInfoJsonDataContents } from "../ts/estateInfoJsonData";

export async function get_PrefCityYearTerm_TargetValueData(cityCode: string, year: string, term: string): Promise<EstateInfoJsonDataContents[] | undefined> {
    const API_KEY: string = process.env.REINFOLIB_API_KEY!;

    // 2. 「取引時期Year」&「取引時期Quarter」&「市区町村コード」&「不動産取引価格情報」
    const response = await fetch(`https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001?year=${year}&quarter=${term}&city=${cityCode}&priceClassification=01`, {
        headers: {
            "Ocp-Apim-Subscription-Key": API_KEY,
        },
    });

    const resObj: EstateInfoJsonData = await response.json();

    try {
        if (resObj.message) {
            if (resObj.message.insufficient) {
                throw new Error(`fetch failed or no Results：${resObj.message.insufficient}`);
            } else {
                throw new Error(`fetch failed or no Results：${resObj.message}`);
            }
        }

        return resObj.data;
    } catch (error) {
        console.error('error occurred - get_PrefCityYearTerm_TargetValueData.ts', error);
    }
}
```

これを実行するクライアントコンポーネントが以下の`SelectEls.tsx`になります。`form`の`onSubmit`でサーバーアクションを行っています。

- `SelectEls.tsx`
    `getPrefCityYearTermTargetValueData.ts`を実行するクライアントコンポーネント
```ts
"use client"

import selectElsStyles from "../../styles/selectEls.module.css";
import { SyntheticEvent, memo, useContext } from "react";
import { EstateInfoJsonDataContents } from "@/app/ts/estateInfoJsonData";
import { GetFetchEachCode } from "@/app/providers/filter/GetFetchEachCode";
import { GetFetchDataContext } from "@/app/providers/filter/GetFetchData";
import SelectPrefCities from "./SelectPrefCities";
import SelectTerm from "./SelectTerm";
import { get_PrefCityYearTerm_TargetValueData } from "@/app/server-action/getPrefCityYearTermTargetValueData";

function SelectEls({ isActionable }: { isActionable?: boolean }) {
    const { isGetFetchCityCode, isGetFetchYearValue, isGetFetchQuarterValue } = useContext(GetFetchEachCode);

    const { isGetFetchData, setGetFetchData, setPagers, setCurrPager } = useContext(GetFetchDataContext);
    
    const resetPager: () => void = () => {
        setCurrPager(1);
        setPagers(0);
    }

    return (
        <form action="" className={selectElsStyles.SelectElsWrapper} onSubmit={async (e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault();
            /* サーバーアクションの実行 */
            const resObjDataAry: EstateInfoJsonDataContents[] | undefined = await get_PrefCityYearTerm_TargetValueData(isGetFetchCityCode, isGetFetchYearValue, isGetFetchQuarterValue);
            if (typeof resObjDataAry === "undefined") {
                alert('今回選択した項目・条件のデータは存在しません');
                location.reload();
                return;
            }
            if (isGetFetchData.length > 0) resetPager();
            setGetFetchData((_prevGetFetchData) => resObjDataAry);
        }}>
            <SelectPrefCities />
            <SelectTerm props={{
                SelectTermClassName: selectElsStyles.YearsQuarterLists_From,
                explainSentence: '期間'
            }} />
            <p className={selectElsStyles.termCaption}><small>※ 1:1月～3月、2:4月～6月、3:7月～10月、4:11月～12月</small></p>
            {isActionable && <button type="submit">run</button>}
        </form>
    );
}

export default memo(SelectEls);
```

## `Vercel`へデプロイ
今回`Next.js`で制作しましたし、他の個人開発でも使用経験があるので迷いなく`Vercel`をホスティング先に選び、特に問題もなくデプロイできました。
しかし盲目的に`Vercel`ダッシュボードのプロジェクト設定で環境変数にAPIキーを設定しましたが、今回サーバーアクションでしかそれを使っていないので「そもそも設定する必要なかったのでは？」と思っています。（実際、むちゃくちゃなAPIキーに編集しても機能していました）

一応、自身の備忘録も兼ねて`Next.js`の環境変数についての参考記事を残しておきます。

https://zenn.dev/kibe/articles/7c09742400aa66

## さいごに
途中に書きましたが、**サーバーアクション内でフェッチしたデータをそこで調整してクライアント側に返せる**ので、わざわざクライアント側で受け取ったデータを加工する必要がない（＝受け取るだけで済む）のはサーバーアクションの利点だと感じました。

特に**サーバー側でデータフェッチから加工まで行えるとパフォーマンス面でも大きなメリットがある**かと思います（※取得するデータ量や内容、サイズにもよりますが）

とはいえ、ここまで書いてきて「何もサーバーアクションでなくとも`app/api`で独自APIを設けてデータフェッチする方法でもいけたのでは？」と思いました。
しかし今回、サーバーアクションに初めて触れたので良い機会だったと前向きに捉えます。
まだまだ触りたてなので今後も機会を見て実装し、練度を高めていきたいと考えています。

あと、今回`State`の管理に`Context`を使っていますが、`jotai`など状態管理ライブラリでも問題ないかと思います。筆者は普段`jotai`を使うことが多いのですが、以前作った`React`verで`Context`を使っていたので今回はそれを引き継ぎました。

本記事で紹介したサイトの`GitHub`を置いておきますので、関心のある方はご自由にお使いください。
※APIはご自身で取得をお願い致します。

https://github.com/Benjuwan/next-realestateApi

## 参考情報

https://www.reinfolib.mlit.go.jp/

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

- `Event Handlers`

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#event-handlers

- `useEffect`

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#useeffect

- `client Components`

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#client-components

https://zenn.dev/rgbkids/articles/c983df12cfa87d

https://zenn.dev/kibe/articles/7c09742400aa66

https://zenn.dev/mybest_dev/articles/f90fe006aaf24d

