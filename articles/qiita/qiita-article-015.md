title: localStorage を使ったお気に入り登録機能を React で 

tags: 個人開発 React TypeScript localStorage suspense

https://qiita.com/advent-calendar/2023/personal-developement

この記事は[個人開発 Advent Calendar 2023](https://qiita.com/advent-calendar/2023/personal-developement)の20日目の記事です。

## はじめに
ECサイトなどでよく見る「商品のお気に入り登録・削除機能」を`React`で作りました。

https://k2webservice.xsrv.jp/r0105/favoriteitems/

![スクリーンショット 2023-12-20 145705.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/42730e75-3d19-5e4a-7ad7-be248b05d9f6.png)

コンテンツ名をクリックするとハートアイコンが表示されて「登録予定」となり、右下のハートマークまたは上部の「お気に入りを登録・表示」を行うことで登録できます。

:::note warn
お気に入り登録・削除といったコンテンツの管理には`localStorage`を使っています。
iOS（Safari ブラウザ）のプライベートモードでは今回制作したものは機能しません。
:::

コンテンツのサムネイルをクリックすると、当該コンテンツの詳細情報がモーダル表示される仕様です。

![スクリーンショット 2023-12-20 151102.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/557b7090-7dbb-9a4c-a866-a421fb7eddd7.png)

<details>
<summary>掲載例コンテンツについて（特に読まなくとも結構です）</summary>

弊社が販売している**シミュレーション・ウォーゲーム**です。歴史に if はありませんが、ゲーム上では可能なのでそういったロマンを感じられるボードゲームの一種となります。

> その起源はプロイセン（だいたい昔のドイツ）の参謀本部で行われた「机上演習」であり、それを「ゲーム」というスタイルにまとめたものです。紙製の地図と駒を使い、プレイヤーは司令官の立場で対戦相手と知的な戦いを繰り広げます。題材は歴史上有名な戦いもあれば、実際に起こらなかった戦いもあります。1960年代にアメリカで生まれたこのホビーは、80年代に日本で大ブームとなりました。25年以上経った現在でも、熱心なユーザーによって楽しまれ続けている歴史のある、また大人が楽しめる趣味です。

詳細が気になったり、関心を持って下さった方は下記サイトを是非ご覧ください。

[コマンドマガジン](https://commandmagazine.jp)

</details>

## コンテンツの管理
表示するコンテンツ（情報）は`json`データを別途用意して非同期処理で取得しています。

```json
[
    ︙
    ︙
    {
        "contentName": "imageName-2", // ← コンテンツ名
        "contentNumber": 2, // ← コンテンツのサムネイル画像管理用のナンバリング
        "contentDetails": "", // ← コンテンツの詳細情報
        "contentMovie": "<iframe src='https://www.youtube.com/embed/hogehoge' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>" // ← コンテンツのPR動画など
    },
    {
        "contentName": "imageName-3",
        "contentNumber": 3,
        "contentDetails": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        "contentName": "imageName-4",
        "contentNumber": 4,
        "contentDetails": ""
    },
    ︙
    ︙
]
```

コンテンツ情報を読み込むカスタムフックを用意します。

```typescript
import { contentType } from "../ts/contentType";
export const useFetchData = () => {
    const FetchData: (url: string) => Promise<contentType[]> = async (url: string) => {
        const response = await fetch(url, { cache: "no-store" });
        const resObj: contentType[] = await response.json();
        return resObj;
    }

    return { FetchData }
}
```

このカスタムフックで取得した内容をコンポーネントで表示しています。

```jsx
︙
︙
{fetchContentData.map((fetchContenetEl, i) => (
    <div className="items" key={i}>
        <ItemContent index={i} fetchContenetEl={fetchContenetEl} />
        <CheckBox index={i} imgNameSrc={fetchContenetEl.contentName} />
    </div>
))}
︙
︙
```

## 登録・削除機能

### 登録機能
先ほども少し述べましたが`localStorage`を使っています。

`localStorage`の具体的な機能や特徴については割愛しますが、筆者は以下の YouTube 動画で`localStorage`を知るとともに学びました。すごく分かりやすかったです。

https://www.youtube.com/watch?v=E08jeQBa1D0

各コンテンツ名（例：No.2：imageName-2の画像）はそれぞれ`input[type="checkbox"]`を内包した`label`要素になっていて、クリックイベントに応じてハートマークの表示・非表示を行っています。

```scss
input[type="checkbox"] {
    appearance: none;
    border-radius: 0;
    border: 1px solid transparent;
    background-color: transparent;

    &[checked] {
        &::before{
            content: "♥";
            display: grid;
            place-content: center;
            color: #fa04d9;
            font-size: 1.25em;
            line-height: 1;
            margin-right: .25em;
            background-color: #f8baf0;
            border-radius: 50%;
            width: 1.25em;
            height: 1.25em;
        }
    }
}
```

登録機能で詰まったのは登録済みコンテンツのラベル（コンテンツ名）クリック時の**登録解除処理**です。クリックイベントで、チェックしたコンテンツが既に存在する場合と未登録の場合で処理分けする必要がありました。

未登録の場合は登録予定フェーズに進めるシンプルな処理です。

```typescript
︙
︙
/* チェックしたコンテンツのid 属性値を取得 */
const checkedItemId = inputEl?.getAttribute('id') as string;
︙
︙
/* 取得したコンテンツのid 属性値をチェック項目の管理用 State に格納（登録予定フェーズに進める） */
setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
```

一方、登録済みの場合は`localStorage`にあるコンテンツの中身を照合・判断したうえで`localStorage`からの削除及び`State`の更新など各種処理を進めることになり、そこに`React`特有の再レンダリング処理が関わってきてややこしくなりました。

具体的に起きた不具合は「登録解除**直後**に**再登録しようとするとチェックできない**（登録予定フェーズに進めない）」というものでした。一度、他のラベルをクリックしたり、他のコンテンツを登録解除してからチェックしたりすると問題なく機能することも筆者を混乱させました（恐らくクリックイベント時の何らかの処理による再レンダリングに起因する問題？）。

結局、コンポーネント内にグローバル変数を用意して処理を進める逃げ姿勢になりました。
```typescript
/* useState で State 変数を用意して行うと登録解除後の再登録処理がうまくいかず、グローバル変数を用意して対応 */
let mutableLocalStorageData: string[] = [];

const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
if (getLocalStorageItems !== null) mutableLocalStorageData = JSON.parse(getLocalStorageItems);
```

`localStorage`への登録関連の処理は以下になります。
既存の`localStorage`データの有無に応じて処理を変えています。

```typescript
/* 既存の localStorage データを格納する State */
const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
/* 既存の localStorage データをソート（して isCheckSaveData に反映）*/
GetCurrentLocalSaveData_DataSort(setCheckSaveData);

const _check_SelectedContents: () => string[] | undefined = () => {
    const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
    if (checkedContents.length > 0) {
        /* _returnTargetElsStr：条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */
        const targetElsStr: string[] = _returnTargetElsStr(checkedContents);
        /* getTargetItems：現在 localstorage データに存在する子（たち）と選択された追加の子（たち）*/
        const getTargetItems: string[] = [...isCheckSaveData, ...targetElsStr];
        return getTargetItems;
    }
}

const _setLocalStorage_Favorite: () => void = () => {
    const getTargetItems = _check_SelectedContents();
    if (getTargetItems !== undefined) {
        _pushLocalSaveBoxes(getTargetItems); // localStorage 用の配列（localSaveBoxes）にコンテンツを格納
        _localSaved('localSaveBoxes', getTargetItems); // localStorage に保存
    }
}

const localDataSave_Favorite: () => void = () => {
    if (isCheckSaveData.length > 0) {
        /* localStorage データがある場合は checked = 'true' の内容のみ localStorage に保存 */
        _setLocalStorage_Favorite();
        location.reload();
    } else {
        LocalDataSave(); // localStorage データがない場合の処理
        location.reload();
    }
}
```

<details><summary>LocalDataSave：localStorage データがない場合の処理</summary>

```typescript
/* localstorage への登録処理 */
export const useLocalDataSaved = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext)
    const { isCheckItems } = useContext(CheckItemsContext);

    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    const LocalDataSave: () => void = () => {
        /* 任意の配列から特定のデータ（対象コンテンツのid）を取得して 当該コンテンツの中身（itemContent.innerHTML）を localstorage の配列に格納 */
        const itemContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.itemsOrigin');
        isCheckItems.forEach(checkItem => {
            itemContents.forEach(itemContent => {
                const checkItemId = checkItem.split('item-')[1];
                const itemOriginItemId: string | undefined = itemContent.getAttribute('id')?.split('itemsOrigin-')[1];
                if (checkItemId === itemOriginItemId) {
                    const strItemContent: string = String(itemContent.innerHTML);
                    _pushLocalSaveBoxes(strItemContent);
                }
            });
        });
        _localSaved('localSaveBoxes', localSaveBoxes);
    }

    return { LocalDataSave }
}
```

</details>

### 削除（登録解除）機能
登録解除に関する処理は以下です。カスタムフックにして各種コンポーネントで使い回しています。
```typescript
export const useRemoveItems = () => {
    const RemoveItems: (item: string) => void = (
        item: string
    ) => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            /* マッチされないコンテンツデータを返す（例：A, B, C が localStorage データに存在しており、今回 B が削除対象だとするとマッチしないのは A, C なので A, C が（返されて）filterItems となる） */
            const filterItems: string[] = SaveDateItems?.filter(isItem => !isItem.match(item));
            _localSaved('localSaveBoxes', filterItems); // localStorage に保存
        }
    }

    return { RemoveItems }
}
```

「お気に入り解除」ボタンでは下記処理を行っています
```jsx
︙
︙
<button className="removeItems" onClick={(btnEl) => {
    btnEl.stopPropagation(); // 親要素の click イベント（モーダル表示）の実行防止
    RemoveItems(GetTargetImgNum(item, 'itemsOrigin')); // GetTargetImgNum：localStorage 内のデータと整合性を取るための加工処理
}}>お気に入り解除</button>
︙
︙
```

### 削除及び登録機能
登録済みのコンテンツを**全て手動解除**した後に改めて登録しようとすると行えない不具合にぶつかりました。そこで、上記条件の時は再読み込みするようにしたのです。
しかし、そうすると**新たにチェックしていたものがあっても再読み込みされてしまう**ため、使い勝手が悪くなってしまいました。
ですから、新たにチェックしているものが存在する場合はそれらを登録して再読み込みする形にしました。

```typescript
export const useNolocalDataButChekedExist = () => {
    const { _returnTargetElsStr } = useReturnTargetElsStr();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();
    const { ResetAllFavorite } = useResetAllFavorite();

    const _nolocalDataButChekedExist: (
        isCheckSaveData: string[],
        FirstRenderSignal: boolean,
        setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>
    ) => void = (
        isCheckSaveData: string[],
        FirstRenderSignal: boolean,
        setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
            if (isCheckSaveData.length > 0) setFirstRenderSignal((_prevFirstRenderSignal) => true);

            const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
            /* _returnTargetElsStr：条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */
            const targetElsStr = _returnTargetElsStr(checkedContents);

            /* 初回レンダリング後で、localStorage データが空で、一つもコンテンツが選択されていない場合は「（ラストワンが消えた時点で）選択されていたコンテンツ」が取り急ぎ localStorage データに保存される */
            if (
                FirstRenderSignal &&
                isCheckSaveData.length <= 0 &&
                checkedContents.length > 0
            ) {
                const getTargetItems: string[] = [...isCheckSaveData, ...targetElsStr];
                _pushLocalSaveBoxes(getTargetItems);
                _localSaved('localSaveBoxes', getTargetItems);
                setFirstRenderSignal((_prevFirstRenderSignal) => false);
                location.reload();
            } else if (
                FirstRenderSignal &&
                isCheckSaveData.length === 0 &&
                checkedContents.length === 0
            ) ResetAllFavorite(); // localStorage データの中身も、チェックされているコンテンツも全てが存在しない場合はリロード
        }

    return { _nolocalDataButChekedExist }
}
```
## `Suspense`によるローディング機能
今回のお気に入り登録機能に必須ではないのですが、コンテンツ読み込みが重くなった場合のローディング機能を`Suspense`で実装しました。
実際に使用したことがなかったので試せてよかったです。

![a507357f8c67b3ff59aee906439a19eb.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/d6e323be-101f-f1a1-b10f-9c93a7f6c05c.gif)

```typescript
︙
︙
/* Suspense の対象コンポーネント */
const SuspenseItems = memo(() => {
    ︙
    ︙
    const { data: fetchContents = [] } = useSWR(
        /* 第1引数 key は 第2引数の fetcher 関数の引数として渡される */
        fetchDataKey,
        (urlAsKey) => FetchData(urlAsKey),
        {
            suspense: true
        }
    );
    const [getFetchContentData, setFetchContentData] = useState<contentType[]>([]);
    useEffect(() => setFetchContentData((_prevgetFetchContentData) => fetchContents), [getFetchContentData]);
    const fetchContentData: contentType[] = useMemo(() => getFetchContentData, [getFetchContentData]);

    return (
        ︙
    );
});

/* Suspense を実行するエクスポート用コンポーネント */
export const Items = () => {
    return (
        <Suspense fallback={<LoadingEl />}>
            <SuspenseItems />
        </Suspense>
    );
}
```

## さいごに
ここまで読んでいただき、ありがとうございました。
今回制作した`GitHub`を置いておきますので、興味を持って下さった方は自由にご覧及び使用してください。

https://github.com/Benjuwan/favoriteItems
