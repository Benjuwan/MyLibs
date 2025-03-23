import { ChangeEvent } from "react";
import { useAtom } from "jotai";
import { dataOptionsAtom, dateAtom } from "../providers/atom";

export const SelectDate = () => {
    const [date, setDate] = useAtom(dateAtom);
    const [dateOptions] = useAtom(dataOptionsAtom);

    const handleChangeDate: (e: ChangeEvent<HTMLSelectElement>) => void = (e: ChangeEvent<HTMLSelectElement>) => {
        setDate(parseInt(e.target.value));
    }

    console.log(date);
    console.log(dateOptions);

    return (
        <select name="schedule-date" id="schedule-date"
            defaultValue={date}
            onChange={handleChangeDate}
        >
            {dateOptions.length > 0 &&
                dateOptions.map((optionElm) => (
                    <option key={optionElm} value={optionElm}>{optionElm}</option>
                ))
            }
        </select>
    );
}