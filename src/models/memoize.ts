export interface iMemoizationOptions {
    cacheExpiration?: iMemoizationCacheExpirationOptions;
}
export interface iMemoizationCacheExpirationOptions {
    evaluate: () => number;
    type: "absolute" | "relative";
}

export type iMemoize = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => ReturnType,
    options?: iMemoizationOptions
) => (...params: ParamsType) => ReturnType;

export type iMemoizeAsync = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => Promise<ReturnType>,
    options?: iMemoizationOptions
) => (...params: ParamsType) => Promise<ReturnType>;
