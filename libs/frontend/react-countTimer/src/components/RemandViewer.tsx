import { useAtom } from "jotai"
import { countTimerAtom } from "../ts/atom"

export const RemandViewer = () => {
    const [countTimer] = useAtom(countTimerAtom);

    return (
        <section id="result" className="my-[1em] mx-auto text-[#333]">
            <p className="leading-[2] flex items-center justify-center font-bold">残り：
                <span id="year" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.year}</span>年
                <span id="month" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.month}</span>ヶ月
                <span id="daydate" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.dayDate}</span>日
                <span id="hour" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.hour}</span>：<span id="minutes" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.minute}</span>：<span id="seconds" className="inline-block border border-[0.125rem] border-[#333] bg-[#dadada] rounded-[.5rem] px-[1em] mx-[.25em]">{countTimer?.second}</span>
            </p>
        </section>
    );
}