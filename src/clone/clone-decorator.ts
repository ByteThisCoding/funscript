import { Clone } from "./clone";

export function CloneArguments(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const original = descriptor.value;
    descriptor.value = function (...params: Array<any>) {
        params = params.map((item) => Clone(item));
        original.apply(this, params);
    };
}
