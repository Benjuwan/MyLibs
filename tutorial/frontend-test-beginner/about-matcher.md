## 用途別マッチャー
アサーション（検証値が期待値通りであるという検証を行うための文）は、マッチャーを用いて検証する。そのため「どのような値が期待値なのか」を正しくテストするには、マッチャーの種類を知っておく（引き出しを増やしておく）必要がある。

> [!NOTE]
> それぞれ各マッチャーの前に`.not`を加えると判定を反転できる。
> ```ts
> expect(false).not.toBeTruthy();
> ```

### `toMatchSnapshot`
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

### `toThrow`
関数が例外をスローするかどうかを検証

> [!NOTE]
> 例外をスローする関数は**アロー関数でラップ**する必要がある。
> ラップしない場合、関数がその場で実行されて例外がスローされ、Jestがキャッチできずにテストが失敗するため。

```ts
// 基本的な使用例
expect(() => {
  throw new Error("エラー");
}).toThrow();

// エラーメッセージを検証
expect(() => {
  throw new Error("無効な入力");
}).toThrow("無効な入力");

// 特定のエラー型を検証
expect(() => {
  throw new TypeError("型エラー");
}).toThrow(TypeError);
```

### 真偽値の検証
```ts
describe("真偽値の検証", () => {
  test("「真」の検証", () => {
    expect(1).toBeTruthy();
    expect("1").toBeTruthy();
    expect(true).toBeTruthy();
    expect(0).not.toBeTruthy();
    expect("").not.toBeTruthy();
    expect(false).not.toBeTruthy();
  });
  test("「偽」の検証", () => {
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
    expect(false).toBeFalsy();
    expect(1).not.toBeFalsy();
    expect("1").not.toBeFalsy();
    expect(true).not.toBeFalsy();
  });
  test("「null, undefined」の検証", () => {
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(undefined).not.toBeDefined();
  });
});
```

#### `toBeTruthy`
`true`である値に一致する。

#### `toBeFalsy`
`false`である値に一致する。<br>
`null`や`undefined`も`toBeFalsy`で一致するが、それぞれを正しく検証したい場合は以下を使用する
- `toBeNull`
- `toBeDefined`

### 数値の検証
```ts
describe("数値の検証", () => {
  const value = 2 + 2;
  test("検証値 は 期待値 と等しい", () => {
    expect(value).toBe(4);
    expect(value).toEqual(4);
  });
  test("検証値 は 期待値 より大きい", () => {
    expect(value).toBeGreaterThan(3); // 4 > 3
    expect(value).toBeGreaterThanOrEqual(4); // 4 >= 4
  });
  test("検証値 は 期待値 より小さい", () => {
    expect(value).toBeLessThan(5); // 4 < 5
    expect(value).toBeLessThanOrEqual(4); // 4 <= 4
  });
  test("小数計算は正確ではない", () => {
    expect(0.1 + 0.2).not.toBe(0.3);
  });
  test("小数計算の指定桁までを比較する", () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3); // デフォルトは小数点以下2桁
    expect(0.1 + 0.2).toBeCloseTo(0.3, 15);
    expect(0.1 + 0.2).not.toBeCloseTo(0.3, 16);
  });
});
```

#### `toBe`
等価比較

#### `toBeGreaterThan`
大なり比較

#### `toBeLessThan`
小なり比較

#### `toBeCloseTo`
JavaScriptでは**10進数の小数を2進数に変換する時に小数計算に誤差が生じてしまう**。<br>
少数の正確な計算ができるライブラリを使用せずに小数計算を検証する場合に`toBeCloseTo`マッチャーを利用する。<br>
第二引数には、どこまでの桁を比較するのか数値指定する（デフォルトは小数点以下2桁）。

### 文字列の検証
```ts
describe("文字列の検証", () => {
  const str = "こんにちは世界";
  const obj = { status: 200, message: str };

  test("検証値 は 期待値 と等しい", () => {
    expect(str).toBe("こんにちは世界");
    expect(str).toEqual("こんにちは世界");
  });
  test("指定された文字数（文字列の長さ）か", () => {
    expect(str).toHaveLength(7);
    expect(str).not.toHaveLength(8);
  });
  test("指定された文字列を含むか", () => {
    expect(str).toContain("世界");
    expect(str).not.toContain("さようなら");
  });
  test("指定された文字列を含むかどうかを正規表現を使って判定", () => {
    expect(str).toMatch(/世界/);
    expect(str).not.toMatch(/さようなら/);
  });

  test("オブジェクトの対象プロパティの文字列型の値が指定された文字列を含むか", () => {
    expect(obj).toEqual({
      status: 200,
      message: expect.stringContaining("世界"),
    });
  });
  test("オブジェクトの対象プロパティの文字列型の値が指定された文字列を含むかどうかを正規表現を使って判定", () => {
    expect(obj).toEqual({
      status: 200,
      message: expect.stringMatching(/世界/),
    });
  });
});
```

