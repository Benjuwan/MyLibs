import { memo, useState } from "react";
import { useAtom } from "jotai";

export const ExportJsonData = memo(() => {
    const [anyLists] = useAtom(anyAtom);

    const [link, setLink] = useState<string>('');

    const outputJsonData: () => void = () => {
        const fileData: string = JSON.stringify(anyLists);
        const blob: Blob = new Blob([fileData], { type: 'application/json' });
        const url: string = URL.createObjectURL(blob);
        setLink((_prevLink) => url);
    }

    return (
        <div className="ExportJsonData">
            <p className="dataLabel">買うものリストの書き出し</p>
            <a className={anyLists.length > 0 ? 'abled' : 'disabled'} href={link} download={'anyitems.json'} onClick={outputJsonData}>リストを書き出す</a>
        </div>
    );
});