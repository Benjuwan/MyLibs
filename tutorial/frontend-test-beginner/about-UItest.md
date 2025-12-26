## UIコンポーネントテスト
MPAと異なり、SPAでは再利用性を考慮してコンポーネント指向ベースの開発が主流となる。

- MPA（Multi Page Application）：<br>
複数のHTMLページとHTTPリクエストで構築されるWebアプリケーション

- SPA（Single Page Application）：<br>
1枚のHTMLページ上にWebアプリケーションを展開し、操作や変更に応じて部分的に表示を差し替えていく（再レンダリング）。具体的には、Webサーバーがレスポンスした初回ページのHTMLを軸とし、ユーザー操作によってHTMLを部分的に置き換えていく ──この置き換える部分・単位＝UIコンポーネントとなる。

---

昨今フロントエンド開発で主流なReact（Next.js）はコンポーネント指向で、各コンポーネントを組み合わせて一つの機能やページを構成する仕組みを採っている。<br>その性質上、一部の不具合が他の部分にも影響する可能性があるので、UIコンポーネントテストもまた重要なテストとなる。

### UIコンポーネントの基本機能
- データの表示（描画）
- インタラクションの伝播（ユーザー操作へのリアクション）
- 関連するWeb APIの連携・接続
- データを動的に置き換え（再レンダリング）

主に**意図した挙動・振る舞い**かどうか、**リグレッションが発生**していないかどうかがチェック項目となる。

#### Webアクセシビリティ
挙動や振る舞いの検証、レイアウト崩れの他、支援技術に対するチェックも重要となる。ユーザーの心身特性に隔てなくWebが利用できる水準であるWebアクセシビリティを順守し、どのようなユーザーにも安定したクオリティを提供する必要があることから、Webアクセシビリティに関するテストも意識しておく。<br>
例えば、見た目を意識しすぎてチェックボックス（`input`要素）をCSSで消去（非表示化）してしまうなどが代表的な失敗例。

### UIコンポーネントテストで利用するテスティングフレームワーク・ライブラリ
#### [jsdom](https://www.npmjs.com/package/jsdom)
バックエンド（サーバーサイド）での JavaScript 実行環境である`Node.js`上で、HTMLやDOM操作を実現するライブラリ。<br>これにより、ブラウザがなくてもWebブラウザの一部機能をエミュレートできるため、ウェブアプリケーションのテストやスクレイピングなどに利用できる。

##### 使用するには別途インストールして設定する必要がある
- インストール<br>
**Jestで使う場合、Jest 28以降では`jest-environment-jsdom`も別途必要**
```bash
npm install --save-dev jsdom

# ※Jestで使う場合は、Jest 28以降では jest-environment-jsdom も別途必要
npm install --save-dev jest-environment-jsdom
```

- 各種設定
```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  // または
  testEnvironment: 'jest-environment-jsdom',
}
```

> [!NOTE]
> - Next.jsのようなフルスタックフレームワークの場合<br>
> テストファイル冒頭で以下のコメントを記述することでテストファイルごとにテスト環境を切り替えられる
```ts
/**
 * @jest-environment jest-environment-jsdom
 */

// または

/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
// テストコード...
```

#### [Testing Library](https://testing-library.com/)
UIコンポーネントのテスト用ライブラリ。<br>
基本原則として**テストがソフトウェアの使用方法に似ている**ことを推奨していて、具体的にはクリックやマウスホバー、キーボード入力など**Web操作と同じようなテストを書く**ことを推奨している。

---

主な役割は次の3つとなる。

- UIコンポーネントをレンダリング（描画）する
- 描画した要素から、任意の子要素を取得する
- 描画した要素に、インタラクションを与える

