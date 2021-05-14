import { Lock } from "./lock";

export function LockArguments(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    descriptor.value = function (...params: Array<any>) {
        params = params.map((item) => Lock(item));
        original.apply(this, params);
    };
}
