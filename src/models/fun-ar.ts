export type ArMapAsyncCallback<InputT, OutputT> = (
    element: InputT,
    index?: number,
    array?: InputT[]
) => OutputT | Promise<OutputT>;
export type ArMapAsync = <InputT, OutputT>(
    input: InputT[],
    callback: ArMapAsyncCallback<InputT, OutputT>,
    thisArg?: any
) => Promise<OutputT[]>;

export type ArFilterAsyncCallback<T> = (
    element: T,
    index?: number,
    array?: T[]
) => boolean | Promise<boolean>;
export type ArFilterAsync = <T>(
    input: T[],
    callback: ArFilterAsyncCallback<T>,
    thisArg?: any
) => Promise<T[]>;

export type ArReduceAsyncCallback<T, A> = (
    accumulator: A,
    element: T,
    index?: number,
    array?: T[]
) => A | Promise<A>;
export type ArReduceAsync = <T, A>(
    input: T[],
    callback: ArReduceAsyncCallback<T, A>,
    initialValue?: A
) => Promise<A>;

export type ArForEachAsyncCallback<T> = (
    element: T,
    index?: number,
    array?: T[]
) => any;
export type ArForEachAsync = <T>(
    input: T[],
    callback: ArForEachAsyncCallback<T>,
    thisArg?: any
) => Promise<void>;

export type ArFindAsyncCallback<T> = (
    element: T,
    index?: number,
    array?: T[]
) => boolean | Promise<boolean>;
export type ArFindAsync = <T>(
    input: T[],
    callback: ArFindAsyncCallback<T>,
    thisArg?: any
) => Promise<T | undefined>;

export type ArFindIndexAsyncCallback<T> = (
    element: T,
    index?: number,
    array?: T[]
) => boolean | Promise<boolean>;
export type ArFindIndexAsync = <T>(
    input: T[],
    callback: ArFindIndexAsyncCallback<T>,
    thisArg?: any
) => Promise<number>;

export interface iFunAr {
    async: {
        seq: {
            map: ArMapAsync;
            filter: ArFilterAsync;
            reduce: ArReduceAsync;
            forEach: ArForEachAsync;
            find: ArFindAsync;
            findIndex: ArFindIndexAsync;
        };
        parallel: {
            map: ArMapAsync;
            filter: ArFilterAsync;
            forEach: ArForEachAsync;
        };
    };
    isSubsetOf<T>(input: T[], of: T[], eq?: (a: T, b: T) => boolean): boolean;
    isSupersetOf<T>(input: T[], of: T[], eq?: (a: T, b: T) => boolean): boolean;
    subset<T>(input: T[], startIndex: number, endIndex: number): T[];
    intersects<T>(a: T[], b: T[], eq?: (a: T, b: T) => boolean): boolean;
    intersection<T>(a: T[], b: T[], eq?: (a: T, b: T) => boolean): T[];
    uniqueValues<T>(input: T[], eq?: (a: T, b: T) => boolean): T[];
    shuffleInPlace<T>(input: T[]): void;
    shuffle<T>(input: T[]): T[];
}
