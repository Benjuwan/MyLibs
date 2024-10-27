import { ChangeEvent, memo } from "react";
import { useAtom } from "jotai";
import { useCheckJSONByteSize } from "../hooks/useCheckJSONByteSize";

export const ImportJsonData = memo(() => {
    const [anyLists, setanyLists] = useAtom(anyAtom);
    const [, setLocalstorage] = useAtom(anyItemsLocalStorageAtom);

    const localstorageLabelanyItems: string = '';

    const fileAccept: string = 'application/json';

    const { checkJSONByteSize } = useCheckJSONByteSize();

    const inputJsonData = (fileElm: HTMLInputElement) => {
        if (fileElm.files && fileElm.files[0].name !== 'anyitems.json') return; // 所定のファイル名でない場合は早期終了 

        const files = fileElm.files as FileList;
        const file = files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const inputanyItemsJsonData: any[] = JSON.parse(reader.result as string);
            const newanyItems: any[] = [...anyLists, ...inputanyItemsJsonData];
            setanyLists((_prevanyLists) => newanyItems);
            /* ---------------- localStorage 関連の処理（登録）---------------- */
            checkJSONByteSize(JSON.stringify(newanyItems)); // localStorage のストレージ上限チェック
            setLocalstorage((_prevLocalstorage) => newanyItems);
            localStorage.setItem(localstorageLabelanyItems, JSON.stringify(newanyItems));
            location.reload();
        };

        reader.readAsText(file);
    }

    return (
        <label htmlFor="ImportJsonDate">
            <span className="dataLabel">買うものリストの読み込み</span>
            <input
                type="file"
                accept={fileAccept}
                onChange={(fileElm: ChangeEvent<HTMLInputElement>) => inputJsonData(fileElm.currentTarget)}
                id="ImportJsonDate"
            />
        </label>
    );
});