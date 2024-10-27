import { atom, useAtom } from 'jotai'
import { FormEvent } from 'react'
import { Todo, todosAtom } from './ts/atom'
import { Filter } from './Filter';
import { Filtered } from './Filtered'
import { RemoveFn } from './TodoItem';

export const TodoList = () => {
    //todosAtomに値をセットする【関数のみ】宣言する
    const [, setTodos] = useAtom(todosAtom) // {title: string, completed: boolean}

    // 引数で受け取ったtodo（atom）以外のtodoをtodosにセットする
    /**
     * 【TodoItem.tsx】
     * 消去ボタン。UIにはAnt Designを使用
     * <CloseOutlined onClick={() => remove(atom)} />
    */
    const remove: RemoveFn = (todo) => setTodos((prev) => prev.filter((item) => item !== todo))

    const add = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        /* state を使わず、name 属性名で要素を指定 */
        const title = e.currentTarget.inputTitle.value // 入力を受け取る
        e.currentTarget.inputTitle.value = '' // 入力欄を空にする

        // 配列todosAtomに(既存の配列内容と)受け取った入力(title)と状態(Incompleted)を格納する
        setTodos((prev) => [...prev, atom<Todo>({ title, completed: false })])
    }
    return (
        <form onSubmit={add}>
            <Filter />
            <input name="inputTitle" placeholder="Type ..." />
            <Filtered remove={remove} />
        </form>
    )
}