# 関数で作るか、オブジェクト（クラス）で作るかという悩み
「両者の使い分け」についての疑問。<br>
例えば、ある処理を実装したいと思った時にそれをオブジェクトで作るか、関数で作るかという話です。<br>
AIと協業する中で、彼らにタスクを依頼する際の**実装アプローチ（＝設計）が重要**だと感じたため、今回の疑問を抱くに至りました。

## オブジェクト指向と関数コンポーネント指向
初めに、私は「オブジェクト指向」や「（関数）コンポーネント指向」を以下のように捉えています。

- オブジェクト指向 （OOP：`Object-Oriented Programming`）<br>
データや振る舞い、属性といったものを一塊にして、それらを自由・柔軟に組み合わせてシステム・プログラムを効率的に構築していく手法や概念
- 関数コンポーネント指向 （`Functional Programming Oriented`）または 関数型プログラミング (FP:`Functional Programming`) のアプローチ<br>
各種機能や描画処理などをパーツごとに分割するイメージで、それらを自由・柔軟に組み合わせてシステム・プログラムを効率的に構築していく手法や概念

上記の通り「自由・柔軟に組み合わせて効率的に構築するという部分（＝自由に使いまわせる特性）が両者共通」という前提のもとでは、私は慣れ親しんでいる関数（コンポーネント指向）で普段作成するのですが、明確にオブジェクト（指向）の場合が良いケースとはどういったものでしょうか？<br><br>

例えば、カプセル化は両者ともに似た性質で、継承については少し異なりますが`TypeScript`では`extends（構造的部分型の制約）`がありますし、ポリモーフィズムについても`props`や引数に渡す実引数でどうにかできそうです。<br>
（※補足： 継承はクラス特有ですが、`TypeScript`の`構造的部分型`の恩恵により、`implements`キーワードを使ったり、オブジェクトリテラルの型を定義したりすることで、クラスを使わなくてもポリモーフィズムに近い振る舞いを実現できます）

## 色々な実装例を経て得た見解
### 色々な実装例
1. 状態の変化が複雑な場合
```ts
// 関数だと状態管理が煩雑
function processOrder(order, action) { /* 毎回全状態を渡す必要 */ }

// オブジェクトなら状態を内包
class Order {
  private status: OrderStatus;
  ship() { /* 内部状態を自然に変更 */ }
  cancel() { /* 状態遷移のルールを内包 */ }
}
```

2.  複数の関連する操作がある場合
```ts
// 関数だと操作が散らばる
calculateTax(user, items)
applyDiscount(user, items)
generateInvoice(user, items)

// オブジェクトなら操作をまとめられる
class Invoice {
  calculateTax() { }
  applyDiscount() { }
  generate() { }
}
```

3. 異なる実装を統一インターフェースで扱う場合
```ts
// 決済方法が複数ある場合
interface PaymentProcessor {
  process(amount: number): Promise<void>;
}

class CreditCardProcessor implements PaymentProcessor { }
class PayPalProcessor implements PaymentProcessor { }
// 呼び出し側は実装を意識しない
```

4. 複雑な状態とロジックを持つ「ドメインモデル」
```ts
// カスタムフックで実装する例
function useShoppingCart() {
  const [items, setItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const addItem = (product, quantity) => {
    // items配列を更新するロジック...
  };

  const removeItem = (productId) => {
    // items配列を更新するロジック...
  };
  
  // 合計金額の計算はuseMemoを使う
  const totalPrice = useMemo(() => {
    // itemsとcouponから合計金額を計算する複雑なロジック...
  }, [items, appliedCoupon]);

  return { items, addItem, removeItem, totalPrice, /* ...他の値や関数 */ };
}
```

5. 「継承」による差分プログラミングが有効な場合
```ts
class User {
  name: string;
  constructor(name: string) { this.name = name; }
  login() { console.log(`${this.name}がログインしました`); }
}

class PremiumUser extends User {
  // 振る舞いの追加
  usePremiumFeature() {
    console.log("プレミアム機能を使いました！");
  }

  // 振る舞いの上書き（オーバーライド）
  override login() {
    super.login(); // 親のlogin()も呼び出す
    console.log("プレミアムユーザー特典があります！");
  }
}
```

---

### 得た見解
確かにクラス（オブジェクト）として一元管理できるのは魅力的だが、責務分離を考慮すると個別に用意したほうが良い気もする……。<br>
また、疎結合を意識して、結局外部から処理に必要なデータを渡すのであれば、やはり大きな違いは無いのでは？<br>
あと、一元管理の利点を一旦差し置いて、関数ロジックの肥大化が問題というなら各処理をさらに細かいフック（プライベートメソッドなど）に分けて責務分離を実施することで疎結合かつテスタビリティも向上しそう。

### 結論
クラス（オブジェクト）によるインスタンス生成や管理と、Stateなどの生成・管理や再レンダリング処理などパフォーマンスや処理負荷の面は無視できるレベルであり、<br>
責務分離を意識過ぎてもコード全体の把握・理解しやすさが損なわれる可能性があるため、**各ロジックやデータ、属性など暗黙的部分**を**明確に所有しているラッパー（親）部分がクラス（オブジェクト）である** というように直感的理解できるクラス（オブジェクト）のほうが場合によってはベター。<br>
継承に関しても直近の説明と同様、合成/コンポジション（疎結合的なアプローチ）より継承（密結合的なアプローチ）のほうがベターなケースもある（※一般的には「継承より合成（`favor composition over inheritance`）」という言説が多いそう）

## 実用的な使い分けの参考例
- 初期フェーズは関数と型だけで構築（柔軟性とスピード重視）
- 共通パターンが見えてきたらクラスや抽象クラスで整理
- フローが分かりにくくなったら「意味単位」でグルーピング（OOP的まとめ）

上記はあくまで参考であり、環境やスケジュール、チームの状況などを考慮したトレードオフのもと選定するのが一番重要

---
