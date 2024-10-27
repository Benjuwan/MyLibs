import { memo, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TheContext } from "./libs/TheContext";
import { useCurrentStep } from "./hook/useCurrentStep";

export const TheForm = memo(() => {
    const {
        isPersonal, setPersonal,
        isPayment, setPayment,
        isConfirm, setConfirm,
        isSwitcher, setSwitcher,
    } = useContext(TheContext);

    /* localStorage 関連 */
    const TxtSave = () => {
        let InputTxtBox: Array<string> = [];
        InputTxtBox.push(isName);
        InputTxtBox.push(isMail);
        InputTxtBox.push(isTel);
        InputTxtBox.push(isAddressNum);
        InputTxtBox.push(isAddress);
        /* アクション（クリック）時の時分を取得して配列に格納 */
        const getDate = new Date();
        const hours = getDate.getHours();
        const minute = getDate.getMinutes();
        const takeTime: string = `${String(hours).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
        InputTxtBox.push(takeTime);

        localStorage.setItem('InputTxtBox', JSON.stringify(InputTxtBox));
    }

    useEffect(() => {
        const getLocalStorageEls = localStorage.getItem('InputTxtBox');
        if (getLocalStorageEls !== null) {
            const SaveDateTxt = JSON.parse(getLocalStorageEls);
            // console.log(SaveDateTxt);

            /* コンポーネントの読込時の時分(pastTime)を取得して現在の時分(takeTime)と resetLimit 分以上の差があれば localStorage をリセット */
            const resetLimit: number = 15;
            const getDate = new Date();
            const hours = getDate.getHours();
            const minute = getDate.getMinutes();
            const takeTime: string = `${String(hours).padStart(2, '0')}${String(minute).padStart(2, '0')}`;
            const pastTime: number = Number(SaveDateTxt.pop());
            if ((Number(takeTime) - pastTime) >= resetLimit) {
                localStorage.removeItem('InputTxtBox');
            } else {
                const InputTxt = document.querySelectorAll('form label input');
                /* vanilla-JS の場合は下記の setAttributeメソッドでok. */
                // InputTxt.forEach((inputTxt, i) => {
                //     const eachSaveTxt = SaveDateTxt.shift();
                //     inputTxt.setAttribute('value', eachSaveTxt);
                // });

                /* React の場合は State で管理するため下記処理（各項目に合致する value を反映） */
                for (let i = 0; i < InputTxt.length; i++) {
                    const eachSaveTxt = SaveDateTxt.shift();
                    if (i === 0) {
                        setName(eachSaveTxt);
                    } else if (i === 1) {
                        setMail(eachSaveTxt);
                    } else if (i === 2) {
                        setTel(eachSaveTxt);
                    } else if (i === 3) {
                        setAddressNum(eachSaveTxt);
                    } else if (i === 4) {
                        setAddress(eachSaveTxt);
                    }
                }
            }
        }
    }, []);
    /* localStorage 関連 */

    /* お届け先の郵便番号や住所（が現住所と同じ場合に）入力を省くスイッチャー */
    const switcher = () => {
        setSwitcher(!isSwitcher);
        setShippingAddressNum('');
        setShippingAddress('');
    }

    /* 問い合わせフォームのステップ表示 */
    const { currentStep } = useCurrentStep();

    /* 個人・住所情報関連：isPersonal */
    const firstStep = () => {
        setPersonal(true);
        setPayment(false);
        setConfirm(false);

        const stepStatusItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.stepStatus div');
        currentStep(stepStatusItems, 0);
    }

    /* 支払い情報関連：isPayment */
    const secondStep = () => {
        setPayment(true);
        setPersonal(false);
        setConfirm(false);

        const stepStatusItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.stepStatus div');
        currentStep(stepStatusItems, 1);
    }

    /* 入力内容の確認画面：isConfirm */
    const thirdStep = () => {
        setConfirm(true);
        setPersonal(false);
        setPayment(false);

        const stepStatusItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.stepStatus div');
        currentStep(stepStatusItems, 2);

        // console.log(isPaymentAry);
    }

    /* 名前 */
    const [isName, setName] = useState<string>('');

    /* メールアドレス */
    const [isMail, setMail] = useState<string>('');

    /* 電話番号 */
    const [isTel, setTel] = useState<string>('');

    /* 郵便番号 */
    const [isAddressNum, setAddressNum] = useState<string>('');
    /* 住所 */
    const [isAddress, setAddress] = useState<string>('');

    /* 支払方法の選択項目 */
    const [isPaymentAry, setPaymentAry] = useState<Array<string>>(['']);
    /* 支払方法の値を取得するメソッド */
    const getPaymentValue = (
        targetValue: HTMLInputElement
    ) => {
        /* 支払方法の選択経緯（これまで選択した項目の値）を知りたい場合は、スプレッド構文で配列を展開する */
        // const newPaymentAry: Array<string> = [...isPaymentAry];

        /* 配列を空に（支払方法の選択経緯を削除）して処理を進める */
        const newPaymentAry: Array<string> = [];
        newPaymentAry.push(targetValue.value);
        setPaymentAry(newPaymentAry);
    }
    /* 選択した支払方法に checked を付与 */
    useEffect(() => {
        const paymentRadios = document.querySelectorAll('.payment input[type="radio"]');
        isPaymentAry.forEach(paymentMethod => {
            paymentRadios.forEach(radioValue => {
                if (paymentMethod === radioValue.getAttribute('value')) {
                    radioValue.setAttribute('checked', 'true');
                }
            });
        });
    }, [isPersonal, isPayment, isConfirm]);

    /* お届け先の郵便番号 */
    const [isShippingAddressNum, setShippingAddressNum] = useState<string>('');
    /* お届け先の住所 */
    const [isShippingAddress, setShippingAddress] = useState<string>('');


    return (
        <TheFormWrapper>
            <div className="stepStatus">
                <div className="currentStep">
                    <p>1</p>
                    <p>個人・住所情報</p>
                </div>
                <div>
                    <p>2</p>
                    <p>お支払い情報</p>
                </div>
                <div>
                    <p>3</p>
                    <p>確認内容</p>
                </div>
            </div>
            <form action="">
                {/* 個人・住所情報関連 */}
                {isPersonal &&
                    <>
                        <div className="info personal">
                            <h2>個人情報</h2>
                            <label htmlFor=""><span>名前</span><input type="text" name="name" value={isName}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }} /></label>
                            <label htmlFor=""><span>メールアドレス</span><input type="email" name="mail" value={isMail} onChange={(e) => {
                                setMail(e.target.value);
                            }} /></label>
                            <label htmlFor=""><span>電話番号</span><input type="tel" name="tel" value={isTel} onChange={(e) => {
                                setTel(e.target.value);
                            }} /></label>
                        </div>
                        <div className="info address">
                            <h2>住所情報</h2>
                            <label htmlFor=""><span>郵便番号</span><input type="text" name="addressNum" value={isAddressNum} onChange={(e) => {
                                setAddressNum(e.target.value);
                            }} /></label>
                            <label htmlFor=""><span>住所</span><input type="text" name="address" value={isAddress} onChange={(e) => {
                                setAddress(e.target.value);
                            }} /></label>
                        </div>
                        <div className="btns">
                            <button type="button" onClick={() => {
                                secondStep();
                                TxtSave();
                            }}>お支払い情報を入力</button>
                        </div>
                    </>
                }
                {/* 支払い情報関連 */}
                {isPayment &&
                    <>
                        <div className="info payment">
                            <h2>お支払い情報</h2>
                            <label htmlFor="credit"><input type="radio" name="payment" id="credit" value="クレジットカード" onChange={(e) => {
                                getPaymentValue(e.target);
                            }} />クレジットカード</label>
                            <label htmlFor="cash"><input type="radio" name="payment" id="cash" value="代金引換" onChange={(e) => {
                                getPaymentValue(e.target);
                            }} />代金引換</label>
                            <label htmlFor="bank"><input type="radio" name="payment" id="bank" value="銀行振込（コンビニ決済）" onChange={(e) => {
                                getPaymentValue(e.target);
                            }} />銀行振込（コンビニ決済）</label>
                        </div>
                        <div className="info addressShipping">
                            <h2>お届け先情報</h2>
                            <label id="shippingChoice" htmlFor="shippingCheck">
                                <div className="switcher">
                                    {/* isSwitcher:true の場合は checked */}
                                    <input checked={isSwitcher} type="checkbox" name="shippingChoice" id="shippingCheck" onChange={switcher} />
                                </div>
                                <p>お届け先は現住所と同じ</p>
                            </label>
                            <label htmlFor=""><span>お届け先の郵便番号</span>
                                {isSwitcher ?
                                    <input type="text" name="shippingAddressNum" value={isAddressNum} readOnly /> :
                                    <input type="text" name="shippingAddressNum" value={isShippingAddressNum} onChange={(e) => {
                                        setShippingAddressNum(e.target.value);
                                    }} />
                                }
                            </label>
                            <label htmlFor=""><span>お届け先の住所</span>
                                {isSwitcher ?
                                    <input type="text" name="shippingAddressNum" value={isAddress} readOnly /> :
                                    <input type="text" name="shippingAddress" value={isShippingAddress} onChange={(e) => {
                                        setShippingAddress(e.target.value);
                                    }} />
                                }
                            </label>
                        </div>
                        <div className="btns notSingle">
                            <button type="button" onClick={firstStep}>個人・住所情報を入力に戻る</button>
                            <button type="button" onClick={thirdStep}>確認内容に進む</button>
                        </div>
                    </>
                }
                {/* 入力内容の確認画面 */}
                {isConfirm &&
                    <Result>
                        <label><span>名前：</span>{isName}</label>
                        <label><span>メールアドレス：</span>{isMail}</label>
                        <label><span>電話番号：</span>{isTel}</label>
                        <label><span>郵便番号：</span>{isAddressNum}</label>
                        <label><span>住所：</span>{isAddress}</label>
                        <label><span>決済方法：</span>{isPaymentAry[isPaymentAry.length - 1]}</label>
                        <label><span>お届け先の郵便番号：</span>
                            {isSwitcher && isShippingAddressNum.length <= 0 ?
                                isAddressNum : isShippingAddressNum
                            }
                        </label>
                        <label><span>お届け先の住所：</span>
                            {isSwitcher && isShippingAddress.length <= 0 ?
                                isAddress : isShippingAddress
                            }
                        </label>
                        <div className="btns">
                            <button type="button" onClick={secondStep}>お支払い情報の入力に戻る</button>
                        </div>
                        <label><input type="submit" value="内容を送信" /></label>
                    </Result>
                }
            </form>
        </TheFormWrapper>
    );
})

const TheFormWrapper = styled.div`
width: clamp(160px, 100%, 400px);
@media screen and (min-width: 1025px){
    width: clamp(160px, calc(100vw/2), 560px);
}
margin: 5em auto;

& .switcher{
    width: 50px;
    height: 20px;
    border-radius: 50px;
    line-height: 1;
    background-color: #bebebe;
    position: relative;

    & input[type="checkbox"]{
        appearance: none;
        border: none;
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: #fff;
        width: 28px;
        height: 28px;
        margin: 0;
        position: absolute;
        top: 50%;
        left: 0%;
        transform: translate(0%, -50%);
        transition: all .25s;

        &:checked{
            left: 100%;
            transform: translate(-100%, -50%);
            background-color: #33cc58;
        }
    }
}

& .btns{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    &.notSingle{
        justify-content: space-between;

        & button{
            width: 48%;
        }
    }
    
    & button{
        border-radius: 0;
        border: none;
        background-color: #333;
        color: #fff;
        line-height: 1.8;
        padding: 1em .25em;
        margin: 0;
        width: 50%;
        font-size: 1.4rem;

        @media screen and (min-width: 1025px){
            font-size: 14px;
        }
    }
}

& .stepStatus{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    margin-bottom: 3em;

    & div{
        width: 24%;
        text-align: center;
        
        &:not(:last-of-type){
            & p{
                &:first-of-type{
                    position: relative;
    
                    &::after{
                        content: "";
                        width: 50%;
                        height: 1px;
                        background-color: #dadada;
                        position: absolute;
                        top: 50%;
                        left: 150%;
                        transform: translate(50%, -50%);
                    }
                }
            }
        }

        & p{
            font-size: 1.2rem;
    
            @media screen and (min-width: 1025px){
                font-size: 16px;
            }
    
            &:first-of-type{
                display: grid;
                place-items: center;
                place-content: center;
                background-color: #fff;
                border: 1px solid #333;
                aspect-ratio: 1;
                border-radius: 50%;
                width: 50%;
                margin: auto;
            }
        }

        &.currentStep{
            & p{
                &:first-of-type{
                    background-color: #3838c1;
                    color: #fff;
                    border-color: #fff;

                    &::after{
                        background-color: #3838c1;
                    }
                }

                &:last-of-type{
                    color: #3838c1;
                }
            }
        }
    }
}

& form {
    padding: 2em;
    box-shadow: 0 0 8px rgba(0,0,0,.25) inset; 
    border-radius: 4px;

    & .info{
        & h2{
            font-size: 1.6rem;
            position: relative;

            &::before{
                content: "";
                width: 100%;
                height: 1px;
                background-color: #dadada;
                position: absolute;
                top: 100%;
                left: 0;
            }

            @media screen and (min-width: 1025px){
                font-size: 20px;
            }
        }

        & label {
            display: block;
            line-height: 2;
            font-size: 1.4rem;

            @media screen and (min-width: 1025px){
                font-size: 16px;
            }

            &:not(:last-of-type){
                margin-bottom: 1em;
            }
            
            & span{
                line-height: 1.4;
                display: block;
            }

            & input{
                appearance: none;
                border: 1px solid #dadada;
                background-color: #fff;
                border-radius: 0;
                width: 100%;
                line-height: 2;

                &[type="radio"] {
                    width: auto;
                    appearance: auto;
                    vertical-align: middle;
                    margin: 0;
                }
            }
        }

        &.payment {
            & label {
                &:not(:last-of-type){
                    margin-bottom: .25em;
                }
            }
        }

        &.addressShipping{
            & #shippingChoice{
                background-color: #dadada;
                padding: .5em .25em .5em .5em;
                margin-bottom: .5em;
                display: flex;
                gap: 2%;

                & p{
                    margin: 0;
                    line-height: 1.5;
                }
            }
        }

        &:not(:last-of-type){
            margin-bottom: 3em;
        }
    }
}
`;

const Result = styled.div`
& label{
    display: block;
    margin-bottom: 2em;
    font-size: 16px;
    font-weight: bold;

    &:not(:last-of-type){
        border-bottom: 1px solid #dadada;
        padding-bottom: 1em;
    }
    
    & span{
        font-weight: normal;
        margin-bottom: .25em;
        display: block;
    }

    & input[type="submit"]{
        display: block;
        border-radius: 0;
        border: none;
        background-color: #3838c1;
        color: #fff;
        width: clamp(80px, calc(100vw/2), 160px);
        margin: 8em auto 0;
        line-height: 44px;
    }
}
`;