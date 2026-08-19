---
title: 【個人開発】幼児向け 乗り物お絵かきアプリ
tags: React TypeScript vite konva 個人開発
author: benjuwan
slide: false
---
## はじめに
以下の記事を拝見して、これまで描画系の実装経験が無いことに気づいたのをきっかけに、今回の「乗り物お絵かきアプリ」を作りました。

https://qiita.com/yukinonyukinon/items/4cc4b0a36dfa20723c0d

[`react-konva`](https://konvajs.org/docs/react/index.html)というライブラリを使った記事で、ライブラリの説明がとても分かりやすく大変参考になりました。

今回筆者の個人開発も`react-konva`を用いてお絵かき機能を実装しています。

- 技術構成
```bash
@eslint/js@9.28.0
@tailwindcss/vite@4.1.8
@types/react-dom@19.1.5
@types/react@19.1.6
@vitejs/plugin-react@4.5.0
eslint-plugin-react-hooks@5.2.0
eslint-plugin-react-refresh@0.4.20
eslint@9.28.0
globals@16.2.0
konva@9.3.20
react-dom@19.1.0
react-konva@19.0.4
react@19.1.0
tailwindcss@4.1.8
typescript-eslint@8.33.0
typescript@5.8.3
use-image@1.1.4
vite@6.3.5
```

## 作成したもの

https://k2webservice.xsrv.jp/r0105/gogo/

これは「タップ（クリック）すると色々な乗り物アイコンが表示されて、タップ（クリック）し続けている間は自由に線を引いてお絵かきできる」というシンプルなものです。

![449311609-338dc9fd-5db0-4114-80e7-8e5eaebc87c9.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/fb869e87-5522-474d-80fc-c6e247f74efd.gif)

シール帳にシールを張るように、タップするだけで色々な乗り物を表示できます。

![449311690-6d6592be-d951-4c62-a526-94e505777606.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/8caa0d1a-2e0d-4f69-9d37-1d40e505250b.gif)

ちなみに、地味な機能ですがお絵かき中（ドライブ中）は乗り物のエンジン音が再生されます。

次項では、上記の音声再生などを含めて今回の実装で少し詰まった部分などを書いていきたいと思います。

## 自動再生ポリシー
自動再生ポリシーの影響でユーザーアクションが一度もないものは再生できないようになっています。
実装時、ログに当該エラーが出力されて気づくとともに、別の個人開発で同じような状況に遭遇したことがあったのでそれにならって今回対処しました。

オーディオ要素は非制御コンポーネントとして`useRef`で扱い、DOM操作を行っています。
サイトの初期表示時に音声再生の注意喚起ボタンを用意していて、それを押下することで以下の処理が行われる仕組みです。

```tsx
// 初回のユーザー操作で音声を再生するための関数
// ブラウザの自動再生ポリシーにより、ユーザーの操作がないと音声が再生されないため
const firstInteractionForAudio: () => void = () => {
    setAudioPlayOn(true);

    // サンプル再生なのでBGMは即時終了
    audioRef_mov.current?.play();
    audioRef_mov.current?.pause();
}
```

これにより、自動再生ポリシーの問題はクリアしました。

https://webfrontend.ninja/js-audio-autoplay-policy-and-delay/#google_vignette

## `react-konva`のコンポーネント内にはDOM要素は配置できない
上記の自動再生ポリシーの問題は解消しましたが、修正時に`audio`タグを含んだ乗り物コンポーネントを`Stage`内に入れて実装を進めていたところエラーで画面が真っ白（レンダリング不可）になりました。

理由としては「`react-konva`の`Stage`は内実`canvas`要素であり、その中にDOM要素は置けない」というものでした。

`react-konva`ライブラリでは、`Stage`というコンポーネントをベースに、Adobe Ai や Ps のレイヤーのような`Layer`コンポーネント、線の描画などを担う`Line`など固有コンポーネントがいくつかあります。

今回筆者は以下のような実装をしようとしており、レンダリングエラーが出ていたのです。
（※説明用の極端な実装例です）

```tsx
<Stage>
  <Layer>
    <audio src="sound.mp3" /> {/* DOM要素なので不可 */}
    <figure><img src={sampleImg} alt="sample画像" /></figure> {/* DOM要素なので不可 */}
  </Layer>
</Stage>
```

先の説明通り`react-konva`の対象エリア内ではDOM要素は扱えないので、`audio`や一部画像データは別々の要素（コンポーネント）として切り分けました。

ちなみに、描画時に表示される各種乗り物アイコンに関しては`react-konva`の`Image`コンポーネントを使っています。
`Image`のデータローディングに伴う非同期処理には`use-image`を使っていて、これを使うことでシンプルに画像描画を実装できました。（※別に使わなくとも`useEfeect`や`useState`でも実装できます）

## さいごに
今まで使ったことがないようなものは個人開発で実装してみると良い経験になりますね。
簡単な個人開発でしたが、自動再生ポリシーや`react-konva`（`canvas`要素）の制約などを学べて勉強になりました。

あとAI協業での学びで言えば、今回`GitHub Copilot`を主に使用しましたが、実装はAIが担っていくのを前提としてその**実装方針・アプローチを決めるための設計に関する知見（設計力）** が重要だと実感しました。
具体的には、各種乗り物アイコンの`Line`をState管理しているのですが、各種オブジェクト型の内容はこちらで指定（方針決め）して、描画部分など関連ロジックを含めた具体的な実装は`GitHub Copilot`に行ってもらいました。

--- 

今回の個人開発GitHubを以下に置いておきますので、関心のある方はご自由に使ってください。

https://github.com/Benjuwan/gogo-vehicle

