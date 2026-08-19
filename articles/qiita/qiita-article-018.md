title: Google Gemini Pro を Vite で使おうとして環境変数で詰まった話

tags: React vite 環境変数 AI GeminiPro

## はじめに

以下の記事を読んで`Google Gemini Pro`を試してみたくなり早速試してみました（**無料利用が可能なうちに**とかのワードに弱い人間です）。

https://qiita.com/jinto/items/828b301a335383dda7f7

記事の文章量や設定など、どこも読みやすいし分かりやすく筆者にとって良記事でした。
こういう情報をキャッチアップするのもですが、実際に自分ですぐに形にして情報発信できる方はすごいなぁ～と思います。
コードまで記載いただいていたのでサクッと試せて有難い限りでした。

さて今回は、筆者が上記記事を参照に`vite`を使った場合に詰まった部分があったので、そちらの補足情報を踏まえて書いていきたいと思います。

## `vite`での環境変数の設定や呼び出し方に注意
まずは本記事の結論からです。

- `vite`では`process.env.`が使えない

参照記事では`axios`を使ってフェッチしており以下のような記述をされています。

```typescript
.
..
const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
..
.
```

しかし、`vite`ではコード内にある`process.env.`の部分が使用できません（エラーが出てフェッチできない）

正確には**使用できなくなった**という状況でして、詳しくはこちらの [issue](https://github.com/vitejs/vite/issues/1973) にあります。

https://github.com/vitejs/vite/issues/1973

![スクリーンショット 2024-01-11 140227.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/67039767-5025-311a-a2f0-5191774cf72f.png)

同 issue の下の方で、

![スクリーンショット 2024-01-11 140301.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/74a3fc7b-f964-7b8e-480e-18e68eb9c522.png)

というご意見もあり試しましたが、筆者の場合は`APIKey`が`undefined`となってしまって実質使用できませんでした。

![スクリーンショット 2024-01-11 125223.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/222da512-5fd8-50f6-343e-adbff2b21a64.png)

ですからおとなしく以下のような記述にしております。
※筆者は`fetch API`を使用しています。

```typescript
.
..
const response = await fetch(
    `https://generativela...key=${import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}`,
    // process.env. ではなく import.meta.env を使用
..
.
```

- `vite`では環境変数のプレフィックスに`VITE_`を付ける
先ほどのコードで環境変数が参照記事と異なっていることに気づいた方もおられるかもしれません。

```typescript
参照記事：...key=${process.env.REACT_APP_GOOGLE_API_KEY}
筆者の記述：...key=${import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}
```

https://ja.vitejs.dev/guide/env-and-mode.html

![スクリーンショット 2024-01-11 141707.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/db7720f6-16c6-5bb7-37a5-9301d3bf36d3.png)

添付画像にある通りですが、`vite`では`VITE_`から始まる形でしか環境変数として認識してくれません。

これらを調整したことで以下のように無事に動いてくれました！

![d089b938341f4056154376c0ad8fe284.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3368730/f9c97fb1-01d1-552c-04d9-4c29bf180d36.gif)

念のため筆者のコードも書き残しておきます。
※内容は参照記事とほぼ同じです

```swift:.env
VITE_REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY
```

<details><summary>Chat.tsx</summary>

```typescript
import { ChangeEvent, useState } from "react";
import { css } from "@emotion/css";
import ReactMarkdown from "react-markdown";
import { LoadingEl } from "./LoadingEl";

type ChatMessage = {
  role: string;
  content: string;
}

type Part = {
  text: string;
}

const chatContainerStyle = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

const chatHistoryStyle = css`
  overflow-y: auto;
  flex-grow: 1;
  padding: 20px;
  margin-bottom: 60px;
`;

const userMessageStyle = css`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e1f5fe;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-end;
`;

const botMessageStyle = css`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #ede7f6;
  border-radius: 10px;
  max-width: 70%;
  align-self: flex-start;
`;

const inputStyle = css`
  flex: 1;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid #dedede;
  border-radius: 4px;
  margin-right: 10px;
`;

const buttonStyle = css`
  padding: 10px 20px;
  background-color: #5c6bc0;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3949ab;
  }
`;

const inputAreaStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fafafa;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
`;

const formStyle = css`
  display: flex;
  gap: 2%;
  flex-flow: row wrap;
  width: clamp(320px, calc(100vw/2), 560px);
`

export const Chat = () => {
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    const userMessage: ChatMessage = { role: "user", content: input };
    // 画面上の会話履歴を更新
    const updatedChatHistory = [...chatHistory, userMessage];

    try {
      setLoading(true);

      // リクエストを送信し、レスポンスを取得
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      if (!response.ok) {
        // エラーハンドリング
        console.error(`HTTPエラー！ ステータスコード: ${response.status}`);
      } else {
        // レスポンスのJSONデータを取得
        const botResponse = await response.json();
        // console.log(botResponse);

        // ボットのメッセージコンテンツを初期化
        let botMessageContent = "";

        // ボットの応答からメッセージを生成
        if (
          botResponse &&
          botResponse.candidates &&
          botResponse.candidates.length > 0
        ) {
          const firstCandidate = botResponse.candidates[0].content;
          if (
            firstCandidate &&
            firstCandidate.parts &&
            firstCandidate.parts.length > 0
          ) {
            // パーツのテキストを連結してメッセージコンテンツを作成
            botMessageContent = firstCandidate.parts
              .map((part: Part) => part.text)
              .join('\n');
          }
        }

        // 生成されたボットのメッセージを作成
        const botMessage = {
          role: 'system',
          content: botMessageContent,
        };

        // 会話履歴を更新（ユーザーとボットのメッセージを含む）
        setChatHistory([...updatedChatHistory, botMessage]);
        setLoading(false);
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Google API error:', error);
    }

    // 入力をクリア
    setInput("");
  };

  const renderChatMessage = (message: ChatMessage) => {
    if (message.role === "system") {
      // マークダウン形式のメッセージをHTMLに変換して表示
      return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }
    return <div>{message.content}</div>; // 通常のテキストメッセージ
  };

  return (
    <div className={chatContainerStyle}>
      <div className={chatHistoryStyle}>
        {loading ? <LoadingEl /> :
          <>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={
                  chat.role === "user" ? userMessageStyle : botMessageStyle
                }
              >
                {renderChatMessage(chat)}
              </div>
            ))}
          </>
        }
      </div>
      <div className={inputAreaStyle}>
        <form className={formStyle} onSubmit={(formelm: ChangeEvent<HTMLFormElement>) => {
          formelm.preventDefault();
          sendMessage();
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={inputStyle}
          />
          <button onClick={sendMessage} className={buttonStyle}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
```

</details>



## まとめ
`vite`での環境変数の使用時は注意してください、という話でした。

筆者のスキルレベルが低くて周知のことならお恥ずかしい限りですが、似たような方には必要としていただけるかもと思い書きました。

ここまで読んでいただき、ありがとうございます。

## 参照記事

https://qiita.com/jinto/items/828b301a335383dda7f7

https://github.com/vitejs/vite/issues/1973

https://ja.vitejs.dev/guide/env-and-mode.html
