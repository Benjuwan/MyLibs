export const useRemandCalcSeconds = () => {
    const remandCalc_Seconds: () => number = () => {
        let theSeconds: number = 59;
        const nowSeconds: number = new Date().getSeconds();
        return theSeconds - nowSeconds;
    }

    return { remandCalc_Seconds }
}