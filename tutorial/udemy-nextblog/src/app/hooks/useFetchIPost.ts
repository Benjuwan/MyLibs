import { articleType } from "@/types";

export const useFetchPost = () => {
    const fetchPost = async (
        url: string
    ): Promise<articleType[]> => {
        const res = await fetch(url);
        const resObj: articleType[] = await res.json();
        // console.log(resObj);
        return resObj
    }

    return { fetchPost }
}