#### `toEqual`
`toBe`と同じく等価比較<br>
※`toBe`と`toEqual`の違いは、`toEqual`はオブジェクトの中身を比較するのに対し、`toBe`はオブジェクトの参照を比較する。

#### `toContain`
文字列の部分一致

#### `toMatch`
正規表現

### 配列の検証
```ts
describe("配列の検証", () => {
  describe("プリミティブ配列", () => {
    const tags = ["Jest", "Storybook", "Playwright", "React", "Next.js"];

    test("'Jest'という文字列が含まれているか", () => {
      expect(tags).toContain("Jest");
      expect(tags).toHaveLength(5);
    });
  });
  describe("オブジェクト配列", () => {
    const article1 = { author: "taro", title: "Testing Next.js" };
    const article2 = { author: "jiro", title: "Storybook play function" };
    const article3 = { author: "hanako", title: "Visual Regression Testing " };
    const articles = [article1, article2, article3];

    test("articles に article1オブジェクトが含まれているか", () => {
      expect(articles).toContainEqual(article1);
    });
    test("articles に article1 と article3 オブジェクトどちらも含まれているか", () => {
      expect(articles).toEqual(expect.arrayContaining([article1, article3]));
    });
  });
});
```

#### `toContain`
配列に特定のプリミティブ（※コード例では"Jest"という文字列）が含まれているか

#### `toHaveLength`
配列要素数が引数に指定した数値と一致するか

#### `toContainEqual`
等価比較。配列に特定のオブジェクトが含まれているか

#### `arrayContaining`
等価比較。引数に与えた配列要素が全て含まれているか

### オブジェクトの検証
```ts
describe("オブジェクトの検証", () => {
  const author = { name: "taroyamada", age: 38 };
  const article = {
    title: "Testing with Jest",
    author,
  };

  test("author のプロパティが引数に指定されたオブジェクトと部分一致するかどうか", () => {
    expect(author).toMatchObject({ name: "taroyamada", age: 38 });
    expect(author).toMatchObject({ name: "taroyamada" });
    expect(author).not.toMatchObject({ gender: "man" });
  });
  test("author が引数に指定されたプロパティを持っているかどうか", () => {
    expect(author).toHaveProperty("name");
    expect(author).toHaveProperty("age");
  });
  test("toEqual でオブジェクトの中身を比較し、 そのうえでオブジェクトの author プロパティが引数に指定されたオブジェクトと部分一致するかどうか", () => {
    expect(article).toEqual({
      title: "Testing with Jest",
      author: expect.objectContaining({ name: "taroyamada" }),
    });
    expect(article).toEqual({
      title: "Testing with Jest",
      author: expect.not.objectContaining({ gender: "man" }),
    });
  });
});
```

#### `toMatchObject`
オブジェクトの持つプロパティが部分一致するかどうか

#### `toHaveProperty`
オブジェクトが特定のプロパティを持っているかどうか

#### `objectContaining`
オブジェクトに含まれるオブジェクトを検証する。具体的には、対象プロパティが期待値のオブジェクトと部分一致するかどうかをチェックする。

### 非同期処理
非同期処理テストの書き方はいくつかタイプがある。

