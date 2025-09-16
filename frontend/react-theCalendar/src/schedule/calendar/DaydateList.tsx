import { memo, useMemo } from "react";
import { calendarItemType } from "./ts/calendarItemType";

export const DaydateList = memo(({ days }: { days: calendarItemType[] }) => {
    const theOneWeek = useMemo(() => {
        return days.filter((_, i) => i < 7);
    }, [days]);

    return (
        <>
            {
                theOneWeek.map(day => (
                    <li key={day.day} className="grid place-content-center bg-[#eaeaea] border-r border-r-[#dadada] w-full text-center font-bold first-of-type:border-l border-l-[#dadada]" data-daydate={day.dayDateNum}>{day.dayDate}</li>
                ))
            }
        </>
    );
});