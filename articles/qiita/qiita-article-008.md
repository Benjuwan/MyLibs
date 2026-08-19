title: 【Instagram API】Instagram の投稿内容をサイトにも掲載したい

tags: Instagram HTML CSS JavaScript 初心者

## はじめに
SNSを利用したブランディング・マーケティング活動が普通になってきている昨今、タイムラインをサイトに掲載しているところも少なくありません。
筆者が所属する制作会社にもSNSの投稿をサイトに反映したいという要望をいただくことがあり、Facebook や Twiiter だと比較的楽に実装できたのですが、Instagram の場合は **Instagram API を使用**する必要があって少し特殊でした（当該 Instagram アカウントのコンテンツ情報が記述された json データを利用することで実装します）。

そこで今回、筆者が実装した際の手順や注意事項、Instagram API で取得した各コンテンツへあてているCSS を紹介していきたいと思います。

::: note warn
WordPress を使用したサイトだと、Instagram の投稿内容をプラグインで比較的簡単に実装できる場合もあります。
:::

## Instagram API の使用
Instagram API を利用するには当然ですが、コンテンツを取得したい Instagram のアカウントが必要です。このアカウントを「プロアカウント」にする必要もあります。
※プロアカウントにするとアカウント非公開ができなくなるので注意してください。

他にも、Meta（旧Facebook）の開発者アカウントを用意したり、Facebookページで Instagram と連携したり、Facebookの開発者ページで API 使用に必要な作業を行ったりする必要があります。

これらに関する作業については、こちらのサイト様の記事が大変分かりやすかったのでチェックしてみてください。

https://arts-factory.net/insta_api/

上記サイト様の記事に書かれている手順フローです。
> - インスタグラムのアカウントをプロアカウントに変更する。
> - Facebookページを用意してインスタグラムのアカウントと連帯（リンク）させる。
> - Facebookアプリを作成する
> - Facebookの開発者ページでAPIデータを取得するのに必要なアクセストークンやIDを取得する
> - 取得したAPIデータをつかってインスタグラムのタイムライン(一覧)をサイトに埋め込む

::: note warn 
外部サービスなので致し方ないことですが、meta が定期的にアップデートしていて**インターフェイスが変わっている場合もあります**。筆者の場合これまで2～3回くらい変更されていて少々ストレスを感じることもありましたが、作業手順や手間としてはあまり変わらなかった印象です。
:::

個人的には作業工程の、「Facebookページでの Instagram と連携」や「Facebookアプリの作成」で（インターフェイスが変わっていたりして）手間取った印象があります。とはいえ、上記にもあるように作業手順としてはあまり変わっていないので進められると思います！

## Instagram API の使用に必要なアクセストークンの取得は一挙に進める
先ほどの参考記事にも記載されていますが、作業工程の後半でInstagram API の使用に必要なアクセストークンの取得を行う必要があります。
このアクセストークンには有効期限が定められており、必要手順を踏むことで無期限のアクセストークンを取得できるようになります。この無制限のアクセストークンを取得するまでには、アクセストークンに有効期限（**1時間**と2週間）があるので時間がある時に一挙に進めたほうが良いと思います。

## サイトにコンテンツを反映させる
先ほどの参考記事では`PHP`によるコンテンツ反映方法が記載されています（※ PHPを希望される方はそのまま進められると良いかと思います）。
筆者は JavaScript で反映したかったので下記サイト様の記事を参考にさせていただきました（`jQuery`使用）。

https://ginneko-atelier.com/blogs/entry448/

::: note info
両サイト様の記事どちらも、データ取得に関する値まで表示してくださっているので、コンテンツ表示で希望する項目はどちらの記事で確認しても問題ないと思います。
- データ取得に関する値の例
`like_count`：いいねの数、`caption`：投稿内容、`thumbnail_url`：サムネイル
:::

わがままで恐縮ですが、筆者はバニラJSで実装したかったので調整しました。

