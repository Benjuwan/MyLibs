import { listsType } from "../types/ddsListsType";

type formProps = {
    lists: listsType[];
    setLists: React.Dispatch<React.SetStateAction<listsType[]>>;
    listId: string
};

export const DeleteBtn = ({ props }: { props: formProps }) => {
    const { lists, setLists, listId } = props;

    const listDelete = (id: string) => {
        const filterLists: listsType[] = [...lists].filter(list => list.id !== id);
        setLists(filterLists);
    }

    return (
        <button type="button" onClick={() => listDelete(listId)}>☓</button>
    );
}