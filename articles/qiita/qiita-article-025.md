---
title: 【個人開発】デジタルでアナログなポモドーロタイマー
tags: React TypeScript vite 個人開発 業務効率化
author: benjuwan
slide: false
---
## はじめに
「現在時刻と連動しながら視覚的に進捗を把握できたら便利だな」と思って、アナログ時計をベースにしたポモドーロタイマーを`React`, `TypeScript`, `vite`で作りました。

これで今日から筆者の自制心は高度に保たれ、業務に対するモチベーションと生産性は爆上がり（する予定）です。

https://analog-pomodoro.netlify.app/

- ポモドーロ：休憩→タスク開始
![start.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/4ef31db9-baab-a211-c25c-615703f8fbf7.gif)

- ポモドーロ：終了
![done.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/20d6e9c5-4cd1-adf0-7b91-24505dbca5e5.gif)

## 概要
デジタルでアナログなポモドーロタイマーなので「タスク時間」と「休憩時間」を自由に設定できるようにしております。

タスク開始と休憩開始、ポモドーロ終了時それぞれで通知音が鳴るようになっています。

自由な設定と言っても、30分を1タームとするポモドーロテクニックのルールに準ずるため30分以上の設定はできないようになっています。

「25分も集中できないよ〜」って方は10分〜15分とかの設定にするなど個人に合わせた使い方をしてみてください。

筆者はだいたいタスク時間：10分〜15分、休憩：5分とかにしてます。

## ポモドーロって？
今更ですが軽く触れておきます。

> ポモドーロ・テクニック（Pomodoro Technique）は、集中力を高め、効率的に作業を進めるための時間管理術です。1980年代にフランチェスコ・シリロ（Francesco Cirillo）によって考案され、短い集中作業の時間（ポモドーロ）と休憩を繰り返すことで、作業効率や集中力を向上させます。

上記は`Chat-GPT`に尋ねた回答です。
具体的な実施内容は以下になります。

- その日に達成したい1つのタスクを細かく分割する
1. 分割した1つのタスクを**25分**間集中して行う
2. **5分**休憩を取る
3. 1と2を繰り返し、4ポモドーロ（2時間）ごとに15〜30分間の休憩を取る

## 苦労した点
- 時間経過が少しずつずれていく
当初、愚直に`setTimeout`を使ってカウントしていく方法を採っていたのですが徐々にカウントアップ数値がズレていってしまって困りました。`Date.now()`を使うことで正確に時刻管理できるようになりました。

```js
const pomodoroStartTime: number = Date.now();

const theInterval: number = setInterval(() => {
    const elapsedTime: number = Math.floor((Date.now() - pomodoroStartTime) / 1000);
...
..
.
```

- ポモドーロ進捗を表す視覚表示の調整
最初は「25分/5分」の視覚画像を用意していたのです。

しかし作っているうちにタスク時間と休憩時間を設定できるようにしたいと思い、グラフ表示などに使用する`Recharts`ライブラリで実装しました。
`Recharts`が生成した視覚画像の角度を指定した時間によってスタイリングしていたのですが「設定したポモドーロ合計時間が30分に満たない場合」に期待した描画とならず苦労しました。

具体的には「25m/5m」や「15m/15m」、「10m/20m」など合計時間が30分になる場合は全く問題なかったのです。
しかし「10m/10m」や「15m/5m」などすると開始した分針からズレて表示されてしまいました。

解決策としては差分用の値（`remands`の部分）を設けて調整しました。
```jsx
export const ThePie = () => {
  const { pomodoroTime } = useContext(PomodoroTimeContext);

  const data = [
    { name: 'breakTime', value: pomodoroTime.breakStartTime },
    { name: 'focusTime', value: pomodoroTime.focus_reStartTime },
    { name: 'remands', value: 180 - (pomodoroTime.focus_reStartTime + pomodoroTime.breakStartTime) }
  ];
  
  const COLORS = ['#82ffa0', '#9debff', 'transparent'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={50}
        endAngle={180} // 180deg：常に半円（分度器・半月状態）で表示
        fill="#eaeaea"
        labelLine={false}
      >
        {data.map((_entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} stroke='transparent' />
        ))}
      </Pie>
    </PieChart>
  );
}
```

- iOSで通知サウンドが再生されない問題
これが一番困りました。どうやら調べると自動再生ポリシーなるものの影響で**ユーザーアクションが一度もないものは再生できない**ようになっているようです。

https://webfrontend.ninja/js-audio-autoplay-policy-and-delay/#google_vignette

> では、どうすれば再生するのかというと、クリックやタップといったユーザーのアクションをトリガーにする必要があります。

筆者はポモドーロ開始ボタンクリック時に両通知音を鳴らすようにして対応しました。

とはいえスマホ・PC問わず、**「複数ページ開いていて（ポモドーロタイマーページの）タブが非アクティブだと通知サウンドが鳴らない」** 場合~~欠陥~~があるんですよね。

筆者的には「現在時刻と連動しながら視覚的に進捗を把握」することを目的としつつも、非アクティブ状態でも通知音を合図にタスクと休憩の切り替えができれば便利だなとも思っております。

これに関する理由や、何か良い改善策などをご存知の方は教えていただけますとありがたく存じます。

## さいごに
ここまで読んでいただき、ありがとうございました。
ぜひ使ってもらえると嬉しい限りです。

筆者とともに、自制心を高度に保ち、業務に対するモチベーションと生産性を爆上がり（する予定に）させましょう。

`GitHub`を置いておくので関心のある方は自由にしてください。

https://github.com/Benjuwan/analogPomodoro

