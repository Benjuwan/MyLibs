# Next.js App Router 設計ナレッジカタログ

本ドキュメントは、Next.js App Router におけるアーキテクチャ設計・通信・エラーハンドリングについて、初期バージョン（Next 13）から最新（Next 15+ / 16）への進化の歴史を踏まえ、**実務で通用する堅牢な実装パターン**として再編したリファレンス集です。

---

## 目次
- [07. RSC vs Client Component の境界設計（誤解の完全解消）](#07-rsc-vs-client-component-の境界設計誤解の完全解消)
- [08. App Routerのデータ取得とキャッシュ戦略（Next 13からNext 15+への変遷）](#08-app-routerのデータ取得とキャッシュ戦略next-13からnext-15への変遷)
- [09. 内部APIフェッチのアンチパターン是正（HTTP自己呼び出しの排除）](#09-内部apiフェッチのアンチパターン是正http自己呼び出しの排除)
- [10. エラーハンドリングと境界コンポーネント（`error.tsx` / `not-found.tsx`）](#10-エラーハンドリングと境界コンポーネントerrortsx--not-foundtsx)

---

## 07. RSC vs Client Component の境界設計（誤解の完全解消）

- **最終検証日**: 2026-10-10
- **対象環境**: Next.js 15+ (App Router) / React 19
- **概要**: React Server Component (RSC) と Client Component の境界線の引き方、`'use client'` の伝播ルールとバンドルサイズ最適化。

### 1. 前提・設計思想
App Router では「デフォルトが Server Component」です。状態（`useState`）やイベントハンドラ（`onClick`）、ブラウザAPI（`window`）を扱う場合にのみ `'use client'` を宣言します。  
初心者が陥りがちな「画面全体を `'use client'` にしてしまう」設計を排し、クライアントJSの配信量を最小限に抑える**リーフコンポーネント（末端）分離設計**を確立します。

### 2. 最小実装コード
```tsx
// app/articles/[id]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { LikeButton } from './LikeButton'; // Client Component

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15+ は Promise
}) {
  const { id } = await params;
  const article = await db.article.findUnique({ where: { id } });

  if (!article) notFound();

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1>{article.title}</h1>
      <div>{article.content}</div>

      {/* インタラクションが必要な末端パーツのみ Client Component に委譲 */}
      <LikeButton articleId={article.id} initialLikes={article.likes} />
    </article>
  );
}

// app/articles/[id]/LikeButton.tsx (Client Component)
'use client';

import { useState } from 'react';

export function LikeButton({
  articleId,
  initialLikes,
}: {
  articleId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    setLikes((prev) => prev + 1);
    // Server Action または API 呼び出し
  };

  return (
    <button type="button" onClick={handleLike}>
      👍 いいね ({likes})
    </button>
  );
}
```

### 3. ハマりどころ＆現代の知見
- **「苗字」の比喩と誤解の是正**:  
  学習ノートに「*use client は苗字のようなもので、親で宣言していれば子も全てクライアントになり、子で宣言するとエラーになる*」という記述がありましたが、これは正確ではありません。
  1. 親が `'use client'` の場合、その親が直接インポートしている子コンポーネントは**自動的にクライアントモジュールとしてバンドル**されます。
  2. 子コンポーネント側で明示的に `'use client'` と書いても**エラーにはなりません（無害ですが冗長）**。
- **Client Component の中に Server Component を埋め込む手法（Slot / `children`）＝`Composition Pattern`（コンポジションパターン）と呼ばれるもの**:  
  Client Component から Server Component を直接 `import` することはできませんが、**`children` などの props 経由で渡せば、Client Component の内側に Server Component をネストできます**。
  ```tsx
  // Server Component から親と子を組み立てる
  <ClientModal>
    <ServerRenderedUserList />
  </ClientModal>
  ```
- **ランタイムCSS-in-JS（`styled-components`）の制約**:  
  Server Component ではランタイムでのCSS生成・注入が動作しません。Tailwind CSS、CSS Modules、Vanilla Extract などのゼロランタイム・ビルド時抽出スタイルを採用するのが標準です。

### 4. AI具現化プロンプト
```text
Next.js 15+ App Routerで、RSC（Server Component）と Client Component を最適に分離したページコンポーネントを作成してください。
要件:
1. page.tsx は Server Component とし、非同期 params を await してサーバー側でデータを直接フェッチすること。
2. クリックイベントやローカル状態を持つボタン・フォームのみを独立した 'use client' コンポーネントに切り出すこと。
3. 重大なレイアウト・データ表示部分はサーバーレンダリングを維持し、クライアント用JSバンドルを肥大化させないこと。
```

---

## 08. App Routerのデータ取得とキャッシュ戦略（Next 13からNext 15+への変遷）

- **最終検証日**: 2026-10-10
- **対象環境**: Next.js 15+ / Next.js 16
- **概要**: Next.js 13時代と15以降で180度転換されたキャッシュ仕様の正確な把握と、適切なキャッシュ粒度・再検証（Revalidation）の設計。

### 1. 前提・設計思想
Next.js 13導入時、`fetch` はデフォルトで `force-cache`（永続キャッシュ）され、多くの開発者が「意図せず古いデータが表示され続ける」トラブルに直面しました。  
これを受け、**Next.js 15以降は「デフォルトで非キャッシュ（`no-store` 相当）」へと仕様が変更**されました。現代のNext.jsでは「キャッシュしたいリクエストのみを明示的に指定する」アプローチが基本原則です。

### 2. 最小実装コード
```tsx
// 1. キャッシュしない（Next 15+のデフォルト挙動 / SSR相当）
// 更新頻度が高いデータ、ユーザー固有データ
export async function getLiveRates() {
  const res = await fetch('https://api.example.com/rates');
  return res.json();
}

// 2. 時間ベースでキャッシュ（ISR相当）
// 一定期間同じ内容でよいデータ（例: ブログ記事一覧、静的マスターデータ）
export async function getArticles() {
  const res = await fetch('https://api.example.com/articles', {
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });
  return res.json();
}

// 3. オンデマンド再検証（タグベース）
// CMSで記事が更新されたタイミングでWebhookから即時パージする
export async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { tags: [`product-${id}`, 'products'] },
  });
  return res.json();
}

// 再検証を実行する Server Action または Route Handler 例
import { revalidateTag } from 'next/cache';

export async function clearProductCache(id: string) {
  'use server';
  revalidateTag(`product-${id}`);
}
```

### 3. ハマりどころ＆現代の知見
- **Next 13時代の記述とのギャップ**:  
  旧READMEにある `fetch(URL, { cache: 'force-cache' }); // デフォルトなので省略可能` という記述は、**Next 15以降では誤り**です。省略するとキャッシュされません。静的キャッシュを効かせたい場合は明示的に `{ cache: 'force-cache' }` を指定する必要があります。
- **ISRにおける「1回目のアクセス」の挙動**:  
  学習ノートに「*指定時間経過後の1回目のアクセスでは古いデータが表示され、その裏で再生成されて2回目以降に新しいデータが表示される*」と記録されていた通り、これが**SWR（Stale-While-Revalidate）モデルの正常な挙動**です。即時性を求める場合は `revalidateTag` によるオンデマンド再検証を使用します。
- **`unstable_cache` から `use cache` への将来動向**:  
  DB直接クエリをキャッシュするための `unstable_cache` に加え、Next 15ではコンポーネントや関数単位で宣言的にキャッシュを指定する `'use cache'` ディレクティブ（実験的フラグ）が整備されつつあります。

### 4. AI具現化プロンプト
```text
Next.js 15+ 環境でのデータ取得関数を作成してください。
要件:
1. Next.js 15のキャッシュデフォルト（非キャッシュ）を理解した上で、記事一覧は1時間キャッシュ（revalidate: 3600）、記事詳細はタグベースキャッシュ（tags: ['article-${id}']) を設定すること。
2. 記事更新時に特定のタグのみを無効化する Server Action (revalidateTag) を実装すること。
3. fetch が使えないORM/DB直接接続クエリのキャッシュアプローチ（unstable_cache）も併記してください。
```

---

## 09. 内部APIフェッチのアンチパターン是正（HTTP自己呼び出しの排除）

- **最終検証日**: 2026-10-10
- **対象環境**: Next.js 15+ (App Router)
- **概要**: Server Component の中から同一アプリの Route Handler（`/api/...`）を `fetch` してしまうアンチパターンを排除し、内部関数直接実行および Server Actions に置き換える設計。

### 1. 前提・設計思想
Pages Router（`pages/api`）から移行した開発者が最も頻繁にやってしまう悪手が、**「Server Component から自分自身の `/api/article` を HTTP `fetch` する」**ことです。  
サーバー内で動いている処理が、わざわざ自分自身のWebサーバーにHTTPリクエストを投げるのは無駄なオーバーヘッド（ネットワークレイテンシ、ソケット消費、ドメイン解決問題）を生むだけです。

### 2. 最小実装コード（アンチパターン vs 現代の正解）

#### ❌ アンチパターン（旧コードで書かれていた形式）
```tsx
// app/page.tsx
export default async function Home() {
  // サーバーコンポーネントから自分自身をfetch（非効率・環境変数依存で壊れやすい）
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/article`, { cache: 'no-store' });
  const articles = await res.json();
  return <ArticleList articles={articles} />;
}
```

#### ⭕ 現代の正解（データ取得ロジックの共有関数化）
```tsx
// lib/articles.ts（サーバー専用のデータ取得レイヤー）
import 'server-only'; // クライアントからの誤インポートをビルド時に弾く安全ガード
import { supabase } from '@/utils/supabaseClient';

export async function getArticles() {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// app/page.tsx (Server Component)
import { getArticles } from '@/lib/articles';

export default async function Home() {
  // HTTPを経由せず、直接関数を呼ぶ（超高速・ベースURL問題皆無）
  const articles = await getArticles();
  return <ArticleList articles={articles} />;
}

// app/api/article/route.ts (外部公開APIが必要な場合のみ薄いラッパーとして定義)
import { getArticles } from '@/lib/articles';
import { NextResponse } from 'next/server';

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json(articles);
}
```

### 3. ハマりどころ＆現代の知見
- **デプロイ時（Vercel / Docker）のベースURL死**:  
  Server Component 内で `fetch('/api/article')` のように相対パスを書くと Node.js ランタイムが解釈できず `Invalid URL` エラーで即死します。そのため `process.env.NEXT_PUBLIC_APP_URL` 等を繋げるハックが必要になりますが、CI/CD環境やプレビュー環境ごとにURLが変わりバグの温床になります。**直接関数呼び出しにすればベースURL自体が不要**です。
- **データ更新時の Server Actions 活用**:  
  データの作成・更新・削除（POST/PUT/DELETE）も、フォームから `/api/...` に送信するのではなく、`'use server'` で定義した Server Action を呼ぶことで、API Route を書く工数そのものを丸ごと削減できます。
- **`server-only` パッケージの導入**:  
  DBクライアントや秘匿キーを含む関数ファイルに `import 'server-only'` を1行書いておくと、誤って Client Component からインポートされた際にビルドエラーにしてくれます。

### 4. AI具現化プロンプト
```text
Next.js 15+ App Routerで、Server Component からのデータ取得および更新機能を実装してください。
要件:
1. Server Component から同一プロジェクト内の Route Handler を HTTP fetch するアンチパターンを完全に排除すること。
2. データ取得ロジックは lib/ 配下の 'server-only' 関数として集約し、page.tsx から直接呼び出すこと。
3. データの作成・更新は Route Handler ではなく Server Action ('use server') を用いて実装し、処理完了後に revalidatePath で画面を再描画すること。
```

---

## 10. エラーハンドリングと境界コンポーネント（`error.tsx` / `not-found.tsx`）

- **最終検証日**: 2026-10-10
- **対象環境**: Next.js 15+ (App Router)
- **概要**: `error.tsx` と `not-found.tsx` の正しい設置ルール、`reset()` によるセグメント復旧、およびルートレイアウト障害に対応する `global-error.tsx` の設計。

### 1. 前提・設計思想
App Router のファイルシステムベースのエラーハンドリングは、React の Error Boundary を自動構築します。  
`page.tsx` やその配下で例外が発生した際、画面全体を真っ白（クラッシュ）にすることなく、該当セグメントのみにエラーUIを表示してユーザーに再試行を促す仕組みを安全に実装します。

### 2. 最小実装コード
```tsx
// app/articles/error.tsx (必須: 'use client')
'use client';

import { useEffect, startTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Sentry等のログ収集サービスへエラー通知
    console.error('Captured by error.tsx:', error);
  }, [error]);

  const handleRetry = () => {
    // サーバーコンポーネントの再フェッチとクライアント再レンダリングを同期実行
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <div style={{ padding: '24px', border: '1px solid #f87171', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
      <h2 style={{ color: '#b91c1c' }}>記事の読み込み中にエラーが発生しました</h2>
      <p style={{ color: '#7f1d1d' }}>{error.message || '予期せぬエラーが発生しました。'}</p>
      {error.digest && <small style={{ color: '#991b1b' }}>エラーID: {error.digest}</small>}
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={handleRetry}
          style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
```

```tsx
// app/not-found.tsx (404 ページ)
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '48px' }}>
      <h2>お探しのページは見つかりませんでした</h2>
      <p>URLが間違っているか、既に削除された可能性があります。</p>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
        トップページに戻る
      </Link>
    </div>
  );
}
```

### 3. ハマりどころ＆現代の知見
- **`error.tsx` は `'use client'` が絶対必須**:  
  Error Boundary は React のクラスコンポーネント（クライアント側ライフサイクル）を内部で使用しているため、`'use client'` がないと Next.js のビルドで弾かれます。
- **`reset()` だけではサーバーエラーから復帰できない問題（重要ノウハウ）**:  
  旧コードでは単に `onClick={reset}` と書かれていました。しかし**サーバーコンポーネントでDB接続エラー等が発生した場合、`reset()` だけを呼んでもサーバー側の再フェッチが走らず、エラーが再発して復帰できません**。`startTransition(() => { router.refresh(); reset(); })` と記述することで、サーバーデータの最新取得とクライアントError Boundaryのリセットが両方実行され、正しく復帰します。
- **同一ディレクトリの `layout.tsx` のエラーは拾えない**:  
  `app/articles/error.tsx` は `app/articles/layout.tsx` で発生したエラーをキャッチできません（`error.tsx` は `layout.tsx` の「内側」に配置されるため）。ルートレイアウト自体のクラッシュには `app/global-error.tsx`（`<html>` と `<body>` を含む独自エラー画面）を定義する必要があります。

### 4. AI具現化プロンプト
```text
Next.js 15+ App Routerで、堅牢なエラーハンドリング機構（error.tsx, not-found.tsx）を作成してください。
要件:
1. error.tsx は 'use client' を宣言し、Server Component の再取得も含めて確実に復旧できるよう router.refresh() と reset() を startTransition 内で併用すること。
2. 本番環境向けに error.digest を表示し、外部監視サービスへの通知ロジックを配置すること。
3. 同一ディレクトリの layout.tsx を保護するためのエラー設計（上位階層への配置、global-error.tsx の要否）を考慮すること。
```
