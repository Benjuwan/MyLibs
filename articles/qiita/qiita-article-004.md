---
title: Netlify、Vercel、GitHub Pages の商用利用や使用量の上限を超えた時の情報をまとめてみた
tags: Netlify Vercel 初心者 GithubPages
author: benjuwan
slide: false
---
### はじめに
**無料**で、**それなりの規模感・機能（自動SSLや独自のフォーム機能などあれば尚良し）** で、**かんたん**で、**広告とかは勝手に載せてほしくなくて**といったざっくりした希望かつワガママを聞いてくれるホスティングサービスどこかにいませんかぁ〜。という心境のもと情報を集めてみました。

### ホスティングサービス
当然ですが**無料**を軸に調べると少ないですよね。
国内では『さくら』や『ロリポップ』、『エックスサーバー』など多種多様なホスティングサービスがありますが、お試し期間を抜きにした純粋な無料プランを用意しているところは多くないと思います。

::: note info
国内すべてのホスティングサービスを調べきれているわけではないので、もし「国内だとここもオススメだよ」とかありましたらコメントで教えていただきますとありがたいです！
:::

最近、ちょっとした個人開発や小規模なプロジェクトでは『Netlify』や『Vercel』など海外のホスティングサービスを選ぶ方も少なくないと聞きます。
しかも調べるうちに、海外のものは「容量もそこそこあってSSLにも対応してくれている！まさにこれだ！」と感じました。

ただ、海外のサービスだと情報は基本的に英語ですし、筆者的には **急に高額な請求が来たら恐ろしい** とか **そもそも無料で商用利用ってできるの？** とか **無料含む各プランの使用制限や上限を超えた時ってどうなるの？** とか色々疑問ないし不安が多かったのです。
情報収集する中で丁寧に説明してくださっている日本語サイトやページもあったのですが情報が少し古かったりして……「やはり一次情報がほしいな」と思って調べても目的の情報に辿り着くのに時間がかかりました。
そこで今回、自分でまとめてみようと筆を取った次第です。

筆者のように色々な懸念点から利用や情報収集が億劫になっている方々にとって少しでも役に立てるような記事にできればと思っております。
筆者が既に使用している『Netlify』のみならず、他の『Vercel』や『GitHub Pages』についても情報収集したので備忘録がてら残していきます。

