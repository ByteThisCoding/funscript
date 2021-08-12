export interface iMemoizationOptions {
    cacheExpiration?: iMemoizationCacheExpirationOptions;
}
export interface iMemoizationCacheExpirationOptions {
    evaluate: () => number | Promise<void>;
    type: "absolute" | "relative" | "promise-resolution";
    //absolute: return a number corresponding to absolute Date
    //relative: return a number representing milliseconds from now to expire
    //promise-resolution: expire the cache when the promise resolves
}

export type iMemoize = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => ReturnType,
    options?: iMemoizationOptions
) => (...params: ParamsType) => ReturnType;

export type iMemoizeAsync = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => Promise<ReturnType>,
    options?: iMemoizationOptions
) => (...params: ParamsType) => Promise<ReturnType>;
