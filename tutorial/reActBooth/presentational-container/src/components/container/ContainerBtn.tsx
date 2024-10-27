/**
 * Container Component：表象的なコンポーネント（Presentational Component）を包含（import）したコンテナのようにそれを入れて動かすコンポーネント
*/

import { useState } from "react";
import { PresentationalBtn } from "../presentational/PresentationalBtn"; // Presentational Component

export const ContainerBtn = () => {
    // consoleMethod
    const consoleMethod = () => {
        console.log('コンソールにダンプ');
    }

    // alartMethod
    const alartMethod = () => {
        alert('アラートに出力');
    }

    // FizzBuzz
    const [fizzBuzzState, setFizzBuzzState] = useState<string>('');
    const fizzBuzz = (setNumber: number) => {
        const numValue = Math.floor(Math.random() * setNumber);
        let subjectTxt: string = '';

        // numValue % 15 === 0 
        if (
            numValue % 3 === 0 &&
            numValue % 5 === 0
        ) {
            console.log(`FizzBuzz：${numValue}`);
            subjectTxt = 'FizzBuzz';
        } else if (numValue % 5 === 0) {
            console.log(`Fizz：${numValue}`);
            subjectTxt = 'Fizz';
        } else if (numValue % 3 === 0) {
            console.log(`Buzz：${numValue}`);
            subjectTxt = 'Buzz';
        } else {
            console.log(`noFizzBuzz：${numValue}`);
            subjectTxt = 'noFizzBuzz';
        }

        // return `${subjectTxt}:${numValue}`;
        setFizzBuzzState((prevState) => `${subjectTxt}:${numValue}`);
    }

    return (
        <>
            <PresentationalBtn btnTxt={fizzBuzzState.length <= 0 ? 'fizzBuzz問題' : fizzBuzzState} method={() => {
                fizzBuzz(100);
            }} anyClassName="anyClassName_001" />

            <PresentationalBtn method={undefined} />

            <PresentationalBtn btnTxt="コンソールダンプ" method={consoleMethod} anyClassName="anyClassName_003" />

            <PresentationalBtn btnTxt="アラート" method={alartMethod} anyClassName="anyClassName_002" />
        </>
    );
}