##### Reactで実装している場合
React向けの[`@testing-library/react`](https://www.npmjs.com/package/@testing-library/react)を利用する。

- インストール
```bash
# React Testing Library本体
npm install --save-dev @testing-library/react

# カスタムマッチャー（`toBeInTheDocument`など）
npm install --save-dev @testing-library/jest-dom

# ユーザー操作シミュレーション
npm install --save-dev @testing-library/user-event

# ※上記 jsdom セクションでインストール及び各種設定済みの場合は以下コマンドは不要
# Jest環境（Jest 28以降は必須）
npm install --save-dev jest-environment-jsdom
```

- 各種設定（**React16＊＊以降**）<br>
すべてのテストで自動的に`jest-dom`マッチャーが使用可能になるよう設定する。

- `setupTests.ts`
```ts
import '@testing-library/jest-dom';
```

- `jest.config.js`
```ts
module.exports = {
  testEnvironment: 'jsdom',
  // 先ほど設定した`setupTests.ts`を指定
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
```

> [!NOTE]
> Testing Library は他にも様々なUIコンポーネントライブラリに向けて提供されているが、中核となるAPIは同じもの（[`@testing-library/dom`](https://www.npmjs.com/package/@testing-library/dom)）を使用する<br>
> そのため、**UIコンポーネントライブラリが違っても、同じようなテストコードになる**<br>
> **※`@testing-library/dom`は`@testing-library/react`の依存パッケージなので明示的にインストールする必要はない**

##### カスタムマッチャーを利用してテストの検証精度を高める
UIコンポーネントのテストでもJestのアサーションやマッチャーを利用できるものの、DOMの状態を検証するにはJest標準だけでは不十分な場合がある。そのため[`@testing-library/jest-dom`](https://www.npmjs.com/package/@testing-library/jest-dom)をインストールして、Jestの拡張機能であるカスタムマッチャーを扱えるようにする。`jest-dom`によって、UIコンポーネントテストに便利なマッチャーが多数追加される。

##### インタラクションを検知する
Testing Library には、各種イベントハンドラー検知を目的とした`fireEvent`というAPIが用意されている。<br>
`fireEvent`では指定した単一のイベントのみが実行されるが、実際にユーザがボタンをクリックすると clickイベントだけではなく pointerDownイベント、mouseOverイベントなど様々なイベントが連続して発生する。<br>
`userEvent`を利用するとそれらの一連のイベントシーケンスも実行されて、ユーザがブラウザ上で行う操作と同じ処理を再現することができる。<br>
つまり、[`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event)を追加することで**実際のユーザー操作に近いシミュレーションを行える**ようになる。<br>
こうした理由から`fireEvent`ではなく、よりユーザー行動に即した形でイベントをトリガーできる`@testing-library/user-event`の使用が推奨されている。

> [!NOTE]
> `userEvent`API を利用する場合は`@testing-library/user-event`から import する必要があります
```ts
import userEvent from "@testing-library/user-event";
```

- **`userEvent`では`async/await`が必須**<br>
**`userEvent`のメソッドは非同期**なので必ず`await`する

- **`userEvent.setup()`の使用を推奨（初期化処理）**<br>
各テストでインスタンスを作成するのがベストプラクティス。**必ず各テストの最初に呼ぶこと**

- **`fireEvent`との違い**<br>
`fireEvent`は同期的、`userEvent`は非同期的かつよりユーザー操作に近い動作をシミュレート

###### インタラクション（機能・操作）テスト
※**セットアップ関数**という特定テスト（関連挙動）をまとめたカスタムフック / ヘルパー関数的なものを用意するのが一般的。

- セットアップ関数例：
```js
function setup() {
  // アサーション用のモック関数
  const onClickSave = jest.fn();  // 保存ボタンのクリック時に実行される
  const onValid = jest.fn();      // 成功：適正内容で送信を試みた場合に実行される
  const onInvalid = jest.fn();    // 失敗：不適正内容で送信を試みた場合に実行される

  // テスト対象（コンポーネント）をレンダリング
  render(
    <PostForm
      title="新規記事"
      onClickSave={onClickSave}
      onValid={onValid}
      onInvalid={onInvalid}
    />
  );

  // 記事タイトルを入力するインタラクション関数
  async function typeTitle(title: string) {
    const textbox = screen.getByRole("textbox", { name: "記事タイトル" });
    await user.type(textbox, title);
  }

  // 記事公開するインタラクション関数
  async function saveAsPublished() {
    await user.click(screen.getByRole("switch", { name: "公開ステータス" }));
    await user.click(screen.getByRole("button", { name: "記事を公開する" }));
  }

  // 下書き保存するインタラクション関数
  async function saveAsDraft() {
    await user.click(screen.getByRole("button", { name: "下書き保存する" }));
  }

  return {
    typeTitle,
    saveAsDraft,
    saveAsPublished,
    onClickSave,
    onValid,
    onInvalid,
  };
}
```

> インタラクションテストの実施には初期化（`userEvent.setup()`）しておくこと
```js
import userEvent from "@testing-library/user-event";

// 初期化処理（必ず各テストの最初に記載）
const user = userEvent.setup();
```

- **user.click**<br>
クリック操作を再現（エミュレート）
```js
await user.click(screen.getByRole("button"));
```

- **user.type**<br>
入力操作を再現
```js
await user.type(textbox, value);
```

- **user.selectOptions**<br>
セレクトボックス（`combobox`）から任意の項目を選択するインタラクション関数
```js
const combobox = screen.getByRole("combobox", { name: "公開ステータス" });
// セレクトボックスから要素を選択するインタラクション
async function selectOption(label: string) {
  await user.selectOptions(combobox, label);
}
```

- **user.upload**<br>
ファイルアップロード操作を再現
```js
const file = new File([content], fileName, { type: "image/png" });
const fileInput = screen.getByTestId(inputTestId);
const selectImage = () => user.upload(fileInput, file);
```

###### `waitFor`関数：特定の状況・条件下になるまで処理実施を待機する
**非同期のテスト**において「**特定の条件が満たされるまで待機する**」ための関数。**特定の条件が満たされるまで**という性質を持つため、**非同期処理をトリガーした後に配置する**のが一般的。

```js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


test('データが表示されるまで待つ', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('データ読み込み完了')).toBeInTheDocument();
  });
});

// 非同期処理をトリガーした後に waitFor を使う例
test('ボタンクリック後にデータが表示される', async () => {
  // userEventの初期化
  const user = userEvent.setup();
  
  render(<MyComponent />);
  
  // 1. 非同期処理のトリガー
  const button = screen.getByRole('button');
  await user.click(button);
  
  // 2. その結果を待つ
  await waitFor(() => {
    expect(screen.getByText('データ読み込み完了')).toBeInTheDocument();
  });
});
```

`waitFor`関数は指定したコールバック関数が成功する（エラーをスローしない）まで繰り返し実行し、タイムアウトするまで待機する。

- `waitFor`関数の特徴
  - 条件が満たされるまで繰り返しチェック
  - タイムアウト（デフォルト1秒:`1000ms`）まで待機
  - 条件が満たされたらテストを続行

### Testing Library 実装例
Testing Library を使う際の**レンダリングした内容から特定DOM要素を取得する各種API**の紹介をしていく。<br>
**結論として、アクセシビリティを重視した優先順位から基本的には`...ByRole`を用いる**。<br>

```ts
// 1. getByRole
screen.getByRole("button", { name: "送信" });

// 2. getByLabelText （フォーム要素）
screen.getByLabelText("メールアドレス");

// 3. getByPlaceholderText
screen.getByPlaceholderText("example@email.com");

// 4. getByText （テキストコンテンツ）
screen.getByText("アカウント情報");

// 5. getByDisplayValue （入力済みの値）
screen.getByDisplayValue("taro");

// 6. ⚠️ getByAltText （画像など：※支援技術やブラウザごとによって体験が大きく変わる可能性がある）
screen.getByAltText("プロフィール画像");

// 7. ⚠️ getByTitle
screen.getByTitle("詳細情報");

