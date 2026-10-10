# UI操作・インタラクション ナレッジカタログ

本ドキュメントは、実務で頻出するUIコンポーネントおよびインタラクション処理について、過去の試行錯誤から得られた知見を抽出し、**React 19 / TypeScript 5+ のベストプラクティス**に適合するよう再編したリファレンス集です。

---

## 目次
- [01. 日付・スケジュールの連動セレクト（月末日自動補正）](#01-日付スケジュールの連動セレクト月末日自動補正)
- [02. カウントダウン・インターバル制御（再レンダリング最適化）](#02-カウントダウンインターバル制御再レンダリング最適化)
- [03. リストのドラッグ＆ドロップ並び替え（React State連動）](#03-リストのドラッグドロップ並び替えreact-state連動)
- [04. カルーセル/スライダーのラッパー設計（SSR整合性担保）](#04-カルーセルスライダーのラッパー設計ssr整合性担保)
- [05. 神経衰弱ゲームとアクセシビリティ制御（`inert`属性の活用）](#05-神経衰弱ゲームとアクセシビリティ制御inert属性の活用)
- [06. URL同期型ページネーション（App Router最適化）](#06-url同期型ページネーションapp-router最適化)

---

## 01. 日付・スケジュールの連動セレクト（月末日自動補正）

- **最終検証日**: 2026-10-10
- **対象環境**: React 19 / TypeScript 5+
- **概要**: 年・月・日の3つのセレクトボックスにおいて、閏年や大の月・小の月を自動判定し、月変更時に存在しない日付（例: 1月31日→2月に変更時の31日）を自動的に末日へ補正するUIパターン。

### 1. 前提・設計思想
生年月日入力や予約システムなどでネイティブ `<input type="date">` がデザイン要件で使えない場合、`<select>` を3つ並べる設計が採用されます。  
課題となるのは**「月や年を変更した際、選択済みの日付が新しい月の最大日数を超えてしまう（例: 2月31日）」という不正値の発生**です。これを外部ライブラリ（date-fnsやdayjs）なしで、JavaScript標準の `Date` オブジェクトの仕様を活かして軽量・確実に制御します。

### 2. 最小実装コード
```tsx
import React, { useMemo } from 'react';

type DateState = {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
};

export const useDateSelector = (
  initialDate: DateState,
  onChange?: (date: DateState) => void
) => {
  const [date, setDate] = React.useState<DateState>(initialDate);

  // 指定年月の最大日数を算出 (翌月の0日目 = 当月末日)
  const maxDays = useMemo(() => {
    return new Date(date.year, date.month, 0).getDate();
  }, [date.year, date.month]);

  // 年・月の変更ハンドラ（現在の日が末日を超えていれば自動補正）
  const updateYear = (year: number) => {
    const newMax = new Date(year, date.month, 0).getDate();
    const newDate = { ...date, year, day: Math.min(date.day, newMax) };
    setDate(newDate);
    onChange?.(newDate);
  };

  const updateMonth = (month: number) => {
    const newMax = new Date(date.year, month, 0).getDate();
    const newDate = { ...date, month, day: Math.min(date.day, newMax) };
    setDate(newDate);
    onChange?.(newDate);
  };

  const updateDay = (day: number) => {
    const newDate = { ...date, day };
    setDate(newDate);
    onChange?.(newDate);
  };

  return { date, maxDays, updateYear, updateMonth, updateDay };
};

// UIコンポーネント例
export const DateSelectForm: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { date, maxDays, updateYear, updateMonth, updateDay } = useDateSelector({
    year: currentYear,
    month: 1,
    day: 1,
  });

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <select value={date.year} onChange={(e) => updateYear(Number(e.target.value))}>
        {Array.from({ length: 50 }, (_, i) => currentYear - i).map((y) => (
          <option key={y} value={y}>{y}年</option>
        ))}
      </select>

      <select value={date.month} onChange={(e) => updateMonth(Number(e.target.value))}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m}月</option>
        ))}
      </select>

      <select value={date.day} onChange={(e) => updateDay(Number(e.target.value))}>
        {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}日</option>
        ))}
      </select>
    </div>
  );
};
```

### 3. ハマりどころ＆現代の知見
- **`new Date(year, month, 0).getDate()` の美しさ**:  
  第2引数の `month` に「求めたい月（1-12）」をそのまま渡し、第3引数に `0` を渡すと「指定月の前月末日（＝求めたい月の末日）」が得られます。自前で閏年計算（`year % 4 === 0 && year % 100 !== 0 ...`）を書く必要はありません。
- **当時のアンチパターン（グローバルStateの濫用）**:  
  旧実装ではJotai/Recoil風のAtomで年・月・日を個別管理していましたが、フォーム内の閉じたUIにグローバルStateを持ち込むと、同ページに複数配置できなくなりテスト性も低下します。カスタムフックで局所状態にカプセル化するのが鉄則です。
- **補正のタイミング**:  
  月を変更した際に `Math.min(currentDay, newMaxDays)` で即座に値を丸めないと、セレクトボックスの `value` が選択肢に存在しない浮動状態になり、ReactのWarningや意図しない送信エラーの原因となります。

### 4. AI具現化プロンプト
```text
React 19 + TypeScriptで、年・月・日の3つの連動セレクトボックスコンポーネントを作成してください。
要件:
1. 年または月を変更した際、選択中の日がその月の末日を超えている場合は自動的に末日に補正すること。
2. 末日計算は new Date(year, month, 0).getDate() を使用し、外部ライブラリに依存しないこと。
3. フォーム外から初期値を受け取り、変更時に onChange コールバックで { year, month, day } を渡せる再利用可能なカスタムフックとコンポーネントに分離してください。
```

---

## 02. カウントダウン・インターバル制御（再レンダリング最適化）

- **最終検証日**: 2026-10-10
- **対象環境**: React 19 / TypeScript 5+
- **概要**: 指定された目標日時までの残り時間（日・時・分・秒）をリアルタイムに更新・表示するタイマーパターン。タブ非アクティブ時のズレ防止とクリーンアップ。

### 1. 前提・設計思想
セール終了日時や試験時間などのカウントダウン表示。  
よくある誤装として「1秒ごとに `state` を -1 していく」実装がありますが、ブラウザのバックグラウンドタブ抑制（タイマースロットリング）によって時間が狂います。**「目標時刻と現在時刻の差分（`targetTime - Date.now()`）」を毎回再計算する絶対時間同期**が必須です。

### 2. 最小実装コード
```tsx
import React, { useState, useEffect } from 'react';

type RemainingTime = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
};

const calculateRemaining = (targetEpochMs: number): RemainingTime => {
  const diff = Math.max(0, targetEpochMs - Date.now());
  return {
    totalMs: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isFinished: diff <= 0,
  };
};

export const useCountdown = (targetDate: Date | string | number) => {
  const targetMs = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [remaining, setRemaining] = useState<RemainingTime>(() => calculateRemaining(targetMs));

  useEffect(() => {
    // 既に終了している場合はインターバル不要
    if (calculateRemaining(targetMs).isFinished) return;

    const timerId = setInterval(() => {
      const next = calculateRemaining(targetMs);
      setRemaining(next);
      if (next.isFinished) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [targetMs]);

  return remaining;
};
```

### 3. ハマりどころ＆現代の知見
- **`setInterval` のメモリリーク**:  
  コンポーネントのアンマウント時に `return () => clearInterval(timerId)` を忘れるとバックグラウンドで動き続け、リークの原因になります。
- **秒単位表示の再レンダリング負荷**:  
  ミリ秒まで表示したい場合は `setInterval` だとコマ落ち・高負荷になるため `requestAnimationFrame` を用いるのが定石です。秒単位の表示であれば1秒更新で十分です。
- **SSR環境のハイドレーションミスマッチ**:  
  サーバーレンダリング時（SSR）とクライアント実行時で `Date.now()` にズレが生じるため、初期レンダリング時はローディング表示にするか、クライアントマウント後にタイマーを開始する対策（`useEffect` 後の描画）が必要です。

### 4. AI具現化プロンプト
```text
React 19 + TypeScriptで、目標日時までのカウントダウンフック useCountdown を作成してください。
要件:
1. 残り時間の減算ではなく、Date.now() との差分から日・時・分・秒を計算すること（バックグラウンドズレ防止）。
2. タイマー終了時には自動で clearInterval すること。
3. Next.js App Routerでのハイドレーションミスマッチを防ぐため、マウント完了前用の安全なフォールバックを考慮してください。
```

---

## 03. リストのドラッグ＆ドロップ並び替え（React State連動）

- **最終検証日**: 2026-10-10
- **対象環境**: React 19 / TypeScript 5+
- **概要**: 外部ライブラリ（dnd-kit等）を使わず、HTML5 Drag & Drop API を用いてリスト項目を直感的に並び替えるパターン。

### 1. 前提・設計思想
重厚なD&Dライブラリを入れずに、数十行のコードで軽量にリストの順序変更を実現したいケースです。  
マウスの位置が項目の中心点より「上」か「下」かで挿入位置（前か後ろか）を判定する計算ロジックを、**DOM直接操作ではなくReactのState配列の並び替えとして純粋に適用**します。

### 2. 最小実装コード
```tsx
import React, { useState } from 'react';

type Item = { id: string; text: string };

export const DragSortList: React.FC<{ initialItems: Item[] }> = ({ initialItems }) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, hoverIndex: number) => {
    e.preventDefault(); // dropを発火させるために必須
    if (draggingIndex === null || draggingIndex === hoverIndex) return;

    // カーソル位置が項目の中心を超えたかを判定
    const targetRect = e.currentTarget.getBoundingClientRect();
    const targetMiddleY = targetRect.top + targetRect.height / 2;
    const isCursorBelowMiddle = e.clientY > targetMiddleY;

    // 上から下へドラッグ時は中心より下、下から上へドラッグ時は中心より上で移動
    if (draggingIndex < hoverIndex && !isCursorBelowMiddle) return;
    if (draggingIndex > hoverIndex && isCursorBelowMiddle) return;

    // 配列のイミュータブルな並び替え（React 19 / モダンJS の toSpliced 利用）
    const nextItems = [...items];
    const [draggedItem] = nextItems.splice(draggingIndex, 1);
    nextItems.splice(hoverIndex, 0, draggedItem);

    setItems(nextItems);
    setDraggingIndex(hoverIndex);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '12px',
            margin: '4px 0',
            backgroundColor: draggingIndex === index ? '#e2e8f0' : '#f8fafc',
            border: '1px solid #cbd5e1',
            cursor: 'grab',
            opacity: draggingIndex === index ? 0.6 : 1,
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
};
```

### 3. ハマりどころ＆現代の知見
- **最大のアンチパターン：React管理下での `insertBefore` 直接操作**:  
  過去の実装では `dropzoneRef.current?.insertBefore(draggedElm, targetElm)` でDOMを直接並べ替えていました。これは**Reactの仮想DOMツリーと物理DOMが乖離し、その後のState更新で要素が重複・消失する致命的バグ**を引き起こします。DOMは絶対に直接触らず、`items` 配列の要素位置を入れ替えてReactに再描画させなければなりません。
- **非同期State参照の罠**:  
  `setDraggedElm(e.target)` を呼んだ直後の同関数内で `if (draggedElm)` を評価しても、古いState（`null`）を参照して動かない現象が発生します。IDやインデックスの数値で管理し、イベントハンドラ内のクロージャを活用します。
- **`getBoundingClientRect` による中心判定（良質なノウハウ）**:  
  `rect.top + rect.height / 2` を算出してカーソルY座標（`clientY`）と比較するアプローチは、項目のチラつき（フリッカー）を防ぐために非常に有用な幾何学計算です。

### 4. AI具現化プロンプト
```text
React 19 + TypeScriptで、外部ライブラリを使わずHTML5 Drag & Drop APIを用いた軽量なリスト並び替えコンポーネントを作成してください。
要件:
1. DOMの直接操作（insertBeforeやremoveChild等）は一切行わず、ReactのState配列の並び替えのみでレンダリングすること。
2. getBoundingClientRect() で項目の中心Y座標を算出し、カーソルが中心を超えたタイミングでスムーズに位置を入れ替えること。
3. ドラッグ中の要素には視覚的なフィードバック（透明度や背景色の変化）を付与すること。
```

---

## 04. カルーセル/スライダーのラッパー設計（SSR整合性担保）

- **最終検証日**: 2026-10-10
- **対象環境**: React 19 / Next.js 15+
- **概要**: Swiper等のDOM依存スライダーライブラリをNext.js App RouterやモダンReact環境で安全にラップし、SSRエラーやCLS（Layout Shift）を防ぐ構成。

### 1. 前提・設計思想
Swiper等のスライダーライブラリはブラウザの `window` やタッチイベントに強く依存します。Next.js App Router環境に導入する場合、適切な `'use client'` 分離と、マウント前のプレースホルダー（スケルトン）によるレイアウト崩れ対策が必須となります。

### 2. 最小実装コード
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// スタイルシートのインポート
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type SliderProps = {
  slides: { id: string; content: React.ReactNode }[];
};

export const SafeSlider: React.FC<SliderProps> = ({ slides }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR時のハイドレーション不整合およびCLS対策のスケルトン
  if (!isMounted) {
    return (
      <div style={{ width: '100%', height: '300px', backgroundColor: '#f1f5f9', borderRadius: '8px' }} />
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={slides.length > 1}
      style={{ width: '100%', height: '300px' }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>{slide.content}</SwiperSlide>
      ))}
    </Swiper>
  );
};
```

### 3. ハマりどころ＆現代の知見
- **CSS-in-JS と Swiper CSS の衝突**:  
  旧実装では `styled-components` と Swiper を混在させていましたが、App RouterのServer Component下ではランタイムCSS-in-JSが非推奨です。Tailwind CSS または Swiper標準のCSSインポートで完結させる構成が最も安全です。
- **現代の代替アプローチ**:  
  高度なタッチ挙動が不要な単純なスライダーであれば、Swiperを入れずにブラウザネイティブの `scroll-snap-type: x mandatory;` を活用した純粋なCSS実装や、バンドルサイズの極めて小さい `embla-carousel-react` の採用を検討する価値があります。

### 4. AI具現化プロンプト
```text
Next.js 15+ App Router環境で安全に動作する、Swiper（またはEmbla Carousel）を用いたスライダーコンポーネントを作成してください。
要件:
1. 'use client' 境界を適切に切り、SSR時のハイドレーションエラーを確実に防止すること。
2. マウント前の初期描画時にレイアウトシフト（CLS）が発生しないよう、アスペクト比または高さを固定したスケルトンを表示すること。
3. ナビゲーション矢印、ページネーション、自動再生のオプションをプロパティで制御可能にすること。
```

---

## 05. 神経衰弱ゲームとアクセシビリティ制御（`inert`属性の活用）

- **最終検証日**: 2026-10-10
- **対象環境**: React 19 / TypeScript 5+
- **概要**: 2枚のカードを選択して一致判定を行うゲームロジックにおいて、判定処理中の不要なクリック割り込みをHTML `inert` 属性で宣言的かつアクセシブルに遮断するパターン。

### 1. 前提・設計思想
カードめくりゲームやクイズUIでは、「2枚めくった直後の正誤判定中（アニメーション中）」に他のカードをクリックされたりフォーカス移動されると、判定ロジックが壊れます。  
これに対し `pointer-events: none` だけで制御するとキーボード操作やスクリーンリーダーがすり抜けます。**HTML標準の `inert` 属性を用いることで、ユーザー入力（クリック・キーボード・読み上げ）を丸ごと完全に非活性化**できます。

### 2. 最小実装コード
```tsx
import React, { useState } from 'react';

type Card = {
  id: number;
  pairId: number;
  label: string;
};

export const MemoryGame: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleCardClick = (card: Card) => {
    if (isProcessing || selectedIds.includes(card.id) || matchedIds.has(card.id)) return;

    if (selectedIds.length === 0) {
      // 1枚目選択
      setSelectedIds([card.id]);
    } else if (selectedIds.length === 1) {
      // 2枚目選択
      const firstCardId = selectedIds[0];
      const firstCard = cards.find((c) => c.id === firstCardId)!;
      setSelectedIds([firstCardId, card.id]);
      setIsProcessing(true); // 入力遮断開始

      setTimeout(() => {
        if (firstCard.pairId === card.pairId) {
          // ペアマッチ成功
          setMatchedIds((prev) => new Set(prev).add(firstCard.id).add(card.id));
        }
        // リセット
        setSelectedIds([]);
        setIsProcessing(false); // 入力遮断解除
      }, 800);
    }
  };

  return (
    // inert 属性を付与することで、判定中は配下全体がフォーカス・クリック不能になる
    <div
      inert={isProcessing ? true : undefined}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}
    >
      {cards.map((card) => {
        const isOpen = selectedIds.includes(card.id) || matchedIds.has(card.id);
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => handleCardClick(card)}
            disabled={matchedIds.has(card.id)}
            style={{
              height: '100px',
              fontSize: '24px',
              backgroundColor: isOpen ? '#e0f2fe' : '#334155',
              color: isOpen ? '#0369a1' : '#ffffff',
              borderRadius: '8px',
            }}
          >
            {isOpen ? card.label : '?'}
          </button>
        );
      })}
    </div>
  );
};
```

### 3. ハマりどころ＆現代の知見
- **`inert` 属性の先見性と現代のサポート状況**:  
  旧実装で `[inert]` 属性に注目していた点は極めて優れたアプローチです。現在 `inert` は全主要ブラウザで完全サポートされており、React 19 / モダンHTMLで標準属性として使用できます。
- **当時のアンチパターン（Stateの直接ミューテーション）**:  
  旧実装では `clickedCardNumbers.push(cardNumberStr)` や `clickedCardNumbers.splice(0, 1)` のようにState配列を直接破壊（ミューテーション）していました。Reactでは再レンダリングがスキップされたり不整合の原因になります。必ず `setSelectedIds([...])` や `new Set(prev)` のイミュータブルな更新を行います。
- **`alert()` での同期待機という悪癖**:  
  「Promiseで包んで `alert()` を呼ぶ」というハックがありましたが、`alert()` はブラウザ全体のJS実行を止めるためUX上禁止です。`isProcessing` フラグと `setTimeout`（またはアニメーションイベント）で宣言的に非同期制御するのが定石です。

### 4. AI具現化プロンプト
```text
React 19 + TypeScriptで、神経衰弱ゲームのロジックとUIコンポーネントを作成してください。
要件:
1. 2枚のカードをめくった判定待機時間中は、HTMLの inert 属性を用いてグリッド全体への入力（クリック・キーボード操作）を宣言的に遮断すること。
2. Stateの直接ミューテーションを排除し、イミュータブルなSetまたは配列操作で正解ペア（matchedIds）を管理すること。
3. alert() 等の同期的ポップアップは使用せず、CSSやメッセージ表示で進行状況を表現すること。
```

---

## 06. URL同期型ページネーション（App Router最適化）

- **最終検証日**: 2026-10-10
- **対象環境**: Next.js 15+ (App Router) / React 19
- **概要**: ページ番号をインメモリ（Context）ではなくURLクエリパラメータ（`?page=2`）で管理し、SSR・SEO・ブラウザ履歴（戻る/進む）と完全に同期させるページネーション設計。

### 1. 前提・設計思想
一覧画面のページネーションにおいて、ページ番号を React Context やローカル State に持たせると、**「リロードすると1ページ目に戻る」「URLを共有できない」「ブラウザの『戻る』で前ページに戻れない」**というWeb標準に反する挙動になります。  
URLのクエリパラメータを「Single Source of Truth（唯一の信頼できる情報源）」とする設計が不可欠です。

### 2. 最小実装コード
```tsx
// app/posts/page.tsx (Server Component)
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

const ITEMS_PER_PAGE = 10;

export default async function PostsPage({ searchParams }: Props) {
  const { page } = await searchParams; // Next.js 15+ では searchParams は Promise
  const currentPage = Math.max(1, Number(page) || 1);

  // サーバー側で直接データ取得
  const totalCount = 95; // 例: DBから取得した総件数
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      <h1>記事一覧 (ページ {currentPage} / {totalPages})</h1>
      {/* 記事一覧表示 */}

      {/* ページネーションUI */}
      <PaginationNav currentPage={currentPage} totalPages={totalPages} baseUrl="/posts" />
    </div>
  );
}

