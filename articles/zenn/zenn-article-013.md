---
title: "自動でハイフン区切りしてくれる電話番号の入力補助機能"
emoji: "☎️"
type: "tech"
topics:
  - "javascript"
  - "react"
  - "typescript"
  - "個人開発"
  - "フォーム"
published: true
published_at: "2024-10-13 09:00"
---

## はじめに
今回作ったのはこちらです。
タイトルにある通りなのですが、電話番号を入力すると自動でハイフン区切りしてくれます。
`React`, `TypeScript`で作っているものの、処理に関してはカスタムフックに切り分けているのでバニラJSでも（型注釈を外せば）使えると思います。

@[codesandbox](https://codesandbox.io/embed/fkv682?view=preview)

今回これを作ったきっかけは以下の記事を拝見したことです。

https://zenn.dev/yumemi_inc/articles/c1c83cb4cdcaa8

> 電話番号の入力で、ハイフンを入れる人と入れない人がいます。どちらか一方しか受け付けないと、エラーが発生し、ユーザーにストレスを与えます。ハイフンの有無を許容し、入力値を正規化するようにしましょう。ユーザーが入力した値からハイフンを除去または追加することで、データの一貫性を保ちながらユーザー体験を向上させることができます。

という記載があって自分のポートフォリオサイトやフォーム類を見ていると「全然対応できてない……」と思ったことから作るに至りました。
ちなみに今回ハイフンを追加する方針を採ったのは、人間が一目で認知できる数値ブロックが3～4桁程度だという話を聞いたことがあり、ハイフン区切りしたほうがユーザーの認知負荷が少ないと思ったためです。

あと、作っていて今更ですが、きっと他にライブラリとかあったでしょうし「そっち使えば（使った方が）良かったんじゃね？」とか思ったりしています。

が、せっかく作ったので個人開発？という名目で記事にしてみようと思いました。

## 筆者、5桁の市外局番を初めて知る
筆者はずっと関西住まいで恥ずかしながら、市外局番といえば「06,03,075...」など2〜3桁のみだと思っていました。しかし調べると5桁の市外局番とかもあったりして、それらを網羅するのは大変そうと思っていたところ「[電話番号検索 | IVRy（アイブリー）](https://ivry.jp/telsearch/)」というサイトを参照することで救われました。

このサイトから参照させていただいた市外局番など各種電話番号の先頭部分を桁数や仕様（電話の規格？）ごとにカテゴリー分けした配列を用意し、それらをもとに条件適用を行って入力文字（電話番号）の整形（ハイフン区切り）を行っています。

```ts
// カテゴリー分けした配列例（2桁のものと、モバイル・IPのもの）
export const digits_2: string[] = ['03', '04', '06'];
export const isMobileIPLists: string[] = ['050', '060', '070', '080', '090'];
// ここに記載はしていませんが、市外局番 5桁や4桁、3桁の配列も用意しています
```

## ハイフン区切りの入力補助機能コード

ハイフン区切りは以下のような一辺倒な内容で実現しています。

- `_checkDigitsClassification`で桁数のチェックと各種分類を行い、
- 該当するカテゴリー（条件）ごとに`_adjustShapePhoneNumber`で入力文字を整形し、
- `formattedNumber`という変数に代入して返す

::: details コード全容
```ts
import { digits_2, digits_3, digits_4, digits_5, freedial, isMobileIPLists, navidial } from "../allTelStartDigits";

type adjustShapePhoneNumber_position = {
  beginDigit: number; // 先頭の桁数
  middleDigit: number; // 中間の桁数
  noHyphenSumTelStr: number; // 入力文字数（ハイフンなしの電話番号文字列の合計）
}

/* 各電話番号別の分類（桁数のチェックと分類）*/
const _checkDigitsClassification: (telStr: string, delimitPoint: number) => string = (
  telStr: string,
  delimitPoint: number
) => {
  return telStr.slice(0, delimitPoint);
}

/**
 * 各電話番号の仕様に応じた電話番号（文字列）の整形
 * telnumStr：電話番号文字列, 
 * position： adjustShapePhoneNumber_position
*/
const _adjustShapePhoneNumber: (telnumStr: string, position: adjustShapePhoneNumber_position) => string = (
  telnumStr: string,
  position: adjustShapePhoneNumber_position
) => {
  return `${telnumStr.slice(0, position.beginDigit)}-${telnumStr.slice(position.beginDigit, (position.beginDigit + position.middleDigit))}-${telnumStr.slice((position.beginDigit + position.middleDigit), position.noHyphenSumTelStr)}`;
}

/**
 * 市外局番がイレギュラーなパターンの場合 （例：関東圏には{04-xxxx-xxxx}, {042~9-xxx-xxxx}という桁数は同じでもハイフン区切りが異なる）の処理
 * checkDigit：チェックする際の桁数分類, 
 * targetAreaType：対象となるエリアまたは種別, 
 * specificPhoneNum：当該市外局番（例：'04'）, 
 * telnumStr：電話番号文字列,
 * truePosition: adjustShapePhoneNumber_position,
 * falsePosition: adjustShapePhoneNumber_position,
 * checkLineByEntryLength: 確認ダイアログ表示判定のしきい値（入力文字数）
*/
const _specificPhoneNumber: (checkDigit: string, targetAreaType: string, specificPhoneNum: string, telnumStr: string, truePosition: adjustShapePhoneNumber_position, falsePosition: adjustShapePhoneNumber_position, checkLineByEntryLength: number) => string | undefined = (
  checkDigit: string,
  targetAreaType: string,
  specificPhoneNum: string,
  telnumStr: string,
  truePosition: adjustShapePhoneNumber_position,
  falsePosition: adjustShapePhoneNumber_position,
  checkLineByEntryLength: number
) => {
  const checkAndSelectPhoneNumber: boolean = telnumStr.length > checkLineByEntryLength;

  const pattern_true = _adjustShapePhoneNumber(telnumStr, truePosition);
  const pattern_false = _adjustShapePhoneNumber(telnumStr, falsePosition);

  if (checkDigit === specificPhoneNum && checkAndSelectPhoneNumber) {
    const result = confirm(`${targetAreaType}の市外局番{${specificPhoneNum}}には以下の表記が存在します。今回はどちらに該当しますか？\n{${pattern_true}}の場合は「OK」を、\n{${pattern_false}}の場合は「キャンセル」を選択してください。`);

    if (result) return pattern_true;
    else return pattern_false;
  }
}

/* ---------------------------- カスタムフック本体 ---------------------------- */
export const useAdjustPhoneNumber = () => {
  const adjustPhoneNumber: (telValue: string) => string = (telValue: string) => {
    let formattedNumber: string = telValue.trim();

    /* 既に整形済みかつ12文字以下の場合は入力内容を返す */
    if (formattedNumber.includes('-') && telValue.length < 12) return formattedNumber;

    /* 電話番号を適切にハンドリングするために整形済みの文字列を元に戻す（復元）*/
    const restoreFormattedNumber: string = formattedNumber.replaceAll('-', '');

    /* フリーダイヤル・ナビダイヤル（※{0800}がモバイル{080}処理になるのを回避するため先に書いておく）*/
    const checkDigit_4: string = _checkDigitsClassification(restoreFormattedNumber, 4);
    const isNaviOrFreedial: boolean = [...freedial, ...navidial].includes(checkDigit_4);
    if (isNaviOrFreedial) {
      if (checkDigit_4 === '0570') {
        /* ナビダイヤルには {0570-xx-xxxx}, {0570-xxx-xxx} のパターンがある */
        const truePosition: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 3, noHyphenSumTelStr: 10 };
        const falsePosition: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 2, noHyphenSumTelStr: 10 };
        const navidial_specificPhoneNumber: string | undefined = _specificPhoneNumber(checkDigit_4, 'ナビダイヤル', '0570', restoreFormattedNumber, truePosition, falsePosition, 9);
        if (typeof navidial_specificPhoneNumber !== 'undefined') {
          return formattedNumber = navidial_specificPhoneNumber;
        }
      } else {
        /* フリーダイヤル */
        const is_0800: boolean = checkDigit_4 === '0800' && restoreFormattedNumber.length >= 11;
        if (is_0800) {
          const position: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 3, noHyphenSumTelStr: 11 };
          return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
        }

        const is_0120: boolean = checkDigit_4 === '0120' && restoreFormattedNumber.length >= 10;
        if (is_0120) {
          const position: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 3, noHyphenSumTelStr: 10 };
          return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
        }
      }
    }

    /* モバイル・IP */
    const checkDigit_3: string = _checkDigitsClassification(restoreFormattedNumber, 3);
    const isMobileIP: boolean = isMobileIPLists.includes(checkDigit_3) && restoreFormattedNumber.length >= 11;
    if (!isNaviOrFreedial && isMobileIP) {
      const position: adjustShapePhoneNumber_position = { beginDigit: 3, middleDigit: 4, noHyphenSumTelStr: 11 };
      return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
    }

    /* 市外局番 */
    if (!isNaviOrFreedial && restoreFormattedNumber.length >= 6) {
      /* 先頭 5 桁 */
      const checkDigit_5: string = _checkDigitsClassification(restoreFormattedNumber, 5);
      const digit_5: boolean = digits_5.includes(checkDigit_5);
      if (digit_5) {
        const position: adjustShapePhoneNumber_position = { beginDigit: 5, middleDigit: 1, noHyphenSumTelStr: 10 };
        return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
      }

      /* 先頭 4 桁 */
      const digit_4: boolean = digits_4.includes(checkDigit_4);
      if (digit_4) {
        /* 宮城県{0223}の場合 */
        const truePosition: adjustShapePhoneNumber_position = { beginDigit: 3, middleDigit: 3, noHyphenSumTelStr: 10 };
        const falsePosition: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 2, noHyphenSumTelStr: 10 };
        const miyagiPref_specificPhoneNumber: string | undefined = _specificPhoneNumber(checkDigit_4, '宮城県', '0223', restoreFormattedNumber, truePosition, falsePosition, 7);
        if (typeof miyagiPref_specificPhoneNumber !== 'undefined') {
          return formattedNumber = miyagiPref_specificPhoneNumber;
        }

        const position: adjustShapePhoneNumber_position = { beginDigit: 4, middleDigit: 2, noHyphenSumTelStr: 10 };
        return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
      }

      /* 先頭 3 桁 */
      const notMobileDigit_3: boolean = digits_3.includes(checkDigit_3);
      if (notMobileDigit_3) {
        const position: adjustShapePhoneNumber_position = { beginDigit: 3, middleDigit: 3, noHyphenSumTelStr: 10 };
        return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
      }

      /* 先頭 2 桁 */
      const checkDigit_2: string = _checkDigitsClassification(restoreFormattedNumber, 2);
      const digit_2: boolean = digits_2.includes(checkDigit_2);
      if (digit_2) {
        /* 関東圏{04}の場合 */
        const truePosition: adjustShapePhoneNumber_position = { beginDigit: 3, middleDigit: 3, noHyphenSumTelStr: 10 };
        const falsePosition: adjustShapePhoneNumber_position = { beginDigit: 2, middleDigit: 4, noHyphenSumTelStr: 10 };
        const kantoArea_specificPhoneNumber: string | undefined = _specificPhoneNumber(checkDigit_2, '関東圏', '04', restoreFormattedNumber, truePosition, falsePosition, 7);
        if (typeof kantoArea_specificPhoneNumber !== 'undefined') {
          return formattedNumber = kantoArea_specificPhoneNumber;
        }

        const position: adjustShapePhoneNumber_position = { beginDigit: 2, middleDigit: 4, noHyphenSumTelStr: 10 };
        return formattedNumber = _adjustShapePhoneNumber(restoreFormattedNumber, position);
      }
    }

    return formattedNumber;
  }

  return { adjustPhoneNumber }
}
```
（もう少し、こう、なんかリファクタリングとかできたんじゃね？という感じなコードでもありますが……）
:::

この処理を通じて返ってきた値（整形された電話番号）は以下のようにハンドリングしています。

```ts
const { adjustPhoneNumber } = useAdjustPhoneNumber();
const handlePhoneNumber: (telValue: string) => void = (telValue: string) => {
  const formattedNumber: string = adjustPhoneNumber(telValue);
  setValue("tel", formattedNumber); // 整形した電話番号に更新
};
```

`JSX`部分はこんな感じです（入力補助機能とは一切関わりないですが、フォームには一般的に主流な`react-hook-form`を使っています）
```ts
<TheForm name="contact" onSubmit={handleSubmit(onSubmit)}>
  <label>
    <span>電話番号</span>
    <input
      type="tel"
      id="tel"
      autoComplete="tel"
      {...register("tel")}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handlePhoneNumber(e.target.value)}
    />
  </label>
  <button>送信</button>
</TheForm>
```

ちなみに、`TheForm`というのはスタイリングに`styled-components`を使っているためです。

## 04という市外局番の罠
04は関東圏の市外局番だそうです。
例えば、`0429123456`, `0429123456`という電話番号があるとすると、何と「04-2912-3456」と「042-912-3456」という異なる区切り方が存在します。
そのため筆者は、上記条件に該当する場合は入力途中でどちらの区切り方が正しいかを選択する確認ダイアログを表示して、その選択結果を反映させるようにしました。
この機能に該当するのが先に紹介したコードの以下部分です。

```ts
/**
 * 市外局番がイレギュラーなパターンの場合 （例：関東圏には{04-xxxx-xxxx}, {042~9-xxx-xxxx}という桁数は同じでもハイフン区切りが異なる）の処理
 * checkDigit：チェックする際の桁数分類,
 * targetAreaType：対象となるエリアまたは種別,
 * specificPhoneNum：当該市外局番（例：'04'）,
 * telnumStr：電話番号文字列,
 * truePosition: adjustShapePhoneNumber_position,
 * falsePosition: adjustShapePhoneNumber_position,
 * checkLineByEntryLength: 確認ダイアログ表示判定のしきい値（入力文字数）
*/
const _specificPhoneNumber: (checkDigit: string,  targetAreaType: string,  specificPhoneNum: string,  telnumStr: string,  truePosition: adjustShapePhoneNumber_position,  falsePosition: adjustShapePhoneNumber_position,  checkLineByEntryLength: number) => string | undefined = (
  checkDigit: string,
  targetAreaType: string,
  specificPhoneNum: string,
  telnumStr: string,
  truePosition: adjustShapePhoneNumber_position,
  falsePosition: adjustShapePhoneNumber_position,
  checkLineByEntryLength: number
) => {
  const checkAndSelectPhoneNumber: boolean =
    telnumStr.length > checkLineByEntryLength;

  const pattern_true = _adjustShapePhoneNumber(telnumStr, truePosition);
  const pattern_false = _adjustShapePhoneNumber(telnumStr, falsePosition);

  if (checkDigit === specificPhoneNum && checkAndSelectPhoneNumber) {
    const result = confirm(
      `${targetAreaType}の市外局番{${specificPhoneNum}}には以下の表記が存在します。今回はどちらに該当しますか？\n{${pattern_true}}の場合は「OK」を、\n{${pattern_false}}の場合は「キャンセル」を選択してください。`
    );

    if (result) return pattern_true;
    else return pattern_false;
  }
};
```
`confirm`メソッドの結果（`true`/`false`）によって選択できるようにしています。
上の`_specificPhoneNumber`メソッドの使用例は以下です。

```ts
/* 関東圏{04}の場合 */
const truePosition: adjustShapePhoneNumber_position = { beginDigit: 3, middleDigit: 3, noHyphenSumTelStr: 10 };
const falsePosition: adjustShapePhoneNumber_position = { beginDigit: 2, middleDigit: 4, noHyphenSumTelStr: 10 };

const kantoArea_specificPhoneNumber: string | undefined = _specificPhoneNumber(checkDigit_2, '関東圏', '04', restoreFormattedNumber, truePosition, falsePosition, 7);

if (typeof kantoArea_specificPhoneNumber !== 'undefined') {
　return formattedNumber = kantoArea_specificPhoneNumber;
}
```

先に述べた「区切りの異なる電話番号」は他にも宮城県で確認できました（たぶん他にもまだまだありそうな気がする……）。
そういった場合も上記のように記述してカバーできます。

## さいごに
ここまで読んでいただきありがとうございました。
本記事内容の`GitHub`を置いておくので必要な方は自由に使ってください。

https://github.com/Benjuwan/Jap-TelnumEntryAssist

何か間違いや気づきがあった場合はご指摘・ご教授いただければ幸いです。

### 参照
https://ivry.jp/telsearch/