// 8. ❌ getByTestId （最後の手段）
screen.getByTestId("user-form");
```

#### `...ByTestId`について
`getByRole`, `getByText`などどの方法でもDOM要素を見つける方法がない場合は`getByTestId`が最終手段となる。<br>
テストで利用したい要素に`data-testid`属性を設定して任意の値を設定する。<br>
設定した値は`getByTestId`で利用する。

```html
<p data-testid="test">Test</p>
```

```js
const element = screen.getByTestId('test');
expect(element).toBeInTheDocument();
```

> [!NOTE]
> #### `getBy...`, ``queryBy...`, `findBy...`の違い
> - [Types of Queries | Testing Library](https://testing-library.com/docs/queries/about/#types-of-queries)<br>
> 上記の公式ドキュメントページ（の Summary Table という箇所）で各APIの比較表が確認できる。

---

#### `getByText`
**一致した「文字列を持つテキスト要素を一つ見つける**API。見つかった場合はその要素の参照が得られて、見つからなかった場合はエラーが発生してテストが失敗する

```ts
test("名前の表示", () => {
  render(<Form name="taro" />); // 検証対象DOMを描画
  expect(screen.getByText("taro")).toBeInTheDocument(); // 検証対象が取得できているか（その有無を）検証
});
```

#### `getByRole`
**特定のDOM要素をロール（属性の一致）で一つだけ取得する**API。見つかった場合はその要素の参照が得られて、見つからなかった場合はエラーが発生してテストが失敗する。

> ![NOTE]
> `...ByRole`は**暗黙的なロール**も識別する。つまり、明示的に`role`属性が指定されていなくとも当該DOM要素に元々あるロールを認識できる。

```ts
test("ボタンの表示", () => {
  render(<Form name="taro" />);
  // <Form />コンポーネントには`button`要素が含まれているのでテストは成功する
  expect(screen.getByRole("button")).toBeInTheDocument();
});

/*

export const Form = ({ name, onSubmit }: Props) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
    >
      <h2>アカウント情報</h2>
      <p>{name}</p>
      <div>
        <button>編集する</button>
      </div>
    </form>
  );
};

*/
```

#### イベントハンドラー（のシミュレーション）
イベントハンドラー（ある出来事が発生した際に呼び出される関数）もまた関数の単体テスト同様に`モック関数`を使ってテスト（動作・ユーザー操作のシミュレーションを）する。

```ts
test("ボタンを押下すると、イベントハンドラーが呼ばれる", () => {
  const mockFn = jest.fn();
  render(<Form name="taro" onSubmit={mockFn} />);
  fireEvent.click(screen.getByRole("button"));
  expect(mockFn).toHaveBeenCalled();
});
```

<details>
<summary>この fireEvent を使ったテストコードを userEvent に変更した場合</summary>

`userEvent`は非同期処理なので`async/await`が必須で、`userEvent.setup()`でインスタンス初期化を実施しておくのがベター。

```diff
+ import userEvent from "@testing-library/user-event";

- test("ボタンを押下すると、イベントハンドラーが呼ばれる", () => {
// `userEvent`は非同期処理なので`async/await`が必須
+ test("ボタンを押下すると、イベントハンドラーが呼ばれる", async () => {
+   const user = userEvent.setup(); // 初期化処理（必ず各テストの最初に記載）
    const mockFn = jest.fn();
    render(<Form name="taro" onSubmit={mockFn} />);
-   fireEvent.click(screen.getByRole("button"));
+   await user.click(screen.getByRole("button"));
    expect(mockFn).toHaveBeenCalled();
});
```

</details>

##### フォームUIにおけるサンプル例
**任意の文字列が入力**された入力フォーム（`input[type="text"], [type="password"]`）が**あるかどうかを検証**<br>
`userEvent`は非同期処理なので`async/await`が必須。

```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputAccount } from "./InputAccount";

const user = userEvent.setup(); // インスタンス初期化

test("メールアドレス入力欄", async () => {
  render(<InputAccount />);
  const textbox = screen.getByRole("textbox", { name: "メールアドレス" });
  const value = "taro.tanaka@example.com";

  // user.type： 入力操作を再現
  await user.type(textbox, value);

  // 入力済みの値（"taro.tanaka@example.com"）を持った要素があるかどうかを検証
  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
});

test("パスワード入力欄", async () => {
  render(<InputAccount />);
  /* input[type="password"]は「ロールを持たない」のでラベル名（テキスト）とプレースホルダーの内容で検証 */
  
  // 非推奨: getBy...とtoThrow()の組み合わせは適切に動作しない
  // expect(() => screen.getByRole("textbox", { name: "パスワード" })).toThrow();

  // パスワード入力欄は`textbox`ロールを持たない
  expect(screen.queryByRole("textbox", { name: "パスワード" })).not.toBeInTheDocument();

  // 非推奨: not.toThrow()は意味のない検証になる
  // expect(() => screen.getByPlaceholderText("8文字以上で入力")).not.toThrow();

  // "8文字以上で入力"というプレースホルダーを持った要素の存在を検証
  expect(screen.queryByPlaceholderText("8文字以上で入力")).not.toBeNull();
});

test("パスワード入力欄", async () => {
  render(<InputAccount />);
  const password = screen.getByPlaceholderText("8文字以上で入力");
  const value = "abcd1234";

  // user.type： 入力操作を再現
  await user.type(password, value);

  // 入力済みの値（"abcd1234"）を持った要素があるかどうかを検証
  expect(screen.getByDisplayValue(value)).toBeInTheDocument();
});
```

#### 複数要素がある場合（...AllBy...）
Testing Library では、 **アクセシビリティを重視した優先順位（＝`...ByRole`系）で書いていくのが理想的なテストコード**なのでクラス属性やDOM要素で指定せず、 **あくまでロールをメインにテストコードを構築していく**。

> [!NOTE]
> 単数形のAPI（`getBy...`, `queryBy...`, `findBy...`）では、複数の要素が見つかった場合はエラーが発生します。また、[要素が存在しない場合`queryBy...`のみ`null`を返し](#存在しないことを検知するapiqueryby-queryallby)、他の2つはエラーを発生させます。

##### 方法1： オプションで絞り込む
```ts
test("見出しの表示", () => {
  render(
    <>
      <h1>アカウント情報</h1>
      <h2>詳細</h2>
    </>
  );

  // nameオプションで特定
  expect(screen.getByRole("heading", { name: "アカウント情報" })).toBeInTheDocument();
});

test("h1の見出し", () => {
  // levelオプションで特定（h1, h2など）
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("アカウント情報");
});

test("特定の見出し", () => {
  // level, name 両方組み合わせ
  expect(screen.getByRole("heading", { level: 2, name: "詳細" })).toBeInTheDocument();
});
```

##### 方法2： `getAllByRole`を使用
```ts
test("すべての見出し", () => {
  render(
    <>
      <h1>アカウント情報</h1>
      <h2>詳細</h2>
    </>
  );
  // getAllByRoleで（指定したロールを持つ）複数要素を取得
  const headings = screen.getAllByRole("heading");

  expect(headings).toHaveLength(2); // h要素が2個あることを期待
  expect(headings[0]).toHaveTextContent("アカウント情報"); // 一つ目のテキスト情報は「アカウント情報」
  expect(headings[1]).toHaveTextContent("詳細"); // 二つ目のテキスト情報は「詳細」
});
```

#### スコープを設けてテスト対象DOM要素を絞り込む
大きなコンポーネントの場合、`getAllByRole`ではコンポーネント全体の該当ロールDOM要素（**テスト対象でない検証要素まで**）が検知されてしまう可能性がある。`within`関数を使うことで対象を絞り込めるようになる。

##### `within`関数
対象を絞り込んで要素取得したい場合に使用する関数。返り値には要素取得APIが含まれる。
```js
test("items の数だけ一覧表示される", () => {
  render(<ArticleList items={items} />);
  const list = screen.getByRole("list");
  expect(list).toBeInTheDocument();

  // `within`関数で取得対象ノードを絞り込む（`ul: list`の中に3つの`li: listitem`があるかどうか）
  expect(within(list).getAllByRole("listitem")).toHaveLength(3);
});
```

#### 存在しないことを検知するAPI（`queryBy...`, `queryAllBy...`）
他のAPI（`getBy...`, `getAllBy...`, `findBy...`, `findAllBy...`）では対象要素が存在しない場合はエラーが発生して処理が中断されるが、`query`系ではエラー処理にならないので**存在しないことを検知できる**。

- 検証用コード
```ts
import { ArticleListItem, ItemProps } from "./ArticleListItem";

type Props = {
  items: ItemProps[];
};

export const ArticleList = ({ items }: Props) => {
  return (
    <div>
      <h2>記事一覧</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <ArticleListItem {...item} key={item.id} />
          ))}
        </ul>
      ) : (
        <p>投稿記事がありません</p>
      )}
    </div>
  );
};

```

##### `queryBy...`：単数
対象要素が存在しない場合は`null`を返す

```ts
test("一覧アイテムが空のとき「投稿記事がありません」が表示される", () => {
  // 空配列を渡す
  render(<ArticleList items={[]} />);
  // 中身が空の`ul: list`を取得
  const list = screen.queryByRole("list");
  // 中身が空なので`ul: list`は存在しないことを検証
  expect(list).not.toBeInTheDocument();
  // 中身が空なので`ul: list`は（`queryByRole`の返り値が）nullなことを検証
  expect(list).toBeNull();
  // 「投稿記事がありません」というテキストを持つ要素の有無を確認
  expect(screen.getByText("投稿記事がありません")).toBeInTheDocument();
});
```

- 事例2：所定のリンク先パスを持っているかどうかの検証
- 検証用コード
```tsx
export type ItemProps = {
  id: string;
  title: string;
  body: string;
};

export const ArticleListItem = ({ id, title, body }: ItemProps) => {
  return (
    <li>
      <h3>{title}</h3>
      <p>{body}</p>
      <a href={`/articles/${id}`}>もっと見る</a>
    </li>
  );
};
```

- テストコード
```ts
const item: ItemProps = {
  id: "howto-testing-with-typescript",
  title: "TypeScript を使ったテストの書き方",
  body: "テストを書く時、TypeScript を使うことで、テストの保守性が向上します…",
};

test("ID に紐づいたリンクが表示される", () => {
  // スプレッド構文で各種`props`（`id`, `title`, `body`）を展開した形で渡す
  render(<ArticleListItem {...item} />);

  // 「もっと見る」というテキストを持った`a: link`要素の`href`属性の中身を検証
  expect(screen.getByRole("link", { name: "もっと見る" })).toHaveAttribute(
    "href",
    "/articles/howto-testing-with-typescript"
  );
});
```

- 事例3：アクセシビリティに沿ったDOMツリー構成になっているか検証<br>
`legend`要素は`fieldset: group`の子要素として利用するHTML要素。
```tsx
export const Agreement = ({ onChange }: Props) => {
  return (
    <fieldset>
      <legend>利用規約の同意</legend>
      <label>
        <input type="checkbox" onChange={onChange} />
        当サービスの<a href="/terms">利用規約</a>を確認し、これに同意します
      </label>
    </fieldset>
  );
};
```

- テストコード<br>
`getByRole`で`fieldset: group`を指定し、`legend`要素の有無（正しく使用しているかどうか）を検証している
```ts
test("fieldset のアクセシブルネームは、legend を引用している", () => {
  render(<Agreement />);
  expect(
    screen.getByRole("group", { name: "利用規約の同意" })
  ).toBeInTheDocument();
});
```

##### `queryAllBy...`：複数
対象要素が存在しない場合は空配列（`[]`）を返す

### アクセシブルネームの付与
`aria-labelledby`属性で指定したIDを持つ要素のテキストコンテンツ（※必ずIDが必要）が、その属性を付与した要素のアクセシブルネームとして利用される。

- アクセシブルネーム：支援技術が認識するノードの名称

#### `form`
例えば、`form`要素は常に`form`ロールを持つが、アクセシブルネームを持つ場合のみアクセシビリティツリーに明示的なランドマークとして公開される。

- 検証用コンポーネントの一部
```tsx
import { useId } from "react";
// `useId`フックで一意のIDを生成
const headingId = useId();
return (
    <form aria-labelledby={headingId}>
      <h2 id={headingId}>新規アカウント登録</h2>
      ...
      ..
      .
```

- テストコード
```ts
test("form のアクセシブルネームは、見出し（h2）を引用している", () => {
  render(<Form />);
  expect(
    screen.getByRole("form", { name: "新規アカウント登録" })
  ).toBeInTheDocument();
});
```

### 共通した処理を一つのテスト関数（コード）として管理
※過度に共通化するとテストの精度が悪化する可能性があるので注意

#### 事例1： フォームへの入力情報のデフォルト設定を持ったフォームテスト関数（コード）
```ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { deliveryAddresses } from "./fixtures";
import { Form } from "./Form";

const user = userEvent.setup(); // 初期化

type inputValuesType = {
  name: string;
  phoneNumber: string;
  municipalities?: string;
  streetNumber?: string;
  postalCode?: string;
  prefectures?: string;
};

const defaultInputValues = {
  name: "田中 太郎",
  phoneNumber: "000-0000-0000"
}

// デフォルト値として渡された内容をフォームに入力
async function inputContactNumber(inputValues: inputValuesType = defaultInputValues) {
  // 電話番号入力フィールドを取得し、取得した要素に対して、ユーザーがキーボードで文字を入力する動作をシミュレート
  await user.type(
    screen.getByRole("textbox", { name: "電話番号" }),
    inputValues.phoneNumber
  );
  await user.type(
    screen.getByRole("textbox", { name: "お名前" }),
    inputValues.name
  );
  return inputValues;
}

const defaultInputDeliveryAddressValues = {
  name: "田中 太郎",
  phoneNumber: "000-0000-0000",
  postalCode: "167-0051",
  prefectures: "東京都",
  municipalities: "杉並区荻窪1",
  streetNumber: "00-00",
}

// デフォルト値として渡された内容をフォームに入力
async function inputDeliveryAddress(inputDeliveryAddressValues: inputValuesType = defaultInputDeliveryAddressValues) {
  await user.type(
    screen.getByRole("textbox", { name: "郵便番号" }),
    typeof inputDeliveryAddressValues.postalCode !== 'undefined' ? inputDeliveryAddressValues.postalCode
      : "");
  await user.type(
    screen.getByRole("textbox", { name: "都道府県" }),
    typeof inputDeliveryAddressValues.prefectures !== 'undefined' ? inputDeliveryAddressValues.prefectures : ""
  );
  await user.type(
    screen.getByRole("textbox", { name: "市区町村" }),
    typeof inputDeliveryAddressValues.municipalities !== 'undefined' ? inputDeliveryAddressValues.municipalities : ""
  );
  await user.type(
    screen.getByRole("textbox", { name: "番地番号" }),
    typeof inputDeliveryAddressValues.streetNumber !== 'undefined' ? inputDeliveryAddressValues.streetNumber : ""
  );
  return inputDeliveryAddressValues;
}
```

- 共通化したテスト関数（コード）の使用例
```ts
describe("過去のお届け先がない場合", () => {
  test("入力・送信すると、入力内容が送信される", async () => {
    const contactNumber = await inputContactNumber();
    const deliveryAddress = await inputDeliveryAddress();
  });
});

test("「はい」を選択・入力・送信すると、入力内容が送信される", async () => {
  const contactNumber = await inputContactNumber();
  const deliveryAddress = await inputDeliveryAddress();
});
```

#### 事例2： フォームの送信データをもとにオブジェクトを動的生成
```ts
function mockHandleSubmit() {
  // モック（スタブ）生成
  const mockFn = jest.fn();

  // 送信イベントハンドラー
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // ページリロードを防止

    // 送信データ（入力された情報）をもとにFormDataオブジェクト（のインスタンス）を生成
    const formData = new FormData(event.currentTarget);

    // 文字列型のプロパティと`unknown`型の値を持つ空オブジェクトを用意
    const data: { [k: string]: unknown } = {};

    // FormDataオブジェクトをループ処理して、
    // 先ほど作成した空オブジェクトにプロパティ（各項目）と値（項目にリンクした入力内容）を格納していく
    formData.forEach((value, key) => (data[key] = value));

    // 送信データをモック関数に渡して記録
    mockFn(data);
  };

  // モック関数と送信イベントハンドラーを読み込み専用タプルとして返す
  return [mockFn, onSubmit] as const;
}
```

- 使用例
```ts
test("入力・送信すると、入力内容が送信される", async () => {
  const [mockFn, onSubmit] = mockHandleSubmit();
  render(<Form onSubmit={onSubmit} />);
  const contactNumber = await inputContactNumber();
  const deliveryAddress = await inputDeliveryAddress();
  await clickSubmit();
  expect(mockFn).toHaveBeenCalledWith(
    expect.objectContaining({ ...contactNumber, ...deliveryAddress })
  );
});
```

#### 事例3： WebAPI 利用時のハンドリングケース
##### `validations.ts`
電話番号の入力値検証用コードで、正しくない場合は例外スローする
```ts
export class ValidationError extends Error {}

export function checkPhoneNumber(value: any) {
  if (!value.match(/^[0-9\-]+$/)) {
    throw new ValidationError();
  }
}
```

##### `origin.ts`
モック対象のメソッドが記述されたコードで、当該メソッドがWebAPI（データフェッチ処理）を実施する`postMyAddress`となる。
```ts
import { Result } from "./type";

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
}

const host = (path: string) => `https://myapi.testing.com${path}`;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export function postMyAddress(values: unknown): Promise<Result> {
  return fetch(host("/my/address"), {
    method: "POST",
    body: JSON.stringify(values),
    headers,
  }).then(handleResponse);
}
```

##### `mock.ts`
`origin.ts`のWebAPI（データフェッチ処理）を担う`postMyAddress`のモック関数を用意するコード
```ts
// `origin.ts`内の各関数や変数など全てインポートし、
// それらを`Fetchers`という一つのオブジェクトとして扱う
import * as Fetchers from ".";
import { httpError, postMyAddressMock } from "./fixtures";

export function mockPostMyAddress(status = 201) {
  // HTTPステータス失敗時
  if (status > 299) {
    return jest
      // 監視対象オブジェクト：Fetchers、監視対象メソッド：postMyAddress
      .spyOn(Fetchers, "postMyAddress")
      .mockRejectedValueOnce(httpError);
  }

  // HTTPステータス成功時
  return jest
    .spyOn(Fetchers, "postMyAddress")
    .mockResolvedValueOnce(postMyAddressMock);
}
```

##### `RegisterAddress.tsx`
今回の検証対象コンポーネント
```tsx
import { useState } from "react";
import { Form } from "../06/Form";
import { postMyAddress } from "./fetchers";
import { handleSubmit } from "./handleSubmit";
import { checkPhoneNumber, ValidationError } from "./validations";

export const RegisterAddress = () => {
  const [postResult, setPostResult] = useState("");
  return (
    <div>
      <Form
        onSubmit={handleSubmit((values) => {
          try {
            // このバリデーション実行時に条件に応じて例外スローすることで
            // 以下のデータフェッチ処理を中断して`catch`のエラーハンドリングに移行できる
            checkPhoneNumber(values.phoneNumber);
            
            // バリデーション通過時のみデータフェッチ処理を実行
            postMyAddress(values)
              .then(() => {
                setPostResult("登録しました");
              })
              .catch(() => {
                setPostResult("登録に失敗しました");
              });
          } catch (err) {
            if (err instanceof ValidationError) {
              setPostResult("不正な入力値が含まれています");
              return;
            }
            setPostResult("不明なエラーが発生しました");
          }
        })}
      />
      {postResult && <p>{postResult}</p>}
    </div>
  );
};
```

##### `RegisterAddress.test.tsx`
テストコード
```ts
import { render, screen } from "@testing-library/react";
import { mockPostMyAddress } from "./fetchers/mock";
import { RegisterAddress } from "./RegisterAddress";

import {
  clickSubmit,
  inputContactNumber,
  inputDeliveryAddress,
} from "./testingUtils";

jest.mock("./fetchers");

// すべての処理結果を返すユーティリティテスト関数
async function fillValuesAndSubmit() {
  const contactNumber = await inputContactNumber();
  const deliveryAddress = await inputDeliveryAddress();
  const submitValues = { ...contactNumber, ...deliveryAddress };
  await clickSubmit();
  return submitValues;
}

// （電話番号の入力値検証に引っ掛かる）例外スロー発生用のテスト関数
async function fillInvalidValuesAndSubmit() {
  const contactNumber = await inputContactNumber({
    name: "田中 太郎",
    phoneNumber: "abc-defg-hijkl",
  });
  const deliveryAddress = await inputDeliveryAddress();
  const submitValues = { ...contactNumber, ...deliveryAddress };
  await clickSubmit();
  return submitValues;
}

// beforeEach： 各テストが実行される前に毎回実行
beforeEach(() => {
  // すべてのモックの呼び出し履歴やインスタンス情報、戻り値設定をリセット
  jest.resetAllMocks();
});

test("成功時「登録しました」が表示される", async () => {
  const mockFn = mockPostMyAddress();
  render(<RegisterAddress />);

  // `fillValuesAndSubmit`内の処理でフォームへの入力シミュレーションが実施されており、
  // その結果（すべての入力項目が満たされた状態のフォームデータオブジェクト）を`submitValues`に格納
  const submitValues = await fillValuesAndSubmit();

  // `mockPostMyAddress`（モック化された`postMyAddress`）が、
  // 送信フォームの入力値を含むオブジェクトを引数として呼び出されたことを検証
  expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(submitValues));

  expect(screen.getByText("登録しました")).toBeInTheDocument();
});

