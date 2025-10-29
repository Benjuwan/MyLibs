## テストの記述方法や関連知識など

### テストファイルの命名
- `テスト対象モジュール名.ts` -> `テスト対象モジュール名.test.ts`
    - `.spec.ts`: ユニットテスト用。各モジュールや関数の仕様（specification）をテスト。
    - `.test.ts`: 統合テスト用。複数のモジュールやサービスが正しく連携して動作するかをテスト。

※これら拡張子には標準的な使い分けが存在するわけではない。どちらの拡張子を使用するかは、プロジェクトやチームの慣習、または個人の好みに依存している。書籍では`.test.ts`で統一されている。

### テストファイルの配置パターン
- `__test__`ディレクトリを用意して、その中に配置する
- コロケーションを意識して対象モジュールの近くに配置する

### テストの構成要素
#### 一つのテスト
Jestが提供するAPIの`test関数`でテストを定義する。`test関数`は2つの引数を持つ。
```ts
test("テストタイトル", テスト関数);
```

- 第一引数：テストタイトル。テストの内容を平易に表すタイトルを付ける
```ts
test("1 + 2 = 3");
```

> [!IMPORTANT]
> 後述する`describe関数`のグループタイトルもそうだが、テストタイトルは**挙動・振る舞いにスポットをあてた内容**にすること。
> **どういった意図があって、このような処理が施されているのかという背景情報を明確にする**ことで**他の人も理解しやすくなる**し、（テストコードがその役割を果たすため）ドキュメントを用意する手間も省ける。

- 第二引数：テスト関数。**検証値が期待値通りである**という検証を行うための文（**アサーション**）を書く
```ts
test("1 + 2 = 3", () => {
    // 以下の文がアサーションで、マッチャーは`.toBe(期待値)`の部分
    expect(検証値).toBe(期待値);
});
```

- アサーション：`expect関数`に続けて記述する`マッチャー`で構成される
- マッチャー：期待値の振る舞いを担う

#### グループのテスト
関連するいくつかのテストをまとめたい場合に`describe関数`を用いる。この関数も`test関数`と同じく2つの引数を持つ。
```ts
describe("グループタイトル", グループ関数)
```

- 事例
```ts
describe("四則演算", () => {
  // 加算
  describe("add", () => {
    test("1 + 1 は 2", () => {
      expect(add(1, 1)).toBe(2);
    });
    test("1 + 2 は 3", () => {
      expect(add(1, 2)).toBe(3);
    });
  });

  // 減算
  describe("sub", () => {
    test("1 - 1 は 0", () => {
      expect(sub(1, 1)).toBe(0);
    });
    test("2 - 1 は 1", () => {
      expect(sub(2, 1)).toBe(1);
    });
  });
});
```

> [!NOTE]
> `test関数`はネストできないが、`describe関数`はネストできる。

### 適切なエラーインスタンスで例外テストを明確にする
- 例外処理のアサーションでは、マッチャーには`toThrow`を使用する
```ts
expect(() => 検証値：例外スローが想定される関数).toThrow();
```

> [!NOTE]
> 例外をスローする関数は**アロー関数でラップ**する必要がある。
> ラップしない場合、関数がその場で実行されて例外がスローされ、Jestがキャッチできずにテストが失敗するため。
> 
> ```ts
> // NG: 即座に実行されてしまう
> expect(checkRange(-10)).toThrow();
> 
> // OK: Jestが実行をコントロールできる
> expect(() => checkRange(-10)).toThrow();
> ```

> [!IMPORTANT]
> 例外は特性上、意図しないバグもスローされるのでテストを書く際は**意図した例外がスローされるか？**を意識して取り組むことで適切なテストを用意できる。

#### `toThrow`マッチャーは引数を与えることで、スローされた例外の内訳をより詳細に検証できる
例えば、以下のような例外スローを検証する場合、
```ts
if (value < 0 || value > 100) {
    throw new RangeError("入力値は0〜100の間で入力してください");
}
```

このようにマッチャーの引数の内容に齟齬があった時はエラーが発生する
```ts
test("引数が'0〜100'の範囲外だった場合、例外をスローする", () => {
    const message = "入力値は0〜1000の間で入力してください"; // 100 を 1000 に変更
    expect(() => add(-10, 10)).toThrow(message);
    expect(() => add(10, -10)).toThrow(message);
    expect(() => add(-10, 110)).toThrow(message);
});
```

エラー内容
```bash
    expect(received).toThrow(expected)

    Expected substring: "入力値は0〜1000の間で入力してください"
    Received message:   "入力値は0〜100の間で入力してください"

          3 | function checkRange(value: number) {
          4 |   if (value < 0 || value > 100) {
        > 5 |     throw new RangeError("入力値は0〜100の間で入力してください");
            |           ^
          6 |   }
          7 | }
          8 |

          at checkRange (src/03/05/index.ts:5:11)
          at add (src/03/05/index.ts:10:3)
          at src/03/05/index.test.ts:13:20
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:312:21)
          at Object.<anonymous> (src/03/05/index.test.ts:13:34)

      11 |     test("引数が'0〜100'の範囲外だった場合、例外をスローする", () => {
      12 |       const message = "入力値は0〜1000の間で入力してください";
    > 13 |       expect(() => add(-10, 10)).toThrow(message);
         |                                  ^
      14 |       expect(() => add(10, -10)).toThrow(message);
      15 |       expect(() => add(-10, 110)).toThrow(message);
      16 |     });

      at Object.<anonymous> (src/03/05/index.test.ts:13:34)
```

#### テストケースにあった例外スローを実施（適切なエラーインスタンスを用いる）
一般的な例外スローは以下のような`Error`インスタンスが多い。
```ts
throw new Error("エラーメッセージ");
```

