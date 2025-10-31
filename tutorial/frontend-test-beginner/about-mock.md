## モック（テストダブル）
外部システムやAPIなどこちらでコントロール不能なものをテスト対象に含む場合、テストの安定性を確保するためにモックを活用する。<br>
モックは**取得したデータまたはコンポーネントなどの代用品**で、関連するシステムやAPIが提供する本来の機能をエミュレート（模倣・再現）する。これにより、外部システムの状態に依存せずに一貫したテスト環境を構築できる。

### モックの種類
#### スタブ
スタブの主な目的は**代用を行う**こと。例えば「Web APIからこんな値が返ってきた場合にはこのように動作する」という挙動テストや「未実装機能・未実装APIデータのアタリ」といったケースでスタブを使用する。テスト対象がスタブにアクセスすると、スタブは定められた値を返す。

- データや依存コンポーネントの代用品
- 定められた値を返却するもの
- テスト対象に**入力**を与えるためのもの

#### スパイ
スパイの主な目的は**挙動・振る舞いの記録を行う**こと。コールバック関数を一例とすると、スパイは実行されたコールバック関数の**実行回数や実行時引数を記録**するので、意図通りの呼び出し（振る舞い）かどうかをチェックできる。

- 関数・メソッドの呼び出しを記録するオブジェクト
- 関数・メソッドの実行回数や実行時引数を記録するもの
- テスト対象からの**出力**を確認するためのもの（テスト対象にどのような入出力が生じたかをチェック）

#### Jestでのモック使用方法（`jest.mock`, `jest.fn`, `jest.spyOn`）
Jestではスタブ・スパイを機能別に分けておらず、**モックモジュール（`jest.mock`）**や**モック関数（`jest.fn`, `jest.spyOn`）**というAPIを利用する。

##### `jest.mock`関数
- 引数に指定した対象モジュールのエクスポートは自動的に`jest.fn()`（オートモック）に置き換わり、 **戻り値のデフォルトは`undefined`** となる。第二引数には**代用品に実装を施す関数**を記述できる
- 戻り値を変えるには： `mockReturnValue`, `mockResolvedValue`, `mockRejectedValue`, あるいは `mockImplementation`を使用する
  - 戻り値変更例の実装コード：
  ```ts
  import { greet } from "./greet";

  jest.mock("./greet");

  test("挨拶を返さない（本来の実装ではない）", () => {
    // as jest.Mock： TSのテストコード実施で型を合わせる必要があるため型推論の上書きをしている
    (greet as jest.Mock).mockReturnValue(1234);
    expect(greet("Taro")).toBe(1234);
  });
  ```

> [!NOTE]
> - `jest.Mock`：<br>
> 実行（ランタイム）時には存在しなくなるTypeScript上の型（interface）。`jest.fn()`が返す関数の型

##### `jest.spyOn`関数
- 第一引数には「オブジェクト」を、第二引数には「メソッド名」を指定する
- TypeScriptと親和性が高い
- デフォルトでは元の実装を「呼び出す（call through）」ため、戻り値は元の実装の結果になる
  - 元の実装を変えたい場合に `mockImplementation`/`mockReturnValue` を設定する。必要に応じて`mockRestore` で元に戻せる
  - 戻り値変更例の実装コード：
  ```ts
  const obj = { greet: (n: string) => `Hello ${n}` };

  jest.spyOn(obj, 'greet'); // ここではデフォルトで元実装を呼ぶ
  expect(obj.greet('Taro')).toBe('Hello Taro');

  (obj.greet as jest.Mock).mockReturnValue('Hi'); // 処理結果の上書き（'Hi'となるように設定）
  expect(obj.greet('Taro')).toBe('Hi');
  ```

#### スタブの実装例
- 対象コード
```ts
export function greet(name: string) {
  return `Hello! ${name}.`;
}

export function sayGoodBye(name: string) {
  throw new Error("未実装");
}
```

