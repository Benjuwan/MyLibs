import { articleType } from "@/types";
import { ArticleCard } from "./ArticleCard";

export const ArticleList = ({ articles }: { articles: articleType[] }) => {
    /* 投稿日時によるソート（降順）*/
    const createdAtSort_articles: articleType[] = [...articles].sort((aheadElm, behindElm) => {
        const localStrDate_aheade: string = new Date(aheadElm.createdAt).toLocaleString().replaceAll('/', '').replaceAll(':', '').replace(' ', '');
        const localStrDate_behind: string = new Date(behindElm.createdAt).toLocaleString().replaceAll('/', '').replaceAll(':', '').replace(' ', '');
        const numberLocalStrDate_ahead: number = parseInt(localStrDate_aheade);
        const numberLocalStrDate_behind: number = parseInt(localStrDate_behind);
        return numberLocalStrDate_behind - numberLocalStrDate_ahead;
    });

    return <div>{createdAtSort_articles.map(article => <ArticleCard article={article} key={article.id} />)}</div>
}