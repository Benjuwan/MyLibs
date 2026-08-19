---
title: "【JavaScript】Event Delegation への理解 ~動的に生成されたコンテンツを消したい~"
emoji: "😮"
type: "tech"
topics:
  - "html"
  - "javascript"
  - "react"
published: true
published_at: "2024-01-30 15:33"
---

## 動的に生成されたコンテンツを消したい
動的に生成されたリストに対する操作（リストの削除）において筆者は **[Event Delegation（イベント移譲）](https://ja.javascript.info/event-delegation)** を知らず、以下のような記述で事足りると思っていました。

```js
const lists = document.querySelectorAll('ul li');
lists.forEach(list=>{
  const deleteBtn = list.querySelector('button');
  deleteBtn.addEventListener('click', ()=>{
    list.remove();
  })
});
```

この記述でも機能するのですが、それは**静的コンテンツ（初めから用意されているコンテンツ）に対してのみ**でした。

例えば、先ほどの記述を以下のように書き換えてみます。
追加ボタン`addBtn`を押すとコンテンツが追加されるものです。

```diff js
+ const wrapper = document.querySelector('ul');
+ const addBtn = document.querySelector('ul + button');
+ addBtn.addEventListener('click',()=>{
+    wrapper.insertAdjacentHTML('beforeend', `<li>追加されたコンテンツ<button>delete</button></li>`)
+  });

const lists = document.querySelectorAll('ul li');
lists.forEach(list=>{
  const deleteBtn = list.querySelector('button');
  deleteBtn.addEventListener('click',()=>{
    list.remove();
  })
});
```

先ほどと同じように削除ボタンを押しても **「追加されたコンテンツ」は削除されません。**
これは、追加ボタン`addBtn`クリックによって追加された**動的コンテンツを認識してくれない**ためです。

## Event Delegation（イベント移譲）
動的に生成されたものを認識してもらい、それに対して処理を行うには[Event Delegation（イベント移譲）](https://ja.javascript.info/event-delegation)が一つの解決策となります。

先ほどのコードを以下のように書き換えます。

```diff js
// ここまでは先ほどと同じ記述
- const lists = document.querySelectorAll('ul li');
- lists.forEach(list=>{
-   const deleteBtn = list.querySelector('button');
-   deleteBtn.addEventListener('click',()=>{
-     list.remove();
-   })
- });

+ wrapper.addEventListener('click',(e)=>{
+  if(e.target.tagName === 'BUTTON'){
+    e.target.closest('li').remove();
+  }
+})
```

これで動的に生成されたコンテンツが認識され、削除できるようになりました。
`if(e.target.tagName === 'BUTTON')`でボタン要素のみをイベント発火元にしているので、deleteボタン以外を押すと（リスト削除が）機能しません。
以下で試してみてください。

@[codepen](https://codepen.io/benjuwan/pen/bGZLbaa)

このように`e.target.tagName`でイベント発火元の要素を条件分岐できるので処理内容を柔軟にカスタマイズできますし、融通の効いた書き方が実現できると思います。

また、関数の中にイベントハンドラーを仕込むこともできます。
以下は、`input`に名前とメールアドレスを入力して`run`ボタンを押すと、そのユーザー情報（名前・メールアドレス）が削除ボタンとともにリスト生成される、というものです。
ユーザー情報（リスト）の生成時に、一緒に用意される削除ボタン`deleteBtn`に対してリスト削除のイベントハンドラー及び関数`deleteList`を仕込んでいます。

```js
const deleteList = (eventTarget, DOMstr) => {
  const targetElm = eventTarget.closest(DOMstr);
  targetElm.remove();
}

const wrapper = document.querySelector('.wrapper');
const runBtn = document.querySelector('#run');

runBtn.addEventListener('click', ()=>{
  createEntry();
});

const createEntry = () => {
  const nameInput = document.querySelector('#name');
  const mailInput = document.querySelector('#mail');
  
  const deleteBtn = document.createElement('button');
  deleteBtn.classList = ['btns deleteBtn'];
  deleteBtn.textContent = '削除';
  /* 関数内にイベントハンドラーを仕込む */
  deleteBtn.addEventListener('click',(e)=>{
    deleteList(e.target, 'div');
  });
  
  const wrapperDivStyle = ['display:flex','gap:1em','background-color:#dadada','margin-bottom:1em'];
  
  wrapper.insertAdjacentHTML('beforeend',`<div style="${wrapperDivStyle.join(';')}"><p>name：${nameInput.value}</p><p>mail：${mailInput.value}</p></div>`);
  
  const insertedDiv = wrapper.lastElementChild;
  insertedDiv.appendChild(deleteBtn);
}
```

## さいごに
実は今回のEvent Delegation（イベント移譲）に触れるきっかけは、Qiita でとある質問に回答した際の出来事でした。冒頭で記述した筆者の回答では動的コンテンツに対応できないことを有識者に教えていただき、Event Delegation（イベント移譲）を知る機会を得たのです。

筆者は普段`React`で動的生成リストを扱う際には入力内容などを内包した一つのコンテンツ情報をオブジェクトの`state`として扱って、その`state`に対して処理（`slice`, `splice`など）を行うというアプローチを採っていたので、このようなバニラJSでの処理は大変勉強になりました。

その経験を活かして情報共有できればと備忘録も兼ねて記事にした次第です。
ここまで読んでいただき、ありがとうございました。

この記事が少しでも誰かのお役に立てれば幸いです。

## 参照情報
https://ja.javascript.info/event-delegation

https://docs.komagata.org/5458