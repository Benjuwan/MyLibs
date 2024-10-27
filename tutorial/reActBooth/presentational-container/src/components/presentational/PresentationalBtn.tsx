/**
 * Presentational Component：表象的なコンポーネント
*/

import { ReactNode, FC } from "react";
import styled from "styled-components";

type btnProps = {
    btnTxt?: string | HTMLElement | ReactNode;
    method: undefined | (() => void); // ユニオンで使用する場合、関数の型の表記はかっこで囲む必要がある。() => void → (() => void)
    anyClassName?: string;
}

export const PresentationalBtn: FC<btnProps> = (props) => {
    const { btnTxt, method, anyClassName } = props;
    return (
        <Btn
            type="button"
            onClick={method}
            className={anyClassName ? `${anyClassName}` : 'defaultStyle'}
        >
            {btnTxt ? `${btnTxt}` : 'ただのボタン'}
        </Btn>
    );
}

const Btn = styled.button`
display: block;
cursor: pointer;
appearance: none;
border-radius: 4px;
border: unset;
width: clamp(160px, calc(100vw/2), 320px);
margin: 1em auto;
line-height: 2;
color: #fff;

    &.defaultStyle {
        background-color: #6e6e6e;
        border-bottom: 3px solid #333;
    }

    &.anyClassName_001 {
        background-color: #fff;
        color: #333;
        border: 1px solid #333;
        border-bottom: 3px solid #333;

        &:hover {
            border-bottom: 1px solid #333;
        }
    }

    &.anyClassName_002 {
        background-color: #a00f0f;
        border-bottom: 3px solid #370606;
    }

    &.anyClassName_003 {
        background-color: #0d1893;
        border-bottom: 3px solid #110637;
    }

    &:hover {
        transition: all.25s;
        border-bottom-color: transparent;
        transform: translateY(3px);
    }
`;