1. [`Promise`を返して`then`に渡す関数内にアサーションを書く方法](#1-promiseを返してthenまたはcatchに渡す関数内にアサーションを書く方法)
2. [`resolves`を使用したアサーションを返す方法](#2-resolvesを使用したアサーションを返す方法)
3. [テスト関数を`async`関数とし、関数内で`Promise`の解決を待つ方法](#3-テスト関数をasync関数とし関数内でpromiseの解決を待つ方法)
4. [検証値の`Promise`が解決するのを待ってからアサーションに展開する方法](#4-検証値のpromiseが解決するのを待ってからアサーションに展開する方法)

---

- テスト対象となる非同期処理コード
```ts
export function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(duration);
    }, duration);
  });
}

export function timeout(duration: number) {
  // 余談：`Promise`には二つの引数が渡せるが必ず一つ目の引数が必要となる。
  // 今回期待する挙動は失敗処理（`reject`）で、成功処理（`resolve`）に関する引数は不要となる。
  // 第一引数`には`_`を指定して使用しないことを明示している。
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(duration);
    }, duration);
  });
}
```

#### 1. `Promise`を返して`then`（または`catch`）に渡す関数内にアサーションを書く方法
`wait`関数を実行するとPromiseインスタンスが生成される。これをテスト関数の戻り値とすることでPromiseが解決するまでテストの判定を待つ。

```ts
test("指定時間待つと、経過時間をもって resolve される", () => {
  return wait(50).then((duration) => {
    expect(duration).toBe(50);
  });
});
```

- 失敗処理（`reject`）の場合<br>
`catch`メソッドに渡す関数内にアサーションを書く。
```ts
test("指定時間待つと、経過時間をもって reject される", () => {
  return timeout(50).catch((duration) => {
    expect(duration).toBe(50);
  });
});
```

#### 2. `resolves`を使用したアサーションを返す方法
`wait`関数が`resolve`した時の値を検証したい場合、先の[方法1](#1-promiseを返してthenまたはcatchに渡す関数内にアサーションを書く方法)よりもシンプルに書ける。

```ts
test("指定時間待つと、経過時間をもって resolve される", () => {
  return expect(wait(50)).resolves.toBe(50);
});
```

- 失敗処理（`reject`）の場合<br>
`rejects`マッチャーを使用して検証する方法。アサーションを返すか、`async`内でPromiseの解決を待つ。
```ts
test("指定時間待つと、経過時間をもって reject される", () => {
  return expect(timeout(50)).rejects.toBe(50);
});

test("指定時間待つと、経過時間をもって reject される", async () => {
  await expect(timeout(50)).rejects.toBe(50);
});
```

#### 3. テスト関数を`async`関数とし、関数内で`Promise`の解決を待つ方法
`resolves`マッチャーを使用したアサーションも`await`で待つことができる

```ts
test("指定時間待つと、経過時間をもって resolve される", async () => {
  await expect(wait(50)).resolves.toBe(50);
});
```

- 失敗処理（`reject`）の場合<br>
`try{} catch{}`文を使用する方法。`Unhandled Rejection`を`try`ブロック内で発生させて、そのエラーを`catch`ブロック内で捕捉し、アサーションで検証するという方法。
```ts
test("指定時間待つと、経過時間をもって reject される", async () => {
  // アサーションが一度実行されることを期待する
  // これがないと、Promiseが解決する前にテストが終了してしまう可能性がある
  expect.assertions(1);

  try {
    await timeout(50);
  } catch (err) {
    expect(err).toBe(50);
  }
});
```

> [!NOTE]
> - `expect.assertions(実行される回数の期待値)`：<br>
> アサーションが実行されることそのものを検証し、引数には実行される回数の期待値を設定する<br>
> これがないと、**Promiseが解決する前にテストが終了してしまう可能性があるので、非同期処理テストでは冒頭に`expect.assertions`を書いておく**ことを推奨する。

#### 4. 検証値の`Promise`が解決するのを待ってからアサーションに展開する方法
**この方法4が最もシンプルな書き方**。<br>`async`, `await`関数を使った書き方の場合、ほかの非同期処理のアサーションも**1つのテスト関数内に収める**ことができる。

```ts
test("指定時間待つと、経過時間をもって resolve される", async () => {
  expect(await wait(50)).toBe(50);
});
```

#### 非同期処理をテストする際の注意事項
以下のテストコードでは`return`文がないため、`wait`関数の`Promise`が解決する前にテストが終了してしまう。<br>
つまり、**アサーションが実行されないままテストが完了してしまうため、意図した検証が行われない**ことになる。<br>
正しい方法はコメントアウト部分に記載通り`return`する。

```ts
test("return していないため、Promise が解決する前にテストが終了してしまう", () => {
  // 失敗を期待して書かれたアサーション
  expect(wait(2000)).resolves.toBe(3000);

  // 正しくはアサーションを return する
  // return expect(wait(2000)).resolves.toBe(3000);
});
```

> [!IMPORTANT]
> 上記のような事態にならないよう非同期処理テストを書く際は以下に注意する<br>
> - `expect.assertions`を冒頭に書いてアサーションが実行されることを保証する
> - `resolves`や`rejects`マッチャーを含むアサーションは`await`する
> - 非同期処理を含むテストは、テスト関数を`async`関数にする
> - `Promise`を返す場合は`return`文を忘れない

### モック関数
- `jest.fn`を使ってモック関数を作成<br>
作成したモック関数はテストコードで関数として使用する。
```ts
const mockFn = jest.fn();
```

#### `toHaveBeenCalled`
モック関数が実行されたかどうか検証する
```ts
test("モック関数は実行された", () => {
  const mockFn = jest.fn();
  mockFn();
  expect(mockFn).toHaveBeenCalled();
});

