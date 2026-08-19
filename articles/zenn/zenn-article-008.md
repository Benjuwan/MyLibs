---
title: "React / Next.js で Css Modules を使って選択したDOMに対する手続き的処理を行いたい場合のメモ"
emoji: "🗒️"
type: "tech"
topics:
  - "javascript"
  - "next"
  - "react"
  - "typescript"
published: true
published_at: "2024-02-24 17:08"
---

## はじめに
普段は`styled-components`を使っているのですが、他の手法にも慣れておこうと`React` / `Next.js`共にデフォルトで使用できる`Css Modules`を使ってみました。
この際、DOMに対する手続き的処理の方法で少し詰まったので備忘録として書いておこうと思います。

::: message
ここで言う**手続き的処理**とは、`jsx`の`onClick`や`onChange`, `onSubmit`などで処理を記述または動作させずに、`querySelector`や`addEventListener`などを用いて処理を記述していくことを指します。
:::

## 結論
```ts
import headerStyle from "../../styles/header/header.module.css";

export const useNavView = () => {
    const headerBtnAct: () => void = () => {
        const headerNav = document.querySelector(`.${headerStyle.headerNavArea} nav`);
        const headerBtn = document.querySelector(`.${headerStyle.headerBtn}`);
        headerBtn?.classList.toggle(headerStyle.ViewOn);
        headerNav?.classList.toggle(headerStyle.ViewOn);
    }

    const removeAct: () => void = () => {
        const headerNav = document.querySelector(`.${headerStyle.headerNavArea} nav`);
        const headerBtn = document.querySelector(`.${headerStyle.headerBtn}`);
        if (headerNav?.classList.contains(headerStyle.ViewOn)) {
            headerNav?.classList.remove(headerStyle.ViewOn);
            headerBtn?.classList.remove(headerStyle.ViewOn);
        }
    }

    return { headerBtnAct, removeAct }
}
```

- ```ts
  document.querySelector(`.${headerStyle.headerNavArea} nav`)
  ```
  `.CssModulesStyleElm DOM`という形で絞り込み指定ができる。

- ```ts
  document.querySelector(`.${headerStyle.headerBtn}`)
  ```
  単数指定は上記の形。

- ```ts
  if (headerNav?.classList.contains(headerStyle.ViewOn)) {
      headerNav?.classList.remove(headerStyle.ViewOn); // headerNav の .ViewOn を削除
      headerBtn?.classList.remove(headerStyle.ViewOn); // headerBtn の .ViewOn を削除
  }
  ```
  `class`属性の指定方法

## さいごに
もし間違いなどあればコメントでご指摘・ご教授いただければ幸いです。
読んでいただき、ありがとうございました。

