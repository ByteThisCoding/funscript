import { Equals } from "../equals/equals";
import {
    iMemoizationCacheExpirationOptions,
    iMemoizationOptions,
    iMemoize,
} from "../models/memoize";

export const Memoize: iMemoize = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => ReturnType,
    options?: iMemoizationOptions
): ((...params: ParamsType) => ReturnType) => {
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

    return (...params: ParamsType) => {
        const existingEntryIndex = findCacheIndex(params);
        if (existingEntryIndex > -1) {
            return cache[existingEntryIndex][1];
        } else {
            const result = func(...params);
            cache.push([params, result]);

            if (mergedOptions.cacheExpiration) {
                setExpireCountdown(params, mergedOptions.cacheExpiration);
            }

            return result;
        }
    };
};
