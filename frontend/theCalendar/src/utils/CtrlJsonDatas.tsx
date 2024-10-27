import styled from "styled-components";
import { memo } from "react";
import { ExportJsonData } from "./ExportJsonData";
import { ImportJsonData } from "./ImportJsonData";

export const CtrlJsonDatas = memo(({ both }: { both?: boolean }) => {
    return (
        <CtrlJsonData>
            {both && <ExportJsonData />}
            <ImportJsonData />
        </CtrlJsonData>
    );
});

const CtrlJsonData = styled.div`
display: flex;
flex-flow: row wrap;
gap: 2em;
box-shadow: 0 0 8px rgba(160, 160, 160, .5) inset;
padding: 1em;
margin: 2.5em auto;
border-radius: .4rem;

    & a {
        display: block;
        text-align: center;
        width: 100%;
        padding: .25em .5em;
        text-decoration : none;
        color: #fff;
        background-color: #f0b20e;
        border: 1px solid transparent;
        border-radius: .4rem;

        &.disabled {
            pointer-events: none;
            background-color: #333;
        }

        &:not(.disabled):hover {
            color: #f0b20e;
            border-color: #f0b20e;
            background-color: #fff;
        }
    }

    & .dataLabel {
        display: block;
        border-left: 4px solid #f0b20e;
        padding-left: .5em;
        margin-bottom: .5em;
    }

@media screen and (min-width: 1025px) {
    border-radius: 4px;

    & a {
        border-radius: 4px;
    }
}
`;