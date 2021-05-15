export type iCollectPendingInvocations = <ParamsType extends any[], ReturnType>(
    func: (...params: ParamsType) => Promise<ReturnType>
) => (...params: ParamsType) => Promise<ReturnType>;