##### 対象モジュールの置き換え処理
`jest.mock`関数を冒頭で呼び出し、対象モジュールを引数に指定することで**当該モジュールの置き換え（挙動・振る舞いの上書き）が完了**する。<br>
※`jest.mock`関数を使用した際（は`jest.fn`に置き換わり） **戻り値のデフォルトは`undefined`** となるので`undefined`を返すようになる。

```ts
import { greet } from "./greet";

jest.mock("./greet");

test("挨拶を返さない（本来の実装ではない）", () => {
  // 期待される挙動・振る舞いは"Hello! Taro."だが`undefined`を返すようになった
  expect(greet("Taro")).toBe(undefined);
});
```

- モジュール本来の実装を`jest.requireActual`関数でインポートする（呼び出す）<br>
`jest.mock`関数を使用した際（は`jest.fn`に置き換わり） **戻り値のデフォルトは`undefined`** となるため、以下のテストコードは失敗する。
```ts
import { greet } from "./greet";

jest.mock("./greet");

// 挙動は正しいのにテストで落ちる
test("挨拶を返す（本来の実装どおり）", () => {
  expect(greet("Taro")).toBe("Hello! Taro.");
});
```

`jest.requireActual`関数を使って本来の実装を呼び出す。これでテストが通る。
```ts
import { greet } from "./greet";

jest.mock("./greet", () => ({
  // 本来の実装をインポート
  ...jest.requireActual("./greet"),
}));

test("挨拶を返す（本来の実装どおり）", () => {
  expect(greet("Taro")).toBe("Hello! Taro.");
});
```

##### 関数を指定して対象モジュールの挙動・振る舞いを変更（置換）する
`jest.mock`の第二引数には**代用品に実装を施す関数**を指定する。以下`sayGoodBye関数`を置き換えてみる。
```ts
import { sayGoodBye } from "./greet";

// 第二引数に「代用品に実装を施す関数」を指定
jest.mock("./greet", () => ({
  sayGoodBye: (name: string) => `Good bye, ${name}.`,
}));

test("さよならを返す（本来の実装ではない）", () => {
  const message = `${sayGoodBye("Taro")} See you.`;
  expect(message).toBe("Good bye, Taro. See you.");
});
```

##### ライブラリの置き換え
これまでは自前実装をメインにした話だったが、フロントエンド開発では多くのライブラリを用いるのが一般的になっている。<br>
**ライブラリの代用という目的でモックモジュールを利用するケースは多い**のでテストする際は**対象ライブラリ（またはコミュニティ）が提供する代用実装ライブラリ**を調べてみる。<br>
以下はNext.jsの`next/router`という依存モジュールに対し、コミュニティから提供されている`next-router-mock`という代用実装ライブラリを適用している例。

```ts
jest.mock('next/router', () => require('next-router-mock'));
```

> [!NOTE]
> モジュール読み込み方法には、`import`が使えるESM（ES Modules）と`require`で読み込むCJS（Commom JS Modules）がある。
> 上記「ライブラリの置き換え」では`require`を使っているのでCJS（Commom JS Modules）の書き方となる。
> 他方、ESMの場合は`import`を使用してテスト冒頭で`jest.mock`を呼び出す。

---

### Web API におけるモック活用
一般的にWeb APIクライアント実装では、`Axios`やWeb標準の`Fetch API`が用いられる。

- 今回対象となる事例コード
```ts
import { getMyProfile } from "../fetchers";

export type Profile = {
  id: string;
  name?: string;
  age?: number;
  email: string;
};

export async function getGreet() {
  const data: Profile = await getMyProfile();
  if (!data.name) {
    return `Hello, anonymous user!`;
  }
  return `Hello, ${data.name}!`;
}
```

- Web API クライアントのスタブ実装コード

#### `mockResolvedValueOnce`
データ取得が一度だけ成功（`resolve`）したとして、期待するレスポンス相当のオブジェクトを引数に指定して検証を行うためのメソッド

#### `mockRejectedValueOnce`
データ取得が一度だけ失敗（`reject`）したとして、期待するエラークラス（インスタンス）を引数に指定して検証を行うためのメソッド

