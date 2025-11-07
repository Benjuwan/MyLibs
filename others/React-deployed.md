## React ビルド後におけるFTPクライアント経由のデプロイ方法

## はじめに
Reactの情報や記事は多くあるものの、開発後のビルドからデプロイについてまとめたものは少ないような気がしたので記事にしていきます。<br>

まずはじめに、現在主流なのは`GitHub Actions`などを利用した CI/CD を通じたデプロイです。<br>
筆者は個人開発などで Vercel, Netlify といった海外ホスティングサービスを使っているのですが、それらには自動的に CI/CD が付いているのもあります。<br>

CI/CD を通じたデプロイ方法は多くの情報・記事があるので本記事では割愛し、それ以外を書いていきたいと思います。<br>
標準から外れた方法ではあるものの、FTP（SFTP/FTPS）クライアントを使ってホスティングするところもまだまだ少なくないと聞きます。<br>
今回はそういった方々を対象に React開発後のFTPクライアント経由のデプロイ方法を紹介していきます。<br>

### 対象読者
- FTP（SFTP/FTPS）接続を前提としているホスティング先を利用している方・組織
- FTP（SFTP/FTPS）クライアントを使ったファイル転送作業に慣れている方・組織
- 種々の事情から CI/CD を導入できない方・組織

> [!NOTE]
> 本記事では、vite を用いたReact開発を前提として話を進めます。<br>
> 状態としては、ある程度アプリケーションが完成しておりデプロイ直前の想定です。<br>
> viteやReact自体には言及していきません。

### Reactアプリケーションのビルド
まずは`npm run build`です。<br>
別段設定を触っていなければ、このコマンドによって`dist`フォルダが生成され、その中にビルド成果物（`index.html`など各種ファイルやフォルダ）が用意されます。

## Webページとして扱う
これが最もシンプルで簡潔な方法です。<br>
ホスティング先に任意のディレクトリ（フォルダ）を用意して、そこに`dist`フォルダ内のビルド成果物を入れます。<br>
これで、当該ディレクトリ（フォルダ）のページが用意できました。

---

## 既存ページにコンポーネント（一つのコンテンツ）として部分的に埋め込みたい
Webページではなく、 **既存ページにコンポーネント（一つのコンテンツ）として部分的に埋め込みたいケース**もあるかと思います。<br>
この場合、埋め込みたいページを編集するほか、ビルド時の設定を変更する必要があります。

ひとまずはじめに、`dist`フォルダ内のビルド成果物を適当な場所にホスティングします。<br>
今回は事例として、ルート直下に用意した`hoge`ディレクトリとします。

- デプロイ先：`https://example.co.jp/hoge`

### 部分的に埋め込みたいページを編集
`head`要素内にReactアプリケーション用のスタイルシートやJSファイルを読み込ませたり、Reactアプリケーションを描画するためのdiv要素（`div#id`）を用意します。<br>
※以下の事例コードではJSファイルは`head`要素内ではなくページ下部に設置しています。

```html
<!-- CSSを読み込む -->
<link rel="stylesheet" href="/hoge/assets/index-abc123.css">

<!-- Reactアプリが表示される場所 -->
<div id="root"></div>

<!-- JSを読み込む -->
<script type="module" src="/hoge/assets/index-def456.js"></script>
```

`index-abc123`や`index-def456.js`というように`-`以降にハッシュ値が付いています。<br>
これは**ビルドするたびに変わってしまうので、その都度ページも編集する**必要が出てきてしまいます。

そこで、ビルド時の設定を変更してファイル名を固定化することで、この問題に対処していきます。<br>

### `vite.config.ts`で、ビルド時の設定を変更してファイル名を固定化
```ts
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/hoge', // ビルド成果物のホスティング先パスを指定
  /* 以下を追記することでビルド成果物のファイル名を固定できる */
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/bundle.js',
        // `[name]`は、viteの本番ビルド用バンドラー`Rollup`が自動的に決定したチャンク名やアセット名を使用するプレースホルダー
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // CSSファイルは固定名
          if (assetInfo.names.includes('.css')) {
            return 'assets/index.css';
          }
          // その他のアセット（画像等）は元の名前を保持
          return 'assets/[name].[ext]';
        }
      }
    }
  }
})
```

ポイントは以下になります。

- `base`：ビルド成果物のホスティング先パスを指定<br>
今回デプロイ先は`https://example.co.jp/hoge`なので`hoge`を設定します。
```ts
base: '/hoge',
```

- ビルド成果物のファイル名を固定<br>
これが大事な設定です。CSSファイル名は`bundle.css`で固定していますが、それ以外は元のファイル名と拡張子を反映するようになっています。
```ts
build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/bundle.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // CSSファイルは固定名
          if (assetInfo.names.includes('.css')) {
            return 'assets/index.css';
          }
          // その他のアセット（画像等）は元の名前を保持
          return 'assets/[name].[ext]';
        }
      }
    }
  }
```

