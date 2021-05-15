import { iMemoizationOptions } from "../models/memoize";
import { Memoize } from "./memoize";

export function MemoizeMethod(memoizationOptions?: iMemoizationOptions) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        const original = descriptor.value;
        descriptor.value = Memoize(original.bind(target), memoizationOptions);
    };
}
