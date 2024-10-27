// import { FC } from 'react'
import { useAtom } from 'jotai'
import { a, useTransition } from 'react-spring'
import { filteredAtom } from './ts/atom'
import { RemoveFn, TodoItem } from './TodoItem'

type FilteredType = {
    remove: RemoveFn; // TodoList.tsx 13 row にてメソッド定義
}

// export const Filtered: FC<FilteredType> = ({ remove }) => {
export const Filtered = ({ remove }: FilteredType) => {
    const [todos] = useAtom(filteredAtom) // filter後のtodoを管理するatom from atom.ts 21 row

    // react-springの機能。動きを持たせてくれる。
    const transitions = useTransition(todos, {
        keys: (todo) => todo.toString(),
        from: { opacity: 0, height: 0 },
        enter: { opacity: 1, height: 40 },
        leave: { opacity: 0, height: 0 },
    })

    return transitions((style, atom) => (
        <a.div className="item" style={style}>
            <TodoItem atom={atom} remove={remove} />
        </a.div>
    ))
}