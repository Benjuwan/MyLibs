import ddsStyle from "../styles/style.module.css";
import { ChangeEvent, useState } from "react";
import { listsType } from "../types/ddsListsType";
import { v4 as uuidv4 } from 'uuid';
import { useHandleInputValueSanitize } from "../../../hooks/useHandleInputValueSanitize";

type formProps = {
    lists: listsType[];
    setLists: React.Dispatch<React.SetStateAction<listsType[]>>;
};

export const Form = ({ props }: { props: formProps }) => {
    const { lists, setLists } = props;

    const [entryWord, setEntryWord] = useState<string>('');
    const { handleInputValueSanitize } = useHandleInputValueSanitize();
    const handleEntryWord: (entry: ChangeEvent<HTMLInputElement>) => void = (entry: ChangeEvent<HTMLInputElement>) => {
        setEntryWord(handleInputValueSanitize(entry.target.value));
    }

    /* 新規リスト生成 */
    const createNewEntry: () => void = () => {
        setEntryWord(''); // 入力内容の初期化
        const newLists: listsType = {
            listName: entryWord,
            id: uuidv4()
        }
        setLists([...lists, newLists]);
    }

    const handleSubmit: () => void = () => {
        if (entryWord.length > 0) createNewEntry();
    }

    return (
        <form id="entryForm" className={ddsStyle.theForm} onSubmit={(e: ChangeEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit();
        }}>
            <input type="text" id="entry" value={entryWord} onInput={(e: ChangeEvent<HTMLInputElement>) => handleEntryWord(e)} />
            <button type="button" id="entryBtn" onClick={handleSubmit} disabled={entryWord.length <= 0}>add word</button>
        </form>
    );
}