test("モック関数は実行されていない", () => {
  const mockFn = jest.fn();
  expect(mockFn).not.toHaveBeenCalled();
});
```

#### `toHaveBeenCalledTimes`
モック関数が何回実行されたか検証する
```ts
test("モック関数は実行された回数を記録している", () => {
  const mockFn = jest.fn();
  mockFn();
  expect(mockFn).toHaveBeenCalledTimes(1);
  mockFn();
  expect(mockFn).toHaveBeenCalledTimes(2);
});
```

#### `toHaveBeenCalledWith`
指定した引数を持って、テスト対象の関数・メソッドが呼び出されたかを検証する

- テスト対象メソッド`greet`の中身
```ts
export function greet(
  name: string, 
  callback?: (message: string) => void // 第二引数はオプショナル
) {
  callback?.(`Hello! ${name}`);
}
```

```ts
test("モック関数は実行時の引数を記録している", () => {
  const mockFn = jest.fn();
  function greet(message: string) {
    mockFn(message); // 引数を持って実行されている
  }
  greet("hello"); // "hello"を持って実行されたことが`mockFn`に記録される
  expect(mockFn).toHaveBeenCalledWith("hello");
});

// モック関数をコールバック関数として、テスト対象メソッドの引数に指定
// コールバック関数の実行時引数を検証できるので、記録した実行時引数の内訳を検証するスパイとして利用できる
test("モック関数はテスト対象の引数として使用できる", () => {
  const mockFn = jest.fn();
  greet("Jiro", mockFn); // 第二引数にコールバック関数としてモック関数を指定
  expect(mockFn).toHaveBeenCalledWith("Hello! Jiro");
});
```

##### `toHaveBeenCalledWith`は配列やオブジェクトも検証可能
先のコードでは文字列`hello`や`Jiro`を引数に持った事例だったが、`toHaveBeenCalledWith`は配列やオブジェクトも検証できる。

- テスト対象メソッド
```ts
const config = {
  mock: true,
  feature: { spy: true },
};

export function checkConfig(callback?: (payload: object) => void) {
  // 引数`callback`はオプショナルなので引数指定されなければ`undefined`で処理が流される
  // 以下は「引数に指定された値が定義した型準拠の関数（`(payload: object) => void`）である場合のみ、
  // その関数を`config`オブジェクトを引数として実行する」という記述
  callback?.(config);
}
```

```ts
import { checkConfig } from "./checkConfig";

test("モック関数は実行時引数のオブジェクト検証ができる", () => {
  const mockFn = jest.fn();
  checkConfig(mockFn);
  expect(mockFn).toHaveBeenCalledWith({
    mock: true,
    feature: { spy: true },
  });
});

test("expect.objectContaining による部分検証", () => {
  const mockFn = jest.fn();
  checkConfig(mockFn);
  expect(mockFn).toHaveBeenCalledWith(
    // objectContaining： オブジェクトに含まれるオブジェクトを検証する。
    // 具体的には、対象プロパティが期待値のオブジェクトと部分一致するかどうかをチェックする。
    expect.objectContaining({
      feature: { spy: true },
    })
  );
});
```

### カスタムマッチャー（`jest-dom`）
UIコンポーネントのテストでもJestのアサーションやマッチャーを利用できるものの、DOMの状態を検証するにはJest標準だけでは不十分な場合がある。そのため[`@testing-library/jest-dom`](https://www.npmjs.com/package/@testing-library/jest-dom)をインストールして、Jestの拡張機能であるカスタムマッチャーを扱えるようにする。`jest-dom`によって、UIコンポーネントテストに便利なマッチャーが多数追加される。

#### `toBeInTheDocument`
要素がドキュメントに存在するかどうかを検証する
```ts
test("名前の表示", () => {
  render(<Form name="taro" />); // 検証対象DOMを描画
  expect(screen.getByText("taro")).toBeInTheDocument(); // 検証対象が取得できているか（その有無を）検証
});
```

#### `toHaveTextContent`
期待するテキストが含まれているかどうかを検証する
```ts
test("見出しの表示", () => {
  render(<Form name="taro" />);
  // h系統要素が「アカウント情報」というテキスト情報を持っているかどうか（<h2>アカウント情報</h2>）
  expect(screen.getByRole("heading")).toHaveTextContent("アカウント情報");
});
```

#### `toHaveAttribute`
第一引数に属性名を記述し、第二引数に検証値を記述する
```ts
// 「もっと見る」というテキストを持った`a: link`要素の`href`属性の中身を検証
expect(screen.getByRole("link", { name: "もっと見る" })).toHaveAttribute(
  "href",
  "/articles/howto-testing-with-typescript"
);
```

#### `toBeChecked`
```ts
test("チェックボックスはチェックが入っていない", () => {
  render(<Agreement />);
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});
```