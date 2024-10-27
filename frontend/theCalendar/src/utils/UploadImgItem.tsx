import { ChangeEvent, memo, useEffect } from "react";
import { useAtom } from "jotai";

type UploadImgItemType = {
    anyItem: any;
    setanyItem: React.Dispatch<React.SetStateAction<any>>;
}

export const UploadImgItem = memo(({ props }: { props: UploadImgItemType }) => {
    const { anyItem, setanyItem } = props;

    const handleItemImgSrc: (value: string) => void = (value: string) => {
        const newanyItem: any = {
            ...anyItem,
            itemImg: value
        }
        setanyItem((_prevanyItem) => newanyItem);
    }

    const [anyLists] = useAtom(anyAtom);

    const fileAccept: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']; // input[type="file"] で指定可能な mineType

    const uploadImgView: (fileElm: HTMLInputElement) => void = (fileElm: HTMLInputElement) => {
        // 画像アップロードの取り消しを行った場合は画像を画面から削除  
        if (fileElm.files?.length === 0) {
            handleItemImgSrc('');
            return; // 早期リターンで処理終了
        }

        if (
            fileElm.files !== null &&
            fileElm.files[0].size &&
            fileElm.files[0].size >= (1000 * 1000)
        ) {
            alert('1MB以下の画像をアップできます'); // 1MB = 1,000,000（1000b：1kb * 1000:1000kb：1mb）
            return; // 早期リターンで処理終了
        }

        const files = fileElm.files ?? fileElm.files;

        // FileList のままだと forEach が使えないので配列に変換する
        const fileArray: File[] | null = Array.from(files as FileList);
        fileArray.forEach((file) => {
            // ファイルを読み込むために FileReader を利用する
            const reader: FileReader = new FileReader();

            // ファイルの読み込みが完了したら画像の配列に加える
            reader.onloadend = () => {
                const result = reader.result as string;
                handleItemImgSrc(result);
            };

            // 画像ファイルを base64 形式で読み込む
            reader.readAsDataURL(file);
        });
    };

    /* input[type="file"] の中身をリセット（初期化）*/
    const resetInputTypeFileData: () => void = () => {
        const inputFile: HTMLInputElement | null = document.querySelector('.anySection input[type="file"]');
        const fileElmFileProp: FileList | null | undefined = inputFile?.files;

        if (
            (fileElmFileProp && fileElmFileProp.length > 0) &&
            inputFile?.value
        ) {
            inputFile.value = ''; // input[type="file"] の中身をリセット（初期化）
        }
    }

    useEffect(() => resetInputTypeFileData(), [anyLists]);

    return (
        <>
            <input
                type="file"
                accept={`${[...fileAccept]}`}
                onChange={(fileElm: ChangeEvent<HTMLInputElement>) => uploadImgView(fileElm.currentTarget)}
                id="itemImgSrc"
            />
            {anyItem.itemImg && <img src={anyItem.itemImg} />}
        </>
    );
});