test("失敗時「登録に失敗しました」が表示される", async () => {
  const mockFn = mockPostMyAddress(500); // HTTPステータス500（サーバーエラー）を返すモック
  render(<RegisterAddress />);
  const submitValues = await fillValuesAndSubmit();
  expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(submitValues));
  expect(screen.getByText("登録に失敗しました")).toBeInTheDocument();
});

test("バリデーションエラー時「不正な入力値が含まれています」が表示される", async () => {
  render(<RegisterAddress />);
  // （電話番号の入力値検証に引っ掛かる）例外スロー発生用のテスト関数を実行
  // この時点で例外スローされてデータフェッチ処理は実行されないので
  // このテストスコープにモック関数は不要
  await fillInvalidValuesAndSubmit();
  expect(screen.getByText("不正な入力値が含まれています")).toBeInTheDocument();
});

test("不明なエラー時「不明なエラーが発生しました」が表示される", async () => {
  render(<RegisterAddress />);
  await fillValuesAndSubmit();
  // モック関数を設定していないためデータフェッチ処理が失敗（というか実行されない）し、
  // catch ブロックで「不明なエラー」として処理される
  expect(screen.getByText("不明なエラーが発生しました")).toBeInTheDocument();
});
```

### スナップショット： リグレッション（デザイン崩れ）の検証
UIコンポーネントの予期せぬリグレッション（デザイン崩れ）の検証にはスナップショットテストが活用できる。

#### `toMatchSnapshot`マッチャー
`Jest`に組み込まれているスナップショットテスト用のマッチャー。初回実行時にスナップショットファイル（`__snapshots__`ディレクトリ内）を自動生成し、以降のテスト実行時にはそのスナップショットと比較する。

```ts
const item: ItemProps = {
  id: "howto-testing-with-typescript",
  title: "TypeScript を使ったテストの書き方",
  body: "テストを書く時、TypeScript を使うことで、テストの保守性が向上します…",
};

