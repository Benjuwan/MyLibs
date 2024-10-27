import todoStyle from "./css/todoStyle.module.css";
import { Fragment, SyntheticEvent } from "react";
import { useAtom } from "jotai";
import { isDesktopViewAtom, todoMemoAtom } from "../../ts/calendar-atom";
import { TodoItems } from "./TodoItems";

export const TodoList = ({ todoID }: { todoID: string }) => {
    const [todoMemo] = useAtom(todoMemoAtom);
    const [desktopView] = useAtom(isDesktopViewAtom);

    /* モーダル表示関連（ToDoの詳細表示オン・オフ）*/
    const OnViewModalWindow: (viewerParentElm: HTMLElement) => void = (viewerParentElm: HTMLElement) => {
        const modalWindow: Element | null = viewerParentElm.querySelector(`.${todoStyle.modalWindow}`);
        modalWindow?.classList.add(`${todoStyle.modalWindowOnView}`);
    }

    return (
        <>
            {todoMemo.length > 0 &&
                <ul className={todoStyle.todoLists}>
                    {todoMemo.map(todoItem => (
                        <Fragment key={todoItem.uuid}>
                            {/* yyyy/MM/dd が一致した場合 */}
                            {todoItem.todoID === todoID ?
                                <li onClick={(liElm: SyntheticEvent<HTMLLIElement>) => {
                                    OnViewModalWindow(liElm.currentTarget);
                                    window.scrollTo(0, 0);
                                }}>
                                    {desktopView ?
                                        <div className={todoStyle.editTargetContent}>
                                            <p className={todoStyle.editTargetStr}>{todoItem.todoContent}</p>
                                            {todoItem.startTime && <span>開始時刻：{todoItem.startTime}</span>}
                                            {todoItem.finishTime && <span>終了時刻：{todoItem.finishTime}</span>}
                                        </div> :
                                        <p className={todoStyle.isMobileNotice}>
                                            {todoItem.todoContent.length > 8 ?
                                                <>{todoItem.todoContent.slice(0, 8)}...</> :
                                                <>{todoItem.todoContent}</>
                                            }
                                        </p>
                                    }
                                    <TodoItems todoItem={todoItem} />
                                </li>
                                : null
                            }
                        </Fragment>
                    ))}
                </ul>
            }
        </>
    );
}