title: 任意の地域と計測期間から不動産取引情報を取得するサイト（国交省の不動産取引価格情報取得API使用）

tags: React TypeScript 個人開発 ポエム recharts

今回、React で日本各地の不動産取引情報を閲覧できるサイトを公開しました。
ページャー機能、フィルター機能、比較（リスト及びグラフ表示）機能を用意しており、指定した地域と期間から不動産取引情報が確認できます。

【公開したサイト】[不動産取引データ取得機能](https://real-estate-api-app-benjuwan.vercel.app/)
<font color="lightgray">ネーミングセンスの無さ……</font>
[不動産取引データ取得機能の【GitHub】](https://github.com/Benjuwan/realEstateApi)

![スクリーンショット 2023-11-08 114029.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/247adbfd-2a04-be43-9ffa-3cfbc97bf7b3.png)


以下の記事を拝読して「不動産取引価格情報取得API（国交省）」なるものを知り、React のスキルアップがてら使ってみようと思ったことが制作のきっかけになります。

https://qiita.com/OgawaHideyuki/items/a7b3df8bc6cffe3a6bdb

## 使用ツール
- React
- TypeScript
- Vite
- styled-components
- Recharts

[Recharts](https://recharts.org/en-US) はグラフ表示を行うために初めて使用しました。シンプルで使いやすかったです！

## 機能紹介
- ページャー機能
![スクリーンショット 2023-11-08 114618.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/73481d8c-4c45-ed47-f3fc-bc47438870d8.png)

- フィルター機能
![スクリーンショット 2023-11-08 131010.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/93366402-27b4-8494-d63e-8d922fbd8169.png)

- 比較（リスト及びグラフ表示）機能
![スクリーンショット 2023-11-08 144239.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/ca3bfda1-d754-bb3e-d2bb-8fca7e4d48b2.png)

### 使用方法
先ほど載せたサイトトップにある「ここから機能を選んでください」ドロップダウンリストから機能を選ぶと、機能に応じたフォームが表示されます。下記はページャー／フィルター機能で表示されるフォームです。
![スクリーンショット 2023-11-08 114834.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/7f106a7f-5b27-a192-44aa-ea82902251f3.png)

都道府県を選択すると、そこに準じた市区町村がセットされるようになっています（デフォルトは北海道）。不動産取引データを取得したい計測期間（年数と四半期）を選んで「不動産取引データを取得」ボタンを押すとデータを取得できます。

各機能すべて、非同期処理で不動産取引情報（コンテンツデータ）を取得及び専用のステートに格納しており、そのステートを使ってコンテンツデータを表示しています。
```react
{isPagerContents.map((el, i) => (
    <article key={i}>
        <ContentsItems aryEl={el} /> // 取得した情報の各項目（場所や価格、平米など）を表示するコンポーネント
    </article>
))}
```

### ページャー機能
![スクリーンショット 2023-11-08 114618.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/3d28f625-2f64-4b80-b3cb-a22563f68407.png)

結論から言うと正直そこまで必要でない機能かもしれません。なぜ作ったのかとツッコまれると**ただ単に React でページャー機能ってどう作るのだろう**と思ったためです。スキルアップを図るための制作なので色々と試してみたくなった気持ちがあり、こういったことを自由にできるのが個人開発のメリットかもしれませんね。
ページャー機能は「ページ送りver」と「コンテンツデータ随時追加・削除ver」の2つがあります。<font color="lightgray">なぜ2つも作ったのかとツッコまれると……以下略</font>

#### ページ送りver
![スクリーンショット 2023-11-08 120648.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/330f4aa9-2aa8-d8ff-776d-8429f2057a09.png)
下部にあるページャーボタンをクリックすると、コンテンツデータを管理しているステート（`pagerState`）が更新されてオフセット（`offsetState`）に指定した件数 ~~（10件）~~ （25件）が表示されます。
`pagerState`と`offsetState`はともに`Context`でグローバルステートにしてあります。
ページ送りの機能は非同期処理で取得した不動産取引情報（コンテンツデータ）を`splice`メソッドで区切って差し替えています。
```typescript
/* ページャー機能：splice メソッドで処理 */
const [isPagerContents, setPagerContents] = useState<estateInfoJsonDataContents[]>([]);
const setPagerContentsFrag = useCallback((
    fragStart: number = isPagers, // 始点（fragStart）：ページャー数
    fragFinish: number = isOffSet // 終点（fragFinish）：オフセット数
) => {
    const shallowCopy: estateInfoJsonDataContents[] = [...isGetFetchData]; // 不動産取引情報（コンテンツデータ）
    const splicedContents: estateInfoJsonDataContents[] = shallowCopy.splice(fragStart, fragFinish); // spliceメソッドで加工
setPagerContents((_prevPagerContents) => splicedContents); // 加工した内容でステート更新
}, [isPagers]);

/* レンダリング後とページャー更新時に setPagerContentsFrag を実行 */
useEffect(() => {
    /* ページャー機能：ページ送り */
    if (typeof pagerLimitMaxNum !== "undefined") {
        const limitBorderLine: number = pagerLimitMaxNum - isOffSet;
        if (isPagers >= limitBorderLine) {
            const remandNum: number = pagerLimitMaxNum - isPagers;
            setPagerContentsFrag(isPagers, remandNum); // 終点：残りのコンテンツ数
        } else {
            setPagerContentsFrag();
        }
    }
}, [isPagers]);
```

`splice`メソッドの引数に渡す内容は下記処理を通じて`pagerState`を更新しています。
```react
/* 戻る */
const prevPagerPages = () => {
    setPagers((_prevNum) => isPagers - isOffSet);
}
/* 次へ */
const nextPagerPages = () => {
    setPagers((_prevNum) => isPagers + isOffSet);
}
```

#### コンテンツデータ随時追加・削除ver
フォーム下にあるボタン（ページ送りver）をクリックすると機能変更できます。こちらではページ送りではなく、戻る・次への処理に応じて表示されるコンテンツデータが増減されるだけのシンプルな仕様です。
ページ送りver と違って`splice`メソッドを使わず、下記のように`filter`処理でコンテンツデータを差し替えています。
```react
const theContents: estateInfoJsonDataContents[] = useMemo(() => {
    return [...isGetFetchData].filter((el, i) => {
        /* 初期表示（オフセット分を表示） */
        if (isPagers <= 0 && i < isOffSet) {
            return el;
        }

        /* ページャー機能：コンテンツデータの随時追加・削除 */
        else {
            if (typeof pagerLimitMaxNum !== "undefined") {
                if (isPagers > pagerLimitMaxNum) {
                    if (i < pagerLimitMaxNum) return el;
                } else if (i < isPagers) {
                    return el;
                }
            }
        }
    });
}, [isPagers]);

// ...中略
return (
    <>
        {theContents.map((el, i) => (
            <article key={i}>
                <p>No.{i + 1}</p>
                <ContentsItems aryEl={el} />
            </article>
        ))}
    </>
);
```
`pagerState`の更新は下記内容です。
```typescript
/* 戻る */
const prevPagerIncDec = () => {
    if (isPagers <= isOffSet) {
        setPagers((_prevNum) => isPagers + isOffSet);
    } else {
        setPagers((_prevNum) => isPagers - isOffSet);
    }
}
/* 次へ */
const nextPagerIncDec = () => {
    if (isPagers <= 0) {
        setPagers((_prevNum) => isPagers + (isOffSet * 2)); // 初期表示でオフセット分（10件）が表示されているので最初のページでの処理はオフセット分を2倍にする（次への処理で20件分表示）
    } else {
        setPagers((_prevNum) => isPagers + isOffSet);
    }
}
```

#### おまけ
![スクリーンショット 2023-11-08 125234.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e9eedb25-1e82-62f0-e074-8389569ceff4.png)

コンテンツナンバーを入力してページ遷移する「入力機能」（ページ送りverのみ）と、ページ数を選択して任意のコンテンツデータを表示する「ページネーション機能」も用意しました。色々と試せるのが個人開発のメリットですよね！（2回目）
- 入力機能
~~調整不足<font color="lightgray">（スキル不足）</font>で**オフセットが5の倍数**の時しか機能しません。オフセットが5の時は、入力したコンテンツデータ数に応じて四捨五入して表示するようにしてあります（例：28の場合は繰り上げて25件～30件までのコンテンツデータを表示、22の場合は繰り下げた20～25件、25の場合は25件～30件）~~
:::note info
2023/11/15 追記
コードの修正及びリファクタリングの結果、上記問題をクリアしました。
簡易的な説明をすると、ページャー項目をセットしておいた**DOM要素 の値と入力数値を計算して入力数値を含んだページを表示**するようにしました。
```typescript
/* 数値入力後の「移動」ボタンクリックイベント時に行う処理 */
const setPagerNumber = (
    inputValue: string // 入力数値
) => {
    /* ページャーにセットする予定の各種ページャー項目の値とページ番号を取得 */
    const dataPagerEls: NodeListOf<HTMLElement> = document.querySelectorAll('[data-pager]');
    const dataPagerValue: (string | null)[][] = Array.from(dataPagerEls).map(dataPagerEl => [
        dataPagerEl.getAttribute('data-pager'),
        dataPagerEl.textContent
    ]);

    /* 取得したページャー項目の数だけループさせ、各ページャー項目の値と入力数値を計算してオフセット数以下になる値を該当数値（入力数値が含まれるページ数）として各種 State 変数にセット（更新）する */
    for (let i = 0; i < dataPagerValue.length; i++) {
        if (dataPagerValue[i - 1] !== undefined) {
            const currentPagerVal: number = Number(dataPagerValue[i][0]);
            if (currentPagerVal - parseInt(inputValue) < isOffSet) {
                const finalPagerVal: number = Number(dataPagerValue[dataPagerValue.length - 1][0]);
                if (parseInt(inputValue) >= finalPagerVal) {
                    /* 入力数値が最終ページャー項目の値よりも「大きい」場合は最終ページャー項目の値をセット */
                    setPagers((_prevPagerNum) => finalPagerVal);

                    /* 表示中のページ番号を変更 */
                    const finalPagerNum = dataPagerValue[dataPagerValue.length - 1][1];
                    setCurrPager((_prevCurrPager) => Number(finalPagerNum));
                } else {
                    /* 該当数値（入力数値が含まれるページ数）をセット */
                    const behindPagerVal: number = Number(dataPagerValue[i - 1][0]);
                    setPagers((_prevPagerNum) => behindPagerVal);

                    /* 表示中のページ番号を変更 */
                    const behindPagerNum = dataPagerValue[i - 1][1];
                    setCurrPager((_prevCurrPager) => Number(behindPagerNum));
                }
            }
        }
    }
}
```
:::



- ページネーション機能
~~コンテンツデータ数をオフセット数で分割した数でページャー項目を用意（* 1）しています。桁が切り替わる際の調整などで手間取りました。きっともっとスマートな方法があるのでしょう泣（* 1：180件でオフセットが10の場合は、180/10 で 18ページャー項目）~~
:::note info
2023/11/15 追記
もっとスマートな方法がありました。そもそも上記の方法では桁数が増えた時に意図した挙動をしない不良品でした。修正及びリファクタリング後です。
```typescript
/* 各ページャー項目の data-pager の値に準じたページを表示及びページ番号を変更 */
const setPaginationNum = (btnEl: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const dataPager: string | null = btnEl.currentTarget.getAttribute('data-pager');
    if (isPagerFrag) {
        setPagers((_prevPagerNum) => Number(dataPager));
    } else {
        /* PagerIncDec.tsx ではオフセット数を加算（随時追加という仕様により初期表示時点でオフセットの1セット目分が表示されているため） */
        setPagers((_prevPagerNum) => Number(dataPager) + isOffSet);
    }

    /* 表示中のページ番号を変更 */
    const currPager: string | null = btnEl.currentTarget.textContent
    setCurrPager((_prevCurrPage) => Number(currPager));
}

/* オフセット数に基づいた計算を通してページネーション用の各ページャー項目のページを設定する */
const basedonOffsetNum_setPagerNum = () => {
    /* 初期表示時（isPagination が 0件）という条件を指定して再レンダリングに伴う倍数増加（下記処理実行）を防止 */
    if (isPagination.length <= 0) {
        const srcAry: number[] = [];
        let srcNum: number = pagerLimitMaxNum;

        /* 各ページャー項目の data-pager の値を生成（引算用途の上限数値：srcNum が 0 を切るまでオフセット数を倍数していくループ処理）*/
        let Accumuration = 0;
        while (srcNum >= 0) {
            srcAry.push(isOffSet * Accumuration);
            Accumuration++;
            srcNum = srcNum - isOffSet;
        }
        setPagerNum((_prevPagerNum) => [...isPagerNum, ...srcAry]); // ページャー数をセット

        const paginationAry: number[] = [];
        for (let i = 1; i <= srcAry.length; i++) {
            paginationAry.push(i);
        }
        setPagination((_prevPagination) => [...isPagination, ...paginationAry]); // ページ数をセット
    }
}
useEffect(() => {
    basedonOffsetNum_setPagerNum();
}, [isGetFetchData]);
```
肝となったのが以下のコードの部分で、これによりリファクタリング前の「オフセット数を分割して……」なんて無駄なことをしなくてもよくなりました。上限値が0になるまで、オフセット数を倍数していくシンプルな仕様です。これでどのようなオフセット数にも準じたページ番号を生成できるようになりました。
```typescript
/* 各ページャー項目の data-pager の値を生成（引算用途の上限数値：srcNum が 0 を切るまでオフセット数を倍数していくループ処理）*/
let Accumuration = 0;
    while (srcNum >= 0) {
        srcAry.push(isOffSet * Accumuration);
        Accumuration++;
        srcNum = srcNum - isOffSet;
    }
setPagerNum((_prevPagerNum) => [...isPagerNum, ...srcAry]); // ページャー数をセット
```
:::

おまけ機能の実装に思いのほか時間がかかった印象です。さながら、調べたいことがあって検索していたのに気付けばネットサーフィンしてしまっている感じですかね……。<font color="lightgray">でも良いんです！ 色々と試せるのが個人開発の……以下略</font>

:::note info
2023/11/15 追記　
おまけのおまけで、コード修正及びリファクタリングのついでに、現在表示中のページ番号を表記するようにもしました。`useState`と`useContext`を使ったシンプルな仕様です。
:::


:::note info
React ではわざわざページャー／ページネーションを自作せずとも、便利なライブラリ（[React Pagination component - Material-UI](https://v4.mui.com/ja/components/pagination/)）が用意されているようです<font color="gray">（~~もっと早く知りた……~~ でも良いんです！ 色々と試せるのが個人開発の……2回目＆以下略）</font>。
:::
https://zenn.dev/syu/articles/67c4c569fa5c16

### フィルター機能
![スクリーンショット 2023-11-08 131010.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/b797c11d-e00b-1a66-caac-13a931866d04.png)

画面を見ていただいた通りですが「昇順・降順」をはじめ、「不動産用途（中古マンション等・宅地(土地)など）」、キーワード（地区名）といった各種フィルター機能を用意しています。
フィルター機能の下には表示中のコンテンツデータの不動産取引価格の平均値が表示されるようにもなっています。<font color="lightgray">（東京って高っ！ですね）</font>

各コンテンツデータでは「詳細情報ボタン」を押すと具体的な情報がモーダル表示されるようになっています。
![スクリーンショット 2023-11-08 131543.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/9df8efcd-5349-521a-a736-c2e205e87acb.png)

#### 昇順・降順ソート機能
```typescript
    /* ソート機能 */
    const _SortMethod = (sortType: string) => {
        if (sortType === '昇順') {
            return [...isGetFetchData].sort((aheadEl, behindEl) => parseInt(aheadEl.TradePrice) - parseInt(behindEl.TradePrice));
        } else if (sortType === '降順') {
            return [...isGetFetchData].sort((aheadEl, behindEl) => parseInt(behindEl.TradePrice) - parseInt(aheadEl.TradePrice));
        }
    }

    /* 昇順 */
    const ascClick = () => {
        const askAry: estateInfoJsonDataContents[] | undefined = _SortMethod('昇順');
        if (askAry !== undefined) {
            setGetFetchData((_prevAry) => askAry);
        }
    }

    /* 降順 */
    const deskClick = () => {
        const deskAry: estateInfoJsonDataContents[] | undefined = _SortMethod('降順');
        if (deskAry !== undefined) {
            setGetFetchData((_prevAry) => deskAry);
        }
    }
```
オブジェクトの配列は key（プロパティ）の値を比較することで並べ替えできるのを知りました。`sort`メソッド便利ですねー。

#### 不動産用途・地区名でのフィルター機能
```typescript
    /* フィルター：Type（用途）*/
    const FilterType = (filterWord: string | null) => {
        const filterTypeAry: estateInfoJsonDataContents[] = 
        [...isGetFetchData].filter(els => filterWord === els.Type);
        setGetFetchData((_prevFetchAry) => filterTypeAry);
    }

    /* フィルター：DistrictName（地区）*/
    const FilterPlace = (filterWord: string | null) => {
        const filterPlaceAry: estateInfoJsonDataContents[] = 
        [...isGetFetchData].filter(els => els.DistrictName.match(`${filterWord}`));
        if (filterPlaceAry.length === 0) {
            alert(`地区名「${filterWord}」は、\n検索条件のデータ内に存在しません。`);
            return;
        } else {
            setGetFetchData((_prevFetchAry) => filterPlaceAry);
        }
    }
```
国交省の不動産取引価格情報取得APIで用意されているデータのプロパティ（Type や DistrictName）を使ってフィルターしています。

### 比較（リスト及びグラフ表示）機能
フォームは、ページャー／フィルターとは少し異なっています。
![スクリーンショット 2023-11-08 133151.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/abab0aff-0a51-d116-c39c-0f0aaf8d8fdc.png)
指定された場所と計測期間を選択します。年間平均取引価格を確認するため、ページャー／フィルターと違って四半期の選択はありません。
条件を指定して「計測スタート」するとリスト表示され、さらに「ソート＆グラフ表示」ボタンを押すと下記のようにリストがソートされてグラフが表示されます。

![スクリーンショット 2023-11-08 144239.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/33e39ae1-a3b7-ac29-162c-28c17c7c0d9d.png)

冒頭でも記述しましたが、グラフ表示には [Recharts](https://recharts.org/en-US) を使用しています。

#### リストの表示
非同期処理でコンテンツデータの取引価格部分を取得して、平均価格を算出します。
```typescript
    const resElAry: string[] = resObjDataAry.map((resEl, i) => {
        if (i === resObjDataAry.length - 1) {
            return resEl.TradePrice, '.'; // 年間データの処理完了シグナルとして
        } else {
            return resEl.TradePrice;
        }
    });

    /* _AverageCalc 関数で平均価格を算出 */
    const AverageCalcAry: (string | number)[] = _AverageCalc(annualValue, resElAry);

    /* 算出した平均価格を リアルDOM に反映 */
    const AverageCalcLists: HTMLUListElement | null = document.querySelector('.AverageCalcLists');
    AverageCalcLists?.insertAdjacentHTML('afterbegin', 
    `<li><span id="annualYear">${AverageCalcAry[0]}</span>
    <span id="averageTradePrice">${AverageCalcAry[1]}</span></li>
    `);
```

`_AverageCalc`：平均価格を取得するための関数
```typescript
    /* 取得した tradePrice データから平均価格を算出 */
    const _AverageCalc = (
        annualYear: number,
        resElAry: string[]
    ) => {
        /* . を年間数値（annualYear）へ置換 */
        const replaceannualYearAry: (string | number)[] = [...resElAry].map(dataEl => {
            if (dataEl === '.') return annualYear;
            else return dataEl;
        });

        /* reduce 処理のために加工 */
        const allTradePrices: number[] = [...replaceannualYearAry].filter(filterEl => {
            return typeof filterEl !== "number"; // annualYear を除外
        }).map(dataEl => {
            return Number(dataEl); // 数値型へ変換
        });

        /* 全価格を合算して平均価格を算出する */
        const reduceResult: number = allTradePrices.reduce((a, b) => a + b, 0);
        const averageNumber: number = reduceResult / resElAry.length;

        /* 平均価格（が Nan でない場合は）3桁区切りにして、年数と合わせて配列として返却する */
        let averageResultStr: string = '0';
        if (!Number.isNaN(averageNumber)) {
            averageResultStr = `${Math.floor(averageNumber).toLocaleString()}`;
        }
        return [annualYear, averageResultStr];
    }
```
#### ソート＆グラフ表示
`Recharts`を完全に理解したわけではないのですが、`data`に渡した内容がグラフのデータとして表示されるようです。どうやって計測年数と不動産取引平均価格を`data`に渡そうか考えた結果、**取得したデータ分の空オブジェクトを用意して、そこに各データの内容（中身）を入れていこう**と思いつきました。<font color="lightgray">（たぶんもっとスマートな方法はあるのでしょう）</font>
```react
    /* Recharts */
    <LineChart width={600} height={300} data={isChartData}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
    </LineChart>
```
取得したデータ分の空オブジェクトを用意して、そこに各データの内容（中身）を入れていくための下準備をしておきます。
```react
    type chartDataType = {
        name: string,
        uv: number,
        pv?: number,
        amt?: number
    }
    const getChartDataSrc: chartDataType[] = []; // 取得した平均取引価格データを受け取る一次配列（getChartDataSrc の中身を反転させて isChartData へ反映させる）
    const [isChartData, setChartData] = useState<chartDataType[]>([]); // LineChart コンポーネントの data に渡すための State
```
実際にデータを取得及び反映させるのは下記処理になります。

<details><summary>コード全文</summary>

```typescript
    const sortLists_viewGraph = () => {
        const AverageCalcListsLiEls: NodeListOf<HTMLLIElement> | undefined = document.querySelectorAll('.AverageCalcLists li'); // 計測結果リスト
        if (typeof AverageCalcListsLiEls !== "undefined") {
            const sortListEls: HTMLLIElement[] = Array.from(AverageCalcListsLiEls).sort((ahead, behind) => {
                const aheadEl: number = Number(ahead.querySelector('#annualYear')?.textContent);
                const behindEl: number = Number(behind.querySelector('#annualYear')?.textContent);
                return behindEl - aheadEl; // 年数でソート
            });

            const AverageCalcLists: HTMLUListElement | null = document.querySelector('.AverageCalcLists'); // 計測結果リストの親要素
            if (AverageCalcLists !== null) {
                AverageCalcLists.innerHTML = ""; // 親要素の中身をリセット
                sortListEls.forEach(sortListEl => {
                    AverageCalcLists.insertAdjacentElement('afterbegin', sortListEl); // ソートした内容をセット
                });
            }

            /* chart 表示 */
            sortListEls.forEach((lists, i) => {
                const annualYear: string | undefined | null = lists.querySelector('#annualYear')?.textContent;
                const averageTradePrice: number | undefined | null = Number(lists.querySelector('#averageTradePrice')?.textContent?.split(',').join('')); // 平均価格の文字列からカンマを取り除いて数値型に変換

                getChartDataSrc.push({ name: '', uv: 0 }); // chart 表示用のオブジェクト配列（一次配列）に取得した年間データ分の{object 要素}を追加

                /* 追加した{object 要素}に各年間データの内容を代入していく */
                if (annualYear && averageTradePrice !== (null || undefined)) {
                    getChartDataSrc[i].name = annualYear;
                    getChartDataSrc[i].uv = averageTradePrice;
                }
            });
            const Adjust_getChartDataSrc = getChartDataSrc.reverse(); // 一次配列の中身を反転
            setChartData((_prevChartData) => Adjust_getChartDataSrc); //（isChartData のリセット処理を記述していないため）処理ごとに倍数されるのでスプレッド構文（[...isChartData, ...getChartDataSrc]）は使用しない
            setViewChart(true); // chart コンポーネントを表示
        }
    }
```
</details>

- ソート部分
```typescript
    const AverageCalcListsLiEls: NodeListOf<HTMLLIElement> | undefined = document.querySelectorAll('.AverageCalcLists li'); // 計測結果リスト
    if (typeof AverageCalcListsLiEls !== "undefined") {
            const sortListEls: HTMLLIElement[] = Array.from(AverageCalcListsLiEls).sort((ahead, behind) => {
                const aheadEl: number = Number(ahead.querySelector('#annualYear')?.textContent);
                const behindEl: number = Number(behind.querySelector('#annualYear')?.textContent);
                return behindEl - aheadEl; // 年数でソート
            });
    
        const AverageCalcLists: HTMLUListElement | null = document.querySelector('.AverageCalcLists'); // 計測結果リストの親要素
        if (AverageCalcLists !== null) {
                AverageCalcLists.innerHTML = ""; // 親要素の中身をリセット
                sortListEls.forEach(sortListEl => {
                AverageCalcLists.insertAdjacentElement('afterbegin', sortListEl); // ソートした内容をセット
            });
        }
// ...中略
```
- グラフ表示部分
```typescript
// ...中略
        sortListEls.forEach((lists, i) => {
            const annualYear: string | undefined | null = lists.querySelector('#annualYear')?.textContent;
            const averageTradePrice: number | undefined | null = Number(lists.querySelector('#averageTradePrice')?.textContent?.split(',').join('')); // 平均価格の文字列からカンマを取り除いて数値型に変換

            getChartDataSrc.push({ name: '', uv: 0 }); // chart 表示用のオブジェクト配列（一次配列）に取得した年間データ分の{object 要素}を追加

            /* 追加した{object 要素}に各年間データの内容を代入していく */
            if (annualYear && averageTradePrice !== (null || undefined)) {
                getChartDataSrc[i].name = annualYear;
                getChartDataSrc[i].uv = averageTradePrice;
            }
        });
        
        const Adjust_getChartDataSrc = getChartDataSrc.reverse(); // 一次配列の中身を反転
        setChartData((_prevChartData) => Adjust_getChartDataSrc); //（isChartData のリセット処理を記述していないため）処理ごとに倍数されるのでスプレッド構文（[...isChartData, ...getChartDataSrc]）は使用しない
        setViewChart(true); // chart コンポーネントを表示
        }
    }
```

この方法を思いついたのは、Reactの再レンダリングの条件の一つである**Stateが更新された場合**を思い出したためです。蛇足ですが再レンダリングの条件は下記4つですね。
- State が更新された時
- Props が変更された時
- 再レンダリングされた親コンポーネント配下の全子コンポーネント（コンポーネントの`memo`化で防止可能）
- コンポーネントで参照している`Context`の値が変更・更新された時

## まとめ
2週間くらいで制作しましたが、クライアントワークではスケジュールがありますし、伸び伸び自由にというわけにはいかないでしょう。方向性を決めずに ~~（ダラダラと）~~ 自分の好きなように作れる個人開発の楽しさを改めて実感できました！

殴り書きのような文章になってしまったかもしれませんが、ここまで読んでいただきありがとうございました。
記事冒頭にも載せていますが、このサイトの GitHub を置いておきますので気が向いた方はぜひ見てください<font color="gray">（stars いただけますと励みになります！大歓迎）</font>

https://github.com/Benjuwan/realEstateApi

余談：東京ってやっぱり高いですよね……桁が違う。
![スクリーンショット 2023-11-08 144239.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/ca3bfda1-d754-bb3e-d2bb-8fca7e4d48b2.png)

![スクリーンショット 2023-11-08 144329.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/8cd54be6-f083-441f-1c27-fa6f5a5d2fd4.png)