::: note info
今回のホスティングサービス情報収集からは国内組を以下のような理由で割愛させていただきます。
例えば、『エックスサーバー』にも無料プラン（[Xfree：エックスフリー](https://www.xfree.ne.jp/)、[wpX Blog](https://www.wpxblog.jp/)がありますが、Xfree ではプランの種類によっては下記のように[3ヶ月ごとに利用しないといけなかったり、利用関係なく広告が掲載されたり](https://www.xfree.ne.jp/manual/man_ad_intro.php)します。
> エックスフリーの「PHP・MySQLサーバー機能」、「WordPress機能」、および3ヶ月以上ご利用の無い「HTMLサーバー機能」のアカウント(※)においては、スマートフォンおよびタブレット端末からのアクセス時のみ、ご利用のサイトページ上に、所定の広告が自動挿入されます。(※)ファイルマネージャーやFTPソフトから更新を行うことで表示されなくなります。

wpX Blog でも、[スマートフォンでの閲覧時のみ広告が表示](https://www.wpxblog.jp/service/pro.php)されるようです（※機能比較表の下部に記載があります）。
:::

2023/10：追記

::: note warn
上で紹介している『Xfree：エックスフリー』は『[シン・クラウド for Free](https://www.xfree.ne.jp/)』というサービスがスタートしたことで**新規申込の受付が終了**しているようです。
余談ですが『[シン・クラウド for Free](https://www.xfree.ne.jp/)』は、広告は付かないしサービス内容も魅力あるものだと感じました。ただし、上級者向けだそうでサポートなどは無いようです。
:::
https://www.xfree.ne.jp/old/news_detail.php?view_id=2191

### まずは結論
無料で、商用利用も考えているなら『Netlify』がベター！
『Vercel』の無料プラン（Hobby）や『GitHub Pages』では商用利用ができません。

商用利用を特に考えていない場合は各サービスの特徴をはじめ「使い勝手が良さそうと思えたほう」など自分にあったものを選ばれると良いと思います。
とはいえ『Vercel』も『GitHub Pages』も設定自体はとても簡単そうで、設定やデプロイ方法に関しては日本語の情報も数多くあるのであまり身構える必要はないかと思います。~~（かくいう筆者は現在『Netlify』しか使っていないので偉そうに言えませんが……）~~（本記事執筆後に`Vercel`を個人開発で利用しています）

次に、各サービス別に説明していきます。
必要に応じて下記URLフラグメントをご利用ください。

### 各サービス項目へのジャンプ
◎ [Netlify](#netlify)
◎ [Vercel](#vercel)
◎ [GitHub Pages](#github-pages)
◎ [おまけ Firebase](#おまけ-firebase)
◎ [まとめ](#まとめ)

### Netlify
『Netlify』のチャットボットアシスタント（[Ask Netlify](https://docs.netlify.com/ask-netlify/)）に尋ねた内容が以下です。
![netlify001.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/b5feb746-681e-ed3f-f1e8-8130005b77cf.png)

- Can we use Netlify free plan for commercial purposes?（Netlify free planを商用利用することはできますか？）
> Yes, you can use the Netlify free plan for commercial purposes. However, be aware that the free plan has various usage limits, and if you exceed those limits, it will no longer be free. You can find the limits on the Pricing page.（はい、Netlifyのフリープランは商用利用が可能です。ただし、無料プランには様々な使用制限があり、その制限を超えると無料ではなくなりますので、ご注意ください。制限の内容は、「価格」のページで確認することができます。--- DeepL翻訳）

2025/06追記：
上記キャプチャの **What happens if I exceed the usage limit on my free plan?（無料プランで使用量の上限を超えた場合はどうなりますか？）** の部分について、現時点では以下のようになっています。

![スクリーンショット 2025-06-09 092416.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/e9de8d08-ad4c-45c9-a11f-dac0345f9117.png)

> 無料ティアの制限
> 無料ティアのアカウントにもメーター機能がありますが、有料プランとは仕組みが異なります。
> **サイトの使用量が無料レベルの制限に近づくと、Eメールで通知**が届きます。使用量が制限の50％、75％、90％、100％になると通知が送信されます。
> **ビルドの制限に達した場合、サイトは訪問者に提供されますが、アカウントのすべてのサイトで新しいビルドが無効**になります。
> それ以外のすべてのメーター機能については、**制限の100%に達した場合、新しいビルドは無効になり、アカウント上のすべてのサイトが一時停止**されます。**アカウントとサイトを復元するには、支払い方法を追加して有料プランにアップグレードする必要があります**。
> 超過分のサイトを削除してもアカウントは復元されませんのでご注意ください。**無料プランで上限に達すると、サービスを復元するにはアカウントをアップグレードする必要があります**。
> 各機能の無料レベルの上限は、料金ページに記載されています。
> DeepL.com（無料版）で翻訳しました。

https://docs.netlify.com/accounts-and-billing/billing-faq/#free-tier-limits

これまでは超過したタイミングで自動アップグレードされるフローでしたが、現状では**無料プランで上限に達するとサービスが一時停止（サイト閲覧は可能だがサイト内容の編集・改修などは不可）となる**ようです。**それら制限はアップグレードすることで解消される**という仕組みに変更となったようですね。

::: note warn
**以下は2025年6月現在、古い情報です。情報の整合性のため過去のものも残しておきます。**

上記の通り『Netlify』では**無料プランでも商用利用が可能**です。しかし[使用制限](https://www.netlify.com/pricing/#pricing-table-full-feature-list)には注意が必要となります。

- What happens if I exceed the usage limit on my free plan?（無料プランで使用量の上限を超えた場合はどうなりますか？）
> If you exceed the usage limit on your free plan, your site's usage of a metered feature will trigger an automatic upgrade to the next level or purchase of an extra usage package. You will be charged accordingly based on the upgraded plan or extra usage package. You can find more details on the Pricing page.（お客様が無料プランの利用限度額を超えた場合、お客様のサイトが計測された機能を利用することにより、次のレベルへの自動アップグレードまたは追加利用パッケージの購入が行われます。アップグレードされたプランまたは追加利用パッケージに基づいて、相応の料金が請求されます。詳細は、「価格」のページでご確認ください。--- DeepL翻訳）

少し恐ろしいことですが『Netlify』では制限を超えると、自動で ~~（勝手に）~~ アップグレードまたは上限を超えた機能の追加利用パッケージの購入が自動で ~~（勝手に）~~ 行われます。

- こちらのサイト様でもわかりやすく紹介してくださっています。
[Netlifyの無料枠を越えてしまい、1日20ドル請求されてしまった話](https://blog.tomoya.dev/posts/i-was-billed-beyond-limits-of-netlify/)
[【微課金】Netlifyから請求がきた](https://microayatron.com/netlify-billing/)

---

これまでの自動アップグレードよりも、現在のサービス一時停止（といってもサイトは閲覧できる）の方が個人的には安心できるので、とても良い改良をして下さった印象です。

:::

> To avoid being charged, you can change your site code to remove the metered feature functionality or stop builds if you are approaching your build minutes allowance. Keep in mind that a sudden spike in usage may cause your site to pass the free level limit before you have a chance to make changes.（課金を回避するには、サイトコードを変更して従量制機能を削除するか、ビルド分数の許容量に近づいている場合はビルドを停止することができます。使用量が急激に増加した場合、変更する前に無料レベルの制限を過ぎてしまう可能性があることに留意してください。--- DeepL翻訳）

ご丁寧にそうした事態の回避方法も教えてくれました。
ただし「設定の変更前に制限が急突破した時はどうしようもないよ、ごめんね」（超意訳）ということも書いてありますね。
定期的にログインして管理画面を確認する癖を付けておくと良いかもしれません。

また利用状況に応じて通知を行ってくれるようです。
[When will I receive notifications about my usage?（利用状況に関するお知らせはいつ届きますか？）](https://docs.netlify.com/accounts-and-billing/billing-faq/#when-will-i-receive-notifications-about-my-usage)
![netlify002.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/b725a099-3a20-10a0-9719-59955d52b171.png)
> Netlify sends notification emails to a team’s billing email when any site add-on is enabled, as usage for a metered feature approaches allowance limits, when usage triggers a level upgrade or extra usage package, and when the team payment method is charged at the end of the billing cycle. Below is an example of the notifications sent at different stages of usage.（Netlifyは、サイトアドオンが有効になったとき、メーター機能の使用量が許容量に近づいたとき、使用量がレベルアップグレードや追加使用パッケージのトリガーになったとき、課金サイクル終了時にチームの支払い方法が請求されたとき、チームの課金メールに通知メールを送ります。以下は、使用状況の異なる段階で送信される通知の例です。--- DeepL翻訳）

最後に『Netlify』の**注意事項や特徴**を紹介します。
『Netlify』は**静的サイト（HTML、CSS、JavaScript）のホスティングサービス**なので、`PHP`などサーバーサイドの言語は使用できません。つまり`WordPress`など動的サイトはホスティングできませんのでご注意ください。
> Netlify is for modern static websites, so the answer is that you cannot run php on Netlify at run time.（Netlifyは現代の静的なウェブサイトのためのものなので、Netlify上でphpをランタイムで実行することはできないというのが答えです。--- DeepL翻訳）
> -- <cite>[How to host php websites（phpのウェブサイトをホストする方法）](https://answers.netlify.com/t/how-to-host-php-websites/7410)<cite>

`Ruby`も同様に不可能です。
> Hosting Rails applications on Netlify is not possible at the moment. Netlify is meant for Static Site Generators where static websites are built from a build command.（NetlifyでRailsアプリケーションをホストすることは、今のところ不可能です。Netlifyは、静的なウェブサイトをビルドコマンドから構築する静的サイトジェネレーター向けのものです。--- DeepL翻訳）
> -- <cite>[Deploying a ruby on rails application（ruby on railsアプリケーションをデプロイする）](https://answers.netlify.com/t/deploying-a-ruby-on-rails-application/84464)<cite>

SSLは自動で（そして無料で）対応してくれます。
> Netlify offers free HTTPS on all sites, including automatic certificate creation and renewal. Our certificates use the modern TLS protocol, which has replaced the now deprecated SSL standard.（Netlifyは、証明書の自動作成と更新を含め、すべてのサイトで無料のHTTPSを提供します。当社の証明書は、現在では非推奨のSSL標準に代わる最新のTLSプロトコルを使用しています。--- DeepL翻訳）
> -- <cite>[HTTPS (SSL)](https://docs.netlify.com/domains-https/https-ssl/)<cite>

### Vercel
『Vercel』は[プラン紹介ページ（Pricingページ）](https://vercel.com/pricing)の無料プラン（Hobby）に **For personal or non-commercial projects.** という記述があるように`Hobbyプラン`では**商用利用できません**。
各種プランの詳細は[こちらのページ](https://vercel.com/docs/accounts/plans)にも記載されています。
![vercel001.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/ae8c5146-94b3-d5bd-4093-4b15461afc3e.png)

[Fair Use Policy](https://vercel.com/docs/concepts/limits/fair-use-policy)には上記の内容に加えて、その他の詳しい規約も書かれていますので一度目を通してみてください。
> Hobby accounts are restricted to non-commercial personal use only.
> -- <cite>[Fair Use Policy Commercial Usage](https://vercel.com/docs/concepts/limits/fair-use-policy#commercial-usage)<cite>

『Vercel』の[プラン別機能の比較表](https://vercel.com/pricing#plan-compare)を見てみると、プランの種類は[Netlifyのプラン](https://www.netlify.com/pricing/#pricing-table-full-feature-list)とほぼ同じですね。
ただし、『Vercel』には[General Limits](https://vercel.com/docs/concepts/limits/overview)という制限に関する案内ページも用意されています。
> This reference covers a list of all the limits and limitations that apply on Vercel.（このリファレンスは、Vercelに適用されるすべての制限と限界のリストをカバーしています。--- DeepL翻訳）

> To prevent abuse of our platform, we apply the following limits to all accounts.（当社プラットフォームの不正使用を防止するため、当社はすべてのアカウントに以下の制限を適用しています。--- DeepL翻訳）

当該ページの冒頭に書いてある内容です。プラン別機能の比較表で紹介しきれなかったすべての制限内容ということでしょうか。すごい量です。

当該ページには以下のように[各制限における追加利用にかかわる従量課金モデル（Proプラン）](https://vercel.com/docs/concepts/limits/overview#additional-resources)についても記載されています。~~『Netlify』みたいに プラン別機能の比較表に一緒に記載してくれていると親切なのに~~
![vercel-Additional-resources.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/4349fc9b-5ac5-64b4-08a0-b5f2797b31f3.png)
> Additional resources
> For members of our Pro plan, we offer a pay-as-you-go model for additional usage, giving you greater flexibility and control over your usage. The typical monthly usage guidelines above are still applicable, while extra usage will be automatically charged at the following rates:（プロフェッショナルプランのメンバーには、追加使用に対する従量課金モデルを提供しており、より柔軟に使用量を制御することができます。上記の標準的な月間使用量のガイドラインはそのまま適用されますが、追加の使用量は以下の料金で自動的に請求されます：--- DeepL翻訳）

これは記述にあるように`Proプラン`に関してということだと思います。とはいえ、無料の`Hobbyプラン`でも似たように考えておくと無難かもしれません。確証のない情報で申し訳ないです。

::: note info
この記事の執筆後に『Vercel』を個人アプリで使ってみました。

『Netlify』のように~~15日締め~~（後述：2025/03時点では「当月1日～30日」に変更）で1ヶ月という計測期間ではなく、『Vercel』では使用した（更新した or アクセスのあった なども含む）日以降徐々に使用量が減っていくようです。

- 2025/03/17追記：
『Netlify』の当月計測期間の設定が、毎月15日締めから**当月1日～30日に変更**されていました。
[こちらの公式ドキュメント](https://docs.netlify.com/accounts-and-billing/billing/?_gl=1%2a12lyakt%2a_gcl_au%2aMTUxNDQ1NzQyMC4xNzM4MDQ4MjY3#find-your-bandwidth-usage)のキャプチャでも記載ありますが筆者のダッシュボードでも`Bandwidth detail for current period (March) Mar 1 to Mar 30 inclusive）`という記載に変わっていました

【8/11に確認した際のスクリーンショット】
![スクリーンショット 2023-08-11 144021.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/79932c07-437c-fb26-a34a-82856e9de538.png)
【8/22に確認した際のスクリーンショット】
![スクリーンショット 2023-08-22 130046.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/d360e8ad-8855-4197-678f-9f85df9200e9.png)
※ スクリーンショットでは`Bandwidth`ですが他も同様だと思います。

使用量について簡潔にまとめると、
・『Netlify』：期間でリセット
・『Vercel』：使用最終日から徐々に減少
という感じだと思います。
:::

『Vercel』でも使用量の限界が近づくと通知を行ってくれるようです。
[Notification details](https://vercel.com/docs/dashboard-features/notifications#notification-details)の`Usage`の項目内容

![スクリーンショット 2024-06-26 13.10.09.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/6a15e5f1-da26-2324-86b5-3c75a82944b1.png)


[On-demand usage notifications](https://vercel.com/docs/dashboard-features/notifications#on-demand-usage-notifications)にて、閾（しきい）値やプラン別による通知の詳細を確認できます。

![スクリーンショット 2024-06-26 13.09.48.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/0e7d2039-eb44-9906-51bd-6c55c07bc70d.png)


そして上限に達した場合の挙動はというと、
![スクリーンショット 2024-04-08 101229.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/442eefd4-3dc4-e89f-0c61-0225ccd03740.png)

> All plans receive notifications by email and on the dashboard when they are approaching and exceed their usage limits.
Hobby plans will be paused when they exceed the included free tier usage
Pro plans users can configure Spend Management to automatically pause deployments, trigger a webhook, or send SMS notifications when they reach 100% usage
For Pro and Enterprise teams, when you reach 100% usage your deployments are not automatically stopped. Rather, Vercel enables you to incur on-demand usage as your site grows. It's important to be aware of the usage page of your dashboard to see if you are approaching your limit.
One of the benefits to always being on, is that you don't have to worry about downtime in the event of a huge traffic spike caused by announcements or other events. Keeping your site live during these times can be critical to your business.
（すべてのプランでは、**使用量制限に近づいたり、制限を超えたりすると、メールとダッシュボードで通知が届きます**。
**ホビープランの場合、無料プランの使用量を超えると一時停止**されます。
Proプランのユーザーは、Spend Managementを設定することで、使用量が100%に達したときに自動的にデプロイメントを一時停止したり、Webhookをトリガーしたり、SMS通知を送信したりすることができます。
**ProとEnterpriseチームの場合、使用量が100%に達してもデプロイは自動的に停止されません。むしろ、Vercelはサイトの成長に合わせてオンデマンドの利用を可能にします**。ダッシュボードの使用状況ページで、上限に近づいているかどうかを確認することが重要です。
常時オンの利点のひとつは、発表やその他のイベントによってトラフィックが急増した場合でも、ダウンタイムを心配する必要がないことです。このような時間帯にサイトを稼動させておくことは、ビジネスにとって非常に重要です。--- DeepL翻訳）
[What happens when I reach 100% usage?（使用率が100%になるとどうなりますか？）](https://vercel.com/docs/accounts/plans#what-happens-when-i-reach-100%-usage)

書いてある通り、ホビープランの場合は一時停止してくれるみたいですね。一安心。
しかし、こちらも記載通り、ProとEnterpriseチームの場合は停止されないので使用状況の確認が大切なようです。
気づいたら上限値を大幅に超えて……なんてことになると恐怖でしかない。

::: note warn
**以下は2024年4月現在、古い情報です。情報の整合性のため過去のものも残しておきます。**

![vercel-100%.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/baea7276-0334-4147-acb3-07c44d83ded1.png)
> When you reach 100% usage your deployments are not automatically stopped. Rather, Vercel keeps your deployment running and charges you for the additional usage.（使用率が100%に達しても、デプロイメントは自動的に停止しません。むしろ、Vercelはあなたのデプロイメントを実行し続け、追加の使用量を請求します。--- DeepL翻訳）
[What happens when I reach 100% usage?（使用率が100%になるとどうなりますか？）](https://vercel.com/docs/concepts/payments-and-billing/overview#what-happens-when-i-reach-100%-usage)

『Netlify』と同様に自動で ~~（勝手に）~~ 課金（追加の使用量を請求）します。
むしろ、ってアグレッシブな姿勢ですね...

2024年4月追記：
以前の内容と比べると、現在の仕様はホビープランに対する配慮が感じられるものになっていますね。改善していただいて有難い限りです。
:::


『Vercel』の**注意事項**としては、前述通り`Hobbyプラン`では**商用利用ができない**点でしょう。
しかし、『Vercel』では『Netlify』と違って`PHP`や`Ruby`などサーバーサイドの言語を使用できます。
[VercelでPHPを使ってみた。](https://zenn.dev/uemuragame5683/articles/c4899a229267fe)
[Supported Languages for Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions/supported-languages)

『Vercel』でもSSLは自動で対応してくれます。
![vercel-ssl.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/d6d04950-026c-93cd-c079-297b860cb9de.png)
[プラン別機能の比較表 - Security部分](https://vercel.com/pricing#plan-compare)

- 画像の最適化
『Vercel』では自動で[画像最適化](https://vercel.com/docs/concepts/image-optimization#)を行ってくれますが、2025年2月以降 2種類のプランがあるようです。

https://vercel.com/docs/image-optimization/limits-and-pricing

> This is the default pricing option. For Pro and Enterprise teams created before February 18th, 2025, you will be given the choice to opt-in to this pricing plan or stay on the legacy source images-based pricing plan. Upgrading or downgrading your plan will automatically opt-in your team.

> これはデフォルトの価格オプションです。2025年2月18日以前に作成されたProおよびEnterpriseのチームには、この料金プランにオプトインするか、従来のソースイメージベースの料金プランのまま維持するかの選択肢が与えられます。プランをアップグレードまたはダウングレードすると、チームは自動的にオプトインされます。

上記を見ると、2025年2月以降のものは新プランが適用されるみたいですね。

それ以前のアカウントでは新プランか以下の従来プランを選べるようです。

https://vercel.com/docs/image-optimization/legacy-pricing

グレードによって制限があるので注意してください。`Hobby`無料プランでは1000枚までです。
![スクリーンショット 2023-06-15 16.09.27.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/980db385-72a6-e6ae-ce3b-45e4c0b3036c.png)
こちらの記事で制限を超えてしまった時の出来事が分かりやすく書かれていました！
[VercelからImage Optimization Source Imagesの使いすぎ警告が来た時の対応](https://qiita.com/0ba/items/46709d24bc81efe1cb6c)

### GitHub Pages
『GitHub Pages』では先に述べたように**商用利用は不可**です。

https://docs.github.com/ja/site-policy/github-terms/github-terms-for-additional-products-and-features#pages

> GitHub Pages は、オンライン ビジネス、e コマース サイト、主に商取引の円滑化または商用のサービスとしてのソフトウェア (SaaS) の提供のいずれかを目的とする、その他の Web サイトを運営するための無料の Web ホスティング サービスとしての使用を意図したものではなく、またそのような使用を許可するものでもありません。 Pages では、寄付のボタンやクラウドファンディングのリンクなど、収益化の行為が一部認められています。

- 「Usage limits（使用状況の制限）」について

https://docs.github.com/ja/pages/getting-started-with-github-pages/github-pages-limits#usage-limits

- GitHub Pages では**アカウントごとに作成できるサイトは1つだけ**です

> You can only create one user or organization site for each account on GitHub.

上記引用は、先の「[Usage limits（使用状況の制限）](https://docs.github.com/ja/pages/getting-started-with-github-pages/github-pages-limits#usage-limits)」ページ内に記載あります。

以下のページでは、視覚的に分かりやすいテーブル表形式で確認できます。

https://docs.github.com/ja/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites

![スクリーンショット 2025-06-09 095026.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/4c452dc6-e724-4d5d-ac95-468188aa7b32.png)

- SSL対応

キャプチャ画像の「**Default site location**」欄に記載あるように、『GitHub Pages』でも『Netlify』や『Vercel』同様、SSLは自動で対応してくれます。

> GitHub Pagesは、GitHub Free及びOrganizationのGitHub Freeのパブリックリポジトリ、GitHub Pro、GitHub Team、GitHub Enterprise Cloud、GitHub Enterprise Serverのパブリック及びプライベートリポジトリで利用できます。 詳しくは、「GitHub の製品」をご覧ください。
> -- <cite>[GitHub Pages サイトを作成する](https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site)<cite>

![github無料プラン-pubilc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/a8abe727-8c1f-214b-cf9e-76a954b1c20a.png)

GitHub に関して、上限を超えた情報を探したのですが、`GitHub Actions`についてしかヒットしませんでした。
[GitHub Actions](https://docs.github.com/ja/actions/learn-github-actions/understanding-github-actions)

何か他にご存知の方がいらしたらコメントなどいただけますと嬉しいです。

[GitHubActionsの課金について](https://docs.github.com/ja/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
![0ドル以上.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/5ce364d2-b42a-0365-7e77-ae6178798141.png)
> 月ごとの請求のお客様の場合、アカウントには既定の使用制限として 0 米ドル (USD) が設定されます。これにより、プライベートリポジトリで、そのアカウントに含まれる容量を超える追加の時間 (分) やストレージが使われるのを防ぐことができます。 

規定の`0 米ドル (USD)`にしておけば自動アップグレード・購入などせず使用を防止してくれるみたいです。この辺は『Netlify』や『Vercel』とは違いますね。

![0ドル以上01.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/b290c141-d520-5fc4-bf4d-17e8237cd332.png)
[GitHub Actions の使用制限の管理](https://docs.github.com/ja/billing/managing-billing-for-github-actions/managing-your-spending-limit-for-github-actions)
![0ドル以上02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/66fd204a-5ac7-2fac-097d-46a018459918.png)
`0 米ドル (USD)`以上にした場合、上限を超えた使用分が課金される（=超課金が発生する）ということのようです。

ちなみに、上記のスクリーンショットにも記載がありましたが、
> 超過を有効にしていないため、次にワークフローの成果物を作成しようとしても失敗します。

このように上限を超えると**利用ができなくなる**ようです。

ところで、`アカウントには既定の使用制限として 0 米ドル (USD) `についてですが、
こちらは自身の GitHub アカウントページTOPの右上にあるアイコンクリックで開いたメニューの`Setting → Billing and Plans → Plans and Usage`から確認できますよ。

『GitHub Pages』に関しても注意事項や特徴を書いておきます。
『GitHub Pages』は『Netlify』と同様に**静的サイトのホスティングサービス**です。
そのため`PHP`や`Ruby`などは扱えません。

https://docs.github.com/ja/pages/getting-started-with-github-pages/what-is-github-pages#about-github-pages

> **GitHub Pages is a static site hosting service** that takes HTML, CSS, and JavaScript files straight from a repository on GitHub, optionally runs the files through a build process, and publishes a website. You can see examples of GitHub Pages sites in the GitHub Pages examples collection.

`GitHub Pages`でのサイトの作り方は以下の記事が簡潔でわかりやすかったです。

https://zenn.dev/no215/articles/331bc656b6d79d

### おまけ Firebase
> Firebase は、ユーザーに愛されるアプリやゲームの構築と拡大を支援するアプリ開発プラットフォームです。Google のインフラが支える、世界中の多くの企業から高い信頼を得ているサービスです。

[Firebase（公式サイト）](https://firebase.google.com/?hl=ja)にあるように Google が提供するアプリ開発プラットフォームで、サーバーレスや認証機能、メッセージ送受信など多機能を揃えています。
筆者は Firebase を使用したことがないので使用に関するノウハウや注意点などをお伝えできませんが、調べると多くの情報が出てくるので関心のある方はぜひ調べてみてください。

本記事では無料枠と、それを超えた場合について話を進めたいと思います。
はじめに結論を述べると「無料枠は用意されており、それを**超えた場合は（次回の請求期間まで）すべてのプロダクトが使用できなくなる**」というものだそうです。

::: note alert
注意点として`Cloud Functions`という機能を使用する場合は、有料（従量課金制）の「Blaze」プランの使用が必須となります（無料プランでは使用できないため）。Blaze は 従量課金制なので無料枠を超えると費用が発生します。

下記内容は、「[Firebase で無料枠を超えたら Firestore を自動的に無効にする](https://zenn.dev/kurosame/articles/1c26015ca47aaf)」 より引用させていただきました。
> 個人開発ではあまり課金したくないですよね
ただし、Firebase の場合は、Functions を使えば **Blaze プラン（従量課金）への移行が必須で、Firestore を使えば割とすぐに無料枠を超過**します
もし、アプリケーションを公開してると F5/Command+R 連打される危険性もあります
寝てる時にされたら終了です 😇
:::

先程少し触れましたがプランは**無料の「Spark」** と、 **有料（従量課金制）の「Blaze」** とで別れています（[Firebase 料金プラン](https://firebase.google.com/pricing?hl=ja)）
![スクリーンショット 2023-09-26 10.11.04.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/1e81e401-bfa4-8395-32a0-db75b32145e0.png)
[料金プラン](https://firebase.google.com/pricing?hl=ja)ページの一部スクリーンショットです。
使用制限も一緒に記載してくれているのは丁寧ですね！
これら制限を超えてしまった場合についても公式が教えてくれています（[Spark プランに関する重要事項](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans?hl=ja#important-facts-spark)）。
![スクリーンショット 2023-09-26 10.26.11.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/3029c27a-bfde-607c-4235-9c7bc0f7d949.png)
スクリーンショット下部にあるように、**プロジェクトに Cloud 請求先アカウントを追加すると、そのプロジェクトのお支払いプランが Blaze プランに自動アップグレード**されるようです。こちらも要注意ですね。

:::note warn
2023/11月 追記：
Firebase（Google Cloud Platform）の使用時は注意事項として **`Firebase.json`にインスタンス数の上限値を設定**した方が無難なようです。設定しないと高額な費用が発生するケースもあるそう……。以下の記事「Next.jsをFirebaseにデプロイしたら高額請求がきて貯金がなくなりかけた話」が詳しく紹介してくださっています。
:::
https://qiita.com/Sicut_study/items/1723379221bd966b36aa


### まとめ
ここまで『Netlify』『Vercel』『GitHub Pages』（おまけで Firebase）について話してきました。
どのサービスも（会社・個人問わず状況や事情によって感じる）長所や短所があると思います。

例えば、『Netlify』と『Vercel』は自動SSLのみならず、独自のフォーム機能（Netlify：Netlify Forms, Vercel：Formspree）も備えていることも高ポイントでした。

- Netlify：Netlify Forms
筆者は Netlify Forms を実際に使っていますが、実装もそこまで苦ではありませんでした。
このサイト様の情報がすごく分かりやすかったです。

https://moshashugyo.com/media/netlify-forms

公式情報はこちら

https://docs.netlify.com/forms/setup/

- Vercel：Formspree
『Vercel』では[`Formspree`](https://formspree.io/)というメールライブラリを用いてフォーム機能を実現しているようです。
[`Formspree`の料金プランはこちら](https://formspree.io/plans)で確認できます。
2025/02 時点では以下の料金テーブルとなっています。

![スクリーンショット 2025-02-20 094302.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/893b6ff2-edfb-4ac2-add5-5424bb735ca1.png)

キャプチャ画像下部に記載ありますが、**テストや開発用途**であれば**いくつのプロジェクトでも月50件までは無料**なようです！

> Free Forever
> Use Formspree for testing and development with unlimited projects and forms, limited to 50 submissions/mo.

『Vercel』での利用は下記の公式情報が用意されています。

https://vercel.com/guides/deploying-react-forms-using-formspree-with-vercel

『Vercel』は様々なライブラリや機能を統合していることもあってか、各種ドキュメントがかなり充実していて親切な印象を受けます。
個人的な肌感覚としては Vercel：Formspree での設定が Netlify Forms に比べてシンプルで簡単そうと感じました。

ちなみに、`Formspree`はメールライブラリなので特に『Vercel』を利用せずとも使えます。

https://www.webcreatorbox.com/blog/formspree

---

長々と書いてきましたが、解釈や記載の間違い等もあるかもしれません。
恐れ入りますが、何かご存知の方がいらしたらご指摘等いただけますとありがたく存じます。

ここまで読んでいただきまして、ありがとうございました！

### 参考情報
- [Netlifyの無料枠を越えてしまい、1日20ドル請求されてしまった話](https://blog.tomoya.dev/posts/i-was-billed-beyond-limits-of-netlify/)
- [【微課金】Netlifyから請求がきた](https://microayatron.com/netlify-billing/)
- [VercelでPHPを使ってみた。](https://zenn.dev/uemuragame5683/articles/c4899a229267fe)
- [VercelからImage Optimization Source Imagesの使いすぎ警告が来た時の対応](https://qiita.com/0ba/items/46709d24bc81efe1cb6c)
- [Firebase で無料枠を超えたら Firestore を自動的に無効にする](https://zenn.dev/kurosame/articles/1c26015ca47aaf)
- [ポートフォリオサイトの公開と公開手順【GitHub Pages】](https://zenn.dev/no215/articles/331bc656b6d79d)
- [NetlifyのForms機能でフォームを作る方法！サーバーサイドの知識0で実装可能！](https://moshashugyo.com/media/netlify-forms)
- [一行追加でコンタクトフォームを実装できる【Formspree】](https://www.webcreatorbox.com/blog/formspree)
