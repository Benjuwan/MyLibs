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
#### jsdom
バックエンド（サーバーサイド）での JavaScript 実行環境である`Node.js`上で、HTMLやDOM操作を実現するライブラリ。<br>これにより、ブラウザがなくてもWebブラウザの一部機能をエミュレートできるため、ウェブアプリケーションのテストやスクレイピングなどに利用できる。

- 使用するには別途インストールして設定する必要がある
```ts
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
```

---

- 補足：<br>
Jest設定の`setupFilesAfterEnv`でこのファイルを指定しておくと、すべてのテストで自動的に`jest-dom`マッチャーが使用可能となる。

- `setupTests.ts`
```ts
import '@testing-library/jest-dom';
```

- `jest.config.js`
```ts
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
```

この設定はNext.js公式テンプレートにも共通。

#### Testing Library
UIコンポーネントのテスト用ライブラリ。<br>基本原則として**テストがソフトウェアの使用方法に似ている**ことを推奨していて、具体的にはクリックやマウスホバー、キーボード入力など**Web操作と同じようなテストを書く**ことを推奨している。

---

主な役割は次の3つとなる。

- UIコンポーネントをレンダリング（描画）する
- 描画した要素から、任意の子要素を取得する
- 描画した要素に、インタラクションを与える

##### Reactで実装している場合
React向けの[`@testing-library/react`](https://www.npmjs.com/package/@testing-library/react)を利用する。

> [!NOTE]
> Testing Library は他にも様々なUIコンポーネントライブラリに向けて提供されているが、中核となるAPIは同じもの（[`@testing-library/dom`](https://www.npmjs.com/package/@testing-library/dom)）を使用する<br>
> そのため、**UIコンポーネントライブラリが違っても、同じようなテストコードになる**<br>
> **※`@testing-library/dom`は`@testing-library/react`の依存パッケージなので明示的にインストールする必要はない**

##### カスタムマッチャーを利用してテストの検証精度を高める
UIコンポーネントのテストでもJestのアサーションやマッチャーを利用できるものの、DOMの状態を検証するにはJest標準だけでは不十分な場合がある。そのため[`@testing-library/jest-dom`](https://www.npmjs.com/package/@testing-library/jest-dom)をインストールして、Jestの拡張機能であるカスタムマッチャーを扱えるようにする。これにより、UIコンポーネントテストに便利なマッチャーが多数追加される。

##### インタラクションを検知する
Testing Library には、入力要素に文字入力などを行うために`fireEvent`というAPIが用意されている。しかし、このAPIはDOMイベントを発火させるだけのものなので**実際のユーザー操作では不可能な操作もできてしまう**ことがある。<br>
そこで、**実際のユーザー操作に近いシミュレーションを行える[`@testing-library/user-event`](https://www.npmjs.com/package/@testing-library/user-event)を追加する**ことでインタラクションテストの精度を高める。<br>
こうした理由から`fireEvent`ではなく、よりユーザー行動に即した形でイベントをトリガーできる`@testing-library/user-event`の使用が推奨されている。