- `[name]`<br>viteの本番ビルド用バンドラー`Rollup`が自動的に決定したチャンク名やアセット名を使用するプレースホルダー
- `[ext]`<br>元のファイル拡張子

---

この設定によって先のページ埋め込みコードは以下のように変化します。
```diff
<!-- CSSを読み込む -->
- <link rel="stylesheet" href="/hoge/assets/index-abc123.css">
+ <link rel="stylesheet" href="/hoge/assets/index.css">

<!-- Reactアプリが表示される場所 -->
<div id="root"></div>

<!-- JSを読み込む -->
- <script type="module" src="/hoge/assets/index-def456.js"></script>
+ <script type="module" src="/hoge/assets/bundle.js"></script>
```

### デプロイ後にスタイルが崩れている場合
アプリケーション側のスタイル優先度が低いために起こっている可能性があるので以下を試してみてください。<br>

- CSS（スタイルシート）の読み込み位置を最後方に持ってくる（CSSは後述優先なので最後の方に記述してスタイル優先度を上げる）
  - スタイル指定において詳細度を高める工夫を行う（例：親要素に`id`属性をあてて、それをベースにスタイル指定する）

#### Tailwind CSS を使っている場合
1. プロジェクトルートに`tailwind.config.js`を用意する
- `tailwind.config.js`
```js
export default {
    // すべての Tailwind クラスに #root の詳細度を付与（これでもダメだった場合は以下の !important 付与を実行）
    important: '#root',
    //  すべての Tailwind クラスに !important を付与
    // important: true,
    corePlugins: {
        // Tailwind のリセット CSS を有効化
        preflight: true,
    },
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
}
```

2. `src/index.css`にTailwind CSSの設定（`tailwind.config.js`）を読み込ませる
```diff
@import "tailwindcss";

+ @config "../tailwind.config.js";

@layer utilities {
    ...
    ..
    .
}
```

> [!NOTE]
> `@config`に、`Unknown at rule @configcss(unknownAtRules)`と警告が表示される場合があるが、これは**VSCodeのCSS言語サーバーがTailwind CSS 4の`@config`を認識していないだけ**で挙動に問題はありません。

3. ビルドし、生成されたCSS（`https://example.co.jp/hoge/assets/index（または index-xxx）.css`）を確認して`!important`が付与されているかをチェックしてください
- ※余計なスタイルが当たっている場合は他のCSSが効いているケースなので地道に打ち消すほかありません

### 裏ワザ
上記設定が煩わしい、スタイル調整で手こずる、CORSが出て読み込めないといった方には**非推奨ですが`iframe`で既存ページに埋め込む方法**もあります。<br>
手順としてはシンプルで、ビルド成果物を適当な場所にホスティングし、そのファイルパスを`src`属性に指定した`iframe`を既存ページに貼り付ける（埋め込む）だけです。<br>

まずは、`vite.config.ts`でホスティング先のサブディレクトリを指定します。
```ts
base: '/hoge',
```

次に、HTML（既存ページ）を編集します。ここでは先のコードの差分表示とします。
```diff
- <!-- CSSを読み込む -->
- <link rel="stylesheet" href="/hoge/assets/index-abc123.css">

- <!-- Reactアプリが表示される場所 -->
- <div id="root"></div>

- <!-- JSを読み込む -->
- <script type="module" src="/hoge/assets/index-def456.js"></script>

// `src`属性にデプロイ先のファイルパスを指定する
+ <iframe width="100%" height="1200" src="https://example.co.jp/hoge" frameborder="0" allowfullscreen=""></iframe>
```

`iframe`で別のWebページとして認識されるので、Reactアプリケーション用のHTML用やCSS, JSも不要です。<br>
この方法が非推奨なのは**`iframe`で別のWebページとして認識される**という点で、SEOやパフォーマンス面で懸念があります。<br>
あくまで裏ワザと思っていてください。

---

## おまけ：WordPress × React（WordPressのカスタムブロック）
FTPクライアント経由のデプロイ方法ではないのですが、WordPressのカスタムブロックとしてReactが利用されるケースも多いので、WordPressのカスタムブロックとして利用する方法も書いておこうと思います。<br>
通常のReactプロジェクトでのビルド＆デプロイ方法とは大きく異なります。<br>
※正確にはデプロイが不要で、WordPress側が自動的に処理してくれる

### プロジェクト開始
一般的には主に`npm create vite@latest`でプロジェクト開始しますが、`npx @wordpress/create-block my-custom-block`というコマンドでWordPressのカスタムブロック用のReactプロジェクトを立ち上げます。<br>

```bash
# WordPressのプラグインディレクトリに移動
cd /path/to/wordpress/wp-content/plugins/

# WordPressのカスタムブロック用のReactプロジェクトを構築
npx @wordpress/create-block my-custom-block
```

これにより**WordPressのカスタムブロックとして利用するためのビルド環境をセットアップ**されます。

#### セットアップ内容
- カスタムブロック情報などが記載されたメタファイル`block.json`が自動的に作成
- WordPress用のReactプロジェクト構造が自動的に作成

