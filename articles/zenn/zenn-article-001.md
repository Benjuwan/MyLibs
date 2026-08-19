---
title: "今更ながら React で ToDo リスト作成してみる"
emoji: "🐣"
type: "tech"
topics:
  - "javascript"
  - "react"
  - "typescript"
  - "初心者向け"
  - "todo"
published: true
published_at: "2024-01-06 17:49"
---

## はじめに
はじめまして、Zenn での初投稿になります。
今まで `React`でサイトやらアプリやら公私含めて色々作ってきましたが、新年ですし初心に戻って ToDo リストを作ってみたのです。
ところが、実装してみると一部詰まったので備忘録がてら書いていこうと思います。

- 想定読者
	- 駆け出しエンジニアの方
	- `React`や`Next`などモダンなフロントエンドに関心のある Web デザイナー・コーダーの方々
	- リスキリングを考えている非エンジニアの方

## ひとまず完成品
@[codesandbox](https://codesandbox.io/embed/432cxv?view=preview&module=%2Fsrc%2FApp.tsx)

## 書いてみて
ToDo リストを作るのは`React`の学び始め以来で、当時お世話になったのは下記書籍でした。
有名な書籍ですよね。

https://www.amazon.co.jp/%E3%83%A2%E3%83%80%E3%83%B3JavaScript%E3%81%AE%E5%9F%BA%E6%9C%AC%E3%81%8B%E3%82%89%E5%A7%8B%E3%82%81%E3%82%8B-React%E5%AE%9F%E8%B7%B5%E3%81%AE%E6%95%99%E7%A7%91%E6%9B%B8-%EF%BC%88%E6%9C%80%E6%96%B0ReactHooks%E5%AF%BE%E5%BF%9C%EF%BC%89-%E3%81%98%E3%82%83%E3%81%91%E3%81%87%EF%BC%88%E5%B2%A1%E7%94%B0-%E6%8B%93%E5%B7%B3%EF%BC%89-ebook/dp/B09BV2HGN3

色々な方がレビューしていると思いますが、筆者的にはバイブルと呼べるほど分かりやすくて楽しく`React`入門できた良書でした。

書籍にて ToDo リストの制作があるのですが、筆者の手元にあるものではメモの「追加」と「削除」のみのシンプルなものでした。

今回、上記機能に「チェック」機能を追加しようとして詰まりました。

具体的には当初、チェックされた状態を`useState`で管理しようとしていました。
※`React`には`state`という仕組みがあり、直訳通り「要素の状態」を指します。ポケモンでいう毒やマヒ、やけどといったイメージとほぼ同じです。

```ts
.
..
const [checked, setChecked] = useState<boolean>(false);
//...
return (
//...
<li key={i} style={checked ? checkedStyle : defaultStyle}>
<input type="checkbox" onChange={() => setChecked(!checked)} />
..
.
```

しかしこれだとチェックすると、**リストの全項目が`checked`されて**全リストに`checkedStyle`のスタイルがあたってしまいました。

:::message
非エンジニアの方向けに注釈を入れておきます。

スタイルとは要素の**見た目**のことです。とりあえず美容メイクのイメージでokです。

```
style={checked ? checkedStyle : defaultStyle}
```

上記は**三項演算子**といって、`?`の左にあるもの（今回は`checked`）が`true`ならば`checkedStyle`が適用、`false`ならば`defaultStyle`が適用される。という仕組みです。
`true`や`false`は、ここでは一旦スイッチのオンオフ機能くらいだと思っていただければと。
:::

なるほど、ひとつの`state`で一元管理のような状態になっているから、一つをチェックすると全てが更新（オンになる）されるのか。
では、クリックしたリストに対して特定のスタイルをあててやろう！

```ts
.
..
const toggleCheckedClass = (inputElm:HTMLInputElement) => {
  const parentLiElm:HTMLLiElement | null = inputElm.closest('li');
  parentLiElm?.classList.toggle('checked');
}
//...
<input type="checkbox" onChange={(inputElm:ChangeEvent<HTMLInputElement>) => toggleCheckedClass(inputElm.currentTarget)} />
..
.
```

よし！これで意図通り、クリックしたリストにのみスタイルがあたった。
……と思ったのですが、何と当該リストを削除すると**その下のリストに`checked`が付いて**しまいました。

- 以下のような状況
	- ~~掃除~~ ← 掃除が済んだのでチェックして削除
	- 洗濯
	- 買い物
	...
	..
	.
	- ~~洗濯~~ ← 掃除リストは消えたものの下にあった洗濯リストにチェックが付いてしまう
	- 買い物

ここが詰まったところです。恐らく、リストは更新されるもののリアルDOMにスタイルを指定する形にしていたために起きたことだと思っています。

:::message
`React`には仮想DOMというものがあり、差分（変更前と変更後の違い）を検知して、その部分だけ（見た目に）更新・反映させる仕組みがあります。その部分を変更するだけなのでパフォーマンスも高くなります。
`React`では原則、非制御コンポーネント（リアルDOM）を触ることはNGで、`state`を用いて状態を管理・更新するルールになっています。
:::

上記のトラブルを解消するために、筆者はオブジェクト（のstate）にして管理することにしました。
```ts
type todoListType = {
    item: string;
    checked: boolean;
}
..
.
/* リスト（オブジェクトのstate）*/
const [todoList, setTodoList] = useState<todoListType[]>([]);
//...
     const newAry: todoListType = {
       item: inputTxt, // inputTxt は 入力欄に入力した内容
       checked: false // 初期値 false
     }
     setTodoList((_prevTodoList) => [...todoList, newAry]); // リストを更新
     //...
..
.
const updateTodoList: (item: todoListType, index: number, bool: boolean) => void = (item: todoListType, index: number, bool: boolean) => {
        const newAry: todoListType = {
            item: item.item,
            checked: bool
        }
        const shallowCopy: todoListType[] = [...todoList];
        shallowCopy.splice(index, 1, newAry); // 済んだタスクをリストから削除
        setTodoList((_prevTodoList) => shallowCopy); // リストを更新
    }

    // item.checked の値に応じたリストチェックのオンオフ切替
    const checkedSignal: (item: todoListType, index: number) => void = (item: todoListType, index: number) => {
	/* 既にチェックされていたらチェックを外す */
        if (item.checked === true) updateTodoList(item, index, false);
	/* まだチェックされていなければチェックする */
        else updateTodoList(item, index, true);
    }
```

冗長なコードになっている気もしますが、これにて意図した挙動になりました！
冒頭の完成品を今一度こちらに置いておきます。

@[codesandbox](https://codesandbox.io/embed/432cxv?view=preview&module=%2Fsrc%2FApp.tsx)

:::message
もちろん、Todo リストは他の制作方法もありますので、記載したものは参考程度に留めていただければと思います。
:::

## さいごに
ここまで読んでいただき、ありがとうございました。

色々な書籍や技術系記事といった各種情報には「インプット後のアウトプットが大切」という話が多いと思います。
ToDo リストはそういった場合に候補に挙がるものなので、この記事の内容がどなたかの参考になれば幸いです。

今後も定期的に記事を投稿していこうと思います。
