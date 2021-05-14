export type ArMapAsyncCallback<T> = (
    element: T,
    index?: number,
    array?: T[]
) => T | Promise<T>;
export type ArMapAsync = <T>(
    input: T[],
    callback: ArMapAsyncCallback<T>,
    thisArg?: any
) => Promise<T[]>;

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

export interface iFunAr {
    async: {
        seq: {
            map: ArMapAsync;
            filter: ArFilterAsync;
            reduce: ArReduceAsync;
            forEach: ArForEachAsync;
            find: ArFindAsync;
        };
        parallel: {
            map: ArMapAsync;
            filter: ArFilterAsync;
            forEach: ArForEachAsync;
        };
    };
}
