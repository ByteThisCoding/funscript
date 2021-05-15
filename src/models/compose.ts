export type iCompose = <FirstFuncParams extends any[], ReturnType>(
    firstFunc: (...params: FirstFuncParams) => any,
    ...additionalFuncs: Function[]
) => (...params: FirstFuncParams) => ReturnType;

export type iComposeAsync = <FirstFuncParams extends any[], ReturnType>(
    firstFunc: (...params: FirstFuncParams) => any,
    ...additionalFuncs: Function[]
) => (...params: FirstFuncParams) => Promise<ReturnType>;