// サーバーレンダリング可能な軽量ナビゲーション
function PaginationNav({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '24px' }}>
      {prevPage ? (
        <Link href={`${baseUrl}?page=${prevPage}`}>前へ</Link>
      ) : (
        <span style={{ color: '#94a3b8' }}>前へ</span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          style={{
            fontWeight: p === currentPage ? 'bold' : 'normal',
            textDecoration: p === currentPage ? 'underline' : 'none',
          }}
        >
          {p}
        </Link>
      ))}

      {nextPage ? (
        <Link href={`${baseUrl}?page=${nextPage}`}>次へ</Link>
      ) : (
        <span style={{ color: '#94a3b8' }}>次へ</span>
      )}
    </nav>
  );
}
```

### 3. ハマりどころ＆現代の知見
- **Next.js 15 における非同期 `searchParams` の仕様変更**:  
  Next.js 14までは `searchParams.page` で同期アクセスできましたが、**Next.js 15以降は `searchParams` が Promise に変更されました**（`const { page } = await searchParams`）。旧コードのまま同期アクセスするとランタイムエラーまたは型エラーになります。
- **Contextによるページネーションのアンチパターン**:  
  旧実装（`the-pagination`）では `PagerContext` を介してページ番号やオフセットを管理していました。しかしクライアント側でリンク遷移（`<Link href="?page=2">`）させるだけで、サーバーコンポーネントが自動的に最新パラメータを受け取ってSSRできるため、Contextは完全に不要です。
- **検索条件との併用**:  
  カテゴリやソート順など他のクエリパラメータが存在する場合、現在のクエリを維持しながら `page` だけを書き換えるためにクライアント側では `URLSearchParams` またはライブラリ `nuqs` の活用が推奨されます。

### 4. AI具現化プロンプト
```text
Next.js 15+ App Router環境で、URLクエリパラメータ（?page=N）と完全に同期するページネーション機能を実装してください。
要件:
1. page.tsx は Server Component とし、Next.js 15の非同期 searchParams (Promise<{ page?: string }>) を正しく await してページ番号を取得すること。
2. ページ番号の管理に React Context やローカルStateを使わず、Next.jsの <Link> によるクエリ付きURL遷移で完結させること。
3. 存在しないページ番号（0以下や最大ページ超え）が指定された場合の安全なフォールバックを設けること。
```
