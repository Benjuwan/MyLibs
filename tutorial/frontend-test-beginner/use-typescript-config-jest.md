## JestでTypeScriptを使うための設定手順

### 前提
以下の公式ドキュメントを参照しましたが情報が不足しているようで上手くいきませんでした。

- [Getting Started](https://jestjs.io/docs/getting-started)
    - [Using TypeScript](https://jestjs.io/docs/getting-started#using-typescript)
- [Jest config file | Installation](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation#jest-config-file)
- [ESM Support](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support)

### 解決策
前述のとおり、公式ドキュメント情報で対応できなかったのでClaude経由で調べた解決策になります。

#### 1. 必要なパッケージをインストール 
```bash
# Jest 本体
npm install --save-dev jest

# Jest のts関連設定
npm install --save-dev @types/jest ts-jest
```

#### 2. `package.json`にテストコマンドを追加
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

#### 3. `jest.config.ts`を用意
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

#### 推奨：4. `tsconfig.json`に設定を追加
テスト実行時に以下の警告が表示された場合はこのセクションで紹介する設定を行う。

```bash
ts-jest[config] (WARN) message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop` to `true` in your TypeScript configuration file (usually `tsconfig.json`). See https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information.
```

> [!NOTE]
> `esModuleInterop`は、CommonJS形式のモジュール（require）とESモジュール形式（import）の相互運用性を改善する働きを持つ。将来的にモジュールのインポートで問題が起きる可能性があるため設定推奨。

---

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

#### 5. `.gitignore`にカバレッジ出力を追加
- テスト実行後に生成される`coverage/`ディレクトリを追跡対象外とする
```bash
coverage/
```

### テストの実行
#### `npm test`
- 全体テスト：<br>
プロジェクトに存在する`.test`ファイルを全て検証するので時間がかかる

#### `npm test ファイルパス名`
- 単体テスト：
    - ファイルパス指定は`/`でないと機能しない<br>
    ※WindowsOSでのファイルパスコピー時は`\`（バックスラッシュ）となるので要注意
    - ファイル名にコロンは不要<br>
    ※書籍では`npm test 'ファイル名'`で紹介されているので注意

```bash
npm test src/03/02/index.test.ts
```

#### VSCode拡張機能`Jest Runner`を利用
テストファイルのコード上で`Run|Debug`を実行できる
