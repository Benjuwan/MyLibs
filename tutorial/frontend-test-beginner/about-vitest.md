## Vitest を使う場合の差分

> [!IMPORTANT]
> このファイルの位置づけ：本リポジトリの他のドキュメント（[`README.md`](./README.md), [`about-mock.md`](./about-mock.md), [`about-matcher.md`](./about-matcher.md), [`about-UItest.md`](./about-UItest.md), [`about-test-base.md`](./about-test-base.md), [`use-typescript-config-jest.md`](./use-typescript-config-jest.md)）は、書籍『フロントエンド開発のためのテスト入門』に準拠して**Jest前提**のまま残す。  
> 本ファイルは、Vitestを利用する場合に**差分として押さえておくべきポイントのみ**を補足するものであり、既存のJest記述を置き換えるものではない。Jestの基本的な考え方（AAA、モック・スタブ・スパイの概念、Testing Libraryの哲学など）はJestとVitestで共通のため、そちらは各既存ドキュメントを参照すること。

---

## 1. `jest.Mock` という書き方はできない（相当する型は `Mock`）

| | Jest | Vitest |
|---|---|---|
| モック関数の型 | `jest.Mock` という型（interface）が存在する | Vitest に `jest` 名前空間は無いため `jest.Mock` という書き方はできない。相当する型は `vitest` からエクスポートされる **`Mock`** 型（`vi.fn()` / `vi.spyOn()` の戻り値型） |
| 型付けの方法 | `(greet as jest.Mock).mockReturnValue(...)` のようにキャストする | `import type { Mock } from 'vitest'` をインポートし、モック関数への型付けには **`vi.mocked()`** を使う |

