---
title: "うにょっと動くグローバルナビゲーション"
emoji: "🐛"
type: "tech"
topics:
  - "css"
  - "html"
  - "javascript"
  - "tip"
published: true
published_at: "2024-01-08 16:20"
---

## うにょっと？動くとは
@[codepen](https://codepen.io/benjuwan/pen/QWYgKEd)

使用していただくとお分かりいただけると思いますが、選択したメニューに背景のラウンドボックスが**うにょっと動き**ます。

いやまぁ、ただそれだけなのですが……せっかくなので**うにょっと機能**の仕組みを書いていきます。

## うにょっと？動く仕組み
- HTML
まずは、`HTML`について。以下のような記述です。

```html
<ul class="menu">
  <li class="top">top</li>
  <li class="service">service</li>
  <li class="staff">staff</li>
  <li class="about">about</li>
  <li class="contact">contact</li>
</ul>
```
「`nav`使えよ！」という意見は一旦さておき、よく見る変哲の無い構造かと思います。

- CSS
次に、見た目に関してはカスタムデータ属性（`data-current`）を用意して選択したメニュー（項目）には当該属性を付与、以前のもの（それ以外のメニュー）からは属性を削除します。
（付与解除の操作は`CSS`ではなく`JavaScript`で行っています）
これにより、選択中のメニュー（項目）のみスタイルがあたります。

```css
.menu {
  list-style: none;
  padding: 0;
  background-color: #dadada;
  border-radius: 8px;
  display: flex;
  gap: 2%;
  
  & li {
    cursor: pointer;
    padding: .5em 1em;
    position: relative;
    z-index: 1;
    
    &[data-current]{
      color: #fff;
      
      &::before {
        background-color: #333;
        /* data-current が付いているものはスタイルを正す */
        transform: scaleY(1) translateX(0%); 
      }
    }
    
    &::before {
        display: block;
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 8px;
        position: absolute;
        z-index: -1;
        margin: auto; /* margin: auto;は、margin-left;とmargin-right;の両方がauto;の場合、適用される値は等しくなり、要素を含むブロックの端を基準にして要素を水平方向の中央に配置 */
        inset: 0; /* top, right, bottom, left の各プロパティに対応する省略形（すべての辺に適用される値を0）*/
        /* 縮小 → 拡大を実現するため scaleY(.75) で縦を縮めておく */
        transform: scaleY(.75) translateX(0%);
      }
      
      &.prev{
        &::before{
          left: 50%;
          /* 縮小 → 拡大を実現するため scaleY(1) */
          transform: scaleY(1) translateX(-50%); /* left（位置スタートからの）基準なので、右側に進んで左側に戻す */
          transition: transform .25s;
        }
      }
      
      &.next{
        &::before{
          left: auto; /* inset: 0; で left: 0; なので auto 指定 */
          right: 50%;
          /* 縮小 → 拡大を実現するため scaleY(1) */
          transform: scaleY(1) translateX(50%); /* right（位置スタートからの）基準なので、左側に進んで右側に戻す */
          transition: transform .25s;
        }
      }
  }
}
```

うにょっと移動は、現在選択中のメニュー（項目）の前後に応じて動きが変わります。
たとえば、次に選択したメニューが現在選択中のものより **前にある場合は「左にうにょっと」**、**後ろにある場合は「右にうにょっと」** 動きます。

具体的には上記コードの下記部分です。

```css
&.prev {
    &::before {
        left: 50%;
        /* 縮小 → 拡大を実現するため scaleY(1) */
        transform: scaleY(1) translateX(-50%);
        /* left（位置スタートからの）基準なので、右側に進んで左側に戻す */
        transition: transform .25s;
    }
}

&.next {
    &::before {
        left: auto;
        /* inset: 0; で left: 0; なので auto 指定 */
        right: 50%;
        /* 縮小 → 拡大を実現するため scaleY(1) */
        transform: scaleY(1) translateX(50%);
        /* right（位置スタートからの）基準なので、左側に進んで右側に戻す */
        transition: transform .25s;
    }
}
```

- JavaScript
**うにょっと機能**の肝となる`JavaScript`です。

```js
document.addEventListener("DOMContentLoaded", () => {
  /* data-current が付いているリストから属性を取り除いて、そのリスト要素の class名を返す */
  const hasAttrElmRemoveAttr_backToElmClassName = (
    targetEls, 
    targetAttr
  ) => {
    return Array.from(targetEls).map(targetElm => {
      if(targetElm.hasAttribute(targetAttr)){
        targetElm.removeAttribute(targetAttr);
        return targetElm.className;
      }
    }).filter(targetElm => targetElm !== undefined);
  }
  
  /* 別のリストのクリック直前までに選択されていた（data-current === true）リストのインデックス番号を取得する */
  const getTargetElmIndexNum = (
    targetEls, 
    prevCurrentElm
  ) => {
    return Array.from(targetEls).map((targetElm, i) => {
      if(targetElm.className === prevCurrentElm){
        return i;
      }
    }).filter(targetElm => targetElm !== undefined);
  }
  
  /* リストアニメーションに関する class 名の付与・解除 */
  const resetAlreadyClassName_addTargetClassName = (
    targetEls,
    targetElm,
    targetClassName
  ) => {
    targetEls.forEach(targetEl => {
      if(
        targetEl.classList.contains('prev') ||
        targetEl.classList.contains('next')
      ) {
        targetEl.classList.remove('prev');
        targetEl.classList.remove('next');
      }
    });
    targetElm.classList.add(targetClassName);
  }
  
  const lists = document.querySelectorAll('.menu li');
  lists.forEach((list, i) => {
    if(i === 0) list.setAttribute('data-current', 'true'); // テスト用
    
    list.addEventListener('click', (elm)=>{
      /* data-current が付いているリストから属性を取り除いて、そのリスト要素の class名を返す */
      const prevCurrentElm = hasAttrElmRemoveAttr_backToElmClassName(lists, 'data-current');
      
      /* 別のリストのクリック直前までに選択されていた（data-current === true）リストのインデックス番号を取得する */
      const prevCurrentElmIndex = getTargetElmIndexNum(lists, prevCurrentElm[0]);
      
      elm.target.setAttribute('data-current', 'true'); // クリックしたリスト要素に data-current を付与
      // console.log(prevCurrentElm[0], prevCurrentElmIndex[0], i);
      
      /* インデックス番号の前後に応じて付与する class を区別 */
      if(i < prevCurrentElmIndex[0]){
        resetAlreadyClassName_addTargetClassName(lists, elm.target, 'prev');
      } else {
        resetAlreadyClassName_addTargetClassName(lists, elm.target, 'next');
      }
    });  
  });
});
```

コメントアウトの通りなのですが、端的に何をしているか説明しますと、
- 各メニューを配列（`nodeList`）として扱い、
- 選択したメニューと現在選択中のものとの`index`数値を比較して、
- 少なければ`.prev`クラスを、多ければ`.next`クラスを付与する

という仕組みです。

## さいごに
メニュー項目を増減しても特に調整など必要なく機能するので、必要な方はご自由にお使いください。
読んでいただき、ありがとうございました。