> [!NOTE]
> - `mockResolvedValue`, `mockRejectedValue`との違い
>   - `mockResolvedValue` / `mockRejectedValue` を使うと「すべての呼び出しに対して同じ動作を設定」できる
>   - `mockResolvedValueOnce` / `mockRejectedValueOnce` は「呼び出しごとに異なる結果を設定」できる

```ts
import { getGreet } from ".";

// fetchers/index.ts で定義している関数・メソッドを一括で呼び出し`Fetchers`という名前で使用する
import * as Fetchers from "../fetchers";
import { httpError } from "../fetchers/fixtures";

// fetchers/index.ts で定義している関数・メソッドを代用品に置き換える
jest.mock("../fetchers");

describe("getGreet", () => {
  test("データ取得成功時：ユーザー名がない場合", async () => {
    // getMyProfile が resolve した時の値を再現
    jest.spyOn(Fetchers, "getMyProfile").mockResolvedValueOnce({
      id: "xxxxxxx-123456",
      email: "taroyamada@myapi.testing.com",
    });
    await expect(getGreet()).resolves.toBe("Hello, anonymous user!");
  });

  test("データ取得成功時：ユーザー名がある場合", async () => {
    jest.spyOn(Fetchers, "getMyProfile").mockResolvedValueOnce({
      id: "xxxxxxx-123456",
      email: "taroyamada@myapi.testing.com",
      name: "taroyamada",
    });
    await expect(getGreet()).resolves.toBe("Hello, taroyamada!");
  });

  test("データ取得失敗時", async () => {
    // getMyProfile が reject した時の値を再現
    jest.spyOn(Fetchers, "getMyProfile").mockRejectedValueOnce(httpError);
    // toMatchObject マッチャー： オブジェクトの持つプロパティが部分一致するかどうか
    await expect(getGreet()).rejects.toMatchObject({
      err: { message: "internal server error" },
    });
  });

  // 例外スローを検証したい場合
  test("データ取得失敗時、エラー相当のデータが例外としてスローされる", async () => {
    expect.assertions(1);
    jest.spyOn(Fetchers, "getMyProfile").mockRejectedValueOnce(httpError);
    try {
      await getGreet();
    } catch (err) {
      expect(err).toMatchObject(httpError);
    }
  });
});
```

<details>
<summary>fetchers/index.ts</summary>

```ts
import type { Article, ArticleInput, Articles, Profile } from "./type";

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
}

const host = (path: string) => `https://myapi.testing.com${path}`;

export function getMyProfile(): Promise<Profile> {
  return fetch(host("/my/profile")).then(handleResponse);
}

export function getMyArticles(): Promise<Articles> {
  return fetch(host("/my/articles")).then(handleResponse);
}

export function postMyArticle(input: ArticleInput): Promise<Article> {
  return fetch(host("/my/articles"), {
    method: "POST",
    body: JSON.stringify(input),
  }).then(handleResponse);
}
```

</details>

####  Web API のモック生成関数
動的なレスポンスデータをテストする場合はモック生成関数を利用する。

- 今回対象となる事例コード
```ts
import { getMyArticles } from "../fetchers";

export type Article = {
  id: string;
  createdAt: string;
  tags: string[];
  title: string;
  body: string;
};

export type Articles = {
  articles: Article[];
};

export async function getMyArticleLinksByCategory(category: string) {
  // データを取得する関数
  const data: Articles = await getMyArticles();
  // 取得したデータのうち、指定したタグが含まれる記事に絞り込む
  const articles: Articles = data.articles.filter((article: Article) =>
    article.tags.includes(category);
  );

  if (!articles.length) {
    // 該当記事がない場合、null を返す
    return null;
  }

  // 該当記事がある場合、一覧向けに加工したデータを返す
  return articles.map((article) => ({
    title: article.title,
    link: `/articles/${article.id}`,
  }));
}
```

今回、各種記事のアタリデータが必要なので以下のフィクスチャーを用意して使用する<br>
※フィクスチャー：（Web API から取得するデータなど）レスポンスを再現するためのテスト用データ（アタリ）のこと

<details>
<summary>フィクスチャー：fetchers/fixtures.ts</summary>

```ts
import type { Article, Articles, HttpError } from "./type";