- Jestでの書き方（[`about-mock.md`](./about-mock.md#jestでのモック使用方法jestmock-jestfn-jestspyon)参照）
```ts
(greet as jest.Mock).mockReturnValue(1234);
```

- Vitestでの書き方
```ts
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import { greet } from "./greet";

vi.mock("./greet");

test("モックした戻り値を返す（本来の実装ではない）", () => {
  // as jest.Mock のようなキャストではなく vi.mocked() でラップする
  vi.mocked(greet).mockReturnValue("Hi");
  expect(greet("Taro")).toBe("Hi");
});
```

> [!NOTE]
> `Mock`型自体を変数の型注釈として使いたい場合は `import type { Mock } from 'vitest'` でインポートする。ただし実務上は `vi.mocked()` でラップする書き方が推奨されている。
>
> なお、Jestの `as jest.Mock` はキャストにより実質 `any` へ落ちるため、元の戻り値型を無視した値（数値など）も設定できてしまうが、`vi.mocked()` は**元の関数シグネチャ（戻り値型）を保持する**ため、`string` を返す関数に `number` を設定すると型エラーになる。

---

## 2. `jest.requireActual()` → `await vi.importActual()`（非同期化に注意）

| | Jest | Vitest |
|---|---|---|
| 本来の実装を部分的に呼び出す関数 | `jest.requireActual("./greet")`（**同期**） | `await vi.importActual("./greet")`（**非同期**） |
| モックのファクトリ関数 | 同期関数のままでよい | `async`化が必要になる |

- Jestでの書き方（[`about-mock.md`](./about-mock.md#対象モジュールの置き換え処理)参照）
```ts
jest.mock("./greet", () => ({
  ...jest.requireActual("./greet"),
}));
```

- Vitestでの書き方（**ファクトリ関数を`async`化し、`await`で待つ**点が重要な差分）
```ts
import { vi } from 'vitest';

vi.mock("./greet", async () => {
  const actual = await vi.importActual("./greet");
  return {
    ...actual,
  };
});
```

> [!IMPORTANT]
> Jestの`jest.requireActual`は同期関数だったが、Vitestの`vi.importActual`は**Promiseを返す非同期関数**である。これに伴い、`vi.mock`の第二引数（ファクトリ関数）自体も`async`関数にする必要がある点がJestからの移行時に見落としやすい差分。

---

## 3. 元実装を残しつつスパイする：`vi.mock(path, { spy: true })`

Jestには存在しない、**Vitest固有の書き方**（**Vitest v2.1.0 以降**で利用可能。`@vitest/mocker` の導入に伴い追加）。モジュール全体を自動モック化しつつ、各エクスポートの「元の実装」は維持したまま呼び出し記録（スパイ）だけを行いたい場合に使う。

```ts
import { vi } from 'vitest';

// 第二引数に { spy: true } を指定すると、
// モジュールの各エクスポートは自動モック化されるが、元の実装は保持されたまま呼び出しが記録される
vi.mock("./greet", { spy: true });
```

> [!NOTE]
> Jestで同等のことをしたい場合は[`jest.spyOn`](./about-mock.md#jestspyon関数)を各エクスポートに対して個別に呼び出す必要があったが、Vitestでは`vi.mock`のオプション一つでモジュール全体に適用できる。

---

## 4. 設定ファイル（`vitest.config.ts`）

| Jest（`jest.config.ts`） | Vitest（`vitest.config.ts`） |
|---|---|
| `testEnvironment: 'jsdom'` | `test.environment: 'jsdom'` |
| `injectGlobals`（既定`true`。`describe`/`test`/`expect`をグローバル注入するかどうか。`jest-circus`のみサポート） | `test.globals: true`（`describe`/`test`/`expect`などをグローバルに使えるようにする） |
| `setupFilesAfterEnv`（[`about-UItest.md`](./about-UItest.md#reactで実装している場合)参照） | `test.setupFiles` |

> [!NOTE]
> Jestにも`globals`というオプションは存在するが、これは**テスト環境へ任意のグローバル変数を注入する別機能**（例：`globals: { __DEV__: true }`）であり、Vitestの`test.globals`に対応するものではない。対応するのは`injectGlobals`。

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

> [!NOTE]
> `test.globals: true`を設定しない場合、各テストファイル冒頭で`import { describe, test, expect } from 'vitest';`のように明示インポートする必要がある。

---

## 5. `@testing-library/jest-dom`：Vitest向けの別エントリを使う

| | Jest | Vitest |
|---|---|---|
| インポート対象 | `import '@testing-library/jest-dom';` | `import '@testing-library/jest-dom/vitest';` |

- Vitestでの`setupFiles`（上記4.の`test.setupFiles`で指定するファイル）
```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

> [!IMPORTANT]
> Jest向けの`@testing-library/jest-dom`（エントリなし）をそのままVitestでインポートしても動作しない、または期待通りの型拡張がされない場合がある。Vitest環境では**必ず`/vitest`サブパスエントリ**を使用すること。

---

## 6. カバレッジ：`@vitest/coverage-v8` を別途インストール（istanbulではなくv8ベース）

| | Jest | Vitest |
|---|---|---|
| カバレッジの計測エンジン | 標準搭載（istanbulベース） | 標準搭載していない。**別パッケージのインストールが必要** |
| 追加インストール | 不要 | `@vitest/coverage-v8`（デフォルト推奨。istanbulベースを使いたい場合は`@vitest/coverage-istanbul`も選択可） |
| 実行コマンド | `npx jest --coverage`（[`README.md`](./README.md#カバレッジレポートの出力)参照） | `npx vitest run --coverage` |

```bash
# カバレッジ計測用パッケージを別途インストール
npm install --save-dev @vitest/coverage-v8

# カバレッジ付きでテストを実行
npx vitest run --coverage
```

> [!NOTE]
> JestのカバレッジはIstanbulベースだが、Vitestのデフォルト推奨は**V8エンジンのネイティブカバレッジ機能を利用したv8ベース**。計測方式が異なるため、同一コードでも数値が完全一致しない場合がある。

---

## 7. フェイクタイマー：Jestとほぼ同等の書き方ができる

| Jest | Vitest |
|---|---|
| `jest.useFakeTimers();` | `vi.useFakeTimers();` |
| `jest.setSystemTime(new Date(...));` | `vi.setSystemTime(new Date(...));` |
| `jest.useRealTimers();` | `vi.useRealTimers();` |

- Jestでの書き方（[`about-mock.md`](./about-mock.md#例2現在時刻に依存したテスト)参照）
```ts
beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});
test("朝は「おはよう」を返す", () => {
  jest.setSystemTime(new Date(2023, 4, 23, 8, 0, 0));
  expect(greetByTime()).toBe("おはよう");
});
```

- Vitestでの書き方（`jest` → `vi` に置き換えるだけでほぼ同等）
```ts
import { vi, beforeEach, afterEach, test, expect } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});
test("朝は「おはよう」を返す", () => {
  vi.setSystemTime(new Date(2023, 4, 23, 8, 0, 0));
  expect(greetByTime()).toBe("おはよう");
});
```

---

## 8. MSW v2のセットアップ：`vitest.setup.ts` にライフサイクルを置く公式パターン

MSW自体のAPI（`http`, `HttpResponse`, `setupServer`）はJest/Vitestどちらでも共通（[`about-mock.md`](./about-mock.md#mswmock-service-worker)参照）だが、Vitestでは**セットアップファイル（`vitest.setup.ts`）側にライフサイクル管理をまとめて記述する**公式パターンが推奨されている。

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server'; // setupServer(...) のインスタンス

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

> [!NOTE]
> Jestの場合、[`about-mock.md`のMSWセクション](./about-mock.md#jest-で-msw-を使うには)にあるように`setupMockServer`関数として各テストファイル側（または共通ユーティリティ）に`beforeAll`/`afterEach`/`afterAll`を書く例を紹介しているが、Vitestでは`vitest.setup.ts`（上記4.の`test.setupFiles`で読み込まれるファイル）に集約するのが公式に推奨される形。

---

## 9. 【重要な補足】ViteとJest(CJS)の設定衝突は、Vitestではそもそも発生しない

[`use-typescript-config-jest.md`](./use-typescript-config-jest.md)の主題は「ViteプロジェクトのESMとJest(CJS前提)が衝突する問題」であり、その解決のために`ts-jest`や`ts-node`のインストールが必要だった。

**Vitestを使う場合、この問題自体がそもそも発生しない。**

- Jestの場合の問題点（[`use-typescript-config-jest.md`](./use-typescript-config-jest.md#解決策)参照）
    - Viteプロジェクトの`package.json`は通常`"type": "module"`（ESM前提）
    - JestはESMサポートが実験的段階のため、CJS前提の部分と「衝突」が起きる
    - 回避のために`ts-jest`（トランスパイル）や`jest.config.ts`をロードするための`ts-node`など、追加パッケージと設定が必要だった

- Vitestの場合
    - Vitest自体が**Vite上に構築されている**ため、Viteのビルド設定（ESM、TypeScript変換）をテスト実行時にもそのまま利用できる
    - `ts-jest`や`ts-node`に相当する追加のトランスパイル用パッケージのインストールが**不要**
    - `vite.config.ts`と`vitest.config.ts`を分離、または`vite.config.ts`内に`test`プロパティを追記するだけで完結し、**Vite用の設定とテスト用の設定を二重管理する必要がない**

> [!IMPORTANT]
> Jest導入時に発生する「ESM/CJS衝突」や「TypeScript変換のための専用パッケージ導入」は、Viteベースのプロジェクトに起因する構造的な問題である。VitestはViteのエコシステム内で完結するテストランナーのため、この種の設定衝突そのものが構造的に発生しない、という点がJestとVitestを比較する上で最も本質的な差分と言える。
