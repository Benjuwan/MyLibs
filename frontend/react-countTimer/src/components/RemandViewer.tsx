import { useAtom } from "jotai"
import { countTimerAtom } from "../ts/atom"
import styled from "styled-components";

export const RemandViewer = () => {
    const [countTimer] = useAtom(countTimerAtom);

    return (
        <Result id="result">
            <p>残り：
                <span id="year">{countTimer?.year}</span>年
                <span id="month">{countTimer?.month}</span>ヶ月
                <span id="daydate">{countTimer?.dayDate}</span>日
                <span id="hour">{countTimer?.hour}</span>：<span id="minutes">{countTimer?.minute}</span>：<span id="seconds">{countTimer?.second}</span>
            </p>
        </Result>
    );
}

const Result = styled.div`
margin: 1em auto;

    & p {
        line-height: 2;
        display: flex;
        align-items: center;
        font-weight: bold;

            & span {
                display: inline-block;
                font-weight: normal;
                color: #333;
                border: 3px solid;
                background-color: #dadada;
                border-radius: 8px;
                padding: 0 1em;
                margin: 0 .25em;
            }
    }
`;