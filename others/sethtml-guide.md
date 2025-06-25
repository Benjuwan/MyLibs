# setHTML系メソッドとShadow DOMの総まとめ

<!-- 
メタデータ:
- 作成日: 2025-06-19
- バージョン: 1.3
- 対象ブラウザ: 最新のブラウザサポート状況に基づく
-->

## 概要
このドキュメントは、HTML挿入における新しいWeb標準API群（setHTMLUnsafe、Sanitizer API）とShadow DOM技術の実用的な利用方法をまとめたものです。

**現在の推奨アプローチ**: `setHTMLUnsafe() + Sanitizer API`

**対象読者**: Webフロントエンド開発者、セキュリティを重視するプロジェクト担当者

**重要ポイント**: 
- セキュリティを重視したHTML挿入の実現
- 宣言的Shadow DOMによるコンポーネント開発
- 全モダンブラウザでの実用化（2024年完了）

---

## 目次

1. [HTML挿入メソッドの比較](#html挿入メソッドの比較)
2. [各メソッドの詳細仕様](#各メソッドの詳細仕様)
3. [Sanitizer API](#sanitizer-api)
4. [Shadow DOM と Web Components](#shadow-dom-と-web-components)
5. [宣言的Shadow DOM](#宣言的shadow-dom)
6. [ブラウザサポート状況](#ブラウザサポート状況)
7. [実装パターンと移行戦略](#実装パターンと移行戦略)
8. [参考情報](#参考情報)

---

## HTML挿入メソッドの比較

### セキュリティレベル階層

```
最高セキュリティ ←--------------------------------→ 最低セキュリティ
    `setHTML()`    >  `setHTMLUnsafe() + Sanitizer API`  >  `innerHTML + 自前処理`
```

### 現実的優先度（2025年現在）

```
推奨順位: `setHTMLUnsafe() + Sanitizer API` > `innerHTML + 自前処理` > `setHTML()`（将来的）
```

**理由**: `setHTML()`は現在使用不可、Sanitizer APIは全ブラウザで未対応

---

## 各メソッドの詳細仕様

### setHTMLUnsafe() メソッド ✅ 利用可能

| 項目 | 詳細 |
|------|------|
| **ステータス** | ✅ 利用可能（モダンブラウザ） |
| **XSS安全性** | ⚠️ 外部ライブラリ併用で安全 |
| **宣言的Shadow DOM** | ✅ サポート |
| **実用性** | ✅ 高い |

```javascript
// 実用的使用パターン
element.setHTMLUnsafe(DOMPurify.sanitize(html));
```

### setHTML() メソッド ❌ 未対応

| 項目 | 詳細 |
|------|------|
| **ステータス** | 🚫 未実装（標準化プロセス中） |
| **ブラウザサポート** | ❌ Firefox（フラグ付き）のみ |
| **実用性** | ❌ 使用不可 |

### innerHTML プロパティ ⚠️ 従来方式

| 項目 | 詳細 |
|------|------|
| **ステータス** | ✅ 従来からサポート |
| **XSS安全性** | ❌ 保証なし |
| **宣言的Shadow DOM** | ❌ 非サポート |

---

## Sanitizer API

HTMLコンテンツのサニタイゼーション（無害化）を行うWeb標準API。**setHTMLUnsafe()使用時は必須**。

### 基本的な設定例

```javascript
// セキュアな設定
const sanitizer = new Sanitizer({
  allowElements: ["div", "p", "span", "strong", "em", "a"],
  allowAttributes: {
    "*": ["class", "id"],
    "a": ["href"]
  },
  blockElements: ["script", "iframe", "object"]
});

element.setHTMLUnsafe(html, { sanitizer });
```

### セキュリティレベル別設定

```javascript
// 厳格設定（最高セキュリティ）
const strict = new Sanitizer({
  allowElements: ["p", "strong", "em"],
  allowAttributes: { "*": ["class"] }
});

// 標準設定（バランス重視）
const standard = new Sanitizer({
  allowElements: ["div", "p", "span", "strong", "em", "a", "img"],
  allowAttributes: {
    "*": ["class", "id"],
    "a": ["href"],
    "img": ["src", "alt"]
  }
});
```

---

## Shadow DOM と Web Components

### Shadow DOMとは

**任意のWebコンポーネントを作成するための技術**

> **Webコンポーネント定義**: 任意のタグ名で囲ってその中でスタイリングや要素構成を行うモノ

### カプセル化の仕組み

| 機能 | 説明 | 利点 |
|------|------|------|
| **スタイル分離** | Shadow DOM内CSSが外部に影響しない | CSSの名前空間汚染防止 |
| **DOM構造隠蔽** | 内部実装を外部から隠す | コンポーネントの独立性 |
| **名前空間分離** | IDやクラス名の衝突を防ぐ | 再利用性の向上 |

### 基本実装

```javascript
// パターン1: 基本的なCustom Element
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        :host { display: block; padding: 1rem; }
        .content { color: #333; }
      </style>
      <div class="content"><slot></slot></div>
    `;
  }
}

customElements.define('my-component', MyComponent);
```

### 利点

- **スタイル分離**: 外部CSSの影響を受けない
- **DOM構造隠蔽**: 内部実装の独立性
- **再利用性**: コンポーネントとして再利用可能

---

## 宣言的Shadow DOM

JavaScript不要でHTMLのみでShadow DOMを定義する機能。**主要ブラウザで対応済み**。

### 基本構文

```html
<親要素>
  <template shadowrootmode="open|closed">
    <!-- Shadow DOM コンテンツ -->
    <style>/* カプセル化されたCSS */</style>
    <div><!-- DOM構造 --></div>
    <slot><!-- 外部コンテンツ挿入ポイント --></slot>
  </template>
  <!-- Light DOM コンテンツ -->
</親要素>
```

- 具体例
```html
<host-element>
  <template shadowrootmode="open">
    <style>h1 { color: blue; }</style>
    <h1>Hello Shadow DOM</h1>
    <slot></slot>
  </template>
  <p>Light DOM content</p>
</host-element>
```

### 重要な制限

```javascript
// ❌ 動作しない
element.innerHTML = '<template shadowrootmode="open">...</template>';

// ✅ 動作する
element.setHTMLUnsafe('<template shadowrootmode="open">...</template>');
```

### 利点

- **SSR対応**: サーバーサイドレンダリング可能
- **JavaScript不要**: HTMLパースのみで動作
- **SEO改善**: 初期HTMLに構造が含まれる

---

## ブラウザサポート状況

### setHTMLUnsafe()

| ブラウザ | 対応状況 |
|----------|----------|
| Chrome | ✅ 対応済み（モダンverのみ） |
| Edge | ✅ 対応済み（モダンverのみ） |
| Firefox | ✅ 対応済み（モダンverのみ） |
| Safari | ✅ 対応済み（モダンverのみ） |

### Sanitizer API

| ブラウザ | 対応状況 | 備考 |
|----------|----------|------|
| Chrome | ❌ 未対応 | 標準化待ち |
| Edge | ❌ 未対応 | Chrome準拠 |
| Firefox | ❌ 未対応 | フラグ付きでも無効 |
| Safari | ❌ 未対応 | 標準化待ち |

### 宣言的Shadow DOM

| ブラウザ | `shadowrootmode` | 備考 |
|----------|------------------|------|
| Chrome | ✅ 対応済み | 安定版で利用可能 |
| Edge | ✅ 対応済み | Chrome準拠 |
| Firefox | ✅ 対応済み | 最新版で対応 |
| Safari | ✅ 対応済み | 最新版で対応 |

### setHTML()

全ブラウザで未対応（Firefox フラグ付きのみ）

---

## 実装パターンと移行戦略

### 段階的移行プラン

#### フェーズ1: 現在（2024年）

```javascript
// 主流アプローチ
if (typeof element.setHTMLUnsafe === 'function') {
  // モダンブラウザ
  element.setHTMLUnsafe(html, { sanitizer: sanitizerConfig });
} else {
  // フォールバック
  element.innerHTML = sanitizeHTML(html); // 自前処理
}
```

#### フェーズ2: 近い将来（2025-2026年）

```javascript
// setHTMLUnsafe + Sanitizer が主流に
element.setHTMLUnsafe(html, { sanitizer });
```

#### フェーズ3: 将来（2027年以降）

```javascript
// setHTML() が安定化した時点
element.setHTML(html);
```

### 移行ロードマップ（簡潔版）

- **近い将来（2025-2026年）**: setHTMLUnsafe + Sanitizer API（Sanitizer API対応状況を継続監視）
- **将来（2027年以降）**: setHTML()とSanitizer API標準化完了後に移行検討

## 参考情報
- [Sanitizer APIのその後](https://www.mitsue.co.jp/knowledge/blog/frontend/202407/04_0815.html)
> - Element.setHTMLメソッドの引数に指定する<br>
> - Sanitizer APIを直接使う<br>
> このうち後者のSanitizer APIを直接使う方法は、仕様から削除されました。

---

## 更新履歴

| 日付 | バージョン | 更新内容 |
|------|------------|----------|
| 2025-06-19 | 1.3 | ブラウザサポート状況を正確な情報に修正、推奨実装パターン更新 |
| 2025-06-19 | 1.2 | 可読性向上のため簡潔化、概要セクション追加 |
| 2025-06-19 | 1.1 | ブラウザサポート状況更新、推奨順位修正 |
| 2025-06-19 | 1.0 | 初回作成 |