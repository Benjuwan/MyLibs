import { atom } from 'jotai'
import type { PrimitiveAtom } from 'jotai'

export type Todo = {
    title: string
    completed: boolean
}

// 現在指定されているfilterを管理するatom(赤枠)
export const filterAtom = atom('all')

// todoリストの各todoを管理するatom
export const todosAtom = atom<PrimitiveAtom<Todo>[]>([])

// filter後のtodoを管理するatom
export const filteredAtom = atom<PrimitiveAtom<Todo>[]>((get) => {
    // 現在のfilterを読み込む
    const filter = get(filterAtom) // 'all', 'completed', 'incompleted' from Filter.tsx

    // 現在のtodosを読み込む
    const todos = get(todosAtom) // {title: string, completed: boolean}

    // filterがallの場合は全てのtodosを返す
    if (filter === 'all') return todos

    // filterがcompletedの時は todosの各atomがcompletedなものを返す
    if (filter === 'completed') return todos.filter((list) => get(list).completed)

    // todosの各atomがIncompletedなものを返す
    return todos.filter((atom) => !get(atom).completed)
})