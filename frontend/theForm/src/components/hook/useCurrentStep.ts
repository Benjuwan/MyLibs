import { useCallback, useContext } from "react";
import { TheContext } from "../libs/TheContext";

export const useCurrentStep = () => {
    const { isPersonal, isPayment, isConfirm } = useContext(TheContext);

    /* 配列番号に準拠したステップ項目(div要素)に class属性を付与し、それ以外は解除 */
    const currentStep = useCallback((
        aryItems: NodeListOf<HTMLElement>,
        targetNum: number
    ) => {
        aryItems.forEach((item, i) => {
            if (i === targetNum) {
                item.classList.add('currentStep');
            } else {
                item.classList.remove('currentStep');
            }
        });
    }, [isPersonal, isPayment, isConfirm]);

    return { currentStep }
}