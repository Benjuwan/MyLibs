---
title: "Next.js（React）× Swiper：任意の文字列をスライダーのインジケーターに設定する方法"
emoji: "🔸"
type: "tech"
topics:
  - "javascript"
  - "next"
  - "react"
  - "swiper"
published: true
published_at: "2024-04-08 11:04"
---

## 任意の文字列をスライダーのインジケーターに設定とは？
スライダーのインジケーターとは、スライダー下部にある点（ビュレット）の部分です。

![swiper - pagination](https://storage.googleapis.com/zenn-user-upload/9a35c8210070-20240408.png)

ある個人開発で`swiper`を用いてスライダーを実装している際に、点のビュレット（ドットビュレット）ではなく、タブUIのような任意の文字列を設定したくなりました。
※筆者が行った個人開発は`Next.js（React）`ですが、バニラJSでも同じことは出来ると思います。

当初、各ドットビュレットのDOM要素をごにょごにょして変更するしかないかぁ、と思っていたのですが、`swiper`には簡単に行える仕組みがあったので備忘録兼情報共有として記事にしていきます。

## 結論
[`renderBullet`](https://swiperjs.com/swiper-api#param-renderBullet)を使って`swiper`のページネーションに任意の文字列を指定できる。

```typescript
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const navListsLable = ['食事', '遊び', '癒し', '運動', '勉強'];
    const renderBullet = (index: number) => {
        return `<button type="button" class="swiper-pagination-bullet">${navListsLable[index]}</button>`;
    }

return (
    <SwiperLibsWrapper>
        <Swiper
            modules={[Pagination]}
            pagination={{ renderBullet, clickable: true }}
        >
        ..
        .
)
```

たったこれだけの記述でタブUIのようなスライダーが実装できました。
改めて`swiper`の便利さを思い知るとともに、何か違ったことがしたい時は公式ドキュメントを確認する大切さも感じました。

読んでいただき、ありがとうございます。