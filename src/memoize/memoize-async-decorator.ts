import { iMemoizationOptions } from "../models/memoize";
import { Memoize } from "./memoize";
import { MemoizeAsync } from "./memoize-async";

export function MemoizeAsyncMethod(memoizationOptions?: iMemoizationOptions) {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        /*const original = descriptor.value;
        descriptor.value = MemoizeAsync(
            original.bind(target),
            memoizationOptions
        );*/

        /*let thisRef: any;
        const original = descriptor.value;
        const memoized = Memoize((...args: any[]) => {
            return original.apply(thisRef, args);
        }, memoizationOptions);
        descriptor.value = function(...args: any[]) {
            thisRef = this;
            return memoized(...args);
        }*/

        let thisRef: any;
        const original = descriptor.value;
        const memoized = MemoizeAsync((...args: any[]) => {
            return original.apply(thisRef, args);
        }, memoizationOptions);

        descriptor.value = function(...args: any[]) {
            thisRef = this;
            return memoized(...args);
        }
    };
}
