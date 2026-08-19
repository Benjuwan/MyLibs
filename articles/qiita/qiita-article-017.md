title: 今日のあなたはナニモン？ -Digimon API-

tags: React TypeScript 個人開発 API ポエム

## はじめに
新年の書き初めにしようと考えていた個人開発で、とにかく速く作ることを意識しました。
制作日数は1日で、[DAPI: Digimon API](https://digimon-api.com/)を使った、毎朝の占い番組・アプリ？のような用途を想定しています。<font color="lightgray">……クソアプリと言わないで</font>

## 作ったもの

https://digi-view-api.vercel.app/

![digiView-1.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/8149fca8-8b24-1b38-6913-5222f0f65a8a.gif)

見ていただいた通りなのですが『あなたがナニモンかチェック』ボタンを押下すると適当なデジモンが表示されます。
当初は**占いというテーマ**を意識していたので一日一回しかデジモンを表示できないようにしようかと思ったのですが、その日がスカモンだったり、ヌメモンだったりした人の気持ちを考えて何度もチェックできるようにしました。
<font color="lightgray">スカモンやヌメモンが好きな方がいらしたら申し訳ございません</font>

こだわったことと言えば制作スピードくらいなのですが、他のこだわりもいくつか挙げていきたいと思います。

## ここら辺にこだわった
- デジモンのランダム表示
これは**占いというテーマ**から外せない必要要件でした。[DAPI: Digimon API](https://digimon-api.com/)にはデジモンデータの総数を取得できるところが用意されていたので、それを用いてランダム表示する仕組みにしました。

```typescript
:
const randNum: number = Math.floor(Math.random() * data.pageable.totalElements); // 総数をベースにランダム数値を生成
setRandNum((_prevRandNum) => randNum); // ランダム数値をState管理
const singleDigimonData: Response = await fetch(`https://digi-api.com/api/v1/digimon/${randNum}`); // ランダム数値をエンドポイントに指定
:
```
先ほども触れましたが一日一度ではなく、何度でもその日の自分が『ナニモン』かチェックできます。

![digiView-3.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/d857752b-230f-eb1e-987f-73b3bb8addb4.gif)

- 将来性（進化後）と経歴（進化前）の表示
APIを見てみると、当該デジモンの進化後・進化前のデータも取得できることが分かったので、これも何かに使えないかと考えて追加したのが当機能です。

![スクリーンショット 2024-01-04 151427.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/c6c9753a-86bd-1ee0-cbaf-df44eb3979d2.png)

「たとえ今日がヌメモンでも、**メタルグレイモンになれる可能性がある**んだ」って考えると毎朝晴れやかな気持ちで一日を始められそうですよね？
まぁご覧の通り、スカモンルートもあるのですが……。

![スクリーンショット 2024-01-04 151941.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e3987dd3-5cdb-86ef-81ba-0fd6e23adb8f.png)

一方で、自身の振り返りもできるように今までのキャリア（進化前）も確認できるようにしてあります。
「あの頃この程度だった自分も今ではここまでできるって成長したなぁ～」と自分をたまには褒めてあげてください。
他人と自分を比べるのではなく、昨日までの自分と比べて日々精進に努めたいものです。

![スクリーンショット 2024-01-04 151722.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/78c3f626-c342-70d2-59c4-0e4dc66f225d.png)

ちなみに、進化後または進化前のデータがないデジモンの場合は**将来性無しや経歴不明**となります。

![スクリーンショット 2024-01-04 152539.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/81dfcc03-2046-1aec-7b1f-258b9ccd1cc4.png)

いわゆるカンスト？状態になっても**将来性なし**になります。
そのような方々は、ここまで究められて素晴らしいという他ないですが驕り高ぶることなく謙虚と思いやりを忘れないようにしていただきたいものです。「その界隈では有名だがその界隈が狭すぎて世間には通じない」という心構えを持っていたいですね。

- なりたいデジモンになれる
**「どうしてもオメガモン（omgemon）になりたい！」**
**「今日は大事な商談がある日だからウォーグレイモン(war greymon)の気分だ！」** 
**「デュークモン（dukemon）みたいに気品をまといたい」** 
というニッチな方々のニーズにお答えすべくフォームを用意しました。

![digiView-2.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/c229e47c-3288-d8ae-a669-c3550d404719.gif)

しかし、デジモン名は**英語名**で入力していただく必要があります。かたじけなし。

## さいごに
ここまで読んでいただき、ありがとうございました。
GitHubを貼っておきますので気になった方は自由にご利用ください。

https://github.com/Benjuwan/digiView

## 参照情報
https://digimon-api.com/