export const httpError: HttpError = {
  err: { message: "internal server error" },
};

export const getMyArticlesData: Articles = {
  articles: [
    {
      id: "howto-testing-with-typescript",
      createdAt: "2022-07-19T22:38:41.005Z",
      tags: ["testing"],
      title: "TypeScript を使ったテストの書き方",
      body: "テストを書く時、TypeScript を使うことで、テストの保守性が向上します…",
    },
    {
      id: "nextjs-link-component",
      createdAt: "2022-07-19T22:38:41.005Z",
      tags: ["nextjs"],
      title: "Next.js の Link コンポーネント",
      body: "Next.js の画面遷移には、Link コンポーネントを使用します…",
    },
    {
      id: "react-component-testing-with-jest",
      createdAt: "2022-07-19T22:38:41.005Z",
      tags: ["testing", "react"],
      title: "Jest ではじめる React のコンポーネントテスト",
      body: "Jest は単体テストとして、UIコンポーネントのテストが可能です…",
    },
  ],
};

export const postMyArticleData: Article = {
  id: "xxxxxxx-123456",
  createdAt: "2022-07-19T22:38:41.005Z",
  tags: ["testing", "react"],
  title: "Jest ではじめる React のコンポーネントテスト",
  body: "Jest は単体テストとして、UIコンポーネントのテストが可能です。",
};
```

</details>

##### モック生成関数
テストで必要なセットアップを必要最小限のパラメーターで切り替え可能にしたユーティリティ関数（＝任意の自作関数）<br>
※引数`status`はHTTPステータスコードを示唆するもの

```ts
// `status`のデフォルト値は200（成功処理） 
function mockGetMyArticles(status = 200) {
  // 失敗処理ルート： 300/リダイレクト や 400/クライアントエラー、500/サーバーエラーの場合
  if (status > 299) {
    return jest
      .spyOn(Fetchers, "getMyArticles")
      .mockRejectedValueOnce(httpError);
  }

  // 成功処理ルート
  return jest
    .spyOn(Fetchers, "getMyArticles")
    .mockResolvedValueOnce(getMyArticlesData);
}
```

<details>
<summary>上記モック生成関数 mockGetMyArticles を用いたテストコード例</summary>

- テストコード例 1
```ts
test("指定したタグをもつ記事が一件もない場合、null が返る", async () => {
  mockGetMyArticles();
  const data = await getMyArticleLinksByCategory("playwright");
  expect(data).toBeNull();
});
```

- テストコード例 2
```ts
test("指定したタグをもつ記事が一件以上ある場合、リンク一覧が返る", async () => {
  mockGetMyArticles();
  const data = await getMyArticleLinksByCategory("testing");
  expect(data).toMatchObject([
    {
      link: "/articles/howto-testing-with-typescript",
      title: "TypeScript を使ったテストの書き方",
    },
    {
      link: "/articles/react-component-testing-with-jest",
      title: "Jest ではじめる React のコンポーネントテスト",
    },
  ]);
});
```

- テストコード例 3
```ts
test("データ取得に失敗した場合、reject される", async () => {
  mockGetMyArticles(500);
  await getMyArticleLinksByCategory("testing").catch((err) => {
    expect(err).toMatchObject({
      err: { message: "internal server error" },
    });
  });
});
```

</details>

### モック関数を使ったスパイ
主に記録を担う[スパイ](#スパイ)を用いて、記録された値を検証することで意図した挙動・振る舞いかをチェックできる。

- `jest.fn`を使ってモック関数を作成<br>
作成したモック関数はテストコードで関数として使用する。
```ts
const mockFn = jest.fn();
```

#### モック関数は**関数定義の中に忍ばせる**こともできる
- `toHaveBeenCalledTimes`：何回実行されたか検証するマッチャー
```ts
test("モック関数は関数の中でも実行できる", () => {
  const mockFn = jest.fn();
  function greet() {
    mockFn();
  }
  greet();
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```