test("Snapshot: 一覧要素が表示される", () => {
  // スプレッド構文で各種`props`（`id`, `title`, `body`）を展開した形で渡す
  const { container } = render(<ArticleListItem {...item} />);
  // スナップショットを作成・比較
  expect(container).toMatchSnapshot();
});
```

- `__snapshots__`<br>
各スナップショットデータを格納するためのフォルダで、テストを実施すると`対象テストファイル名.snap`というファイルが生成される。中身はHTML構造が文字列化されたもので、各`snap`ファイルはリグレッションの差分検証のために`git`管理対象とするのが一般的。

#### スナップショットの更新
UIコンポーネントの構造・テキスト・スタイル・属性などに意図的な変更を加えた場合は、その変更を「正」としてスナップショットを更新する必要がある

> [!NOTE]
> スナップショット更新はUIの修正・変更が**意図したものであることを確認した上で行う**こと

```bash
npx jest --updateSnapshot

# または以下の短縮形を使用
# npx jest -u
```

- 特定のテストファイルだけスナップショット更新したい場合
```bash
npx jest path/YourComponent.test.js -u
```

- インタラクション（ユーザー操作）が実施された状態のスナップショットも記録可能<br>
下記はインタラクション（ユーザー操作）実施前のスナップショットだが、コメントアウトしているコードを有効化することで「インタラクション（ユーザー操作）実施後のスナップショット」を記録できる。
```ts
test("Snapshot: 登録フォームが表示される", async () => {
  mockPostMyAddress();
  // const mockFn = mockPostMyAddress();
  const { container } = render(<RegisterAddress />);
  // const submitValues = await fillValuesAndSubmit();
  // expect(mockFn).toHaveBeenCalledWith(expect.objectContaining(submitValues));
  expect(container).toMatchSnapshot();
});
```

### ロールについて
UIテストにおいて要素を特定する際は、`getByRole()`のように **ロール（role）** を利用するのが推奨されている。<br>
ロールとはWeb技術標準化を定めているW3Cの`WAI-ARIA`仕様に含まれるHTML要素が持つ属性の1つである。<br>
`WAI-ARIA`由来のテストコードを書くことで、支援技術を使用しているユーザーにも意図した形でコンテンツが届いているかどうかを検証できる。

#### 暗黙のロール
多くのHTML要素には、**明示的に`role`属性を付けなくても自動的に付与されているロール** があり、この初期設定・デフォルメのロールを **暗黙のロール** と呼ぶ。

| HTML要素 | 暗黙のロール | 備考 |
|-----------|----------------|------|
| `<button>` | `button` | 明示的な `role="button"` は不要 |
| `<a href="#">` | `link` | `href` 属性がない場合はロールなし |
| `<form>` | `form` | アクセシブルネーム（を持った子要素）がある場合のみ暗黙のロールが付与される |
| `<ul>` | `list` | |
| `<li>` | `listitem` | |
| `<img alt="..." />` | `img` | `alt` がない場合は無視される場合あり |
| `<input type="checkbox" />` | `checkbox` | |
| `<input type="text" />` | `textbox` | |

##### 任意のロールを付与することも可能
※以下は例示コードで、本来であれば`button`でマークアップすべき記述内容
```html
<!-- div要素にbuttonロールを付与 -->
<div role="button">送信</div>
```

#### ロールとHTML要素は必ずしも1対1ではない
例えば、同じ`<input>`要素でも**`type`属性の値によって異なるロールが自動的に割り当てられる**。

| HTML要素 | 暗黙のロール | 備考 |
|------|---------------|------|
| `<input type="text" />` | `textbox` | 通常の入力フィールド |
| `<input type="email" />` | `textbox` | メール入力フィールドも同じく `textbox` |
| `<input type="checkbox" />` | `checkbox` | チェックボックスとして扱われる |
| `<input type="radio" />` | `radio` | ラジオボタンとして扱われる |
| `<input type="range" />` | `slider` | スライダー操作が可能な入力 |
| `<input type="submit" />` | `button` | 送信ボタンとして扱われる |

---

同じタグ（`<input>`）でも属性によってロールが異なるためロールをベースとしたテスト時は注意が必要。

```jsx
render(
  <>
    <input type="text" aria-label="ユーザー名" />
    <input type="email" aria-label="メールアドレス" />
    <input type="checkbox" aria-label="利用規約に同意する" />
  </>
);

