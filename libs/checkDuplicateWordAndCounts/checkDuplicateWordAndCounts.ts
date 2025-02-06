type checkDuplicateWordAndCounts_resultType = {
    chars: string;
    char: string;
    count: number;
}

// 引数に指定した文字列配列内の各文字列における「文字列内での重複文字と重複回数」をチェックする処理
const checkDuplicateWordAndCounts: (theWords: string[]) => checkDuplicateWordAndCounts_resultType[] = (
    theWords: string[]
) => {
    const results: checkDuplicateWordAndCounts_resultType[] = [];

    for (const theWord of theWords) {
        // 各文字の出現回数を記録するマップを作成
        const charsMap: Map<string, number> = new Map<string, number>();

        // 文字列内の各文字の出現回数をカウント
        for (const char of theWord) {
            // 第二引数部分の処理： char がまだ存在しない（falseの）場合は 0を指定し、既に存在する場合は取得した char の値（既存の値）に +1する
            charsMap.set(char, (charsMap.get(char) || 0) + 1);
        }

        let theChar: string = '';
        let theCount: number = 0;

        // エントリー（[key, value]のペア）を取得
        for (const [char, count] of charsMap.entries()) {
            // 文字が切り替わったら重複計測回数（theCount）を初期化
            if (theChar !== char) {
                theCount = 0;
            }

            // 重複計測回数（theCount）より大きい（＝重複している）場合は購読開始
            if (count > theCount) {
                theChar = char;
                theCount = count;
            }

            // 重複がある場合のみ（出現回数が2回以上）結果に追加
            if (theCount >= 2) {
                const newResult: checkDuplicateWordAndCounts_resultType = {
                    chars: theWord,
                    char: theChar,
                    count: theCount
                }
                results.push(newResult);
            }
        }
    }

    return results;
}

const targetStrAry: string[] = ["beer", "www", "apple", "banana", "soda", "benjuwan jijao"];

const theCheckDuplicateWordAndCounts: checkDuplicateWordAndCounts_resultType[] = checkDuplicateWordAndCounts(targetStrAry);
console.log(theCheckDuplicateWordAndCounts);