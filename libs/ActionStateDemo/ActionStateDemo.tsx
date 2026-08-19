import { useActionState, startTransition, useState } from "react";

type jsonPlaceholderType = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const ActionStateDemo = () => {
  const [contents, setContents] = useState<jsonPlaceholderType | undefined>(undefined);

  // const [state, runAction, isPending] = useActionState(...
  const [count, getJsonPlaceholderData, isPending] = useActionState(
    // async (currentState, payload) => {...
    /* payload：例えば、フォーム送信時の formData やレスポンスデータのような「何かしらのアクション結果で生じる返却値・データ」のこと */
    async (currentState: number) => {
      const res: Response = await fetch(`https://jsonplaceholder.typicode.com/todos/${currentState}`);
      const resObj: jsonPlaceholderType = await res.json();

      console.log(resObj);
      setContents(resObj);

      currentState++;
      return currentState; // return newState;
    },
    1 // initialState
  );

  const handleClick = () => {
    // startTransition がないと（アクション・コンテキストの外部で dispatch したと）怒られることがある
    startTransition(() => {
      getJsonPlaceholderData();
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
      >run
      </button>
      {(count > 1 && typeof contents !== 'undefined') &&
        <p><span>id:{contents.id}</span> | {contents.title}</p>
      }
    </div>
  );
}