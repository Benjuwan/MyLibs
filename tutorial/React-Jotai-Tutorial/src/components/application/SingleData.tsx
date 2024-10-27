import { pokeDataType } from "./ts/pokedata"

type singleDataPropsType = {
    pokeItem: pokeDataType;
}

export const SingleData = ({ pokeItem }: singleDataPropsType) => {
    const itemStyle: object = {
        'lineHeight': '1.5',
        'fontSize': '14px',
        'width': '100%',
        'textAlign': 'center',
        'margin': '2.5em auto'
    }

    return (
        <>
            {pokeItem.name !== undefined &&
                <div style={itemStyle}>
                    <p>name：{pokeItem.name}</p>
                    <p>weight：{pokeItem.weight} / height：{pokeItem.height}</p>
                    <img src={pokeItem.sprites?.front_default} alt={pokeItem.name} />
                </div>
            }
        </>
    );
}