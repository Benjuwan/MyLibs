export type WithInitialValue<Value> = {
    init: Value;
}

export type pokeRootType = {
    // count: number;
    // next: string | null;
    // previous: string | null;
    results: pokeListType[] // pokeListType[]：配列（オブジェクト）として扱う（でないと [[data-1, data-2, data-3,,,]] という配列にネストされる形になってしまうため）
}

export type pokeListType = {
    name: string;
    url: string;
}

export type pokeDataType = {
    name?: string;
    weight?: number;
    height?: number;
    sprites?: {
        front_default: string;
    }
}