**`Error`インスタンスは、他のエラーインスタンス（派生クラス・サブタイプ）の基幹クラス（スーパータイプ）**なので「継承及び`instanceof 演算子`で条件分岐する」ことで適切なテストケースを用意できる。

```ts
// Errorインスタンスを継承した RangeErrorエラークラスを用意
export class RangeError extends Error {}

// Errorインスタンスを継承した HttpErrorエラークラスを用意
export class HttpError extends Error {}

if(err instanceof RangeError) {
    // 捉えたエラーが RangeErrorインスタンスだった場合の処理
}

if(err instanceof HttpError) {
    // 捉えたエラーが HttpErrorインスタンスだった場合の処理
}
```

### 用途別マッチャー
アサーション（検証値が期待値通りであるという検証を行うための文）は、マッチャーを用いて検証する。そのため「どのような値が期待値なのか」を正しくテストするには、マッチャーの種類を知っておく（引き出しを増やしておく）必要がある。

> [!NOTE]
> それぞれ各マッチャーの前に`.not`を加えると判定を反転できる。
> ```ts
> expect(false).not.toBeTruthy();
> ```

#### 真偽値の検証
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

##### `toBeTruthy`
`true`である値に一致する。

##### `toBeFalsy`
`false`である値に一致する。<br>
`null`や`undefined`も`toBeFalsy`で一致するが、それぞれを正しく検証したい場合は以下を使用する
- `toBeNull`
- `toBeDefined`

#### 数値の検証
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

##### `toBe`
等価比較

##### `toBeGreaterThan`
大なり比較

##### `toBeLessThan`
小なり比較

##### `toBeCloseTo`
JavaScriptでは**10進数の小数を2進数に変換する時に小数計算に誤差が生じてしまう**。<br>
少数の正確な計算ができるライブラリを使用せずに小数計算を検証する場合に`toBeCloseTo`マッチャーを利用する。<br>
第二引数には、どこまでの桁を比較するのか数値指定する（デフォルトは小数点以下2桁）。

#### 文字列の検証
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

##### `toEqual`
`toBe`と同じく等価比較<br>
※`toBe`と`toEqual`の違いは、`toEqual`はオブジェクトの中身を比較するのに対し、`toBe`はオブジェクトの参照を比較する。

##### `toContain`
文字列の部分一致

##### `toMatch`
正規表現

#### 配列の検証
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

##### `toContain`
配列に特定のプリミティブ（※コード例では"Jest"という文字列）が含まれているか

##### `toHaveLength`
配列要素数が引数に指定した数値と一致するか

##### `toContainEqual`
等価比較。配列に特定のオブジェクトが含まれているか

##### `arrayContaining`
等価比較。引数に与えた配列要素が全て含まれているか

#### オブジェクトの検証
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

##### `toMatchObject`
オブジェクトの持つプロパティが部分一致するかどうか

##### `toHaveProperty`
オブジェクトが特定のプロパティを持っているかどうか

##### `objectContaining`
オブジェクトに含まれるオブジェクトを検証する。具体的には、対象プロパティが期待値のオブジェクトと部分一致するかどうかをチェックする。

#### 非同期処理
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

##### 1. `Promise`を返して`then`（または`catch`）に渡す関数内にアサーションを書く方法
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

##### 2. `resolves`を使用したアサーションを返す方法
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

##### 3. テスト関数を`async`関数とし、関数内で`Promise`の解決を待つ方法
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

##### 4. 検証値の`Promise`が解決するのを待ってからアサーションに展開する方法
この方法4が最もシンプルな書き方。`async`, `await`関数を使った書き方の場合、ほかの非同期処理のアサーションも**1つのテスト関数内に収める**ことができる。

```ts
test("指定時間待つと、経過時間をもって resolve される", async () => {
  expect(await wait(50)).toBe(50);
});
```

##### 非同期処理をテストする際の注意事項
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
> 上記のような事態にならないよう非同期処理テストを書く際は以下に注意する
> - `expect.assertions`を冒頭に書いてアサーションが実行されることを保証する
> - `resolves`や`rejects`マッチャーを含むアサーションは`await`する
> - 非同期処理を含むテストは、テスト関数を`async`関数にする
> - `Promise`を返す場合は`return`文を忘れない

---

## モック（テストダブル）
外部システムやAPIなどこちらでコントロール不能なものをテスト対象に含む場合、テストの安定性を確保するためにモックを活用する。<br>
モックは**取得したデータまたはコンポーネントなどの代用品**で、関連するシステムやAPIが提供する本来の機能をエミュレート（模倣・再現）する。これにより、外部システムの状態に依存せずに一貫したテスト環境を構築できる。

### モックの種類
#### スタブ
スタブの主な目的は**代用を行う**こと。例えば「Web APIからこんな値が返ってきた場合にはこのように動作する」というテストをスタブで使用する。テスト対象がスタブにアクセスすると、スタブは定められた値を返す。

- データや依存コンポーネントの代用品
- 定められた値を返却するもの
- テスト対象に**入力**を与えるためのもの

#### スパイ
スパイの主な目的は**挙動・振る舞いの記録を行う**こと。コールバック関数を一例とすると、スパイは実行されたコールバック関数の**実行回数**や**実行時引数を記録**するので、意図通りの呼び出し（振る舞い）かどうかをチェックできる。

- 関数・メソッドの呼び出しを記録するオブジェクト
- 関数・メソッドの実行回数や実行時引数を記録するもの
- テスト対象からの**出力**を確認するためのもの

---

## 用語集
### アサーション
検証値が期待値通りであるという検証を行うための文