#### プラグイン内に設置したカスタムブロック（Reactプロジェクト）で開発を進める
```bash
# カスタムブロックに移動して開発開始
cd /path/to/wordpress/wp-content/plugins/my-custom-block
npm start
```

> [!NOTE]
> #### `npm run dev`ではなく`npm start`で開発を進める
> `npm run dev`が一般的ですが、カスタムブロックの開発では`npm start`を使うことが多いです。<br>
> 理由は、ファイルを保存すると自動的にビルドされ、WordPressのエディター画面をリフレッシュすると変更が反映されるためです。
```bash
npm start
```

### 開発時の注意点
一般的なReact開発と同じで、フックや各種ライブラリ、カスタムフックなどを活用して開発できます。<br>

ただし、`index.js` での設定（記述）が必要だったり、エディター用コンポーネントの`edit.js`, フロントエンド用の`save.js`といった特殊なファイルを別途用意する必要が出てきます。<br>
また`attributes`での各種データの扱いやWordPress提供のコンポーネントライブラリ、WordPress APIとの連携など独自の設定も必要になってきます。

#### WordPress特有の部分
##### `index.js`：ブロックの登録
```js
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';

registerBlockType('my-plugin/my-block', {
  edit: Edit,  // エディター画面での表示
  save,        // フロントエンド（公開ページ）での表示
});
```

##### `edit.js`：エディター用コンポーネント
```js
import { useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  const [localState, setLocalState] = useState('');
  
  return (
    <div {...blockProps}>
      {/* WordPress提供のUIコンポーネント */}
      <TextControl
        label="タイトル"
        value={attributes.title}
        onChange={(value) => setAttributes({ title: value })}
      />
      
      {/* 通常のReact state も使える */}
      <Button onClick={() => setLocalState('clicked')}>
        {localState}
      </Button>
    </div>
  );
}
```

##### `save.js`：フロントエンド用
```js
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const blockProps = useBlockProps.save();
  
  return (
    <div {...blockProps}>
      <h2>{attributes.title}</h2>
    </div>
  );
}
```

##### データの扱い
- `attributes`：ブロックのデータ（DBに保存される）
```js
setAttributes({ title: 'タイトル' })
```

##### WordPress提供のコンポーネントライブラリ
```js
import {
  TextControl,      // テキスト入力
  ToggleControl,    // トグルスイッチ
  SelectControl,    // セレクトボックス
  ColorPalette,     // カラーピッカー
  MediaUpload,      // メディアアップローダー
} from '@wordpress/components';

import {
  RichText,          // リッチテキストエディター
  InspectorControls, // サイドバー設定パネル
  BlockControls,     // ツールバー
} from '@wordpress/block-editor';
```

##### WordPress APIとの連携
```js
import { useSelect } from '@wordpress/data';

// WordPress内部のデータにアクセス
const posts = useSelect((select) => {
  return select('core').getEntityRecords('postType', 'post');
});
```

### ビルド（デプロイは不要）
開発が済んでカスタムブロック化するには以下フローとなります。

1. `npm run build`
2. WordPress管理画面でプラグインを有効化

これでブロックエディタから当該カスタムブロックが利用できるようになります。

### 既存のReactアプリケーションをカスタムブロックにしたい場合
1. [既存ページに埋め込む方法](#既存ページにコンポーネント一つのコンテンツとして部分的に埋め込みたい)がシンプルでベター<br>
※カスタムブロックに既存のReactアプリケーションの中身を移行する方法もあるが、純粋なReactアプリケーションとカスタムブロックでは構造が少し異なるので適用させるのが手間なケースもある。

- 構造面の違い例
  - 既存プロジェクトの`vite.config.ts`や`webpack.config.js`は使用できない
  - `package.json`の依存関係も大幅に異なる

2. 当該`plugins`フォルダ内に設置したカスタムブロックに、既存のReactアプリケーションの各種ロジック部分を移行して調整
  - 各種ロジック部分：カスタムフック, ユーティリティ関数, 型定義, ビジネスロジック
```
// 具体例

既存プロジェクト/src/
├── hooks/
│   └── useCounter.js  ← これをコピー
├── utils/
│   └── formatDate.js  ← これをコピー
└── App.jsx  ← UIは再実装

↓

my-custom-block/src/
├── hooks/
│   └── useCounter.js  ← コピーしたもの
├── utils/
│   └── formatDate.js  ← コピーしたもの
├── edit.js  ← WordPressブロック用に新規作成
└── save.js  ← WordPressブロック用に新規作成
```

## さいごに
本記事では、CI/CDが導入できない環境での現実的な選択肢としての各種方法を紹介してきました。<br>
新規開発や長期運用を前提とする場合は、やはり主流の`GitHub Actions`やVercelなどの自動デプロイ環境の利用を推奨します。<br>

とはいえ、一挙に、いきなりすべて、というのは難しいところもあるかと思いますので環境に応じてステップバイステップで進めていければと思います。<br>

ここまで読んでいただき、ありがとうございました。