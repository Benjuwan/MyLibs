import { ChangeEvent, useState } from "react";

type todoListType = {
    item: string;
    checked: boolean;
}

const checkedStyle: object = {
    'color': '#dadada',
    'textDecorationLine': 'line-through'
}
const defaultStyle: object = {
    'color': '#333'
}

export const DefaultTodoList = () => {
    /* 入力欄 */
    const [inputTxt, setInputTxt] = useState<string>('');
    const entryInputTxt: (inputEl: HTMLInputElement) => void = (inputEl: HTMLInputElement) => {
        const inputValue: string = inputEl.value;
        setInputTxt((_prevInputTxt) => inputValue);
    }

    /* リスト更新（追加）*/
    const [todoList, setTodoList] = useState<todoListType[]>([]);
    const entryTodoList: () => void = () => {
        if (inputTxt.length > 0) {
            const newAry: todoListType = {
                item: inputTxt,
                checked: false // 初期値 false
            }
            setTodoList((_prevTodoList) => [...todoList, newAry]);
            setInputTxt((_prevInputTxt) => '');
        }
    }

    /* リストチェック */
    // updateTodoList：更新用の配列（newAry）を新たに用意して splice で差し替える
    const updateTodoList: (item: todoListType, index: number, bool: boolean) => void = (item: todoListType, index: number, bool: boolean) => {
        const newAry: todoListType = {
            item: item.item,
            checked: bool
        }
        const shallowCopy: todoListType[] = [...todoList];
        shallowCopy.splice(index, 1, newAry);
        setTodoList((_prevTodoList) => shallowCopy);
    }

    // item.checked の値に応じたリストチェックのオンオフ切替
    const checkedSignal: (item: todoListType, index: number) => void = (item: todoListType, index: number) => {
        if (item.checked === true) updateTodoList(item, index, false);
        else updateTodoList(item, index, true);
    }

    /* リスト削除 */
    const deleteItem: (index: number) => void = (index: number) => {
        const shallowCopy: todoListType[] = [...todoList];
        shallowCopy.splice(index, 1);
        // console.log(todoList, shallowCopy);
        setTodoList((_prevTodoList) => shallowCopy);
    }


    return (
        <>
            <form onSubmit={(formEl: ChangeEvent<HTMLFormElement>) => {
                formEl.preventDefault();
                entryTodoList();
            }}>
                <input type="text" value={inputTxt} onInput={(inputEl: ChangeEvent<HTMLInputElement>) => entryInputTxt(inputEl.currentTarget)} placeholder="Type and Enter..." />
            </form>
            {todoList.length > 0 &&
                <ul style={{ 'listStyle': 'none', 'padding': '0', 'lineHeight': '1.5' }}>
                    {todoList.map((item, i) => (
                        <li key={i} style={item.checked ? checkedStyle : defaultStyle}>
                            <label>
                                <input type="checkbox"
                                    style={{ 'appearance': 'none' }}
                                    onChange={() => checkedSignal(item, i)}
                                />
                                No.{i + 1}：{item.item}
                            </label>
                            <button type="button" onClick={() => deleteItem(i)}>×</button>
                        </li>
                    ))}
                </ul>
            }
        </>
    );
}