import { Fragment, SyntheticEvent } from "react";
import { useAtom } from "jotai";
import { isDesktopViewAtom, todoMemoAtom } from "../../ts/calendar-atom";
import { TodoItems } from "./TodoItems";

export const TodoList = ({ todoID }: { todoID: string }) => {
    const [todoMemo] = useAtom(todoMemoAtom);
    const [desktopView] = useAtom(isDesktopViewAtom);

    /* モーダル表示関連（ToDoの詳細表示オン・オフ）*/
    const OnViewModalWindow: (viewerParentElm: HTMLElement) => void = (viewerParentElm: HTMLElement) => {
        const modalWindow: Element | null = viewerParentElm.querySelector('.modalWindow');
        modalWindow?.classList.add('modalWindowOnView');
    }

    return (
        <>
            {todoMemo.length > 0 &&
                <ul className="text-[0.875rem] leading-[1.8] mt-[1em] max-h-[10rem] overflow-y-auto">
                    {todoMemo.map(todoItem => (
                        <Fragment key={todoItem.uuid}>
                            {/* yyyy/MM/dd が一致した場合 */}
                            {todoItem.todoID === todoID ?
                                <li
                                    className="todoItem flex flex-row flex-wrap justify-center gap-[.5em] bg-[#fafafa] p-[.25em] shadow-[0_0_8px_rgba(0,0,0,.25)_inset] rounded hover:cursor-pointer not-last-of-type:mb-[1em]"
                                    onClick={(liElm: SyntheticEvent<HTMLLIElement>) => {
                                        OnViewModalWindow(liElm.currentTarget);
                                        window.scrollTo(0,0);
                                    }}>
                                    {desktopView ?
                                        <div className="text-left hover:text-[#59b835] p-[.5em]">
                                            <p className="text-center mb-[.5em] font-bold">{todoItem.todoContent}</p>
                                            {todoItem.startTime && <span className="block text-[0.625rem] mb-[.5em]">開始時刻：{todoItem.startTime}</span>}
                                            {todoItem.finishTime && <span className="block text-[0.625rem]">終了時刻：{todoItem.finishTime}</span>}
                                        </div> :
                                        <p className="isMobileNotice text-[clamp(0.5rem,calc(100vw/32),0.625rem)]">
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