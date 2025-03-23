export const useCreateEachSelectOptions = () => {
    /**
     * 各 select の option 生成（用の文字列型インデックス数を格納した配列を用意）する関数
     * @param {number} loopStart    // ループの開始数
     * @param {number} loopFinish   // ループの終了数
    */
    const createEachSelectOptions: (loopStart: number, loopFinish: number) => string[] = (
        loopStart: number,
        loopFinish: number
    ) => {
        const elms: string[] = []
        for (let i = loopStart; i <= loopFinish; i++) {
            elms.push(i.toString());
        }
        return elms;
    }

    return { createEachSelectOptions }
}