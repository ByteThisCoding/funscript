import { FunAr } from "../fun-ar/fun-ar";
import { iCompose, iComposeAsync } from "../models/compose";

export const Compose: iCompose =
    <FirstFuncParams extends any[], ReturnType>(
        firstFunc: (...params: FirstFuncParams) => any,
        ...additionalFuncs: Function[]
    ) =>
    (...params: FirstFuncParams): ReturnType => {
        const firstFuncResponse = firstFunc(...params);
        return additionalFuncs.reduce((arg, fn) => {
            return fn(arg);
        }, firstFuncResponse) as ReturnType;
    };

export const ComposeAsync: iComposeAsync =
    <FirstFuncParams extends any[], ReturnType>(
        firstFunc: (...params: FirstFuncParams) => any,
        ...additionalFuncs: Function[]
    ) =>
    async (...params: FirstFuncParams): Promise<ReturnType> => {
        const firstFuncResponse = await firstFunc(...params);
        return FunAr.async.seq.reduce(
            additionalFuncs,
            (arg, fn) => {
                return fn(arg);
            },
            firstFuncResponse
        ) as Promise<ReturnType>;
    };
