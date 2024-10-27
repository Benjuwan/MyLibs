import { PrimitiveAtom, useAtom } from 'jotai'
import { CloseOutlined } from '@ant-design/icons'
import { Todo } from './ts/atom'

// todoを消去する関数の型を宣言
export type RemoveFn = (item: PrimitiveAtom<Todo>) => void;

// TodoItemは状態とatom自身を消去する型を持つ
type TodoItemProps = {
    atom: PrimitiveAtom<Todo> // {title: string, completed: boolean}
    remove: RemoveFn // TodoList.tsx 13 row にてメソッド定義
}

export const TodoItem = ({ atom, remove }: TodoItemProps) => {
    // 引数で与えられたatomをitemに格納
    const [item, setItem] = useAtom(atom) // {title: string, completed: boolean}

    // 元のtodoからcompletedの値だけを逆にする
    const newAry: Todo = {
        title: item.title,
        completed: !item.completed
    }
    const toggleCompleted = () => setItem((_prevItem) => newAry);
    // const toggleCompleted = () => setItem((list) => ({ ...list, completed: !list.completed }))

    return (
        <>
            {/* チェックボックスの描画 */}
            <input type="checkbox" checked={item.completed} onChange={toggleCompleted} />

            {/* completedの値によって取り消し線を描画 */}
            <span style={{ textDecoration: item.completed ? 'line-through' : '' }}>{item.title}</span>

            {/* 消去ボタン。UIにはAnt Designを使用 */}
            <CloseOutlined onClick={() => remove(atom)} />
        </>
    )
}