```swift:JavaScript
document.addEventListener("DOMContentLoaded",()=>{
    async function instaAPI(){
        // 子要素<ul>を追加
        document.querySelector('#insta').insertAdjacentHTML('beforeend','<ul></ul>');  
        
        let cards =  12; // insta投稿の表示件数を指定
        const response = await fetch(`https://graph.facebook.com/v9.0/【ビジネスアカウントID】?fields=name,media.limit(${cards}){ caption,media_url,thumbnail_url,permalink,like_count,comments_count,media_type}&access_token=【アクセストークン】`);
        
        if(response.status === 200){
            const resObjects = await response.json();
            // console.log(resObjects.media);
            //（挙動への影響は一切無いものの）オブジェクト{resObjects.media}内のプロパティ{paging}のせいで「instaItems[1]が無いというエラー」が出るので削除して以降の処理を進めていく 
            delete(resObjects.media.paging);

            Object.entries(resObjects.media).forEach(instaItems => {
                // console.log(instaItems);
                instaItems[1].forEach(eachItem => {
                    if(eachItem.media_url !== null){
                        // 投稿が動画か否かを判定して{media}を変更
                        if(eachItem.media_type === 'VIDEO'){
                            eachItem.media = eachItem.thumbnail_url;
                        } else {
                            eachItem.media = eachItem.media_url;
                        }
                
                        // キャプションの加工
                        const captions = eachItem.caption.slice(0, 80);
                        const captionTxt = `${captions}……`;
                
                        // 追加した子要素<ul>に各アイテム<li>を生成
                        document.querySelector('#insta ul').insertAdjacentHTML('beforeend', `<li><a href="${eachItem.permalink}" target="_blank" rel="noopener"><img src="${eachItem.media}"><span class="captionTxt">${captionTxt}</span><span class="like_count">${eachItem.like_count}</span></a></li>`);
                    }
                });
            });
        } else {
            document.querySelector('#insta ul').insertAdjacentHTML('beforeend',`<p style="text-align:center;width:100%;">読み込めませんでした</p>`);
        }
    }
    instaAPI(); // 関数の実行
});
```

```swift:html：取得したコンテンツを表示するための要素
<div id="instaWrapper">
    <div id="insta">
        <ul></ul>
    </div>
</div>
```

```swift:css(scss)
#insta{
    padding: 0 2.5%;
    width: clamp(240px, 100%, 1280px);
    margin: 0 auto;

    & a{
        text-decoration: none;
    }

    & ul{
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;

        & li{
            list-style: none;
            box-sizing: border-box;
            width: 48%;
            margin-bottom: 3em;
            height: 240px;
            position: relative;

            & .captionTxt{
                display: block;
                width: 100%;
                height: 100%;
                padding: 16px;
                font-size: 14px;
                line-height: 1.8;
                text-align: left;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0,0,0,.75);
                color: #fff;
                opacity: 0;
                
            }

            & .like_count{
                font-size: 12px;
                line-height: 2;
                display: block;
                text-align: center;
                position: relative;

                &::before{
                    content: "\02665";
                    color: #d4245f;
                    font-size: 14px;
                    vertical-align: middle;
                    padding-right: 0.25em;
                }
            }

            &:hover{
                & .captionTxt{
                    transition: .5s opacity, .25s filter;
                    opacity: 1;
                }
            }

            & img{
                object-fit: cover;
                width: 100%;
                height: 100%;
            }
        }
    }
}

@media screen and (min-width:600px) {
    #insta{
        padding: 0 24px;
        & ul{
            & li{
                width: 32%;
            }
        }
    }
}

@media screen and (min-width:1025px) {
    #insta{
        & ul{
            & li{
                width: 23.5%;
            }
        }
    }
}
```

<details>
<summary>CSS</summary>

```swift:css
@charset "UTF-8";
#insta {
  padding: 0 2.5%;
  width: clamp(240px, 100%, 1280px);
  margin: 0 auto;
}
#insta a {
  text-decoration: none;
}
#insta ul {
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
#insta ul li {
  list-style: none;
  box-sizing: border-box;
  width: 48%;
  margin-bottom: 3em;
  height: 240px;
  position: relative;
}
#insta ul li .captionTxt {
  display: block;
  width: 100%;
  height: 100%;
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  text-align: left;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  opacity: 0;
}
#insta ul li .like_count {
  font-size: 12px;
  line-height: 2;
  display: block;
  text-align: center;
  position: relative;
}
#insta ul li .like_count::before {
  content: "♥";
  color: #d4245f;
  font-size: 14px;
  vertical-align: middle;
  padding-right: 0.25em;
}
#insta ul li:hover .captionTxt {
  transition: 0.5s opacity, 0.25s filter;
  opacity: 1;
}
#insta ul li img {
  -o-object-fit: cover;
     object-fit: cover;
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 600px) {
  #insta {
    padding: 0 24px;
  }
  #insta ul li {
    width: 32%;
  }
}
@media screen and (min-width: 1025px) {
  #insta ul li {
    width: 23.5%;
  }
}
```
</details>

※ CSS（スタイル）は
- 各種コンテンツをサムネイル表示
- サムネイル画像をマウスオーバーすると各コンテンツ別の投稿内容（テキスト）が画像前面に表示（テキストの背景色は黒の透過処理）
されるスタイル内容になっております。
<img width="75%" alt="操作gif" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/da7729d8-5f5a-f598-3043-0af81ac7a469.gif">

## さいごに
`JavaScript`と`HTML`, `CSS`はコピペで使えるようになっていますのでご自由にお使いください。
自分好みに調整しても良いかと思います！
お世話になったサイト様の記事URLを下記に置いておきますので、必要に応じてご確認ください。

## 参考URL
https://www.comnico.jp/we-love-social/instagram-how-to-open-accounts#anc_5tna5n

https://arts-factory.net/insta_api/

https://ginneko-atelier.com/blogs/entry448/
