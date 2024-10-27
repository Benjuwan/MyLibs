import ddsStyle from "./styles/style.module.css";
import { DragEvent, useRef, useState } from "react";
import { listsType } from "./types/ddsListsType";
import { v4 as uuidv4 } from 'uuid';
import { Form } from "./components/Form";
import { DeleteBtn } from "./components/DeleteBtn";
import { useDragDrop } from "./hooks/useDragDrop";

export const DragDropSort = () => {
    const initLists: listsType[] = [
        { listName: 'hoge', id: uuidv4() },
        { listName: 'foo', id: uuidv4() },
        { listName: 'bar', id: uuidv4() }
    ];
    const [lists, setLists] = useState<listsType[]>(initLists);

    const dropzoneRef = useRef<HTMLUListElement>(null);
    const { dragstart, dragend, dragover, drop } = useDragDrop(dropzoneRef);

    return (
        <section>
            <Form props={{
                lists: lists,
                setLists: setLists
            }} />
            <ul className={ddsStyle.dropzone}
                ref={dropzoneRef}
                onDragStart={(e: DragEvent<HTMLUListElement>) => dragstart(e)}
                onDragEnd={dragend}
                onDragOver={(e: DragEvent<HTMLUListElement>) => dragover(e)}
                onDrop={(e: DragEvent<HTMLUListElement>) => drop(e)}
                // Touch 系統はスマホ用
                onTouchStart={(e: React.TouchEvent<HTMLUListElement>) => dragstart(e)}
                onTouchMove={(e: React.TouchEvent<HTMLUListElement>) => dragover(e)}
                onTouchEnd={(e: React.TouchEvent<HTMLUListElement>) => {
                    drop(e);
                    dragend();
                }}
            >
                {lists.length > 0 && lists.map(list => (
                    // ドラッグ&ドロップを機能させるための必須属性（draggable）を付与
                    <li key={list.id} draggable>
                        {list.listName}
                        <DeleteBtn props={{
                            lists: lists,
                            setLists: setLists,
                            listId: list.id
                        }} />
                    </li>
                ))}
            </ul>
        </section>
    );
}