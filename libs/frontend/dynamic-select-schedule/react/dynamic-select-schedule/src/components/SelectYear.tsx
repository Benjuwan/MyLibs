import { ChangeEvent, useMemo } from "react";
import { useAtom } from "jotai";
import { yearAtom } from "../providers/atom";
import { useCreateEachSelectOptions } from "../hooks/useCreateEachSelectOptions";
import { useChangeData } from "../hooks/useChangeDate";

export const SelectYear = () => {
    const [year, setYear] = useAtom(yearAtom);

    const { createEachSelectOptions } = useCreateEachSelectOptions();
    const { changeData } = useChangeData();

    const handleChangeYear: (e: ChangeEvent<HTMLSelectElement>) => void = (e: ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value));
        changeData(e); // 再レンダリングのスナップショットより優先して更新させるため値を直接渡す
    }

    const startYear: number = useMemo(() => 1990, []);
    const currYear: number = useMemo(() => new Date().getFullYear(), []);
    const options: string[] = useMemo(() => {
        return createEachSelectOptions(startYear, currYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <select name="schedule-year" id="schedule-year"
            defaultValue={year} // option に selected を付与するとエラーが発生するので React のエラー指示通り親（select）の defaultValue に指定
            onChange={handleChangeYear}
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