# reAct-booth（`riakuto`）

[りあクト！ TypeScriptで始めるつらくないReact開発 第4版【③ React応用編】](https://booth.pm/ja/items/2367992) の個人用ハンズオンファイル及びメモ

# 注意事項
- `countdown`と`deferred`をインストール（`npm install`）する度に、不要なファイル（`.git/hooks/pre-commit`）が発生して`commit`できなくなるので、インストールした際は`commit`する前に`.git/hooks/pre-commit`を削除しておく<br />
> pre-commit フックは、変更をコミットしようとすると最初に実行され、特定のチェック、テスト、条件を実行するために使用できます

## 目次
- [簡易メモ](#簡易メモ)
- [react-hook-form](#react-hook-form)
- [countdown](#countdown)
- [deferred](#deferred)
- [presentational_container](#presentational_container)
- [react-router](#react-router)
- [Redux](#Redux)
- [useReducer](#useReducer)
- [ポストReduxの状態管理ライブラリ](#ポストReduxの状態管理ライブラリ)
- [React_v18](#React_v18)
- [番外編_GitHub_issue](#番外編_GitHub_issue)

### 簡易メモ

- （配列要素の子要素に必要な）`key`を渡すために`div`をわざわざ用意せずとも`Fragment`を使えば済む
```
import { Fragment } from 'react';

<Fragment key={n}>
  // コンポーネントや処理など...
</Fragment>
```

- インポート時に別名を付けることができる **（JSX 記法に則って先頭は大文字に）**
```
import { インポート時のデフォルトコンポーネント名 as HogeComponent } from ...
```

- 冪等（べきとう）性<br />
処理を一回、または複数回行っても結果は全て同じものである（べき）という性質

- マイクロサービス・アーキテクチャ<br />
認証や購入といった機能別に責務を区切って開発（システム的にそれぞれが独立して動くような形に）し、運用・保守もそれぞれ別々に行う手法

- エッジコンピューティング<br />
「端末の近くにサーバーを分散配置する」ネットワーク技法。CDN のようにクライアントとオリジン（サーバー）の中間点に位置する。

- チャンク（Chunk）<br />
一塊の JavaScript バンドルファイル

- json<br />
javascript object notation（JavaScript オブジェクト記法）。`key`はダブルクォート（`"key"`）で囲う。

- FID（First Input Delay）<br />
コアウェブバイタルの指標のひとつで、初回入力までの遅延時間

- FCP（First Contentful Paint）<br />
ページの読み込みが開始されてから、何らかのコンテンツの一部（スプラッシュ画面やローディングアニメーションなどでも可）が表示されるまでの時間

- LCP（Largest Contentful Paint）<br />
ページの読み込みが開始されてから`viewport`（その時点におけるブラウザウィンドウの可視領域）に掲載される最大のコンテンツ要素が表示されるまでの時間

- FMP（First Meaningful Paint）<br />
ページの読み込みが開始されてから、ユーザーにとって意味のあるコンテンツが最初に表示されるまでの時間

- ハイドレーション（Hydration）<br />
  - サーバーで生成した DOM を HTML 文字列化（SSR / SSG）
  - クライアントで HTML 文字列を DOM に復元する処理
  - 上記（サーバー・クライアント）の DOM に差異があると Hydration エラーが発生

- [`Prisma`](https://www.prisma.io/)は`Node.js`の`ORM`の1つ。
  - `ORM`<br />
  > オブジェクト関係マッピング（英: Object-relational mapping、O/RM、ORM）とは、データベースとオブジェクト指向プログラミング言語の間の非互換なデータを変換するプログラミング技法である。オブジェクト関連マッピングとも呼ぶ。実際には、オブジェクト指向言語から使える「仮想」オブジェクトデータベースを構築する手法である。
  
  > 簡単に言うと、プログラミング言語のオブジェクトで定義したメソッドで、SQLを書かずにデータベースの操作が可能なツールということです。データベースの操作や管理を仲介する役割を持っています。また、データベースの作成やマイグレーションといった操作も可能です。

  参照情報：[Prismaの導入とメリットを考える](https://qiita.com/am_765/items/5e42bd5f87b296f61fbc)

- 型注釈（type annotation）：変数にどんな値が代入可能かを指定する
- 型推論（type inference）：コンパイラが型を自動で判別する機能
- 型アサーション（type assertion）：型推論の上書き

- `never`型<br />
**「値を持たない」** を意味するTypeScriptの特別な型。`never`型には`never`型以外、何も代入できないが、`never`型はどんな型にも代入できる。
>...値を持たないはずの never 型に値を持っているstatus（string型）を代入しようとしているためです。つまりdefault 節に到達すると絶対にエラーが発生するため、それ以前に網羅チェックを行うことが強制されるのです！...
[参考記事](https://qiita.com/sosomuse/items/b7b36b95686b83ec36f4)

- リテラル型（リテラル=式）<br />
プリミティブ（基本的なデータの値：string, numberなど）型の特定の値だけを代入可能にする型（文字列リテラル型など）

- as const<br />
`as const`を付けるとプロパティが`readonly`になる

```
export const genderCode = {
  f: '女性',
  m: '男性',
  n: 'それ以外',
} as const;
```

- Promise（非同期）を使った処理に`void`を付ける

```
const load = async () => {
  .
  .
  await ...
  .
  .
};
void load(); // 返ってくる Promise をあえて無視することを明示
```

返ってくる Promise をあえて無視することを明示するために void（返却値なし）式を利用する。これを書いていないと`@typescript-eslint/no-floating-promises`ルールに引っかかる。

- カスタムフックは「変数」も返せる

```
// 変数を返すカスタムフック（useReturnStates）
︙
export const useReturnStates = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 何らかの他の処理
  setUsers(usersData); // 変数 users を更新
  setIsLoading(false); // 変数 isLoading を更新
  // 何らかの他の処理

  return { users, isLoading };
};
```

```
// カスタムフック（useReturnStates）を使用するコンポーネント
︙
const { users, isLoading } = useGetMembers();
```

- `pushState()`<br />
ブラウザのセッション履歴に任意のURLを追加

- `replaceState()`<br />
（特定の履歴）任意のURLを変更（書き換え）

- `SyntheticEvent`<br />
React の組み込みコンポーネントの`onClick`や`onChange`、`onSubmit`属性はコールバック関数が渡されると、その引数で受け取れるイベントはブラウザネイティブの各種 `Event`オブジェクトではなく、React 独自の`SyntheticEvent`オブジェクトとして扱われる。`SyntheticEvent`は各種イベント（例：`ChangeEvent`など）の基本部分のインターフェースになっている。

```
/* ev：ブラウザネイティブの各種 Event オブジェクトではなく、React 独自の SyntheticEvent オブジェクト */
<form onSubmit={ (ev) => { ev.preventDefault(); console.log(ev); }>
  <button type="submit">Submit</button>
</form>
```

### react-hook-form
これまでのフォームヘルパー（`Formik`や`React Final Form`）は **制御されたコンポーネント（state で管理されるフォーム要素のこと）** によって成り立っているため、1 文字入力するたびに state が変更されて再レンダリングが走る。<br />
一方、[`React Hook Form`](https://react-hook-form.com/)は **非制御コンポーネント（`ref`：リアル DOM を参照する属性を用いて仮想 DOM を経由せず直接フォーム要素の値にアクセスできるフォーム要素のこと）** を使っており、リアル DOM を直接更新するので入力中にコンポーネントの再レンダリングがほとんど起きない。

- カスタムリゾルバ<br />
フォーム入力値を検証するために`React Hook Form`が備える、外部ライブラリのバリデーションメソッドを用いるための仕組み。<br />
本体にもバリデーションの機能はあるが使い勝手はよくなくて、専門のスキーマバリデーションライブラリの使用が一般的。<br />
カスタムリゾルバ例：`Yup`, `Zod`, `Superstruct`, `Joi`, and so on... <br />代表例は`Yup`, `Zod`。

> `Zod`はこの中でも最後発のグループにあって `Yup`の改良版を目指したライブラリ。TypeScript ファーストで型推論も強化されてる。`React Hook Form`と組み合わせて使われてる事例が多いのはこの 2 つ。比較すると`Zod`は`Yup`と逆に項目のデフォルトが required（必須）なので、それを optional（任意）にする書き方とか、入力値がなかった場合の判定法やエラーメッセージの与え方がかなり変則的になってしまう。だから`Yup`かなと。

p36 に`Yup`と`Zod`の比較コードが記載されている。テキストでは`Yup`をカスタムリゾルバに用いた内容で以降の説明が進んでいく。

- `useForm`<br />
フォーム要素を `React Hook Form`の管理下に置くための関数などを生成する。引数としてひとつのオブジェクトを取り、そのプロパティで各種オプションを設定する。主なプロパティは下記（デフォルト値に『*』を付与）。フォームの構造は`useForm`実行時に型引数として与えるか、それがない場合は引数オプションの`defaultValues`の設定値から型推論される。

  - `mode : onChange | onBlur | onSubmit* | onTouched | all`<br />どのタイミングでバリデーションがトリガーされるか。

  - `reValidateMode : onChange* | onBlur | onSubmit`<br />エラーのある入力が再度バリデーションされるタイミング。

  - `defaultValues : { elementName: elementValue }`<br />各フォーム要素のデフォルト値。この値を適切に設定していれば型推論が効くため型引数は省略可能。

  - `resolver`<br />外部バリデーションライブラリを利用するためのカスタムリゾルバを設定する。

  - `shouldUnregister : true | false*`<br />登録していたフォーム要素がアンマウントされると同時に React Hook Form もその入力値を破棄する。

  - `shouldFocusError : true* | false`<br />フォームが送信されエラーが含まれている場合に、エラーのある最初のフィールドにフォーカスする。<br />

  ```
  const { register, handleSubmit, reset } = useForm<FormData>({
    /* defaultValues：フォームの初期値を設定 */
    defaultValues: {
      username: '',
      isAgreed: false,
    },
  });
  ```

- `useForm`の戻り値（いくつか抜粋）<br />
  - `register`<br />フォーム要素を`React Hook Form`の管理下に置くよう登録するための関数。 `ref`, `name`, `onChange`, `onBlur`の属性に対応したプロパティを含むオブジェクトが返される。<br />

  [`useForm` - `register`](https://react-hook-form.com/docs/useform/register)

  ```
  // 一般的なイメージ（最大入力数を指定するため）の`maxLength`は`input`要素の`maxLength`属性を使用すること
  <input maxLength={7}
    {...register("test", {
        maxLength: 2 // 第2引数のオプション`maxLength`はあくまでバリデーションのためのもの
    })}
  />
  ```

  ```
  /* `register`関数の戻り値には`ref`のプロパティが含まれてる。この`ref`のプロパティを（スプレッド構文で）展開してフォーム要素の属性として与えることで、非制御コンポーネントとして対応するリアル DOM を`React Hook Form`が管理下に置く */

  <Input {...register('username')} />
  <Input maxLength={7} {...register('zipcode')} />
  <Select placeholder="性別を選択…" {...register('gender')}>
  <Checkbox {...register('isAgreed')}>
  ```

  - `formState`<br />フォームの各種状態を検知するためのオブジェクト。以下のプロパティが含まれる。

    - `isDarty`<br />フォーム内容が初期値から変更されているか

    - `dartyFields`<br />初期値から変更されたフォーム要素

    - `touchedFields`<br />一度でもユーザーによる操作のあったフォーム要素

    - `isSubmitted`<br />フォームが送信されたかどうか

    - `isSubmitSuccessful`<br />フォームの送信が成功したかどうか

    - `isSubmitting`<br />フォームが送信中かどうか

    - `submitCount`<br />フォームが送信された回数

    - `isValid`<br />フォームの内容にバリデーションエラーがないかどうか

    - `isValidating`<br />フォームの内容をバリデーション中かどうか

    - `errors`<br />各フォーム要素に対応したバリデーションエラーの内容が格納されているオブジェクト

  - `watch`<br />各フォーム要素の値を監視し、変更が即時反映された値を返す関数。**コンポーネントの再レンダリングを引き起こす**ため、パフォーマンス悪化につながらないよう使用には注意が必要。

  - `handleSubmit`<br />**引数として関数を受け取り、フォームが送信されたときにフォームデータをその関数に渡して実行する**高階関数（高階関数：関数を引数に取ったり関数を戻り値として返したりする関数）

  - `reset`<br />フォームの状態をすべてリセットする関数。引数のオプション指定で部分的かつ条件をカスタマイズしたリセットが可能。

  - `setError`<br />バリデーションの結果に関わらず、手動で任意のエラーを設定できる関数。

  - `clearErrors`<br />エラーをクリアする関数。引数で指定した要素のエラーのみクリアすることもできる。

- スキーマバリデーション<br />
`register`関数の引数オプションでも入力値のバリデーションは可能だが、それらをすべて手で設定していくのは煩雑。そのため、スキーマ（構造・枠組み・特定のルール）を用意してバリデーションを行うのが一般的。

  - `Yup` のインストール<br />
  `React Hook Form`のバリデーションを`Yup`によって行う場合、`Yup`本体に加えてカスタムリゾルバのパッケージをインストールする必要がある。<br />

  [`Yup`のnpmページ](https://www.npmjs.com/package/yup)

  ```
  /* React Hook Form のインストール */
  $ npm install react-hook-form

  /* React Hook Form のリゾルバ機能のインストール */
  $npm install @hookform/resolvers // @hookform/resolvers のパッケージの中には 11 種類のスキーマバリデーションライブラリ用のカスタムリゾルバが含まれている

  /* Yup のインストール */
  $npm i yup
  // npm install yup
  ```

  <details>
  <summary> Yup を使用した記述</summary>

  ```
  /* もともとのコード */
  interface FormData {
    username: string;
    zipcode?: string;
    gender?: keyof typeof genderCode; // ['f', 'm', 'n"]
    isAgreed: boolean;
  }


  /* Yup を使ったスキーマを記述したコード */
  import * as yup from 'yup';
  import { genderCode } from './constants';
  import type { InferType } from 'yup'; // InferType：定義したスキーマオブジェクトから型を推論してくれる
  
  /* regFormSchema：定義したスキーマオブジェクト */
  export const regFormSchema = yup.object({
    username: yup.string().required('必須項目です'),
    zipcode: yup.string().max(7).matches(/\d{7}/, '7 桁の数字で入力してください'),
    gender: yup.mixed().oneOf(Object.keys(genderCode)),
    isAgreed: yup.boolean().oneOf([true], '同意が必要です').required(),
  });

  /* RegFormSchema：定義したスキーマオブジェクト（regFormSchema）から型を推論 */
  export type RegFormSchema = InferType<typeof regFormSchema>;
  ```

  </details>

  `Yup`で定義したスキーマオブジェクトと、その型を用いて`React Hook Form`にフォームバリデーションをさせるためのコードは`react-hook-form/src/components/ValidRegistrationForm.tsx`を参照。

### countdown

- タプル：`useTimer.pre.ts`<br />
関数は本来 1関数につき 1値しか返せないが複数の値を配列（に格納する形）で返せる仕組みがあり、そうして返される値をタプルという。タプルはそれぞれの値の型を指定できる（例：[string, number, boolean]）

- stopPropagation()：`useTimer.pre.ts`<br />
子要素のクリックイベント発火に伴う、親（祖先）要素のクリックイベント発火連鎖を防止

- useRef：`Timer.tsx`<br />
「useRef で定義した値は .current という書き換え可能なプロパティを持つ。それを組み込みコンポーネントの ref に入れておくと、React がリアル DOM を出力した際にその対応する要素を参照する値が.current の中に設定される 

```
const inputRef = useRef<HTMLInputElement | null>(null);
const onClick = () => inputRef.current?.focus();
```

### deferred

- useDeferredValue：`ProfileWriter.tsx`<br />
React v18 から導入された`Concurrent Rendering`による緊急性を考慮した更新の反映方法の一つである`Urgent Update`（キー入力やクリック、要素の選択といった操作を即座に反映させる）を実現させる API。<br />
あらかじめ任意の state 更新における緊急性をマークしておくことで、緊急性の低い更新を必要に応じて遅らせることができる機能。遅延する値（`deferedUsename`）を適用するコンポーネント（Users）をメモ化して依存配列にその値を入れる必要がある。

```
/* 遅延する値（deferedUsename）を適用するコンポーネント（Users）をメモ化して依存配列にその値を入れる必要がある */
  const deferredUsers = useMemo(
    // フォームテキストを更新するためのレンダリングが優先されて、プロフィール情報の更新のレンダリングが遅延される
    () => <Users username={deferedUsename} count={count} />,
    [deferedUsename, count]
  );
```

### presentational_container

- Presentational Component<br />
表象的なコンポーネント。デザインや見た目といったレンダリング面を担っている。`Container Component`から`props`で渡ってきたデータを描画したりなど。

- Container Component<br />
表象的なコンポーネント（`Presentational Component`）を包含（import）したコンテナのようにそれを入れて動かすコンポーネント。`Presentational Component`に渡す`props`のデータを用意するなどロジック面を担っている。

- Atomic Design<br />
コンポーネント設計のための考え方（UI デザインの手法）で、UI の構成要素を 5 段階に分類し、それに化学のアナロジーで名前をつけるというもの。

  - Atoms（原子）<br />ボタンやツールチップのような、それ以上分割できない最小の UI 構成要素（アプリケーションを横断して再利用できるようにすることが考慮された単位）

  - Molecules（分子）<br />複数の`Atom`を組み合わせて構成する UI パーツの単位（アプリケーションを横断して再利用できるようにすることが考慮された単位）

  - Organisms（有機体）<br />`Atom`と`Molecules`を組み合わせて構築される、特定の役割に特化したパーツ。再利用性は個々のアプリケーションの中に閉じててかまわない。

  - Templates（テンプレート）<br />下位のパーツ（`Atom`, `Molecules`, `Organisms`）を使って画面のレイアウトを行う。画面全体のワイヤーフレームのようなもので、それ自身が具体的なコンテンツやスタイルを持たない。

  - Pages（ページ）<br />ユーザーに表示される最終的な画面であり、特定の`Templates`をひとつだけ持ち、そこに具体的なコンテンツを流し込む。

- `Molecules`と`Organisms`の境界線は「 **ドメイン知識（関心領域）** を持つ」かどうか

> たとえばフライトの予約システムを作ってるなら、そのアプリケーションのドメインはフライトの予約ということになる

- アプリケーションを横断して再利用できるようにすることが考慮された単位である`Atom`と`Molecules`では、余白（`margin`, `padding`）や位置（`top`,`right`,`bottom`,`left`,`translate`の値など）といった **レイアウト関連の指定は`props`として渡す（設定する）方が再利用性が高まる**。

- [`Bulletproof React`](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)<br />
TypeScript で React アプリケーションを開発するのためのベストプラクティスが詰まってるサンプルコードで、広く開発者の間で支持を集めている。ディレクトリ構成が秀逸。

```
src/ assets/
  components/
  config/
  features/
  awesome-feature/ api/
        assets/
        components/
        hooks/ ← feature/ awesome-feature/ api/ の Custom Hook 
        routes/
        stores/
        types/
        utils/ ← feature/ awesome-feature/ api/ のコンポーネント
  hooks/ ← feature に該当しない共通の Custom Hook 
  lib/
  providers/
  routes/
  stores/
  test/
  types/
  utils/ ← feature に該当しない共通のコンポーネント
```

- ユニオンで使用する場合、関数の型の表記はかっこで囲む必要がある

```
type btnProps = {
    btnTxt?: string | HTMLElement | ReactNode;
    method: undefined | (() => void); // ユニオンで使用する場合、関数の型の表記はかっこで囲む必要がある。() => void → (() => void)
    anyClassName?: string;
}
```

### react-router
`npm install react-router-dom`<br />
`React Router`のインストールでは、v 6.0 から`react-router-dom`のパッケージひとつを入れるだけでよくなった。

- React Router 注意事項<br />
  - 1：ルーティングパスのマッチングは `switch-case`文のような排他的マッチングではなく **すべての`Route`コンポーネントの`path`値による設定を評価した上で「ベストマッチのものが選択」** される。

  - 2：`<Routes>`の中で`<Route>`は入れ子にできて、**すべてのパスは相対的**になる。<br />注意事項としてトップルートでのインデックスのパスは`/`だが（index には`index 属性`とルートコンポーネント(`element={<App />}`)、ルートパス(`path='/'`)を指定）。<br />`<Route path='/' index element={<App />} />`<br /><br />それ以外は頭に`/`を付けてはならない。2 階層目でもそのルートのパスは空文字にしないといけない。うっかり`/about`とか書かない。

  - 3：パスの記述で気をつけたほうがいい点
    - 末尾に`/`をつけても無視される
    - 一般的な`glob`や正規表現は使えない
    - ワイルドカード`*`のみ使用可だが、記述できるのは末尾のみ
    - 大文字・小文字を区別したい場合は`Route`コンポーネントに `caseSensitive`属性を指定する

  - 4：`<Outlet>`について<br />子ルート要素のコンポーネントをレンダリングするために用意しておくプレースホルダー的なコンポーネントが`<Outlet>`。パスがネスト元`Route`のパス名だった場合は`<Outlet />`には何もレンダリングされないので、それを避けるなら子ルートにインデックスパスでリダイレクト（例：`<Route path="*" element={<Navigate to="/" replace />} />`）させるなり、`Not Found`ページを表示させる（当該 `Route` 階層の【パスエントリーの最後に`*`を置く】 例：`<Route path="*" element={<PostNotFound />} />`）なりする必要がある。<br /><br />または、その他の方法としてネストする場合は`<Route index />`に `element`が指定されていない場合は記述不要（=`Outlet`の index は無し）。`element`が「指定されていないこと」によって警告エラーが表示されるため。

  - 5：サブディレクトリ指定の場合はパスに記述する（例：`ドメインまたはサブドメイン/サブディレクトリ/path-string`）<br />ルート直下に dist ファイルの中身を置く場合はパスはルート始点（topページの場合：`'/'`）（ページ指定の場合：`'/directory/PageComponent'`）でOK.

```
import { BrowserRouter, Routes, Route } from "react-router-dom";
︙
︙
{/* router / App 関連のコンポーネント */}
<BrowserRouter>
  <Routes>
    /* index パスコンポーネント（TOPページ）*/
    <Route path='/' index element={<App />} />

    /* 2 階層目のコンポーネント（サブページ類）*/
    <Route path="archive-hoge" element={<MainHoge children={
      <>children の内容</>
    } />} />
    <Route path="hogeSinglesComponents" element={<HogeSingles />}>
      /* element が「指定されていないこと」によって警告エラーが表示されるため <Route index /> の記述は無し */

      /* サブページの子ページのパス名：hogeSinglesComponents/single-XXXX */
      <Route path="single-Foo" element={<HogeFoo />} />
      <Route path="single-Piyo" element={<HogePiyo />} />
      <Route path="single-John" element={<HogeJohn />} />
      <Route path="single-Potie" element={<HogePotie />} />
      <Route path="single-Carie" element={<HogeCarie />} />
      <Route path="single-Gory" element={<HogeGory />} />
    </Route>

    /* 各種 2 階層目のコンポーネント（サブページ類）*/
    <Route path="archive-service" element={<MainService />} />
    <Route path="archive-staff" element={<MainStaff />} />
    <Route path="archive-other" element={<MainOther />} />
    <Route path="about" element={<MainAbout />} />
    <Route path="contact" element={<MainContact />} />

    /* すべての Route コンポーネントの path 値による設定を評価した上で「ベストマッチのものが選択される仕組み」なので、パスエントリーの最後に * を置く */
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
{/* router / App 関連のコンポーネント */}
```

- `replace`属性<br />
`replace`属性が有効になっていると変更前の`location`の履歴が`history`に残らない。

```
import { NavLink } from "react-router-dom";

/* Navigate コンポーネント：今現在そのパスにマッチする場所にいるかどうかを属性に渡せる特殊なバージョンの<Link> */
<NavLink
  to="/about"
  style={({ isActive }) =>
    isActive ? { textDecoration: "underline" } : undefined // その引数のプロパティ isActive がパスにマッチしてるときは true 
  }
>
このサイトについて
</NavLink>

<NavLink
  to="/faq"
  className={({ isActive }) =>
    isActive ? 'active' : undefined // その引数のプロパティ isActive がパスにマッチしてるときは true 
  }
>
FAQ
</NavLink>
︙
︙
︙
︙
import { useNavigate, Navigate } from 'react-router-dom';
/* Navigate コンポーネント：それが【レンダリングされた時】に移動が発生する */
<Route path="*" element={<Navigate to="/" replace />} />
︙
︙
const navigate = useNavigate();
/* navigate 関数：Navigate コンポーネントと同じ働きをする。それが【実行された時】に移動が発生 */
<button onClick={() => navigate('/', { replace: true })}>跡形もなくトップへ</button>

<button onClick={() => navigate(-1)}>戻る</button> // 引数に数値を渡すと『戻る・進む』系の操作になる
```

たとえば、上記設定のアプリで`/nowhere`というパスにアクセスすると最後までどのルーターパスにもマッチせずトップにリダイレクトされる。この際、`replace`属性が有効になっていると`/nowhere`にアクセスした歴史が残らない
`/nowhere`にアクセスしてトップにリダイレクトした後にブラウザバックすると`/nowhere`の前に閲覧したページ（が表示される）まで戻る。

- `React Router`使用時は`<a>`タグは使用しない<br />
`<a>`タグを使って書くと、そのリンクを踏んだ時点で`React Router`の管轄外となり**管理していた履歴がすべて消えて**しまう。（Webサーバにリクエストが飛んで**SPAのコード全体がリロードされる**ことになるため）

- `Link`コンポーネント<br />
```
/* to 属性には 2 種類の値が渡せる。
 * パスの文字列（絶対パスでも相対パスでもok）
 * history パッケージ で定義されてる Path インターフェースの各要素をオプション化したオブジェクト（パス名の他にクエリパラメータやハッシュも設定できる）
*/

<Link to={{
    pathname: '/contact',
    search: '?from=here'
    hash: '#subject',
  }}
  state={{ secretCode: '8yUfa9KECH' }} // ユーザーに見せたくない情報を state 属性に埋め込んでリンク先に受け渡すことも可能
>
  お問い合わせ
</Link>

/* replace 属性も設定可能 */
```

- ホスティング時の重要事項<br />
`.htaccess`に以下を記述（一旦ルートの index に差し戻してパスを指定・つなぎなおす形に）しないと、うまくルーティングしてくれない。

```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

  - .htaccessに記述を追加する理由<br />
  そもそも「ルーティング」とは、Webブラウザでドメインの後に指定されたパスに応じて必要な情報をWebブラウザに提供することを指しており、通常このルーティングの処理は「Webホスティングをしているサーバー側」で行っている。<br />従って、Webブラウザでドメインの後にパスを記述した場合、通常は「サーバにその情報が送られてWebホスティングをしているサーバーが処理」しようとする。<br />ところが、React のアプリは「Webブラウザ上で動いている（CSR：Client Side Rendering）」<br />それ故に（TOPページ以外の）任意のページを表示しようとしても（Webブラウザ上で動作しているため）サーバーはその場所を見つけられないのでエラー（404）に。<br />そのためルーティングをきちんと行わせるには、Webホスティングしているサーバーに設定（上記`.htaccess`への記述）をする必要がある。

- keyof typeof：`AllPlayers.tsx`

```
const SORT = {
  height: '身長順',
  grade: '学年順',
};
type Props = {
  sortType?: 'height' | 'grade'; // keyof typeof SORT
  my?: number | string;
}
```

- typeof 配列[indexNumber]：`types.ts`

```
typeof SCHOOL_CODE[number]; // 'shohoku' | 'ryonan' | 'kainandai';
```

- [`react-helmet-async`](https://github.com/staylor/react-helmet-async)<br />
HTMLヘッダの中でなくても任意のコンポーネントの中で `<title>`タグを置いてドキュメントのタイトルを変更できるようにするパッケージ。「`<title>`だけじゃなく`<meta>`とか`<link>`とかドキュメントヘッダに置けるものは全部置ける。これを使うにはルートでプロバイダコンポーネントを設定する必要がある。

```
import { HelmetProvider } from 'react-helmet-async';
const Providers: FC<PropsWithChildren> = ({ children }) => (
<HelmetProvider>
<ChakraProvider>
<Router>{children}</Router>
</ChakraProvider>
</HelmetProvider>
);
export default Providers;
```

※`React Helmet`というパッケージが本家だが、更新が 2020 年 6 月で止まってて、React 18 の非同期レンダリングに対応してないので、使用するのは`react-helmet-async`。

### Redux
* Flux
  * Store …… アプリケーション全体で参照するための状態データ（`State`）を一元管理する保管庫
  * Action …… イベントにおける『何をどうしたいか』という意図を表現したもの
  * Dispatcher …… `Action`の種類を判別して、それにひもづけられた`Store`の更新処理を行うもの

- **Flux は単方向データフローを実現するためのアーキテクチャ**<br />「Flux では状態は `Store` と呼ばれる保管庫に格納され、`View` からは書き込み不可で参照のみを行うことができる。<br />`Action` という『何をどうしたいか』という意図を表現したオブジェクトを、`Dispatcher` に対して発行する。すると `Dispatcher` が `Action` の種類を判別して、それに対応したあらかじめ定められている手順通りに `Store` の任意の状態を変更する。`Store` が書き換えられれば、参照していた `View` にも速やかに反映される。<br />書き換え手続きをこのように限定することでデータフローが常に単方向になることが保証される。

* Redux
  * Store …… アプリケーション全体で参照するための状態データ（`State`）を一元管理する（`State`の）保管庫
  * Action …… イベントにおける『何をどうしたいか』という意図を表現したもの
  * Dispatcher ……  `store` の構造や状態については一切関知しない。その名のとおり役割が `action` を `reducer` に送りつける（＝ dispatch）ことだけに限定されたもの
  * Reducer …… 状態を更新する 純粋関数。`Action` と現在の `State` を受け取って新しい `State` を生成する（`(prevState, action) => newState`）

- **Redux は Flux よりシンプルに記述できる状態管理ライブラリ**<br />
<details>
<summary>Redux の現状</summary>

> Redux はまだまだ多くのプロジェクトに現役で使われていて、純粋にその数だけなら圧倒的だけれども、今日ではアプリケーションでグローバルな状態を扱うのに必ずしも Redux を使う必要がないし、常に Redux がその最適解とも言えない。

> アプリケーションにとって重要なデータの管理をトップで独占的に行い、下々のコンポーネントはそれを拝領するのみという中央集権型ではなく、宣言的に記述された個々のコンポーネントが自律的かつスマートに必要なデータを取り扱う地方分権型のアーキテクチャ。本家がそちらの方向に進みつつある中、Single Source of Truth を標榜する典型的な中央集権型の Redux は少しずつ収まりが悪くなってきてる

</details>

- Redux の構造とワークフロー<br />
`View`から（`Action Creator`関数を通じて）「意図表現」した`Action`（チケットのようなもの）が発行されて、そのチケットを`Dispatcher`（読み取り機のようなもの）に渡す。その機械（`Dispatcher`）を通って「チケットに記載されていた機能・処理」が`Reducer`（実施機）へ送られて実施され、`Store`内にある「チケット記載の処理にマッチした`State`が更新」されて`View`に反映される。

- 「Redux で **`store` の状態を変更するための唯一の方法は、どんなイベントが起こったかを表現する `action` を発行する**こと。変更手段を `action` だけに集約し、厳密にひとつずつ処理するようにすることで、書き換えの競合や予期せぬ書き換えを防ぐことができる。Redux の `action` は単なるプレーンオブジェクトなので、ログを取って後で状態の変化を再現することも簡単にできる。

- Redux では `store` は状態を格納するひとつのステートツリーと、それを更新するための `Reducer` という純粋関数で表現される装置から構成されている。<br /> `reducer` は極限まで抽象化すると`(prevState, action) => newState`のような式になる。

- **Redux を導入するのに必要なパッケージは次の 2 つ**。`Redux` 本体と [`React Redux`](https://react-redux.js.org/)。後者は Redux を Reactにバインディングするための公式ライブラリ（Redux は React 専用ではなく、Angular や Vue など各種ライブラリでも利用できるため React仕様を設定する必要がある）

- `useSelector`<br />
`store` から任意の state の値を抽出するための（Redux の提供する Hooks）API。コールバックが引数になっていて、それが state を受け取ってそこから必要な値を抜き出して返す。一般的にセレクト関数と呼ばれるもの。<br />第 1 引数（`CounterState`）が `store` の state ツリー全体の型、第 2 引数（`number`）が抽出する state 値の型になっている。

```
/* reducer.ts で 指定 */
export interface CounterState {
  count: number;
}
export const initialState: CounterState = { count: 0 };
/* reducer.ts で 指定 */

const count = useSelector<CounterState, number>((state) => state.count);
```

- ミドルウェア（Middleware）<br />
外部から `dispatcher` を拡張して `Reducer` の実行前後に任意の処理を追加できるようにするための Redux が持つ仕組み
> ... View から Action Creator 経由で Action が発行されて、それが Dispatcher によって Reducer に渡される。そして Reducer が`(prevState, action) => newState`のような形で一意に State を更新し、それが View に反映されるという Redux の仕組みにおいて、ミドルウェアはこの Dispatcher に機能を追加する働きを持つ...

```
import { createStore, applyMiddleware } from 'redux';
import awesomeMiddleware from 'awesome-middleware';
import { reducer, initialState } from './reducer';

/* createStore の第 3 引数に、Redux の dispatch() 関数をラップした処理が記述されたミドルウェアのオブジェクトを渡す形 */
const store = createStore(reducer, initialState, applyMiddleware(awesomeMiddleware));
```

- `useDispatch`<br />
`action` を `dispatcher` に渡すための関数を取得する（Redux の提供する Hooks）API。得た関数を`dispatch({ type: 'INCREMENT' }) `のように `action` を引数にしてコールすれば、INCREMENT タイプの `action` が dispatch されるようになっている。<br />実使用はバグやタイポ防止などのために`dispatch(increment()) `のように記述して、生の `action` オブジェクトを dispatch するんじゃなくて`action creator`関数で生成したものを使う。

- `Object.keys()`<br />オブジェクトの`key（プロパティ）`を取得して配列にする
- `Object.values()`<br />オブジェクトの`value`を取得して配列にする

```
/* ColorfulBeads.tsx */
const colors = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'blue',
  'cyan',
  'fuchsia',
  'purple',
  'pink',
  'brown',
  'silver',
  'black',
];

const ColorfulBeads: FC<{ count?: number }> = ({ count = 0 }) => (
  <Wrap my={10}>
    {
      /* 
       * [...Array(count).keys()]：Array(count)を作成し、その後その配列のインデックスを列挙するために.keys()を使用。これにより、0から-1までの連続した整数の配列が生成される 
       * [...Array(count)].keys() だと Array(count)のインデックスを直接取得しようとするので意図した挙動にならないため注意。
      */
    }
    {[...Array(count).keys()].map((n) => (
      <Fragment key={n}>
        <Circle size={12} color={colors[n % colors.length]} />
      </Fragment>
    ))}
  </Wrap>
);
```

- [`Immer`](https://immerjs.github.io/immer/)：オブジェクトのイミュータブルな更新を簡単にしてくれるライブラリ

```
import produce from 'immer';
const updatedArticle = produce(article, (draftArticle) => {
  /* オブジェクトのプロパティをメソッドチェーン形式で記述して更新することができる */
  draftArticle.comments[213974].body = 'You are a genius!';
});
```

React 公式ドキュメントで、ネストが深いオブジェクトの更新では `Immer` を使うことが推奨されている。state の階層が深くなったときとか、`reducer` で state のピンポイントな更新処理を書くのに `Immer` はかなり有効。

> [!NOTE]  
> スプレッド構文によるシャローコピーは **（対象部分の）第一階層部分** しか複製されない。そもそも`JavaScript（TypeScript）`ではオブジェクトの **ネストされたプロパティまでを含んだ[ディープコピー](https://developer.mozilla.org/ja/docs/Glossary/Deep_copy)ができない** 。※対処療法として[`structuredClone()`メソッド](https://developer.mozilla.org/ja/docs/Web/API/structuredClone)がある。

#### ReduxToolKits
Redux は使用において『必要とされる定型構文が多くて、コードの記述量がやたらと増える』というデメリットがあった。そこで、Redux の開発チームが効率的で快適な DX を開発者に提供しようと考えてリリースされたのが`Redux Toolkit`（RTK）。

> Redux の概念の上に応用されてるものだから敷居が高く感じてる初心者が多そうだけど、実は初心者こそ恩恵が大きいツールだってことがもっと広く理解されてほしいね。

* RTK が提供している主要な API は次の 4 つ
  * configureStore …… 各種デフォルト値が設定可能な createStore のカスタム版（今の`Redux`では`createStore`単体を使う書き方は非推奨）。デフォルトで最初から`Redux DevTools`の設定がされてるので何もしなくても`Redux DevTools`が使える
  * createReducer …… `reducer` の作成を簡単にしてくれる
  * createAction …… `action creator` を作成する
  * **createSlice …… action の定義と `action creator`, `reducer` をまとめて生成できる（ので必然的に`Ducks`パターンに準拠する）**

- `Ducks`パターン<br />
サービスの関心領域（ドメイン）ごとに`action`や`action creator`、`reducer`をひとつのファイルにまとめて書くデザインパターン。<br />デメリットとしては、ひとつのファイルが大きくなりがちという部分があるが、`createSlice`を使えばその欠点も解消できる。

```
/* Feature フォルダ */
src/
  features/
    user/
      user-actions.ts
      user-reducer.ts
    article/
      article-actions.ts
      article-reducer.ts
︙

/* Ducks パターン */
src/
  ducks/
    user.ts
    article.ts
︙
```

- `action` と `reducer` のロジックを統合したもののことを Redux Toolkit では`Slice`と呼ぶ。

- `createSlice`の実例

```
export const counterSlice = createSlice({
  name: 'counter', // action の定義
  initialState,

  /* action creator, reducer をまとめて生成 */
  reducers: {
    /* action：add */
    added: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },

    /* action：decremented */
    decremented: (state) => {
      if (state.count > 0) {
        state.count--;
      }
    },

    /* action：incremented */
    incremented: (state) => {
      state.count++;
    },
  },
});
```

- RTK での Store の設置

```
/* index.tsx */
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import { counterSlice } from 'stores/counter';

/* configureStore */
const store = configureStore({ reducer: counterSlice.reducer });

const Providers: FC<PropsWithChildren> = ({ children }) => (
  <HelmetProvider>
    <ChakraProvider>
      /* store */
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ChakraProvider>
  </HelmetProvider>
);
︙
```

-  RTK Query<br />
`action` でデータ取得ができてかつその値をキャッシュ管理できる機能
> それまではデータ取得のような非同期処理を Redux で扱うには `createAsyncThunk`という API が用意されてたんだけど使い勝手が悪くて開発者の評判も芳しくなかった。だからそれは非推奨にして今後は RTK Query を全力で推していく方針

### useReducer
- useReducer<br />
`Redux`で行っていた「`action`と`reducer`によるアプリケーションを包括するグローバルな状態（`State`）の管理」を個別のコンポーネントで可能にする Hooks API。

```
const [state, dispatch] = useReducer(reducer, initialState);
```

- RTK は useReducer でも使用可能
> 余計なコードを書きたくないので、useReducer を使うときは私は RTK の createSlice で action や reducer を生成させるようにしてる

- useReducer を使用するメリット
> コンポーネントの機能が複雑化してくると state の数が増え、ある state の更新ロジックが別の state を参照するようになる。2 つくらいならともかく、たくさんの state が更新時に相互参照し、さらにそれが useEffect の副作用処理の中で行われたりすると人間の頭では追いつかなくなって、予期せぬ更新が予期せぬ場所で起きるカオスな状態に陥りがちになる

上記のような事態に対して、**useReducer を使えばコンポーネントの state を Redux のようにシングルツリーのオブジェクトに格納して、その中身を `reducer` によって副作用を排除しつつ更新できる**ようになる。

> note
>
> - Hooks のオブジェクト（テキスト：p152～154）<br />
> `Fiber`というレンダリングのためのアーキテクチャがあり、`Fiber`には`React Elements`に対応する**差分検出やデータ更新、再描画のスケジューリングといった作業のための最小単位としての意味**もある。
> コンポーネント内で（React が提供している公式の）Hooks API を使用すると、仮想 DOM にマウントされた`React Elements`に対応する`Fiber`が確保してるメモ化された領域の中にその Hooks のオブジェクトが作られ、それらが**コールされた順番に連結リストとして格納**される。<br /><br />
> Hooks API の呼び出しがこれらのどの Hooks オブジェクトに対応するかは**連結リストの順番によって照合される**ため、もし**再レンダリング時に呼び出しの順番が変わるようなことがあるとこの参照がズレて**しまう。そのため、Hooks API の使用はコンポーネントの論理階層の**トップレベルで行い、条件文やループの中で使ってはならない**ルールがある。
>
>
> * Hooks のオブジェクトはそれぞれ固有の state を持っている<br />
> Hooks のオブジェクトはそれぞれ固有の state を持っていて、対応する Hooks API コールが返す値はそこへの参照となっている。
>
>
> * useReducer の動き<br />
> useReducer は state を Redux ライク（※全く同じ仕組みではない）な action と reducer を使った仕組みで更新する（= ひとつの state ごとに小さな Redux をポコポコ作ってコンポーネントに付与し、React によるレンダリングの仕組みと結びついた仕組みになっている）。<br /><br />
> 具体的には、`Fiber`が確保してるメモ化された領域の中にある**各 Hooks のオブジェクトごとが持つ dispatch 関数に action を渡して実行**する。すると、それが直後に reducer に渡されるのではなく、**各 Hooks オブジェクトごとが持つ「更新キュー」に発行した action が追加**されていく。そして React の差分検出エンジンが最適化されたタイミングで**そのコンポーネントの再レンダリングを実行すると描画の直前にキューの中に溜まってた action が reducer へ渡され、キューの数だけ`(prevState, action) => newState` が実行された最終結果が state へ反映**される。
> 
> * useState の場合<br />
> 戻り値として useReducer における dispatch 関数の代わりに setter 関数を返す仕組みだが、その実体は **setter action だけを発行する専用の dispatcher** であり、対応する Hooks オブジェクトの動作は上記と全く同じ。useState の実体はひとつの setter action だけを持つ useReducer。つまり機能を限定した useReducer。
>
>
> ここまでの説明は、p153 の「図 29: Fiber における Hooks の動作メカニズム」を見ながらの方が理解促進に有益。  
>

### ポストReduxの状態管理ライブラリ
> （Redux や Create React App などの作成者である）Dan 先生曰く『React の公式な状態管理ライブラリは React 自身』なんだそう

- Zustand（ザスタンド）<br />
Flux パターンをシンプルに Hooks インターフェースで実装したもので、`store`が single source（唯一の情報源：一元管理）ではなくて個別に分かれており、`reducer`のようなものも存在しない。トップ階層にプロバイダコンポーネントを置かなくても機能するし、バンドルサイズが軽量なのも特徴。<br />
Redux 同様にミドルウェアのしくみを備えていて、本体パッケージの中に`LocalStorage`への永続化、`Redux DevTools`対応、state 操作への Immer の適用といったミドルウェアが含まれてる。

```
︙
import create from 'zustand'; // zustand の読込

/* BearState の中身（型）*/
interface BearState {
  bears: number;
  increaseBear: () => void; // 返却値なしの関数
  removeAllBears: () => void; // 返却値なしの関数
}

/* BearState を更新するカスタムフック */
const useBearStore = create<BearState>((set) => ({
  bears: 0, // 初期値設定
  increaseBear: () => set((state) => ({ bears: state.bears + 1 })), // 1つインクリメント
  removeAllBears: () => set({ bears: 0 }), // 0 に変更（上書き）
}));

/* bears の個数を反映するコンポーネント */
const BearCounter: FC = () => {
  const bears = useBearStore((state) => state.bears); // bears の個数を設定（初期値0）

  return (
  <div>
    {/*（オブジェクトの）bears の個数（キー・プロパティ）を配列形式にして、個数分の「🐻アイコン（熊のアイコン）」を表示 */}
    {[...Array(bears).keys()].map((n) => (
      <span key={n} role="img" aria-label="bear">🐻</span>
    ))}
  </div>
  );
};

/* bears の個数を更新（追加・削除）するボタンコンポーネント */
const CountButtons: FC = () => {
  const increaseBear = useBearStore((state) => state.increaseBear); // インクリメントのメソッドを設定
  const removeAllBears = useBearStore((state) => state.removeAllBears); // 全削除のメソッドを設定

  return (
  <div>
    <button onClick={increaseBear}>One Up</button>
    <button onClick={removeAllBears}>Clear</button>
    </div>
  );
};

const App: FC = () => (
  <div className="App">
  <h1>Hello Bears!</h1>

  {/* bears の個数を更新（追加・削除）するボタンコンポーネント */}
  <CountButtons />

  {/* bears の個数を反映するコンポーネント */}
  <BearCounter />
  </div>
);

export default App;
```

- Recoil<br />
`Atom`という最小限の更新・購読可能な状態を分散して持つ仕組みで、`atom`は`key`によって一意に識別され、アクセスできるようになっている。Redux のように`action`で更新手続きを登録しておくようなことはできない（※ Atom Effect を使えば可能だが扱いづらいそう）。

```
import { atom } from 'recoil';
  const fontSizeState = atom({
    key: 'fontSizeState', // atom という（疑似的な）State の中の key を操作する
    default: 14,
  });
```

`atom`の操作には`useRecoilState`という Hooks API を使用。`useRecoilState`に引数として渡す`atom`オブジェクトは異なるものであっても、`key`が同じなら参照する state 値が同じになるため`key`が重複しないように注意する。

```
import { useRecoilState } from 'recoil';
︙
const FontButton: FC = () => {
  /* 作成した atom を引数に指定（キーと初期値を含んだ atom オブジェクトを渡す）*/
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);

  return (
    <button onClick={
      /*（引数に指定した）atom の key の値（default）を更新して style にセット */
      () => setFontSize((size) => size + 1)
    } style={{ fontSize }}>
      Click to Increase the Font Size
    </button>
  );
};
```

任意の`atom`を加工して（読み取り専用の）データとして取り回すには`Selector`を使用する。

```
import { selector } from 'recoil';
const fontSizeWithUnit = selector({
  key: 'fontSizeWithUnit',
  get: ({ get }) => {
    const fontSize = get(fontSizeState); // fontSizeState（atom）を取得して変数に代入
    const unit = 'px';
    return `${fontSize}${unit}`; // 任意の atom の値と設定した単位（unit）をテンプレートリテラルで文字列として返す（返却例：'14px'）
  },
});

︙
︙
︙
// コンポーネントでの使用例
import { useRecoilState, useRecoilValue } from 'recoil';
︙
const FontButton: FC = () => {
  /* 作成した selector（fontSizeWithUnit）を引数に指定（get で取得した結果：実物のオブジェクトを渡す）*/
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  const fontSizeWithUnit = useRecoilValue(fontSizeWithUnit);

  return (
  <>
    <div>Current Font Size: {fontSizeLabel}</div>
    <button onClick={
      () => setFontSize((size) => size + 1)
    } style={{ fontSize }}>
    Click to Increase the Font Size
    </button>
  </>
  );
};
```

Recoil の懸念点<br />
> ... useRecoilState だけ使うにはいいけど、それ以外の API を積極的に使う気にはなれないかな。しかもそれだけ使うには 23KB というバンドルサイズは大きすぎるし。Meta 謹製なのに伸び悩んでるのは、多くの開発者も私と同じように考えてるからじゃないかな...GitHub のリポジトリがずっと facebookexperimental というところに置かれてて、最初のリリースから 2年以上たってもまだバージョンが 1.0 に到達してないのも懸念材料。Meta 製とはいえ、コントリビュートの大半がひとりの開発者に依ってるのは他のライブラリと変わらないし、このままどこかでプロジェクトが止まってしまう可能性だって小さくないと思う...

- Jotai<br />
Recoil と同じく`atom`を用いた仕組みだが、Recoil より痒い所に手が届くようなライブラリ。<br /><br />
・`atom`という最小限の単位の状態を分散管理する仕組み<br />
・トップレベルにプロバイダコンポーネントを必要としない（使用することも可能）<br />
・`key`で特定するのではなく生成した`atom`オブジェクトを取り回す<br />
・任意の`atom`を使って新しい読み取り専用の`atom`を生成できたり（derived atom）、セット関数をユーザーがカスタマイズできて、かつその中で他の`atom`の state 値を変更できたりもする<br />
・バンドルサイズが 3.4KB と軽量<br /><br />

Qiita の下記記事が分かりやすい。<br />

[初学者でも分かるようにJotaiを丁寧に解説していく](https://qiita.com/moritakusan/items/9a5e8c315b2565a02848)


#### 昨今の状態管理の事情

> フロントエンドの都合にバックエンドのほうが柔軟に合わせる思想が広まってる。GraphQL の普及はその文脈に沿うものだし、Firebase や AWS Amplify に代表される BaaS（Backend as a Service）も広く使われるようになってきた

- GraphQL<br />
RESTful API が抱える問題を解決するために作られた、データの参照・操作・スキーマ定義のための言語仕様を含んだ規格。フロントエンドが直接バックエンドにクエリ（処理要求）を発行して、その時々に必要なデータ（API）を柔軟に取得できるような働きを持つ。

- [Firebase](https://firebase.google.com/?hl=ja)<br />
Google が提供するモバイル Web アプリケーションプラットフォーム。GCP（Google Cloud Platform）上に構築されており、データベースの Cloud Firestore、Firebase Authentication によるユーザー認証、Web に静的ファイルを展開できる Firebase Hosting など数々の開発者向けサービスがパッケージとして提供されている。

- [AWS Amplify](https://aws.amazon.com/jp/amplify/)<br />
Amazon が AWS 上で提供しているアプリケーション開発のためのフレームワークおよび Web ホスティングサービス。

- Apollo Client
「昨今の状態管理の事情」の流れや、クエリ単位の結果を必要に応じてキャッシュすればこと足りるという思想のもと台頭してきたライブラリ。GraphQL との相性が良い。<br />
特徴としては、Apollo Client はもともと Redux を包含する形で構築されていたものの独立して状態管理システムを持つようになった経緯がある。ローディング状態やエラー状態を管理してくれる上、データはキャッシュベースで取り回され、そのキャッシュは Apollo Client  が勝手に正規化してくれたり、`mutation`（`GraphQL`のデータ更新系のクエリ）を発行すればレスポンスがサーバから返ってくる前にキャッシュを先に更新してくれたりする。<br />
そのデータがリモートにあるのかローカルにあるのかをあまり意識することなく、`GraphQL`のクエリ自体が状態にひもづいてコンポーネント内で扱える、つまり個々のコンポーネントがサーバとシームレスに連携して状態を管理できる。<br /><br />

Apollo Client は `SWR`や`React Query`、クエリキャッシュを Redux に統合できるようにした`RTK Query`の登場のきっかけを作ったそう。

- [`SWR`（stale-while-revalidate）](https://swr.vercel.app/ja)：まずキャッシュからデータを返し（stale）、次にフェッチリクエストを送り（revalidate）、最後に最新のデータを持ってくるという、データ取得のための React Hooks ライブラリ。Vercel が 2019 年 10 月にリリース。

> 1：該当データにアクセスしたとき、キャッシュされた値があってその取得日時が任意の許容期間内ならいったんそのキャッシュ値を返す。そしてその裏でサーバにリクエストを行い、その取得したデータ内容に変更があればキャッシュを更新し、もう一度あらためてその値を返す<br /><br />2：該当データにアクセスしたとき、キャッシュされた値がなかったり、あったとしてもその取得日時が任意の許容期間を過ぎていたら、直接サーバにリクエストしてデータを取得しその値を返す。さらにその後、そのデータをキャッシュしておく

### React_v18
**素の React で SSR を行うのは難易度が高い**。公式も SSR したければ Next.js や Remix などのフレームワークの使用を推奨（一般的になっている）している。

- この章のテキストファイル`concurrent-ui`では`GitHub API`を使用しているが、`GitHub API`を認証なしで使おうとすると 1 時間に 60 回のアクセスまでという制限があるので注意

- React v18 以前<br />
`Blocking Rendering`というコンポーネントのレンダリング方法で、一度始まると
中断できない、割り込み不能で同期的なものだった。

- React v18 以降<br />
`Concurrent Rendering`という方法に置き換わった。これは、一度始まったレンダリングを中断して他のレンダリングを実行したり、停止していたレンダリングを再開したり、破棄したりすることもできるようになった。<br />
各コンポーネントのレンダリングを適宜中断、再開、破棄するなどして、それぞれの緊急性の高さなども考慮に入れつつ全体のレンダリングを適切にスケジューリングしてくれる。一度にひとつのレンダリングしかできないが、擬似的（＊1）にレンダリングの並列化を図っている。<br />

> ＊1：Concurrent Processing（並行処理）とは、OS とかで**単一の計算リソースを時系列で細切れにして複数のタスクに割り当てることによって擬似的にマルチタスク処理を実現すること**をいうのね。一度に実行できるタスクは実際にはひとつだけだけど、うまいことスケジューリングしてシステムの応答性を改善するというところがミソ

React 18 では、ユーザーの体感パフォーマンス（UX）の向上を方針にしていて、そのための具体的なソリューションを提供している。ただし、それらの中には**最初に設定だけしておけば後は何もせずともその恩恵に授かれるもの**もあれば、**使いどころを見極めて適切に利用しないといけないもの**もある。<br /><br />

たとえば、`Concurrent Rendering`では外部と通信してデータを取得するにあたって、そのデータを表示するコンポーネントのレンダリングをサスペンド＆レジュームできるようになったが、それには`Suspense`というコンポーネント API と、それに対応したデータ取得ライブラリを使う必要がある。

- `createRoot`

```
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

`root`オブジェクトには`render`メソッドに加えて`unmount`メソッドも実装されていて、それによって任意のタイミングで DOM ノードから削除できる。

- Strict Mode<br />
アプリケーションの潜在的な問題を開発者に警告するためのもの。`React.Fragment`と同様 UI のレンダリング結果には影響しないし、開発環境でしか有効にならず本番用のビルドにも影響しない（が、React 18 では開発環境で`useEffect`や`useLayoutEffect`使用時に 2回レンダリングという挙動を見せる）

- Automatic Batching<br />
デフォルトで有効。都度再レンダリングが起きていた処理（更新）もすべて React がうまいことスケジューリングしてバッチ処理で一括更新してくれるようになった。

```
︙
setTimeout(() => {
  /* v18 以前は下記のような疑似的な遅延・非同期処理では都度再レンダリングが起きていた（※setTimeout を使っていない場合は一括レンダリングしてくれる）*/
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}, 1000);
︙
```

`Automatic Batching`によって、特に何もしなくても再レンダリングが最小限に抑えられるようになった。<br />
`Automatic Batching`をキャンセルする手段も用意されていて、`flushSync`を使用するとキャンセルできる。

```
︙
setTimeout(() => {
  /* flushSync：意図的に state を都度更新して再レンダリングさせることができる */
  flushSync(() => setCount((c) => c + 1));
  flushSync(() => setCount((c) => c + 1));
  flushSync(() => setCount((c) => c + 1));
}, 1000);
︙
```

- Suspense<br />
`Suspense`は、マウントされているかどうかが未定の状態のコンポーネントを仮登録しておくための機能（コンポーネントに読込 / レンダリング前後の状態を与えられる）

```
/* React 16.6 のころからある React でコンポーネントを dynamic importt（動的インポート）する例 */

import { lazy, Suspense } from 'react';
const Other= lazy(() => import('./Other'));

const App = () => (
  <div>
  /* サスペンドさせたいコンポーネントを囲って使用する。サスペンド中は fallback の中にある記述（コンポーネント）がレンダリングされる */
  <Suspense fallback={<div>Loading...</div>}>
    <Other />
  </Suspense>
  ︙
  </div>
);

/*
 * lazy と Suspense を使うことで、そのコンポーネントが必要になった時にオンデマンドでそのファイルが（サスペンドさせたいコンポーネント）遅延して読み込まれる仕組み
*/
```

- `useTransition`と`startTransition`<br />
`Transition Update`（UI がある状態から別の状態に遷移する際に意図的に遅らせる）を実現するために React 18 から提供された API。任意の更新が、緊急性が低いということをマークしておくために使用する。

```
import { useState, useTransition } from 'react';
︙
const App: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [isPending, startTransition] = useTransition(); // ペンディング中かどうかの Boolean 値

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation(); // 親・祖先要素の（クリック）イベント発生防止

    /* startTransition は直接 react パッケージからインポート可能（ペンディング中かどうかの Boolean 値が不要の場合は直接インポートして使用しても良い）*/
    startTransition(() => {
      setCount((c) => c + 1);
    })
  };

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
};
```

- Profiler API<br />
React 本体に装備されている、コンポーネントのレンダリング回数と各種の計測時間を取得する機能

<details>
<summary>コードの詳細</summary>

```
/* index.tsx */
import React, { Profiler } from 'react';
import App from './src/App';
import profilerOnRender from './src/profilerOnRender';

root.render(
  <Profiler id="user" onRender={profilerOnRender}>
    <App />
  </Profiler>
);


/* profilerOnRender.ts */
import type { ProfilerOnRenderCallback } from 'react';

let COUNT = 1;

const profilerOnRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log(`${phase} (${COUNT++}) --------`);
  console.log(`startTime: ${startTime}`);
  console.log(`actualDuration: ${actualDuration}`);
  console.log(`commitTime: ${commitTime}`);
};

export default profilerOnRender;


/* getPosts.ts */
import type { Post } from '../types';

export const getPosts = async (userId: number): Promise<Post[]> => {
  console.log('******** getPosts start! *********');
  const posts = await (
    await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts?_delay=1500`)
  ).json();
  console.log('******** getPosts done! *********');

  return posts;
};


/* UserPosts.tsx / UserProfile.tsx */
import React, { Suspense } from 'react';
︙
import useSWR from 'swr';
︙

export const UserPosts: FC<{ userId: number }> = ({ userId }) => {
  /* ここで非同期処理を行っている */
  const { data: posts = [] } = useSWR([userId, 'posts'], getPosts, {
    suspense: true,
  });
  ︙
  ︙
  ︙

export const UserProfile: FC<{ userId: number }> = ({ userId }) => {
  /* ここで非同期処理を行っている */
  const { data: user = null } = useSWR([userId, 'profile'], getUser, {
    suspense: true,
  });

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
    </div>
  );
};


/*
log に出力される内容

mount (1) --------
startTime: 463.5
actualDuration: 0.4000000059604645
commitTime: 464.09999999403954
++++++++ getUser start !++++++++
++++++++ getUser done !++++++++

update (2) --------
startTime: 1999.0999999940395
actualDuration: 0.4000000059604645
commitTime: 1999.5
******** getPosts start! *********
******** getPosts done! *********

update (3) --------
startTime: 4079.199999988079
actualDuration: 0.5999999940395355
commitTime: 4079.7999999821186
*/
```

</details>

- Render as You Fetch（フェッチしながらレンダリングする）<br />
従来はフェッチしてからレンダリングするというサイクル（`Fetch on Render`：レンダリングした上でフェッチする）で、子要素を持つ場合には **親要素の上記サイクルが完了してから** でないと **子要素はサイクルを実行できなかった**。つまり、階層が深くなるほど所要時間が直線式に増えていってしまう状態（階段状に水が滴り落ちるように見えるので「Waterfall問題」とも呼ばれる）だった。<br/>
`Render as You Fetch`では、<br />1：コンポーネントのレンダリングが始まった時点でデータの取得が行われる。<br />2：そして（`Suspense`で当該コンポーネント囲っている場合） **データの取得が終わってないのでそのレンダリングはサスペンド** される。<br />3：次に、親のレンダリングの完了（サスペンド解除）を **待たずに** 子要素のレンダリングが始まり、そこでも親と同様に **データの取得** が行われる。結果、親コンポーネントの`fallback`がレンダリングされる（サスペンド状態を表示する）よりも早く親子のデータ取得が行われる。<br />4：最後に、データ取得が完了したコンポーネントからサスペンドが解除されて（`Suspense`で囲っていたコンポーネントが）レンダリングされる（完了次第レンダリングという並列的処理＝`Concurrent Rendering`）。<br /><br />
`Render as You Fetch`だと上記の仕様でレンダリングされるのでページの読込が（理論上）早くなり UX が向上する。<br /><br />
しかし、**一連の処理をアプリケーション開発者自らが書くのは障壁が高い**のでフレームワークや`suspense`に対応しているライブラリを使用する。

- `suspense`に対応しているライブラリ
  - [`SWR`（stale-while-revalidate）](https://swr.vercel.app/ja)<br />
  まずキャッシュからデータを返し（stale）、次にフェッチリクエストを送り（revalidate）、最後に最新のデータを持ってくるという、データ取得のための React Hooks ライブラリ。Vercel が 2019 年 10 月にリリース。

  > 1：該当データにアクセスしたとき、キャッシュされた値があってその取得日時が任意の許容期間内ならいったんそのキャッシュ値を返す。そしてその裏でサーバにリクエストを行い、その取得したデータ内容に変更があればキャッシュを更新し、もう一度あらためてその値を返す<br /><br />2：該当データにアクセスしたとき、キャッシュされた値がなかったり、あったとしてもその取得日時が任意の許容期間を過ぎていたら、直接サーバにリクエストしてデータを取得しその値を返す。さらにその後、そのデータをキャッシュしておく

  - `useSWR`のインターフェース

  ```
  const { data, error, isValidating, mutate } = useSWR(key, fetcher, options);
  ```

    - 引数（key, fetcher, options）
      - `key`<br />データ取得クエリおよびその結果を保存するキャッシュを一意に特定するキー。文字列やタプル、オブジェクト、配列及びそれらを返す関数が設定できる。また `null`や`undefined`, `false`を渡すとデータ取得が行われない。

      - `fetcher`<br />データ取得を行うための非同期関数。型推論によりこの関数の戻り値の型が`data`に適用される。

      - `options`<br />オプション設定オブジェクト。 20 種類以上のプロパティがあり、キャッシュや再試行、エラー時の挙動などが設定できる。なお`suspense`プロパティを有効（`{suspense: true}`）にしないと`Suspense`対応で動作しない。

      ```
      /* options 例 */
      {
        suspense: true, // suspense を有効に
        revalidateOnFocus: false, // SWR では画面にフォーカスが外れてから再度当たるとデフォルトで再リクエストが飛んでキャッシュが書き換わるのでそれを無効に
        dedupingInterval: 60000, // 同じキーでのリクエストはキャッシュの寿命を 60 秒に
        shouldRetryOnError: false, // エラー時の再試行は行わない
      }
      ```

    - 戻り値（data, error, isValidating, mutate）<br />※`Suspense`で使う際は`data`以外あまり活用する機会はない。
      - `data`<br />`fetcher`関数によって取得された、もしくは`key`によってヒットしたデータ。存在しない場合は`undefined`になる。

      - `error`<br />`fetcher`関数によって throw されたエラーオブジェクト。

      - `isValidating`<br />リクエスト中または再検証の読み込み中に true になる。

      - `mutate`<br />キャッシュされたデータを更新するための関数。

  `key`が falsy な値だとデータ取得が行われない性質を利用して、`Conditional Fetching`（条件付きフェッチ）という技が使える。`shouldFetch ? 'myKey' : null`のように三項演算子を設定したり、複雑な条件を判断してキー値または`null`を返す関数を渡したりすれば、任意の条件に合致したときだけ`useSWR`にリクエストを開始させることができる。

  > ユーザーによる値の入力後にリクエストを開始したり、その値がフォーマットに適合しなかったらリクエストを控えたりといった場合に使えそうですね

  - `useSWR`の使用例<br />
  自分で用意した使用例：[codeSandBox](https://wwr8hs.csb.app/)。<br />読み込み時に左上に「loading」が出てから各コンテンツが表示される。

  `useSWR`では、**第1引数`key`は第2引数の`fetcher`関数の引数**として渡される。

- プリフェッチ（`prefetch`）<br />
リクエストされる可能性が高いコンテンツをあらかじめ読み込んでおいて、いざリクエストがあったときに即座にそのコンテンツを表示できるようにしておくこと

> 最近のブラウザにも`HTML`のヘッダに`<link rel="prefetch" href="...">`のような記述があるとアイドル中にその URL を先読みしてキャッシュする機能が備わってる

> `Next.js`の`<Link>`コンポーネントに実装されてる機能で、`prefetch`属性が有効になってると、そのリンクが`viewport`に入った時点でプリフェッチされる

#### 番外編_GitHub_issue
- `GitHub`での`issue`の使用方法について<br />
  - 当該リポジトリの`issue`ページに移動（`Issues`をクリック）し、`New issue`をクリック
  - issue制作ページで`title`や`description`に`issue`内容を明記し、`Submit new issue`をクリック
  - `issue` が用意されるので、当該`issue`を含んだブランチを作成および移動して作業を行い、あとはいつもの流れでPR.

  ```
  $ git checkout -b ”topic-#issue 番号” // ←必ず当該 issue 番号を入れる（紐づける）
  $ git push -u origin ”topic-#issue 番号”
  $ git branch -vv // ブランチ確認（別にしなくても良い）
  /* 編集作業 */
  $ git add . // ← git status から 作業ファイルを選んで add でももちろん ok
  $ git commit -m "〇〇を修正 topic-#issue 番号" ←必ず当該 issue 番号を入れる（紐づける）
  $ git push
  ```
  - `push`後はいつも通りのPR作業を行い、`issue`ページに移動して当該`issue`をクローズする。