// 「テキスト入力欄」を取得
screen.getByRole("textbox", { name: "ユーザー名" });

// 「メールアドレス入力欄」を取得
screen.getByRole("textbox", { name: "メールアドレス" });

// 「チェックボックス」を取得
screen.getByRole("checkbox", { name: "利用規約に同意する" });
```

#### aria属性値を使った検証要素の絞り込み
例えば、`<h1>`〜`<h6>` 要素などの「見出し（heading）」がページ内に複数混在することはよくある。<br>
見出し系のタグはどれも暗黙的に`heading`ロールを持っており、`aria-level`属性またはタグ階層で定められた`level`が指定されている。

```jsx
function PageHeader() {
  return (
    <header>
      {/* <h1>： role="heading", aria-level=1, name=ユーザー登録 */}
      <h1>ユーザー登録</h1>
      {/* <h2>： role="heading", aria-level=2, name=入力内容の確認 */}
      <h2>入力内容の確認</h2>
    </header>
  );
}
```

- テストでの取得例
```js
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

test("見出しのアクセシブルネームで要素を特定できる", () => {
  render(<PageHeader />);

  // name（テキスト）で取得
  const heading1 = screen.getByRole("heading", { name: "ユーザー登録" });
  const heading2 = screen.getByRole("heading", { name: "入力内容の確認" });

  // level で階層を絞り込む
  const level1 = screen.getByRole("heading", { level: 1 });
  const level2 = screen.getByRole("heading", { level: 2 });

  expect(heading1).toBe(level1);
  expect(heading2).toBe(level2);
});
```

- `name`<br>
当該HTML要素のテキスト内容

- `level`<br>
`<h1>`〜`<h6>`または`aria-level`で指定される値

---

この方法だとページ内の特定の見出しを**構造的かつ意味的に特定**できるようになる。つまり、 **見た目に依存せず、実際のアクセシビリティ構造**に基づいたテストが可能となる。

#### アクセシブルネームを使った検証要素の絞り込み
アクセシブルネームとは「支援技術が認識するノードの名称」を指す。噛み砕くと、要素がスクリーンリーダーなどで読み上げられる際の「ラベル」のようなもの。多くの場合、以下の順序で決定される。

1. `aria-label`属性
2. `aria-labelledby`属性
3. `<label>`要素のテキスト
4. 要素内のテキストノード（ボタンやリンクなど）。画像の場合は`alt`属性値の文字列

```jsx
<button aria-label="閉じる">×</button>
<button>閉じる</button>
<button><img src="path/to/closeBtn.png" alt="閉じる"></button>
```

上記のボタンは`"閉じる"`というアクセシブルネームを持つため、テストでは以下のように記述する。

```js
screen.getByRole('button', { name: '閉じる' });
```

不慣れなうちはデバッグツールを活用しながら、どのようなアクセシブルネームが算出されているかを確認するのが良い。<br>
※アクセシブルネームの決定には様々な要因が絡み、[`accessible name and description computation 1.2`](https://www.w3.org/TR/accname-1.2/)という仕様に基づいて算出される。

#### ロールとアクセシブルネームの確認
- ブラウザの開発者ツール
  - `Chrome DevTools` - `Elements` - `Accessibility`パネルから、各要素の **ロール** と **アクセシブルネーム** を確認できる
- Testing Library の [Testing Playground](https://testing-playground.com/) を使用する
- `@testing-library/react`の`logRoles`関数を使用する
```ts
import { logRoles, render } from "@testing-library/react";
import { Form } from "./Form";

