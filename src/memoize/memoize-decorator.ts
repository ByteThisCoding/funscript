import { iMemoizationOptions } from "../models/memoize";
import { Memoize } from "./memoize";

export function MemoizeMethod(memoizationOptions?: iMemoizationOptions) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {

        let thisRef: any;
        const original = descriptor.value;
        const memoized = Memoize((...args: any[]) => {
            return original.apply(thisRef, args);
        }, memoizationOptions);
        descriptor.value = function(...args: any[]) {
            thisRef = this;
            return memoized(...args);
        }
    };
}
