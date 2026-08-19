title: hover時に指定した filter に関する不具合を will-change で解決

tags: HTML CSS Web Safari フロントエンド

### はじめに
とあるwebサイトの制作時に、CSSの`filter`プロパティでグレースケールのスタイルをあてた要素に、`hover`時のスタイル（グレースケールを外す）をあてると意図した挙動になりませんでした（※iOS Safari のみ）。
そこで、`will-change`プロパティに`filter`を指定したところ問題が解決しました。

実装コードは下記となります。

```
& a {
    // will-changeでブラウザに変更予定を知らせる
    will-change: filter;
    filter: grayscale(1);
    text-decoration: none;
    color: #005bac;
    display: block;
    padding: 1em 1em 2.5em;
    font-size: 1.4rem;

    & img {
        display: block;
        margin-bottom: .5em;
    }

    &:hover {
        transition: .25s;
        filter: grayscale(0);
    }
}
```

```
<li>
    <a href="" target="_blank">
        <img src="画像のパス" alt="">
    </a>
</li>
```


### will-change について
【[MDN Web Docsの will-change 紹介ページ](https://developer.mozilla.org/ja/docs/Web/CSS/will-change)】ではこのように記されています。
> CSS の will-change プロパティは、どのような要素の変更が予測されているかブラウザーに助言します。ブラウザーは要素が実際に変更される前に、最適化をセットアップすることができます。この種の最適化は、実際に変化が求められる前に、潜在的に高コストの処理を行うことで、ページの応答を向上させることができます。

サイト・ページを読み込んでくれるブラウザに「ここの要素にこういった変化があるからよろしく！」って先に伝えておくと、それに対して準備してくれる感じですね。

::: note warn
先ほどのサイト内にも記述がありますが、`will-change`には**使用上の注意事項がいくつかある**ので気を付けてください。
例えば、`will-change`を多用するとブラウザに負担を与えて、ページの速度の低下などパフォーマンスが悪くなる可能性があります。

※サイトからスクリーンショットで一部を抜粋
![スクリーンショット 2023-05-30 17.31.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/7369dd0c-7d6b-6a19-5a75-4f9db769e3e5.png)
![スクリーンショット 2023-05-30 17.30.15.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/548c6a34-b385-9733-42ce-90be7d0ab4ce.png)
:::


### ブラウザレンダリングの仕組みも意識しておきたい
`filter`の挙動不全に対して`will-change`での対応は早い段階で行って効果を得ていたのですが、レンダリングの影響もあったのかもしれないと思い、改めてブラウザレンダリングについても調べてみました。

ブラウザでは下記フェーズ・工程を通ってレンダリングしています。
- Parse(パース)
- Style(スタイル) 
- Layout(レイアウト)
- Paint(ペイント) 
- Composite(コンポジット)

`Parse`では、HTMLとCSSが並行解析されて HTMLは「DOMツリー」、CSSは「スタイルルールズ」という構造になります。

次の`Style`では、各要素へのスタイルの割り当てが行われます。先ほど作られたDOMツリー（各ドキュメント要素）とスタイルルールズ（HTMLタグやclass, idなど各セレクタごとのスタイル）をリンクさせるフェーズです。

`Layout`では、各要素の位置と大きさの計算を行います。

`Paint`では、要素の重なり順を考慮し、順番に処理していくことで描画していきます。このフェーズでは Layer Tree（レイヤーツリー）が生成され、条件に応じてLayer（レイヤー）が分離されます。
Layer（レイヤー）を分離することで、もし何かスタイルの変更があった場合でもブラウザ側の手直しが最小となり、ブラウザの負担を軽減できます。

最後の`Composite`では、今までの工程処理を進めてきた`Main Thread`ではなく`Compositor Thread`、`Raster Thread`、`GPU`といった別領域で進んでいきます。
`Raster Thread`は4つあり、`Compositor Thread`は空いている`Raster Thread`にレイヤーのラスタライズ（画像化）を頼みます。そうしてラスタライズされたレイヤーを`Compositor Thread`で一つのレイヤーに合成。最終的に`GPU`に渡されて描画される流れです。

::: note info
アニメーションの処理で `top`, `left`, `margin`, `padding` などではなく、`transform`を使って指定したほうが良い、という話を聞いたことがありませんか？
実は`transform`や`opacity`プロパティはこの`Composite`フェーズで適用されます。
他方、`top`, `left`などを指定すると前工程（`Layout`）に差し戻して処理し直す必要が出てきますのでブラウザに負担がかかってしまうのです。
`Main Thread`は、Composite以外の工程に加えてJavaScriptの処理も担っていて多忙です。さらに、前工程に差し戻して処理を進める場合、Compositeも`Main Thread`が一時的に担うことになります。
`Main Thread`の負担を減らすようなブラウザに優しい記述を心がけたいですね。
:::

ブラウザレンダリングの仕組みに言及し過ぎると本筋からずれてしまうと思いましたので、ざっと走り書きのような説明になってしまってすみません。
詳しい内容はこちらの【[フロントエンジニアなら知っておきたいブラウザレンダリングの仕組みをわかりやすく解説！](https://blog.leap-in.com/lets-learn-how-to-browser-works/)】サイトの記事が大変勉強になりましたので参考情報として掲載しておきます。


### そもそもfilterプロパティはどのフェーズで適用されるの？
小見出しについて調べてみたのですが、`filter`プロパティがどのフェーズで適用されるのかは見つけられませんでした。ご存知の方はコメントなどで教えていただけますと幸いです。
ただ、調べる中でこちらの【[iOS SafariはCSSのfilterプロパティを使用すると重くなる](https://webty.jp/staffblog/production/post-3590/)】というサイトに興味深い記述がありました。
> iOS SafariはCSSのfilterプロパティの処理を何故かGPUを使用せずにCPUで行います。そのため、filterプロパティを使用するとCPU使用率が高くなり、表示の乱れやレンダリング速度の低下、ブラウザが固まるなどの不具合が発生することがあります。

今回の件ではGoogle Chromeでは特に問題なく、実機テストした際にiOS Safariでの不具合に気づきました。そして冒頭のコード及び本記事の主題にあるように`will-change`を使用することで解決できました。

今回当該スタイルを指定していた要素は複数個（10～16ほど）ありました。そのため、iOS Safariでは**CPUの負荷がかなり高かった**のではないかと思います。
`will-change`を使用したアニメーションプロパティーの指定があった場合、`Paint`フェーズでレイヤーが分離されます。そのため、`will-change`によって複数個ある要素の処理がレイヤーに分離されて進むことになった結果、少しでも処理が軽くなったのかなと考えています。

### まとめ
iOS Safariは`background-attachment: fixed`が効かなかったり、今回の`filter`プロパティのこと（filterプロパティの処理を何故かGPUを使用せずにCPUで行う）だったり、独自の仕様を持っている時がありますよね。
今回は`will-change`のお陰で何とかなりましたが、`background-attachment: fixed`の時は結局 JavaScriptを記述して~~無理やり力技で~~解決しました。

一つの不具合で思いがけないほど時間を費やしてしまうこともあるので、いろいろ引き出しを持っておくのは大切だなと感じます。
そして引き出しを増やすには基礎知識をはじめとしたインプットが重要だとも思いますので、冗長かと思いましたがブラウザレンダリングについても書かせていただきました。

筆者の備忘録的な部分もあるので読み進めにくい箇所もあったかもしれませんが、ここまでお読みいただきましてありがとうございました！


### 参考情報
[MDN Web Docsの will-change 紹介ページ](https://developer.mozilla.org/ja/docs/Web/CSS/will-change)
[フロントエンジニアなら知っておきたいブラウザレンダリングの仕組みをわかりやすく解説！](https://blog.leap-in.com/lets-learn-how-to-browser-works/)
[iOS SafariはCSSのfilterプロパティを使用すると重くなる](https://webty.jp/staffblog/production/post-3590/)
[パフォーマンスに優しいCSSアニメーションとは](https://tyankatsu.com/posts/animation-performance/)