test("logRoles: レンダリング結果からロール・アクセシブルネームを確認", () => {
  const { container } = render(<Form name="taro" />);
  logRoles(container);
});
```

#### 暗黙のロール対応表
Testing Library は内部的に`aria-query`というライブラリを使用していて、暗黙のロール算出結果は`aria-query`に依存する。

| HTML要素                                 | WAI-ARIA 暗黙のロール              | 備考                                 |
| -------------------------------------- | ---------------------------- | ---------------------------------- |
| `<a href="...">`                       | `link`                       | `href` 属性がある場合のみ                   |
| `<area href="...">`                    | `link`                       |                                    |
| `<article>`                            | `article`                    |                                    |
| `<aside>`                              | `complementary`              |                                    |
| `<button>`                             | `button`                     |                                    |
| `<form>`                               | `form`                       | `aria-label` や `title` がないときはロールなし |
| `<h1>` ～ `<h6>`                        | `heading`                    | `aria-level` に対応                   |
| `<img alt>`                            | `img`                        | `alt=""` は無視される                    |
| `<input type="checkbox">`              | `checkbox`                   |                                    |
| `<input type="radio">`                 | `radio`                      |                                    |
| `<input type="range">`                 | `slider`                     |                                    |
| `<input type="email/text/search/...">` | `textbox`                    |                                    |
| `<li>`                                 | `listitem`                   |                                    |
| `<nav>`                                | `navigation`                 |                                    |
| `<ol>` / `<ul>`                        | `list`                       |                                    |
| `<select>`                             | `combobox` / `listbox`       |                                    |
| `<table>`                              | `table`                      |                                    |
| `<td>`                                 | `cell`                       |                                    |
| `<th>`                                 | `columnheader` / `rowheader` |                                    |
| `<textarea>`                           | `textbox`                    |                                    |
| `<header>`                             | `banner`                     | ページ内で最初の `<header>` のみ暗黙ロール付与      |
| `<footer>`                             | `contentinfo`                | 同上                                 |
| `<main>`                               | `main`                       |                                    |

### グローバルステートを用いた結合テスト
※Reactの`Context API`を使ったグローバルステート事例として説明を進める

#### 事例コード（トーストUI）
##### `ToastContext.tsx`
```tsx
import { createContext } from "react";

export type ToastStyle = "succeed" | "failed" | "busy";

export type ToastState = {
  isShown: boolean;  // トーストUIの表示・非表示判定
  message: string;   // トーストUIで表示する内容
  style: ToastStyle; // 先ほど定義した文字列リテラル（成功、失敗、処理混雑）
};

// ステートの初期値
export const initialState: ToastState = {
  isShown: false,
  message: "",
  style: "succeed",
};

// グローバルステートの生成
export const ToastStateContext = createContext(initialState);

export type ToastAction = {
  // 引数`state`はオプショナル（あってもなくても良い状態）で、
  // その内訳は、`ToastState`から`isShown`プロパティを除外（Omit）し、
  // 残りのプロパティ（message, style）もオプショナル（Partial）にしたもの
  showToast: (state?: Partial<Omit<ToastState, "isShown">>) => void;
  hideToast: () => void;
};

// アクション（更新処理）の初期値
export const initialAction: ToastAction = {
  showToast: () => {},
  hideToast: () => {},
};

