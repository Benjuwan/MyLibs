## テストの基礎知識
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

##### 第一引数：テストタイトル
テストの内容を平易に表すタイトルを付ける
```ts
test("1 + 2 = 3");
```

> [!IMPORTANT]
> 後述する`describe関数`のグループタイトルもそうだが、テストタイトルは**挙動・振る舞いにスポットをあてた内容**にすること。
> **どういった意図があって、このような処理が施されているのかという背景情報を明確にする**ことで**他の人も理解しやすくなる**し、（テストコードがその役割を果たすため）ドキュメントを用意する手間も省ける。

##### 第二引数：テスト関数
**検証値が期待値通りである**という検証を行うための文（**アサーション**）を書く
```ts
test("1 + 2 = 3", () => {
    // 以下の文がアサーションで、マッチャーは`.toBe(期待値)`の部分
    expect(検証値).toBe(期待値);
});
```

#### アサーション：
検証値が期待値通りであるという検証を行うための文。`expect関数`に続けて記述する`マッチャー`で構成される

#### マッチャー：
期待値の振る舞いを担う。[用途別マッチャーのまとめドキュメントはこちら](./about-matcher.md)

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
