import { CollectPendingInvocations } from "./collect-pending-invocations";

export function CollectPendingMethodInvocations(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const targetMethod = descriptor.value;
    descriptor.value = CollectPendingInvocations(targetMethod);
    return descriptor;
}
