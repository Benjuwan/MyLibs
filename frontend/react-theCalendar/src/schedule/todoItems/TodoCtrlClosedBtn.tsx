import { SyntheticEvent, memo } from "react";
import { useViewTodoCtrl } from "./hooks/useViewTodoCtrl";

export const TodoCtrlClosedBtn = memo(() => {
    const { viewTodoCtrl } = useViewTodoCtrl();
    const handleOpenClosedBtnClicked: (btnEl: SyntheticEvent<HTMLButtonElement>) => void = (btnEl: SyntheticEvent<HTMLButtonElement>) => {
        viewTodoCtrl(btnEl.currentTarget);
        window.scrollTo(0, 0);
    }

    return (
        <button className="todoCtrlClose cursor-pointer bg-[#333] aspect-square rounded-full w-[2.75rem] h-[2.75rem] grid place-content-center m-auto font-bold rounded-full mx-auto mb-[2.5em] py-[.5em] px-[1em] hover:opacity-[.75]" onClick={handleOpenClosedBtnClicked}>
            <span className="material-symbols-outlined text-[#767676] align-middle brightness-[3]">close</span>
        </button>
    );
});