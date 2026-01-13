---
title: Vite × React × TypeScript プロジェクトでの Jest 設定手順
tags: React TypeScript Jest テスト
author: benjuwan
slide: false
---
## はじめに
Vite × React × TypeScript を前提にしています。

また、本記事ではロジックテストを軸にした TypeScript関数（`.ts`ファイル）の基本的な Jestセットアップを解説します。
※Reactコンポーネント（`.tsx`）のUIテストについては、別途`jsdom`環境の設定が必要となります。

<details><summary>Reactコンポーネントで jsdom が必要となる理由</summary>

React 開発では、Vite を含むバンドルやテストなどの各種ツールを実行するために、JavaScript を実行するためのバックエンド側の実行環境が必要となります。

バックエンド側での JavaScript 実行環境の代表例が Node.js であり、他にも Bun や Deno などが存在します。

Node.js は、Vite を含むバンドル処理やテスト実行などをサポートしますが、DOM API を直接扱う機能は持っていません。

フロントエンド向け UI ライブラリである React のコンポーネントテスト（UIテスト）では DOM API の操作が前提となるため、バックエンド環境上でテストを実行する際には、DOM API をエミュレート（模倣）する`jsdom`が必要となります。

</details>

---

Vite といえば Vitest がテストツールとして相性が良いものの、Jest もまた依然としてシェア率が高いことを踏まえて「Jest × TypeScript の設定手順」を書いていきます。

というのも 筆者が Jest について学習中に以下の公式ドキュメントを参照しましたが情報がいくつか不足しているようで上手くいきませんでした。

- [Getting Started](https://jestjs.io/docs/getting-started)
    - [Using TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [Jest config file | Installation](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation#jest-config-file)
- [ESM Support](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support)

::: note warn
そもそも、Jest では ESM：ECMAScript Modules（※Vite成果物はESM）が実験的サポートの段階だそうで設定が複雑になりがち。

Viteプロジェクトの`package.json`には通常`"type": "module"`と書かれています。これがあると、Node.js はすべてのファイルを ESM として扱おうとしますが、Jest（および一部の関連ツール）は CommonJS での動作を期待している部分があり、そこで「衝突」が起きるのです。
:::

> Jest ships with experimental support for ECMAScript Modules (ESM).

https://jestjs.io/docs/ecmascript-modules?utm_source=chatgpt.com

そこで、Claude 経由で調べた解決策を備忘録＆情報共有として記事にしていきます。

::: note info
そもそも現代では、この設定含めてAIに任せれば済むのですが知識として持っておきたかった部分もあって手動検証した次第です。
:::

## 解決策
### 1. 必要なパッケージをインストール 
```bash
# Jest 本体
npm install --save-dev jest

# Jest のts関連設定
npm install --save-dev @types/jest ts-jest
```

### 2. `package.json`にテストコマンドを追加
- `package.json`の`scripts`セクションに以下を追加
```js
{
  "scripts": {
    "test": "jest"
  }
}
```

- vite プロジェクトの場合
```diff
"scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
-   "preview": "vite preview"
+   "preview": "vite preview",
+   "test": "jest"
},
```

### 3. `jest.config.ts`を用意
- プロジェクトルートに`jest.config.ts`を作成
```ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
};

export default config;
```

- 各設定の説明：
    - `preset: 'ts-jest'`：TypeScriptをトランスパイルするための設定
    - `testEnvironment: 'node'`：Node.js環境でテストを実行
    - `roots`：テストファイルを探すルートディレクトリ
    - `testMatch`：テストファイルのパターン

### 推奨：4. `tsconfig.json`に設定を追加
テスト実行時に以下の警告が表示された場合はこのセクションで紹介する設定を行う。

```bash
ts-jest[config] (WARN) message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop` to `true` in your TypeScript configuration file (usually `tsconfig.json`). See https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information.
```

::: note info
`esModuleInterop`は、CommonJS形式のモジュール（require）とESモジュール形式（import）の相互運用性を改善する働きを持つ。将来的にモジュールのインポートで問題が起きる可能性があるため設定推奨。
:::

```ts
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

- vite プロジェクトの場合
```diff
{
+ "compilerOptions": {
+   "esModuleInterop": true
+ },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

---

#### テスト関数の型定義エラーをエディタに指摘された場合
`tsconfig.app.json`内の`"types"`プロパティに`"jest"`を追記する
```diff
{
  "compilerOptions": {
    .
    ..
    ...
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
-   "types": ["vite/client"],
+   "types": ["vite/client", "jest"],
    ...
    ..
    .
}
```

### 5. `.gitignore`にカバレッジ出力を追加
- テスト実行後に生成される`coverage/`ディレクトリを追跡対象外とする
```bash
coverage/
```

## テストの実行
### `npm test`
- 全体テスト：
プロジェクトに存在する`.test`ファイルを全て検証するので時間がかかる

### `npm test ファイルパス名`
- 単体テスト：
    - ファイルパス指定は`/`でないと機能しない
    ※WindowsOSでのファイルパスコピー時は`\`（バックスラッシュ）となるので要注意
    - ファイル名にコロンは不要（NG：`npm test 'ファイル名'`）

```bash
npm test src/feat/special/index.test.ts
```

### VSCode拡張機能`Jest Runner`を利用
`Jest Runner`という拡張機能を用いると、テストファイルのコード上で`Run|Debug`を実行できます。

## さいごに
環境構築で躓くのは少なくないと思いますので、本記事が筆者と同じように詰まった方のお役に立てると幸いです。

読んでいただき、ありがとうございました。

