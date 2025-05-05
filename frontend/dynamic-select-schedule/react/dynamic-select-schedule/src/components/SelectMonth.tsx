import { ChangeEvent, useMemo } from "react";
import { useAtom } from "jotai";
import { monthAtom } from "../providers/atom";
import { useCreateEachSelectOptions } from "../hooks/useCreateEachSelectOptions";
import { useChangeData } from "../hooks/useChangeDate";

export const SelectMonth = () => {
    const [month, setMonth] = useAtom(monthAtom);

    const { createEachSelectOptions } = useCreateEachSelectOptions();
    const { changeData } = useChangeData();

    const handleChangeMonth: (e: ChangeEvent<HTMLSelectElement>) => void = (e: ChangeEvent<HTMLSelectElement>) => {
        setMonth(parseInt(e.target.value));
        changeData(e); // 再レンダリングのスナップショットより優先して更新させるため値を直接渡す
    }

    const options: string[] = useMemo(() => {
        return createEachSelectOptions(1, 12);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <select name="schedule-months" id="schedule-months"
            defaultValue={month} // option に selected を付与するとエラーが発生するので React のエラー指示通り親（select）の defaultValue に指定
            onChange={handleChangeMonth}
            className="bg-gray-200 rounded"
        >
            {options.length > 0 &&
                options.map((optionElm) => (
                    <option key={optionElm} value={optionElm}>{optionElm}</option>
                ))
            }
        </select>
    );
}