// アクション（更新処理）用のグローバルステートを用意
export const ToastActionContext = createContext(initialAction);
```

##### `useToastProvider.tsx`
[カスタムフックを通じてコンポーネントを提供する`render hooks`](https://engineering.linecorp.com/ja/blog/line-securities-frontend-3)のようなことをしているコンポーネント

```tsx
import { useCallback, useState } from "react";
import { initialState, ToastState } from "./ToastContext";

// 引数`defaultState`は`ToastState`型を持つが`Partial`によってオプショナルにされている
export function useToastProvider(defaultState?: Partial<ToastState>) {
  const [{ isShown, message, style }, setState] = useState({
    // { isShown, message, style }ステートの初期値は`initialState`,`defaultState`を展開した内容
    /*
    {
      isShown: false,
      message: "",
      style: "succeed",
      `defaultState`があれば上記の各プロパティを、その内容で適宜上書きしていく
    }
    */
    ...initialState,
    ...defaultState,
  });

  const showToast = useCallback(
    (props?: Partial<Omit<ToastState, "isShown">>) => {
      // `...prev`： 既存内容を維持しつつ、
      // `...props`： 各プロパティ（`isShown`, `message`, `style`）を引数の内容で更新
      // `isShown: true`： 最後に`isShown`プロパティのみ明示的に表示状態に変更する
      setState((prev) => ({ ...prev, ...props, isShown: true }));
    },
    []
  );

  const hideToast = useCallback(() => {
    // `...prev`： 既存内容を維持しつつ、
    // `isShown: false`： `isShown`プロパティのみ明示的に非表示状態に変更する
    setState((prev) => ({ ...prev, isShown: false }));
  }, []);

  // 各種ステート（`isShown`, `message`, `style`）と
  // アクション（`showToast`, `hideToast`）を呼び出し側に提供
  return { isShown, message, style, showToast, hideToast };
}
```

##### `index.tsx`
```tsx
import { ReactNode } from "react";
import { Toast } from "./Toast";
import {
  ToastActionContext,
  ToastState,
  ToastStateContext,
  ToastStyle,
} from "./ToastContext";
import { useToastProvider } from "./useToastProvider";
export { useToastAction, useToastState } from "./hooks";
export type { ToastState, ToastStyle };

export const ToastProvider = ({
  children,
  defaultState,
}: {
  children: ReactNode;
  defaultState?: Partial<ToastState>;
}) => {
  const { isShown, message, style, showToast, hideToast } =
    useToastProvider(defaultState);
  return (
    {/* Context.Providerでラップすることで、子コンポーネントツリー全体から
        グローバルステート（isShown, message, style）と
        アクション（showToast, hideToast）を参照可能にする */}
    <ToastStateContext.Provider value={{ isShown, message, style }}>
      <ToastActionContext.Provider value={{ showToast, hideToast }}>
        {children}
        {/* isShown が true になった時、表示される */}
        {isShown && <Toast message={message} style={style} />}
      </ToastActionContext.Provider>
    </ToastStateContext.Provider>
  );
};
```

> [!NOTE]
> - React19 からは`.Provider`は不要<br>
> [`<Context>`がプロバイダに ](https://ja.react.dev/blog/2024/12/05/react-19#context-as-a-provider)

- `useToastProvider.tsx`で定義したアクション（`showToast`）の使用例
```tsx
return (
    <form
      className={styles.module}
      onSubmit={handleSubmit(async (values) => {
        try {
          const data = await postLogin(values);
          window.location.href = data.redirectUrl;
        } catch (err) {
          showToast({ message: "ログインに失敗しました", style: "failed" });
        }
      })}
    >
    ...
    ..
    .
```

#### （今回のトーストUIにおける）グローバルステートのテスト観点
1. Provider が保持する状態に応じて表示が切り替わること
2. Provider が保持する更新関数（アクション）を経由して状態を更新できること

##### 方法1. テスト用のコンポーネントを用意してインタラクションを実施
```tsx
const user = userEvent.setup();

const TestComponent = ({ message }: { message: string }) => {
  const { showToast } = useToastAction(); // <Toast> を表示するためのフック
  return <button onClick={() => showToast({ message })}>show</button>;
};

// `userEvent`のメソッドは非同期なので必ず`async`, `await`
test("showToast を呼び出すと Toast コンポーネントが表示される", async () => {
  render(
    <ToastProvider>
      <TestComponent message={message} />
    </ToastProvider>
  );
  const message = "test";
  // 初めは表示されていない
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  // クリックして表示されることを確認
  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("alert")).toHaveTextContent(message);
});
```

##### 方法2. 初期値を注入して表示確認
```tsx
test("Succeed", () => {
  render(<ToastProvider defaultState={state}>{null}</ToastProvider>);
  const state: ToastState = {
    isShown: true,
    message: "成功しました",
    style: "succeed",
  };
  expect(screen.getByRole("alert")).toHaveTextContent(state.message);
});

test("Failed", () => {
  render(<ToastProvider defaultState={state}>{null}</ToastProvider>);
  const state: ToastState = {
    isShown: true,
    message: "失敗しました",
    style: "failed",
  };
  expect(screen.getByRole("alert")).toHaveTextContent(state.message);
});

// オブジェクト配列のイテレーション
// `satisfies`によって安全な型確認（検証オブジェクトが期待する`ToastState`の型定義を満たしているかチェックし、満たしていない場合は型エラーを出してくれる）を実現
test.each([
  { isShown: true, message: "成功しました", style: "succeed" },
  { isShown: true, message: "失敗しました", style: "failed" },
  { isShown: true, message: "通信中…", style: "busy" },
  // `...ToastState[])("$message",...`はメソッドチェーンではなく、
  // test.each([...]) の戻り値（関数）を即座に呼び出している
  // 関数A(引数1)(引数2) というカリー化されたような呼び出し
] satisfies ToastState[])("$message", (state) => {
  // $ はテンプレート変数のプレースホルダー
  // $message = 各オブジェクトの message プロパティの値を参照
  render(<ToastProvider defaultState={state}>{null}</ToastProvider>);
  expect(screen.getByRole("alert")).toHaveTextContent(state.message);
});
```

> [!NOTE]
> `test.each([])`<br>
> 同じテストをパラメータだけ変更してイテレーション（反復）したいときに有用
```tsx
test.each([
  {
    url: "/my/posts",
    name: "My Posts"
  },
  {
    url: "/my/posts/123",
    name: "My Posts"
  },
  {
    url: "/my/posts/create",
    name: "Create Post"
  }
])("$url では $name がカレントになっている", ({url, name}) => {
  // テスト処理内容
})
```
