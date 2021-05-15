import { iMemoizationOptions } from "../models/memoize";
import { Memoize } from "./memoize";
import { MemoizeAsync } from "./memoize-async";

export function MemoizeAsyncMethod(memoizationOptions?: iMemoizationOptions) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const original = descriptor.value;
        descriptor.value = MemoizeAsync(original.bind(target), memoizationOptions);
    };
}
