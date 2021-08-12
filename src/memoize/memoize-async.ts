import { Equals } from "../equals/equals";
import {
    iMemoizationCacheExpirationOptions,
    iMemoizationOptions,
    iMemoizeAsync,
} from "../models/memoize";

export const MemoizeAsync: iMemoizeAsync = <
    ParamsType extends any[],
    ReturnType
>(
    func: (...params: ParamsType) => Promise<ReturnType>,
    options?: iMemoizationOptions
): ((...params: ParamsType) => Promise<ReturnType>) => {
    const mergedOptions = {
        ...options,
    };
    const cache: [ParamsType, ReturnType][] = [];
    const findCacheIndex = (params: ParamsType) => {
        return cache.findIndex((item) => Equals(item[0], params));
    };

    const setExpireCountdown = (
        params: ParamsType,
        expirationOptions: iMemoizationCacheExpirationOptions
    ) => {
        const clearCacheEntry = () => {
            const existingEntryIndex = findCacheIndex(params);
            cache.splice(existingEntryIndex, 1);
        };

        switch (expirationOptions.type) {
            case "absolute":
            case "relative":
                const expireEvaluate = expirationOptions.evaluate() as number;
                const expireInterval = Math.max(
                    1,
                    expirationOptions.type === "absolute"
                        ? expireEvaluate - +new Date()
                        : expireEvaluate
                );
                setTimeout(clearCacheEntry, expireInterval);
                break;
            case "promise-resolution":
                (expirationOptions.evaluate() as Promise<void>).then(clearCacheEntry);
                break;
        }
    };

    return async (...params: ParamsType) => {
        const existingEntryIndex = findCacheIndex(params);
        if (existingEntryIndex > -1) {
            return cache[existingEntryIndex][1];
        } else {
            const result = await func(...params);
            cache.push([params, result]);

            if (mergedOptions.cacheExpiration) {
                setExpireCountdown(params, mergedOptions.cacheExpiration);
            }

            return result;
        }
    };
};
