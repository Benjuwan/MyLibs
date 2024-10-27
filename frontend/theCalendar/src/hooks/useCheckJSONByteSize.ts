/**
 * Uncaught DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of '*' exceeded the quota.
 * localStorage が容量上限に達した場合のエラーハンドリングのカスタムフック
*/

export const useCheckJSONByteSize = () => {
    const checkJSONByteSize = (jsonStr: string, limitByte?: number) => {
        const isSmartPhone_Tablet: boolean = window.matchMedia("(max-width: 700px)").matches;

        /* limitByte：1000b -> 1kb, 1000kb -> 1mb（1000000b）*/
        const storageLimit: number = limitByte ?? isSmartPhone_Tablet ? 2500000 : 5000000; // スマホ・タブレットでは2.5mb、PCでは5mbがデフォルト値

        /* TextEncoderを使用してUTF-8バイト配列に変換 */
        const encoder = new TextEncoder();
        const utf8Array = encoder.encode(jsonStr);

        if (utf8Array.byteLength > storageLimit) {
            alert(`登録リストのファイルサイズが${Math.floor(utf8Array.byteLength).toLocaleString()}バイトで、ストレージ上限（${Math.floor(storageLimit).toLocaleString()}バイト）を超過するため登録できません。\n画像の登録を減らすなどファイルサイズの軽量化を行ってください。\nこのメッセージを閉じた後に再読み込みします。`);
            location.reload();
        }
    }

    return { checkJSONByteSize }
}